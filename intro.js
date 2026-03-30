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
  const projectsGrid = document.querySelector('.projects-grid');
  const viewProjectsButton = document.querySelector('.view-projects-button');
  const viewProjectsButtonLabel = document.querySelector('.view-projects-button__label');
  const contactMeButton = document.getElementById('contact-me-button');
  const clipboardToast = document.getElementById('clipboard-toast');
  let toastTimeoutId = null;

  function showClipboardToast(message) {
    if (!clipboardToast) {
      return;
    }

    clipboardToast.textContent = message;
    clipboardToast.classList.add('is-visible');

    if (toastTimeoutId) {
      window.clearTimeout(toastTimeoutId);
    }

    toastTimeoutId = window.setTimeout(() => {
      clipboardToast.classList.remove('is-visible');
    }, 1800);
  }

  async function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        // Fall back to a hidden textarea when the Clipboard API is unavailable.
      }
    }

    const fallbackInput = document.createElement('textarea');
    fallbackInput.value = text;
    fallbackInput.setAttribute('readonly', '');
    fallbackInput.style.position = 'fixed';
    fallbackInput.style.opacity = '0';
    fallbackInput.style.pointerEvents = 'none';
    document.body.appendChild(fallbackInput);
    fallbackInput.focus();
    fallbackInput.select();

    let didCopy = false;

    try {
      didCopy = document.execCommand('copy');
    } finally {
      document.body.removeChild(fallbackInput);
    }

    return didCopy;
  }

  if (contactMeButton) {
    const contactEmail = contactMeButton.dataset.email?.trim() || '';

    contactMeButton.addEventListener('click', async () => {
      if (!contactEmail) {
        return;
      }

      contactMeButton.textContent = contactEmail;
      contactMeButton.classList.add('is-revealed');
      contactMeButton.setAttribute('aria-label', `Email address: ${contactEmail}`);

      try {
        const didCopy = await copyTextToClipboard(contactEmail);
        showClipboardToast(didCopy ? 'Email has been copied.' : 'Unable to copy email automatically.');
      } catch (error) {
        showClipboardToast('Unable to copy email automatically.');
      }
    });
  }

  if (specializationFlash) {
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
  }

  if (!introSection || !projectsSection) {
    return;
  }

  let isSnapScrolling = false;
  let isProjectsActive = false;
  let touchStartY = null;
  const wheelThreshold = 8;
  const touchThreshold = 24;
  const snapCooldownMs = 900;

  function sectionTop(section) {
    return section.getBoundingClientRect().top + window.scrollY;
  }

  function updateProjectsButtonState() {
    if (!viewProjectsButton || !viewProjectsButtonLabel) {
      return;
    }

    viewProjectsButton.classList.toggle('is-up', isProjectsActive);
    viewProjectsButtonLabel.textContent = isProjectsActive ? 'GO TO TOP' : 'VIEW PROJECTS';
    viewProjectsButton.setAttribute('aria-label', isProjectsActive ? 'Go to top' : 'View projects');
    updateProjectsButtonPosition();
  }

  function updateProjectsButtonPosition() {
    if (!viewProjectsButton) {
      return;
    }

    if (!isProjectsActive || !projectsGrid) {
      viewProjectsButton.style.top = '';
      viewProjectsButton.style.bottom = '';
      return;
    }

    const gridRect = projectsGrid.getBoundingClientRect();
    const buttonHeight = viewProjectsButton.offsetHeight;
    const gapAbovePanels = 18;
    const minTop = 84;
    const desiredTop = Math.max(minTop, gridRect.top - buttonHeight - gapAbovePanels);

    viewProjectsButton.style.top = `${desiredTop}px`;
    viewProjectsButton.style.bottom = 'auto';
  }

  function snapTo(section) {
    isSnapScrolling = true;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });

    window.setTimeout(() => {
      isSnapScrolling = false;
      isProjectsActive = section === projectsSection;
      updateProjectsButtonState();
    }, snapCooldownMs);
  }

  function handleDirectionalSnap(direction) {
    if (isSnapScrolling) {
      return true;
    }

    if (direction > 0 && !isProjectsActive) {
      snapTo(projectsSection);
      return true;
    }

    if (direction < 0 && isProjectsActive) {
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
      snapTo(isProjectsActive ? introSection : projectsSection);
    });
  }

  if ('IntersectionObserver' in window) {
    const projectsObserver = new IntersectionObserver(entries => {
      const entry = entries[0];
      isProjectsActive = entry.isIntersecting && entry.intersectionRatio >= 0.35;
      updateProjectsButtonState();
    }, {
      threshold: [0.35, 0.55],
      rootMargin: '-10% 0px -20% 0px'
    });

    projectsObserver.observe(projectsSection);
  } else {
    window.addEventListener('scroll', () => {
      const projectsRect = projectsSection.getBoundingClientRect();
      isProjectsActive = projectsRect.top <= window.innerHeight * 0.45
        && projectsRect.bottom >= window.innerHeight * 0.35;
      updateProjectsButtonState();
    }, { passive: true });
  }

  window.addEventListener('scroll', updateProjectsButtonPosition, { passive: true });
  window.addEventListener('resize', updateProjectsButtonPosition);
  updateProjectsButtonState();
});
