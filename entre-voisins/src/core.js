/* =====================================================================
   Entre Voisins — moteur : état, rendu, navigation, outils d’interface
   ===================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const lc = s => s.charAt(0).toLowerCase() + s.slice(1);
const store = {
  get(k) { try { return localStorage.getItem('ev.' + k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem('ev.' + k, v); } catch (e) { /* stockage absent : on continue sans */ } }
};
let uid = 0;

/* Rien n’est conservé d’une visite à l’autre, sauf le quartier, la taille du texte et la fermeture du message de bienvenue. */
function fresh() {
  return {
    phase: 'splash', onb: { step: 'postal', hood: null, age: false }, test: false, taps: 0,
    tab: 'accueil', stack: [], sheets: [], filter: 'tout', act: 'events', evf: 'tout',
    hood: store.get('hood') || DEMO_HOOD, size: +store.get('size') || 15, contrast: false, reminders: true,
    welcome: store.get('welcome') !== '0',
    reg: { step: 0, sent: false, charter: [false, false, false, false], done: false, later: false },
    me: { photo: null, email: 'julie.fortin@exemple.ca', phone: '', bio: P.me.bio, can: [...P.me.can], given: 23, received: 4, mercis: 18, thanks: P.me.thanks.slice() },
    pending: null, f: {}, expanded: {}, banner: null,
    posts: seedPosts(), events: seedEvents(), groups: seedGroups(), convs: seedConvs(), notifs: seedNotifs(),
    proches: [{ id: 'pr1', nick: 'Maman', first: 'Denise', hood: 'Saint-Sauveur', note: 'Elle entend mal de l’oreille gauche. Sonnez deux fois : elle met du temps à descendre.', ok: true }],
    blocked: [], pro: { active: false, services: [] }, ask: null, openArr: 'La Cité-Limoilou'
  };
}
const S = fresh();
const A = {}, V = {}, TABS = {}, SCREENS = {}, SHEETS = {};

/* ---------- accès aux données ---------- */
const post = id => S.posts.find(p => p.id === id);
const evt = id => S.events.find(e => e.id === id);
const grp = id => S.groups.find(g => g.id === id);
const conv = id => S.convs.find(c => c.id === id);
const first = id => (P[id] ? P[id].first : String(id));
const il = id => (P[id] && P[id].g === 'm' ? 'il' : 'elle');
const de = name => (/^[aeiouyhàâéèêîôû]/i.test(name) ? 'd’' : 'de ') + name;
const distTxt = m => m ? (m < 1000 ? `à environ ${m} m` : `à environ ${(m / 1000).toFixed(1).replace('.', ',')} km`) : '';
const stat = (id, k) => id === 'me' ? S.me[k] : P[id][k];
const arrOf = h => (ARR.find(a => a[1].includes(h)) || [''])[0];

function avatar(id, s = 40) {
  if (id === 'me') {
    if (S.me.photo && S.me.photo !== 'drawn') return `<span class="av" style="--s:${s}px"><img src="${S.me.photo}" alt=""></span>`;
    if (!S.me.photo) return `<span class="av ini" style="--s:${s}px">JF</span>`;
  }
  const p = P[id];
  if (!p) return `<span class="av ini soft" style="--s:${s}px">${esc(String(id).charAt(0).toUpperCase())}</span>`;
  return `<span class="av" style="--s:${s}px">${faceSVG(p.face)}</span>`;
}
const disc = (icon, s = 40, color = 'blue') => `<span class="av disc c-${color}" style="--s:${s}px">${ic(icon, Math.round(s * .500))}</span>`;
function avStack(ids, s = 26, max = 4) {
  return `<span class="avs">${ids.slice(0, max).map(i => avatar(i, s)).join('')}</span>`;
}
function knownTxt(id) {
  const k = (P[id].known || []).filter(x => x !== id);
  if (!k.length) return '';
  const names = k.slice(0, 2).map(x => x === 'me' ? 'vous' : first(x));
  const rest = k.length - names.length;
  return `Connu${P[id].g === 'f' ? 'e' : ''} de ${names.join(rest ? ', ' : ' et ')}${rest ? ` et ${rest} autre${rest > 1 ? 's' : ''} voisin${rest > 1 ? 's' : ''}` : ''}`;
}

