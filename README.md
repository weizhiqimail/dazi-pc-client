# Dazi Desktop Apps

包含多个彼此隔离的桌面应用。不同技术架构各自管理依赖、构建配置和发布产物，仓库根目录不作为 Node.js 或 .NET 应用项目。

## 子项目

| 项目 | 技术 | 状态 |
| --- | --- | --- |
| [世界时钟](apps/world-clock-winforms/README.md) | .NET 8 WinForms | 开发中 |

## 仓库约定

- 每个应用位于 `apps/<项目名>/`。
- 每个应用有独立 README 和构建入口。
- 不同技术栈之间不共享依赖目录或构建配置。
- 跨项目产品与设计文档统一放在 `docs/`。

世界时钟的确认需求见 [Windows 原生多时区时钟需求说明](docs/DESKTOP_WORLD_CLOCK_REQUIREMENTS_CONFIRMED.md)。
