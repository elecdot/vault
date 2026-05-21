# I2C-JY901/MPU9250 数据采集 IP 开发设计书 v1.0

> 说明：本设计只从普遍正确角度考虑，具体实现时应当参照具体硬件、软件集成要求。

> 资料：
>- [JY901 documentation and example code](./JY901/)

---

## 1. 项目背景与设计目标

本项目属于“智能睡眠监测辅助系统”的体动/翻身检测子模块。系统需要周期性读取九轴模块输出的加速度、角速度和姿态角数据，并将这些数据提供给 PS 侧软件，用于判断用户睡眠过程中的翻身次数、体动幅度和睡眠稳定性。

课程指导书要求项目包含系统设计、IP 的具体设计与实现、硬件驱动程序开发和应用程序实现；Zynq 平台中 PS 与 PL 之间通过 AXI 接口互联，适合将底层传感器时序放在 PL 侧、将上层算法放在 PS 侧。 你们选题表中也已经规划了“MPU9250 对应 I2C IP”，并要求各个自定义 IP 挂接到 AXI 总线，由 PS 侧通过寄存器读写调用。

本 IP 的最终目标是：

```text
JY-901 九轴模块
    ↓ IIC
PL 自定义 I2C-JY901 IP
    ↓ AXI4-Lite
PS / PYNQ Python 驱动
    ↓
翻身检测、显示、socket 发送、睡眠分析
```

---

## 2. 设计范围

### 2.1 必须实现

本 IP 需要实现：

1. I2C Master 控制器。
2. JY-901 寄存器连续读取。
3. 数据缓存到 AXI4-Lite 可读寄存器。
4. PS 侧可通过 AXI 寄存器配置采样周期、I2C 地址、读取起始寄存器和读取长度。
5. PS 侧可通过 Python MMIO 驱动读取原始数据和换算后的物理量。
6. 提供 `busy / done / data_valid / ack_error / timeout` 等状态位，方便调试。
7. 支持自动周期采样和单次采样两种模式。

### 2.2 第一版暂不实现

第一版不建议实现这些功能：

1. 多主机仲裁。
2. I2C clock stretching。
3. 10-bit I2C 地址。
4. DMA。
5. FIFO 大缓存。
6. 中断驱动。
7. 磁场校准、陀螺仪校准命令的完整自动流程。

这些功能可以作为第二版扩展。第一版的核心是：**稳定从 JY-901 读出数据并通过 AXI 给 PS 使用**。

---

## 3. 硬件平台与连接方案

### 3.1 开发板

开发板：PYNQ-Z1
主芯片：Zynq-7020
开发方式：Vivado 创建自定义 IP，PYNQ Python 通过 Overlay/MMIO 调用。

### 3.2 JY-901 模块引脚

JY-901 手册给出的 IIC 相关引脚为：

| JY-901 引脚 | 功能                |
| --------- | ----------------- |
| VCC       | 模块电源，3.3V 或 5V 输入 |
| GND       | 地                 |
| SCL       | I2C 时钟线           |
| SDA       | I2C 数据线           |

JY-901 手册明确说明：模块的 IIC 总线是 **开漏输出**，连接 MCU 时需要通过 **4.7k 电阻上拉到 VCC**。

### 3.3 推荐接线

为了保护 PYNQ-Z1 的 PL IO，推荐全部按 3.3V 体系连接：

| JY-901 | PYNQ-Z1     |
| ------ | ----------- |
| VCC    | 3V3         |
| GND    | GND         |
| SCL    | Arduino SCL |
| SDA    | Arduino SDA |

PYNQ-Z1 的 Arduino 接口中，`SCL` 对应 Zynq 管脚 `P16`，`SDA` 对应 Zynq 管脚 `P15`。 PYNQ-Z1 的 shield IOREF 接到 3.3V 电源轨，数字 IO 推荐最高工作电压为 3.4V，因此不要把 IIC 上拉到 5V。

### 3.4 XDC 约束

```tcl
set_property PACKAGE_PIN P16 [get_ports i2c_scl]
set_property IOSTANDARD LVCMOS33 [get_ports i2c_scl]

set_property PACKAGE_PIN P15 [get_ports i2c_sda]
set_property IOSTANDARD LVCMOS33 [get_ports i2c_sda]
```

如果后续 Vivado 对三态端口处理不稳定，可以显式例化 `IOBUF`。

---

## 4. JY-901 IIC 协议分析

### 4.1 从机地址

JY-901 使用 7-bit IIC 地址，默认地址为：

```text
0x50
```

因此：

```text
写地址字节 = 0x50 << 1 | 0 = 0xA0
读地址字节 = 0x50 << 1 | 1 = 0xA1
```

注意：手册示例中出现“默认地址 0x51，发送 0xA1”的表述，工程实现时应理解为 **读地址字节 `0xA1`**，不是 7-bit 从机地址 `0x51`。真正应写入 IP 的 7-bit 地址仍然是 `0x50`。手册也明确写了 IIC 地址默认是 `0x50`，并且最大不能超过 `0x7F`。

### 4.2 IIC 写入格式

JY-901 写寄存器格式为：

```text
START
IICAddr << 1
RegAddr
Data1L
Data1H
(JY-901 automatically inc RegAddr is not "STOP")
Data2L
Data2H
...
STOP
```

每个寄存器是 16 位，写入顺序是 **低字节在前，高字节在后**。

When each data complete, slave will drive sda low as ACK.

### 4.3 IIC 读取格式

JY-901 读取寄存器格式为：

```text
START
(IICAddr << 1) | 0
RegAddr
RESTART
(IICAddr << 1) | 1
Data1L
Data1H
Next Bit (master ACK the return by drive SDA low, if not, there are no more data needed) 这个时候可能为了一个下降沿而先拉高，I2C 协议里面这个可能是 “Changes” 即可
Data2L
Data2H
...
STOP
```

