/* ============================================================
   旅行小行囊 · app.js
   多行程管理 / 分类预设 / 场景模板 / localStorage / 动效
   ============================================================ */
'use strict';

/* ================= 常量与预设数据 ================= */
const STORAGE_KEY = 'travel-checklist-v1';

const CATEGORIES = [
  { id: 'clothing',   name: '衣物',     emoji: '👕', color: '#6FB3E8', color2: '#5A9BD6', bg: '#EAF5FD' },
  { id: 'digital',    name: '数码',     emoji: '📱', color: '#A78BFA', color2: '#9068F0', bg: '#F1ECFD' },
  { id: 'toiletries', name: '洗漱用品', emoji: '🧴', color: '#5BC8AF', color2: '#45B498', bg: '#E7F8F2' },
  { id: 'documents',  name: '证件财务', emoji: '💳', color: '#F2B84B', color2: '#E8A32F', bg: '#FCF3DC' },
  { id: 'health',     name: '健康药品', emoji: '💊', color: '#F38FB2', color2: '#EC739B', bg: '#FDECF2' },
  { id: 'misc',       name: '食品杂物', emoji: '🎒', color: '#F59E77', color2: '#EC8557', bg: '#FEEEE2' },
];

/* 物品库预设（按分类） */
const PRESET_ITEMS = {
  clothing: ['T恤', '长袖衬衫', '卫衣', '毛衣', '外套', '羽绒服', '冲锋衣', '速干衣裤', '裤子', '短裤', '连衣裙', '半身裙', '换洗内衣', '袜子', '厚袜子', '睡衣', '运动鞋', '登山鞋', '雪地靴', '皮鞋', '拖鞋', '遮阳帽', '毛线帽', '围巾', '手套', '太阳镜', '雨衣', '泳衣', '儿童衣物', '儿童防晒衣', '西装', '领带'],
  digital: ['手机', '手机充电器', '充电宝', '数据线', '耳机', '平板', '电脑及充电器', '相机', '相机电池', '存储卡', '电子书阅读器', 'U盘', '移动硬盘', '转换插头', '车载充电器', '手机支架', '手机防水袋', '自拍杆', '头灯'],
  toiletries: ['牙刷牙膏', '洗发水', '护发素', '沐浴露', '洗面奶', '毛巾', '沙滩巾', '梳子', '剃须刀', '化妆品', '卸妆用品', '护肤品', '防晒霜', '晒后修复', '润唇膏', '保湿面霜', '指甲刀', '棉签', '儿童洗护用品', '儿童防晒霜'],
  documents: ['身份证', '护照', '签证', '机票/车票', '酒店订单', '行程单', '现金', '银行卡', '驾照', '证件照', '保险单', '名片', '文件资料', '户口本'],
  health: ['感冒药', '退烧药', '肠胃药', '晕车药', '创可贴', '退烧贴', '消毒棉片', '驱蚊液', '防晒喷雾', '口罩', '体温计', '维生素', '个人常用药', '急救包', '儿童常用药'],
  misc: ['零食', '速食食品', '水杯', '保温杯', '儿童水壶', '纸巾', '湿巾', '雨伞', '眼罩', '颈枕', '塑料袋', '垃圾袋', '小背包', '旅行装洗衣液', '暖宝宝', '帐篷', '睡袋', '防潮垫', '野餐垫', '折叠椅', '烧水壶', '玩具绘本', '纸尿裤', '防走失包'],
};

