# Issue tracker：GitHub

本仓库使用 GitHub Issues 跟踪 issues 和 PRD。在当前 clone 中执行 issue 操作时，使用 `gh` CLI；`gh` 应当能够根据 `git remote -v` 自动推断仓库。

外部 pull requests 不作为本仓库的 triage 输入面处理。

## 约定

- 创建 issue：`gh issue create --title "..." --body "..."`
- 读取 issue：`gh issue view <number> --comments`
- 列出 issues：`gh issue list --state open --json number,title,body,labels,comments`
- 评论 issue：`gh issue comment <number> --body "..."`
- 添加 label：`gh issue edit <number> --add-label "..."`
- 移除 label：`gh issue edit <number> --remove-label "..."`
- 关闭 issue：`gh issue close <number> --comment "..."`

## 当 skill 要求 "publish to the issue tracker"

创建一个 GitHub issue。

## 当 skill 要求 "fetch the relevant ticket"

运行 `gh issue view <number> --comments`。
