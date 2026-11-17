    // ==========================================
    // PASSWORD GATE FUNCTIONALITY
    // ==========================================
    const PASSWORD = 'Ntsako2005';
    const passwordGate = document.getElementById('passwordGate');
    const passwordForm = document.getElementById('passwordForm');
    const passwordInput = document.getElementById('passwordInput');
    const passwordError = document.getElementById('passwordError');
    const dashboardMenu = document.getElementById('dashboardMenu');

    let currentSection = 'dashboard';
    const appNav = document.getElementById('appNav');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function readSaved(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
      catch { return fallback; }
    }

    function checkUnlocked() {
      const isUnlocked = sessionStorage.getItem('loveUnlocked') === 'true';
      if (isUnlocked) {
        passwordGate.hidden = true;
        dashboardMenu.hidden = false;
        appNav.hidden = false;
      }
    }

    checkUnlocked();

    passwordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = passwordInput.value.trim();

      if (input === PASSWORD) {
        sessionStorage.setItem('loveUnlocked', 'true');
        passwordGate.hidden = true;
        dashboardMenu.hidden = false;
        passwordInput.value = '';
        appNav.hidden = false;
        navigateTo('dashboard');
      } else {
        passwordError.textContent = '❌ Wrong password. Try again!';
        passwordError.hidden = false;
        passwordGate.classList.add('shake');
        passwordInput.value = '';
        passwordInput.focus();

        setTimeout(() => {
          passwordGate.classList.remove('shake');
        }, 500);
      }
    });

    // ==========================================
    // NAVIGATION & SECTION SWITCHING
    // ==========================================
    function navigateTo(section) {
      if (!passwordGate.hidden) return;
      if (!['dashboard', 'her', 'him', 'ours'].includes(section)) section = 'dashboard';
      currentSection = section;
      document.body.dataset.section = section;
      document.querySelectorAll('.app-nav button').forEach((button) => {
        if (button.dataset.section === section) button.setAttribute('aria-current', 'page');
        else button.removeAttribute('aria-current');
      });
      window.scrollTo(0, 0);
      const herSection = document.getElementById('sectionHer');
      const himSection = document.getElementById('sectionHim');
      const oursSection = document.getElementById('sectionOurs');
      const dashboard = document.getElementById('dashboardMenu');

      // Hide all sections
      herSection.hidden = true;
      himSection.hidden = true;
      oursSection.hidden = true;
      dashboard.hidden = true;

      // Show selected section or dashboard
      if (section === 'her') {
        herSection.hidden = false;
        // Reinitialize background hearts for this section
        const heartsContainer = document.getElementById('heartsContainer');
        if (heartsContainer && heartsContainer.children.length === 0) {
          generateHearts(heartsContainer);
        }
      } else if (section === 'him') {
        himSection.hidden = false;
        const heartsContainer = document.getElementById('heartsContainerHim');
        if (heartsContainer && heartsContainer.children.length === 0) {
          generateHearts(heartsContainer);
        }
      } else if (section === 'ours') {
        oursSection.hidden = false;
        const heartsContainer = document.getElementById('heartsContainerOurs');
        if (heartsContainer && heartsContainer.children.length === 0) {
          generateHearts(heartsContainer);
        }
      } else if (section === 'dashboard') {
        dashboard.hidden = false;
      }
    }

    function generateHearts(container) {
      if (!container) return;
      container.innerHTML = '';
      for (let i = 0; i < 20; i++) {
        const heart = document.createElement('i');
        heart.className = `fa-solid fa-heart bg-heart`;
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.animationDelay = `${Math.random() * 8}s`;
        heart.style.animationDuration = `${6 + Math.random() * 6}s`;
        heart.style.fontSize = `${12 + Math.random() * 20}px`;
        container.appendChild(heart);
      }
    }

    // ==========================================
    // FROM HER SECTION - FLOATING HEARTS & KISSES
    // ==========================================
    const heartsContainer = document.getElementById('heartsContainer');
    if (heartsContainer) {
      generateHearts(heartsContainer);
    }

    const sendKissesButton = document.getElementById('sendKissesButton');
    if (sendKissesButton) {
      sendKissesButton.addEventListener('click', () => {
        if (reducedMotion.matches) return;
        const kissEmojis = ['💋', '😘', '😗', '😚'];

        for (let i = 0; i < 24; i++) {
          const kiss = document.createElement('span');
          kiss.className = 'falling-emoji';
          kiss.textContent = kissEmojis[Math.floor(Math.random() * kissEmojis.length)];
          kiss.style.left = `${Math.random() * 100}vw`;
          kiss.style.fontSize = `${24 + Math.random() * 24}px`;
          kiss.style.animationDuration = `${2.8 + Math.random() * 2.2}s`;
          kiss.style.animationDelay = `${Math.random() * 0.8}s`;
          document.body.appendChild(kiss);
          kiss.addEventListener('animationend', () => kiss.remove(), { once: true });
        }
      });
    }

    // ==========================================
    // FROM HER - LETTER MODAL CONTROLS
    // ==========================================
    const letterModal = document.getElementById('letterModal');
    const letterGate = document.getElementById('letterGate');
    const letterCard = document.getElementById('letterCard');
    const gateQuestion = document.getElementById('gateQuestion');
    const gateMessage = document.getElementById('gateMessage');
    const gateYes = document.getElementById('gateYes');
    const gateNo = document.getElementById('gateNo');
    let gateStep = 0;
    let letterTimer;
    let letterOpener;

    function openLetter() {
      window.clearTimeout(letterTimer);
      letterOpener = document.activeElement;
      gateStep = 0;
      gateQuestion.textContent = "I've got a letter for you. Do you want to read it?";
      gateQuestion.hidden = false;
      gateMessage.hidden = true;
      gateYes.hidden = false;
      gateNo.hidden = false;
      letterCard.hidden = true;
      letterGate.hidden = false;
      letterModal.classList.add('active');
      document.body.classList.add('modal-open');
      gateYes.focus();
    }

    function closeLetter() {
      window.clearTimeout(letterTimer);
      letterModal.classList.remove('active');
      document.body.classList.remove('modal-open');
      if (letterOpener) letterOpener.focus();
    }

    if (gateYes) {
      gateYes.addEventListener('click', () => {
        const nextPrompts = ['ARE YOU READY', 'are you sure?', 'sure sure sure'];

        if (gateStep < nextPrompts.length) {
          gateStep += 1;
          gateQuestion.textContent = nextPrompts[gateStep - 1];
          gateNo.hidden = true;
          return;
        }

        gateQuestion.hidden = true;
        gateMessage.textContent = 'Make sure you have a tissue because you are about to get emotional';
        gateMessage.hidden = false;
        gateYes.hidden = true;
        letterTimer = window.setTimeout(() => {
          letterGate.hidden = true;
          letterCard.hidden = false;
          letterCard.querySelector('.close-btn').focus();
        }, 2400);
      });
    }

    if (gateNo) {
      gateNo.addEventListener('click', () => {
        if (reducedMotion.matches) return;
        for (let i = 0; i < 18; i++) {
          const tear = document.createElement('span');
          tear.className = 'falling-emoji';
          tear.textContent = '😭';
          tear.style.left = `${Math.random() * 100}vw`;
          tear.style.fontSize = `${22 + Math.random() * 18}px`;
          tear.style.animationDuration = `${2.5 + Math.random() * 2}s`;
          tear.style.animationDelay = `${Math.random() * 0.7}s`;
          document.body.appendChild(tear);
          tear.addEventListener('animationend', () => tear.remove(), { once: true });
        }
      });
    }

    // ==========================================
    // FROM HER - JOURNEY CARD (FLIP)
    // ==========================================
    const journeyCard = document.getElementById('journeyCard');
    if (journeyCard) {
      journeyCard.addEventListener('click', () => {
        const isExpanded = journeyCard.getAttribute('aria-expanded') === 'true';
        journeyCard.setAttribute('aria-expanded', String(!isExpanded));
        journeyCard.classList.toggle('flipped', !isExpanded);
      });
    }

    // ==========================================
    // FROM HER - BUCKET LIST CHECKBOX TOGGLE
    // ==========================================
    function toggleCheck(item) {
      item.classList.toggle('checked');
      item.setAttribute('aria-checked', String(item.classList.contains('checked')));
      localStorage.setItem('ourBucketChecks', JSON.stringify(
        Array.from(bucketList.children, (entry) => entry.classList.contains('checked'))
      ));
    }

    // Add bucket-list ideas and keep them saved in this browser.
    const bucketList = document.querySelector('.checklist');
    const bucketListForm = document.getElementById('bucketListForm');
    const bucketListInput = document.getElementById('bucketListInput');
    const storedBucketItems = readSaved('ourBucketList', []);
    const savedBucketItems = Array.isArray(storedBucketItems)
      ? storedBucketItems.filter((text) => typeof text === 'string') : [];

    function makeCheckAccessible(item, checked = false) {
      item.tabIndex = 0;
      item.setAttribute('role', 'checkbox');
      item.classList.toggle('checked', checked);
      item.setAttribute('aria-checked', String(checked));
      item.addEventListener('keydown', (event) => {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault();
          item.click();
        }
      });
    }

    function addBucketItem(text, save = true) {
      if (!bucketList) return;
      const item = document.createElement('li');
      item.className = 'checklist-item';
      const checkbox = document.createElement('div');
      checkbox.className = 'checkbox';
      const label = document.createElement('span');
      label.textContent = text;
      item.append(checkbox, label);
      item.addEventListener('click', () => toggleCheck(item));
      bucketList.appendChild(item);
      makeCheckAccessible(item);

      if (save) {
        savedBucketItems.push(text);
        localStorage.setItem('ourBucketList', JSON.stringify(savedBucketItems));
      }
    }

    if (bucketList) {
      savedBucketItems.forEach((text) => addBucketItem(text, false));
      const checks = readSaved('ourBucketChecks', []);
      Array.from(bucketList.children).forEach((item, index) => {
        // Added items already have keyboard handlers.
        if (item.hasAttribute('role')) {
          item.classList.toggle('checked', Array.isArray(checks) && checks[index] === true);
          item.setAttribute('aria-checked', String(item.classList.contains('checked')));
        } else makeCheckAccessible(item, Array.isArray(checks) && checks[index] === true);
      });

      if (bucketListForm) {
        bucketListForm.addEventListener('submit', (event) => {
          event.preventDefault();
          const text = bucketListInput.value.trim();
          if (!text) return;
          addBucketItem(text);
          bucketListForm.reset();
          bucketListInput.focus();
        });
      }
    }

    // ==========================================
    // FROM HER - INTERACTIVE LOVE COUNTER WITH FALLING HEARTS
    // ==========================================
    const storedLove = readSaved('ourLoveCount', 0);
    let loveCount = Number.isSafeInteger(storedLove) && storedLove >= 0 ? storedLove : 0;
    document.getElementById('lovePercentage').textContent = `${loveCount}%`;
    function sendLove() {
      loveCount += 100;
      localStorage.setItem('ourLoveCount', JSON.stringify(loveCount));
      const lovePercentage = document.getElementById('lovePercentage');
      if (lovePercentage) {
        lovePercentage.textContent = `${loveCount}%`;
      }

      // Release a shower of hearts from the top of the screen.
      if (reducedMotion.matches) return;
      for (let i = 0; i < 14; i++) {
        const heart = document.createElement('i');
        heart.className = 'fa-solid fa-heart falling-heart';
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.fontSize = `${16 + Math.random() * 20}px`;
        heart.style.animationDuration = `${2.5 + Math.random() * 2}s`;
        heart.style.animationDelay = `${Math.random() * 0.8}s`;
        document.body.appendChild(heart);
        heart.addEventListener('animationend', () => heart.remove(), { once: true });
      }
    }

    // Called by Android's system Back gesture and by Escape in browser previews.
    window.handleAndroidBack = function () {
      if (letterModal.classList.contains('active')) {
        closeLetter();
        return true;
      }
      if (currentSection !== 'dashboard') {
        navigateTo('dashboard');
        return true;
      }
      return false;
    };

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') window.handleAndroidBack();
      if (event.key === 'Tab' && letterModal.classList.contains('active')) {
        const buttons = Array.from(letterModal.querySelectorAll('button'))
          .filter((button) => button.getClientRects().length > 0);
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (!first) { event.preventDefault(); letterModal.focus(); }
        else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }
    });

    document.querySelectorAll('.flip-card, .envelope-wrapper').forEach((card) => {
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault(); card.click();
        }
      });
    });

    if (passwordGate.hidden) navigateTo('dashboard');
