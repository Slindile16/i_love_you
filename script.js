
    // 1. Generate Floating Hearts Background
    const heartsContainer = document.getElementById('heartsContainer');
    const heartIcons = ['fa-heart', 'fa-sparkles', 'fa-heart-pulse'];

    for (let i = 0; i < 20; i++) {
      const heart = document.createElement('i');
      heart.className = `fa-solid fa-heart bg-heart`;
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.animationDelay = `${Math.random() * 8}s`;
      heart.style.animationDuration = `${6 + Math.random() * 6}s`;
      heart.style.fontSize = `${12 + Math.random() * 20}px`;
      heartsContainer.appendChild(heart);
    }

    document.getElementById('sendKissesButton').addEventListener('click', () => {
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

    // 2. Letter Modal Controls
    const letterModal = document.getElementById('letterModal');
    const letterGate = document.getElementById('letterGate');
    const letterCard = document.getElementById('letterCard');
    const gateQuestion = document.getElementById('gateQuestion');
    const gateMessage = document.getElementById('gateMessage');
    const gateYes = document.getElementById('gateYes');
    const gateNo = document.getElementById('gateNo');
    let gateStep = 0;

    function openLetter() {
      gateStep = 0;
      gateQuestion.textContent = "I've got a letter for you. Do you want to read it?";
      gateQuestion.hidden = false;
      gateMessage.hidden = true;
      gateYes.hidden = false;
      gateNo.hidden = false;
      letterCard.hidden = true;
      letterGate.hidden = false;
      letterModal.classList.add('active');
    }

    function closeLetter() {
      letterModal.classList.remove('active');
    }

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
      window.setTimeout(() => {
        letterGate.hidden = true;
        letterCard.hidden = false;
      }, 2400);
    });

    gateNo.addEventListener('click', () => {
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

    const journeyCard = document.getElementById('journeyCard');

    journeyCard.addEventListener('click', () => {
      const isExpanded = journeyCard.getAttribute('aria-expanded') === 'true';
      journeyCard.setAttribute('aria-expanded', String(!isExpanded));
      journeyCard.classList.toggle('flipped', !isExpanded);
    });

    // 3. Bucket List Checkbox Toggle
    function toggleCheck(item) {
      item.classList.toggle('checked');
    }

    // Add bucket-list ideas and keep them saved in this browser.
    const bucketList = document.querySelector('.checklist');
    const bucketListForm = document.getElementById('bucketListForm');
    const bucketListInput = document.getElementById('bucketListInput');
    const savedBucketItems = JSON.parse(localStorage.getItem('ourBucketList') || '[]');

    function addBucketItem(text, save = true) {
      const item = document.createElement('li');
      item.className = 'checklist-item';
      const checkbox = document.createElement('div');
      checkbox.className = 'checkbox';
      const label = document.createElement('span');
      label.textContent = text;
      item.append(checkbox, label);
      item.addEventListener('click', () => toggleCheck(item));
      bucketList.appendChild(item);

      if (save) {
        savedBucketItems.push(text);
        localStorage.setItem('ourBucketList', JSON.stringify(savedBucketItems));
      }
    }

    savedBucketItems.forEach((text) => addBucketItem(text, false));

    bucketListForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const text = bucketListInput.value.trim();
      if (!text) return;
      addBucketItem(text);
      bucketListForm.reset();
      bucketListInput.focus();
    });

    // 4. Interactive Love Counter with Falling Hearts
    let loveCount = 0;
    function sendLove() {
      loveCount += 100;
      document.getElementById('lovePercentage').textContent = `${loveCount}%`;

      // Release a shower of hearts from the top of the screen.
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
  