/* ---------- petits gabarits ---------- */
const btn = (label, a, cls = 'primary', attrs = '') => `<button class="btn ${cls}" data-a="${a}" ${attrs}>${label}</button>`;
const dis = ok => ok ? '' : 'disabled';
function bar(title, right = '') {
  return `<header class="bar"><button class="ibtn" data-a="back" aria-label="Retour">${ic('left')}</button><h1 class="bar-t">${title}</h1>${right || '<span class="ibtn-sp"></span>'}</header>`;
}
function field(label, name, o = {}) {
  const v = esc(S.f[name] ?? ''), id = 'f-' + name.replace(/\W/g, '-');
  const common = `id="${id}" data-f="${name}" placeholder="${esc(o.ph || '')}" ${o.max ? `maxlength="${o.max}"` : ''} ${o.live ? `data-live="${o.live}"` : ''} ${o.fmt ? `data-fmt="${o.fmt}"` : ''} ${o.enter ? `data-enter="${o.enter}"` : ''}`;
  const input = o.area
    ? `<textarea class="inp" rows="${o.rows || 3}" ${common}>${v}</textarea>`
    : `<input class="inp" type="${o.type || 'text'}" value="${v}" ${o.mode ? `inputmode="${o.mode}"` : ''} ${o.auto ? `autocomplete="${o.auto}"` : 'autocomplete="off"'} ${common}>`;
  const count = o.count ? `<small class="cnt" data-cnt="${name}" data-max="${o.max}">${(S.f[name] || '').length} / ${o.max}</small>` : '';
  return `<div class="field"><label for="${id}">${label}</label>${input}${o.hint || count ? `<div class="field-s"><small>${o.hint || ''}</small>${count}</div>` : ''}</div>`;
}
const check = (label, a, on) => `<button class="check${on ? ' on' : ''}" data-a="${a}" role="checkbox" aria-checked="${!!on}"><span class="box">${on ? ic('check', 15) : ''}</span><span>${label}</span></button>`;
const chip = (label, a, on) => `<button class="chip${on ? ' on' : ''}" data-a="${a}" aria-pressed="${!!on}">${label}</button>`;
const row = (icon, title, sub, a, right) => `<button class="row" data-a="${a}"><span class="row-i">${ic(icon, 20)}</span><span class="row-b"><b>${title}</b>${sub ? `<small>${sub}</small>` : ''}</span>${right ?? ic('right', 18, 'row-c')}</button>`;
const kv = (icon, k, v) => `<div class="kv">${ic(icon, 18)}<span><small>${k}</small><b>${v}</b></span></div>`;
const note = (icon, html, cls = '') => `<div class="note ${cls}">${ic(icon, 18)}<span>${html}</span></div>`;
function sh(title, body, foot = '', pre = '') {
  return `<div class="backdrop" data-a="closeSheet"></div><section class="sheet" role="dialog" aria-modal="true"><div class="grab"></div><header class="sheet-h">${pre ? `<div class="sheet-pre">${pre}</div>` : ''}${title ? `<h2>${title}</h2>` : '<span></span>'}<button class="ibtn" data-a="closeSheet" aria-label="Fermer">${ic('x')}</button></header><div class="sheet-b" data-k="sb">${body}</div>${foot ? `<footer class="sheet-f">${foot}</footer>` : ''}</section>`;
}
const empty = (icon, title, text, extra = '') => `<div class="empty"><span class="empty-i">${ic(icon, 28)}</span><b>${title}</b><p>${text}</p>${extra}</div>`;

/* ---------- rendu ---------- */
/* Typographie française : espaces insécables devant ? ! : ; » et après « */
const NB = '\u00A0';
const frText = t => t.replace(/ ([?!:;\u00BB])/g, NB + '$1').replace(/\u00AB /g, '\u00AB' + NB).replace(/(\d) \$/g, '$1' + NB + '$')
  .replace(/(\d) h (\d\d)(?!\d)/g, '$1' + NB + 'h' + NB + '$2').replace(/(\d) (km|min|m|h)(?![\w\u00C0-\u00FF])/g, '$1' + NB + '$2');
