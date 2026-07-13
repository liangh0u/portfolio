const STORAGE_KEY = 'hou-portfolio-projects-v1';

const seedProjects = [
  { id:'seed-1', category:'ux', title:'Mori — Mindful Living', year:'2026', description:'A calmer digital companion for daily routines and personal wellbeing.', image:'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1400&q=85' },
  { id:'seed-2', category:'ux', title:'Transit, Reimagined', year:'2025', description:'Wayfinding and mobile experience for a more legible urban journey.', image:'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1400&q=85' },
  { id:'seed-3', category:'ux', title:'Kinfolk Archive', year:'2024', description:'An editorial archive built around discovery, restraint and reading.', image:'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1400&q=85' },
  { id:'seed-4', category:'ux', title:'Quiet Finance', year:'2023', description:'Making everyday financial decisions understandable and less stressful.', image:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85' },
  { id:'seed-5', category:'industrial', title:'Still Lamp 01', year:'2025', description:'A softly diffused table lamp shaped by honest materials and simple gestures.', image:'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1400&q=85' },
  { id:'seed-6', category:'industrial', title:'Everyday Objects', year:'2024', description:'A family of tactile desk objects designed to age with use.', image:'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1400&q=85' },
  { id:'seed-7', category:'graphic', title:'Field Notes', year:'2025', description:'Identity and publication system for an independent cultural journal.', image:'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1400&q=85' },
  { id:'seed-8', category:'graphic', title:'Shiro / Brand System', year:'2023', description:'A quiet visual language for a contemporary Japanese tea house.', image:'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&w=1400&q=85' }
];

let customProjects = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let activeCategory = 'ux';
const labels = { ux:'UX Design', industrial:'Industrial Design', graphic:'Graphic Design' };
const grid = document.querySelector('#projectGrid');
const template = document.querySelector('#projectTemplate');
const editor = document.querySelector('#editor');
const form = document.querySelector('#projectForm');

function render() {
  const projects = [...customProjects, ...seedProjects].filter(p => p.category === activeCategory);
  grid.replaceChildren();
  projects.forEach((project, index) => {
    const card = template.content.cloneNode(true);
    const article = card.querySelector('article');
    const image = card.querySelector('img');
    image.src = project.image;
    image.alt = project.title;
    image.loading = 'lazy';
    card.querySelector('.project-index').textContent = String(index + 1).padStart(2, '0');
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
    grid.append(card);
  });
  document.querySelector('#sectionLabel').textContent = labels[activeCategory];
  document.querySelector('#projectCount').textContent = String(projects.length).padStart(2, '0');
  document.querySelector('#emptyState').hidden = projects.length > 0;
}

function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  customProjects = customProjects.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customProjects));
  render();
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file);
  });
}

document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => {
  activeCategory = tab.dataset.category;
  document.querySelectorAll('.tab').forEach(t => { t.classList.toggle('active', t === tab); t.setAttribute('aria-selected', String(t === tab)); });
  render();
}));

function openEditor() { form.reset(); form.elements.year.value = new Date().getFullYear(); form.elements.category.value = activeCategory; document.querySelector('#formError').textContent = ''; editor.showModal(); }
document.querySelector('#openEditor').addEventListener('click', openEditor);
document.querySelector('#emptyAdd').addEventListener('click', openEditor);
document.querySelector('#closeEditor').addEventListener('click', () => editor.close());
editor.addEventListener('click', e => { if (e.target === editor) editor.close(); });
document.querySelector('#coverInput').addEventListener('change', e => { document.querySelector('#coverName').textContent = e.target.files[0]?.name || 'Choose an image ＋'; });
document.querySelector('#attachmentInput').addEventListener('change', e => { document.querySelector('#attachmentName').textContent = e.target.files[0]?.name || 'Choose a file ＋'; });

form.addEventListener('submit', async e => {
  e.preventDefault();
  const data = new FormData(form), cover = data.get('cover'), attachment = data.get('attachment');
  const error = document.querySelector('#formError');
  if (cover.size > 4 * 1024 * 1024 || attachment.size > 5 * 1024 * 1024) { error.textContent = 'The selected file is too large.'; return; }
  try {
    const project = { id:`custom-${Date.now()}`, title:data.get('title').trim(), year:data.get('year').trim(), category:data.get('category'), description:data.get('description').trim(), image:await readFile(cover) };
    if (attachment.size) project.attachment = { name:attachment.name, data:await readFile(attachment) };
    customProjects.unshift(project);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(customProjects)); } catch { customProjects.shift(); error.textContent = 'Browser storage is full. Try a smaller image or attachment.'; return; }
    activeCategory = project.category;
    document.querySelectorAll('.tab').forEach(t => { t.classList.toggle('active', t.dataset.category === activeCategory); t.setAttribute('aria-selected', String(t.dataset.category === activeCategory)); });
    editor.close(); render();
  } catch { error.textContent = 'Could not read the selected file. Please try again.'; }
});

document.querySelector('#year').textContent = new Date().getFullYear();
render();
