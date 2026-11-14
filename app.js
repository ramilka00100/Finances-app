const DEFAULT_CATS = {
  food:      { emoji: '🍔', name: 'Еда', type: 'expense', budget: null },
  transport: { emoji: '🚕', name: 'Транспорт', type: 'expense', budget: null },
  home:      { emoji: '🏠', name: 'Дом', type: 'expense', budget: null },
  health:    { emoji: '💊', name: 'Здоровье', type: 'expense', budget: null },
  fun:       { emoji: '🎉', name: 'Развлечения', type: 'expense', budget: null },
  shop:      { emoji: '🛍️', name: 'Покупки', type: 'expense', budget: null },
  other:     { emoji: '📦', name: 'Другое', type: 'expense', budget: null },
  salary:    { emoji: '💼', name: 'Зарплата', type: 'income', budget: null },
  gift:      { emoji: '🎁', name: 'Подарок', type: 'income', budget: null },
  cashback:  { emoji: '💸', name: 'Кэшбэк', type: 'income', budget: null },
  other_inc: { emoji: '💰', name: 'Другое', type: 'income', budget: null }
};

let categories    = JSON.parse(localStorage.getItem('categories')    || 'null') || { ...DEFAULT_CATS };
let transactions  = JSON.parse(localStorage.getItem('transactions')  || '[]');
let hiddenFilters = JSON.parse(localStorage.getItem('hiddenFilters') || '[]');
let fixedExpenses = JSON.parse(localStorage.getItem('fixedExpenses') || '[]');
let goals = JSON.parse(localStorage.getItem('goals') || 'null');
if (!goals) {
  const oldGoal = JSON.parse(localStorage.getItem('goal') || 'null');
  goals = oldGoal ? [{ id: Date.now(), ...oldGoal }] : [{ id: Date.now(), name: 'Отпуск', target: 200000 }];
  localStorage.removeItem('goal'); localStorage.setItem('goals', JSON.stringify(goals));
}
transactions.forEach(t => { if (t.category === 'goal_cat' && !t.goalId) t.goalId = goals[0].id; });

let activeFilter  = 'all';
let currentType   = 'expense';
let editingCatId  = null;
let editingFixedId = null;
let editingTxId   = null;
let editingGoalId = null;
let pickedEmoji   = '🍔';
let confirmAction = null;
let statsPeriod = 'all';
let statsKind   = 'expense';

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

function save() {
  localStorage.setItem('categories',    JSON.stringify(categories));
  localStorage.setItem('transactions',  JSON.stringify(transactions));
  localStorage.setItem('goals',         JSON.stringify(goals));
  localStorage.setItem('hiddenFilters', JSON.stringify(hiddenFilters));
  localStorage.setItem('fixedExpenses', JSON.stringify(fixedExpenses));
}

function escapeHtml(s) { if (!s) return ''; const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
let toastTimer;
function toast(msg) { const el = $('toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2200); }
function closeModal(id) { $(id).classList.remove('show'); }
function askConfirm(title, text, okLabel, action) { $('confirmTitle').textContent = title; $('confirmText').textContent = text; $('confirmOk').textContent = okLabel; confirmAction = action; $('confirmModal').classList.add('show'); }

const TABS = ['home', 'stats', 'goals', 'profile'];
function switchTab(tab) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  $('page-' + tab).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
  $('fab').classList.toggle('hidden', tab === 'profile' || tab === 'goals');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

