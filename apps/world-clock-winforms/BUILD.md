# 世界时钟构建与发布手册

本文只说明世界时钟的开发构建、测试、发布产物和安装包。产品功能和使用方法见 [README.md](README.md)。

## 1. 构建说明

### 1.1 开发环境

- Windows 10 或 Windows 11。
- .NET 8 SDK。
- PowerShell 5.1 或 PowerShell 7。
- 可选：Visual Studio 2022，并安装“.NET 桌面开发”工作负载。

检查 SDK：

```powershell
dotnet --info
```

### 1.2 构建入口

根据目的选择以下方式：

| 目的 | 推荐命令 | 输出位置 |
| --- | --- | --- |
| 正式发布全部产物 | `.\build.ps1` | `dist/<版本>/` |
| 本地编译 | `dotnet build` | `.build/` |
| 本地运行 | `dotnet run` | 直接启动应用 |
| 只生成一种发行版 | `dotnet publish ... -o ...` | 指定的 `dist/` 子目录 |

正式发版优先使用本项目根目录的 `build.ps1`。单项命令主要用于开发调试、CI 的独立阶段或排查某一种发布方式。

### 1.3 目录约定

项目源码保持常见的 `src/` 和 `tests/` 结构，但构建结果不会散落在源码目录。

```text
apps/world-clock-winforms/
├─ .build/                        # 编译缓存、中间文件；不可交付
├─ dist/<版本>/                   # 最终发布产物；从这里取文件
├─ build.ps1                      # 本项目构建入口
├─ src/
└─ tests/
```

`Directory.Build.props` 将本解决方案内所有项目的默认 `bin/obj` 集中到本项目 `.build/`。

`.build/` 和 `dist/` 均已加入 `.gitignore`。

## 2. 一次性总构建

### 2.1 默认完整构建

进入 `apps/world-clock-winforms/` 后执行：

```powershell
.\build.ps1
```

从仓库根目录开始的完整命令：

```powershell
Set-Location .\apps\world-clock-winforms
.\build.ps1
```

也可以不切换目录，直接指定脚本路径：

```powershell
& .\apps\world-clock-winforms\build.ps1
```

如果 PowerShell 提示“系统上禁止运行脚本”或 `running scripts is disabled`，可以只为本次进程临时绕过执行策略：

```powershell
powershell.exe `
  -NoProfile `
  -ExecutionPolicy Bypass `
  -File .\apps\world-clock-winforms\build.ps1
```

使用 PowerShell 7 时：

```powershell
pwsh.exe `
  -NoProfile `
  -ExecutionPolicy Bypass `
  -File .\apps\world-clock-winforms\build.ps1
```

这里的 `Bypass` 只作用于新启动的这一次 PowerShell 进程，不会永久修改系统执行策略。不要双击 `.ps1` 文件，因为窗口可能在构建结束或报错后立即关闭，不方便查看输出。

默认版本为 `1.0.0`。脚本依次执行：

1. 顺序还原 Core、WinForms 应用和测试项目。
2. 编译整个 Release 解决方案。
3. 运行核心测试。
4. 生成自包含单文件 EXE。
5. 生成自包含免安装目录版。
6. 生成框架依赖目录版。
7. 生成对应 ZIP 包。
8. 生成 SHA256 校验文件。

### 2.2 指定版本

```powershell
.\build.ps1 -Version 1.2.0
```

版本必须采用 `主版本.次版本.修订号` 形式，也可以包含预发布后缀，例如：

```powershell
.\build.ps1 -Version 1.2.0-beta.1
```

### 2.3 可选参数

跳过测试：

```powershell
.\build.ps1 -Version 1.2.0 -SkipTests
```

保留已有同版本目录，不执行构建前清理：

```powershell
.\build.ps1 -Version 1.2.0 -KeepExisting
```

说明：