/* 场景模板：[分类id, 物品名] */
const TEMPLATES = [
  { id: 'general', name: '通用出行', emoji: '✨', items: [
    ['clothing', 'T恤'], ['clothing', '外套'], ['clothing', '裤子'], ['clothing', '换洗内衣'], ['clothing', '袜子'], ['clothing', '睡衣'], ['clothing', '运动鞋'], ['clothing', '拖鞋'],
    ['digital', '手机充电器'], ['digital', '充电宝'], ['digital', '数据线'], ['digital', '耳机'],
    ['toiletries', '牙刷牙膏'], ['toiletries', '洗发水'], ['toiletries', '沐浴露'], ['toiletries', '洗面奶'], ['toiletries', '毛巾'], ['toiletries', '梳子'], ['toiletries', '防晒霜'],
    ['documents', '身份证'], ['documents', '现金'], ['documents', '银行卡'],
    ['health', '感冒药'], ['health', '创可贴'], ['health', '晕车药'],
    ['misc', '纸巾'], ['misc', '湿巾'], ['misc', '雨伞'], ['misc', '水杯'], ['misc', '零食'],
  ]},
  { id: 'beach', name: '海边度假', emoji: '🏖️', items: [
    ['clothing', '泳衣'], ['clothing', '拖鞋'], ['clothing', '太阳镜'], ['clothing', '遮阳帽'], ['clothing', 'T恤'], ['clothing', '短裤'], ['clothing', '连衣裙'], ['clothing', '换洗内衣'], ['clothing', '袜子'],
    ['digital', '手机充电器'], ['digital', '充电宝'], ['digital', '数据线'], ['digital', '手机防水袋'], ['digital', '相机'],
    ['toiletries', '防晒霜'], ['toiletries', '晒后修复'], ['toiletries', '牙刷牙膏'], ['toiletries', '洗发水'], ['toiletries', '沐浴露'], ['toiletries', '毛巾'],
    ['documents', '身份证'], ['documents', '现金'], ['documents', '银行卡'],
    ['health', '防晒喷雾'], ['health', '驱蚊液'], ['health', '创可贴'], ['health', '肠胃药'],
    ['misc', '沙滩巾'], ['misc', '零食'], ['misc', '水杯'], ['misc', '塑料袋'],
  ]},
  { id: 'winter', name: '冬季出行', emoji: '⛄', items: [
    ['clothing', '羽绒服'], ['clothing', '保暖内衣'], ['clothing', '毛衣'], ['clothing', '围巾'], ['clothing', '手套'], ['clothing', '毛线帽'], ['clothing', '雪地靴'], ['clothing', '厚袜子'],
    ['digital', '手机充电器'], ['digital', '充电宝'], ['digital', '数据线'], ['digital', '相机'],
    ['toiletries', '润唇膏'], ['toiletries', '保湿面霜'], ['toiletries', '牙刷牙膏'], ['toiletries', '洗发水'], ['toiletries', '毛巾'],
    ['documents', '身份证'], ['documents', '现金'], ['documents', '银行卡'],
    ['health', '感冒药'], ['health', '退烧药'], ['health', '创可贴'],
    ['misc', '暖宝宝'], ['misc', '保温杯'], ['misc', '零食'], ['misc', '纸巾'], ['misc', '湿巾'],
  ]},
  { id: 'business', name: '商务出差', emoji: '💼', items: [
    ['clothing', '长袖衬衫'], ['clothing', '西装'], ['clothing', '领带'], ['clothing', '皮鞋'], ['clothing', '换洗内衣'], ['clothing', '袜子'],
    ['digital', '电脑及充电器'], ['digital', '平板'], ['digital', 'U盘'], ['digital', '转换插头'], ['digital', '数据线'], ['digital', '充电宝'],
    ['toiletries', '剃须刀'], ['toiletries', '化妆品'], ['toiletries', '牙刷牙膏'], ['toiletries', '洗面奶'], ['toiletries', '毛巾'],
    ['documents', '身份证'], ['documents', '名片'], ['documents', '文件资料'], ['documents', '银行卡'],
    ['health', '肠胃药'], ['health', '创可贴'],
    ['misc', '保温杯'], ['misc', '纸巾'],
  ]},
  { id: 'camping', name: '户外露营', emoji: '⛺', items: [
    ['clothing', '冲锋衣'], ['clothing', '速干衣裤'], ['clothing', '登山鞋'], ['clothing', '换洗内衣'], ['clothing', '遮阳帽'],
    ['digital', '头灯'], ['digital', '充电宝'], ['digital', '数据线'], ['digital', '手机充电器'],
    ['toiletries', '毛巾'], ['toiletries', '牙刷牙膏'], ['toiletries', '防晒霜'],
    ['documents', '身份证'], ['documents', '现金'],
    ['health', '创可贴'], ['health', '急救包'], ['health', '驱蚊液'], ['health', '消毒棉片'],
    ['misc', '帐篷'], ['misc', '睡袋'], ['misc', '防潮垫'], ['misc', '野餐垫'], ['misc', '折叠椅'], ['misc', '烧水壶'], ['misc', '速食食品'], ['misc', '垃圾袋'], ['misc', '湿巾'], ['misc', '雨衣'],
  ]},
  { id: 'family', name: '亲子出游', emoji: '👨‍👩‍👧', items: [
    ['clothing', '儿童衣物'], ['clothing', '儿童防晒衣'], ['clothing', '大人换洗衣物'], ['clothing', '袜子'],
    ['digital', '手机充电器'], ['digital', '充电宝'], ['digital', '数据线'], ['digital', '平板'],
    ['toiletries', '儿童洗护用品'], ['toiletries', '儿童防晒霜'], ['toiletries', '牙刷牙膏'], ['toiletries', '毛巾'],
    ['documents', '身份证'], ['documents', '户口本'], ['documents', '现金'],
    ['health', '儿童常用药'], ['health', '体温计'], ['health', '退烧贴'], ['health', '创可贴'], ['health', '消毒棉片'],
    ['misc', '玩具绘本'], ['misc', '儿童水壶'], ['misc', '零食'], ['misc', '湿巾'], ['misc', '纸尿裤'], ['misc', '防走失包'],
  ]},
];

