document.querySelectorAll('a[href="#"]').forEach(link => {
  link.addEventListener('click', event => event.preventDefault());
});

const progressLinks = [...document.querySelectorAll('.page-progress a')];
const progressFill = document.querySelector('.progress-fill');
const progressSections = progressLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const setActiveSection = section => {
  const activeIndex = progressSections.indexOf(section);
  if (activeIndex < 0) return;

  progressLinks.forEach((link, index) => {
    const isActive = index === activeIndex;
    link.classList.toggle('is-active', isActive);
    if (isActive) link.setAttribute('aria-current', 'step');
    else link.removeAttribute('aria-current');
  });

  if (progressFill) {
    const progress = activeIndex / Math.max(progressSections.length - 1, 1);
    progressFill.style.height = `${progress * 100}%`;
  }
};

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    const visibleSections = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visibleSections[0]) setActiveSection(visibleSections[0].target);
  }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.1, 0.5] });

  progressSections.forEach(section => sectionObserver.observe(section));
}
