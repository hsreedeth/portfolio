const specializations = [
  'Clinical data science',
  'Health data analytics',
  'Biomedical machine learning',
  'Biostatistics',
  'Patient stratification',
  'Disease pattern analysis',
  'Unsupervised learning',
  'Survival analysis',
  'Risk modelling',
  'Predictive modelling',
  'Cohort design',
  'Clinical data harmonization',
  'Data cleaning and QC',
  'Reproducible research',
  'End to end ML pipelines',
  'Model validation',
  'Explainable machine learning',
  'Interpretable analytics',
  'Cheminformatics',
  'Bioinformatics',
  'Pharmacogenomics',
  'Clinical reporting',
  'Python',
  'R',
  'SQL',
  'Data visualization',
  'Statistical modelling',
  'Feature engineering',
  'Experimental design',
  'Version control and Git'
];

document.addEventListener('DOMContentLoaded', () => {
  const specializationFlash = document.getElementById('specialization-flash');
  const introSection = document.querySelector('main');
  const projectsSection = document.getElementById('projects');
  const viewProjectsButton = document.querySelector('.view-projects-button');
  const viewProjectsButtonLabel = document.querySelector('.view-projects-button__label');

  if (!specializationFlash) {
    return;
  }

  let specializationIndex = 0;
  const fadeDurationMs = 180;
  const displayDurationMs = 1450;

  function showNextSpecialization() {
    specializationFlash.classList.add('is-fading');

    window.setTimeout(() => {
      specializationIndex = (specializationIndex + 1) % specializations.length;
      specializationFlash.textContent = specializations[specializationIndex];
      specializationFlash.classList.remove('is-fading');
    }, fadeDurationMs);
  }

  window.setInterval(showNextSpecialization, displayDurationMs);

  if (!introSection || !projectsSection) {
    return;
  }

  let isSnapScrolling = false;
  let touchStartY = null;
  const wheelThreshold = 8;
  const touchThreshold = 24;
  const snapCooldownMs = 900;

  function sectionTop(section) {
    return section.getBoundingClientRect().top + window.scrollY;
  }

  function isNearProjects() {
    return window.scrollY >= sectionTop(projectsSection) - 80;
  }

  function updateProjectsButtonState() {
    if (!viewProjectsButton || !viewProjectsButtonLabel) {
      return;
    }

    const atProjects = isNearProjects();
    viewProjectsButton.classList.toggle('is-up', atProjects);
    viewProjectsButtonLabel.textContent = atProjects ? 'Go to Top' : 'View Projects';
    viewProjectsButton.setAttribute('aria-label', atProjects ? 'Go to top' : 'View projects');
  }

  function snapTo(section) {
    isSnapScrolling = true;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });

    window.setTimeout(() => {
      isSnapScrolling = false;
      updateProjectsButtonState();
    }, snapCooldownMs);
  }

  function handleDirectionalSnap(direction) {
    if (isSnapScrolling) {
      return true;
    }

    if (direction > 0 && !isNearProjects()) {
      snapTo(projectsSection);
      return true;
    }

    if (direction < 0 && isNearProjects()) {
      snapTo(introSection);
      return true;
    }

    return false;
  }

  window.addEventListener('wheel', event => {
    if (Math.abs(event.deltaY) < wheelThreshold) {
      return;
    }

    if (handleDirectionalSnap(Math.sign(event.deltaY))) {
      event.preventDefault();
    }
  }, { passive: false });

  window.addEventListener('touchstart', event => {
    touchStartY = event.touches[0]?.clientY ?? null;
  }, { passive: true });

  window.addEventListener('touchmove', event => {
    if (touchStartY === null) {
      return;
    }

    const currentY = event.touches[0]?.clientY;

    if (typeof currentY !== 'number') {
      return;
    }

    const deltaY = touchStartY - currentY;

    if (Math.abs(deltaY) < touchThreshold) {
      return;
    }

    if (handleDirectionalSnap(Math.sign(deltaY))) {
      event.preventDefault();
      touchStartY = null;
    }
  }, { passive: false });

  window.addEventListener('touchend', () => {
    touchStartY = null;
  }, { passive: true });

  if (viewProjectsButton) {
    viewProjectsButton.addEventListener('click', event => {
      event.preventDefault();
      snapTo(isNearProjects() ? introSection : projectsSection);
    });
  }

  window.addEventListener('scroll', updateProjectsButtonState, { passive: true });
  updateProjectsButtonState();
});
