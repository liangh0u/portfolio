const paths = {
  text: [
    ['选择创作方式', '从文字印、肖形印与中英印进入属于自己的创作路径。', 'ui-home.png'],
    ['写下你的文字', '输入想要留下的字句，让内容成为印面的起点。', 'ui-text-input.png'],
    ['选择篆刻风格', '浏览不同字形语言，在传统规则与个性表达间找到平衡。', 'ui-text-style.png'],
    ['调整印面细节', '通过大小、留白、粗细与重心，让生成结果更接近自己的想法。', 'ui-text-adjust.png'],
    ['完成一方印', '保存数字印面，继续选择印石并进入实体制作。', 'ui-result.png']
  ],
  portrait: [
    ['选择创作方式', '从肖形印进入图像化的个性表达。', 'ui-home.png'],
    ['上传一张图片', '照片或插画都可以成为肖形印的创作原点。', 'ui-portrait-upload.png'],
    ['细化图像', '用阈值和局部涂抹控制画面的黑白关系。', 'ui-portrait-edit.png'],
    ['添加个性元素', '用贴纸与图形完善独属于自己的印面构图。', 'ui-portrait-sticker.png'],
    ['选择实体载体', '挑选印石材质、色彩与配件，把图像变成真实作品。', 'ui-stone.png']
  ],
  bilingual: [
    ['选择创作方式', '用中英印连接两种文字系统。', 'ui-home.png'],
    ['输入双语内容', '输入中文与英文，系统自动给出适合印面的初始组合。', 'ui-bilingual-input.png'],
    ['安排版式', '选择横排、竖排或组合布局，建立中英文的视觉秩序。', 'ui-bilingual-layout.png'],
    ['调整生成参数', '在传统篆意与现代可读性之间进行精细控制。', 'ui-bilingual-adjust.png'],
    ['进入完整服务', '从线上商店到附近自助点，完成从屏幕到印石的旅程。', 'ui-store.png']
  ]
};

const stepsEl = document.querySelector('#walkthroughSteps');
const screen = document.querySelector('#phoneScreen');
const stepNo = document.querySelector('#phoneStep');
let observer;

function switchScreen(file, index) {
  if (screen.dataset.file === file) return;
  screen.classList.add('switching');
  const preload = new Image();
  preload.onload = () => {
    screen.src = `assets/next-seal/${file}`;
    screen.dataset.file = file;
    screen.alt = `NEXT Seal app step ${index + 1}`;
    stepNo.textContent = String(index + 1).padStart(2, '0');
    requestAnimationFrame(() => screen.classList.remove('switching'));
  };
  preload.src = `assets/next-seal/${file}`;
}

function renderPath(name) {
  if (observer) observer.disconnect();
  stepsEl.replaceChildren();
  paths[name].forEach(([title, copy, image], index) => {
    const section = document.createElement('article');
    section.className = `walk-step${index === 0 ? ' active' : ''}`;
    section.dataset.image = image;
    section.dataset.index = index;
    section.innerHTML = `<span>Step ${String(index + 1).padStart(2, '0')}</span><h3>${title}</h3><p>${copy}</p>`;
    stepsEl.append(section);
  });
  document.querySelector('#phoneTotal').textContent = String(paths[name].length).padStart(2, '0');
  switchScreen(paths[name][0][2], 0);
  observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll('.walk-step').forEach(el => el.classList.toggle('active', el === entry.target));
    switchScreen(entry.target.dataset.image, Number(entry.target.dataset.index));
  }), { rootMargin:'-38% 0px -42% 0px', threshold:0 });
  document.querySelectorAll('.walk-step').forEach(step => observer.observe(step));
}

document.querySelectorAll('.path-tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('.path-tab').forEach(item => item.classList.toggle('active', item === tab));
  renderPath(tab.dataset.path);
  document.querySelector('.walkthrough').scrollIntoView({ behavior:'smooth', block:'start' });
}));

renderPath('text');

const audiences = {
  culture: {
    traits:'喜欢传统文化 · 关注文化体验', title:'真实，但不守旧。',
    needs:[['文化真实性','保留篆刻的正规规范，包括刀法、章法与篆字规范，避免过度娱乐化。'],['文化创新性','在尊重传统的同时，获得更多创新与创意的文化体验。']]
  },
  gift: {
    traits:'寻找有品味的礼品 · 喜爱文化属性', title:'独特，也要简单。',
    needs:[['应用低门槛','快速生成印章，无需投入额外的专业学习成本。'],['个性化定制','让每一枚印章都独一无二，拥有专属的纪念意义。'],['商品多样性','不只限于印章，也能延伸到丰富的文创与赠礼选择。']]
  }
};