const TRIP_EMOJIS = ['🧳', '✈️', '🚄', '🚗', '🏖️', '⛰️', '❄️', '🌸', '🎡', '🍜', '🏙️', '⛺'];

/* ================= 状态 ================= */
function defaultState() { return { trips: [], activeTripId: null }; }

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const s = JSON.parse(raw);
    if (!s || !Array.isArray(s.trips)) return defaultState();
    return s;
  } catch (e) { return defaultState(); }
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* 隐私模式等场景忽略 */ }
}

let state = load();
let lastAllPacked = false;   // 防止进度环重复触发庆祝
let confirmCallback = null;  // 确认弹窗回调

/* ================= 工具 ================= */
const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const esc = s => String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

function activeTrip() { return state.trips.find(t => t.id === state.activeTripId) || null; }

function fmtDate(ds) {
  const d = new Date(ds + 'T00:00:00');
  if (isNaN(d)) return ds;
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

function countdown(ds) {
  const d = new Date(ds + 'T00:00:00');
  if (isNaN(d)) return '';
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round((d - today) / 864e5);
  if (diff > 1) return `还有 ${diff} 天出发`;
  if (diff === 1) return '明天就出发啦';
  if (diff === 0) return '今天出发！';
  return '旅途愉快～';
}

function shakeEl(el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }

/* ================= Toast ================= */
let toastTimer = null;
function toast(msg, emoji = '✨') {
  const t = $('#toast');
  $('#toastEmoji').textContent = emoji;
  $('#toastMsg').textContent = msg;
  t.classList.remove('show'); void t.offsetWidth;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2300);
}

/* ================= 弹窗通用 ================= */
function showModal(m) { m.classList.add('show'); document.body.classList.add('no-scroll'); }
function hideModal(m) { m.classList.remove('show'); document.body.classList.remove('no-scroll'); }

$$('.modal-overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) hideModal(o); });
});
$$('[data-close]').forEach(b => {
  b.addEventListener('click', e => hideModal(e.target.closest('.modal-overlay')));
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') $$('.modal-overlay.show').forEach(hideModal);
});

/* ================= 渲染 ================= */
const mainEl = $('#main');
const tripBarEl = $('#tripBar');

function renderAll() {
  renderTripBar();
  renderMain();
}

function renderTripBar() {
  const chips = state.trips.map((t, i) =>
    `<button class="trip-chip fade-up ${t.id === state.activeTripId ? 'active' : ''}" style="--d:${i * 60}ms"
       data-action="switch-trip" data-id="${t.id}" title="${esc(t.name)}">${t.emoji} ${esc(t.name)}</button>`
  ).join('');
  tripBarEl.innerHTML = chips + `<button class="trip-chip trip-chip-add" data-action="new-trip">＋ 新行程</button>`;
}

function renderMain() {
  const trip = activeTrip();
  if (!trip) { mainEl.innerHTML = welcomeHTML(); return; }
  mainEl.innerHTML = heroHTML(trip) + templatesHTML() + categoriesHTML(trip);
  updateProgress(false);
}

