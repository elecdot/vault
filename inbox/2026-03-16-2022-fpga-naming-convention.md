---
tags:
  - inspiration
  - chatgpt
  - fpga
  - hardware
  - naming
kind: "resource"
format: "capture"
status: "fleeting"
source: "ChatGPT"
aliases:
  - "FPGA Naming Convention"
---

# FPGA Naming Convention

## Why
Prepare for hardware course design

## Excerpt
> [!quote] ChatGPT reply
> 下面是一套 **FPGA / Vivado 项目常见的工业级命名规范**。这类规范的目标是：
> 
> * **可读性**：团队成员快速理解模块用途
> * **可维护性**：代码规模变大仍然清晰
> * **工具兼容**：避免 Vivado / synthesis / Tcl / Linux 路径问题
> * **自动化友好**：CI、脚本、IP生成等不会出错
> 
> 规则适用于 **Verilog / SystemVerilog / VHDL + Vivado** 环境。
> 
> ---
> 
> # 1. 全局命名规则（基础规则）
> 
> ### 字符限制
> 
> 只使用：
> 
> ```
> [a-z][0-9]_
> ```
> 
> 禁止：
> 
> ```
> -  空格  中文  特殊符号
> ```
> 
> 示例：
> 
> | 名称               | 是否推荐   |
> | ---------------- | ------ |
> | `uart_tx`        | ✅      |
> | `axi_dma_engine` | ✅      |
> | `uart-tx`        | ❌      |
> | `UART_TX`        | ⚠️ 不推荐 |
> 
> 推荐风格：
> 
> ```
> lowercase + underscore
> ```
> 
> 原因：
> 
> * Linux / Git 友好
> * HDL 社区通用
> * 避免 Windows / Linux case 问题
> 
> ---
> 
> # 2. 项目命名（Project Name）
> 
> 格式：
> 
> ```
> <chip>_<project>_<version>
> ```
> 
> 示例：
> 
> ```
> xc7a200t_fft_accelerator_v1
> zcu104_riscv_soc_v2
> ```
> 
> 更简化：
> 
> ```
> fft_accelerator
> riscv_soc
> ```
> 
> 避免：
> 
> ```
> test
> new_project
> project1
> ```
> 
> 这些在团队里很难维护。
> 
> ---
> 
> # 3. 顶层模块（Top Module）
> 
> 顶层模块建议：
> 
> ```
> <project>_top
> ```
> 
> 示例：
> 
> ```
> fft_accelerator_top
> riscv_soc_top
> ethernet_switch_top
> ```
> 
> 原因：
> 
> * 一眼知道是 **synthesis entry**
> * Vivado block design wrapper 也容易区分
> 
> ---
> 
> # 4. RTL 模块命名
> 
> 格式：
> 
> ```
> <function>_<type>
> ```
> 
> 示例：
> 
> ```
> uart_tx
> uart_rx
> axi_dma_engine
> fifo_sync
> fifo_async
> ```
> 
> 常见 suffix：
> 
> | suffix     | 含义   |
> | ---------- | ---- |
> | `_ctrl`    | 控制模块 |
> | `_core`    | 核心算法 |
> | `_engine`  | 执行单元 |
> | `_wrapper` | 包装   |
> | `_bridge`  | 协议桥  |
> | `_arbiter` | 仲裁器  |
> 
> 示例：
> 
> ```
> axi_lite_slave
> axi_stream_fifo
> dma_ctrl
> cache_controller
> ```
> 
> ---
> 
> # 5. Testbench 命名
> 
> 统一规则：
> 
> ```
> tb_<module>
> ```
> 
> 示例：
> 
> ```
> tb_uart_tx
> tb_fifo_async
> tb_axi_dma_engine
> ```
> 
> testbench 文件：
> 
> ```
> tb_uart_tx.sv
> tb_fifo_async.sv
> ```
> 
> 原因：
> 
> * 自动脚本可以批量识别 testbench
> * CI pipeline 方便
> 
> ---
> 
> # 6. 文件命名（File Naming）
> 
> 一个模块 **一个文件**：
> 
> ```
> uart_tx.sv
> uart_rx.sv
> fifo_async.sv
> ```
> 
> 不要：
> 
> ```
> module1.v
> core.v
> logic.v
> ```
> 
> 这些在大型项目会变灾难。
> 
> ---
> 
> # 7. Signal 命名规范
> 
> ## 时钟
> 
> ```
> clk
> clk_sys
> clk_axi
> clk_100m
> ```
> 
> ---
> 
> ## Reset
> 
> ```
> rst_n
> rst_sys_n
> rst_axi_n
> ```
> 
> 推荐：
> 
> ```
> active low reset
> ```
> 
> ---
> 
> ## 输入输出
> 
> | 类型     | 前缀    |
> | ------ | ----- |
> | input  | `i_`  |
> | output | `o_`  |
> | bidir  | `io_` |
> 
> 示例：
> 
> ```
> i_clk
> i_rst_n
> i_data
> o_valid
> o_ready
> ```
> 
> ---
> 
> ## 内部信号
> 
> ```
> r_  register
> w_  wire
> ```
> 
> 示例：
> 
> ```
> r_state
> r_counter
> w_fifo_empty
> ```
> 
> ---
> 
> # 8. FSM 命名
> 
> 状态寄存器：
> 
> ```
> r_state
> ```
> 
> 状态枚举：
> 
> ```
> IDLE
> LOAD
> EXEC
> DONE
> ```
> 
> SystemVerilog 推荐：
> 
> ```systemverilog
> typedef enum logic [1:0] {
>     IDLE,
>     LOAD,
>     EXEC,
>     DONE
> } state_t;
> ```
> 
> ---
> 
> # 9. Parameter / Constant
> 
> 参数：
> 
> ```
> DATA_WIDTH
> ADDR_WIDTH
> FIFO_DEPTH
> ```
> 
> 全大写：
> 
> ```
> localparam DATA_WIDTH = 32;
> ```
> 
> ---
> 
> # 10. AXI / Bus 信号
> 
> 保持 **ARM AXI 标准命名**：
> 
> ```
> s_axi_awaddr
> s_axi_awvalid
> s_axi_awready
> 
> m_axi_wdata
> m_axi_wvalid
> m_axi_wready
> ```
> 
> prefix：
> 
> ```
> s_axi  slave
> m_axi  master
> ```
> 
> ---
> 
> # 11. 目录结构（工业常见）
> 
> ```
> project/
> │
> ├── rtl/
> │   ├── uart_tx.sv
> │   ├── uart_rx.sv
> │   └── fifo_async.sv
> │
> ├── tb/
> │   ├── tb_uart_tx.sv
> │   └── tb_fifo_async.sv
> │
> ├── sim/
> │   └── run_sim.tcl
> │
> ├── constraints/
> │   └── top.xdc
> │
> ├── scripts/
> │   └── build.tcl
> │
> └── vivado/
>     └── project.xpr
> ```
> 
> ---
> 
> # 12. Git / CI 友好规则
> 
> 避免：
> 
> ```
> space
> -
> 中文
> 大写混用
> ```
> 
> 统一：
> 
> ```
> lowercase
> underscore
> ```
> 
> 原因：
> 
> * Linux build server
> * Docker
> * CI pipeline
> * FPGA farm
> 
> ---
> 
> # 13. 工业团队额外规则（很多公司都会加）
> 
> ### 前缀区分模块类型
> 
> ```
> axi_fifo
> axi_dma
> eth_mac
> pcie_dma
> ```
> 
> ### IP wrapper
> 
> ```
> clk_wiz_0_wrapper
> mig_ddr4_wrapper
> ```
> 
> ### Block design
> 
> ```
> system_bd
> soc_bd
> ```
> 
> ---
> 
> # 一套完整示例
> 
> 工程：
> 
> ```
> riscv_soc
> ```
> 
> 结构：
> 
> ```
> rtl/
>     riscv_soc_top.sv
>     riscv_core.sv
>     axi_crossbar.sv
>     uart_tx.sv
>     uart_rx.sv
> 
> tb/
>     tb_riscv_core.sv
> 
> constraints/
>     riscv_soc.xdc
> ```
> 
> ---
> 
> 💡 **一个经验建议（很多 FPGA 新手不知道）**
> 
> **真正工业项目最重要的一条规范其实是：**
> 
> > **signal prefix + consistent hierarchy**
> 
> 比如：
> 
> ```
> i_*
> o_*
> r_*
> w_*
> ```
> 
> 因为大型 FPGA 项目：
> 
> ```
> 100k+ lines
> 1000+ signals
> ```
> 
> 没有 prefix 会非常难 debug。
> 
> ---
> 
> 如果你愿意，我可以再给你一份 **真正 ASIC / 大型 FPGA 团队用的 Verilog style guide**，里面会包括：
> 
> * pipeline register 命名
> * ready/valid handshake
> * CDC 模块规范
> * reset strategy
> * synthesis-friendly coding patterns
> 
> 这套会 **比普通 FPGA 教程更接近真实芯片团队规范**。

## Context
- Date captured: 2026-03-16 20:22
- Prompt: Not captured.
- Conversation link: none

## Related
- none

## Next
- [ ] Distill this into a permanent note
- [ ] Add one concrete link or follow-up
