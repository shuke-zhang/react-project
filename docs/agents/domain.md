# Domain Docs

Engineering skills 在探索或修改领域行为之前，应当先读取本仓库的领域文档。

## 布局

本仓库使用 single-context 领域文档布局：

```text
/
|-- CONTEXT.md
|-- docs/adr/
`-- src/
```

## 探索前先读取

- 根目录 `CONTEXT.md`：了解本仓库的领域词汇。
- `docs/adr/` 中相关的 ADR：了解会影响当前修改区域的架构决策。

如果这些文件没有覆盖当前主题，静默继续即可。不要仅因为缺少内容就创建新的领域文档；像 `grill-with-docs` 这样的 producer skills 会在术语或决策真正被确定时补充它们。

## 使用 glossary 中的词汇

在 issue 标题、重构提案、假设、测试名称或实现说明中命名领域概念时，使用 `CONTEXT.md` 中定义的术语。避免使用 glossary 明确不推荐的同义词。

## 标明 ADR 冲突

如果某个提议的变更与现有 ADR 冲突，要明确指出，而不是静默覆盖已有决策。
