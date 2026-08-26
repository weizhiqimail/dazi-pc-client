# 系统配置目录

`sys_settings` 用于保存 Dazi Toolkit 的配置文件，不存放缓存、模型、日志和临时文件。

```text
sys_settings/
├─ defaults.json                  程序内置默认值
├─ settings.json                  当前全局设置
├─ shortcuts.json                 全局快捷键
└─ tools/
   └─ markdown-to-html.json       Markdown 转 HTML 工具设置
```

## 配置规则

- 所有配置文件使用 UTF-8 编码。
- 每个文件都包含 `version`，以后配置结构变化时用于迁移。
- JSON 字段使用 camelCase，工具文件名使用 kebab-case。
- 缓存目录可以放在任意位置，但缓存文件本身不要放入本目录。
- 密码、Token、Cookie 等敏感信息不要明文写入这些文件。
- `defaults.json` 只描述默认值；用户修改后的值写入 `settings.json`。

## 配置合并顺序

应用正式接入配置文件后，建议按下面的顺序合并：

```text
defaults.json
  → settings.json
  → tools/<tool-id>.json
```

缺少字段时使用默认值；遇到未知字段时保留但忽略，避免版本升级破坏旧配置。