/* On ne touche qu’au texte entre les balises, jamais aux attributs. */
const fr = h => h.replace(/>[^<]+</g, frText);
function setHTML(el, html) {
  html = fr(html);
  if (el._h === html) return;
  const keep = $$('[data-k]', el).map(n => [n.dataset.k, n.scrollTop, n.scrollLeft]);
  el.innerHTML = html; el._h = html;
  keep.forEach(([k, t, l]) => { const n = $(`[data-k="${k}"]`, el); if (n) { n.scrollTop = t; n.scrollLeft = l; } });
}
function syncLayer(box, items, fn, cls) {
  const old = new Map($$(':scope > :not(.leave)', box).map(el => [el.dataset.id, el]));
  items.forEach(it => {
    let el = old.get(it.id);
    if (el) old.delete(it.id);
    else { el = document.createElement('div'); el.className = cls + ' enter'; el.dataset.id = it.id; box.appendChild(el); el._new = true; const e2 = el; setTimeout(() => e2.classList.remove('enter'), 420); }
    setHTML(el, fn(it));
    if (el._new) { el._new = false; $$('[data-bottom]', el).forEach(n => { n.scrollTop = n.scrollHeight; }); }
  });
  old.forEach(el => { el.classList.add('leave'); setTimeout(() => el.remove(), 240); });
}
function render() {
  const root = document.documentElement;
  root.style.setProperty('--fs', S.size + 'px');
  root.dataset.contrast = S.contrast ? 'high' : 'normal';
  syncLayer($('#onb'), S.phase === 'app' ? [] : [{ id: S.phase === 'splash' ? 'splash' : 'onb-' + S.onb.step }], vOnb, 'screen');
  $('#main').classList.toggle('off', S.phase !== 'app');
  if (S.phase === 'app') {
    $$('.tabview').forEach(v => { const on = v.dataset.tab === S.tab; v.classList.toggle('on', on); if (on) setHTML(v, TABS[S.tab]()); });
    setHTML($('#tabbar'), vTabbar());
  }
  syncLayer($('#stack'), S.stack, s => SCREENS[s.name](s.p, s), 'screen');
  syncLayer($('#sheets'), S.sheets, s => SHEETS[s.name](s.p, s), 'sheet-wrap');
  setHTML($('#banner'), vBanner());
  refreshValid();
}
/* Un bouton gris dit toujours ce qui manque. */
const W = {};
const missing = a => a.filter(Boolean).join(', ');
const why = t => t ? `<small class="why">${t}</small>` : '';
function refreshValid() {
  $$('[data-v]').forEach(b => {
    const k = b.dataset.v; b.disabled = !V[k](b);
    if (!W[k]) return;
    let el = b.previousElementSibling;
    if (!el || !el.classList.contains('why')) { el = document.createElement('small'); el.className = 'why'; b.insertAdjacentElement('beforebegin', el); }
    const m = b.disabled ? W[k]() : '';
    el.textContent = m ? frText('Il reste à indiquer : ' + m + '.') : '';
  });
}
function scrollBottom() { $$('#stack [data-bottom]').forEach(n => { n.scrollTop = n.scrollHeight; }); }

/* ---------- navigation ---------- */
function push(name, p = {}) { S.stack.push({ id: name + '-' + (++uid), name, p }); render(); }
function back() { S.stack.pop(); render(); }
function sheet(name, p = {}) { S.sheets.push({ id: name + '-' + (++uid), name, p }); render(); }
function closeSheet() {
  const s = S.sheets.pop();
  if (s && s.name === 'steps' && !S.reg.done) { S.reg.later = true; S.pending = null; }
  render();
}
function run(str) { if (!str) return; const [n, ...a] = str.split(':'); if (A[n]) A[n](...a); }
A.noop = () => {};
A.back = back;
A.closeSheet = closeSheet;
A.go = (name, id, extra) => { S.sheets = []; S.banner = null; push(name, { id, extra }); };
A.tab = t => {
  const same = S.tab === t && !S.stack.length;
  S.tab = t; S.stack = []; S.sheets = []; render();
  if (same) { const sc = $(`.tabview[data-tab="${t}"] .scroll`); if (sc) sc.scrollTo({ top: 0, behavior: 'smooth' }); }
};

