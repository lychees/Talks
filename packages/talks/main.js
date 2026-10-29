const $ = (selector, root = document) => root.querySelector(selector)
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)]
const passive = { passive: true }
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
const finePointer = matchMedia('(pointer: fine)')
const progress = $('.scroll-progress span')
let scrollFrame = 0

function updateProgress() {
  const maximum = document.documentElement.scrollHeight - window.innerHeight
  const ratio = maximum > 0 ? Math.min(1, Math.max(0, window.scrollY / maximum)) : 0
  progress.style.transform = `scaleX(${ratio})`
  scrollFrame = 0
}

window.addEventListener('scroll', () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProgress)
}, passive)
window.addEventListener('resize', updateProgress, passive)
updateProgress()

const revealElements = $$('.reveal')
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      if (isIntersecting) {
        target.classList.add('is-visible')
        observer.unobserve(target)
      }
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' })
  revealElements.forEach(element => observer.observe(element))
} else {
  revealElements.forEach(element => element.classList.add('is-visible'))
}

const counter = $('[data-count]')
if (counter && !reducedMotion.matches) {
  const target = Number(counter.dataset.count)
  const startedAt = performance.now()
  requestAnimationFrame(function count(now) {
    const ratio = Math.min(1, (now - startedAt) / 750)
    counter.textContent = Math.round(target * (1 - (1 - ratio) ** 3))
    if (ratio < 1) requestAnimationFrame(count)
  })
}

if (finePointer.matches && !reducedMotion.matches) {
  $$('.talk').forEach((card) => {
    card.addEventListener('pointermove', ({ clientX, clientY }) => {
      const { left, top, width, height } = card.getBoundingClientRect()
      const x = (clientX - left) / width
      const y = (clientY - top) / height
      card.style.setProperty('--pointer-x', `${x * 100}%`)
      card.style.setProperty('--pointer-y', `${y * 100}%`)
      card.style.setProperty('--rotate-x', `${(0.5 - y) * 2.2}deg`)
      card.style.setProperty('--rotate-y', `${(x - 0.5) * 2.2}deg`)
    })
    card.addEventListener('pointerleave', () => {
      for (const property of ['--rotate-x', '--rotate-y']) card.style.setProperty(property, '0deg')
    })
  })
}

const canvas = $('#network')
const context = canvas.getContext('2d')
const colors = ['rgba(85, 217, 232, .36)', 'rgba(178, 157, 255, .3)', 'rgba(255, 184, 107, .26)']
let width = 0
let height = 0
let nodes = []
let animationFrame = 0
let resizeFrame = 0
let previousTime = 0

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
  context.lineWidth = 0.7
  for (let first = 0; first < nodes.length; first++) {
    for (let second = first + 1; second < nodes.length; second++) {
      const dx = nodes[first].x - nodes[second].x
      const dy = nodes[first].y - nodes[second].y
      const distance = Math.hypot(dx, dy)
      if (distance >= maximumDistance) continue
      context.beginPath()
      context.moveTo(nodes[first].x, nodes[first].y)
      context.lineTo(nodes[second].x, nodes[second].y)
      context.strokeStyle = `rgba(112, 167, 210, ${(1 - distance / maximumDistance) * 0.12})`
      context.stroke()
    }
  }
  for (const node of nodes) {
    context.beginPath()
    context.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
    context.fillStyle = colors[node.tint]
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
  const count = Math.min(40, Math.max(18, Math.floor(width * height / 52000)))
  nodes = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.07,
    vy: (Math.random() - 0.5) * 0.07,
    radius: index % 4 === 0 ? 1.8 : 1.15,
    tint: index % 3,
  }))
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
}, passive)
document.addEventListener('visibilitychange', syncAnimation)
reducedMotion.addEventListener('change', syncAnimation)
resize()
syncAnimation()

const previewMedia = $$('.preview')
const touchPreview = matchMedia('(hover: none)')
const previewTimers = new WeakMap()

function togglePreview(preview, show) {
  clearTimeout(previewTimers.get(preview))
  const toggle = () => preview.classList.toggle('is-alt', show)
  if (show) previewTimers.set(preview, setTimeout(toggle, touchPreview.matches ? 1400 : 650))
  else toggle()
}

if (!reducedMotion.matches) {
  previewMedia.forEach((preview) => {
    preview.addEventListener('pointerenter', () => togglePreview(preview, true))
    preview.addEventListener('pointerleave', () => togglePreview(preview, false))
    preview.addEventListener('focusin', () => togglePreview(preview, true))
    preview.addEventListener('focusout', () => togglePreview(preview, false))
  })
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!touchPreview.matches) continue
        togglePreview(target, isIntersecting)
      }
    }, { threshold: 0.65 })
    previewMedia.forEach(preview => observer.observe(preview))
  }
}
reducedMotion.addEventListener('change', () => previewMedia.forEach(preview => togglePreview(preview, false)))

const catalogList = $('.timeline')
const catalogSearch = $('#talk-search')
const catalogYear = $('#talk-year')
const catalogSort = $('#talk-sort')
const catalogStatus = $('#catalog-status')
const catalogEmpty = $('#catalog-empty')
const catalogTableWrap = $('#catalog-table-wrap')
const catalogTableBody = $('#catalog-table-body')
const catalogViewButtons = { cards: $('#card-view'), table: $('#table-view') }
const catalogEntries = $$('.talk', catalogList).map((element, index) => {
  const date = $('.meta time', element).dateTime
  const searchText = $$('.meta, h2, .speaker', element)
    .map(field => field.textContent.replace(/\s+/g, ' '))
    .join(' ')
    .toLocaleLowerCase('zh-CN')
  return {
    element,
    index,
    year: date.slice(0, 4),
    timestamp: Date.parse($('.schedule time', element)?.dateTime || `${date}T00:00:00+08:00`),
    searchText,
  }
})

