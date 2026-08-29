const STORAGE_KEY = 'hou-portfolio-projects-v1';

const seedProjects = [
  { id:'loop', category:'industrial', title:'Loop — Personal AI Companion', year:'2024', description:'A compact magnetic voice companion that gives personal AI a calm, ambient physical presence.', image:'设计实践/工业设计/LOOP/assets/cover-restored.png', url:'project-loop.html' },
  { id:'next-sealer', category:'industrial', displayIndex:'03', title:'NEXT Sealer', year:'2024', description:'A compact desktop CNC engraving machine designed for accessible, precise seal fabrication.', image:'设计实践/工业设计/NEXT sealer/assets/cover.png', url:'project-next-sealer.html' },
  { id:'storyteller', category:'industrial', displayIndex:'04', title:'Storyteller', year:'2025', description:'A tactile storytelling companion designed to create a warmer, more intuitive listening experience.', image:'设计实践/工业设计/Storyteller/assets/cover-restored.png', url:'project-storyteller.html' },
  { id:'coastalbam-jar', category:'industrial', displayIndex:'05', title:'CoastalBam Jar', year:'2024', description:'A lightweight coastal serving vessel that combines a raised base with a removable woven strainer.', image:'设计实践/工业设计/CoastalBam Jar/assets/cover.png', url:'project-coastalbam-jar.html' },
  { id:'vision-poetry', category:'ux', researchTag:'xr', title:'PoemCraft', year:'2026', description:'一款面向诗词爱好者的诗词体验系统，探索 XR 在传统诗词领域的更多可能性。', image:'设计研究/PoemCraft/assets/cover.png', url:'vision-poetry.html' },
  { id:'next-seal', category:'ux', researchTag:'tools', title:'Heritage Sparkle', year:'2023', description:'一款面向新手设计师的设计卡牌工具，为非遗领域的产品创新提供脚手架支撑。', image:'设计实践/交互设计/篆刻/assets/cover.png', url:'project-next-seal.html' },
  { id:'seed-1', category:'ux', researchTag:'tools', title:'Mori — Mindful Living', year:'2026', description:'A calmer digital companion for daily routines and personal wellbeing.', image:'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1400&q=85' },
  { id:'seed-2', category:'ux', researchTag:'tools', title:'Transit, Reimagined', year:'2025', description:'Wayfinding and mobile experience for a more legible urban journey.', image:'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1400&q=85' },
  { id:'seed-3', category:'ux', researchTag:'xr', title:'Kinfolk Archive', year:'2024', description:'An editorial archive built around discovery, restraint and reading.', image:'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1400&q=85' },
  { id:'seed-4', category:'ux', researchTag:'tools', title:'Quiet Finance', year:'2023', description:'Making everyday financial decisions understandable and less stressful.', image:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85' },
  { id:'seed-7', category:'graphic', title:'Field Notes', year:'2025', description:'Identity and publication system for an independent cultural journal.', image:'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1400&q=85' },
  { id:'seed-8', category:'graphic', title:'Shiro / Brand System', year:'2023', description:'A quiet visual language for a contemporary Japanese tea house.', image:'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&w=1400&q=85' }
];

let customProjects = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
const grid = document.querySelector('#projectGrid');
const practiceGrid = document.querySelector('#practiceGrid');
const template = document.querySelector('#projectTemplate');
let researchFilter = 'all';
let practiceFilter = 'all';

function projectCard(project, index) {
    const card = template.content.cloneNode(true);
    const article = card.querySelector('article');
    const image = card.querySelector('img');
    image.src = project.image;
    image.alt = project.title;
    image.loading = 'lazy';
    card.querySelector('.project-index').textContent = project.displayIndex || String(index + 1).padStart(2, '0');
    card.querySelector('h2').textContent = project.title;
    card.querySelector('.project-description').textContent = project.description;
    card.querySelector('.project-year').textContent = project.year;
    if (project.attachment) {
      const link = card.querySelector('.attachment');
      link.hidden = false; link.href = project.attachment.data; link.download = project.attachment.name;
    }
    if (project.id.startsWith('custom-')) {
      const remove = card.querySelector('.delete-project');
      remove.hidden = false;
      remove.addEventListener('click', () => deleteProject(project.id));
    }
    article.dataset.id = project.id;
    if (project.url) {
      article.classList.add('has-detail');
      article.tabIndex = 0;
      article.setAttribute('role', 'link');
      article.setAttribute('aria-label', `View ${project.title} case study`);
      article.addEventListener('click', e => { if (!e.target.closest('a,button')) location.href = project.url; });
      article.addEventListener('keydown', e => { if (e.key === 'Enter') location.href = project.url; });
    }
    return card;
}

function renderResearch() {
  const projects = [...customProjects, ...seedProjects].filter(project => project.category === 'ux' && (researchFilter === 'all' || project.researchTag === researchFilter));
  grid.replaceChildren(...projects.map(projectCard));
  document.querySelector('#research').classList.remove('expanded');
  document.querySelector('#researchMore').classList.remove('expanded');
  document.querySelector('#researchMore span').textContent = '更多研究项目';
}

function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  customProjects = customProjects.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customProjects));
  renderResearch();
  renderPractice();
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file);
  });
}

