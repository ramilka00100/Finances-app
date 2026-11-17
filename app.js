/* ============================================================
   Мои финансы · app.js
   Логика: экраны, шторки, тёмная тема, данные в localStorage
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Ключи хранилища ---------- */
  var LS = {
    transactions: 'mf_transactions',
    goals: 'mf_goals',
    categories: 'mf_categories',
    limits: 'mf_limits',
    payments: 'mf_payments',
    theme: 'mf_theme',
    period: 'mf_period'
  };

  /* Дефолтные категории: [иконка, название, тип] */
  var DEFAULT_CATEGORIES = [
    ['🍔', 'Еда', 'expense'],
    ['🚗', 'Транспорт', 'expense'],
    ['🏠', 'Жильё', 'expense'],
    ['🎉', 'Развлечения', 'expense'],
    ['💊', 'Здоровье', 'expense'],
    ['🛍️', 'Покупки', 'expense'],
    ['💼', 'Зарплата', 'income'],
    ['🎁', 'Подарки', 'income'],
    ['📈', 'Прочий доход', 'income']
  ];

  /* ---------- Утилиты ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function on(el, ev, fn) { if (el) el.addEventListener(ev, fn); }

  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : (fallback !== undefined ? fallback : null);
    } catch (e) { return fallback !== undefined ? fallback : null; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { console.warn('Не удалось сохранить данные', e); }
  }

  function money(n) {
    var sign = n < 0 ? '−' : '';
    return sign + Math.abs(Math.round(n)).toLocaleString('ru-RU') + ' ₽';
  }

  function todayISO() {
    var d = new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function formatDate(iso) {
    var parts = iso.split('-');
    if (parts.length !== 3) return iso;
    return parts[2] + '.' + parts[1] + '.' + parts[0];
  }

  function uid() {
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
  }

  /* ---------- Данные ---------- */
  var state = {
    transactions: load(LS.transactions, []),
    goals: load(LS.goals, []),
    categories: load(LS.categories, null) || DEFAULT_CATEGORIES.map(function (c) {
      return { id: uid(), icon: c[0], name: c[1], type: c[2] };
    }),
    limits: load(LS.limits, {}),
    payments: load(LS.payments, []),
    period: load(LS.period, 'all') // all | month | custom
  };
  save(LS.categories, state.categories);

  /* ---------- Экраны ---------- */
  function showScreen(name) {
    $all('.screen').forEach(function (s) {
      s.classList.toggle('active', s.dataset.screen === name);
    });
    $all('.nav-item').forEach(function (n) {
      n.classList.toggle('active', n.dataset.screen === name);
    });
    window.scrollTo(0, 0);
  }

  $all('.nav-item').forEach(function (item) {
    on(item, 'click', function () { showScreen(item.dataset.screen); });
  });

  /* ---------- Шторки (модалки) ---------- */
  var overlay = $('.modal-overlay');

  function openModal(id) {
    var m = document.getElementById(id);
    if (!m) return;
    if (overlay) overlay.classList.add('active');
    m.classList.add('active');
  }

  function closeModal(m) {
    if (!m) m = $('.modal.active');
    if (!m) return;
    m.classList.remove('active');
    if (!$('.modal.active') && overlay) overlay.classList.remove('active');
  }

  $all('[data-open]').forEach(function (btn) {
    on(btn, 'click', function () { openModal(btn.dataset.open); });
  });
  $all('[data-close]').forEach(function (btn) {
    on(btn, 'click', function () { closeModal(btn.closest('.modal')); });
  });
  on(overlay, 'click', function () { closeModal(); });

  /* ---------- Тёмная тема ---------- */
  var darkToggle = $('#toggle-dark');

  function applyTheme() {
    var dark = localStorage.getItem(LS.theme) === 'dark';
    document.body.classList.toggle('dark', dark);
    if (darkToggle) darkToggle.checked = dark;
  }
  on(darkToggle, 'change', function () {
    localStorage.setItem(LS.theme, darkToggle.checked ? 'dark' : 'light');
    applyTheme();
  });
  applyTheme();

  /* ---------- Переключатель − Расход / + Приход ---------- */
  $all('.segmented .segment').forEach(function (seg) {
    on(seg, 'click', function () {
      $all('.segmented .segment').forEach(function (s) { s.classList.remove('active'); });
      seg.classList.add('active');
      var isIncome = seg.dataset.value === 'income';
      var submit = $('#record-submit');
      if (submit) submit.textContent = isIncome ? 'Добавить доход' : 'Добавить расход';
    });
  });

  /* ---------- Категории: селект для «Новая запись» ---------- */
  function fillCategorySelect() {
    var sel = $('#record-category');
    if (!sel) return;
    var income = $('.segmented .segment.active');
    var type = income && income.dataset.value === 'income' ? 'income' : 'expense';
    sel.innerHTML = '';
    state.categories
      .filter(function (c) { return c.type === type; })
      .forEach(function (c) {
        var opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.icon + ' ' + c.name;
        sel.appendChild(opt);
      });
  }
  $all('.segmented .segment').forEach(function (seg) {
    on(seg, 'click', fillCategorySelect);
  });

  /* ---------- Баланс и сводки ---------- */
  function sum(list) { return list.reduce(function (acc, t) { return acc + t.amount; }, 0); }

  function isInPeriod(t) {
    if (state.period === 'month') {
      var now = new Date();
      var ym = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
      return t.date.indexOf(ym) === 0;
    }
    return true; // «Всё время» и «Период» — пока всё время
  }

  function renderBalance() {
    var income = sum(state.transactions.filter(function (t) { return t.type === 'income' && isInPeriod(t); }));
    var expense = sum(state.transactions.filter(function (t) { return t.type === 'expense' && isInPeriod(t); }));

    var balance = $('#balance-value');
    if (balance) balance.textContent = money(income - expense);
    var inc = $('#income-value');
    if (inc) inc.textContent = '+' + money(income).replace('−', '');
    var exp = $('#expense-value');
    if (exp) exp.textContent = '−' + money(expense);

    /* Статистика */
    var sInc = $('#stats-income');
    if (sInc) sInc.textContent = '+' + money(income).replace('−', '');
    var sExp = $('#stats-expense');
    if (sExp) sExp.textContent = '−' + money(expense);
  }

  /* ---------- История ---------- */
  function renderHistory() {
    var list = $('#history-list');
    if (!list) return;
    list.innerHTML = '';

    var items = state.transactions
      .slice()
      .sort(function (a, b) { return b.date.localeCompare(a.date) || b.createdAt - a.createdAt; });

    if (!items.length) {
      var empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'Пока нет записей. Нажмите «+», чтобы добавить первую.';
      list.appendChild(empty);
      return;
    }

    items.forEach(function (t) {
      var cat = state.categories.find(function (c) { return c.id === t.categoryId; });
      var row = document.createElement('div');
      row.className = 'history-item';

      var icon = document.createElement('span');
      icon.className = 'history-icon';
      icon.textContent = cat ? cat.icon : '❓';

      var info = document.createElement('div');
      info.className = 'history-info';
      var title = document.createElement('div');
      title.className = 'history-title';
      title.textContent = t.note || (cat ? cat.name : 'Без категории');
      var date = document.createElement('div');
      date.className = 'history-date';
      date.textContent = formatDate(t.date);
      info.appendChild(title);
      info.appendChild(date);

      var amount = document.createElement('span');
      amount.className = 'history-amount ' + (t.type === 'income' ? 'income' : 'expense');
      amount.textContent = (t.type === 'income' ? '+' : '−') + money(t.amount).replace('−', '');

      var del = document.createElement('button');
      del.className = 'history-delete';
      del.textContent = '✕';
      del.setAttribute('aria-label', 'Удалить запись');
      on(del, 'click', function () {
        state.transactions = state.transactions.filter(function (x) { return x.id !== t.id; });
        save(LS.transactions, state.transactions);
        renderAll();
      });

      row.appendChild(icon);
      row.appendChild(info);
      row.appendChild(amount);
      row.appendChild(del);
      list.appendChild(row);
    });
  }

  /* ---------- Бюджеты (лимиты) ---------- */
  function renderBudgets() {
    var box = $('#budgets-list');
    if (!box) return;
    box.innerHTML = '';

    var now = new Date();
    var ym = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    var spentByCat = {};
    state.transactions.forEach(function (t) {
      if (t.type === 'expense' && t.date.indexOf(ym) === 0) {
        spentByCat[t.categoryId] = (spentByCat[t.categoryId] || 0) + t.amount;
      }
    });

    var any = false;
    state.categories.forEach(function (c) {
      var limit = state.limits[c.id];
      if (!limit) return;
      any = true;
      var spent = spentByCat[c.id] || 0;
      var pct = Math.min(100, Math.round(spent / limit * 100));
      var over = spent > limit;

      var row = document.createElement('div');
      row.className = 'budget-item';
      row.innerHTML =
        '<div class="budget-head"><span>' + c.icon + ' ' + c.name + '</span>' +
        '<span class="budget-sum' + (over ? ' over' : '') + '">' +
        money(spent) + ' / ' + money(limit) + '</span></div>' +
        '<div class="budget-bar"><div class="budget-fill' + (over ? ' over' : '') + '" style="width:' + pct + '%"></div></div>';
      box.appendChild(row);
    });

    if (!any) {
      var hint = document.createElement('div');
      hint.className = 'empty-state';
      hint.textContent = 'Лимиты не заданы. Нажмите ⚙️, чтобы настроить.';
      box.appendChild(hint);
    }
  }

  /* ---------- Лимиты: форма ---------- */
  function renderLimitsForm() {
    var box = $('#limits-form');
    if (!box) return;
    box.innerHTML = '';
    state.categories.filter(function (c) { return c.type === 'expense'; }).forEach(function (c) {
      var row = document.createElement('div');
      row.className = 'limits-row';
      var label = document.createElement('label');
      label.textContent = c.icon + ' ' + c.name;
      var input = document.createElement('input');
      input.type = 'number';
      input.min = '0';
      input.placeholder = '—';
      input.value = state.limits[c.id] || '';
      on(input, 'input', function () {
        var v = parseInt(input.value, 10);
        if (v > 0) state.limits[c.id] = v; else delete state.limits[c.id];
        save(LS.limits, state.limits);
        renderBudgets();
      });
      row.appendChild(label);
      row.appendChild(input);
      box.appendChild(row);
    });
  }

  /* ---------- Цели ---------- */
  function renderGoals() {
    var list = $('#goals-list');
    if (!list) return;
    list.innerHTML = '';

    var totalSaved = 0, totalTarget = 0;

    state.goals.forEach(function (g) {
      totalSaved += g.saved || 0;
      totalTarget += g.target || 0;
      var pct = g.target ? Math.min(100, Math.round((g.saved || 0) / g.target * 100)) : 0;

      var card = document.createElement('div');
      card.className = 'goal-item';
      card.innerHTML =
        '<div class="goal-head"><span class="goal-name">' + (g.icon || '🎯') + ' ' + g.name + '</span>' +
        '<span class="goal-sum">' + money(g.saved || 0) + ' / ' + money(g.target) + '</span></div>' +
        '<div class="goal-bar"><div class="goal-fill" style="width:' + pct + '%"></div></div>' +
        '<div class="goal-pct">' + pct + '%</div>';

      var del = document.createElement('button');
      del.className = 'goal-delete';
      del.textContent = '🗑️';
      del.setAttribute('aria-label', 'Удалить цель');
      on(del, 'click', function () {
        state.goals = state.goals.filter(function (x) { return x.id !== g.id; });
        save(LS.goals, state.goals);
        renderGoals();
      });
      card.appendChild(del);
      list.appendChild(card);
    });

    var pct = totalTarget ? Math.round(totalSaved / totalTarget * 100) : 0;
    var ring = $('#goals-percent');
    if (ring) ring.textContent = pct + '%';
    var saved = $('#goals-saved');
    if (saved) saved.textContent = money(totalSaved);
  }

  /* ---------- Добавление записи ---------- */
  var recordForm = $('#record-form');
  on(recordForm, 'submit', function (e) {
    e.preventDefault();
    var amountInput = $('#record-amount');
    var noteInput = $('#record-note');
    var dateInput = $('#record-date');
    var amount = parseFloat(String(amountInput.value).replace(',', '.'));
    if (!amount || amount <= 0) { amountInput.focus(); return; }

    var activeSeg = $('.segmented .segment.active');
    var type = activeSeg && activeSeg.dataset.value === 'income' ? 'income' : 'expense';
    var catId = $('#record-category') ? $('#record-category').value : null;

    state.transactions.push({
      id: uid(),
      type: type,
      amount: amount,
      categoryId: catId,
      note: (noteInput && noteInput.value.trim()) || '',
      date: (dateInput && dateInput.value) || todayISO(),
      createdAt: Date.now()
    });
    save(LS.transactions, state.transactions);

    if (amountInput) amountInput.value = '';
    if (noteInput) noteInput.value = '';
    if (dateInput) dateInput.value = todayISO();
    renderAll();
    closeModal($('#modal-record'));
  });

  /* ---------- Новая цель ---------- */
  var goalForm = $('#goal-form');
  on(goalForm, 'submit', function (e) {
    e.preventDefault();
    var name = $('#goal-name');
    var target = $('#goal-target');
    if (!name.value.trim()) { name.focus(); return; }
    state.goals.push({
      id: uid(),
      name: name.value.trim(),
      target: parseFloat(String(target.value).replace(',', '.')) || 0,
      saved: 0,
      icon: $('#goal-icon') ? $('#goal-icon').value : '🎯'
    });
    save(LS.goals, state.goals);
    name.value = ''; target.value = '';
    renderGoals();
    closeModal($('#modal-goal'));
  });

  /* ---------- Категории: список ---------- */
  function renderCategories() {
    var list = $('#categories-list');
    if (!list) return;
    list.innerHTML = '';
    state.categories.forEach(function (c) {
      var row = document.createElement('div');
      row.className = 'category-item';
      row.innerHTML = '<span class="category-icon">' + c.icon + '</span><span>' + c.name + '</span>';
      var del = document.createElement('button');
      del.className = 'category-delete';
      del.textContent = '✕';
      on(del, 'click', function () {
        state.categories = state.categories.filter(function (x) { return x.id !== c.id; });
        save(LS.categories, state.categories);
        renderCategories();
        fillCategorySelect();
      });
      row.appendChild(del);
      list.appendChild(row);
    });
  }

  /* ---------- Новая категория ---------- */
  var catForm = $('#category-form');
  on(catForm, 'submit', function (e) {
    e.preventDefault();
    var name = $('#category-name');
    var icon = $('#category-icon');
    var type = $('#category-type');
    if (!name.value.trim()) { name.focus(); return; }
    state.categories.push({
      id: uid(),
      icon: icon && icon.value ? icon.value : '🏷️',
      name: name.value.trim(),
      type: type ? type.value : 'expense'
    });
    save(LS.categories, state.categories);
    name.value = '';
    renderCategories();
    fillCategorySelect();
    closeModal($('#modal-new-category'));
  });

  /* ---------- Регулярные платежи ---------- */
  function renderPayments() {
    var list = $('#payments-list');
    if (!list) return;
    list.innerHTML = '';
    state.payments.forEach(function (p) {
      var row = document.createElement('div');
      row.className = 'history-item';
      row.innerHTML =
        '<span class="history-icon">🔁</span>' +
        '<div class="history-info"><div class="history-title">' + p.name + '</div>' +
        '<div class="history-date">каждое ' + p.day + ' числа</div></div>' +
        '<span class="history-amount expense">−' + money(p.amount).replace('−', '') + '</span>';
      var del = document.createElement('button');
      del.className = 'history-delete';
      del.textContent = '✕';
      on(del, 'click', function () {
        state.payments = state.payments.filter(function (x) { return x.id !== p.id; });
        save(LS.payments, state.payments);
        renderPayments();
      });
      row.appendChild(del);
      list.appendChild(row);
    });
  }

  var payForm = $('#payment-form');
  on(payForm, 'submit', function (e) {
    e.preventDefault();
    var name = $('#payment-name');
    var amount = $('#payment-amount');
    var day = $('#payment-day');
    if (!name.value.trim()) { name.focus(); return; }
    state.payments.push({
      id: uid(),
      name: name.value.trim(),
      amount: parseFloat(String(amount.value).replace(',', '.')) || 0,
      day: parseInt(day.value, 10) || 1
    });
    save(LS.payments, state.payments);
    name.value = ''; amount.value = ''; day.value = '';
    renderPayments();
    closeModal($('#modal-new-payment'));
  });

  /* ---------- Период статистики ---------- */
  $all('[data-period]').forEach(function (btn) {
    on(btn, 'click', function () {
      $all('[data-period]').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      state.period = btn.dataset.period;
      save(LS.period, state.period);
      renderBalance();
    });
  });

  /* ---------- Экспорт / Импорт ---------- */
  function exportData() { return JSON.stringify({
    version: '2.1.0',
    exportedAt: new Date().toISOString(),
    transactions: state.transactions,
    goals: state.goals,
    categories: state.categories,
    limits: state.limits,
    payments: state.payments
  }, null, 2); }

  function applyImport(text) {
    var data = JSON.parse(text);
    if (!data || typeof data !== 'object') throw new Error('Некорректный формат');
    if (Array.isArray(data.transactions)) state.transactions = data.transactions;
    if (Array.isArray(data.goals)) state.goals = data.goals;
    if (Array.isArray(data.categories) && data.categories.length) state.categories = data.categories;
    if (data.limits && typeof data.limits === 'object') state.limits = data.limits;
    if (Array.isArray(data.payments)) state.payments = data.payments;
    save(LS.transactions, state.transactions);
    save(LS.goals, state.goals);
    save(LS.categories, state.categories);
    save(LS.limits, state.limits);
    save(LS.payments, state.payments);
    renderAll();
  }

  on($('#export-download'), 'click', function () {
    var blob = new Blob([exportData()], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'moi-finansy-' + todayISO() + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  on($('#export-copy'), 'click', function () {
    navigator.clipboard.writeText(exportData()).then(function () {
      alert('Данные скопированы в буфер обмена');
    });
  });

  on($('#import-file'), 'change', function () {
    var file = this.files && this.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        applyImport(reader.result);
        closeModal($('#modal-import'));
        alert('Данные импортированы');
      } catch (e) { alert('Не удалось прочитать файл: ' + e.message); }
    };
    reader.readAsText(file);
  });

  on($('#import-text-btn'), 'click', function () {
    var ta = $('#import-text');
    if (!ta || !ta.value.trim()) { alert('Вставьте текст бэкапа'); return; }
    try {
      applyImport(ta.value);
      closeModal($('#modal-import'));
      alert('Данные импортированы');
    } catch (e) { alert('Не удалось разобрать текст: ' + e.message); }
  });

  /* ---------- Отчёт для ИИ ---------- */
  on($('#report-copy'), 'click', function () {
    navigator.clipboard.writeText($('#report-text') ? $('#report-text').textContent : '').then(function () {
      alert('Отчёт скопирован');
    });
  });

  function buildReport() {
    var income = sum(state.transactions.filter(function (t) { return t.type === 'income'; }));
    var expense = sum(state.transactions.filter(function (t) { return t.type === 'expense'; }));
    var lines = ['Отчёт о финансах (все время):',
      'Доходы: ' + money(income),
      'Расходы: ' + money(expense),
      'Баланс: ' + money(income - expense),
      'Записей: ' + state.transactions.length, ''];
    var byCat = {};
    state.transactions.forEach(function (t) {
      if (t.type !== 'expense') return;
      var cat = state.categories.find(function (c) { return c.id === t.categoryId; });
      var key = cat ? cat.name : 'Без категории';
      byCat[key] = (byCat[key] || 0) + t.amount;
    });
    Object.keys(byCat).sort(function (a, b) { return byCat[b] - byCat[a]; }).forEach(function (k) {
      lines.push('  ' + k + ': ' + money(byCat[k]));
    });
    return lines.join('\n');
  }

  /* ---------- Очистка ---------- */
  on($('#confirm-delete-all'), 'click', function () {
    state.transactions = [];
    save(LS.transactions, state.transactions);
    renderAll();
    closeModal($('#modal-delete'));
  });

  /* ---------- Обновление всего ---------- */
  function renderAll() {
    renderBalance();
    renderHistory();
    renderBudgets();
    renderGoals();
    renderCategories();
    renderPayments();
    renderLimitsForm();
    fillCategorySelect();
    var report = $('#report-text');
    if (report) report.textContent = buildReport();
    var backup = $('#backup-text');
    if (backup) backup.textContent = exportData();
  }

  /* ---------- Старт ---------- */
  var dateInput = $('#record-date');
  if (dateInput) dateInput.value = todayISO();
  showScreen('main');
  renderAll();
})();