function catalogLink(source, label, title, className = 'table-action') {
  const link = source.cloneNode(true)
  link.className = className
  link.textContent = label
  link.setAttribute('aria-label', `${title} · ${label}`)
  return link
}

function actionLabel(link) {
  const text = link.textContent.replace(/\s+/g, ' ').trim()
  if (text.includes('原始 PPT')) return 'PPT'
  if (text.includes('圆桌')) return '圆桌'
  if (/bilibili\.com|youtu\.be|youtube\.com/.test(link.href)) return '录像'
  return text
}

function buildCatalogTable() {
  for (const entry of catalogEntries) {
    const card = entry.element
    const title = $('h2', card).innerText.replace(/\s+/g, ' ').trim()
    const primary = $('.actions .primary', card)
    const meta = $('.meta', card).cloneNode(true)
    $('time', meta).remove()
    $('.meta-separator', meta)?.remove()

    const dateCell = document.createElement('td')
    dateCell.className = 'table-date'
    dateCell.append($('.meta time', card).cloneNode(true))
    const schedule = document.createElement('small')
    schedule.textContent = $('.schedule', card).textContent.replace(/\s+/g, ' ').trim()
    dateCell.append(schedule)

    const titleCell = document.createElement('td')
    titleCell.className = 'table-title'
    titleCell.append(catalogLink(primary, title, title, 'table-title-link'))
    const speaker = document.createElement('small')
    speaker.textContent = $('.speaker strong', card).textContent.trim()
    titleCell.append(speaker)

    const eventCell = document.createElement('td')
    eventCell.className = 'table-event'
    eventCell.textContent = meta.textContent.replace(/\s+/g, ' ').trim()

    const actionsCell = document.createElement('td')
    actionsCell.className = 'table-actions'
    for (const link of $$('.actions a', card).filter(link => link !== primary)) {
      actionsCell.append(catalogLink(link, actionLabel(link), title))
    }
    if (!actionsCell.children.length) actionsCell.textContent = '—'

    const relatedCell = document.createElement('td')
    relatedCell.className = 'table-related'
    for (const link of $$('.related a', card)) {
      relatedCell.append(catalogLink(link, link.textContent.replace(/\s+/g, ' ').trim(), title, 'table-related-link'))
    }
    if (!relatedCell.children.length) relatedCell.textContent = '—'

    const row = document.createElement('tr')
    row.className = 'catalog-row'
    row.append(dateCell, titleCell, eventCell, actionsCell, relatedCell)
    entry.row = row
    catalogTableBody.append(row)
  }
}

let catalogView = 'cards'
try { catalogView = localStorage.getItem('talks-view') === 'table' ? 'table' : 'cards' } catch {}

function syncCatalogView(count) {
  document.body.dataset.view = catalogView
  catalogList.hidden = catalogView === 'table' || count === 0
  catalogTableWrap.hidden = catalogView === 'cards' || count === 0
  for (const [view, button] of Object.entries(catalogViewButtons)) {
    button.setAttribute('aria-pressed', String(view === catalogView))
  }
}

function setCatalogView(view) {
  catalogView = view
  syncCatalogView(catalogEntries.filter(entry => !entry.element.hidden).length)
  try { localStorage.setItem('talks-view', view) } catch {}
}

function applyCatalogFilters() {
  const query = catalogSearch.value.trim().toLocaleLowerCase('zh-CN')
  const direction = catalogSort.value === 'asc' ? 1 : -1
  const entries = catalogEntries.slice()
    .sort((first, second) => (first.timestamp - second.timestamp) * direction || first.index - second.index)
  let visibleIndex = 0

  catalogList.append(...entries.map(entry => entry.element))
  catalogTableBody.append(...entries.map(entry => entry.row))
  for (const { element, year, searchText, row } of entries) {
    const visible = (catalogYear.value === 'all' || year === catalogYear.value) && searchText.includes(query)
    if (element.hidden && visible) element.classList.add('is-visible')
    element.hidden = !visible
    row.hidden = !visible
    if (!visible) continue
    element.style.setProperty('--delay', `${Math.min(visibleIndex * 60, 240)}ms`)
    visibleIndex++
  }

  catalogStatus.textContent = `${visibleIndex} / ${catalogEntries.length} 场演讲`
  catalogEmpty.hidden = visibleIndex > 0
  syncCatalogView(visibleIndex)
}

function resetCatalog() {
  catalogSearch.value = ''
  catalogYear.value = 'all'
  catalogSort.value = 'desc'
  applyCatalogFilters()
  catalogSearch.focus({ preventScroll: true })
}

buildCatalogTable()
catalogViewButtons.cards.addEventListener('click', () => setCatalogView('cards'))
catalogViewButtons.table.addEventListener('click', () => setCatalogView('table'))
catalogSearch.addEventListener('input', applyCatalogFilters)
for (const select of [catalogYear, catalogSort]) select.addEventListener('change', applyCatalogFilters)
for (const button of $$('#talk-reset, #catalog-reset-empty')) button.addEventListener('click', resetCatalog)
applyCatalogFilters()
