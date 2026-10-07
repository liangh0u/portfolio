const STORAGE_KEY = 'hou-portfolio-projects-v1';

const seedProjects = [
  { id:'next-seal', category:'ux', researchVisible:false, title:'NEXT Seal', year:'2024', description:'AI-powered seal creation platform\nAI 智能篆刻创作平台', image:'assets/next-seal/home-cover.png', url:'project-next-seal.html', awards:[{ logo:'assets/icons/awards/red-dot.png', name:'Red Dot Award' },{ logo:'assets/icons/awards/adesign.png', name:"A' Design Award" }] },
  { id:'next-sealer', category:'industrial', displayIndex:'03', title:'NEXT Sealer', year:'2024', description:'Intelligent seal engraving machine\n智能篆刻机', image:'设计实践/工业设计/NEXT sealer/assets/cover.png', url:'project-next-sealer.html', awards:[{ logo:'assets/icons/awards/red-dot.png', name:'Red Dot Award' },{ logo:'assets/icons/awards/adesign.png', name:"A' Design Award" }] },
  { id:'bam3-creel', category:'industrial', title:'Bam³ Creel', year:'2023', description:'Modular bamboo fishing creel\n模块化竹编鱼篓', image:'assets/bam3-creel/detail-cover.png', url:'project-bam3-creel.html' },
  { id:'silkworm-box', category:'industrial', displayIndex:'06', title:'Silkworm Box', year:'2022', description:'Smart sericulture learning kit\n智能养蚕自然教育套件', image:'设计实践/工业设计/Silkworm Box/assets/home-cover.png', url:'project-silkworm-box.html', awardLogo:'assets/icons/awards/red-dot.png', awardName:'Red Dot Award' },
  { id:'rotating-suitcase', category:'industrial', displayIndex:'07', title:'Rotating Suitcase', year:'2022', description:'Transformable travel suitcase\n可变形多功能行李箱', image:'设计实践/工业设计/Rotating Suitcase/assets/home-cover.png', url:'project-rotating-suitcase.html', awardLogo:'assets/icons/awards/idea.png', awardName:'IDEA' },
  { id:'coastalbam-jar', category:'industrial', displayIndex:'05', title:'CoastalBam Jar', year:'2024', description:'Contemporary bamboo-woven salt jar\n当代竹编盐罐', image:'设计实践/工业设计/CoastalBam Jar/assets/cover.png', url:'project-coastalbam-jar.html', awardLogo:'assets/icons/awards/red-dot.png', awardName:'Red Dot Award' },
  { id:'storyteller', category:'industrial', displayIndex:'04', title:'Storyteller', year:'2025', description:'AI companion for life stories\n记录生命故事的 AI 陪伴机器人', image:'设计实践/工业设计/Storyteller/assets/cover-restored.png', url:'project-storyteller.html' },
  { id:'oil-spill-collector', category:'industrial', title:'Deoiling Machine', year:'2021', description:'Offshore oil recovery system\n海上原油回收系统', image:'assets/oil-spill-collector/cover.png', url:'project-oil-spill-collector.html', awardLogo:'assets/icons/awards/if.png', awardName:'iF Design Award' },
  { id:'pumpbtc', category:'graphic', title:'PumpBTC', year:'2025', description:'Bitcoin brand identity system\n比特币品牌视觉系统', image:'设计实践/视觉设计/PumpBTC/assets/home-cover-v3.png', url:'project-pumpbtc.html' },
  { id:'zju130', category:'graphic', title:'Zhejiang University 130th Anniversary', year:'2026', description:'Anniversary visual identity\n周年纪念视觉识别系统', image:'设计实践/视觉设计/ZJU130/assets/cover.png', url:'project-zju130.html' },
  { id:'loop', category:'industrial', title:'Loop', year:'2025', description:'Personal AI companion\n个性化 AI 陪伴机器人', image:'设计实践/工业设计/LOOP/assets/cover-restored.png', url:'project-loop.html' },
  { id:'product-sketch-series', category:'sketch', title:'产品手绘系列', year:'2020年起', description:'Hand sketching practice during my studies\n求学期间的手绘练习', image:'assets/sketch/product-sketch-series-cover.png', url:'project-hand-sketching.html' },
  { id:'PoemCraft', category:'ux', researchTag:'xr', practiceVisible:false, title:'PoemCraft', year:'2026', description:'Constructive XR poetry learning\n建构式 XR 诗词学习体验', image:'设计研究/PoemCraft/assets/cover.png', url:'index-peomcraft.html', awardLogo:'assets/icons/awards/maic.png', awardName:'CCCC MAIC' },
  { id:'heritage-spark', category:'ux', researchTag:'tools', practiceVisible:false, title:'Heritage Spark', year:'2025', description:'Card toolkit for digital heritage\n非遗数字化设计卡片工具包', image:'设计研究/Heritage Spark/assets/cover.png', url:'index-heritage-spark.html', awardLogo:'assets/icons/awards/adesign.png', awardName:"A' Design Award" },
];