读取时，同样是 **低字节在前，高字节在后**。主机接收每个字节后应答 ACK，最后一个字节后发送 NACK，然后 STOP。

---

## 5. 需要读取的 JY-901 寄存器

JY-901 手册的寄存器表中，体动检测最重要的是 `0x34` 到 `0x40` 这一段。

| RegAddr | 符号    | 含义     |
| ------: | ----- | ------ |
|  `0x34` | AX    | X 轴加速度 |
|  `0x35` | AY    | Y 轴加速度 |
|  `0x36` | AZ    | Z 轴加速度 |
|  `0x37` | GX    | X 轴角速度 |
|  `0x38` | GY    | Y 轴角速度 |
|  `0x39` | GZ    | Z 轴角速度 |
|  `0x3A` | HX    | X 轴磁场  |
|  `0x3B` | HY    | Y 轴磁场  |
|  `0x3C` | HZ    | Z 轴磁场  |
|  `0x3D` | Roll  | X 轴角度  |
|  `0x3E` | Pitch | Y 轴角度  |
|  `0x3F` | Yaw   | Z 轴角度  |
|  `0x40` | TEMP  | 模块温度   |

第一版推荐读取：

```text
起始寄存器：0x34
读取数量：13 个 16-bit word
总字节数：26 字节
```

这样一次 burst 可以得到：

```text
AX, AY, AZ,
GX, GY, GZ,
HX, HY, HZ,
Roll, Pitch, Yaw,
TEMP
```

如果第一版想更简单，可以只读 `0x34~0x39`，也就是加速度和角速度，共 6 个 word、12 字节。

---

## 6. 数据格式与换算

JY-901 输出的每个寄存器是 16 位有符号整数。读取时低字节先到，高字节后到：

```text
raw = (DataH << 8) | DataL
```

如果最高位为 1，需要转换为有符号数：

```python
def to_int16(v):
    v &= 0xFFFF
    return v - 0x10000 if v & 0x8000 else v
```

换算公式：

```text
加速度(g)     = raw / 32768 * 16
角速度(°/s)   = raw / 32768 * 2000
角度(°)       = raw / 32768 * 180
温度(℃)       = raw / 100
```

JY-901 手册给出了量程：加速度 ±16g、角速度 ±2000°/s、角度 ±180°。

---

## 7. 总体架构设计

### 7.1 模块划分

建议将 IP 拆成 4 个子模块：

```text
axi_i2c_jy901_v1_0
├── axi_lite_regs.v
│   ├── AXI4-Lite 寄存器读写
│   ├── 控制寄存器
│   ├── 状态寄存器
│   └── 数据寄存器
│
├── jy901_sampler.v
│   ├── 单次采样触发
│   ├── 自动周期采样
│   ├── JY-901 burst read 事务调度
│   └── 原始数据写入数据寄存器
│
├── i2c_master_core.v
│   ├── START / RESTART / STOP
│   ├── 发送 8 bit
│   ├── 接收 8 bit
│   ├── ACK / NACK
│   └── 错误检测
│
└── i2c_open_drain_io.v
    ├── SCL 开漏三态控制
    └── SDA 开漏三态控制
```

### 7.2 数据流

```text
PS 写 CTRL.oneshot_start 或 CTRL.auto_mode
        ↓
jy901_sampler 生成一次 burst read 请求
        ↓
i2c_master_core 执行 IIC 读取
        ↓
接收 26 字节
        ↓
组合成 13 个 signed 16-bit raw data
        ↓
写入 AXI 数据寄存器
        ↓
STATUS.data_valid = 1
        ↓
PS 读取 AX / AY / AZ / ...
```

---

## 8. AXI4-Lite 寄存器设计

### 8.1 控制寄存器区

|   地址偏移 | 名称              | 方向  |    默认值 | 说明                  |
| -----: | --------------- | --- | -----: | ------------------- |
| `0x00` | `CTRL`          | R/W |  `0x0` | 控制寄存器               |
| `0x04` | `STATUS`        | R   |  `0x0` | 状态寄存器               |
| `0x08` | `DEV_ADDR`      | R/W | `0x50` | JY-901 7-bit IIC 地址 |
| `0x0C` | `START_REG`     | R/W | `0x34` | burst 起始寄存器         |
| `0x10` | `WORD_COUNT`    | R/W |   `13` | 读取 16-bit word 数量   |
| `0x14` | `SAMPLE_PERIOD` | R/W |    可配置 | 自动采样周期              |
| `0x18` | `I2C_CLKDIV`    | R/W |    可配置 | I2C 时钟分频            |
| `0x1C` | `ERROR_CODE`    | R   |  `0x0` | 错误码                 |
| `0x20` | `CFG_REG_ADDR`  | R/W |  `0x0` | 配置写寄存器地址            |
| `0x24` | `CFG_DATA`      | R/W |  `0x0` | 配置写入 16-bit 数据      |
| `0x28` | `VERSION`       | R   |    固定值 | IP 版本号              |

### 8.2 `CTRL` 位定义

| bit | 名称                | 说明               |
| --: | ----------------- | ---------------- |
|   0 | `enable`          | IP 使能            |
|   1 | `oneshot_start`   | 启动一次采样，写 1 触发    |
|   2 | `auto_mode`       | 自动周期采样模式         |
|   3 | `clear_done`      | 清除 done 标志       |
|   4 | `clear_error`     | 清除错误标志           |
|   5 | `soft_reset`      | 软件复位采样器和 IIC 状态机 |
|   8 | `cfg_write_start` | 启动一次配置写入         |

### 8.3 `STATUS` 位定义