- 正式发布不建议使用 `-SkipTests`。
- 默认会安全清理 `dist/<版本>/`，避免旧文件混入新包。
- `-KeepExisting` 适合临时排查，不建议用于正式发布。
- 脚本只构建当前世界时钟项目，不读取或构建其他子项目。

### 2.4 总构建输出

```text
dist/1.0.0/
├─ portable-single-file/
│  ├─ Dazi.WorldClock.exe
│  └─ Dazi.WorldClock.pdb
├─ portable-folder/
│  ├─ Dazi.WorldClock.exe
│  └─ ...自包含运行时文件
├─ framework-dependent/
│  ├─ Dazi.WorldClock.exe
│  └─ ...应用程序集文件
├─ Dazi.WorldClock-1.0.0-win-x64-single-file.zip
├─ Dazi.WorldClock-1.0.0-win-x64-portable.zip
├─ Dazi.WorldClock-1.0.0-win-x64-framework-dependent.zip
└─ SHA256SUMS.txt
```

普通用户优先使用：

```text
portable-single-file/Dazi.WorldClock.exe
```

或者：

```text
Dazi.WorldClock-1.0.0-win-x64-single-file.zip
```

## 3. 单个构建

本节命令默认在 `apps/world-clock-winforms/` 中执行。

### 3.1 还原依赖

解决方案包含共享 Core 项目。为避免部分环境中并行 Solution Restore 争用临时文件，推荐顺序还原：

```powershell
dotnet restore .\src\Dazi.WorldClock.Core\Dazi.WorldClock.Core.csproj
dotnet restore .\src\Dazi.WorldClock\Dazi.WorldClock.csproj -r win-x64
dotnet restore .\tests\Dazi.WorldClock.Tests\Dazi.WorldClock.Tests.csproj
```

### 3.2 Debug 构建

```powershell
dotnet build .\Dazi.WorldClock.sln `
  -c Debug `
  --maxcpucount:1
```

输出：

```text
.build/bin/Dazi.WorldClock/Debug/net8.0-windows/win-x64/
```

### 3.3 Release 构建

```powershell
dotnet build .\Dazi.WorldClock.sln `
  -c Release `
  --maxcpucount:1
```

输出：

```text
.build/bin/Dazi.WorldClock/Release/net8.0-windows/win-x64/
```

### 3.4 开发运行

```powershell
dotnet run --project .\src\Dazi.WorldClock\Dazi.WorldClock.csproj
```

应用采用单实例模式。如果已有实例正在运行，新命令只会唤起现有实例。

### 3.5 运行测试

构建并运行：

```powershell
dotnet run `
  --project .\tests\Dazi.WorldClock.Tests\Dazi.WorldClock.Tests.csproj `
  -c Release
```

已经完成 Release 构建时：

```powershell
dotnet run `
  --project .\tests\Dazi.WorldClock.Tests\Dazi.WorldClock.Tests.csproj `
  -c Release `
  --no-build
```

测试成功时返回退出码 `0`，失败时返回非零退出码。

### 3.6 自包含单文件 EXE

目标机器不需要安装 .NET，是推荐的免安装方式。

```powershell
dotnet publish .\src\Dazi.WorldClock\Dazi.WorldClock.csproj `
  -c Release `
  -r win-x64 `
  --self-contained true `
  -p:PublishSingleFile=true `
  -p:IncludeNativeLibrariesForSelfExtract=true `
  -o .\dist\manual\single-file-win-x64
```

输出：

```text
dist/manual/single-file-win-x64/Dazi.WorldClock.exe
```

单文件体积较大，因为其中包含 .NET 运行时和 WinForms 组件。

### 3.7 自包含目录版

目标机器不需要安装 .NET，但分发时必须保留目录中的全部文件。

```powershell
dotnet publish .\src\Dazi.WorldClock\Dazi.WorldClock.csproj `
  -c Release `
  -r win-x64 `
  --self-contained true `
  -p:PublishSingleFile=false `
  -o .\dist\manual\portable-win-x64
```

输出：