let customProjects = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
const grid = document.querySelector('#projectGrid');
const practiceGrid = document.querySelector('#practiceGrid');
const template = document.querySelector('#projectTemplate');
let researchFilter = 'all';
let practiceFilter = 'all';

function appendAwardLogos(title, project) {
  const awards = project.awards || (project.awardLogo ? [{ logo:project.awardLogo, name:project.awardName }] : []);
  awards.forEach(({ logo, name }) => {
    const award = document.createElement('img');
    award.className = 'project-award-logo';
    award.src = logo;
    award.alt = name || '获奖标识';
    award.title = name || '';
    title.append(award);
  });
}

function projectCard(project, index) {
    const card = template.content.cloneNode(true);
    const article = card.querySelector('article');
    const image = card.querySelector('img');
    image.src = project.image;
    image.alt = project.title;
    image.loading = 'lazy';
    const title = card.querySelector('h2');
    title.textContent = project.title;
    appendAwardLogos(title, project);
    card.querySelector('.project-description').textContent = project.description;
    card.querySelector('.project-year').textContent = project.year;
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
  const projects = [...customProjects, ...seedProjects].filter(project => project.category === 'ux' && project.researchVisible !== false && (researchFilter === 'all' || project.researchTag === researchFilter));
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
  appendAwardLogos(title, project);
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
  const projects = [...customProjects, ...seedProjects].filter(project => project.practiceVisible !== false && (practiceFilter === 'all' || project.category === practiceFilter));
  if (projects.length) {
    practiceGrid.replaceChildren(...projects.map(practiceCard));
    return;
  }
  const emptyState = document.createElement('div');
  emptyState.className = 'practice-empty-state';
  emptyState.innerHTML = '<p>Sketches coming soon</p><span>手绘作品整理中</span>';
  practiceGrid.replaceChildren(emptyState);
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

const hobbyButtons = [...document.querySelectorAll('.about-hobby-buttons button')];
const hobbyPhoto = document.querySelector('#hobbyPhoto');
const hobbyPhotoPlaceholder = document.querySelector('#hobbyPhotoPlaceholder');
const hobbyPhotoLabel = document.querySelector('#hobbyPhotoLabel');

hobbyButtons.forEach(button => {
  button.addEventListener('click', () => {
    hobbyButtons.forEach(item => {
      const selected = item === button;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });

    const imagePath = button.dataset.image;
    hobbyPhotoLabel.textContent = button.dataset.hobby;
    hobbyPhoto.hidden = !imagePath;
    hobbyPhotoPlaceholder.hidden = Boolean(imagePath);

    if (imagePath) {
      hobbyPhoto.src = imagePath;
      hobbyPhoto.alt = `${button.dataset.hobby}相关图片`;
      hobbyPhoto.style.objectPosition = button.dataset.position || 'center center';
    }
  });
});

hobbyPhoto.addEventListener('error', () => {
  hobbyPhoto.hidden = true;
  hobbyPhotoPlaceholder.hidden = false;
});

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
