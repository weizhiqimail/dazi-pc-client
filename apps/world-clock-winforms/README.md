# 世界时钟（WinForms）

一个面向 Windows 10/11 的原生多时区桌面时钟。使用 .NET 8、C# 和 WinForms 开发，不依赖 Electron、Node.js 或第三方 UI 框架。

## 功能

- 同时显示上海、东京、纽约、芝加哥、洛杉矶、伦敦和巴黎时间。
- 显示当地日期和 24 小时时间。
- 自动处理美国和欧洲夏令时。
- 显示城市相对基准城市的时差。
- 支持横向或纵向排列。
- 支持简体中文和 English。
- 支持窗口透明度、位置锁定和始终置顶。
- 支持桌面左侧、右侧和顶部边缘吸附。
- 支持系统托盘、关闭到托盘和单实例运行。
- 使用传统、简洁的 Windows 桌面 UI。

## 快速开始

进入本项目目录后执行一键构建：

```powershell
cd .\apps\world-clock-winforms
.\build.ps1
```

完成后运行：

```text
dist/1.0.0/portable-single-file/Dazi.WorldClock.exe
```

完整的开发、测试、单项发布、一键发布和安装包说明见 [BUILD.md](BUILD.md)。

## 使用方法

### 启动和退出

- 双击 `Dazi.WorldClock.exe` 启动。
- 应用采用单实例模式，重复启动只会唤起已有窗口。
- 关闭主窗口会隐藏到系统托盘，不会结束进程。
- 需要从主窗口右键菜单或托盘菜单选择“退出”才能完全退出。

### 主窗口

- 未锁定时，可以按住时钟区域拖动窗口。
- 靠近当前显示器左侧、右侧或顶部时会自动吸附。
- 右键主窗口可以切换布局、透明度、锁定、始终置顶或打开设置。
- 锁定后无法拖动窗口，可以通过右键菜单或托盘菜单解锁。

### 设置

设置窗口可以：

- 启用或停用城市。
- 使用“上移/下移”调整城市顺序。
- 选择基准城市。
- 切换横向或纵向排列。
- 切换简体中文或 English。
- 调整窗口透明度。
- 锁定窗口位置。
- 开启或关闭始终置顶。
- 恢复默认设置。

默认显示上海、东京和纽约。第一个默认城市上海是默认基准城市，基准城市不会额外显示“基准”文字。

## 系统要求

### 运行自包含版

- Windows 10 或 Windows 11 x64。
- 不需要提前安装 .NET。

### 运行框架依赖版

- Windows 10 或 Windows 11 x64。
- 需要安装 .NET 8 Desktop Runtime x64。

不同发行方式的区别见 [BUILD.md 的发行方式说明](BUILD.md#发行方式说明)。

## 项目目录

```text
world-clock-winforms/
├─ Dazi.WorldClock.sln
├─ Directory.Build.props          # 集中管理编译缓存目录
├─ build.ps1                      # 本项目的一键构建入口
├─ README.md                      # 项目说明
├─ BUILD.md                       # 构建与发布说明
├─ src/
│  ├─ Dazi.WorldClock.Core/       # 城市、时区、设置和时间计算逻辑
│  └─ Dazi.WorldClock/            # WinForms 窗口、托盘和程序入口
│     └─ Assets/
│        ├─ world-clock.ico
│        └─ world-clock.png
└─ tests/
   └─ Dazi.WorldClock.Tests/      # 核心逻辑测试程序
```

`src/` 和 `tests/` 中存放的是源码，不是发布产物。编译缓存统一放在本项目 `.build/`，可交付文件统一放在本项目 `dist/`。本项目的构建不依赖仓库根目录脚本或其他子项目。

## 配置文件

用户配置保存在：

```text
%LOCALAPPDATA%\Dazi\WorldClock\settings.json
```

例如：

```text
C:\Users\<用户名>\AppData\Local\Dazi\WorldClock\settings.json
```

配置包括：

- 已启用城市及顺序。
- 基准城市。
- 界面语言。
- 横向或纵向布局。
- 透明度。
- 锁定和始终置顶状态。
- 窗口位置和吸附边缘。

免安装版移动到其他目录后仍使用同一份用户配置。删除应用 EXE 不会自动删除配置。

要恢复初始状态，可以使用设置窗口中的“恢复默认”，或者退出应用后删除 `settings.json`。

## 技术说明

- UI：.NET 8 WinForms。
- 时间来源：本机系统时间。
- 时区换算：`.NET TimeZoneInfo`。
- 配置格式：本地 JSON。
- 平台目标：Windows x64。
- 应用程序集：`Dazi.WorldClock`。

## 相关文档

- [构建与发布手册](BUILD.md)
- [确认版产品需求](../../docs/DESKTOP_WORLD_CLOCK_REQUIREMENTS_CONFIRMED.md)