```text
dist/manual/portable-win-x64/
```

### 3.8 框架依赖目录版

文件较小，但目标机器必须安装 .NET 8 Desktop Runtime x64。

```powershell
dotnet publish .\src\Dazi.WorldClock\Dazi.WorldClock.csproj `
  -c Release `
  -r win-x64 `
  --self-contained false `
  -p:PublishSingleFile=false `
  -o .\dist\manual\framework-dependent-win-x64
```

### 3.9 框架依赖单文件版

入口文件较少，但目标机器仍需安装 .NET 8 Desktop Runtime。

```powershell
dotnet publish .\src\Dazi.WorldClock\Dazi.WorldClock.csproj `
  -c Release `
  -r win-x64 `
  --self-contained false `
  -p:PublishSingleFile=true `
  -o .\dist\manual\framework-dependent-single-file-win-x64
```

## 4. 发行方式说明

| 发行方式 | 需要安装 .NET | 是否需要安装应用 | 优点 | 缺点 |
| --- | --- | --- | --- | --- |
| 自包含单文件 | 否 | 否 | 一个 EXE，分发最方便 | 文件较大 |
| 自包含目录版 | 否 | 否 | 文件结构清晰，便于诊断 | 必须完整复制目录 |
| 框架依赖版 | 是 | 否 | 产物较小 | 用户需预装运行时 |
| 安装向导 EXE | 通常否 | 是 | 面向普通用户、可创建快捷方式 | 需要额外安装器工程 |
| MSI | 通常否 | 是 | 适合企业部署和静默安装 | 配置和维护成本较高 |

注意：`dotnet publish` 输出的 `Dazi.WorldClock.exe` 是应用程序，不是 Setup 安装向导。

## 5. ZIP 免安装包

推荐直接使用总构建脚本生成 ZIP。如果只想手动压缩单文件版：

```powershell
Compress-Archive `
  -Path .\dist\manual\single-file-win-x64\Dazi.WorldClock.exe `
  -DestinationPath .\dist\manual\Dazi.WorldClock-win-x64-portable.zip `
  -Force
```

用户解压后直接运行 `Dazi.WorldClock.exe`。

## 6. 安装向导 EXE

.NET SDK 不直接生成带安装向导的 Setup EXE。需要使用 Inno Setup、NSIS 或 WiX Burn。

推荐后续采用 Inno Setup，并让本项目 `build.ps1` 统一调用。

建议安装行为：

- 按当前用户安装到 `%LOCALAPPDATA%\Programs\Dazi World Clock`。
- 不要求管理员权限。
- 创建开始菜单快捷方式。
- 可选创建桌面快捷方式。
- 注册卸载信息。
- 卸载时默认保留用户配置。

建议安装脚本位置：

```text
apps/world-clock-winforms/packaging/inno/world-clock.iss
```

安装 Inno Setup 后的命令形式：

```powershell
& "C:\Program Files (x86)\Inno Setup 6\ISCC.exe" `
  .\packaging\inno\world-clock.iss
```

建议输出：

```text
dist/<版本>/installer-exe/Dazi.WorldClock-Setup-x64.exe
```

当前仓库尚未包含 `.iss` 安装脚本，本机也没有检测到 Inno Setup，因此总构建暂不生成安装向导 EXE。

## 7. MSI 安装包

MSI 适合企业软件分发、组策略和静默安装。推荐使用 WiX Toolset。

建议 WiX 工程位置：

```text
apps/world-clock-winforms/packaging/wix/
```

WiX v4+ 的命令形式：

```powershell
wix build `
  .\packaging\wix\Package.wxs `
  -arch x64 `
  -out .\dist\manual\msi\Dazi.WorldClock-x64.msi
