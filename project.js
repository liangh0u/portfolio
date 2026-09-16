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
    ['完成一方印', '保存数字印面，继续选择印石并进入实体制作。', 'ui-result.png']
  ],
  bilingual: [
    ['选择创作方式', '用中英印连接两种文字系统。', 'ui-home.png'],
    ['输入双语内容', '输入中文与英文，系统自动给出适合印面的初始组合。', 'ui-bilingual-input.png'],
    ['安排版式', '选择横排、竖排或组合布局，建立中英文的视觉秩序。', 'ui-bilingual-layout.png'],
    ['调整生成参数', '在传统篆意与现代可读性之间进行精细控制。', 'ui-bilingual-adjust.png'],
    ['完成一方印', '保存数字印面，继续选择印石并进入实体制作。', 'ui-result.png']
  ]
};

const flowPanel = document.querySelector('#flowPanel');
const screen = document.querySelector('#phoneScreen');
const pathLabels = {
  text:['文字印','Text Seal'],
  portrait:['肖形印','Portrait Seal'],
  bilingual:['中英印','Bilingual Seal']
};
let activePath = null;
let activeStep = 0;

function switchScreen(file, index) {
  if (screen.dataset.file === file) return;
  screen.classList.add('switching');
  const preload = new Image();
  preload.onload = () => {
    screen.src = `assets/next-seal/${file}`;
    screen.dataset.file = file;
    screen.alt = `NEXT Seal app step ${index + 1}`;
    requestAnimationFrame(() => screen.classList.remove('switching'));
  };
  preload.src = `assets/next-seal/${file}`;
}

function renderFlow() {
  if (!activePath) {
    flowPanel.innerHTML = `<div class="flow-copy"><span>Step 01</span><h3>选择创作方式</h3><p>选择一种印章类型，进入对应的创作流程。</p></div><div class="flow-choices">${Object.entries(pathLabels).map(([key,[cn,en]],index) => `<button type="button" data-choose="${key}"><span>0${index + 1}</span><b>${cn}</b><small>${en}</small><i>→</i></button>`).join('')}</div>`;
    switchScreen('ui-home.png', 0);
    return;
  }

  const [title, copy, image] = paths[activePath][activeStep];
  flowPanel.innerHTML = `<div class="flow-copy"><span>Step ${String(activeStep + 1).padStart(2,'0')}</span><small>${pathLabels[activePath][0]} · ${pathLabels[activePath][1]}</small><h3>${title}</h3><p>${copy}</p></div><div class="flow-actions"><button type="button" data-action="previous"><span>←</span><b>上一步</b></button><button type="button" data-action="next" ${activeStep === paths[activePath].length - 1 ? 'disabled' : ''}><span>→</span><b>${activeStep === paths[activePath].length - 1 ? '流程完成' : '下一步'}</b></button></div><button class="flow-restart" type="button" data-action="restart">重新选择创作方式</button>`;
  switchScreen(image, activeStep);
}

function transitionFlow(update) {
  flowPanel.classList.add('is-changing');
  window.setTimeout(() => {
    update();
    renderFlow();
    requestAnimationFrame(() => flowPanel.classList.remove('is-changing'));
  }, 180);
}

flowPanel.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button || button.disabled) return;
  if (button.dataset.choose) transitionFlow(() => { activePath = button.dataset.choose; activeStep = 1; });
  if (button.dataset.action === 'previous') transitionFlow(() => { if (activeStep === 1) { activePath = null; activeStep = 0; } else activeStep -= 1; });
  if (button.dataset.action === 'next') transitionFlow(() => { activeStep += 1; });
  if (button.dataset.action === 'restart') transitionFlow(() => { activePath = null; activeStep = 0; });
});

renderFlow();

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
