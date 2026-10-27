const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const finePointer = window.matchMedia('(pointer: fine)')
const progress = document.querySelector('.scroll-progress span')
let scrollFrame = 0

function updateProgress() {
  const maximum = document.documentElement.scrollHeight - window.innerHeight
  const ratio = maximum > 0 ? Math.min(1, Math.max(0, window.scrollY / maximum)) : 0
  progress.style.transform = `scaleX(${ratio})`
  scrollFrame = 0
}

window.addEventListener('scroll', () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProgress)
}, { passive: true })
window.addEventListener('resize', updateProgress, { passive: true })
updateProgress()

const revealElements = document.querySelectorAll('.reveal')
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' })
  revealElements.forEach(element => observer.observe(element))
} else {
  revealElements.forEach(element => element.classList.add('is-visible'))
}

const counter = document.querySelector('[data-count]')
if (counter && !reducedMotion.matches) {
  const target = Number(counter.dataset.count)
  const startedAt = performance.now()
  const count = (now) => {
    const ratio = Math.min(1, (now - startedAt) / 750)
    counter.textContent = String(Math.round(target * (1 - (1 - ratio) ** 3)))
    if (ratio < 1) requestAnimationFrame(count)
  }
  requestAnimationFrame(count)
}

if (finePointer.matches && !reducedMotion.matches) {
  document.querySelectorAll('.talk').forEach((card) => {
    let frame = 0
    card.addEventListener('pointermove', (event) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width
        const y = (event.clientY - rect.top) / rect.height
        card.style.setProperty('--pointer-x', `${x * 100}%`)
        card.style.setProperty('--pointer-y', `${y * 100}%`)
        card.style.setProperty('--rotate-x', `${(0.5 - y) * 2.2}deg`)
        card.style.setProperty('--rotate-y', `${(x - 0.5) * 2.2}deg`)
        frame = 0
      })
    })
    card.addEventListener('pointerleave', () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      card.style.setProperty('--rotate-x', '0deg')
      card.style.setProperty('--rotate-y', '0deg')
    })
  })
}

const canvas = document.querySelector('#network')
const context = canvas.getContext('2d')
let width = 0
let height = 0
let nodes = []
let animationFrame = 0
let resizeFrame = 0
let previousTime = 0

function createNodes() {
  const count = Math.min(40, Math.max(18, Math.floor(width * height / 52000)))
  nodes = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.07,
    vy: (Math.random() - 0.5) * 0.07,
    radius: index % 4 === 0 ? 1.8 : 1.15,
    tint: index % 3,
  }))
}

function draw(time = 0) {
  const delta = Math.min(40, time - previousTime || 16)
  previousTime = time
  context.clearRect(0, 0, width, height)
  if (!reducedMotion.matches) {
    for (const node of nodes) {
      node.x += node.vx * delta
      node.y += node.vy * delta
      if (node.x < -20) node.x = width + 20
      if (node.x > width + 20) node.x = -20
      if (node.y < -20) node.y = height + 20
      if (node.y > height + 20) node.y = -20
    }
  }
  const maximumDistance = width < 640 ? 125 : 155
  for (let first = 0; first < nodes.length; first++) {
    for (let second = first + 1; second < nodes.length; second++) {
      const dx = nodes[first].x - nodes[second].x
      const dy = nodes[first].y - nodes[second].y
      const distance = Math.hypot(dx, dy)
      if (distance < maximumDistance) {
        context.beginPath()
        context.moveTo(nodes[first].x, nodes[first].y)
        context.lineTo(nodes[second].x, nodes[second].y)
        context.strokeStyle = `rgba(112, 167, 210, ${(1 - distance / maximumDistance) * 0.12})`
        context.lineWidth = 0.7
        context.stroke()
      }
    }
  }
  for (const node of nodes) {
    context.beginPath()
    context.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
    context.fillStyle = node.tint === 0 ? 'rgba(85, 217, 232, .36)' : node.tint === 1 ? 'rgba(178, 157, 255, .3)' : 'rgba(255, 184, 107, .26)'
    context.fill()
  }
}

function animate(time) {
  if (time - previousTime >= 33) draw(time)
  animationFrame = requestAnimationFrame(animate)
}

