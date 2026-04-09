---
tags:
  - lab
  - fpga
  - vivado
  - hardware
kind: project
format: note
project: "[[hardware-design]]"
source: "[[instructions-book.pdf#page=53]]"
aliases:
  - vivado tutorial
  - vitis tutorial
  - hardware design tutorial
  - Vivado hands-on tutorial
---

# Tutorial

## Focus

Class hands-on tutorial. Aim to get familiar with basic [[Vivado]].

[[instructions-book.pdf#page=50|Overview]]

## Notes

### Create a project

1. `Create Project`
2. [[2026-03-16-2022-fpga-naming-convention|FPGA Naming Convention]]
>[!tldr] Do not use `-` in any prefix
3. Create project subdirectory
4. Select `Parts`/`Boards`

`APduino`:
```
xc7z020clg484-1
```
`PYNQ-Z1`:
```
xc7z020clg400-1
```

>[!tip] If you are using `PYNQ-Z1` you can also select `Board`. 
>[[instructions-book.pdf#page=56]]

5. Done

### Configure default editor

>[!error] You can't just select Visual Studio Code in settings due to the format of the `--goto` parameter invoked by [[Vivado]] in VSCode is inconsistent with the format expected by the VSCode version.
>```powershell
> ❯ code -g "P:/labs/hardware_design/ultrasonic/src/ultrasonic.v":23 
> Arguments in `--goto` mode should be in the format of `FILE(:LINE(:CHARACTER))`.
>```

See `tools/`

### Set as top

>[!note] This assume you have added a least one design source and matched simulation source (You may want this simulation source as top then).

Sources 窗口中 Simulation Sources 目录下文件名呈加粗显示的  为当前的顶层模块

### Simulation

`SIMULATION -> Run Simulation -> Run Behavioral Simulation`

- Vivado 支持多阶段仿真(行为/综合/实现)
[[instructions-book.pdf#page=65]]
- 加入/删除信号
>选中 Scope 窗口中的 Ultrasonic_inst 模块,在 Objects 窗口中的 state[2:0]对象上点击鼠标右键,在出  现的快捷菜单中点击 Add to Wave Window,将该信号加入右侧的波形窗口。可以用此方法继续加入其他  感兴趣的信号,也可按 Delete 键将选中的信号波形删除。
- 仿真时间
>选择上侧工具栏
- 关闭仿真窗口


### Hardware testbench (Block Design)

[[instructions-book.pdf#page=68]]
`IP INTEGRATOR -> Create Block Design -> Add Module to Block Design -> ports and links -> Create HDL Wrapper`
>[!note] 将.v 文件作为模块直接插入 Block Design  在 Vivado 中,
>作为 IP 集成器,Block Design 中不仅可以添加 IP 核,还可以将未封装成 IP 的.v 或.vhd  文件作为模块直接插入其中。  这种不封装直接插入模块的方式适用于电路调试阶段,可以灵活地修改源程序,保存源程序后会自  动弹出 Refresh Changed Modules 按钮,点击即可更新原理图中的模块符号。用户可以将通过此方法调  试好的模块再封装成 IP 核。

- 双击设置
- "Make External"
- IP Catalog
	- Constant IP （常量输入）
	- ila `ILA(Intergrated Logic Analyzer))` [[instructions-book.pdf#page=72|ILA]]
- "Create Wrapper"

### Synthesis

![[instructions-book.pdf#page=77|Follow the full manual]]

### Create and Package IP

![[instructions-book.pdf#page=86|Follow the full manual]]

### ILA Configure

![[instructions-book.pdf#page=118|Follow the full manual]]

### Vitis

Seems Vitis is not work on PYNQ board tho...

## Related

- [[hardware-design]]

## Next
- [ ] Clarify one related concept
- [ ] Link this note to a summary, reference, or follow-up note
