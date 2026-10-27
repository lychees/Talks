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

生成适用于 `/Talks/` 路径的静态网站：

```bash
pnpm build-base
```

幻灯片位于 `packages/2026-10-23-unreal-fest-one-prompt-3a-games/`。页面图像保留了原始 PowerPoint 的版式，8 段嵌入演示视频可在对应页面直接播放；完整演讲录像见 [B 站](https://www.bilibili.com/video/BV1xtnY6REby/)。

使用 [Slidev](https://sli.dev/) 构建，项目组织方式参考 [nekomeowww/talks](https://github.com/nekomeowww/talks)。