function renderAudience(name) {
  const data = audiences[name];
  const panel = document.querySelector('#audiencePanel');
  panel.classList.toggle('gift', name === 'gift');
  document.querySelector('#audienceTraits').textContent = data.traits;
  document.querySelector('#audienceTitle').textContent = data.title;
  const list = document.querySelector('#audienceNeeds');
  list.innerHTML = data.needs.map(([title,copy]) => `<div class="need-item"><b>${title}</b><p>${copy}</p></div>`).join('');
}

document.querySelectorAll('.audience-tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('.audience-tab').forEach(item => item.classList.toggle('active', item === tab));
  renderAudience(tab.dataset.audience);
}));
renderAudience('culture');

const journey = [
  {name:'认知阶段',emotion:'⌣',behavior:'通过线下文化馆展览\n社交媒体广告首次接触',touch:'线下体验馆\n朋友圈广告',pain:'对篆刻文化陌生\n认为“传统＝复杂”',opportunity:'文化破冰：线下体验区设置“3分钟刻章”互动装置，直观展示零门槛；线上突出 AI 智能设计优势。'},
  {name:'探索阶段',emotion:'—',behavior:'打开小程序或官网\n尝试输入文字生成篆字',touch:'小程序\n官网首页',pain:'面对多种篆体风格\n不知道如何选择',opportunity:'降低决策成本：AI 根据输入内容推荐匹配的篆体风格，例如姓名章推荐汉印风格。'},
  {name:'创作阶段',emotion:'⌄',behavior:'调整篆字布局\n篆面纹样并预览效果',touch:'在线设计工具\nAR 预览',pain:'担心实物与屏幕显示\n存在色差或质感差异',opportunity:'所见即所得：使用 AR 实时渲染铜、玉石、木材等印章材质与光影效果。'},
  {name:'交付阶段',emotion:'⌢',behavior:'线上下单支付并物流配送\n或线下直接体验并支付',touch:'订单页\n线下摊位',pain:'传统篆刻制作周期长\n对快速交付存在疑虑',opportunity:'透明化追踪：展示实时生产进度，并明确平均 24 小时内发货的服务承诺。'},
  {name:'分享阶段',emotion:'◇',behavior:'收到印章后开始使用\n并分享至社交平台',touch:'实体印章\n数字印章',pain:'缺乏社交货币属性\n分享动力不足',opportunity:'实物衍生：获取数字藏品链接，并将篆印图案一键应用于手机壳、礼盒或服饰等商品。'}
];

const journeyNav = document.querySelector('#journeyNav');
journey.forEach((item,index) => {
  const button = document.createElement('button');
  button.type = 'button'; button.textContent = item.name; button.dataset.index = index;
  button.addEventListener('click', () => renderJourney(index)); journeyNav.append(button);
});
function renderJourney(index) {
  const item = journey[index];
  document.querySelectorAll('#journeyNav button').forEach((button,i) => button.classList.toggle('active', i === index));
  document.querySelector('#journeyIndex').textContent = String(index + 1).padStart(2,'0');
  document.querySelector('#journeyName').textContent = item.name;
  document.querySelector('#journeyEmotion').textContent = item.emotion;
  document.querySelector('#journeyBehavior').textContent = item.behavior;
  document.querySelector('#journeyTouchpoint').textContent = item.touch;
  document.querySelector('#journeyPain').textContent = item.pain;
  document.querySelector('#journeyOpportunity').textContent = item.opportunity;
}
renderJourney(0);

const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
}), { threshold:.15 });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const offlineScreen = document.querySelector('#offlineScreen');
document.querySelectorAll('.offline-step').forEach(button => button.addEventListener('click', () => {
  if (button.classList.contains('active')) return;
  document.querySelectorAll('.offline-step').forEach(item => item.classList.toggle('active', item === button));
  offlineScreen.classList.add('switching');
  const next = new Image();
  next.onload = () => {
    offlineScreen.src = `assets/next-seal/${button.dataset.image}`;
    offlineScreen.alt = button.dataset.alt;
    requestAnimationFrame(() => offlineScreen.classList.remove('switching'));
  };
  next.src = `assets/next-seal/${button.dataset.image}`;
}));
