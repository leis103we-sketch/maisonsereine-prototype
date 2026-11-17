/* =====================================================================
   Inscription en deux temps
   ===================================================================== */
const testLink = () => S.test ? `<button class="test" data-a="skipStep">Mode test : passer cette étape</button>` : '';
A.tapLogo = () => {
  S.taps++; clearTimeout(A._tapT); A._tapT = setTimeout(() => { S.taps = 0; }, 1400);
  if (S.taps >= 3 && !S.test) { S.test = true; S.taps = 0; render(); toast('Mode test activé'); }
};

/* ---------- premier temps : entrer ---------- */
function vOnb() {
  if (S.phase === 'splash') return vSplash();
  return ({ postal: vPostal, account: vAccount, email: vEmail, code: vCode, login: vLogin, forgot: vForgot })[S.onb.step]();
}
function vSplash() {
  return `<div class="splash">
    <div class="splash-art">${houses(4, { w: 214, h: 330, sky: 'dusk', flakes: true })}<div class="snowfall" aria-hidden="true">${Array.from({ length: 16 }, (_, i) => `<i style="left:${(i * 6.300 + 3) % 100}%;animation-duration:${8 + (i * 37) % 7}s;animation-delay:-${(i * 53) % 11}s;width:${3 + i % 3}px;height:${3 + i % 3}px"></i>`).join('')}</div><div class="splash-logo">${logo(40)}<span>Entre<b>Voisins</b></span></div></div>
    <div class="splash-card">
      <h1>Entre Voisins, c’est l’application d’entraide de votre quartier.</h1>
      <p>Demandez un coup de main, offrez le vôtre, sans jamais être seul.</p>
      ${btn('Rejoindre mon quartier', 'onbStart:postal')}
      ${btn('J’ai déjà un compte', 'onbStart:login', 'soft')}
    </div>
  </div>`;
}
function onbShell(title, lead, body, foot) {
  return `<header class="bar plain"><button class="ibtn" data-a="onbBack" aria-label="Retour">${ic('left')}</button>${wordmark(true)}<span class="ibtn-sp"></span></header>
    <div class="scroll" data-k="onb"><div class="pad onb"><h1 class="h1">${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}${body}</div></div>
    ${foot || S.test ? `<footer class="foot">${foot}${testLink()}</footer>` : ''}`;
}
function postalInfo() {
  const raw = (S.f.postal || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const hoods = FSA[raw.slice(0, 3)] || null;
  const hood = hoods ? (hoods.length === 1 ? hoods[0] : (hoods.includes(S.onb.hood) ? S.onb.hood : null)) : null;
  return { raw, fsa: raw.slice(0, 3), full: /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(raw), hoods, hood };
}
function postalOut() {
  const i = postalInfo();
  if (i.raw.length < 3) return `<p class="hint">${ic('lock', 16)}<span>Nous demandons seulement votre code postal. Votre adresse n’est jamais affichée.</span></p>`;
  if (!i.hoods) return `<p class="err">${ic('alert', 18)}<span>Ce code postal n’est pas dans la ville de Québec. Entre Voisins couvre seulement la ville de Québec pour l’instant.</span></p>`;
  return `<p class="found">${ic('pin', 16)} Secteur ${i.fsa}. ${i.hoods.length > 1 ? 'Choisissez votre quartier :' : 'Voici votre quartier :'}</p>
    <div class="opts">${i.hoods.map(h => `<button class="opt${i.hood === h ? ' on' : ''}" data-a="pickHood:${esc(h)}" role="radio" aria-checked="${i.hood === h}"><span class="radio"></span><span class="opt-b"><b>${esc(h)}</b><small>${esc(arrOf(h))}</small></span></button>`).join('')}</div>
    ${i.full ? '' : `<p class="hint"><span>Tapez les six caractères de votre code postal pour continuer.</span></p>`}`;
}
V.postal = () => { const i = postalInfo(); return i.full && !!i.hood; };
function vPostal() {
  return onbShell('Où habitez-vous ?', 'Tapez votre code postal. Nous trouvons votre quartier.',
    `${field('Code postal', 'postal', { ph: 'G1L 2K4', fmt: 'postal', live: 'postalLive', max: 7, auto: 'postal-code' })}<div id="postal-out">${postalOut()}</div>`,
    btn('Continuer', 'onbNext', 'primary', 'data-v="postal"'));
}
A.postalLive = () => { const o = $('#postal-out'); if (o) o.innerHTML = fr(postalOut()); };
A.pickHood = h => { S.onb.hood = h; render(); };

function vAccount() {
  const d = dis(S.onb.age);
  return onbShell('Créer mon compte', `Votre quartier : <b>${esc(S.hood)}</b>`,
    `${check('J’ai 18 ans ou plus', 'toggleAge', S.onb.age)}
     <div class="stackv mt">
       <button class="btn primary" data-a="acct:courriel" ${d}>${ic('mail', 20)} Continuer avec mon courriel</button>
       <button class="btn outline" data-a="acct:Facebook" ${d}>Continuer avec Facebook</button>
       <button class="btn outline" data-a="acct:Google" ${d}>Continuer avec Google</button>
       <button class="btn outline" data-a="acct:Apple" ${d}>Continuer avec Apple</button>
     </div>
     <p class="small muted center mt">En créant un compte, vous acceptez les <button class="lnk" data-a="go:terms">conditions d’utilisation</button>.</p>`, '');
}
A.toggleAge = () => { S.onb.age = !S.onb.age; render(); };
A.acct = how => {
  if (how === 'courriel') { S.onb.step = 'email'; return render(); }
  enterApp(); toast(`Connexion avec ${how} simulée pour la démonstration.`);
};
const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v || '');
V.email = () => emailOk(S.f.email) && (S.f.pw || '').length >= 8;
function vEmail() {
  return onbShell('Votre courriel', 'Il sert à vous connecter. Vos voisins ne le voient pas.',
    `${field('Courriel', 'email', { type: 'email', ph: 'vous@exemple.ca', mode: 'email', auto: 'email' })}
     ${field('Mot de passe', 'pw', { type: 'password', ph: 'Votre mot de passe', hint: '8 caractères au minimum', auto: 'new-password' })}`,
    btn('Recevoir mon code', 'onbNext', 'primary', 'data-v="email"'));
}
V.code = () => /^\d{6}$/.test(S.f.code || '');
function vCode() {
  return onbShell('Entrez votre code', `Nous avons envoyé un code à 6 chiffres à <b>${esc(S.f.email || 'votre courriel')}</b>.`,
    `${field('Code à 6 chiffres', 'code', { ph: '000000', fmt: 'digits', mode: 'numeric', max: 6, auto: 'one-time-code', enter: 'onbNext' })}
     <p class="hint">${ic('info', 16)}<span>Démonstration : n’importe quel code à 6 chiffres fonctionne.</span></p>
     <button class="lnk" data-a="resend">Renvoyer le code</button>`,
    btn('Confirmer', 'onbNext', 'primary', 'data-v="code"'));
}
A.resend = () => toast('Nous avons renvoyé le code.');
V.login = () => emailOk(S.f.email) && (S.f.pw || '').length >= 1;
function vLogin() {
  return onbShell('Bon retour !', 'Connectez-vous avec votre courriel.',
    `${field('Courriel', 'email', { type: 'email', ph: 'vous@exemple.ca', mode: 'email', auto: 'email' })}
     ${field('Mot de passe', 'pw', { type: 'password', ph: 'Votre mot de passe', auto: 'current-password', enter: 'onbNext' })}
     <button class="lnk" data-a="onbStart:forgot">Mot de passe oublié ?</button>
     <p class="hint mt">${ic('info', 16)}<span>Démonstration : n’importe quel courriel et mot de passe fonctionnent.</span></p>`,
    btn('Me connecter', 'onbNext', 'primary', 'data-v="login"'));
}
V.forgot = () => emailOk(S.f.email);
function vForgot() {
  return onbShell('Mot de passe oublié ?', 'Entrez votre courriel. Nous vous envoyons un lien pour choisir un nouveau mot de passe.',
    field('Courriel', 'email', { type: 'email', ph: 'vous@exemple.ca', mode: 'email', auto: 'email' }),
    btn('Envoyer le lien', 'onbNext', 'primary', 'data-v="forgot"'));
}
A.onbStart = step => { S.phase = 'onb'; S.onb.step = step; render(); };
A.onbBack = () => {
  const prev = { postal: null, account: 'postal', email: 'account', code: 'email', login: null, forgot: 'login' }[S.onb.step];
  if (prev) S.onb.step = prev; else S.phase = 'splash';
  render();
};
A.onbNext = () => {
  const st = S.onb.step;
  if (st === 'postal') { const i = postalInfo(); if (!V.postal()) return; S.hood = i.hood; store.set('hood', S.hood); S.onb.step = 'account'; }
  else if (st === 'email') { if (!V.email()) return; S.onb.step = 'code'; }
  else if (st === 'code') { if (!V.code()) return; return enterApp(); }
  else if (st === 'login') { if (!V.login()) return; return enterApp(); }
  else if (st === 'forgot') { if (!V.forgot()) return; S.onb.step = 'login'; render(); return toast('Si un compte existe pour ce courriel, le lien est en route.'); }
  render();
};
function enterApp() {
  if (emailOk(S.f.email)) S.me.email = S.f.email;
  S.phase = 'app'; S.tab = 'accueil'; S.stack = []; S.sheets = []; S.f = {};
  render();
}