function heroHTML(trip) {
  const meta = [];
  if (trip.destination) meta.push(`<span class="meta-chip">📍 ${esc(trip.destination)}</span>`);
  if (trip.date) {
    const cd = countdown(trip.date);
    meta.push(`<span class="meta-chip">📅 ${esc(fmtDate(trip.date))}${cd ? ` · <b class="cd">${cd}</b>` : ''}</span>`);
  }
  return `
  <section class="hero card fade-up" style="--d:0ms">
    <div class="hero-info">
      <div class="hero-emoji">${trip.emoji}</div>
      <div class="hero-text">
        <h2>${esc(trip.name)}</h2>
        <div class="hero-meta">${meta.join('') || '<span class="meta-chip muted">点右上角 ✏️ 补充目的地和日期～</span>'}</div>
      </div>
    </div>
    <div class="hero-edit">
      <button class="icon-btn" data-action="edit-trip" title="编辑行程" aria-label="编辑行程">✏️</button>
      <button class="icon-btn" data-action="delete-trip" title="删除行程" aria-label="删除行程">🗑️</button>
    </div>
    <div class="hero-right">
      <div class="ring-wrap">
        <svg class="ring" viewBox="0 0 120 120" aria-hidden="true">
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FFB199"/><stop offset="100%" stop-color="#FF6A88"/>
            </linearGradient>
          </defs>
          <circle class="ring-bg" cx="60" cy="60" r="52"/>
          <circle class="ring-val" id="ringVal" cx="60" cy="60" r="52"/>
        </svg>
        <div class="ring-center">
          <div class="ring-pct" id="ringPct">0%</div>
          <div class="ring-sub" id="ringSub"></div>
        </div>
      </div>
      <div class="hero-actions">
        <button class="btn btn-ghost btn-sm" data-action="clear-checked">🧹 清空已勾选</button>
        <button class="btn btn-soft btn-sm" data-action="reset-all">🔄 重新出发</button>
      </div>
    </div>
  </section>`;
}

function templatesHTML() {
  const chips = TEMPLATES.map((t, i) =>
    `<button class="tpl-chip fade-up" style="--d:${100 + i * 60}ms" data-action="apply-template" data-tpl="${t.id}">
       <span class="t-emoji">${t.emoji}</span>${t.name}
     </button>`
  ).join('');
  return `
  <section class="templates">
    <div class="sec-head">
      <h3 class="sec-title fade-up" style="--d:80ms">🎁 一键套用模板</h3>
      <button class="btn btn-primary btn-sm fade-up" style="--d:480ms" data-action="open-library">📦 打开物品库</button>
    </div>
    <div class="tpl-row">${chips}</div>
  </section>`;
}

function categoriesHTML(trip) {
  const cards = CATEGORIES.map((c, i) => {
    const items = trip.items.filter(it => it.category === c.id);
    const packed = items.filter(it => it.checked).length;
    const lis = items.map((it, j) => itemHTML(it, Math.min(j * 35, 320))).join('');
    return `
    <div class="cat-card fade-up" style="--cat:${c.color};--cat2:${c.color2};--cat-bg:${c.bg};--d:${180 + i * 70}ms" data-cat="${c.id}">
      <div class="cat-head">
        <span class="cat-emoji">${c.emoji}</span>
        <span class="cat-name">${c.name}</span>
        <span class="cat-count" data-count>${packed}/${items.length}</span>
      </div>
      <ul class="item-list">${lis}</ul>
      <div class="empty-hint" ${items.length ? 'hidden' : ''}>这里还空空的～ 从物品库选一些，或在下面直接输入 🐣</div>
      <div class="cat-add">
        <input class="input input-sm" maxlength="30" placeholder="自定义物品，回车添加" autocomplete="off">
        <button class="add-btn" data-action="add-item" aria-label="添加物品">＋</button>
      </div>
    </div>`;
  }).join('');
  return `<section class="categories">${cards}</section>`;
}

function itemHTML(it, delay = 0) {
  return `
  <li class="item ${it.checked ? 'checked' : ''}" data-id="${it.id}" style="--d:${delay}ms">
    <button class="checkbox" data-action="toggle" data-id="${it.id}" aria-label="勾选 ${esc(it.text)}">✓</button>
    <span class="item-text" data-action="toggle" data-id="${it.id}">${esc(it.text)}</span>
    <button class="item-del" data-action="del-item" data-id="${it.id}" aria-label="删除 ${esc(it.text)}">✕</button>
  </li>`;
}