function resize() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2)
  width = window.innerWidth
  height = window.innerHeight
  canvas.width = Math.round(width * ratio)
  canvas.height = Math.round(height * ratio)
  context.setTransform(ratio, 0, 0, ratio, 0, 0)
  createNodes()
  draw()
}

function syncAnimation() {
  cancelAnimationFrame(animationFrame)
  if (!document.hidden && !reducedMotion.matches) animationFrame = requestAnimationFrame(animate)
  else draw()
}

window.addEventListener('resize', () => {
  cancelAnimationFrame(resizeFrame)
  resizeFrame = requestAnimationFrame(resize)
}, { passive: true })
document.addEventListener('visibilitychange', syncAnimation)
reducedMotion.addEventListener('change', syncAnimation)
resize()
syncAnimation()

const previewMedia = document.querySelectorAll('.preview')
const touchPreview = window.matchMedia('(hover: none)')
if (!reducedMotion.matches) {
  previewMedia.forEach((preview) => {
    let timer
    const show = () => {
      clearTimeout(timer)
      timer = setTimeout(() => preview.classList.add('is-alt'), touchPreview.matches ? 1400 : 650)
    }
    const hide = () => {
      clearTimeout(timer)
      preview.classList.remove('is-alt')
    }
    preview.addEventListener('pointerenter', show)
    preview.addEventListener('pointerleave', hide)
    preview.addEventListener('focusin', show)
    preview.addEventListener('focusout', hide)
    reducedMotion.addEventListener('change', hide)
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        if (!touchPreview.matches) return
        if (entry.isIntersecting) show()
        else hide()
      }, { threshold: 0.65 })
      observer.observe(preview)
    }
  })
}

const catalogList = document.querySelector('.timeline')
const catalogSearch = document.querySelector('#talk-search')
const catalogYear = document.querySelector('#talk-year')
const catalogSort = document.querySelector('#talk-sort')
const catalogStatus = document.querySelector('#catalog-status')
const catalogEmpty = document.querySelector('#catalog-empty')
const catalogEntries = Array.from(catalogList.querySelectorAll('.talk'), (element, index) => {
  const date = element.querySelector('.meta time').dateTime
  const time = element.querySelector('.schedule time')?.dateTime
  const searchText = Array.from(element.querySelectorAll('.meta, h2, .speaker'))
    .map(field => field.textContent.replace(/\s+/g, ' '))
    .join(' ')
    .toLocaleLowerCase('zh-CN')
  return {
    element,
    index,
    year: date.slice(0, 4),
    timestamp: Date.parse(time || `${date}T00:00:00+08:00`),
    searchText,
  }
})

function applyCatalogFilters() {
  const query = catalogSearch.value.trim().toLocaleLowerCase('zh-CN')
  const direction = catalogSort.value === 'asc' ? 1 : -1
  let visibleIndex = 0

  catalogEntries.slice()
    .sort((first, second) => (first.timestamp - second.timestamp) * direction || first.index - second.index)
    .forEach((entry) => {
      const matchesYear = catalogYear.value === 'all' || entry.year === catalogYear.value
      const matchesSearch = !query || entry.searchText.includes(query)
      const visible = matchesYear && matchesSearch
      const wasHidden = entry.element.hidden

      catalogList.append(entry.element)
      entry.element.hidden = !visible
      if (visible) {
        entry.element.style.setProperty('--delay', `${Math.min(visibleIndex * 60, 240)}ms`)
        if (wasHidden) entry.element.classList.add('is-visible')
        visibleIndex++
      }
    })

  catalogStatus.textContent = `${visibleIndex} / ${catalogEntries.length} 场演讲`
  catalogEmpty.hidden = visibleIndex > 0
  catalogList.hidden = visibleIndex === 0
}

function resetCatalog() {
  catalogSearch.value = ''
  catalogYear.value = 'all'
  catalogSort.value = 'desc'
  applyCatalogFilters()
  catalogSearch.focus({ preventScroll: true })
}

catalogSearch.addEventListener('input', applyCatalogFilters)
catalogYear.addEventListener('change', applyCatalogFilters)
catalogSort.addEventListener('change', applyCatalogFilters)
document.querySelector('#talk-reset').addEventListener('click', resetCatalog)
document.querySelector('#catalog-reset-empty').addEventListener('click', resetCatalog)
applyCatalogFilters()
