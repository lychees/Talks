import { cp, mkdir, writeFile } from 'node:fs/promises'

await mkdir('dist', { recursive: true })
await cp('packages/talks', 'dist', { recursive: true })
await writeFile('dist/.nojekyll', '')