function welcomeHTML() {
  const chips = TEMPLATES.map(t =>
    `<button class="tpl-chip" data-action="tpl-create" data-tpl="${t.id}"><span class="t-emoji">${t.emoji}</span>${t.name}</button>`
  ).join('');
  return `
  <section class="welcome card fade-up">
    <div class="welcome-emoji">🧳</div>
    <h2>欢迎来到旅行小行囊</h2>
    <p>创建一个行程，开始收拾你的小行囊吧～<br>收拾东西，也是旅行幸福的一部分哦 ✨</p>
    <button class="btn btn-primary btn-lg" data-action="new-trip">✈️ 创建第一个行程</button>
    <div class="welcome-divider"><span>或者从模板快速开始</span></div>
    <div class="tpl-row center">${chips}</div>
  </section>`;
}

/* ================= 进度 ================= */
const RING_C = 2 * Math.PI * 52;

function updateProgress(fireCelebration = true) {
  const trip = activeTrip();
  const ring = $('#ringVal'), pctEl = $('#ringPct'), subEl = $('#ringSub');
  if (!trip || !ring) return;
  const total = trip.items.length;
  const packed = trip.items.filter(i => i.checked).length;
  const pct = total ? Math.round(packed / total * 100) : 0;

  ring.style.strokeDasharray = RING_C;
  ring.style.strokeDashoffset = RING_C * (1 - pct / 100);
  if (fireCelebration) tickNumber(pctEl, pct);
  else { pctEl.textContent = pct + '%'; pctEl.dataset.v = pct; }
  subEl.textContent = total ? `${packed}/${total} 件` : '先添加物品吧';

  const all = total > 0 && packed === total;
  if (all && fireCelebration && !lastAllPacked) {
    confettiBurst();
    toast('全部收拾好啦，出发！', '🛫');
  }
  lastAllPacked = all;
}

function tickNumber(el, to) {
  const from = Number(el.dataset.v) || 0;
  el.dataset.v = to;
  const dur = 550, t0 = performance.now();
  requestAnimationFrame(function f(t) {
    const p = Math.min(1, (t - t0) / dur);
    el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))) + '%';
    if (p < 1) requestAnimationFrame(f);
  });
  /* rAF 在后台/节流环境下可能不触发，兜底确保最终数值正确 */
  setTimeout(() => { el.textContent = to + '%'; }, dur + 80);
}

/* ================= 分类计数 ================= */
function updateCatCount(catId, bump = true) {
  const trip = activeTrip();
  const el = document.querySelector(`.cat-card[data-cat="${catId}"] [data-count]`);
  if (!trip || !el) return;
  const items = trip.items.filter(i => i.category === catId);
  const packed = items.filter(i => i.checked).length;
  el.textContent = `${packed}/${items.length}`;
  if (bump) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
}

function updateAllCatCounts(bump = true) {
  CATEGORIES.forEach(c => updateCatCount(c.id, bump));
}

function refreshEmptyHints() {
  const trip = activeTrip();
  if (!trip) return;
  CATEGORIES.forEach(c => {
    const n = trip.items.filter(i => i.category === c.id).length;
    const hint = document.querySelector(`.cat-card[data-cat="${c.id}"] .empty-hint`);
    if (hint) hint.hidden = n > 0;
  });
}

/* ================= 物品操作 ================= */
function addItemSilent(trip, categoryId, text) {
  const t = String(text).trim();
  if (!t) return null;
  const dup = trip.items.some(i => i.category === categoryId && i.text === t);
  if (dup) return null;
  const item = { id: uid(), text: t, category: categoryId, checked: false };
  trip.items.push(item);
  return item;
}

function appendItemNode(item, delay = 0) {
  const list = document.querySelector(`.cat-card[data-cat="${item.category}"] .item-list`);
  if (!list) return;
  list.insertAdjacentHTML('beforeend', itemHTML(item, delay));
  const hint = list.parentElement.querySelector('.empty-hint');
  if (hint) hint.hidden = true;
}

function removeItemNode(li, delay = 0) {
  setTimeout(() => {
    li.classList.add('removing');
    li.addEventListener('animationend', () => li.remove(), { once: true });
  }, delay);
}

function handleCustomAdd(input, catCard) {
  const trip = activeTrip();
  if (!trip) return;
  const catId = catCard.dataset.cat;
  const text = input.value.trim();
  if (!text) { shakeEl(input); return; }
  const item = addItemSilent(trip, catId, text);
  if (!item) { shakeEl(input); toast('这件已经在清单里啦', '😉'); return; }
  appendItemNode(item);
  updateCatCount(catId, false);
  updateProgress();
  save();
  input.value = '';
  input.focus();
}