| bit | 名称           | 说明            |
| --: | ------------ | ------------- |
|   0 | `busy`       | 当前正在执行 IIC 事务 |
|   1 | `done`       | 最近一次事务完成      |
|   2 | `data_valid` | 数据寄存器中已有有效采样  |
|   3 | `ack_error`  | 从机未应答         |
|   4 | `timeout`    | 等待超时          |
|   5 | `cfg_done`   | 配置写完成         |
|   6 | `scl_in`     | 当前 SCL 输入实际电平 |
|   7 | `sda_in`     | 当前 SDA 输入实际电平 |

### 8.4 数据寄存器区

|   地址偏移 | 名称           | 内容         |
| -----: | ------------ | ---------- |
| `0x40` | `AX_RAW`     | X 轴加速度 raw |
| `0x44` | `AY_RAW`     | Y 轴加速度 raw |
| `0x48` | `AZ_RAW`     | Z 轴加速度 raw |
| `0x4C` | `GX_RAW`     | X 轴角速度 raw |
| `0x50` | `GY_RAW`     | Y 轴角速度 raw |
| `0x54` | `GZ_RAW`     | Z 轴角速度 raw |
| `0x58` | `HX_RAW`     | X 轴磁场 raw  |
| `0x5C` | `HY_RAW`     | Y 轴磁场 raw  |
| `0x60` | `HZ_RAW`     | Z 轴磁场 raw  |
| `0x64` | `ROLL_RAW`   | X 轴角度 raw  |
| `0x68` | `PITCH_RAW`  | Y 轴角度 raw  |
| `0x6C` | `YAW_RAW`    | Z 轴角度 raw  |
| `0x70` | `TEMP_RAW`   | 温度 raw     |
| `0x74` | `SAMPLE_CNT` | 成功采样次数     |

---

## 9. I2C Master 具体设计

### 9.1 开漏输出

IIC 的 SCL/SDA 不能主动输出高电平，只能拉低或释放：

```verilog
assign i2c_scl = scl_drive_low ? 1'b0 : 1'bz;
assign i2c_sda = sda_drive_low ? 1'b0 : 1'bz;

assign scl_in = i2c_scl;
assign sda_in = i2c_sda;
```

可能问题：

* 如果你写成 `assign i2c_sda = sda_out;`，会主动输出 1，高概率违反 IIC 开漏约定。
* 如果没有外部上拉，释放后总线不会回到高电平，IIC 永远失败。
* 如果上拉到 5V，可能损坏 PYNQ-Z1 PL IO。