function practiceCard(project) {
  const card = document.createElement(project.url ? 'a' : 'article');
  card.className = 'practice-card';
  if (project.url) card.href = project.url;
  const imageWrap = document.createElement('div');
  imageWrap.className = 'practice-card-image';
  const image = document.createElement('img');
  image.src = project.image;
  image.alt = project.title;
  image.loading = 'lazy';
  imageWrap.append(image);
  const meta = document.createElement('div');
  meta.className = 'project-info';
  const copy = document.createElement('div');
  const title = document.createElement('h2');
  title.textContent = project.title;
  const description = document.createElement('p');
  description.className = 'project-description';
  description.textContent = project.description;
  const year = document.createElement('p');
  year.className = 'project-year';
  year.textContent = project.year;
  copy.append(title, description);
  meta.append(copy, year);
  card.append(imageWrap, meta);
  return card;
}

function renderPractice() {
  const projects = [...customProjects, ...seedProjects].filter(project => practiceFilter === 'all' || project.category === practiceFilter);
  practiceGrid.replaceChildren(...projects.map(practiceCard));
}

document.querySelectorAll('#researchFilters .filter-button').forEach(button => button.addEventListener('click', () => {
  researchFilter = button.dataset.filter;
  document.querySelectorAll('#researchFilters .filter-button').forEach(item => item.classList.toggle('active', item === button));
  renderResearch();
}));

document.querySelectorAll('#practiceFilters .filter-button').forEach(button => button.addEventListener('click', () => {
  practiceFilter = button.dataset.filter;
  document.querySelectorAll('#practiceFilters .filter-button').forEach(item => item.classList.toggle('active', item === button));
  renderPractice();
}));

document.querySelector('#researchMore').addEventListener('click', event => {
  const expanded = document.querySelector('#research').classList.toggle('expanded');
  event.currentTarget.classList.toggle('expanded', expanded);
  event.currentTarget.querySelector('span').textContent = expanded ? '收起研究项目' : '更多研究项目';
});

const aboutDialog = document.querySelector('#aboutDialog');
document.querySelector('#openAbout').addEventListener('click', () => aboutDialog.showModal());
document.querySelector('#closeAbout').addEventListener('click', () => aboutDialog.close());
aboutDialog.addEventListener('click', event => { if (event.target === aboutDialog) aboutDialog.close(); });

const slides = [...document.querySelectorAll('.carousel-slide')];
const dots = [...document.querySelectorAll('.carousel-dot')];
let activeSlide = 0;
let carouselTimer;

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    const active = slideIndex === activeSlide;
    slide.classList.toggle('active', active);
    slide.setAttribute('aria-hidden', String(!active));
  });
  dots.forEach((dot, dotIndex) => {
    const active = dotIndex === activeSlide;
    dot.classList.toggle('active', active);
    if (active) dot.setAttribute('aria-current', 'true'); else dot.removeAttribute('aria-current');
  });
}

function restartCarousel() {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(() => showSlide(activeSlide + 1), 5500);
}

dots.forEach(dot => dot.addEventListener('click', () => { showSlide(Number(dot.dataset.slide)); restartCarousel(); }));
document.querySelector('#previousSlide').addEventListener('click', () => { showSlide(activeSlide - 1); restartCarousel(); });
document.querySelector('#nextSlide').addEventListener('click', () => { showSlide(activeSlide + 1); restartCarousel(); });

let touchStartX = 0;
const viewport = document.querySelector('#carouselViewport');
viewport.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].clientX; }, { passive:true });
viewport.addEventListener('touchend', event => {
  const delta = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) < 45) return;
  showSlide(activeSlide + (delta < 0 ? 1 : -1));
  restartCarousel();
}, { passive:true });
restartCarousel();

const pixelStage = document.querySelector('#pixelStage');
const runnerKeys = new Set();
let runnerShift = 0;
let runnerFrame = 0;
let runnerTime = performance.now();

function runnerDirection() {
  return (runnerKeys.has('d') || runnerKeys.has('arrowright') ? 1 : 0)
    - (runnerKeys.has('a') || runnerKeys.has('arrowleft') ? 1 : 0);
}

function updateRunnerPosition(delta) {
  if (!pixelStage) return;
  const player = pixelStage.querySelector('.pixel-player');
  const leadRunner = pixelStage.querySelector('.escape-dis');
  const minShift = 8 - player.offsetLeft;
  const maxShift = pixelStage.clientWidth - 8 - leadRunner.offsetLeft - leadRunner.offsetWidth;
  runnerShift = Math.min(maxShift, Math.max(minShift, runnerShift + delta));
  pixelStage.style.setProperty('--runner-shift', `${Math.round(runnerShift)}px`);
}

function animateRunner(time) {
  const elapsed = Math.min(40, time - runnerTime);
  runnerTime = time;
  updateRunnerPosition(runnerDirection() * elapsed * .28);
  runnerFrame = requestAnimationFrame(animateRunner);
}

document.addEventListener('keydown', event => {
  if (event.target instanceof Element && event.target.matches('input,textarea,select,[contenteditable="true"]')) return;
  const key = event.key.toLowerCase();
  if (!['a','d','arrowleft','arrowright'].includes(key)) return;
  event.preventDefault();
  runnerKeys.add(key);
});

document.addEventListener('keyup', event => runnerKeys.delete(event.key.toLowerCase()));
window.addEventListener('blur', () => runnerKeys.clear());
window.addEventListener('resize', () => updateRunnerPosition(0));
runnerFrame = requestAnimationFrame(animateRunner);

document.querySelector('#year').textContent = new Date().getFullYear();
renderResearch();
renderPractice();