/* ================= 模板 ================= */
function applyTemplate(tplId, createNew) {
  const tpl = TEMPLATES.find(t => t.id === tplId);
  if (!tpl) return;
  let trip = activeTrip();
  let created = false;

  if (createNew || !trip) {
    trip = { id: uid(), name: tpl.name, emoji: tpl.emoji, destination: '', date: '', createdAt: Date.now(), items: [] };
    state.trips.push(trip);
    state.activeTripId = trip.id;
    created = true;
  }

  const newItems = [];
  tpl.items.forEach(([cat, text]) => {
    const it = addItemSilent(trip, cat, text);
    if (it) newItems.push(it);
  });

  lastAllPacked = false;

  if (created) {
    save();
    renderAll();
    toast(`已用「${tpl.name}」模板创建行程，装入 ${newItems.length} 件物品`, tpl.emoji);
  } else if (newItems.length) {
    newItems.forEach((it, i) => appendItemNode(it, Math.min(i * 45, 500)));
    updateAllCatCounts(false);
    updateProgress();
    save();
    toast(`「${tpl.name}」模板新加入 ${newItems.length} 件物品`, tpl.emoji);
  } else {
    toast('模板里的物品都已经在清单里啦', tpl.emoji);
  }
}

/* ================= 行程编辑弹窗 ================= */
let tripModalEditingId = null;
let selectedEmoji = TRIP_EMOJIS[0];

function buildEmojiGrid() {
  $('#emojiGrid').innerHTML = TRIP_EMOJIS.map(e =>
    `<button type="button" class="emoji-opt" data-emoji="${e}" aria-label="${e}">${e}</button>`
  ).join('');
}

$('#emojiGrid').addEventListener('click', e => {
  const b = e.target.closest('.emoji-opt');
  if (!b) return;
  selectedEmoji = b.dataset.emoji;
  $$('#emojiGrid .emoji-opt').forEach(x => x.classList.toggle('sel', x === b));
});

function openTripModal(trip) {
  tripModalEditingId = trip ? trip.id : null;
  $('#tripModalTitle').textContent = trip ? '✏️ 编辑行程' : '✈️ 创建新行程';
  $('#tripSave').textContent = trip ? '保存修改 ✅' : '出发！🎒';
  $('#tripName').value = trip ? trip.name : '';
  $('#tripDest').value = trip ? trip.destination : '';
  $('#tripDate').value = trip ? trip.date : '';
  selectedEmoji = trip ? trip.emoji : TRIP_EMOJIS[0];
  $$('#emojiGrid .emoji-opt').forEach(x => x.classList.toggle('sel', x.dataset.emoji === selectedEmoji));
  showModal($('#tripModal'));
  setTimeout(() => $('#tripName').focus(), 120);
}

function saveTripModal() {
  const name = $('#tripName').value.trim();
  if (!name) { shakeEl($('#tripName')); toast('给行程起个名字吧', '✍️'); return; }
  const dest = $('#tripDest').value.trim();
  const date = $('#tripDate').value;

  if (tripModalEditingId) {
    const trip = state.trips.find(t => t.id === tripModalEditingId);
    if (trip) {
      trip.name = name; trip.destination = dest; trip.date = date; trip.emoji = selectedEmoji;
      lastAllPacked = false;
      save(); hideModal($('#tripModal')); renderAll();
      toast('行程已更新', '✅');
    }
  } else {
    const trip = { id: uid(), name, emoji: selectedEmoji, destination: dest, date, createdAt: Date.now(), items: [] };
    state.trips.push(trip);
    state.activeTripId = trip.id;
    lastAllPacked = false;
    save(); hideModal($('#tripModal')); renderAll();
    toast(`「${name}」创建好啦，开始收拾行囊吧`, selectedEmoji);
  }
}

$('#tripSave').addEventListener('click', saveTripModal);

$('#tripModal').addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.tagName === 'INPUT') saveTripModal();
});

/* ================= 删除行程确认 ================= */
function askDeleteTrip(trip) {
  $('#confirmEmoji').textContent = '🥺';
  $('#confirmTitle').textContent = `删除「${trip.name}」？`;
  $('#confirmDesc').textContent = '行程和里面的清单会一起说再见，这个操作无法撤销哦。';
  $('#confirmOk').textContent = '删除';
  confirmCallback = () => {
    state.trips = state.trips.filter(t => t.id !== trip.id);
    if (state.activeTripId === trip.id) state.activeTripId = state.trips[0] ? state.trips[0].id : null;
    lastAllPacked = false;
    save(); renderAll();
    toast('行程已删除', '👋');
  };
  showModal($('#confirmModal'));
}

