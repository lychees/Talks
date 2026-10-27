import { copyFile, mkdir, writeFile } from 'node:fs/promises'

await mkdir('dist', { recursive: true })
await copyFile('packages/talks/index.html', 'dist/index.html')
await writeFile('dist/.nojekyll', '')
