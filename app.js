А это что? 
document.addEventListener('DOMContentLoaded', () => {

  const DEFAULT_CATS = {
    food:       { emoji: '🛒',  name: 'Продукты',       type: 'expense', budget: null, keywords: ['продукты','магнит','пятёрочка','пятак','чижик','находка','светофор','вкусвилл','хавчик','еда','жрачка','лента','ашан','перекресток','дикси'] },
    cafe:       { emoji: '🍔',  name: 'Кафе/фастфуд',   type: 'expense', budget: null, keywords: ['мак','кфс','бургер','пекарня','ростикс','вкусно','кофе','обед','кафе','ресторан','пицца','суши','шаурма','завтрак','ужин','перекус','чай','донер','фастфуд','столовая'] },
    transport:  { emoji: '🚕',  name: 'Транспорт',      type: 'expense', budget: null, keywords: ['такси','метро','автобус','каршеринг','проезд','билет','электричка','самокат','яндекс го','троллейбус','трамвай'] },
    bensin:     { emoji: '⛽',  name: 'Бензин',          type: 'expense', budget: null, keywords: ['бенз','бензин','заправка','лукоил','тебоил','татнефть','таиф','азс','95','92','100'] },
    auto:       { emoji: '🚗',  name: 'Авто',            type: 'expense', budget: null, keywords: ['запчасти','ремонт','шинка','шиномонтаж','авто','машина'] },
    home:       { emoji: '🏠',  name: 'Для дома',        type: 'expense', budget: null, keywords: ['мегастрой','леруа','лерой','стройка','обои','аренда','квартира','жкх','коммуналка','мебель','икеа','дом','быт','химия','бытовуха','посуда'] },
    credit:     { emoji: '💳',  name: 'Кредиты',         type: 'expense', budget: null, keywords: ['ипотека','займ','кредит'] },
    gosuslugi:  { emoji: '🏛️', name: 'Госуслуги',       type: 'expense', budget: null, keywords: ['штраф','налог','госпошлина'] },
    clothes:    { emoji: '👕',  name: 'Одежда',          type: 'expense', budget: null, keywords: ['шмот','обувь','тапки','спортмастер','одежда','кроссовки','кроссы','шмотки','футболка','джинсы'] },
    internet:   { emoji: '📱',  name: 'Интернет/связь',  type: 'expense', budget: null, keywords: ['домру','таттелеком','мобила','теле2','мтс','мегафон','связь','интернет'] },
    tobacco:    { emoji: '🚬',  name: 'Табак',           type: 'expense', budget: null, keywords: ['сиги','сишки','сигареты','вейп','айкос','стик','снюс','табак','сих','шихн'] },
    alcohol:    { emoji: '🍺',  name: 'Алкоголь',        type: 'expense', budget: null, keywords: ['кб','бристоль','пиво','бар','пивас','алкоголь','вино','водка','виски','коньяк','сидр','пивко'] },
    health:     { emoji: '💊',  name: 'Здоровье',        type: 'expense', budget: null, keywords: ['аптека','врач','таблетки','лекарства','анализы','стоматолог','больница','здоровье'] },
    insurance:  { emoji: '🛡️', name: 'Страхование',     type: 'expense', budget: null, keywords: ['страховка'] },
    kids:       { emoji: '👶',  name: 'Для детей',       type: 'expense', budget: null, keywords: ['дм','детский мир','дети','ребенок','детишки','подгузники','памперсы','игрушки'] },
    sport:      { emoji: '🏋️', name: 'Спорт',           type: 'expense', budget: null, keywords: ['рыбалка','фитнес','спортзал','качалка'] },
    fun:        { emoji: '🎉',  name: 'Развлечения',     type: 'expense', budget: null, keywords: ['кино','игра','концерт','театр','подписка','нетфликс','развлечения','гулянка'] },
    shop:       { emoji: '🛍️', name: 'Покупки',         type: 'expense', budget: null, keywords: ['озон','вайлдберриз','маркет','покупки'] },
    pets:       { emoji: '🐾',  name: 'Питомцы',         type: 'expense', budget: null, keywords: ['корм','ветеринар','зоомагазин','наполнитель','vet'] },
    beauty:     { emoji: '💅',  name: 'Красота',         type: 'expense', budget: null, keywords: ['салон','стрижка','маникюр','косметика','спа','барбер'] },
    education:  { emoji: '📚',  name: 'Образование',     type: 'expense', budget: null, keywords: ['курсы','книги','репетитор','обучение','школа'] },
    investment: { emoji: '📈',  name: 'Инвестиции',      type: 'expense', budget: null, keywords: ['брокер','акции','вклад','инвестиции'] },
    other:      { emoji: '📦',  name: 'Другое',          type: 'expense', budget: null, keywords: [] },
    salary:     { emoji: '💼', name: 'Зарплата', type: 'income', budget: null, keywords: ['зарплата','аванс','зп'] },
    gift:       { emoji: '🎁', name: 'Подарок',  type: 'income', budget: null, keywords: ['подарок','подарили'] },
    cashback:   { emoji: '💸', name: 'Кэшбэк',   type: 'income', budget: null, keywords: ['кэшбэк','cashback','бонус'] },
    other_inc:  { emoji: '💰', name: 'Другое',   type: 'income', budget: null, keywords: [] }
  };

  const V2_IDS = ['food','cafe','transport','bensin','auto','home','credit','gosuslugi','clothes','internet','tobacco','alcohol','health','insurance','kids','sport','fun','shop','other','salary','gift','cashback','other_inc'];
  const V3_NEW_IDS = ['pets','beauty','education','investment'];

  window.categories = JSON.parse(localStorage.getItem('categories') || 'null') || JSON.parse(JSON.stringify(DEFAULT_CATS));
  
  const CATS_VERSION = 4; // Версия 4 для принудительного обновления ключевых слов
  const currentCatsVersion = parseInt(localStorage.getItem('catsVersion') || '0');
  if (currentCatsVersion < CATS_VERSION) {
    if (currentCatsVersion < 2) {
      if (window.categories.food && window.categories.food.name === 'Еда') {
        window.categories.food.name = 'Продукты';
        window.categories.food.emoji = '🛒';
      }
      if (window.categories.home && window.categories.home.name === 'Дом') {
        window.categories.home.name = 'Для дома';
      }
      V2_IDS.forEach(id => {
        if (!window.categories[id] && DEFAULT_CATS[id]) {
          window.categories[id] = JSON.parse(JSON.stringify(DEFAULT_CATS[id]));
        }
      });
    }
    if (currentCatsVersion < 3) {
      const missing = V3_NEW_IDS.filter(id => !window.categories[id]);
      if (missing.length > 0) {
        const rebuilt = {};
        let insertedBeforeOther = false;
        Object.entries(window.categories).forEach(([id, cat]) => {
          if (id === 'other' && !insertedBeforeOther) {
            missing.forEach(nid => { rebuilt[nid] = JSON.parse(JSON.stringify(DEFAULT_CATS[nid])); });
            insertedBeforeOther = true;
          }
          rebuilt[id] = cat;
        });
        if (!insertedBeforeOther) {
          missing.forEach(nid => { rebuilt[nid] = JSON.parse(JSON.stringify(DEFAULT_CATS[nid])); });
        }
        window.categories = rebuilt;
      }
    }
    if (currentCatsVersion < 4) {
      // Обновляем ключевые слова для ВСЕХ существующих категорий (сливаем с новыми)
      Object.entries(window.categories).forEach(([id, cat]) => {
        if (DEFAULT_CATS[id] && cat) {
          const userKw = cat.keywords || [];
          const defKw = DEFAULT_CATS[id].keywords || [];
          cat.keywords = [...new Set([...userKw, ...defKw])];
        }
      });
    }
    localStorage.setItem('catsVersion', CATS_VERSION.toString());
    localStorage.setItem('categories', JSON.stringify(window.categories));
  }

  // === SANITIZE DATA ===
  window.transactions  = JSON.parse(localStorage.getItem('transactions')  || '[]');
  window.hiddenFilters = JSON.parse(localStorage.getItem('hiddenFilters') || '[]');
  window.fixedExpenses = JSON.parse(localStorage.getItem('fixedExpenses') || '[]');
  window.goals         = JSON.parse(localStorage.getItem('goals') || 'null');
  
  if (!Array.isArray(window.transactions)) window.transactions = [];
  if (!Array.isArray(window.hiddenFilters)) window.hiddenFilters = [];
  if (!Array.isArray(window.fixedExpenses)) window.fixedExpenses = [];
  if (!Array.isArray(window.goals)) window.goals = [];

  window.transactions = window.transactions.filter(t => t && typeof t === 'object');
  window.goals = window.goals.filter(g => g && typeof g === 'object');
  window.fixedExpenses = window.fixedExpenses.filter(fx => fx && typeof fx === 'object');
  
  if (typeof window.categories !== 'object' || window.categories === null) window.categories = {};
  Object.keys(window.categories).forEach(k => {
    if (!window.categories[k] || typeof window.categories[k] !== 'object') {
      delete window.categories[k];
    } else {
      if (!Array.isArray(window.categories[k].keywords)) window.categories[k].keywords = [];
    }
  });

  if (!window.goals.length) {
    const oldGoal = JSON.parse(localStorage.getItem('goal') || 'null');
    window.goals = oldGoal ? [{ id: Date.now(), ...oldGoal }] : [{ id: Date.now(), name: 'Отпуск', target: 200000 }];
    localStorage.removeItem('goal'); localStorage.setItem('goals', JSON.stringify(window.goals));
  }
  window.transactions.forEach(t => { if (t.category === 'goal_cat' && !t.goalId) t.goalId = window.goals[0].id; });

  window.save = function() {
    localStorage.setItem('categories', JSON.stringify(window.categories));
    localStorage.setItem('transactions', JSON.stringify(window.transactions));
    localStorage.setItem('goals', JSON.stringify(window.goals));
    localStorage.setItem('hiddenFilters', JSON.stringify(window.hiddenFilters));
    localStorage.setItem('fixedExpenses', JSON.stringify(window.fixedExpenses));
  };

  // === УМНЫЙ ПОИСК КАТЕГОРИИ ПО ОПИСАНИЮ ===
  window.findCategoryByTitle = function(title, type) {
    if (!title) return null;
    const lowerText = title.toLowerCase();
    let foundCatId = null, bestLen = 0;
    for (const [id, cat] of Object.entries(window.categories)) {
      if (!cat || cat.type !== type) continue;
      const n = cat.name.toLowerCase();
      if (lowerText.includes(n) && n.length > bestLen) { foundCatId = id; bestLen = n.length; }
      for (const kw of (cat.keywords || [])) {
        if (lowerText.includes(kw) && kw.length > bestLen) { foundCatId = id; bestLen = kw.length; }
      }
    }
    return foundCatId;
  };

  const fallbackExpense = window.categories['other'] ? 'other' : (Object.keys(window.categories).find(k => window.categories[k].type === 'expense') || 'other');
  const fallbackIncome = window.categories['other_inc'] ? 'other_inc' : (Object.keys(window.categories).find(k => window.categories[k].type === 'income') || 'salary');
  let orphansFixed = false;

  // 1. Восстанавливаем "осиротевшие" транзакции
  window.transactions.forEach(t => {
    if (t.category !== 'goal_cat' && !window.categories[t.category]) {
      const matchedId = window.findCategoryByTitle(t.title, t.type);
      t.category = matchedId || (t.type === 'income' ? fallbackIncome : fallbackExpense);
      orphansFixed = true;
    }
  });
  window.fixedExpenses.forEach(fx => {
    if (!window.categories[fx.categoryId]) {
      const matchedId = window.findCategoryByTitle(fx.title, 'expense');
      fx.categoryId = matchedId || fallbackExpense;
      orphansFixed = true;
    }
  });

  // 2. ПЕРЕСОРТИРОВКА старых транзакций из "Другое"
  window.transactions.forEach(t => {
    if (t.category === 'other' || t.category === 'other_inc') {
      const betterCat = window.findCategoryByTitle(t.title, t.type);
      if (betterCat && betterCat !== 'other' && betterCat !== 'other_inc') {
        t.category = betterCat;
        orphansFixed = true;
      }
    }
  });

  if (orphansFixed) window.save();

  window.activeFilter = 'all';
  window.currentType = 'expense';
  window.editingCatId = null;
  window.editingFixedId = null;
  window.editingTxId = null;
  window.editingGoalId = null;
  window.pickedEmoji = '🍔';
  window.confirmAction = null;
  window.statsPeriod = 'all';
  window.statsKind = 'expense';
  window.statsCategoryFilter = null;
  let forcedByPlus = false;
  let tempDeletedItem = null;

  const EMOJI_CHOICES = ['🍔','🚕','🏠','💊','🎉','🛍️','📦','☕','🍕','🍺','✈️','🎮','📚','🐾','👶','💻','🎵','🚗','⛽','💡','🧾','🎁','💅','🏋️','🚬','💍','🏦','📱','🎬','🌮','💼','💸','💰','💵','🏆','🤑','🎯','🛒','💳','🏛️','👕','🛡️','🍴','📈'];

  const $ = id => document.getElementById(id);
  const fmt = n => n.toLocaleString('ru-RU', { maximumFractionDigits: 2 });

  const TABS = ['home', 'stats', 'goals', 'profile'];
  let suppressPopstate = false;
  history.replaceState({ app: 'home' }, '');

  window.showModal = function(id) {
    if ($(id).classList.contains('show')) return;
    $(id).classList.add('show');
    history.pushState({ modal: id }, '');
  };
  
  window.closeModal = function(id) {
    if (history.state && history.state.modal === id) {
      suppressPopstate = true;
      history.back();
      setTimeout(() => { suppressPopstate = false; }, 200);
      const el = $(id);
      if (el) el.classList.remove('show');
    } else {
      const el = $(id);
      if (el) el.classList.remove('show');
    }
  };
  
  function internalSwitchTab(tab) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    $('page-' + tab).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
    $('fab').classList.toggle('hidden', tab === 'profile' || tab === 'goals');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  let lastHomeTap = 0;
  window.switchTab = tab => {
    if (tab === 'home' && $('page-home').classList.contains('active')) {
      const now = Date.now();
      if (now - lastHomeTap < 300) {
        if (confirm('Выйти из приложения?')) {
          window.close();
          setTimeout(() => { window.location.href = 'about:blank'; }, 100);
        }
        lastHomeTap = 0;
        return;
      }
      lastHomeTap = now;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if ($('page-' + tab).classList.contains('active')) return;
    internalSwitchTab(tab);
    if (tab !== 'home') history.pushState({ tab }, '');
  };

  function hideStatsCategoryView() {
    window.statsCategoryFilter = null;
    $('statsCategoriesView').style.display = 'block';
    $('statsHistoryHeader').style.display = 'none';
    $('statsHistoryView').style.display = 'none';
    $('kindSeg').style.display = 'grid';
    window.renderStats();
  }
  function showStatsCategoryView(catId) {
    window.statsCategoryFilter = catId;
    const cat = catId === 'goal_cat' ? { emoji: '🎯', name: 'Цели' } : window.categories[catId];
    $('statsCategoryName').textContent = `${cat.emoji} ${cat.name}`;
    $('statsCategoriesView').style.display = 'none';
    $('statsHistoryHeader').style.display = 'block';
    $('statsHistoryView').style.display = 'block';
    $('kindSeg').style.display = 'none';
    window.renderStats();
  }
  window.openCategoryStatsView = function(catId) {
    showStatsCategoryView(catId);
    history.pushState({ statsCategory: catId }, '');
  };
  window.closeStatsCategoryView = function() {
    hideStatsCategoryView();
    if (history.state && history.state.statsCategory) {
      suppressPopstate = true;
      history.back();
      setTimeout(() => { suppressPopstate = false; }, 200);
    }
  };

  window.addEventListener('popstate', (e) => {
    if (suppressPopstate) { suppressPopstate = false; return; }
    
    document.querySelectorAll('.modal-bg.show').forEach(m => {
      if (!e.state || e.state.modal !== m.id) {
        m.classList.remove('show');
      }
    });
    
    if (e.state && e.state.modal) {
      const prevModal = $(e.state.modal);
      if (prevModal) prevModal.classList.add('show');
    }
    
    if (window.statsCategoryFilter && (!e.state || !e.state.statsCategory)) { 
      hideStatsCategoryView(); 
    }
    
    if (e.state && e.state.tab) {
      internalSwitchTab(e.state.tab);
    } else if (!e.state || (!e.state.modal && !e.state.statsCategory)) {
      const activeTab = TABS.find(t => $('page-' + t).classList.contains('active'));
      if (activeTab && activeTab !== 'home') {
        internalSwitchTab('home');
      }
    }
  });

  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
      $('themeToggle').checked = true;
      document.querySelector('meta[name="theme-color"]').setAttribute('content', '#0f111a');
    } else {
      document.documentElement.removeAttribute('data-theme');
      $('themeToggle').checked = false;
      document.querySelector('meta[name="theme-color"]').setAttribute('content', '#4f46e5');
    }
  }
  window.toggleTheme = function() {
    const isDark = $('themeToggle').checked;
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      document.querySelector('meta[name="theme-color"]').setAttribute('content', '#0f111a');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      document.querySelector('meta[name="theme-color"]').setAttribute('content', '#4f46e5');
    }
  };

  window.escapeHtml = s => { if (!s) return ''; const d = document.createElement('div'); d.textContent = s; return d.innerHTML; };
  let toastTimer;
  window.toast = function(msg) { const el = $('toast'); el.innerHTML = msg; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 3000); };
  window.askConfirm = (title, text, okLabel, action) => {
    $('confirmTitle').textContent = title;
    $('confirmText').textContent = text;
    $('confirmOk').textContent = okLabel;
    window.confirmAction = action;
    window.showModal('confirmModal');
  };

  function renderListItem(e) {
    if (!e) return '';
    const isGoalTx = e.category === 'goal_cat';
    const cat = isGoalTx ? { emoji: '🎯', name: 'Цель' } : (window.categories[e.category] || { emoji: '📦', name: 'Другое' });
    const isInc = e.type === 'income';
    let displayTitle = e.title || '';
    if (!isGoalTx && displayTitle && typeof displayTitle === 'string') {
      const cleaned = displayTitle.replace(/\s*\d+(?:[.,]\d{1,2})?\s*₽?\s*$/g, '').trim();
      if (cleaned) displayTitle = cleaned;
    }
    return `<div class="swipe-wrap">
      <div class="swipe-bg-edit" onclick="handleEditTap(event, ${e.id}, ${isGoalTx})">
        <span class="bg-emoji">✏️</span><span class="bg-text">Изменить</span>
      </div>
      <div class="swipe-bg-delete" onclick="handleDeleteTap(event, ${e.id})">
        <span class="bg-text">Удалить</span><span class="bg-emoji">🗑️</span>
      </div>
      <div class="list-item swipeable" data-id="${e.id}" data-goal="${isGoalTx}" data-translate="0">
        <div class="item-icon ${isInc ? 'inc' : 'exp'}">${cat.emoji}</div>
        <div class="item-info">
          <div class="item-title">${window.escapeHtml(cat.name)}</div>
          <div class="item-date">${window.escapeHtml(displayTitle)} · ${window.formatDate(e.date)}</div>
        </div>
        <div class="item-amount ${isInc ? 'inc' : 'exp'}">${isInc ? '+' : '−'}${fmt(e.amount)} ₽</div>
      </div>
    </div>`;
  }

  let touchStartX = 0, touchStartY = 0;
  document.addEventListener('touchstart', e => {
    if (e.target.closest('.modal-bg, .filters, .custom-date-row, input, select, textarea, .goals-scroll, .swipeable')) return;
    touchStartX = e.changedTouches[0].screenX; touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });
  document.addEventListener('touchend', e => {
    if (e.target.closest('.modal-bg, .filters, .custom-date-row, input, select, textarea, .goals-scroll, .swipeable')) return;
    const diffX = e.changedTouches[0].screenX - touchStartX;
    const diffY = e.changedTouches[0].screenY - touchStartY;
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 60) {
      const currentIdx = TABS.findIndex(t => $('page-' + t).classList.contains('active'));
      if (currentIdx === -1) return;
      if (diffX < -60 && currentIdx < TABS.length - 1) window.switchTab(TABS[currentIdx + 1]);
      if (diffX >  60 && currentIdx > 0) window.switchTab(TABS[currentIdx - 1]);
    }
  }, { passive: true });

  let openItem = null;
  let swipeStartX = 0, swipeStartY = 0, swipeCurrentItem = null, currentTranslate = 0;
  document.addEventListener('touchstart', e => {
    if (openItem && !e.target.closest('.swipeable') && !e.target.closest('.swipe-bg-delete') && !e.target.closest('.swipe-bg-edit')) {
      openItem.style.transform = 'translateX(0)';
      openItem.dataset.translate = '0';
      openItem.parentNode.querySelectorAll('.bg-text').forEach(el => el.style.opacity = 0);
      openItem = null;
    }
  }, { passive: true });

  function setupSwipe(containerId) {
    const container = $(containerId);
    if (!container) return;
    container.addEventListener('touchstart', e => {
      const item = e.target.closest('.swipeable');
      if (!item) return;
      if (openItem && openItem !== item) {
        openItem.style.transform = 'translateX(0)'; openItem.dataset.translate = '0';
        openItem.parentNode.querySelectorAll('.bg-text').forEach(el => el.style.opacity = 0);
        openItem = null;
      }
      swipeStartX = e.touches[0].clientX; swipeStartY = e.touches[0].clientY;
      swipeCurrentItem = item; currentTranslate = parseFloat(item.dataset.translate || 0);
    }, { passive: true });
    container.addEventListener('touchmove', e => {
      if (!swipeCurrentItem) return;
      const deltaX = e.touches[0].clientX - swipeStartX;
      const deltaY = e.touches[0].clientY - swipeStartY;
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        swipeCurrentItem.style.transition = 'none';
        const bgEdit = swipeCurrentItem.parentNode.querySelector('.swipe-bg-edit');
        const bgDelete = swipeCurrentItem.parentNode.querySelector('.swipe-bg-delete');
        const txtEdit = bgEdit.querySelector('.bg-text');
        const txtDelete = bgDelete.querySelector('.bg-text');
        const isOpened = (openItem === swipeCurrentItem);
        let newTranslate = currentTranslate + deltaX;
        if (!isOpened) { if (newTranslate < -80) newTranslate = -80; if (newTranslate > 80) newTranslate = 80; }
        else { if (newTranslate < -140) newTranslate = -140; if (newTranslate > 140) newTranslate = 140; }
        swipeCurrentItem.style.transform = `translateX(${newTranslate}px)`;
        swipeCurrentItem.dataset.translate = newTranslate;
        if (newTranslate > 0) { bgEdit.style.display = 'flex'; bgDelete.style.display = 'none'; }
        else if (newTranslate < 0) { bgEdit.style.display = 'none'; bgDelete.style.display = 'flex'; }
        let absT = Math.abs(newTranslate); let opacity = 0;
        if (isOpened && absT > 80) opacity = Math.min(1, (absT - 80) / 40);
        if (newTranslate > 0) txtEdit.style.opacity = opacity; else if (newTranslate < 0) txtDelete.style.opacity = opacity;
        if (e.cancelable) e.preventDefault();
      }
    }, { passive: false });
    container.addEventListener('touchend', e => {
      if (!swipeCurrentItem) return;
      swipeCurrentItem.style.transition = 'transform 0.2s ease';
      const finalTranslate = parseFloat(swipeCurrentItem.dataset.translate || 0);
      const id = parseInt(swipeCurrentItem.dataset.id);
      const isGoal = swipeCurrentItem.dataset.goal === 'true';
      const isOpened = (openItem === swipeCurrentItem);
      swipeCurrentItem.dataset.translate = 0;
      swipeCurrentItem.parentNode.querySelectorAll('.bg-text').forEach(el => el.style.opacity = 0);
      if (isOpened) {
        if (finalTranslate <= -100) {
          swipeCurrentItem.style.transform = 'translateX(0)'; openItem = null;
          const idx = window.transactions.findIndex(t => t.id === id);
          tempDeletedItem = window.transactions[idx];
          window.transactions.splice(idx, 1);
          window.save(); window.render();
          window.toast(`Удалено <button onclick="window.undoDelete()">Отменить</button>`);
        } else if (finalTranslate >= 100) {
          swipeCurrentItem.style.transform = 'translateX(0)'; openItem = null;
          if (!isGoal) window.openTxModal(id); else window.toast('Цель нельзя редактировать');
        } else {
          if (finalTranslate > -40 && finalTranslate < 40) { swipeCurrentItem.style.transform = 'translateX(0)'; openItem = null; }
          else { const snapPos = finalTranslate < 0 ? -80 : 80; swipeCurrentItem.style.transform = `translateX(${snapPos}px)`; swipeCurrentItem.dataset.translate = snapPos; }
        }
      } else {
        if (finalTranslate <= -40) { swipeCurrentItem.style.transform = 'translateX(-80px)'; swipeCurrentItem.dataset.translate = -80; openItem = swipeCurrentItem; }
        else if (finalTranslate >= 40) { swipeCurrentItem.style.transform = 'translateX(80px)'; swipeCurrentItem.dataset.translate = 80; openItem = swipeCurrentItem; }
        else { swipeCurrentItem.style.transform = 'translateX(0)'; openItem = null; }
      }
      swipeCurrentItem = null;
    });
  }
  setupSwipe('list'); setupSwipe('statsHistoryList');

  window.handleDeleteTap = function (event, id) {
    event.stopPropagation();
    const wrap = event.currentTarget.closest('.swipe-wrap');
    if (!wrap) return;
    const listItem = wrap.querySelector('.swipeable');
    if (!listItem || openItem !== listItem) return;
    const idx = window.transactions.findIndex(t => t.id === id);
    if (idx === -1) return;
    listItem.style.transform = 'translateX(0)';
    listItem.dataset.translate = '0';
    openItem = null;
    wrap.querySelectorAll('.bg-text').forEach(el => el.style.opacity = 0);
    tempDeletedItem = window.transactions[idx];
    window.transactions.splice(idx, 1);
    window.save(); window.render();
    window.toast(`Удалено <button onclick="window.undoDelete()">Отменить</button>`);
  };
  window.handleEditTap = function (event, id, isGoal) {
    event.stopPropagation();
    const wrap = event.currentTarget.closest('.swipe-wrap');
    if (!wrap) return;
    const listItem = wrap.querySelector('.swipeable');
    if (!listItem || openItem !== listItem) return;
    listItem.style.transform = 'translateX(0)';
    listItem.dataset.translate = '0';
    openItem = null;
    wrap.querySelectorAll('.bg-text').forEach(el => el.style.opacity = 0);
    if (isGoal) { window.toast('Цель нельзя редактировать'); return; }
    window.openTxModal(id);
  };
  window.undoDelete = function() {
    if (tempDeletedItem) { window.transactions.unshift(tempDeletedItem); window.save(); window.render(); tempDeletedItem = null; window.toast('Восстановлено'); }
  };

  window.openTxModal = function(id = null) {
    window.editingTxId = id; forcedByPlus = false;
    const isEdit = id !== null;
    $('txModalTitle').textContent = isEdit ? 'Редактировать запись' : 'Новая запись';
    if (isEdit) {
      const t = window.transactions.find(x => x.id === id);
      $('amount').value = t.amount; $('title').value = t.title;
      $('txDate').value = new Date(t.date).toISOString().split('T')[0];
      window.setType(t.type); $('category').value = t.category;
    } else {
      $('amount').value = ''; $('title').value = '';
      $('txDate').value = new Date().toISOString().split('T')[0];
      window.setType('expense');
    }
    window.showModal('txModal');
    setTimeout(() => $('title').focus(), 320);
  };
  window.setType = function(type) {
    window.currentType = type;
    const sw = $('typeSwitch'); sw.classList.toggle('income', type === 'income');
    $('btnTypeExp').classList.toggle('active', type === 'expense');
    $('btnTypeInc').classList.toggle('active', type === 'income');
    const btn = $('submitBtn');
    btn.classList.toggle('is-exp', type === 'expense'); btn.classList.toggle('is-inc', type === 'income');
    btn.textContent = type === 'expense' ? 'Сохранить расход' : 'Сохранить приход';
    $('title').placeholder = type === 'expense' ? 'На что потратили? (или +500 для прихода)' : 'Откуда пришли деньги?';
    window.renderCategorySelect();
  };

  $('category').addEventListener('change', e => {
    const title = $('title').value.trim();
    if (!title) return;
    const catId = e.target.value;
    const cat = window.categories[catId];
    if (!cat) return;
    const cleaned = title.replace(/\d+([.,]\d+)?/g, ' ').replace(/[₽.,!?]/g, ' ').trim().toLowerCase();
    const stop = ['купил','купила','потратил','потратила','заплатил','заплатила','оплатил','оплатила','на','за','в','из','с','по','и'];
    const keyword = cleaned.split(/\s+/).find(w => w.length >= 2 && !stop.includes(w));
    if (!keyword) return;
    if (!cat.keywords) cat.keywords = [];
    if (cat.keywords.includes(keyword)) return;
    cat.keywords.push(keyword);
    window.save();
    window.toast(`🔑 «${keyword}» добавлено в ключевые`);
  });

  window.parseSmartInput = function(text) {
    if (!text) return;
    const hasPlus = /^\s*\+/.test(text) || /\+\s*\d/.test(text);
    if (hasPlus) { forcedByPlus = true; if (window.currentType !== 'income') window.setType('income'); }
    else if (forcedByPlus) { forcedByPlus = false; if (window.currentType !== 'expense') window.setType('expense'); }
    const cleanText = text.replace(/\+/g, '');
    const lowerText = cleanText.toLowerCase();
    const amountRegex = /(\d+(?:[.,]\d{1,2})?)\s*₽?$/;
    const amountMatch = cleanText.match(amountRegex) || cleanText.match(/^\s*(\d+(?:[.,]\d{1,2})?)\s*₽?\s+/);
    if (amountMatch) $('amount').value = parseFloat(amountMatch[1].replace(',', '.'));
    const today = new Date();
    if (lowerText.includes('вчера')) { const y = new Date(today); y.setDate(y.getDate() - 1); $('txDate').value = y.toISOString().split('T')[0]; }
    else if (lowerText.includes('позавчера')) { const y = new Date(today); y.setDate(y.getDate() - 2); $('txDate').value = y.toISOString().split('T')[0]; }
    else {
      const dateMatch = cleanText.match(/(\d{1,2})[./](\d{1,2})(?:[./](\d{2,4}))?/);
      if (dateMatch) {
        const d = parseInt(dateMatch[1], 10); const m = parseInt(dateMatch[2], 10) - 1;
        let y = dateMatch[3] ? parseInt(dateMatch[3], 10) : today.getFullYear();
        if (y < 100) y += 2000;
        const parsedD = new Date(y, m, d);
        if (!isNaN(parsedD.getTime())) $('txDate').value = parsedD.toISOString().split('T')[0];
      }
    }
    let foundCatId = null, bestLen = 0;
    for (const [id, cat] of Object.entries(window.categories)) {
      if (!cat) continue;
      const n = cat.name.toLowerCase();
      if (lowerText.includes(n) && n.length > bestLen) { foundCatId = id; bestLen = n.length; }
      for (const kw of (cat.keywords || [])) {
        if (lowerText.includes(kw) && kw.length > bestLen) { foundCatId = id; bestLen = kw.length; }
      }
    }
    if (foundCatId) {
      const catObj = window.categories[foundCatId];
      if (catObj.type !== window.currentType && !forcedByPlus) window.setType(catObj.type);
      $('category').value = foundCatId;
    }
  };
  $('title').addEventListener('input', e => window.parseSmartInput(e.target.value));
  $('title').addEventListener('keyup', e => window.parseSmartInput(e.target.value));
  $('title').addEventListener('blur', e => {
    let title = e.target.value.trim(); if (!title) return;
    const cleaned = title.replace(/\+/g, '').replace(/(\d+(?:[.,]\d{1,2})?)\s*₽?$/g, '').replace(/вчера/gi, '').replace(/позавчера/gi, '').replace(/(\d{1,2})[./](\d{1,2})(?:[./](\d{2,4}))?/g, '').replace(/\s+/g, ' ').trim();
    if (cleaned && cleaned !== title) e.target.value = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    else if (!cleaned) e.target.value = '';
  });
  window.addTransaction = function() {
    window.parseSmartInput($('title').value);
    let title = $('title').value.trim();
    const amount = parseFloat($('amount').value);
    const category = $('category').value;
    const dateVal = $('txDate').value;
    title = title.replace(/\+/g, '').replace(/(\d+(?:[.,]\d{1,2})?)\s*₽?$/g, '').replace(/вчера/gi, '').replace(/позавчера/gi, '').replace(/(\d{1,2})[./](\d{1,2})(?:[./](\d{2,4}))?/g, '').replace(/\s+/g, ' ').trim();
    if (title) title = title.charAt(0).toUpperCase() + title.slice(1);
    if (!title) { if (window.currentType === 'income') title = 'Доход'; else { window.toast('Введите описание'); return; } }
    if (!amount || amount <= 0) { window.toast('Введите сумму'); return; }
    const dateStr = dateVal ? new Date(dateVal + 'T12:00:00').toISOString() : new Date().toISOString();
    if (window.editingTxId) {
      const idx = window.transactions.findIndex(x => x.id === window.editingTxId);
      window.transactions[idx] = { ...window.transactions[idx], title, amount, category, type: window.currentType, date: dateStr };
    } else {
      window.transactions.unshift({ id: Date.now(), title, amount, category, type: window.currentType, date: dateStr });
    }
    window.save(); window.closeModal('txModal'); window.render();
    if (window.currentType === 'expense' && window.categories[category] && window.categories[category].budget > 0) window.checkBudgetAlert(category);
    window.toast(window.editingTxId ? 'Запись обновлена' : 'Добавлено');
    window.editingTxId = null;
  };
  window.checkBudgetAlert = function(catId) {
    const cat = window.categories[catId]; if (!cat || !cat.budget) return;
    const now = new Date();
    const spent = window.transactions.filter(t => t.type === 'expense' && t.category === catId && new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear()).reduce((s, t) => s + t.amount, 0);
    if (spent > cat.budget) {
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      if ('Notification' in window && Notification.permission === 'granted') new Notification('⚠️ Превышен бюджет!', { body: `Категория "${cat.name}"\nПотрачено: ${fmt(spent)} из ${fmt(cat.budget)} ₽` });
    } else if (spent > cat.budget * 0.9) { if (navigator.vibrate) navigator.vibrate(100); }
  };
  window.deleteTransaction = function(id) {
    window.askConfirm('Удалить запись?', 'Это действие нельзя отменить.', 'Удалить', () => {
      window.transactions = window.transactions.filter(e => e.id !== id); window.save(); window.render();
    });
  };

  window.updateGoalUI = function() {
    const box = $('goalsList'); if (!box) return;
    if (!window.goals.length) { box.innerHTML = `<div class="empty" style="width:100%; padding:10px; background:var(--card); border-radius:22px; box-shadow:var(--shadow-card); margin-bottom:12px;">Нет целей. Добавьте первую!</div>`; return; }
    box.classList.toggle('multi', window.goals.length > 1);
    box.innerHTML = window.goals.map(goal => {
      if (!goal) return '';
      const saved = window.transactions.filter(e => e.category === 'goal_cat' && e.goalId === goal.id).reduce((sum, e) => sum + e.amount, 0);
      const pct = goal.target > 0 ? Math.min(100, (saved / goal.target) * 100) : 0;
      return `<div class="goal-card-wrap"><div class="card" style="margin-bottom:0;"><div class="goal-top"><div class="goal-ring ${pct >= 100 ? 'done' : ''}" style="--p: ${pct.toFixed(2)}"><div class="goal-ring-inner">${Math.floor(pct)}%</div></div><div class="goal-meta"><div class="goal-name-row"><h3>🎯 ${window.escapeHtml(goal.name)}</h3><button class="goal-edit" onclick="openGoalModal(${goal.id})">✏️</button></div><div class="goal-amounts"><strong>${fmt(saved)} ₽</strong> <span>из ${fmt(goal.target)} ₽</span></div></div></div><div class="goal-add-form"><input type="number" class="goal-add-input" placeholder="Сумма" min="0" step="0.01" inputmode="decimal"><button onclick="addToGoal(this, ${goal.id})">Отложить</button></div></div></div>`;
    }).join('');
  };
  window.renderGoalsPage = function() {
    const box = $('goalsListVertical'); if (!box) return;
    $('goalsCount').textContent = window.goals.length || '0';
    if (!window.goals.length) { box.innerHTML = `<div class="empty"><div class="empty-emoji">🎯</div><div class="empty-title">Нет целей</div><div class="empty-sub">Добавьте свою первую цель</div></div>`; return; }
    box.innerHTML = window.goals.map(goal => {
      if (!goal) return '';
      const gName = goal.name || goal.title || 'Без названия';
      const gTarget = goal.target || 0;
      const saved = window.transactions.filter(e => e.category === 'goal_cat' && e.goalId === goal.id).reduce((sum, e) => sum + e.amount, 0);
      const pct = gTarget > 0 ? Math.min(100, (saved / gTarget) * 100) : 0;
      const isDone = pct >= 100;
      return `<div class="list-item" style="padding: 14px 0;"><div class="item-icon" style="background:${isDone ? 'rgba(5,150,105,.1)' : 'rgba(99,102,241,.1)'}; color:${isDone ? 'var(--green)' : 'var(--brand)'};">🎯</div><div class="item-info"><div class="item-title">${window.escapeHtml(gName)}</div><div class="item-date">${fmt(saved)} из ${fmt(gTarget)} ₽ (${Math.floor(pct)}%)</div><div class="budget-bar" style="margin-top:6px;"><div class="budget-bar-fill" style="width:${pct}%; background:${isDone ? 'var(--green)' : 'var(--brand)'}"></div></div></div><button type="button" onclick="deleteGoal(${goal.id})" style="width: 32px; height: 32px; border-radius: 50%; background: var(--input-bg); border: none; color: var(--muted); font-size: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; padding: 0;">✕</button></div>`;
    }).join('');
  };
  window.deleteGoal = function(id) {
    window.askConfirm('Удалить цель?', 'Цель будет удалена. Накопления останутся в истории.', 'Удалить', () => {
      window.goals = window.goals.filter(g => g.id !== id);
      window.transactions.forEach(t => { if (t.goalId === id) { t.goalId = null; t.title = t.title.replace('Отложено на:', 'Расход:'); } });
      window.save(); window.render(); window.toast('Цель удалена');
    });
  };
  window.addToGoal = function(el, goalId) {
    const form = el.closest('.goal-add-form'); const input = form.querySelector('input');
    const amount = parseFloat(input.value);
    if (!amount || amount <= 0) { window.toast('Введите сумму'); return; }
    const goalObj = window.goals.find(g => g.id === goalId);
    window.transactions.unshift({ id: Date.now(), title: 'Отложено на: ' + goalObj.name, amount, category: 'goal_cat', goalId: goalId, type: 'expense', date: new Date().toISOString() });
    window.save(); input.value = ''; window.render(); window.toast('Отложено 🎯');
  };
  window.openGoalModal = function(id = null) {
    window.editingGoalId = id; const isEdit = id !== null;
    $('goalModalTitle').textContent = isEdit ? 'Изменить цель' : 'Новая цель';
    if (isEdit) { const g = window.goals.find(x => x.id === id); if(g) { $('goalNameInput').value = g.name; $('goalTargetInput').value = g.target; } }
    else { $('goalNameInput').value = ''; $('goalTargetInput').value = ''; }
    $('goalAddAmount').value = ''; window.showModal('goalModal');
  };
  window.saveGoal = function() {
    const name = $('goalNameInput').value.trim();
    const target = parseFloat($('goalTargetInput').value);
    const initial = parseFloat($('goalAddAmount').value);
    if (!name) { window.toast('Введите название'); return; }
    if (!target || target <= 0) { window.toast('Введите сумму'); return; }
    if (window.editingGoalId) { const g = window.goals.find(x => x.id === window.editingGoalId); if(g) { g.name = name; g.target = target; } }
    else {
      const newId = Date.now();
      window.goals.push({ id: newId, name, target });
      if (initial && initial > 0) window.transactions.unshift({ id: Date.now() + 1, title: 'Отложено на: ' + name, amount: initial, category: 'goal_cat', goalId: newId, type: 'expense', date: new Date().toISOString() });
    }
    window.save(); window.closeModal('goalModal'); window.render(); window.toast('Цель сохранена');
  };

  window.renderCategorySelect = function() {
    const sel = $('category'); if (!sel) return;
    const current = sel.value;
    const available = Object.entries(window.categories).filter(([, c]) => c && c.type === window.currentType);
    sel.innerHTML = available.map(([id, c]) => `<option value="${id}">${c.emoji} ${window.escapeHtml(c.name)}</option>`).join('');
    if (available.some(([id]) => id === current)) sel.value = current;
  };
  window.openCatsModal = function() { window.renderCatsList(); window.showModal('catsModal'); };

  window.moveCategory = function(id, dir) {
    const cat = window.categories[id];
    if (!cat) return;
    const typeKeys = Object.keys(window.categories).filter(k => window.categories[k] && window.categories[k].type === cat.type);
    const idx = typeKeys.indexOf(id);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= typeKeys.length) return;
    const targetId = typeKeys[newIdx];
    const keys = Object.keys(window.categories);
    const i1 = keys.indexOf(id), i2 = keys.indexOf(targetId);
    const newObj = {};
    keys.forEach((k, i) => {
      if (i === i1) newObj[targetId] = window.categories[targetId];
      else if (i === i2) newObj[id] = window.categories[id];
      else newObj[k] = window.categories[k];
    });
    window.categories = newObj;
    window.save();
    window.renderCatsList();
    window.render();
  };

  window.renderCatsList = function() {
    const box = $('catsList'); if (!box) return;
    const expenseEntries = Object.entries(window.categories).filter(([, c]) => c && c.type === 'expense');
    const incomeEntries = Object.entries(window.categories).filter(([, c]) => c && c.type === 'income');
    const renderRow = ([id, c]) => {
      const sameType = Object.keys(window.categories).filter(k => window.categories[k] && window.categories[k].type === c.type);
      const pos = sameType.indexOf(id);
      const canUp = pos > 0, canDown = pos < sameType.length - 1;
      return `<div class="cat-row">
        <div class="item-icon">${c.emoji}</div>
        <div class="name">${window.escapeHtml(c.name)}</div>
        <button class="icon-btn move-btn" onclick="moveCategory('${id}',-1)" ${canUp?'':'disabled'}>▲</button>
        <button class="icon-btn move-btn" onclick="moveCategory('${id}',1)" ${canDown?'':'disabled'}>▼</button>
        <button class="icon-btn" onclick="openCatEditor('${id}')">✏️</button>
        <button class="icon-btn" onclick="deleteCategory('${id}')">🗑️</button>
      </div>`;
    };
    box.innerHTML = `<div class="cats-section"><div class="cats-section-head expense"><span class="dot"></span><span>Расходы</span></div><div class="cats-section-list">${expenseEntries.map(renderRow).join('')}</div></div><div class="cats-section"><div class="cats-section-head income"><span class="dot"></span><span>Доходы</span></div><div class="cats-section-list">${incomeEntries.map(renderRow).join('')}</div></div>`;
  };
  window.openCatEditor = function(id = null) {
    window.editingCatId = id;
    $('catEditorTitle').textContent = id ? 'Изменить категорию' : 'Новая категория';
    if (id && window.categories[id]) { $('catName').value = window.categories[id].name; $('catKeywords').value = (window.categories[id].keywords || []).join(', '); window.pickedEmoji = window.categories[id].emoji; $('catType').value = window.categories[id].type || 'expense'; }
    else { $('catName').value = ''; $('catKeywords').value = ''; window.pickedEmoji = '🍔'; $('catType').value = window.currentType; }
    window.renderEmojiPicker(); 
    $('catsModal').classList.remove('show');
    window.showModal('catEditorModal');
  };
  window.renderEmojiPicker = function() { $('emojiPicker').innerHTML = EMOJI_CHOICES.map(e => `<span class="${e === window.pickedEmoji ? 'selected' : ''}" onclick="pickEmoji('${e}')">${e}</span>`).join(''); };
  window.pickEmoji = function(e) { window.pickedEmoji = e; $('catEmojiCustom').value = ''; window.renderEmojiPicker(); };
  window.saveCategory = function() {
    const name = $('catName').value.trim(); const custom = $('catEmojiCustom').value.trim();
    const emoji = custom || window.pickedEmoji; const type = $('catType').value;
    const kwString = $('catKeywords').value.trim();
    const keywords = kwString ? kwString.split(',').map(k => k.trim().toLowerCase()).filter(k => k) : [];
    if (!name) { window.toast('Введите название'); return; }
    if (window.editingCatId) { const oldBudget = window.categories[window.editingCatId].budget; window.categories[window.editingCatId] = { emoji, name, type, keywords, budget: type === 'expense' ? oldBudget : null }; }
    else { window.categories['cat_' + Date.now()] = { emoji, name, type, keywords, budget: null }; }
    window.save(); 
    window.closeModal('catEditorModal'); 
    window.renderCatsList(); 
    window.render(); 
    window.toast('Сохранено');
  };
  window.deleteCategory = function(id) {
    window.askConfirm(`Удалить "${window.categories[id].name}"?`, 'Записи перейдут в подходящие категории по описанию (или в "Другое").', 'Удалить', () => {
      const cat = window.categories[id];
      const fallbackExpense = window.categories['other'] ? 'other' : (Object.keys(window.categories).find(k => window.categories[k].type === 'expense') || 'other');
      const fallbackIncome = window.categories['other_inc'] ? 'other_inc' : (Object.keys(window.categories).find(k => window.categories[k].type === 'income') || 'salary');
      const fallbackId = (cat && cat.type === 'income') ? fallbackIncome : fallbackExpense;
      
      window.transactions.forEach(t => {
        if (t.category === id) {
          const matchedId = window.findCategoryByTitle(t.title, t.type);
          t.category = matchedId || fallbackId;
        }
      });
      
      window.fixedExpenses.forEach(fx => {
        if (fx.categoryId === id) {
          const matchedId = window.findCategoryByTitle(fx.title, 'expense');
          fx.categoryId = matchedId || fallbackExpense;
        }
      });

      delete window.categories[id]; 
      window.hiddenFilters = window.hiddenFilters.filter(x => x !== id);
      if (window.activeFilter === id) window.activeFilter = 'all';
      window.save(); 
      window.renderCatsList(); 
      window.render();
      window.toast('Категория удалена');
    });
  };
  window.openLimitsModal = function() {
    const box = $('limitsList');
    const expenseCats = Object.entries(window.categories).filter(([, c]) => c && c.type === 'expense');
    if (!expenseCats.length) box.innerHTML = `<div class="empty">Нет категорий расходов</div>`;
    else box.innerHTML = expenseCats.map(([id, c]) => `<div class="filter-item" style="cursor:default; padding: 10px 12px;"><div class="filter-item-info"><div class="filter-item-icon">${c.emoji}</div><div>${window.escapeHtml(c.name)}</div></div><input type="number" id="limit_${id}" class="limit-input" placeholder="0" value="${c.budget || ''}" min="0" step="1" inputmode="decimal"></div>`).join('');
    window.showModal('limitsModal');
  };
  window.saveLimits = function() {
    const expenseCats = Object.keys(window.categories).filter(id => window.categories[id] && window.categories[id].type === 'expense');
    expenseCats.forEach(id => { const val = parseFloat($('limit_' + id).value); window.categories[id].budget = val > 0 ? val : null; });
    window.save(); window.closeModal('limitsModal'); window.render(); window.toast('Лимиты сохранены');
  };
  window.openExportModal = function() { window.showModal('exportChoiceModal'); };
  window.exportAsFile = function() { window.closeModal('exportChoiceModal'); window.exportData(); };
  window.exportAsText = function() { window.closeModal('exportChoiceModal'); window.showBackupText(); };
  window.openImportModal = function() { window.showModal('importChoiceModal'); };
  window.importAsFile = function() { window.closeModal('importChoiceModal'); window.triggerImport(); };
  window.importAsText = function() { window.closeModal('importChoiceModal'); window.showImportTextModal(); };

  window.renderFilters = function() {
    const box = $('filters'); if (!box) return;
    const items = [{ key: 'all', emoji: '📊', name: 'Все' }];
    if (window.transactions.some(t => t.category === 'goal_cat')) items.push({ key: 'goal_cat', emoji: '🎯', name: 'Цели' });
    items.push(...Object.entries(window.categories).filter(([id, c]) => c && !window.hiddenFilters.includes(id)).map(([id, c]) => ({ key: id, ...c })));
    if (window.activeFilter !== 'all' && window.activeFilter !== 'goal_cat' && (!window.categories[window.activeFilter] || window.hiddenFilters.includes(window.activeFilter))) window.activeFilter = 'all';
    box.innerHTML = items.map(c => `<div class="chip ${window.activeFilter === c.key ? 'active' : ''}" onclick="setFilter('${c.key}')">${c.emoji} ${window.escapeHtml(c.name)}</div>`).join('');
  };
  window.setFilter = key => { window.activeFilter = key; window.render(); };
  window.formatDate = function(iso) {
    const d = new Date(iso); const today = new Date();
    const time = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    if (d.toDateString() === today.toDateString()) return `Сегодня, ${time}`;
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) + ', ' + time;
  };
  window.renderBudgets = function() {
    const list = $('budgetsList'); const box = $('budgetsCard'); const now = new Date();
    if (!list || !box) return;
    const catsWithBudget = Object.entries(window.categories).filter(([id, c]) => c && c.budget > 0 && c.type === 'expense');
    if (!catsWithBudget.length) { box.style.display = 'none'; return; }
    box.style.display = 'block';
    list.innerHTML = catsWithBudget.map(([id, c]) => {
      const spent = window.transactions.filter(t => t.type === 'expense' && t.category === id && new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear()).reduce((s, t) => s + t.amount, 0);
      const pct = Math.min(100, (spent / c.budget) * 100);
      const isDanger = spent > c.budget;
      const hue = 120 - (120 * pct / 100);
      const barColor = `hsl(${hue}, 84%, 45%)`;
      return `<div class="budget-row"><div class="budget-row-top"><span class="name">${c.emoji} ${window.escapeHtml(c.name)}</span><span class="vals" style="color:${isDanger ? 'var(--red)' : 'var(--muted)'};">${fmt(spent)} / ${fmt(c.budget)} ₽</span></div><div class="budget-bar"><div class="budget-bar-fill" style="width:${pct}%; background:${barColor}"></div></div></div>`;
    }).join('');
  };
  
  window.render = function() {
    try { window.renderCategorySelect(); } catch(e) { console.error('renderCategorySelect', e); }
    try { window.renderFilters(); } catch(e) { console.error('renderFilters', e); }
    try { window.updateGoalUI(); } catch(e) { console.error('updateGoalUI', e); }
    try { window.renderGoalsPage(); } catch(e) { console.error('renderGoalsPage', e); }
    try { window.renderBudgets(); } catch(e) { console.error('renderBudgets', e); }
    
    const totalIncome = window.transactions.filter(t => t && t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = window.transactions.filter(t => t && t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const totalBalance = totalIncome - totalExpense;
    const balanceEl = $('balance');
    if (balanceEl) {
      balanceEl.innerHTML = fmt(totalBalance) + ' <small>₽</small>';
      balanceEl.classList.toggle('neg', totalBalance < 0);
    }
    if ($('statIncome')) $('statIncome').textContent = '+' + fmt(totalIncome) + ' ₽';
    if ($('statExpense')) $('statExpense').textContent = '−' + fmt(totalExpense) + ' ₽';
    
    let totalSavedGoals = window.transactions.filter(t => t && t.category === 'goal_cat').reduce((s, t) => s + t.amount, 0);
    if ($('goalHeroAmount')) $('goalHeroAmount').innerHTML = fmt(totalSavedGoals) + ' <small>₽</small>';
    let totalTarget = window.goals.reduce((s, g) => s + (g ? g.target : 0), 0);
    if ($('goalPercentLabel')) $('goalPercentLabel').textContent = totalTarget > 0 ? Math.floor((totalSavedGoals / totalTarget) * 100) + '%' : '0%';
    
    const filtered = window.activeFilter === 'all' ? window.transactions : window.transactions.filter(e => e.category === window.activeFilter);
    if ($('historyCount')) $('historyCount').textContent = filtered.length || '';
    const catTotalBox = $('catTotal');
    if (catTotalBox) {
      if (window.activeFilter !== 'all') {
        const catSumAllTime = filtered.reduce((s, e) => e.type === 'income' ? s + e.amount : s - e.amount, 0);
        const catObj = window.activeFilter === 'goal_cat' ? { emoji: '🎯', name: 'Цели' } : window.categories[window.activeFilter];
        let budgetHtml = '';
        if (catObj && catObj.budget && catObj.type === 'expense') {
          const now = new Date();
          const spentMonth = window.transactions.filter(t => t.type === 'expense' && t.category === window.activeFilter && new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear()).reduce((s, t) => s + t.amount, 0);
          const pct = Math.min(100, (spentMonth / catObj.budget) * 100);
          const inlineColor = `hsl(${120 - (120 * pct / 100)}, 84%, 45%)`;
          budgetHtml = `<div style="width:100%; margin-top:8px;"><div class="budget-bar"><div class="budget-bar-fill" style="width:${pct}%; background:${inlineColor}"></div></div><div class="budget-text" style="font-size:11px;"><span>В этом месяце: ${fmt(spentMonth)} ₽</span><span>Лимит: ${fmt(catObj.budget)} ₽</span></div></div>`;
        }
        catTotalBox.innerHTML = `<div style="display:flex; justify-content:space-between; align-items:center; width:100%;"><span>Итог по категории</span><span class="cat-total-val" style="color:${catSumAllTime > 0 ? 'var(--green)' : catSumAllTime < 0 ? 'var(--red)' : 'var(--ink)'}">${catSumAllTime > 0 ? '+' : ''}${fmt(catSumAllTime)} ₽</span></div>${budgetHtml}`;
        catTotalBox.classList.add('show');
      } else catTotalBox.classList.remove('show');
    }
    
    const list = $('list');
    if (list) {
      if (filtered.length === 0) list.innerHTML = `<div class="empty"><div class="empty-emoji">🫙</div><div class="empty-title">Пусто</div><div class="empty-sub">Нажмите «+», чтобы добавить</div></div>`;
      else list.innerHTML = filtered.map(e => renderListItem(e)).join('');
    }
    window.renderStats();
  };
  
  window.setStatsPeriod = function(p) { window.statsPeriod = p; document.querySelectorAll('.period-chips .chip').forEach(c => c.classList.toggle('active', c.dataset.period === p)); $('customDateRow').style.display = p === 'custom' ? 'flex' : 'none'; window.renderStats(); };
  window.setStatsKind = function(k) { window.statsKind = k; document.querySelectorAll('#kindSeg button').forEach(b => b.classList.toggle('active', b.dataset.kind === k)); window.renderStats(); };
  window.periodFilter = function(t) {
    if (window.statsPeriod === 'all') return true;
    const d = new Date(t.date), n = new Date();
    if (window.statsPeriod === 'month') return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
    if (window.statsPeriod === 'custom') {
      const from = $('statsDateFrom').value ? new Date($('statsDateFrom').value) : new Date(0);
      const to = $('statsDateTo').value ? new Date($('statsDateTo').value) : new Date(8640000000000000);
      from.setHours(0,0,0,0); to.setHours(23,59,59,999);
      return d >= from && d <= to;
    }
    return true;
  };
  window.renderStats = function() {
    const list = window.transactions.filter(window.periodFilter);
    const income = list.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = list.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    if ($('statsIncome')) $('statsIncome').textContent = '+' + fmt(income) + ' ₽';
    if ($('statsExpense')) $('statsExpense').textContent = '−' + fmt(expense) + ' ₽';
    if ($('statsPeriodLabel')) $('statsPeriodLabel').textContent = window.statsPeriod === 'all' ? 'Всё время' : (window.statsPeriod === 'month' ? 'Этот месяц' : 'Период');
    if (window.statsCategoryFilter) {
      const filteredList = list.filter(t => t.category === window.statsCategoryFilter);
      if ($('statsHistoryCount')) $('statsHistoryCount').textContent = filteredList.length || '';
      const box = $('statsHistoryList');
      if (box) {
        if (filteredList.length === 0) box.innerHTML = `<div class="empty"><div class="empty-emoji">🫙</div><div class="empty-title">Пусто</div><div class="empty-sub">Нет записей за этот период</div></div>`;
        else box.innerHTML = filteredList.map(e => renderListItem(e)).join('');
      }
      return;
    }
    const grouped = {};
    list.filter(t => t.type === window.statsKind).forEach(t => { grouped[t.category] = (grouped[t.category] || 0) + t.amount; });
    const entries = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((s, [, v]) => s + v, 0);
    const box = $('statsList');
    if (!box) return;
    box.classList.toggle('income', window.statsKind === 'income');
    if ($('statsKindTitle')) $('statsKindTitle').textContent = window.statsKind === 'income' ? 'Доходы по категориям' : 'Расходы по категориям';
    if (!entries.length) { box.innerHTML = `<div class="empty"><div class="empty-emoji">📊</div><div class="empty-title">Нет данных</div></div>`; return; }
    box.innerHTML = entries.map(([id, val]) => {
      const c = id === 'goal_cat' ? { emoji: '🎯', name: 'Цель' } : (window.categories[id] || { emoji: '📦', name: 'Другое' });
      const pct = total ? Math.round((val / total) * 100) : 0;
      return `<div class="stat-row" onclick="window.openCategoryStatsView('${id}')" style="cursor: pointer;"><div class="item-icon">${c.emoji}</div><div class="stat-info"><div class="stat-row-top"><span class="stat-name">${window.escapeHtml(c.name)}</span><span class="stat-amount">${fmt(val)} ₽ · ${pct}%</span></div><div class="stat-bar-bg"><div class="stat-bar-fill" style="width:${pct}%"></div></div></div></div>`;
    }).join('');
  };
  window.openFixedModal = function() { window.renderFixedList(); window.showModal('fixedModal'); };
  window.renderFixedList = function() {
    const box = $('fixedList');
    if (!box) return;
    if (window.fixedExpenses.length === 0) { box.innerHTML = `<div class="empty"><div class="empty-title">Пока нет платежей</div></div>`; return; }
    box.innerHTML = window.fixedExpenses.map(fx => `<div class="cat-row"><div class="item-icon">${window.categories[fx.categoryId]?.emoji || '📦'}</div><div class="name">${window.escapeHtml(fx.title)}<br><span style="font-size:11px; color:var(--muted);">${fx.dayOfMonth}-е число</span></div><div class="item-amount exp">−${fmt(fx.amount)} ₽</div><button class="icon-btn" onclick="openFixedEditor(${fx.id})">✏️</button><button class="icon-btn" onclick="deleteFixed(${fx.id})">🗑️</button></div>`).join('');
  };
  window.openFixedEditor = function(id = null) {
    window.editingFixedId = id; const cats = Object.entries(window.categories).filter(([, c]) => c && c.type === 'expense');
    $('fixedCategory').innerHTML = cats.map(([cid, c]) => `<option value="${cid}">${c.emoji} ${c.name}</option>`).join('');
    if (id) { const fx = window.fixedExpenses.find(x => x.id === id); if (fx) { $('fixedName').value = fx.title; $('fixedAmount').value = fx.amount; $('fixedCategory').value = fx.categoryId; $('fixedDate').value = new Date(new Date().getFullYear(), new Date().getMonth(), fx.dayOfMonth).toISOString().split('T')[0]; } }
    else { $('fixedName').value = ''; $('fixedAmount').value = ''; $('fixedDate').value = new Date().toISOString().split('T')[0]; }
    $('fixedModal').classList.remove('show');
    window.showModal('fixedEditorModal');
  };
  window.saveFixed = function() {
    const name = $('fixedName').value.trim(); const amount = parseFloat($('fixedAmount').value);
    const categoryId = $('fixedCategory').value; const dayOfMonth = new Date($('fixedDate').value).getDate();
    if (!name || !amount || amount <= 0) { window.toast('Заполните поля'); return; }
    if (window.editingFixedId) Object.assign(window.fixedExpenses.find(x => x.id === window.editingFixedId), { title: name, amount, categoryId, dayOfMonth });
    else window.fixedExpenses.push({ id: Date.now(), title: name, amount, categoryId, dayOfMonth, lastCharged: null, type: 'expense' });
    window.save(); 
    window.closeModal('fixedEditorModal'); 
    window.renderFixedList(); 
    window.render(); 
    window.toast('Сохранено');
  };
  window.deleteFixed = id => window.askConfirm('Удалить?', '', 'Да', () => { window.fixedExpenses = window.fixedExpenses.filter(x => x.id !== id); window.save(); window.renderFixedList(); });
  window.processFixedExpenses = function() {
    const now = new Date(); const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    let added = 0;
    window.fixedExpenses.forEach(fx => {
      if (fx && now.getDate() >= fx.dayOfMonth && fx.lastCharged !== currentMonth) {
        window.transactions.unshift({ id: Date.now() + Math.random(), title: fx.title + ' (авто)', amount: fx.amount, category: fx.categoryId, type: 'expense', date: new Date(now.getFullYear(), now.getMonth(), fx.dayOfMonth).toISOString() });
        fx.lastCharged = currentMonth; added++;
      }
    });
    if (added > 0) { window.save(); window.toast(`Добавлено авто-платежей: ${added}`); }
  };
  window.openFilterSettings = function() {
    const box = $('filterSettingsList'); if (!box) return;
    box.innerHTML = Object.entries(window.categories).filter(([,c]) => c).sort((a,b) => a[1].name.localeCompare(b[1].name)).map(([id, c]) => {
      const isActive = !window.hiddenFilters.includes(id);
      return `<div class="filter-item ${isActive ? 'active' : ''}" onclick="toggleFilter('${id}')"><div class="filter-item-info"><div class="filter-item-icon">${c.emoji}</div><div>${c.name}</div></div><div class="checkbox"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></div></div>`;
    }).join('');
    window.showModal('filterSettingsModal');
  };
  window.toggleFilter = function(id) {
    if (window.hiddenFilters.includes(id)) window.hiddenFilters = window.hiddenFilters.filter(x => x !== id);
    else window.hiddenFilters.push(id);
    if (window.hiddenFilters.length === Object.keys(window.categories).length) { window.toast('Оставьте хотя бы одну'); return; }
    window.save(); window.openFilterSettings(); window.renderFilters(); window.render();
  };
  window.getBackupData = () => ({ exportedAt: new Date().toISOString(), goals: window.goals, categories: window.categories, transactions: window.transactions, hiddenFilters: window.hiddenFilters, fixedExpenses: window.fixedExpenses });

  async function deriveKey(password, salt) {
    const enc = new TextEncoder();
    const km = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: 200000, hash: 'SHA-256' },
      km,
      { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
    );
  }
  async function encryptBackup(data, password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv   = crypto.getRandomValues(new Uint8Array(12));
    const key  = await deriveKey(password, salt);
    const ct   = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify(data)));
    return {
      format: 'encrypted-finance-backup-v1',
      salt: btoa(String.fromCharCode(...salt)),
      iv:   btoa(String.fromCharCode(...iv)),
      data: btoa(String.fromCharCode(...new Uint8Array(ct)))
    };
  }
  async function decryptBackup(payload, password) {
    const salt = Uint8Array.from(atob(payload.salt), c => c.charCodeAt(0));
    const iv   = Uint8Array.from(atob(payload.iv),   c => c.charCodeAt(0));
    const data = Uint8Array.from(atob(payload.data), c => c.charCodeAt(0));
    const key  = await deriveKey(password, salt);
    const pt   = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
    return JSON.parse(new TextDecoder().decode(pt));
  }
  const isEncryptedBackup = obj => obj && obj.format === 'encrypted-finance-backup-v1';

  function askPassword(mode, callback) {
    $('passwordModalTitle').textContent = mode === 'encrypt' ? 'Пароль для шифрования' : 'Пароль для расшифровки';
    $('passwordModalHint').textContent = mode === 'encrypt'
      ? 'Оставьте пустым для незашифрованного бэкапа. Пароль нигде не сохраняется — запишите его!'
      : 'Введите пароль, которым был зашифрован бэкап.';
    $('passwordInput').value = '';
    $('passwordConfirm').value = '';
    $('passwordConfirm').style.display = mode === 'encrypt' ? 'block' : 'none';
    $('passwordOkBtn').onclick = () => {
      const pwd = $('passwordInput').value;
      if (mode === 'encrypt') {
        if (pwd && pwd !== $('passwordConfirm').value) { window.toast('Пароли не совпадают'); return; }
        window.closeModal('passwordModal'); callback(pwd);
      } else {
        if (!pwd) { window.toast('Введите пароль'); return; }
        window.closeModal('passwordModal'); callback(pwd);
      }
    };
    window.showModal('passwordModal');
    setTimeout(() => $('passwordInput').focus(), 320);
  }

  window.exportData = function() {
    askPassword('encrypt', async (password) => {
      try {
        const data = window.getBackupData();
        const content = password ? await encryptBackup(data, password) : data;
        const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = password ? 'finance.encrypted.json' : 'finance.json';
        a.click();
        window.toast(password ? 'Зашифровано и скачано 🔒' : 'Скачано');
      } catch (e) { console.error(e); window.toast('Ошибка экспорта'); }
    });
  };
  window.showBackupText = function() {
    askPassword('encrypt', async (password) => {
      try {
        const data = window.getBackupData();
        const content = password ? await encryptBackup(data, password) : data;
        $('backupTextarea').value = JSON.stringify(content, null, 2);
        window.showModal('backupModal');
      } catch (e) { console.error(e); window.toast('Ошибка'); }
    });
  };
  window.copyBackupText = function() { $('backupTextarea').select(); document.execCommand('copy'); window.toast('Скопировано'); };
  window.showImportTextModal = function() { $('importTextarea').value = ''; window.showModal('importTextModal'); };
  window.restoreData = function(data) { window.transactions = Array.isArray(data.transactions) ? data.transactions : []; window.categories = (data.categories && typeof data.categories === 'object') ? data.categories : JSON.parse(JSON.stringify(DEFAULT_CATS)); window.goals = Array.isArray(data.goals) ? data.goals : [{ id: Date.now(), name: 'Отпуск', target: 200000 }]; window.hiddenFilters = Array.isArray(data.hiddenFilters) ? data.hiddenFilters : []; window.fixedExpenses = Array.isArray(data.fixedExpenses) ? data.fixedExpenses : []; window.save(); window.render(); window.toast('Загружено'); };

  function handleImportedData(parsed) {
    if (isEncryptedBackup(parsed)) {
      askPassword('decrypt', async (password) => {
        try {
          const data = await decryptBackup(parsed, password);
          window.askConfirm('Импорт', 'Заменить данные?', 'Да', () => {
            window.restoreData(data);
            window.closeModal('importTextModal');
          });
        } catch (e) { window.toast('Неверный пароль или повреждённый файл'); }
      });
    } else {
      window.askConfirm('Импорт', 'Заменить данные?', 'Да', () => {
        window.restoreData(parsed);
        window.closeModal('importTextModal');
      });
    }
  }

  window.importFromText = function() {
    let parsed;
    try { parsed = JSON.parse($('importTextarea').value); } catch { window.toast('Ошибка формата'); return; }
    handleImportedData(parsed);
  };
  window.triggerImport = function() { $('importFile').click(); };
  window.handleImport = function(e) {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      let parsed;
      try { parsed = JSON.parse(ev.target.result); } catch { window.toast('Ошибка формата'); return; }
      handleImportedData(parsed);
    };
    r.readAsText(f);
    e.target.value = '';
  };
  window.clearAllData = () => window.askConfirm('Очистить?', 'Все записи удалятся.', 'Да', () => { window.transactions = []; window.save(); window.render(); });
  window.showAIReport = function() {
    if (!window.transactions.length) { window.toast('Нет данных'); return; }
    const inc = window.transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const exp = window.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    let r = `Выступи в роли профессионального финансового советника. Проанализируй мои финансы.\n\nЗадачи:\n1. Оцени ситуацию.\n2. Найди проблемные категории.\n3. Предложи 3 шага для оптимизации.\n\n--- ДАННЫЕ ---\nДоходы: ${fmt(inc)} ₽\nРасходы: ${fmt(exp)} ₽\nБаланс: ${fmt(inc-exp)} ₽\n\nРАСХОДЫ:\n`;
    const g = {}; window.transactions.filter(t => t.type === 'expense').forEach(t => { const n = window.categories[t.category]?.name || 'Другое'; g[n] = (g[n] || 0) + t.amount; });
    Object.entries(g).sort((a,b)=>b[1]-a[1]).forEach(([n, a]) => r += `- ${n}: ${fmt(a)} ₽\n`);
    r += `\nЦЕЛИ:\n`;
    window.goals.forEach(gl => { const s = window.transactions.filter(t => t.goalId === gl.id).reduce((x, t) => x + t.amount, 0); r += `- ${gl.name}: ${fmt(s)} / ${fmt(gl.target)} ₽\n`; });
    $('aiReportTextarea').value = r; window.showModal('aiReportModal');
  };
  window.copyAIReport = () => { $('aiReportTextarea').select(); document.execCommand('copy'); window.toast('Скопировано!'); };

  /* ================= PWA ================= */
  let deferredPrompt = null;
  let newWorker = null;
  let swRegistration = null;
  let refreshing = false;

  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent);

  function showInstallButton() { const btn = $('installAppBtn'); if (btn && !isStandalone()) btn.style.display = 'block'; }
  function hideInstallButton() { const btn = $('installAppBtn'); if (btn) btn.style.display = 'none'; }

  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; showInstallButton(); });
  window.addEventListener('appinstalled', () => { hideInstallButton(); window.toast('Приложение установлено!'); });

  window.installPWA = async function () {
    if (isStandalone()) return;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
      if (outcome === 'accepted') hideInstallButton();
      return;
    }
    if (isIOS()) window.toast('Нажмите ⬆️ (Поделиться) → «На экран Домой»');
    else window.toast('Меню браузера (⋮) → «Установить приложение»');
  };

  async function initServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    if (location.protocol === 'file:') { showInstallButton(); return; }
    try {
      swRegistration = await navigator.serviceWorker.register('./sw.js');
      swRegistration.update().catch(() => {});
      if (swRegistration.waiting && navigator.serviceWorker.controller) {
        newWorker = swRegistration.waiting;
        $('updateBanner').classList.add('show');
      }
      swRegistration.addEventListener('updatefound', () => {
        const installing = swRegistration.installing;
        if (!installing) return;
        installing.addEventListener('statechange', () => {
          if (installing.state === 'installed' && navigator.serviceWorker.controller) {
            newWorker = installing;
            $('updateBanner').classList.add('show');
          }
        });
      });
    } catch (e) { console.warn('[SW] failed:', e); showInstallButton(); }
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) { refreshing = true; window.location.reload(); }
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && swRegistration) swRegistration.update().catch(() => {});
  });

  window.applyUpdate = function () {
    if (newWorker) newWorker.postMessage({ type: 'SKIP_WAITING' });
    else if (swRegistration) swRegistration.update();
  };

  window.forceRefresh = function () {
    window.askConfirm('Очистить кэш и обновиться?', 'Приложение скачает свежие файлы с сервера. Ваши записи НЕ пострадают.', 'Очистить и обновить', async () => {
      try {
        if ('caches' in window) { const keys = await caches.keys(); await Promise.all(keys.map(k => caches.delete(k))); }
        if ('serviceWorker' in navigator) { const regs = await navigator.serviceWorker.getRegistrations(); await Promise.all(regs.map(r => r.unregister())); }
      } catch (e) { console.warn(e); }
      window.location.reload();
    });
  };

  initServiceWorker();
  if (!isStandalone()) showInstallButton();

  if ('Notification' in window && Notification.permission === 'default') setTimeout(() => Notification.requestPermission(), 5000);

  document.querySelectorAll('.modal-bg').forEach(bg => bg.addEventListener('click', e => { if (e.target === bg) window.closeModal(bg.id); }));
  $('confirmOk').addEventListener('click', () => { const a = window.confirmAction; window.confirmAction = null; window.closeModal('confirmModal'); if (a) a(); });
  $('title').addEventListener('keydown', e => { if (e.key === 'Enter') window.addTransaction(); });

  function initDraggableModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      const handle = modal.querySelector('.modal-handle'); if (!handle) return;
      let startY = 0, currentY = 0, isDragging = false;
      handle.addEventListener('touchstart', e => { startY = e.touches[0].clientY; isDragging = true; modal.style.transition = 'none'; }, { passive: true });
      handle.addEventListener('touchmove', e => { if (!isDragging) return; const diff = e.touches[0].clientY - startY; if (diff > 0) { if (e.cancelable) e.preventDefault(); currentY = diff; modal.style.transform = `translateY(${diff}px)`; } }, { passive: false });
      handle.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        modal.style.transition = '';
        if (currentY > 80) {
          modal.style.transform = '';
          window.closeModal(modal.closest('.modal-bg').id);
        } else modal.style.transform = '';
        currentY = 0;
      });
    });
  }

  initTheme();
  $('heroDate').textContent = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  window.setType('expense');
  window.processFixedExpenses();
  window.render();
  initDraggableModals();

});