$('#confirmOk').addEventListener('click', () => {
  hideModal($('#confirmModal'));
  if (confirmCallback) { const cb = confirmCallback; confirmCallback = null; cb(); }
});
$('#confirmCancel').addEventListener('click', () => {
  confirmCallback = null;
  hideModal($('#confirmModal'));
});

/* ================= 物品库弹窗 ================= */
let libSel = new Set();

function openLibrary() {
  const trip = activeTrip();
  if (!trip) return;
  libSel.clear();
  $('#libraryBody').innerHTML = CATEGORIES.map((c, ci) => {
    const chips = PRESET_ITEMS[c.id].map((text, i) => {
      const exists = trip.items.some(it => it.category === c.id && it.text === text);
      return `<button class="lib-chip ${exists ? 'exists' : ''}" style="--cat:${c.color};--cat-bg:${c.bg};animation-delay:${ci * 40 + i * 18}ms"
                data-cat="${c.id}" data-text="${esc(text)}" ${exists ? 'disabled' : ''}>${esc(text)}${exists ? ' ✓' : ''}</button>`;
    }).join('');
    return `
    <div class="lib-section">
      <div class="lib-head"><span>${c.emoji}</span>${c.name}</div>
      <div class="lib-chips">${chips}</div>
    </div>`;
  }).join('');
  updateLibCount();
  showModal($('#libraryModal'));
}

function updateLibCount() {
  $('#libCount').textContent = `已选 ${libSel.size} 件`;
  $('#libAdd').textContent = libSel.size ? `加入清单（${libSel.size} 件）🎁` : '加入清单 🎁';
}

$('#libraryBody').addEventListener('click', e => {
  const chip = e.target.closest('.lib-chip');
  if (!chip || chip.classList.contains('exists')) return;
  const key = chip.dataset.cat + '\u0000' + chip.dataset.text;
  if (libSel.has(key)) { libSel.delete(key); chip.classList.remove('sel'); }
  else { libSel.add(key); chip.classList.add('sel'); }
  updateLibCount();
});

$('#libAdd').addEventListener('click', () => {
  if (!libSel.size) { toast('先点选一些物品吧', '👆'); return; }
  const trip = activeTrip();
  if (!trip) return;
  let n = 0;
  libSel.forEach(key => {
    const [cat, text] = key.split('\u0000');
    const it = addItemSilent(trip, cat, text);
    if (it) { appendItemNode(it, Math.min(n * 45, 500)); n++; }
  });
  if (n) { updateAllCatCounts(false); updateProgress(); save(); }
  hideModal($('#libraryModal'));
  toast(`已加入 ${n} 件物品`, '🎁');
});

/* ================= 全局事件委托 ================= */
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;
  const trip = activeTrip();

  switch (action) {
    case 'new-trip':
      openTripModal(null);
      break;

    case 'edit-trip':
      if (trip) openTripModal(trip);
      break;

    case 'switch-trip':
      state.activeTripId = btn.dataset.id;
      lastAllPacked = false;
      save(); renderAll();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      break;

    case 'delete-trip':
      if (trip) askDeleteTrip(trip);
      break;

    case 'toggle': {
      if (!trip) break;
      const it = trip.items.find(i => i.id === btn.dataset.id);
      if (!it) break;
      it.checked = !it.checked;
      btn.closest('.item').classList.toggle('checked', it.checked);
      updateCatCount(it.category);
      updateProgress();
      save();
      break;
    }

    case 'del-item': {
      if (!trip) break;
      const id = btn.dataset.id;
      const it = trip.items.find(i => i.id === id);
      if (!it) break;
      const catId = it.category;
      trip.items = trip.items.filter(i => i.id !== id);
      removeItemNode(btn.closest('.item'));
      updateCatCount(catId, false);
      setTimeout(refreshEmptyHints, 380);
      updateProgress();
      save();
      break;
    }

    case 'add-item': {
      if (!trip) break;
      const catCard = btn.closest('.cat-card');
      handleCustomAdd(catCard.querySelector('.cat-add input'), catCard);
      break;
    }

    case 'apply-template':
      applyTemplate(btn.dataset.tpl, false);
      break;

    case 'tpl-create':
      applyTemplate(btn.dataset.tpl, true);
      break;

    case 'open-library':
      openLibrary();
      break;

    case 'reset-all': {
      if (!trip || !trip.items.length) { toast('清单还是空的哦', '🤔'); break; }
      trip.items.forEach(i => i.checked = false);
      $$('.item.checked').forEach((li, i) => setTimeout(() => li.classList.remove('checked'), i * 35));
      updateAllCatCounts(false);
      updateProgress();
      save();
      toast('新的一轮收拾开始啦', '💪');
      break;
    }

    case 'clear-checked': {
      if (!trip) break;
      const checkedLis = $$('.item.checked');
      if (!checkedLis.length) { toast('还没有勾选完成的物品哦', '🤔'); break; }
      trip.items = trip.items.filter(i => !i.checked);
      checkedLis.forEach((li, i) => removeItemNode(li, i * 50));
      updateAllCatCounts(false);
      updateProgress();
      save();
      setTimeout(refreshEmptyHints, checkedLis.length * 50 + 380);
      toast(`清掉了 ${checkedLis.length} 件已收拾物品`, '🧹');
      break;
    }
  }
});

