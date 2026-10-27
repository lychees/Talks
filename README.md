# Talks

> Selected public talks.
>
> 公开演讲与分享。

## Presented

| 日期 | 活动 | 演讲 | 资料 |
| --- | --- | --- | --- |
| 2026.10.23 | Unreal Fest 2026 | **眩晕瘫坐？一句话生成 3A 游戏：哪些是真的哪些是假的**<br>Feihu Tang · Moonshot AI | [幻灯片源码](packages/2026-10-23-unreal-fest-one-prompt-3a-games/slides.md) · [完整视频（bilibili）](https://www.bilibili.com/video/BV1xtnY6REby/) |

## 本地运行

需要 Node.js 24 和 pnpm。

```bash
pnpm install
pnpm dev
```

构建静态网站：

```bash
pnpm build
```

生成适用于 `/Talks/` 路径的完整 GitHub Pages 网站（含演讲索引首页）：

```bash
pnpm build-base
```

GitHub Pages 首页：<https://lychees.github.io/Talks/>。推送到 `main` 后由 GitHub Actions 自动部署。

幻灯片位于 `packages/2026-10-23-unreal-fest-one-prompt-3a-games/`。页面图像保留了原始 PowerPoint 的版式，8 段嵌入演示视频可在对应页面直接播放；完整演讲录像见 [B 站](https://www.bilibili.com/video/BV1xtnY6REby/)。

原始 PowerPoint 使用 Git LFS 保存，可[下载原文件](https://github.com/lychees/Talks/blob/main/%E7%9C%A9%E6%99%95%E7%98%AB%E5%9D%90%EF%BC%9F%E4%B8%80%E5%8F%A5%E8%AF%9D%E7%94%9F%E6%88%90_3A_%E6%B8%B8%E6%88%8F_%E5%93%AA%E4%BA%9B%E6%98%AF%E7%9C%9F%E7%9A%84%E5%93%AA%E4%BA%9B%E6%98%AF%E5%81%87%E7%9A%84.pptx)。克隆后如需获取 LFS 文件，请运行 `git lfs pull`。

使用 [Slidev](https://sli.dev/) 构建，项目组织方式参考 [nekomeowww/talks](https://github.com/nekomeowww/talks)。