let toastT;
function toast(msg) {
  const t = $('#toast'); t.textContent = frText(msg); t.classList.add('on');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2800);
}
let bannerT;
function banner(b) {
  S.banner = b; render();
  clearTimeout(bannerT); bannerT = setTimeout(() => { S.banner = null; render(); }, 6500);
}
function vBanner() {
  const b = S.banner; if (!b) return '';
  return `<button class="push" data-a="bannerGo">${b.av}<span><b>${b.title}</b><small>${b.text}</small></span>${ic('right', 18)}</button>`;
}
A.bannerGo = () => { const b = S.banner; S.banner = null; clearTimeout(bannerT); if (b) run(b.go); else render(); };
function notify(n) { S.notifs.unshift(Object.assign({ id: 'm' + (++uid), isNew: true, ago: 'à l’instant' }, n)); }

/* Deuxième temps de l’inscription : on complète seulement au moment d’agir. */
function gate(fn) {
  if (S.reg.done) return fn();
  S.pending = fn; S.sheets = [];
  sheet('steps');
}

/* ---------- écoute des gestes ---------- */
let swiped = false;
document.addEventListener('click', e => {
  if (swiped) { swiped = false; e.preventDefault(); return; }
  const el = e.target.closest('[data-a]');
  if (!el || el.disabled) return;
  if (el.tagName !== 'A') e.preventDefault();
  const [n, ...a] = el.dataset.a.split(':');
  if (A[n]) A[n].apply(el, a);
});
document.addEventListener('input', e => {
  const t = e.target; if (!t.dataset || !t.dataset.f) return;
  if (t.dataset.fmt === 'postal') { const r = t.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6); t.value = r.length > 3 ? r.slice(0, 3) + ' ' + r.slice(3) : r; }
  if (t.dataset.fmt === 'digits') t.value = t.value.replace(/\D/g, '').slice(0, 6);
  S.f[t.dataset.f] = t.value;
  const c = $(`[data-cnt="${t.dataset.f}"]`); if (c) c.textContent = `${t.value.length} / ${c.dataset.max}`;
  if (t.dataset.live && A[t.dataset.live]) A[t.dataset.live].call(t);
  refreshValid();
});
document.addEventListener('change', e => { const t = e.target; if (t.dataset && t.dataset.file && A[t.dataset.file]) A[t.dataset.file].call(t); });
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.dataset && e.target.dataset.enter && !e.shiftKey) { e.preventDefault(); run(e.target.dataset.enter); }
  if (e.key === 'Escape') { if (S.sheets.length) closeSheet(); else if (S.stack.length) back(); }
});
/* glisser une conversation vers la gauche pour la supprimer */
(() => {
  let el = null, x0 = 0, y0 = 0, dx = 0, open = null;
  document.addEventListener('pointerdown', e => {
    const r = e.target.closest('.swipe-row');
    if (open && (!r || r !== open)) { open.style.transform = ''; open = null; }
    if (!r) return; el = r; x0 = e.clientX; y0 = e.clientY; dx = 0; el.style.transition = 'none';
  });
  document.addEventListener('pointermove', e => {
    if (!el) return;
    dx = e.clientX - x0;
    if (Math.abs(e.clientY - y0) > 24 && Math.abs(dx) < 12) { el.style.transition = ''; el.style.transform = ''; el = null; return; }
    if (dx < -6) el.style.transform = `translateX(${Math.max(dx, -112)}px)`;
  });
  const end = () => {
    if (!el) return;
    el.style.transition = '';
    if (dx < -48) { el.style.transform = 'translateX(-104px)'; open = el; swiped = true; setTimeout(() => { swiped = false; }, 350); }
    else el.style.transform = '';
    el = null;
  };
  document.addEventListener('pointerup', end);
  document.addEventListener('pointercancel', end);
})();