/* ---------- deuxième temps : agir ---------- */
V.regPhone = () => (S.f.phone || '').replace(/\D/g, '').length >= 10;
V.regCode = () => /^\d{6}$/.test(S.f.regcode || '');
SHEETS.steps = () => {
  const st = S.reg.step, names = ['Téléphone', 'Photo', 'Charte'];
  const prog = `<ol class="prog">${names.map((n, i) => `<li class="${i < st ? 'done' : i === st ? 'cur' : ''}"><i>${i < st ? ic('check', 14) : i + 1}</i><span>${n}</span></li>`).join('')}</ol>`;
  let body = '', foot = '';
  if (st === 0 && !S.reg.sent) {
    body = `<h3 class="h3">Confirmez votre téléphone</h3>${field('Numéro de cellulaire', 'phone', { type: 'tel', ph: '418 555-0123', mode: 'tel', auto: 'tel', max: 16 })}${note('lock', 'Votre numéro n’est jamais affiché aux voisins.')}`;
    foot = btn('Recevoir mon code par texto', 'regSend', 'primary', 'data-v="regPhone"');
  } else if (st === 0) {
    body = `<h3 class="h3">Entrez le code reçu par texto</h3><p class="muted">Code envoyé au ${esc(S.f.phone)}. <button class="lnk" data-a="regEdit">Modifier</button></p>${field('Code à 6 chiffres', 'regcode', { ph: '000000', fmt: 'digits', mode: 'numeric', max: 6, auto: 'one-time-code', enter: 'regNext' })}<p class="hint">${ic('info', 16)}<span>Démonstration : n’importe quel code à 6 chiffres fonctionne.</span></p>`;
    foot = btn('Confirmer mon téléphone', 'regNext', 'primary', 'data-v="regCode"');
  } else if (st === 1) {
    body = `<h3 class="h3">Ajoutez votre photo</h3><p class="muted">Une photo où l’on voit bien votre visage. C’est ce qui met vos voisins en confiance.</p>
      <div class="photo-pick">${avatar('me', 112)}</div>
      <div class="photo-btns">
        <label class="btn soft">${ic('camera', 20)} Prendre une photo<input type="file" accept="image/*" capture="user" data-file="pickPhoto" hidden></label>
        <label class="btn soft">${ic('image', 20)} Choisir dans mes photos<input type="file" accept="image/*" data-file="pickPhoto" hidden></label>
      </div>`;
    foot = btn(S.me.photo ? 'Continuer avec cette photo' : 'Continuer', 'regNext', 'primary', dis(!!S.me.photo));
  } else {
    const all = S.reg.charter.every(Boolean);
    body = `<h3 class="h3">La charte du bon voisin</h3><p class="muted">Touchez chacun des quatre engagements.</p><div class="stackv">${CHARTER.map((c, i) => check(c, 'charter:' + i, S.reg.charter[i])).join('')}</div>`;
    foot = btn('Terminer mon inscription', 'regNext', 'primary', dis(all));
  }
  return sh('Encore trois petites étapes', prog + body, foot + `<button class="btn ghost" data-a="regLater">Plus tard</button>` + testLink(), wordmark(true));
};
A.regSend = () => { if (!V.regPhone()) return; S.reg.sent = true; S.me.phone = S.f.phone; render(); toast('Texto envoyé.'); };
A.regEdit = () => { S.reg.sent = false; render(); };
A.charter = i => { S.reg.charter[+i] = !S.reg.charter[+i]; render(); };
A.pickPhoto = function () {
  const file = this.files && this.files[0]; if (!file) return;
  const rd = new FileReader();
  rd.onload = () => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'), n = 320, m = Math.min(img.width, img.height);
      c.width = c.height = n;
      c.getContext('2d').drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, n, n);
      S.me.photo = c.toDataURL('image/jpeg', .860); render();
    };
    img.onerror = () => toast('Cette image ne peut pas être lue. Essayez-en une autre.');
    img.src = rd.result;
  };
  rd.readAsDataURL(file);
};
A.regNext = () => {
  const r = S.reg;
  if (r.step === 0) { if (!V.regCode()) return; r.step = 1; }
  else if (r.step === 1) { if (!S.me.photo) return; r.step = 2; }
  else { if (!r.charter.every(Boolean)) return; return regDone(); }
  render();
};
A.skipStep = () => {
  if (S.sheets.some(s => s.name === 'steps')) {
    const r = S.reg;
    if (r.step === 0) { r.step = 1; S.me.phone = S.me.phone || '418 555-0123'; }
    else if (r.step === 1) { if (!S.me.photo) S.me.photo = 'drawn'; r.step = 2; }
    else { r.charter = [true, true, true, true]; return regDone(); }
    return render();
  }
  const st = S.onb.step;
  if (st === 'postal') { S.hood = DEMO_HOOD; store.set('hood', S.hood); S.onb.step = 'account'; return render(); }
  if (st === 'account') { S.onb.age = true; S.onb.step = 'email'; return render(); }
  if (st === 'email') { S.onb.step = 'code'; return render(); }
  enterApp();
};
A.regLater = () => { S.reg.later = true; S.pending = null; S.sheets = S.sheets.filter(s => s.name !== 'steps'); render(); };
function regDone() {
  S.reg.done = true; S.reg.later = false;
  S.sheets = S.sheets.filter(s => s.name !== 'steps');
  const fn = S.pending; S.pending = null;
  render(); toast('Votre inscription est complète.');
  if (fn) setTimeout(fn, 380);
}
A.completeReg = () => { S.reg.later = false; S.pending = null; sheet('steps'); };
