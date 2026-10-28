import { cp, mkdir, writeFile } from 'node:fs/promises'

await mkdir('dist', { recursive: true })
await cp('packages/talks', 'dist', { recursive: true })
await cp('packages/2026-10-23-unreal-fest-one-prompt-3a-games/public/media', 'dist/48h-3a-game-replication/media', { recursive: true })
await writeFile('dist/.nojekyll', '')
