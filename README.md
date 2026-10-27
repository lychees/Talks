# Talks

> Selected public talks.
>
> 公开演讲与分享。

## Presented

按演讲时间倒序排列；时段均为北京时间（UTC+8）。

| 时间 | 活动 | 演讲 | 资料 |
| --- | --- | --- | --- |
| 2026.10.22 · 时段待确认 | Unreal Fest 2026 | **眩晕瘫坐？一句话生成 3A 游戏：哪些是真的哪些是假的**<br>Feihu Tang · Moonshot AI | [幻灯片源码](packages/2026-10-23-unreal-fest-one-prompt-3a-games/slides.md) · [完整视频（bilibili）](https://www.bilibili.com/video/BV1xtnY6REby/) · [活动官网](https://www.unrealengine.com/unreal-fest?lang=zh-CN) · [相关报道](https://www.taptap.cn/moment/863322876667758591?group_id=162660) |
| 2026.10.16 · 14:35–15:10 | GOSIM Shenzhen | **开源大模型端侧推理性能优化与 Agent 协同**<br>Minako Kojima · Moonshot AI | [Google Slides](https://docs.google.com/presentation/d/1ZbJXLxvCHTbNorHw-DN89hVl5xzKgrcs_1YY2ZerD08/edit?usp=sharing) · [原始 PPTX](https://docs.google.com/presentation/d/1ZbJXLxvCHTbNorHw-DN89hVl5xzKgrcs_1YY2ZerD08/export/pptx?usp=sharing) · [完整视频（bilibili）](https://www.bilibili.com/video/BV1qYnL6tEiv) · [活动官网](https://shenzhen2026.gosim.org/zh/schedule/p-204-optimization-of-edge-side-inference-performance-for-open-source-large-models-and-collaboration-between-agents/) · [相关报道](https://www.21ic.com/a/1014890.html) |
| 2026.10.16 · 11:35–12:00 | RustChinaConf 2026 | **AI 生成 Rust 项目分析**<br>唐飞虎 · Moonshot AI | [Kimi 对话](https://www.kimi.com/share/1a17be3f-c132-8d6e-8000-000078400a97) · [完整视频（bilibili）](https://www.bilibili.com/video/BV1R9nG6jEHP/) · [活动官网](https://rustchinaconf.org/zh-CN/) · [相关报道](https://www.jxxy.net/ai/articles/blackanger-2103499096019628218/) |
| 2026.05.28 · 16:00–17:00 | 网易雷火技术分享 | **将能源转化为智能：Kimi AI 工程化实践与前沿探索**<br>Kimi · Moonshot AI | [Google Slides](https://docs.google.com/presentation/d/1sGjNPvA16nnf2cTbbQmHNwaHRo6BG5k-HTAFhONe8qM/edit?usp=sharing) · [原始 PPTX](https://github.com/lychees/Talks/blob/main/slides/%E5%B0%86%E8%83%BD%E6%BA%90%E8%BD%AC%E5%8C%96%E4%B8%BA%E6%99%BA%E8%83%BD_Kimi_AI_%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E8%B7%B5%E4%B8%8E%E5%89%8D%E6%B2%BF%E6%8E%A2%E7%B4%A2.pptx) · [完整视频（bilibili）](https://www.bilibili.com/video/BV13jV96uEmm/) |

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

原始 PowerPoint 位于 `slides/`，使用 Git LFS 保存，可[下载原文件](https://github.com/lychees/Talks/blob/main/slides/%E7%9C%A9%E6%99%95%E7%98%AB%E5%9D%90%EF%BC%9F%E4%B8%80%E5%8F%A5%E8%AF%9D%E7%94%9F%E6%88%90_3A_%E6%B8%B8%E6%88%8F_%E5%93%AA%E4%BA%9B%E6%98%AF%E7%9C%9F%E7%9A%84%E5%93%AA%E4%BA%9B%E6%98%AF%E5%81%87%E7%9A%84.pptx)。克隆后如需获取 LFS 文件，请运行 `git lfs pull`。

使用 [Slidev](https://sli.dev/) 构建，项目组织方式参考 [nekomeowww/talks](https://github.com/nekomeowww/talks)。
