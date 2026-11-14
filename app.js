document.addEventListener('DOMContentLoaded', () => {
  const DEFAULT_CATS = {
    food:      { emoji: '🍔', name: 'Еда', type: 'expense', budget: null, keywords: [] },
    transport: { emoji: '🚕', name: 'Транспорт', type: 'expense', budget: null, keywords: [] },
    home:      { emoji: '🏠', name: 'Дом', type: 'expense', budget: null, keywords: [] },
    health:    { emoji: '💊', name: 'Здоровье', type: 'expense', budget: null, keywords: [] },
    fun:       { emoji: '🎉', name: 'Развлечения', type: 'expense', budget: null, keywords: [] },
    shop:      { emoji: '🛍️', name: 'Покупки', type: 'expense', budget: null, keywords: [] },
    other:     { emoji: '📦', name: 'Другое', type: 'expense', budget: null, keywords: [] },
    salary:    { emoji: '💼', name: 'Зарплата', type: 'income', budget: null, keywords: [] },
    gift:      { emoji: '🎁', name: 'Подарок', type: 'income', budget: null, keywords: [] },
    cashback:  { emoji: '💸', name: 'Кэшбэк', type: 'income', budget: null, keywords: [] },
    other_inc: { emoji: '💰', name: 'Другое', type: 'income', budget: null, keywords: [] }
  };

  window.categories    = JSON.parse(localStorage.getItem('categories')    || 'null') || { ...DEFAULT_CATS };
  
  for (let id in window.categories) {
    if (!window.categories[id].keywords) window.categories[id].keywords = [];
  }

  window.transactions  = JSON.parse(localStorage.getItem('transactions')  || '[]');
  window.hiddenFilters = JSON.parse(localStorage.getItem('hiddenFilters') || '[]');
  window.fixedExpenses = JSON.parse(localStorage.getItem('fixedExpenses') || '[]');
  
  window.goals = JSON.parse(localStorage.getItem('goals') || 'null');
  if (!window.goals) {
    const oldGoal = JSON.parse(localStorage.getItem('goal') || 'null');
    window.goals = oldGoal ? [{ id: Date.now(), ...oldGoal }] : [{ id: Date.now(), name: 'Отпуск', target: 200000 }];
    localStorage.removeItem('goal'); localStorage.setItem('goals', JSON.stringify(window.goals));
  }
  window.transactions.forEach(t => { if (t.category === 'goal_cat' && !t.goalId) t.goalId = window.goals[0].id; });

  window.activeFilter  = 'all';
  window.currentType   = 'expense';
  window.editingCatId  = null;
  window.editingFixedId = null;
  window.editingTxId   = null;
  window.editingGoalId = null;
  window.pickedEmoji   = '🍔';
  window.confirmAction = null;
  window.statsPeriod = 'all';
  window.statsKind   = 'expense';
  window.statsCategoryFilter = null; // Для вкладки Статистика
  let forcedByPlus   = false;
  let tempDeletedItem = null;

  const EMOJI_CHOICES = ['🍔','🚕','🏠','💊','🎉','🛍️','📦','☕','🍕','🍺','✈️','🎮','📚','🐾','👶','💻','🎵','🚗','⛽','💡','🧾','🎁','💅','🏋️','🚬','💍','🏦','📱','🎬','🌮','💼','💸','💰','💵','🏆','🤑','🎯'];

  const CAT_KEYWORDS = {
    food: ['еда', 'еду', 'кофе', 'обед', 'кафе', 'ресторан', 'мак', 'пятёрочка', 'магнит', 'пицца', 'суши', 'бургер', 'продукты', 'чай', 'перекус', 'шаурма', 'вкусвилл', 'завтрак', 'ужин'],
    transport: ['такси', 'метро', 'автобус', 'бензин', 'заправка', 'каршеринг', 'проезд', 'билет', 'электричка', 'самокат', 'яндекс го'],
    home: ['аренда', 'квартира', 'жкх', 'коммуналка', 'ремонт', 'мебель', 'икеа', 'дом', 'быт'],
    health: ['аптека', 'врач', 'таблетки', 'лекарства', 'анализы', 'стоматолог', 'больница', 'здоровье'],
    fun: ['кино', 'бар', 'пиво', 'игра', 'концерт', 'театр', 'подписка', 'нетфликс', 'развлечения', 'гулянка'],
    shop: ['одежда', 'кроссовки', 'обувь', 'шмот', 'озон', 'вайлдберриз', 'маркет', 'покупки'],
    salary: ['зарплата', 'аванс', 'зп'],
    gift: ['подарок', 'подарили']
  };

  const $ = id => document.getElementById(id);
  const fmt = n => n.toLocaleString('ru-RU', { maximumFractionDigits: 2 });

  // ================= ТЁМНАЯ ТЕМА =================
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
  // ===============================================

  window.save = function() {
    localStorage.setItem('categories',    JSON.stringify(window.categories));
    localStorage.setItem('transactions',  JSON.stringify(window.transactions));
    localStorage.setItem('goals',         JSON.stringify(window.goals));
    localStorage.setItem('hiddenFilters', JSON.stringify(window.hiddenFilters));
    localStorage.setItem('fixedExpenses', JSON.stringify(window.fixedExpenses));
  };

  window.escapeHtml = function(s) { if (!s) return ''; const d = document.createElement('div'); d.textContent = s; return d.innerHTML; };
  
  let toastTimer;
  window.toast = function(msg) { 
    const el = $('toast'); 
    el.innerHTML = msg; 
    el.classList.add('show'); 
    clearTimeout(toastTimer); 
    toastTimer = setTimeout(() => el.classList.remove('show'), 3000); 
  };
  
  window.closeModal = function(id) { $(id).classList.remove('show'); };
  window.askConfirm = function(title, text, okLabel, action) { $('confirmTitle').textContent = title; $('confirmText').textContent = text; $('confirmOk').textContent = okLabel; window.confirmAction = action; $('confirmModal').classList.add('show'); };

  const TABS = ['home', 'stats', 'goals', 'profile'];
  window.switchTab = function(tab) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    $('page-' + tab).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
    $('fab').classList.toggle('hidden', tab === 'profile' || tab === 'goals');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ================= ПЕРЕКЛЮЧЕНИЕ ВИДА СТАТИСТИКИ =================
  window.openCategoryStatsView = function(catId) {
    window.statsCategoryFilter = catId;
    const cat = catId === 'goal_cat' ? { emoji: '🎯', name: 'Цели' } : window.categories[catId];
    
    $('statsCategoryName').textContent = `${cat.emoji} ${cat.name}`;
    $('statsCategoriesView').style.display = 'none';
    $('statsHistoryHeader').style.display = 'block';
    $('statsHistoryView').style.display = 'block';
    $('kindSeg').style.display = 'none'; 
    
    window.renderStats();
  };

  window.closeStatsCategoryView = function() {
    window.statsCategoryFilter = null;
    $('statsCategoriesView').style.display = 'block';
    $('statsHistoryHeader').style.display = 'none';
    $('statsHistoryView').style.display = 'none';
    $('kindSeg').style.display = 'grid';
    
    window.renderStats();
  };

  // Выносим рендер айтема в отдельную функцию для переиспользования
  function renderListItem(e) {
    const isGoalTx = e.category === 'goal_cat';
    const cat = isGoalTx ? { emoji: '🎯', name: 'Цель' } : (window.categories[e.category] || { emoji: '📦', name: 'Другое' });
    const isInc = e.type === 'income';
    
    return `
      <div class="swipe-wrap">
        <div class="swipe-bg-edit">
          <span class="bg-emoji">✏️</span>
          <span class="bg-text">Изменить</span>
        </div>
        <div class="swipe-bg-delete">
          <span class="bg-text">Удалить</span>
          <span class="bg-emoji">🗑️</span>
        </div>
        <div class="list-item swipeable" data-id="${e.id}" data-goal="${isGoalTx}" data-translate="0">
          <div class="item-icon ${isInc ? 'inc' : 'exp'}">${cat.emoji}</div>
          <div class="item-info"><div class="item-title">${window.escapeHtml(e.title)}</div><div class="item-date">${window.escapeHtml(cat.name)} · ${window.formatDate(e.date)}</div></div>
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
      if (diffX >  60 && currentIdx > 0) switchTab(TABS[currentIdx - 1]);
    }
  }, { passive: true });

  // ================= ЛОГИКА СВАЙПОВ СПИСКА =================
  let openItem = null;
  let swipeStartX = 0, swipeStartY = 0, swipeCurrentItem = null, currentTranslate = 0;

  document.addEventListener('touchstart', e => {
    if (openItem && !e.target.closest('.swipeable')) {
      openItem.style.transform = 'translateX(0)';
      openItem.dataset.translate = '0';
      openItem.parentNode.querySelectorAll('.bg-text').forEach(el => el.style.opacity = 0);
      openItem = null;
    }
  }, { passive: true });

  // Универсальная настройка свайпов для контейнера
  function setupSwipe(containerId) {
    const container = $(containerId);
    if (!container) return;

    container.addEventListener('touchstart', e => {
      const item = e.target.closest('.swipeable');
      if (!item) return;

      if (openItem && openItem !== item) {
        openItem.style.transform = 'translateX(0)';
        openItem.dataset.translate = '0';
        openItem.parentNode.querySelectorAll('.bg-text').forEach(el => el.style.opacity = 0);
        openItem = null;
      }

      swipeStartX = e.touches[0].clientX;
      swipeStartY = e.touches[0].clientY;
      swipeCurrentItem = item;
      currentTranslate = parseFloat(item.dataset.translate || 0);
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

        if (!isOpened) {
          if (newTranslate < -80) newTranslate = -80;
          if (newTranslate > 80) newTranslate = 80;
        } else {
          if (newTranslate < -140) newTranslate = -140;
          if (newTranslate > 140) newTranslate = 140;
        }

        swipeCurrentItem.style.transform = `translateX(${newTranslate}px)`;
        swipeCurrentItem.dataset.translate = newTranslate;

        if (newTranslate > 0) {
          bgEdit.style.display = 'flex';
          bgDelete.style.display = 'none';
        } else if (newTranslate < 0) {
          bgEdit.style.display = 'none';
          bgDelete.style.display = 'flex';
        }

        let absT = Math.abs(newTranslate);
        let opacity = 0;
        if (isOpened && absT > 80) {
          opacity = Math.min(1, (absT - 80) / 40);
        }
        
        if (newTranslate > 0) txtEdit.style.opacity = opacity;
        else if (newTranslate < 0) txtDelete.style.opacity = opacity;

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
          swipeCurrentItem.style.transform = 'translateX(0)';
          openItem = null;
          
          const idx = window.transactions.findIndex(t => t.id === id);
          tempDeletedItem = window.transactions[idx];
          window.transactions.splice(idx, 1);
          
          window.save();
          window.render(); // Обновляем всё (включая статистику)
          
          window.toast(`Удалено <button onclick="window.undoDelete()">Отменить</button>`);
        } else if (finalTranslate >= 100) {
          swipeCurrentItem.style.transform = 'translateX(0)';
          openItem = null;
          if (!isGoal) window.openTxModal(id);
          else window.toast('Цель нельзя редактировать');
        } else {
          if (finalTranslate > -40 && finalTranslate < 40) {
            swipeCurrentItem.style.transform = 'translateX(0)';
            openItem = null;
          } else {
            const snapPos = finalTranslate < 0 ? -80 : 80;
            swipeCurrentItem.style.transform = `translateX(${snapPos}px)`;
            swipeCurrentItem.dataset.translate = snapPos;
          }
        }
      } else {
        if (finalTranslate <= -40) {
          swipeCurrentItem.style.transform = 'translateX(-80px)';
          swipeCurrentItem.dataset.translate = -80;
          openItem = swipeCurrentItem;
        } else if (finalTranslate >= 40) {
          swipeCurrentItem.style.transform = 'translateX(80px)';
          swipeCurrentItem.dataset.translate = 80;
          openItem = swipeCurrentItem;
        } else {
          swipeCurrentItem.style.transform = 'translateX(0)';
          openItem = null;
        }
      }
      
      swipeCurrentItem = null;
    });
  }

  // Включаем свайпы для главной и для статистики
  setupSwipe('list');
  setupSwipe('statsHistoryList');

  window.undoDelete = function() {
    if (tempDeletedItem) {
      window.transactions.unshift(tempDeletedItem);
      window.save();
      window.render();
      tempDeletedItem = null;
      window.toast('Восстановлено');
    }
  };

  // ================= ТРАНЗАКЦИИ =================
  window.openTxModal = function(id = null) {
    window.editingTxId = id; 
    forcedByPlus = false; 
    
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
    $('txModal').classList.add('show'); setTimeout(() => $('amount').focus(), 320);
  };

  window.setType = function(type) {
    window.currentType = type;
    const sw = $('typeSwitch');
    sw.classList.toggle('income', type === 'income');
    $('btnTypeExp').classList.toggle('active', type === 'expense');
    $('btnTypeInc').classList.toggle('active', type === 'income');
    const btn = $('submitBtn');
    btn.classList.toggle('is-exp', type === 'expense');
    btn.classList.toggle('is-inc', type === 'income');
    btn.textContent = type === 'expense' ? 'Сохранить расход' : 'Сохранить приход';
    $('title').placeholder = type === 'expense' ? 'На что потратили? (или +500 для прихода)' : 'Откуда пришли деньги?';
    window.renderCategorySelect();
  };

  window.parseSmartInput = function(text) {
    if (!text) return;

    const hasPlus = /^\s*\+/.test(text) || /\+\s*\d/.test(text);
    
    if (hasPlus) {
      forcedByPlus = true;
      if (window.currentType !== 'income') window.setType('income');
    } else if (forcedByPlus) {
      forcedByPlus = false;
      if (window.currentType !== 'expense') window.setType('expense');
    }

    const cleanText = text.replace(/\+/g, '');
    const lowerText = cleanText.toLowerCase();

    const amountRegex = /(\d+(?:[.,]\d{1,2})?)\s*₽?$/;
    const amountMatch = cleanText.match(amountRegex) || cleanText.match(/^\s*(\d+(?:[.,]\d{1,2})?)\s*₽?\s+/);
    if (amountMatch) $('amount').value = parseFloat(amountMatch[1].replace(',', '.'));

    const today = new Date();
    if (lowerText.includes('вчера')) {
      const y = new Date(today); y.setDate(y.getDate() - 1);
      $('txDate').value = y.toISOString().split('T')[0];
    } else if (lowerText.includes('позавчера')) {
      const y = new Date(today); y.setDate(y.getDate() - 2);
      $('txDate').value = y.toISOString().split('T')[0];
    } else {
      const dateMatch = cleanText.match(/(\d{1,2})[./](\d{1,2})(?:[./](\d{2,4}))?/);
      if (dateMatch) {
        const d = parseInt(dateMatch[1], 10);
        const m = parseInt(dateMatch[2], 10) - 1;
        let y = dateMatch[3] ? parseInt(dateMatch[3], 10) : today.getFullYear();
        if (y < 100) y += 2000;
        const parsedD = new Date(y, m, d);
        if (!isNaN(parsedD.getTime())) $('txDate').value = parsedD.toISOString().split('T')[0];
      }
    }

    let foundCatId = null;
    for (const [catId, keywords] of Object.entries(CAT_KEYWORDS)) {
      if (keywords.some(kw => lowerText.includes(kw))) {
        if (window.categories[catId]) { foundCatId = catId; break; }
      }
    }
    
    if (!foundCatId) {
      for (const [id, cat] of Object.entries(window.categories)) {
        if (lowerText.includes(cat.name.toLowerCase())) { foundCatId = id; break; }
        if (cat.keywords && cat.keywords.some(kw => lowerText.includes(kw))) { foundCatId = id; break; }
      }
    }

    if (foundCatId) {
      const catObj = window.categories[foundCatId];
      if (catObj.type !== window.currentType && !forcedByPlus) {
        window.setType(catObj.type);
      }
      $('category').value = foundCatId;
    }
  };

  $('title').addEventListener('input', (e) => window.parseSmartInput(e.target.value));
  $('title').addEventListener('keyup', (e) => window.parseSmartInput(e.target.value));
  
  $('title').addEventListener('blur', (e) => {
    let title = e.target.value.trim();
    if (!title) return;
    const cleaned = title.replace(/\+/g, '')
                         .replace(/(\d+(?:[.,]\d{1,2})?)\s*₽?$/g, '')
                         .replace(/вчера/gi, '')
                         .replace(/позавчера/gi, '')
                         .replace(/(\d{1,2})[./](\d{1,2})(?:[./](\d{2,4}))?/g, '')
                         .replace(/\s+/g, ' ')
                         .trim();
    if (cleaned && cleaned !== title) {
      e.target.value = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    } else if (!cleaned) {
      e.target.value = '';
    }
  });

  window.addTransaction = function() {
    window.parseSmartInput($('title').value);

    let title = $('title').value.trim();
    const amount = parseFloat($('amount').value);
    const category = $('category').value;
    const dateVal = $('txDate').value;
    
    title = title.replace(/\+/g, '')
                 .replace(/(\d+(?:[.,]\d{1,2})?)\s*₽?$/g, '')
                 .replace(/вчера/gi, '')
                 .replace(/позавчера/gi, '')
                 .replace(/(\d{1,2})[./](\d{1,2})(?:[./](\d{2,4}))?/g, '')
                 .replace(/\s+/g, ' ')
                 .trim();
    if (title) title = title.charAt(0).toUpperCase() + title.slice(1);

    if (!title) {
      if (window.currentType === 'income') title = 'Доход';
      else { window.toast('Введите описание'); return; }
    }
    
    if (!amount || amount <= 0) { window.toast('Введите сумму'); return; }
    
    const dateStr = dateVal ? new Date(dateVal + 'T12:00:00').toISOString() : new Date().toISOString();
    
    if (window.editingTxId) {
      const idx = window.transactions.findIndex(x => x.id === window.editingTxId);
      window.transactions[idx] = { ...window.transactions[idx], title, amount, category, type: window.currentType, date: dateStr };
    } else {
      window.transactions.unshift({ id: Date.now(), title, amount, category, type: window.currentType, date: dateStr });
    }
    
    window.save(); 
    window.closeModal('txModal'); 
    window.render(); // Обновит и статистику
    
    if (window.currentType === 'expense' && window.categories[category] && window.categories[category].budget > 0) {
      window.checkBudgetAlert(category);
    }

    window.toast(window.editingTxId ? 'Запись обновлена' : 'Добавлено');
    window.editingTxId = null;
  };

  window.checkBudgetAlert = function(catId) {
    const cat = window.categories[catId];
    if (!cat || !cat.budget) return;
    const now = new Date();
    const spent = window.transactions.filter(t => t.type === 'expense' && t.category === catId && new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear()).reduce((s, t) => s + t.amount, 0);
    if (spent > cat.budget) {
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('⚠️ Превышен бюджет!', { body: `Категория "${cat.name}"\nПотрачено: ${fmt(spent)} из ${fmt(cat.budget)} ₽` });
      }
    } else if (spent > cat.budget * 0.9) {
      if (navigator.vibrate) navigator.vibrate(100);
    }
  };

  window.deleteTransaction = function(id) {
    window.askConfirm('Удалить запись?', 'Это действие нельзя отменить.', 'Удалить', () => {
      window.transactions = window.transactions.filter(e => e.id !== id); window.save(); window.render();
    });
  };

  // ================= РЕНДЕР ЦЕЛЕЙ =================
  window.updateGoalUI = function() {
    const box = $('goalsList');
    if (!window.goals.length) { box.innerHTML = `<div class="empty" style="width:100%; padding:10px; background:var(--card); border-radius:22px; box-shadow:var(--shadow-card); margin-bottom:12px;">Нет целей. Добавьте первую!</div>`; return; }
    box.classList.toggle('multi', window.goals.length > 1);
    box.innerHTML = window.goals.map(goal => {
      const saved = window.transactions.filter(e => e.category === 'goal_cat' && e.goalId === goal.id).reduce((sum, e) => sum + e.amount, 0);
      const pct = goal.target > 0 ? Math.min(100, (saved / goal.target) * 100) : 0;
      return `
        <div class="goal-card-wrap">
          <div class="card" style="margin-bottom:0;">
            <div class="goal-top">
              <div class="goal-ring ${pct >= 100 ? 'done' : ''}" style="--p: ${pct.toFixed(2)}"><div class="goal-ring-inner">${Math.floor(pct)}%</div></div>
              <div class="goal-meta">
                <div class="goal-name-row"><h3>🎯 ${window.escapeHtml(goal.name)}</h3><button class="goal-edit" onclick="openGoalModal(${goal.id})">✏️</button></div>
                <div class="goal-amounts"><strong>${fmt(saved)} ₽</strong> <span>из ${fmt(goal.target)} ₽</span></div>
              </div>
            </div>
            <div class="goal-add-form">
              <input type="number" class="goal-add-input" placeholder="Сумма" min="0" step="0.01" inputmode="decimal">
              <button onclick="addToGoal(this, ${goal.id})">Отложить</button>
            </div>
          </div>
        </div>`;
    }).join('');
  };

  window.renderGoalsPage = function() {
    const box = $('goalsListVertical');
    $('goalsCount').textContent = window.goals.length || '0';
    if (!window.goals.length) { box.innerHTML = `<div class="empty"><div class="empty-emoji">🎯</div><div class="empty-title">Нет целей</div><div class="empty-sub">Добавьте свою первую цель</div></div>`; return; }
    box.innerHTML = window.goals.map(goal => {
      const gName = goal.name || goal.title || 'Без названия';
      const gTarget = goal.target || 0;
      const saved = window.transactions.filter(e => e.category === 'goal_cat' && e.goalId === goal.id).reduce((sum, e) => sum + e.amount, 0);
      const pct = gTarget > 0 ? Math.min(100, (saved / gTarget) * 100) : 0;
      const isDone = pct >= 100;
      
      return `
        <div class="list-item" style="padding: 14px 0;">
          <div class="item-icon" style="background:${isDone ? 'rgba(5,150,105,.1)' : 'rgba(99,102,241,.1)'}; color:${isDone ? 'var(--green)' : 'var(--brand)'};">🎯</div>
          <div class="item-info">
            <div class="item-title">${window.escapeHtml(gName)}</div>
            <div class="item-date">${fmt(saved)} из ${fmt(gTarget)} ₽ (${Math.floor(pct)}%)</div>
            <div class="budget-bar" style="margin-top:6px;"><div class="budget-bar-fill" style="width:${pct}%; background:${isDone ? 'var(--green)' : 'var(--brand)'}"></div></div>
          </div>
          <button type="button" onclick="deleteGoal(${goal.id})" style="width: 32px; height: 32px; border-radius: 50%; background: var(--input-bg); border: none; color: var(--muted); font-size: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; padding: 0;">✕</button>
        </div>`;
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
    if (isEdit) {
      const g = window.goals.find(x => x.id === id);
      $('goalNameInput').value = g.name; $('goalTargetInput').value = g.target;
    } else {
      $('goalNameInput').value = ''; $('goalTargetInput').value = '';
    }
    $('goalAddAmount').value = '';
    $('goalModal').classList.add('show');
  };

  window.saveGoal = function() {
    const name = $('goalNameInput').value.trim();
    const target = parseFloat($('goalTargetInput').value);
    const initial = parseFloat($('goalAddAmount').value);
    if (!name) { window.toast('Введите название'); return; }
    if (!target || target <= 0) { window.toast('Введите сумму'); return; }
    if (window.editingGoalId) {
      const g = window.goals.find(x => x.id === window.editingGoalId); g.name = name; g.target = target;
    } else {
      const newId = Date.now();
      window.goals.push({ id: newId, name, target });
      if (initial && initial > 0) {
        window.transactions.unshift({ id: Date.now() + 1, title: 'Отложено на: ' + name, amount: initial, category: 'goal_cat', goalId: newId, type: 'expense', date: new Date().toISOString() });
      }
    }
    window.save(); window.closeModal('goalModal'); window.render(); window.toast('Цель сохранена');
  };

  // ================= КАТЕГОРИИ =================
  window.renderCategorySelect = function() {
    const sel = $('category'); const current = sel.value;
    const available = Object.entries(window.categories).filter(([, c]) => c.type === window.currentType);
    sel.innerHTML = available.map(([id, c]) => `<option value="${id}">${c.emoji} ${window.escapeHtml(c.name)}</option>`).join('');
    if (available.some(([id]) => id === current)) sel.value = current;
  };

  window.openCatsModal = function() { window.renderCatsList(); $('catsModal').classList.add('show'); };

  window.renderCatsList = function() {
    const box = $('catsList');
    const expenseEntries = Object.entries(window.categories).filter(([, c]) => c.type === 'expense');
    const incomeEntries  = Object.entries(window.categories).filter(([, c]) => c.type === 'income');
    const renderRow = ([id, c]) => `<div class="cat-row"><div class="item-icon">${c.emoji}</div><div class="name">${window.escapeHtml(c.name)}</div><button class="icon-btn" onclick="openCatEditor('${id}')">✏️</button><button class="icon-btn" onclick="deleteCategory('${id}')">🗑️</button></div>`;
    box.innerHTML = `
      <div class="cats-section"><div class="cats-section-head expense"><span class="dot"></span><span>Расходы</span></div><div class="cats-section-list">${expenseEntries.map(renderRow).join('')}</div></div>
      <div class="cats-section"><div class="cats-section-head income"><span class="dot"></span><span>Доходы</span></div><div class="cats-section-list">${incomeEntries.map(renderRow).join('')}</div></div>`;
  };

  window.openCatEditor = function(id = null) {
    window.editingCatId = id;
    $('catEditorTitle').textContent = id ? 'Изменить категорию' : 'Новая категория';
    if (id && window.categories[id]) {
      $('catName').value = window.categories[id].name;
      $('catKeywords').value = (window.categories[id].keywords || []).join(', ');
      window.pickedEmoji = window.categories[id].emoji; $('catType').value = window.categories[id].type || 'expense';
    } else {
      $('catName').value = ''; $('catKeywords').value = ''; window.pickedEmoji = '🍔'; $('catType').value = window.currentType;
    }
    window.renderEmojiPicker(); window.closeModal('catsModal'); $('catEditorModal').classList.add('show');
  };

  window.renderEmojiPicker = function() { $('emojiPicker').innerHTML = EMOJI_CHOICES.map(e => `<span class="${e === window.pickedEmoji ? 'selected' : ''}" onclick="pickEmoji('${e}')">${e}</span>`).join(''); };
  window.pickEmoji = function(e) { window.pickedEmoji = e; $('catEmojiCustom').value = ''; window.renderEmojiPicker(); };

  window.saveCategory = function() {
    const name = $('catName').value.trim(); 
    const custom = $('catEmojiCustom').value.trim();
    const emoji = custom || window.pickedEmoji; 
    const type = $('catType').value;
    const kwString = $('catKeywords').value.trim();
    const keywords = kwString ? kwString.split(',').map(k => k.trim().toLowerCase()).filter(k => k) : [];

    if (!name) { window.toast('Введите название'); return; }
    
    if (window.editingCatId) {
      const oldBudget = window.categories[window.editingCatId].budget;
      window.categories[window.editingCatId] = { emoji, name, type, keywords, budget: type === 'expense' ? oldBudget : null };
    } else {
      window.categories['cat_' + Date.now()] = { emoji, name, type, keywords, budget: null };
    }
    
    window.save(); window.closeModal('catEditorModal'); window.openCatsModal(); window.render(); window.toast('Сохранено');
  };

  window.deleteCategory = function(id) {
    window.askConfirm(`Удалить "${window.categories[id].name}"?`, 'Записи станут "Без категории".', 'Удалить', () => {
      delete window.categories[id]; window.hiddenFilters = window.hiddenFilters.filter(x => x !== id);
      if (window.activeFilter === id) window.activeFilter = 'all';
      window.save(); window.renderCatsList(); window.render();
    });
  };

  window.openLimitsModal = function() {
    const box = $('limitsList');
    const expenseCats = Object.entries(window.categories).filter(([, c]) => c.type === 'expense');
    if (!expenseCats.length) {
      box.innerHTML = `<div class="empty">Нет категорий расходов</div>`;
    } else {
      box.innerHTML = expenseCats.map(([id, c]) => `
        <div class="filter-item" style="cursor:default; padding: 10px 12px;">
          <div class="filter-item-info"><div class="filter-item-icon">${c.emoji}</div><div>${window.escapeHtml(c.name)}</div></div>
          <input type="number" id="limit_${id}" class="limit-input" placeholder="0" value="${c.budget || ''}" min="0" step="1" inputmode="decimal">
        </div>
      `).join('');
    }
    $('limitsModal').classList.add('show');
  };

  window.saveLimits = function() {
    const expenseCats = Object.keys(window.categories).filter(id => window.categories[id].type === 'expense');
    expenseCats.forEach(id => { const val = parseFloat($('limit_' + id).value); window.categories[id].budget = val > 0 ? val : null; });
    window.save(); window.closeModal('limitsModal'); window.render(); window.toast('Лимиты сохранены');
  };

  window.openExportModal = function() { $('exportChoiceModal').classList.add('show'); };
  window.exportAsFile = function() { window.closeModal('exportChoiceModal'); window.exportData(); };
  window.exportAsText = function() { window.closeModal('exportChoiceModal'); window.showBackupText(); };

  window.openImportModal = function() { $('importChoiceModal').classList.add('show'); };
  window.importAsFile = function() { window.closeModal('importChoiceModal'); window.triggerImport(); };
  window.importAsText = function() { window.closeModal('importChoiceModal'); window.showImportTextModal(); };

  // ================= ФИЛЬТРЫ, БЮДЖЕТЫ И ГЛАВНЫЙ РЕНДЕР =================
  window.renderFilters = function() {
    const items = [{ key: 'all', emoji: '📊', name: 'Все' }];
    
    if (window.transactions.some(t => t.category === 'goal_cat')) {
      items.push({ key: 'goal_cat', emoji: '🎯', name: 'Цели' });
    }
    
    items.push(...Object.entries(window.categories).filter(([id]) => !window.hiddenFilters.includes(id)).map(([id, c]) => ({ key: id, ...c })));
    
    if (window.activeFilter !== 'all' && window.activeFilter !== 'goal_cat' && (!window.categories[window.activeFilter] || window.hiddenFilters.includes(window.activeFilter))) {
      window.activeFilter = 'all';
    }
    
    $('filters').innerHTML = items.map(c => `<div class="chip ${window.activeFilter === c.key ? 'active' : ''}" onclick="setFilter('${c.key}')">${c.emoji} ${window.escapeHtml(c.name)}</div>`).join('');
  };
  window.setFilter = function(key) { window.activeFilter = key; window.render(); };

  window.formatDate = function(iso) {
    const d = new Date(iso); const today = new Date();
    const time = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    if (d.toDateString() === today.toDateString()) return `Сегодня, ${time}`;
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) + ', ' + time;
  };

  window.renderBudgets = function() {
    const list = $('budgetsList'); const box = $('budgetsCard'); const now = new Date();
    const catsWithBudget = Object.entries(window.categories).filter(([id, c]) => c.budget > 0 && c.type === 'expense');
    if (!catsWithBudget.length) { box.style.display = 'none'; return; }
    box.style.display = 'block';
    list.innerHTML = catsWithBudget.map(([id, c]) => {
      const spent = window.transactions.filter(t => t.type === 'expense' && t.category === id && new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear()).reduce((s, t) => s + t.amount, 0);
      const pct = Math.min(100, (spent / c.budget) * 100);
      const isDanger = spent > c.budget;
      const hue = 120 - (120 * pct / 100);
      const barColor = `hsl(${hue}, 84%, 45%)`;
      return `
        <div class="budget-row">
          <div class="budget-row-top"><span class="name">${c.emoji} ${window.escapeHtml(c.name)}</span><span class="vals" style="color:${isDanger ? 'var(--red)' : 'var(--muted)'};">${fmt(spent)} / ${fmt(c.budget)} ₽</span></div>
          <div class="budget-bar"><div class="budget-bar-fill" style="width:${pct}%; background:${barColor}"></div></div>
        </div>`;
    }).join('');
  };

  window.render = function() {
    window.renderCategorySelect(); window.renderFilters(); window.updateGoalUI(); window.renderGoalsPage(); window.renderBudgets();
    const totalIncome = window.transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = window.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const totalBalance = totalIncome - totalExpense;
    const balanceEl = $('balance');
    balanceEl.innerHTML = fmt(totalBalance) + ' <small>₽</small>';
    balanceEl.classList.toggle('neg', totalBalance < 0);
    $('statIncome').textContent = '+' + fmt(totalIncome) + ' ₽';
    $('statExpense').textContent = '−' + fmt(totalExpense) + ' ₽';
    
    let totalSavedGoals = window.transactions.filter(t => t.category === 'goal_cat').reduce((s, t) => s + t.amount, 0);
    $('goalHeroAmount').innerHTML = fmt(totalSavedGoals) + ' <small>₽</small>';
    let totalTarget = window.goals.reduce((s, g) => s + g.target, 0);
    $('goalPercentLabel').textContent = totalTarget > 0 ? Math.floor((totalSavedGoals / totalTarget) * 100) + '%' : '0%';

    const filtered = window.activeFilter === 'all' ? window.transactions : window.transactions.filter(e => e.category === window.activeFilter);
    $('historyCount').textContent = filtered.length || '';
    const catTotalBox = $('catTotal');
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
    } else { catTotalBox.classList.remove('show'); }

    const list = $('list');
    if (filtered.length === 0) {
      list.innerHTML = `<div class="empty"><div class="empty-emoji">🫙</div><div class="empty-title">Пусто</div><div class="empty-sub">Нажмите «+», чтобы добавить</div></div>`;
    } else {
      list.innerHTML = filtered.map(e => renderListItem(e)).join('');
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
    $('statsIncome').textContent = '+' + fmt(income) + ' ₽';
    $('statsExpense').textContent = '−' + fmt(expense) + ' ₽';
    $('statsPeriodLabel').textContent = window.statsPeriod === 'all' ? 'Всё время' : (window.statsPeriod === 'month' ? 'Этот месяц' : 'Период');

    if (window.statsCategoryFilter) {
      // Рендерим историю по категории
      const filteredList = list.filter(t => t.category === window.statsCategoryFilter);
      $('statsHistoryCount').textContent = filteredList.length || '';
      
      const box = $('statsHistoryList');
      if (filteredList.length === 0) {
        box.innerHTML = `<div class="empty"><div class="empty-emoji">🫙</div><div class="empty-title">Пусто</div><div class="empty-sub">Нет записей за этот период</div></div>`;
      } else {
        box.innerHTML = filteredList.map(e => renderListItem(e)).join('');
      }
      return;
    }

    // Иначе рендерим категории
    const grouped = {};
    list.filter(t => t.type === window.statsKind).forEach(t => { grouped[t.category] = (grouped[t.category] || 0) + t.amount; });
    const entries = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((s, [, v]) => s + v, 0);
    const box = $('statsList');
    box.classList.toggle('income', window.statsKind === 'income');
    $('statsKindTitle').textContent = window.statsKind === 'income' ? 'Доходы по категориям' : 'Расходы по категориям';
    if (!entries.length) { box.innerHTML = `<div class="empty"><div class="empty-emoji">📊</div><div class="empty-title">Нет данных</div></div>`; return; }
    box.innerHTML = entries.map(([id, val]) => {
      const c = id === 'goal_cat' ? { emoji: '🎯', name: 'Цель' } : (window.categories[id] || { emoji: '📦', name: 'Другое' });
      const pct = total ? Math.round((val / total) * 100) : 0;
      
      return `<div class="stat-row" onclick="window.openCategoryStatsView('${id}')" style="cursor: pointer;">
                <div class="item-icon">${c.emoji}</div>
                <div class="stat-info">
                  <div class="stat-row-top">
                    <span class="stat-name">${window.escapeHtml(c.name)}</span>
                    <span class="stat-amount">${fmt(val)} ₽ · ${pct}%</span>
                  </div>
                  <div class="stat-bar-bg"><div class="stat-bar-fill" style="width:${pct}%"></div></div>
                </div>
              </div>`;
    }).join('');
  };

  window.openFixedModal = function() { window.renderFixedList(); $('fixedModal').classList.add('show'); };
  window.renderFixedList = function() {
    const box = $('fixedList');
    if (window.fixedExpenses.length === 0) { box.innerHTML = `<div class="empty"><div class="empty-title">Пока нет платежей</div></div>`; return; }
    box.innerHTML = window.fixedExpenses.map(fx => `<div class="cat-row"><div class="item-icon">${window.categories[fx.categoryId]?.emoji || '📦'}</div><div class="name">${window.escapeHtml(fx.title)}<br><span style="font-size:11px; color:var(--muted);">${fx.dayOfMonth}-е число</span></div><div class="item-amount exp">−${fmt(fx.amount)} ₽</div><button class="icon-btn" onclick="openFixedEditor(${fx.id})">✏️</button><button class="icon-btn" onclick="deleteFixed(${fx.id})">🗑️</button></div>`).join('');
  };
  window.openFixedEditor = function(id = null) {
    window.editingFixedId = id; const cats = Object.entries(window.categories).filter(([, c]) => c.type === 'expense');
    $('fixedCategory').innerHTML = cats.map(([cid, c]) => `<option value="${cid}">${c.emoji} ${c.name}</option>`).join('');
    if (id) {
      const fx = window.fixedExpenses.find(x => x.id === id);
      $('fixedName').value = fx.title; $('fixedAmount').value = fx.amount; $('fixedCategory').value = fx.categoryId;
      $('fixedDate').value = new Date(new Date().getFullYear(), new Date().getMonth(), fx.dayOfMonth).toISOString().split('T')[0];
    } else {
      $('fixedName').value = ''; $('fixedAmount').value = ''; $('fixedDate').value = new Date().toISOString().split('T')[0];
    }
    window.closeModal('fixedModal'); $('fixedEditorModal').classList.add('show');
  };
  window.saveFixed = function() {
    const name = $('fixedName').value.trim(); const amount = parseFloat($('fixedAmount').value);
    const categoryId = $('fixedCategory').value; const dayOfMonth = new Date($('fixedDate').value).getDate();
    if (!name || !amount || amount <= 0) { window.toast('Заполните поля'); return; }
    if (window.editingFixedId) Object.assign(window.fixedExpenses.find(x => x.id === window.editingFixedId), { title: name, amount, categoryId, dayOfMonth });
    else window.fixedExpenses.push({ id: Date.now(), title: name, amount, categoryId, dayOfMonth, lastCharged: null, type: 'expense' });
    window.save(); window.closeModal('fixedEditorModal'); window.openFixedModal(); window.render(); window.toast('Сохранено');
  };
  window.deleteFixed = function(id) { window.askConfirm('Удалить?', '', 'Да', () => { window.fixedExpenses = window.fixedExpenses.filter(x => x.id !== id); window.save(); window.renderFixedList(); }); };
  window.processFixedExpenses = function() {
    const now = new Date(); const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    let added = 0;
    window.fixedExpenses.forEach(fx => {
      if (now.getDate() >= fx.dayOfMonth && fx.lastCharged !== currentMonth) {
        window.transactions.unshift({ id: Date.now() + Math.random(), title: fx.title + ' (авто)', amount: fx.amount, category: fx.categoryId, type: 'expense', date: new Date(now.getFullYear(), now.getMonth(), fx.dayOfMonth).toISOString() });
        fx.lastCharged = currentMonth; added++;
      }
    });
    if (added > 0) { window.save(); window.toast(`Добавлено авто-платежей: ${added}`); }
  };

  window.openFilterSettings = function() {
    const box = $('filterSettingsList');
    box.innerHTML = Object.entries(window.categories).sort((a,b) => a[1].name.localeCompare(b[1].name)).map(([id, c]) => {
      const isActive = !window.hiddenFilters.includes(id);
      return `<div class="filter-item ${isActive ? 'active' : ''}" onclick="toggleFilter('${id}')"><div class="filter-item-info"><div class="filter-item-icon">${c.emoji}</div><div>${c.name}</div></div><div class="checkbox"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></div></div>`;
    }).join('');
    $('filterSettingsModal').classList.add('show');
  };
  window.toggleFilter = function(id) {
    if (window.hiddenFilters.includes(id)) window.hiddenFilters = window.hiddenFilters.filter(x => x !== id);
    else window.hiddenFilters.push(id);
    if (window.hiddenFilters.length === Object.keys(window.categories).length) { window.toast('Оставьте хотя бы одну'); return; }
    window.save(); window.openFilterSettings(); window.renderFilters(); window.render();
  };

  window.getBackupData = function() { return { exportedAt: new Date().toISOString(), goals: window.goals, categories: window.categories, transactions: window.transactions, hiddenFilters: window.hiddenFilters, fixedExpenses: window.fixedExpenses }; };
  window.exportData = function() { const blob = new Blob([JSON.stringify(window.getBackupData(), null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'finance.json'; a.click(); window.toast('Скачано'); };
  window.showBackupText = function() { $('backupTextarea').value = JSON.stringify(window.getBackupData(), null, 2); $('backupModal').classList.add('show'); };
  window.copyBackupText = function() { $('backupTextarea').select(); document.execCommand('copy'); window.toast('Скопировано'); };
  window.showImportTextModal = function() { $('importTextarea').value = ''; $('importTextModal').classList.add('show'); };
  window.restoreData = function(data) { window.transactions = data.transactions || []; window.categories = data.categories || { ...DEFAULT_CATS }; window.goals = data.goals || [{ id: Date.now(), name: 'Отпуск', target: 200000 }]; window.hiddenFilters = data.hiddenFilters || []; window.fixedExpenses = data.fixedExpenses || []; window.save(); window.render(); window.toast('Загружено'); };
  window.importFromText = function() { try { const d = JSON.parse($('importTextarea').value); window.askConfirm('Импорт', 'Заменить данные?', 'Да', () => { window.restoreData(d); window.closeModal('importTextModal'); }); } catch { window.toast('Ошибка формата'); } };
  window.triggerImport = function() { $('importFile').click(); };
  window.handleImport = function(e) { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = ev => { try { const d = JSON.parse(ev.target.result); window.askConfirm('Импорт', 'Заменить?', 'Да', () => window.restoreData(d)); } catch { window.toast('Ошибка'); } }; r.readAsText(f); e.target.value = ''; };
  window.clearAllData = function() { window.askConfirm('Очистить?', 'Все записи удалятся.', 'Да', () => { window.transactions = []; window.save(); window.render(); }); };

  window.showAIReport = function() {
    if (!window.transactions.length) { window.toast('Нет данных'); return; }
    const inc = window.transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const exp = window.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    let r = `Выступи в роли профессионального финансового советника. Проанализируй мои финансы.\n\nЗадачи:\n1. Оцени ситуацию.\n2. Найди проблемные категории.\n3. Предложи 3 шага для оптимизации.\n\n--- ДАННЫЕ ---\nДоходы: ${fmt(inc)} ₽\nРасходы: ${fmt(exp)} ₽\nБаланс: ${fmt(inc-exp)} ₽\n\nРАСХОДЫ:\n`;
    const g = {}; window.transactions.filter(t => t.type === 'expense').forEach(t => { const n = window.categories[t.category]?.name || 'Другое'; g[n] = (g[n] || 0) + t.amount; });
    Object.entries(g).sort((a,b)=>b[1]-a[1]).forEach(([n, a]) => r += `- ${n}: ${fmt(a)} ₽\n`);
    r += `\nЦЕЛИ:\n`;
    window.goals.forEach(gl => { const s = window.transactions.filter(t => t.goalId === gl.id).reduce((x, t) => x + t.amount, 0); r += `- ${gl.name}: ${fmt(s)} / ${fmt(gl.target)} ₽\n`; });
    $('aiReportTextarea').value = r; $('aiReportModal').classList.add('show');
  };
  window.copyAIReport = function() { $('aiReportTextarea').select(); document.execCommand('copy'); window.toast('Скопировано!'); };

  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; $('installAppBtn').style.display = 'block'; });
  window.installPWA = function() { if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt.userChoice.then((r) => { if (r.outcome === 'accepted') $('installAppBtn').style.display = 'none'; deferredPrompt = null; }); } };

  if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(console.error));
  }

  if ('Notification' in window) {
    if (Notification.permission === 'default') { setTimeout(() => { Notification.requestPermission(); }, 5000); }
  }

  document.querySelectorAll('.modal-bg').forEach(bg => bg.addEventListener('click', e => { if (e.target === bg) bg.classList.remove('show'); }));
  $('confirmOk').addEventListener('click', () => { const a = window.confirmAction; window.confirmAction = null; window.closeModal('confirmModal'); if (a) a(); });
  $('title').addEventListener('keydown', e => { if (e.key === 'Enter') window.addTransaction(); });

  function initDraggableModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      const handle = modal.querySelector('.modal-handle'); if (!handle) return;
      let startY = 0, currentY = 0, isDragging = false;
      handle.addEventListener('touchstart', e => { startY = e.touches[0].clientY; isDragging = true; modal.style.transition = 'none'; }, { passive: true });
      handle.addEventListener('touchmove', e => { if (!isDragging) return; const diff = e.touches[0].clientY - startY; if (diff > 0) { if (e.cancelable) e.preventDefault(); currentY = diff; modal.style.transform = `translateY(${diff}px)`; } }, { passive: false });
      handle.addEventListener('touchend', () => { if (!isDragging) return; isDragging = false; modal.style.transition = ''; if (currentY > 80) { modal.style.transform = ''; modal.closest('.modal-bg').classList.remove('show'); } else modal.style.transform = ''; currentY = 0; });
    });
  }

  // Первичная инициализация
  initTheme(); // Включаем тему
  $('heroDate').textContent = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  window.setType('expense'); 
  window.processFixedExpenses(); 
  window.render(); 
  initDraggableModals();

});