document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmoothScroll();
  initContactForm();
  initCoachSignupForm();
});

function initMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    const lines = toggle.querySelectorAll('.hamburger-line');
    if (lines.length >= 3) {
      if (isOpen) {
        lines[0].style.transform = 'translateY(8px) rotate(45deg)';
        lines[1].style.opacity = '0';
        lines[2].style.transform = 'translateY(-8px) rotate(-45deg)';
      } else {
        lines[0].style.transform = '';
        lines[1].style.opacity = '';
        lines[2].style.transform = '';
      }
    }
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');
    let ok = true;

    if (!name?.value.trim() || name.value.trim().length < 2) ok = false;
    if (!email?.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) ok = false;
    if (!message?.value.trim() || message.value.trim().length < 10) ok = false;

    if (!ok) {
      e.preventDefault();
      alert('Please fill in name, a valid email, and a message (at least 10 characters).');
      return;
    }

    const action = form.getAttribute('action') || '';
    if (action.includes('YOUR_FORM_ID')) {
      e.preventDefault();
      const preferredDate = form.querySelector('#preferred-date')?.value || 'Not specified';
      const subject = encodeURIComponent(`Discovery Call Request from ${name.value}`);
      const body = encodeURIComponent(
        `Name: ${name.value}\nEmail: ${email.value}\nPreferred Date: ${preferredDate}\n\nMessage:\n${message.value}`
      );
      window.location.href = `mailto:hello@yourname.com?subject=${subject}&body=${body}`;
    }
  });
}

function initCoachSignupForm() {
  const form = document.getElementById('coach-signup-form');
  if (!form) return;

  const cvInput = document.getElementById('coach-cv');
  const dropZone = document.getElementById('cv-drop-zone');
  const fileNameEl = document.getElementById('cv-file-name');
  const submitBtn = document.getElementById('coach-submit-btn');
  const MAX_CV_SIZE = 5 * 1024 * 1024;
  const ALLOWED_EXT = /\.(pdf|doc|docx)$/i;

  function validateCvFile(file) {
    if (!file) return 'Please upload your CV.';
    if (file.size > MAX_CV_SIZE) return 'CV must be 5 MB or smaller.';
    if (!ALLOWED_EXT.test(file.name)) return 'CV must be a PDF, DOC, or DOCX file.';
    return null;
  }

  if (dropZone && cvInput) {
    dropZone.addEventListener('click', () => cvInput.click());
    cvInput.addEventListener('change', () => {
      const file = cvInput.files[0];
      const err = validateCvFile(file);
      if (err) {
        alert(err);
        cvInput.value = '';
        fileNameEl?.classList.add('hidden');
        dropZone.classList.remove('has-file');
        return;
      }
      if (fileNameEl) {
        fileNameEl.textContent = `Selected: ${file.name}`;
        fileNameEl.classList.remove('hidden');
      }
      dropZone.classList.add('has-file');
    });
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file) {
        const dt = new DataTransfer();
        dt.items.add(file);
        cvInput.files = dt.files;
        cvInput.dispatchEvent(new Event('change'));
      }
    });
  }

  form.addEventListener('submit', (e) => {
    const cvErr = validateCvFile(cvInput?.files[0]);
    if (cvErr) {
      e.preventDefault();
      alert(cvErr);
      return;
    }

    const action = form.getAttribute('action') || '';
    if (action.includes('hello@yourname.com')) {
      e.preventDefault();
      alert(
        'Demo mode: form is not connected yet.\n\n' +
        'Update join.html form action to:\n' +
        'https://formsubmit.co/YOUR_EMAIL\n\n' +
        'Your questionnaire and CV fields validated successfully.'
      );
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    }
  });
}
