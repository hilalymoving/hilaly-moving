const fs = require('fs')
const path = require('path')

const dist = path.join(__dirname, '..', 'dist')
const indexHtml = path.join(dist, 'index.html')

if (!fs.existsSync(indexHtml)) {
  console.error('dist/index.html not found. Run vite build first.')
  process.exit(1)
}

const routes = ['services', 'contact', 'about', 'pricing', 'blog']

for (const route of routes) {
  const dir = path.join(dist, route)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.copyFileSync(indexHtml, path.join(dir, 'index.html'))
  console.log(`  ✓ /${route}/  →  index.html`)
}

console.log(`\nPrerendered ${routes.length} routes successfully.`)