Troubleshooting (Cause is still unknown):
```debug
但 routed DRC 报了 RPBF-3 IO port buffering is incomplete，并点名 i2c_scl/i2c_sda。实现日志还显示 Vivado 给这两个端口插了 OBUF，不是完整双向 buffer。这很符合 STATUS=0x0：AXI 寄存器能读，但 I2C pad 输入侧没有被正确接回 RTL。
```
**fix**:
```verilog
`ifdef SYNTHESIS
    IOBUF #(
        .DRIVE(12),
        .IBUF_LOW_PWR("TRUE"),
        .IOSTANDARD("LVCMOS33"),
        .SLEW("SLOW")
    ) u_i2c_scl_iobuf (
        .I(1'b0),
        .O(scl_in),
        .T(~scl_drive_low),
        .IO(i2c_scl)
    );

    IOBUF #(
        .DRIVE(12),
        .IBUF_LOW_PWR("TRUE"),
        .IOSTANDARD("LVCMOS33"),
        .SLEW("SLOW")
    ) u_i2c_sda_iobuf (
        .I(1'b0),
        .O(sda_in),
        .T(~sda_drive_low),
        .IO(i2c_sda)
    );
`else
    assign i2c_scl = scl_drive_low ? 1'b0 : 1'bz;
    assign i2c_sda = sda_drive_low ? 1'b0 : 1'bz;

    assign scl_in = i2c_scl;
    assign sda_in = i2c_sda;
`endif
```

### 9.2 I2C 时钟

第一版推荐：

```text
SCL = 100 kHz
```

调通后再尝试：

```text
SCL = 400 kHz
```

如果 AXI 时钟是 100 MHz，将一个 SCL 周期分成 4 个 phase：

```text
phase 0: SCL low，准备 SDA
phase 1: SCL low，保持 SDA
phase 2: SCL high，采样 SDA
phase 3: SCL high，保持
```
Explain:
````markdown
1. **I²C 的基本时序要求**
   - 在 SCL 为低电平时，SDA 可以变化（START/STOP 除外）。
   - 在 SCL 为高电平时，SDA **必须稳定**，从机在这个阶段采样数据。
   
2. **如果我们仅仅使用一个简单的计数器去翻转 SCL**  
   会产生一个问题：当 SCL 翻转的同时，SDA 也要变化，很难保证 SDA 在 SCL 高电平时已经彻底稳定。  
   ➡️ 因此需要把 SCL 低电平和高电平**各自再细分**，让 SCL 变化和 SDA 变化错开半个 phase。

3. **为什么是 4 个 phase？**
   - `phase 0`：**SCL 低电平的前半段**——在这个阶段**可以改变 SDA**（准备要发送的数据位），这样等到 phase 1 时 SDA 已经稳定了。
   - `phase 1`：**SCL 低电平的后半段**——SDA 保持不变，SCL 依然为低。接收方可以在这个阶段检测到稳定的 SDA 状态。
   - `phase 2`：**SCL 高电平的前半段**——SDA 已经稳定，SCL 变为高电平，从机在这个阶段**采样 SDA**。
   - `phase 3`：**SCL 高电平的后半段**——SDA 继续保持不变，SCL 保持高电平，完成高电平周期的剩余时间。

   这样，**SCL 的高低电平各分两段**，加起来正好 4 个 phase。  
   每个 phase 的持续时间由 `I2C_CLKDIV` 计数器控制（例如 250 个 AXI 时钟周期），于是一个完整的 SCL 周期就是 `4 × I2C_CLKDIV` 个 AXI 时钟周期。

4. **实际对应的波形**
   ```
   phase:    0      1      2      3      0
   SCL:     LOW----LOW----HIGH---HIGH---LOW
   SDA:     准备    稳定    采样    保持    准备下一个 bit
   ```
   - 发送时，在 phase 0 更新 SDA，phase 2 让从机采样。
   - 接收时，在 phase 2 捕获 SDA 值，phase 0 准备 ACK/NACK。

这种 4‑phase 设计完全源自 I²C 协议要求，并且**与 `I2C_CLKDIV` 的计算公式强绑定**（一个 SCL 周期 = 4×I2C_CLKDIV 个主时钟），因此调整 `I2C_CLKDIV` 就可以精确控制 SCL 频率，而不用改变状态机的结构。
100 kHz 时：
````

```text
100 MHz / 100 kHz / 4 = 250
```

所以：

```text
I2C_CLKDIV = 250
```

如果实际 AXI 时钟不是 100 MHz，要重新计算。这个参数必须做成寄存器，不要写死。

### 9.3 I2C 字节发送

发送一个字节流程：

```text
bit_cnt = 7 downto 0
SCL low 时设置 SDA
SCL high 时从机采样
8 bit 发送完成
释放 SDA
SCL high 时读取 ACK
如果 SDA = 0，则 ACK
如果 SDA = 1，则 NACK / error
```

### 9.4 I2C 字节接收

接收一个字节流程：

```text
释放 SDA
bit_cnt = 7 downto 0
SCL high 时采样 SDA
接收 8 bit
如果不是最后一个字节，主机发送 ACK：拉低 SDA
如果是最后一个字节，主机发送 NACK：释放 SDA
```

---

## 10. JY-901 burst read 状态机

推荐状态机：

```text
S_IDLE
S_WAIT_PERIOD
S_START
S_SEND_ADDR_W
S_ACK_ADDR_W
S_SEND_REG_ADDR
S_ACK_REG_ADDR
S_RESTART
S_SEND_ADDR_R
S_ACK_ADDR_R
S_READ_BYTE
S_MASTER_ACK
S_MASTER_NACK
S_STOP
S_LATCH_DATA
S_DONE
S_ERROR
```
**notes**:
````markdown
下面详细解读这段用于 JY-901 的 burst read 状态机，并说明它与 I²C 时序、i2c_master_core 交互的方式。

---

## 状态机总览

```
S_IDLE
S_WAIT_PERIOD
S_START               → 产生 START 条件
S_SEND_ADDR_W         → 发送“设备地址 + W(0)”
S_ACK_ADDR_W          → 检查从机对地址的应答
S_SEND_REG_ADDR       → 发送起始寄存器地址（如 0x34）
S_ACK_REG_ADDR        → 检查从机对寄存器地址的应答
S_RESTART             → 产生 RESTART 条件
S_SEND_ADDR_R         → 发送“设备地址 + R(1)”
S_ACK_ADDR_R          → 检查从机对地址的应答
S_READ_BYTE           → 接收一个字节
S_MASTER_ACK          → 主机发送 ACK，继续读取下一个字节
S_MASTER_NACK         → 主机发送 NACK，表示这是最后一个字节
S_STOP                → 产生 STOP 条件
S_LATCH_DATA          → 把接收到的字节拼接成 16-bit 数据并写入寄存器
S_DONE                → 完成标志
S_ERROR               → 错误处理
```

---

## 逐状态详解

### 1. S_IDLE
- **状态说明**：空闲，等待触发。
- **进入条件**：复位后，或事务完成后回到此状态。
- **触发条件**：当 `oneshot_start` 或 `auto_mode` 启动且 `enable` 有效时，跳转到 `S_WAIT_PERIOD`（如果自动模式下需要等待采样周期）或直接到 `S_START`。

### 2. S_WAIT_PERIOD
- **目的**：在自动采样模式下，每次采样之间保持间隔。
- **动作**：计数器递减，直到计满 `SAMPLE_PERIOD` 后跳转到 `S_START`。
- 单次采样模式通常跳过此状态。

### 3. S_START
- **I²C 操作**：产生 START 条件——在 SCL 高电平时将 SDA 从高拉到低。
- **实现方式**：通过 i2c_master_core 的控制信号，设置 `scl_drive_low`、`sda_drive_low` 的状态，实现标准的 START 时序。
- **下一状态**：无条件转到 `S_SEND_ADDR_W`。

### 4. S_SEND_ADDR_W
- **动作**：向 i2c_master_core 发出“发送一个字节”的命令，字节内容为 `{DEV_ADDR[6:0], 1'b0}`（即 0xA0）。
- **i2c_master_core** 会执行 9.3 节描述的字节发送流程，包括 8 个数据位和 ACK 检测。
- **下一状态**：`S_ACK_ADDR_W`，在字节发送完成后，检查从机是否应答。

### 5. S_ACK_ADDR_W
- **检查 ACK**：i2c_master_core 输出 `ack` 信号。如果 `ack == 1`（即 SDA 被从机拉低），说明设备在线，跳转到 `S_SEND_REG_ADDR`；如果 `ack == 0`（NACK），跳转到 `S_ERROR`，并设置 `STATUS.ack_error` 和错误码。
- 这是关键的地址检测步骤，能捕获设备未连接或地址错误。

### 6. S_SEND_REG_ADDR
- **动作**：发送要读取的起始寄存器地址，例如 `0x34`。i2c_master_core 再次进入字节发送流程。
- **下一状态**：`S_ACK_REG_ADDR`，等待 ACK。

### 7. S_ACK_REG_ADDR
- **检查 ACK**：若从机应答，跳到 `S_RESTART`；否则跳到 `S_ERROR`（寄存器地址无效或设备异常）。

### 8. S_RESTART
- **I²C 操作**：产生 RESTART 条件。实际就是在不发送 STOP 的情况下，再次生成一个 START 条件（SCL 高，SDA 由高到低）。
- **目的**：I²C 复合读取格式要求“写寄存器地址→RESTART→读数据”。
- **实现**：i2c_master_core 需支持 RESTART 模式，即在未产生 STOP 时再输出 START 序列。
- **下一状态**：`S_SEND_ADDR_R`。

### 9. S_SEND_ADDR_R
- **动作**：发送“设备地址 + R(1)”，即 `{DEV_ADDR, 1'b1}`（0xA1）。
- **下一状态**：`S_ACK_ADDR_R`。

### 10. S_ACK_ADDR_R
- **检查 ACK**：若从机应答，则准备进入数据循环，跳转到 `S_READ_BYTE`；否则报错。

### 11. S_READ_BYTE
- **动作**：i2c_master_core 切换到接收模式，按 9.4 节描述接收一个字节（8 个数据位）。接收完成后，`rx_byte` 有效。
- **数据暂存**：接收到的字节存入一个临时缓冲区（如一个移位寄存器或队列），同时字节计数器加 1。
- **判断结束条件**：
  - 如果已经接收了 `WORD_COUNT * 2` 个字节，那么当前这个字节就是最后一个，下一状态转到 `S_MASTER_NACK`。
  - 如果不是最后一个字节，则下一状态为 `S_MASTER_ACK`。
- 注意：字节计数从 0 开始，总字节数 = `WORD_COUNT * 2`（因为每个寄存器 16 位 = 2 字节）。

### 12. S_MASTER_ACK
- **动作**：主机在接收到一个字节后，在 ACK 时钟周期把 SDA 拉低，告诉从机“继续发送下一个字节”。
- **实现**：i2c_master_core 在接收完成后，在第 9 个时钟将 `sda_drive_low` 置 1（即 ACK）。
- **下一状态**：回到 `S_READ_BYTE`，继续接收下一字节。

### 13. S_MASTER_NACK
- **动作**：当接收到最后一个字节后，主机**不拉低 SDA**（释放 SDA = 高电平），告诉从机“结束传输”。
- **下一状态**：`S_STOP`。

### 14. S_STOP
- **I²C 操作**：产生 STOP 条件——在 SCL 高电平时，SDA 从低拉到高。
- **下一状态**：`S_LATCH_DATA`。

### 15. S_LATCH_DATA
- **数据整理**：将接收到的字节流按顺序拼接成 16-bit 字，并写入对应的 AXI 数据寄存器（AX_RAW、AY_RAW……）。
  - 拼接规则：`{buf[1], buf[0]}` 形成第一个寄存器 AX，`{buf[3], buf[2]}` 形成 AY，依此类推。
- **同时**可更新 `SAMPLE_CNT` 计数器和 `STATUS.data_valid` 标志。
- **下一状态**：`S_DONE`。

### 16. S_DONE
- **设置** `STATUS.done` 为 1，并可清除 `busy`。
- **等待** PS 侧清除 `done` 标志（通过写 `CTRL.clear_done`），然后回到 `S_IDLE` 或 `S_WAIT_PERIOD`（如果自动模式）。
- 如果处于自动采样模式，则自动重新进入 `S_WAIT_PERIOD`。

### 17. S_ERROR
- **错误处理**：设置相应的错误标志（`STATUS.ack_error`、`STATUS.timeout`）和 `ERROR_CODE`。
- **可能动作**：强制发 STOP，释放 SDA/SCL，进入空闲，等待 PS 清除错误（通过 `CTRL.clear_error`）或软件复位。
- **恢复**：通常在 PS 清除错误后回到 `S_IDLE`。
---

## 完整的事务序列（以 26 字节为例）

```
START (0xA0) ACK 0x34 ACK RESTART (0xA1) ACK
 B0 ACK B1 ACK B2 ACK ... B24 ACK B25 NACK STOP LATCH
```

状态机路径：
```
S_IDLE → S_START → S_SEND_ADDR_W → S_ACK_ADDR_W 
→ S_SEND_REG_ADDR → S_ACK_REG_ADDR → S_RESTART → S_SEND_ADDR_R → S_ACK_ADDR_R
→ S_READ_BYTE (字节0) → S_MASTER_ACK
→ S_READ_BYTE (字节1) → S_MASTER_ACK
...
→ S_READ_BYTE (字节24) → S_MASTER_ACK
→ S_READ_BYTE (字节25) → S_MASTER_NACK → S_STOP → S_LATCH_DATA → S_DONE
```

---

## 与 i2c_master_core 的配合

- **i2c_master_core** 负责任务级的 I²C 时序：START、STOP、发送字节、接收字节、ACK/NACK。
- **jy901_sampler**（状态机所在模块）调用这些底层操作，并根据返回值决定下一状态。
- 例如，`S_SEND_ADDR_W` 会输出 `start_send` 信号和要发送的字节到 i2c_master_core，i2c_master_core 完成发送后返回 `done` 和 `ack`，状态机再进入 `S_ACK_ADDR_W` 检查结果。

---

## 错误处理路径

1. **地址 NACK**：`S_ACK_ADDR_W` 检测到 NACK → `S_ERROR`，可记录 `ACK_ADDR_W_ERROR`。
2. **寄存器地址 NACK**：`S_ACK_REG_ADDR` → `S_ERROR`。
3. **读地址 NACK**：`S_ACK_ADDR_R` → `S_ERROR`。
4. **timeout**：在字节传输或等待 ACK 时，i2c_master_core 检测到 SCL/SDA 被拉死超时，输出 timeout 信号，状态机进入 `S_ERROR`。

所有错误都会让状态机进入安全的 `S_IDLE`，等待软件清除。

---

## 总结

这个状态机设计完整地实现了 I²C 的复合读取协议，状态划分清晰，每个状态对应 I²C 总线上的一个具体动作或判断节点。它与 i2c_master_core 分工明确：**sampler 负责读事务的调度和数据流控制，master_core 负责位级时序和 ACK 检测**。这种分层大大降低了每次调试的复杂度，也符合第一版“稳定读取、可调试”的目标。

````

### 10.1 正常读取事务

以从 `0x34` 连续读 26 字节为例：

```text
START
0xA0
ACK
0x34
ACK
RESTART
0xA1
ACK
byte0  -> ACK
byte1  -> ACK
...
byte24 -> ACK
byte25 -> NACK
STOP
```

### 10.2 数据整理

假设读出的 byte buffer 为：

```text
buf[0]  = AX_L
buf[1]  = AX_H
buf[2]  = AY_L
buf[3]  = AY_H
...
```

则：

```verilog
AX <= {buf[1], buf[0]};
AY <= {buf[3], buf[2]};
AZ <= {buf[5], buf[4]};
```

依此类推。

---

## 11. 配置写功能设计

第一版可以先不做配置写，但建议预留接口。

JY-901 写配置格式：

```text
START
0xA0
RegAddr
DataL
DataH
STOP
```

例如修改回传速率、LED、IIC 地址等都属于配置写。JY-901 手册提到 IIC 地址可通过寄存器修改，默认 `0x50`，设置完成后需保存配置并重新上电。

建议第一版只实现一个通用函数：

```text
write_word(reg_addr, data16)
```

PS 侧驱动写：

```python
ip.write(CFG_REG_ADDR, reg_addr)
ip.write(CFG_DATA, data16)
ip.write(CTRL, CFG_WRITE_START)
```

---

## 12. Python 驱动设计

### 12.1 驱动目标

Python 驱动负责：

1. 加载 Overlay。
2. 找到 AXI IP 的物理地址。
3. 配置 JY-901 IIC 地址、起始寄存器、读取长度。
4. 启动自动采样。
5. 读取 raw 数据。
6. 换算为物理量。
7. 提供给翻身检测算法。

### 12.2 驱动类设计

```python
from pynq import Overlay, MMIO
import time

class JY901I2C:
    CTRL          = 0x00
    STATUS        = 0x04
    DEV_ADDR      = 0x08
    START_REG     = 0x0C
    WORD_COUNT    = 0x10
    SAMPLE_PERIOD = 0x14
    I2C_CLKDIV    = 0x18
    ERROR_CODE    = 0x1C

    AX_RAW        = 0x40
    AY_RAW        = 0x44
    AZ_RAW        = 0x48
    GX_RAW        = 0x4C
    GY_RAW        = 0x50
    GZ_RAW        = 0x54
    HX_RAW        = 0x58
    HY_RAW        = 0x5C
    HZ_RAW        = 0x60
    ROLL_RAW      = 0x64
    PITCH_RAW     = 0x68
    YAW_RAW       = 0x6C
    TEMP_RAW      = 0x70
    SAMPLE_CNT    = 0x74

    CTRL_ENABLE   = 1 << 0
    CTRL_ONESHOT  = 1 << 1
    CTRL_AUTO     = 1 << 2
    CTRL_CLR_DONE = 1 << 3
    CTRL_CLR_ERR  = 1 << 4
    CTRL_SOFT_RST = 1 << 5

    def __init__(self, bitfile, ip_name):
        self.overlay = Overlay(bitfile)
        ip = self.overlay.ip_dict[ip_name]
        self.mmio = MMIO(ip["phys_addr"], ip["addr_range"])

    @staticmethod
    def _to_int16(v):
        v &= 0xFFFF
        return v - 0x10000 if v & 0x8000 else v

    def configure(self, dev_addr=0x50, start_reg=0x34,
                  word_count=13, sample_period=10_000_000,
                  i2c_clkdiv=250):
        self.mmio.write(self.DEV_ADDR, dev_addr & 0x7F)
        self.mmio.write(self.START_REG, start_reg & 0xFF)
        self.mmio.write(self.WORD_COUNT, word_count & 0xFF)
        self.mmio.write(self.SAMPLE_PERIOD, sample_period)
        self.mmio.write(self.I2C_CLKDIV, i2c_clkdiv)

    def clear_flags(self):
        self.mmio.write(self.CTRL, self.CTRL_CLR_DONE | self.CTRL_CLR_ERR)

    def start_auto(self):
        self.mmio.write(self.CTRL, self.CTRL_ENABLE | self.CTRL_AUTO)

    def stop(self):
        self.mmio.write(self.CTRL, 0)

    def oneshot(self, timeout=0.1):
        self.clear_flags()
        self.mmio.write(self.CTRL, self.CTRL_ENABLE | self.CTRL_ONESHOT)

        t0 = time.time()
        while time.time() - t0 < timeout:
            st = self.mmio.read(self.STATUS)
            done = (st >> 1) & 1
            err = ((st >> 3) & 1) or ((st >> 4) & 1)
            if done:
                return True
            if err:
                raise RuntimeError(f"I2C error, STATUS=0x{st:08X}")
            time.sleep(0.001)

        raise TimeoutError("JY901 oneshot timeout")

    def read_raw(self):
        st = self.mmio.read(self.STATUS)
        if ((st >> 2) & 1) == 0:
            return None

        return {
            "ax": self._to_int16(self.mmio.read(self.AX_RAW)),
            "ay": self._to_int16(self.mmio.read(self.AY_RAW)),
            "az": self._to_int16(self.mmio.read(self.AZ_RAW)),
            "gx": self._to_int16(self.mmio.read(self.GX_RAW)),
            "gy": self._to_int16(self.mmio.read(self.GY_RAW)),
            "gz": self._to_int16(self.mmio.read(self.GZ_RAW)),
            "hx": self._to_int16(self.mmio.read(self.HX_RAW)),
            "hy": self._to_int16(self.mmio.read(self.HY_RAW)),
            "hz": self._to_int16(self.mmio.read(self.HZ_RAW)),
            "roll": self._to_int16(self.mmio.read(self.ROLL_RAW)),
            "pitch": self._to_int16(self.mmio.read(self.PITCH_RAW)),
            "yaw": self._to_int16(self.mmio.read(self.YAW_RAW)),
            "temp": self._to_int16(self.mmio.read(self.TEMP_RAW)),
            "sample_cnt": self.mmio.read(self.SAMPLE_CNT),
        }

    def read_scaled(self):
        d = self.read_raw()
        if d is None:
            return None

        return {
            "ax_g": d["ax"] / 32768.0 * 16.0,
            "ay_g": d["ay"] / 32768.0 * 16.0,
            "az_g": d["az"] / 32768.0 * 16.0,

            "gx_dps": d["gx"] / 32768.0 * 2000.0,
            "gy_dps": d["gy"] / 32768.0 * 2000.0,
            "gz_dps": d["gz"] / 32768.0 * 2000.0,

            "roll_deg": d["roll"] / 32768.0 * 180.0,
            "pitch_deg": d["pitch"] / 32768.0 * 180.0,
            "yaw_deg": d["yaw"] / 32768.0 * 180.0,

            "temp_c": d["temp"] / 100.0,
            "sample_cnt": d["sample_cnt"],
        }
```

### 12.3 使用示例

```python
imu = JY901I2C(
    bitfile="/home/xilinx/pynq/overlays/sleep/sleep.bit",
    ip_name="axi_iic_jy901_0"
)

imu.configure(
    dev_addr=0x50,
    start_reg=0x34,
    word_count=13,
    sample_period=10_000_000,
    i2c_clkdiv=250
)

imu.start_auto()

while True:
    data = imu.read_scaled()
    if data is not None:
        print(data["ax_g"], data["ay_g"], data["az_g"], data["roll_deg"])
    time.sleep(0.1)
```

---

## 13. 翻身检测接口设计

IP 本身不直接判断翻身，IP 只提供稳定数据。翻身检测放在 PS 侧 Python 中更合适。

### 13.1 输入数据

```text
ax_g, ay_g, az_g
roll_deg, pitch_deg, yaw_deg
```

### 13.2 第一版算法

可以先用姿态变化阈值：

```python
def is_turn(prev, cur, angle_th=35.0, accel_th=0.45):
    if prev is None:
        return False

    d_roll = abs(cur["roll_deg"] - prev["roll_deg"])
    d_pitch = abs(cur["pitch_deg"] - prev["pitch_deg"])
    d_yaw = abs(cur["yaw_deg"] - prev["yaw_deg"])

    da = abs(cur["ax_g"] - prev["ax_g"]) \
       + abs(cur["ay_g"] - prev["ay_g"]) \
       + abs(cur["az_g"] - prev["az_g"])

    return max(d_roll, d_pitch, d_yaw) > angle_th or da > accel_th
```

### 13.3 防抖

翻身不是单个采样点，而是一个动作过程。建议加入冷却时间：

```python
last_turn_time = 0
cooldown = 5.0
```

检测到一次翻身后，5 秒内不重复计数。

---

## 14. Vivado 集成流程

### 14.1 创建 IP

1. 新建 Vivado 工程，器件选择 `xc7z020clg400-1`。
2. 创建 RTL 文件：

   * [axi_i2c_jy901_v1_0.v](../rtl/i2c_mpu9250/axi_i2c_jy901_v1_0.v)
   * [axi_lite_regs.v](../rtl/i2c_mpu9250/axi_lite_regs.v)
   * [jy901_sampler.v](../rtl/i2c_mpu9250/jy901_sampler.v)
   * [i2c_master_core.v](../rtl/i2c_mpu9250/i2c_master_core.v)
   * [i2c_open_drain_io.v](../rtl/i2c_mpu9250/i2c_open_drain_io.v)
3. 完成行为仿真。
4. 使用 `Create and Package New IP` 封装 IP。

### 14.2 Block Design

加入：

```text
ZYNQ7 Processing System
AXI Interconnect 或 SmartConnect
Processor System Reset
axi_i2c_jy901_0
ILA，可选
```

连接：

```text
Zynq M_AXI_GP0 -> AXI Interconnect -> axi_i2c_jy901 S_AXI
FCLK_CLK0      -> axi_i2c_jy901 s00_axi_aclk
FCLK_RESET0_N  -> proc_sys_reset
proc reset     -> axi_i2c_jy901 resetn
i2c_scl/sda    -> Make External
```

### 14.3 生成 bitstream

1. Validate Design。
2. Generate Output Products。
3. Create HDL Wrapper。
4. Synthesis。
5. Implementation。
6. Generate Bitstream。
7. 导出 `.bit` 和 `.hwh` 到 PYNQ。

---

## 15. 仿真计划

### 15.1 I2C 位级仿真

检查：

* START：SCL 高电平期间，SDA 从高到低。
* STOP：SCL 高电平期间，SDA 从低到高。
* SDA 只会拉低或释放，不主动拉高。
* SCL 频率符合 `I2C_CLKDIV`。

### 15.2 ACK 仿真

构造一个简单 I2C slave model：

* 地址为 `0x50` 时 ACK。
* 地址错误时 NACK。
* 收到 `0x34` 后连续输出预设数据。

测试预期：

```text
DEV_ADDR = 0x50
START_REG = 0x34
WORD_COUNT = 13
```

结果：

```text
STATUS.done = 1
STATUS.data_valid = 1
STATUS.ack_error = 0
AX_RAW 等数据寄存器正确
```

### 15.3 错误路径仿真

故意设置：

```text
DEV_ADDR = 0x51
```

预期：

```text
STATUS.ack_error = 1
ERROR_CODE = ACK_ADDR_W_ERROR
```

---

## 16. 上板调试计划

### 16.1 最小上板测试

第一步只测试 I2C ACK：

```text
DEV_ADDR = 0x50
START_REG = 0x34
WORD_COUNT = 1
oneshot_start = 1
```

如果 ACK 正常，说明：

* 供电基本正确。
* SCL/SDA 管脚基本正确。
* 地址基本正确。
* 上拉基本正确。

### 16.2 ILA 信号

建议接入 ILA 的信号：

```text
state
byte_cnt
bit_cnt
phase_cnt
scl_drive_low
sda_drive_low
scl_in
sda_in
tx_byte
rx_byte
ack_error
timeout
done
data_valid
```

### 16.3 逻辑分析仪

如果有外部逻辑分析仪，抓：

```text
SCL
SDA
```

检查是否出现：

```text
0xA0 0x34 0xA1 ...
```

---

## 17. 可能遇到的问题与定位方法

| 问题                | 现象               | 可能原因                    | 解决方法                            |
| ----------------- | ---------------- | ----------------------- | ------------------------------- |
| 一直 NACK           | `ack_error=1`    | 地址错，把 `0xA1` 当 7-bit 地址 | `DEV_ADDR` 写 `0x50`             |
| 总线一直低             | SCL/SDA 不回高      | 没有上拉、电路短路、IP 一直拉低       | 加 4.7k 上拉到 3.3V，检查三态控制          |
| 板子异常或重启           | 上电后不稳定           | IIC 上拉到 5V 或接线短路        | 改为 3.3V 上拉，检查线序                 |
| 读到数据全 0 或全 F      | 数据线未释放或读取时序错     | read bit 阶段仍在驱动 SDA     | 接收期间必须释放 SDA                    |
| 数据数值极大            | 正负数错误            | raw 没有按 int16 解释        | 使用 `to_int16()`                 |
| AX/AY/AZ 轴不符合预期   | 轴向理解错            | 模块安装方向与算法坐标不一致          | 重新标定安装方向                        |
| 角度跳变              | yaw 跨越 ±180°     | 角度周期边界                  | 翻身算法优先用 roll/pitch 或做角度 unwrap  |
| 自动采样数据不变          | 采样太快或模块输出率低      | JY-901 默认输出/更新率可能较低     | 自动采样周期先设 100 ms                 |
| Vivado 报 inout 错误 | 综合/实现三态异常        | 层级内三态未推到顶层              | 在顶层端口或 IOBUF 中实现三态              |
| Python 找不到 IP     | `ip_dict` 没有目标名  | IP 名称不一致或 hwh 没同步       | `.bit` 与 `.hwh` 同名同目录           |
| 读到新旧数据混杂          | PS 正在读时 PL 更新寄存器 | 数据寄存器没有锁存策略             | 更新完成后一次性 latch，或加 sample_cnt 检查 |
| 速度升到 400k 后失败     | 100k 正常，400k 不正常 | 上拉太弱、线太长、时序裕量不足         | 保持 100k 或降低上拉阻值到 2.2k           |

---

## 18. 验收标准

第一阶段验收：

```text
1. ILA 能看到完整 IIC 读事务。
2. STATUS.done 能置位。
3. STATUS.ack_error 为 0。
4. SAMPLE_CNT 持续增加。
5. AX/AY/AZ 数据随模块姿态变化。
```

第二阶段验收：

```text
1. Python 能周期性读取 ax_g / ay_g / az_g。
2. 翻转模块时 roll/pitch/yaw 变化合理。
3. 翻身检测函数能对明显姿态变化计数。
4. 数据能进入系统主循环并参与显示或 socket 发送。
```

第三阶段验收：

```text
1. 连续运行 10 分钟无 IIC 死锁。
2. 拔掉模块后能报 ack_error 或 timeout，而不是卡死。
3. 重新接入模块后 soft_reset 可恢复。
```

---

## 19. 推荐开发顺序

按这个顺序做，风险最低：

```text
Step 1：单独写 i2c_master_core
Step 2：仿真 START / STOP / 发送字节 / ACK
Step 3：加入 I2C slave model，仿真连续读
Step 4：写 jy901_sampler，固定读 0x34 起始的 26 字节
Step 5：加入 AXI 寄存器层
Step 6：封装 IP
Step 7：Block Design 集成
Step 8：上板读 1 个 word
Step 9：上板读 13 个 word
Step 10：写 Python 驱动
Step 11：接入翻身检测
```

---

## 20. 最终设计结论

本设计采用 **PL 侧自定义 I2C-JY901 采集 IP + AXI4-Lite 寄存器接口 + PS 侧 Python 驱动** 的结构。PL 端负责稳定产生 IIC 时序并批量读取 JY-901 数据，PS 端负责数据换算、翻身判断和系统集成。该方案符合课程要求中“自定义 IP + 硬件驱动 + 应用程序”的实现路径，也符合你们项目中“多传感器数据经 IP 核传输到 PS 侧进行睡眠分析”的总体架构。

第一版的核心交付物应是：

```text
1. axi_i2c_jy901_v1_0 自定义 IP
2. I2C burst read 状态机
3. AXI 数据寄存器映射
4. PYNQ Python MMIO 驱动
5. JY-901 上板读取演示
6. 翻身检测接口函数
```

这样完成后，你的 I2C IP 就不是“能跑一下的实验代码”，而是一个可以写进设计报告、可以集成进整体系统、也能支撑答辩说明的完整模块。