```

静默安装：

```powershell
msiexec /i .\dist\manual\msi\Dazi.WorldClock-x64.msi /qn /norestart
```

静默卸载：

```powershell
msiexec /x .\dist\manual\msi\Dazi.WorldClock-x64.msi /qn /norestart
```

当前仓库尚未包含 WiX 工程，本机也没有检测到 WiX Toolset，因此总构建暂不生成 MSI。

正式增加 MSI 前还需确定：

- 正式产品名称和厂商名称。
- 产品版本策略。
- 固定的 UpgradeCode。
- 按用户还是按机器安装。
- 升级、降级和卸载策略。
- 代码签名证书。

## 8. 版本与命名

建议正式版本采用语义化版本：

```text
1.0.0
1.1.0
2.0.0-beta.1
```

建议发行文件名：

```text
Dazi.WorldClock-1.0.0-win-x64-single-file.zip
Dazi.WorldClock-1.0.0-win-x64-portable.zip
Dazi.WorldClock-1.0.0-Setup-x64.exe
Dazi.WorldClock-1.0.0-x64.msi
```

## 9. SHA256 校验

总构建会生成：

```text
dist/<版本>/SHA256SUMS.txt
```

手工验证某个文件：

```powershell
Get-FileHash `
  -LiteralPath .\dist\1.0.0\portable-single-file\Dazi.WorldClock.exe `
  -Algorithm SHA256
```

## 10. 代码签名

未签名的 EXE、Setup EXE 或 MSI 在其他电脑上运行时可能触发 Windows SmartScreen。

正式发行应使用可信代码签名证书和 Windows SDK 的 `signtool.exe`：

```powershell
signtool sign `
  /fd SHA256 `
  /td SHA256 `
  /tr <时间戳服务器地址> `
  /f <证书文件路径> `
  .\dist\1.0.0\portable-single-file\Dazi.WorldClock.exe
```

不要把证书、私钥或密码提交到仓库。

## 11. 清理

普通 MSBuild 清理：

```powershell
dotnet clean .\Dazi.WorldClock.sln
```

删除本项目统一编译缓存时，在项目目录执行：

```powershell
Remove-Item -LiteralPath .\.build -Recurse -Force
```

删除世界时钟全部发布产物：

```powershell
Remove-Item -LiteralPath .\dist -Recurse -Force
```

执行递归删除前，必须确认当前目录是 `apps/world-clock-winforms` 且目标路径正确。

## 12. 常见问题

### 12.1 双击后没有出现第二个窗口

应用只允许一个实例运行。检查系统托盘，或再次运行 EXE 唤起已有实例。

### 12.2 发布时无法覆盖 EXE

旧版世界时钟可能仍在运行。先从托盘菜单退出，再重新发布。

### 12.3 提示缺少 .NET Desktop Runtime

当前运行的是框架依赖版。安装 .NET 8 Desktop Runtime x64，或者改用自包含版。

### 12.4 `NETSDK1047`

对应的 Windows x64 运行时资产尚未还原：

```powershell
dotnet restore .\src\Dazi.WorldClock\Dazi.WorldClock.csproj -r win-x64
```

然后重新发布。

### 12.5 `NU1301`

构建环境无法访问 NuGet。首次构建自包含版时，SDK 可能需要下载 Windows x64 运行时包。检查网络、代理和 NuGet 源。

### 12.6 Assembly 特性重复

从旧的项目内 `obj/` 切换到集中 `.build/` 时，残留生成文件可能造成重复特性。当前 `Directory.Build.props` 已全局排除历史 `bin/obj`。如仍遇到问题，可安全删除各项目旧的 `bin/obj` 后重试。

## 13. 当前构建能力

- [x] Debug 和 Release 编译。
- [x] 自动化核心测试。
- [x] 一条命令生成全部现有产物。
- [x] 自包含单文件 EXE。
- [x] 自包含目录版。
- [x] 框架依赖目录版。
- [x] ZIP 免安装包。
- [x] SHA256 校验文件。
- [ ] 安装向导 EXE 工程。
- [ ] MSI/WiX 工程。
- [ ] 自动代码签名。
- [ ] CI 自动发布。
