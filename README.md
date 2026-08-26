# Dazi Toolkit

一个面向桌面工具箱的 Electron 基础工程，目前只包含项目骨架和交互实验场，不包含任何实际工具功能。

## 开发

```bash
npm install
npm start
```

其他命令：

```bash
npm run typecheck
npm run lint
npm test
npm run package
```

## 目录

```text
src/
├─ main/       Electron 主进程，只处理窗口和系统能力
├─ preload/    经过限制的桌面 API 边界
├─ renderer/
│  ├─ assets/      渲染层图片、图标、字体等静态资源
│  ├─ components/  一目录一个通用组件
│  ├─ config/      页面、偏好、Storage key 和交互常量
│  ├─ helpers/     不依赖 React 的纯函数
│  ├─ pages/       一目录一个页面
│  ├─ router/      一级、二级路由表与 Hash Router
│  ├─ styles/      全局 Less 主题变量与基础重置
│  └─ types/       渲染层共享类型
└─ shared/     跨进程类型与协议
```

`renderer/App.tsx` 是路由外壳，`renderer/app.less` 是它的样式文件。应用使用 Hash Router，以兼容 Electron 打包后的 `file` 协议。renderer 内跨目录导入统一使用 `@/`，其中 `@` 指向 `src/renderer`。

组件和页面目录统一采用下面的结构：

```text
ComponentName/
├─ index.tsx    唯一组件及目录入口
├─ styles.less  组件私有样式
├─ types.ts     可选的公开类型
├─ config.ts    可选的组件配置
└─ children/    可选的子组件目录
```

## 交互原则

- 保持桌面软件的信息密度，不采用后台管理系统式大卡片布局。
- 原生窗口行为、键盘、右键、拖放和焦点状态是一等能力。
- 高频命令直接显示，低频命令进入菜单。
- 轻量操作使用 Toast，当前工作相关信息保留在页面中。
- 长任务必须呈现进度，并允许暂停或取消。
- 尊重系统的减少动态、深浅主题和平台快捷键偏好。