/* 回车快捷添加 */
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.matches('.cat-add input')) {
    const catCard = e.target.closest('.cat-card');
    if (catCard) handleCustomAdd(e.target, catCard);
  }
});

/* ================= 彩带庆祝 ================= */
const confettiCanvas = $('#confetti');
let confettiCtx = null, confettiParts = [], confettiRaf = 0;
const CONFETTI_COLORS = ['#FF9A8B', '#FF6A88', '#FFC24B', '#7ED6C0', '#A78BFA', '#8FD0F5', '#F9A8C9', '#FFE9A8'];

function confettiSize() {
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  confettiCanvas.width = innerWidth * DPR;
  confettiCanvas.height = innerHeight * DPR;
  return { DPR, W: innerWidth, H: innerHeight };
}

function confettiBurst() {
  if (!confettiCtx) confettiCtx = confettiCanvas.getContext('2d');
  const { DPR, W, H } = confettiSize();
  confettiCtx.setTransform(DPR, 0, 0, DPR, 0, 0);

  const spawn = (x, y, baseAngle, spread, count, speedMin, speedMax) => {
    for (let i = 0; i < count; i++) {
      const a = baseAngle + (Math.random() - .5) * spread;
      const sp = speedMin + Math.random() * (speedMax - speedMin);
      confettiParts.push({
        x, y,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        g: .16 + Math.random() * .05, dr: .985,
        rot: Math.random() * Math.PI * 2, vr: (Math.random() - .5) * .32,
        w: 5 + Math.random() * 6, h: 3 + Math.random() * 5,
        c: CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0],
        shape: Math.random() < .28 ? 'c' : 'r',
        life: 1, dec: .005 + Math.random() * .007,
      });
    }
  };
  /* 左右两门「礼花炮」+ 中间撒一把 */
  spawn(W * .12, H * .78, -Math.PI / 2.5, 1.1, 60, 8, 15);
  spawn(W * .88, H * .78, -Math.PI + Math.PI / 2.5, 1.1, 60, 8, 15);
  spawn(W * .5, H * .45, 0, Math.PI * 2, 50, 2, 8);

  confettiLoop();
}

function confettiLoop() {
  cancelAnimationFrame(confettiRaf);
  const H = innerHeight;
  confettiCtx.clearRect(0, 0, innerWidth, innerHeight);
  confettiParts = confettiParts.filter(p => p.life > 0 && p.y < H + 40);
  if (!confettiParts.length) return;

  for (const p of confettiParts) {
    p.vy += p.g; p.vx *= p.dr; p.vy *= p.dr;
    p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= p.dec;
    confettiCtx.save();
    confettiCtx.globalAlpha = Math.max(0, p.life);
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.rot);
    confettiCtx.fillStyle = p.c;
    if (p.shape === 'c') {
      confettiCtx.beginPath();
      confettiCtx.arc(0, 0, p.w / 2, 0, 7);
      confettiCtx.fill();
    } else {
      confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    }
    confettiCtx.restore();
  }
  confettiRaf = requestAnimationFrame(confettiLoop);
}

window.addEventListener('resize', () => {
  if (confettiCtx) {
    const { DPR } = confettiSize();
    confettiCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
});

/* ================= 启动 ================= */
buildEmojiGrid();
renderAll();
