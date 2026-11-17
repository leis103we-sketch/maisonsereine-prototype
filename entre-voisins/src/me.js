/* =====================================================================
   Onglet Moi, fiches, réglages, sécurité, Services du quartier et Voisin Pro
   ===================================================================== */
const stats = id => `<div class="stat3"><div><b>${stat(id, 'given')}</b><small>coups de main donnés</small></div><div><b>${stat(id, 'received')}</b><small>aides reçues</small></div><div><b>${stat(id, 'mercis')}</b><small>mercis</small></div></div>`;
function agenda() {
  const items = [];
  S.posts.forEach(p => {
    if (p.type !== 'req' || p.status !== 'matched') return;
    const acc = p.offers.find(o => o.status === 'accepted');
    if (p.by === 'me') items.push({ d: p.date, title: `${first(acc.by)} vient vous aider`, sub: `${p.title} · ${p.when}`, go: 'go:post:' + p.id, av: avatar(acc.by, 44) });
    else if (acc.by === 'me') items.push({ d: p.date, title: `Vous aidez ${first(p.by)}`, sub: `${p.title} · ${p.when}`, go: 'go:post:' + p.id, av: avatar(p.by, 44) });
  });
  S.events.filter(e => e.mine && !e.removed).forEach(e => items.push({ d: day(e.d), title: e.title, sub: `${evWhen(e)} · ${e.place}`, go: 'go:event:' + e.id, av: disc('cal', 44, 'mauve') }));
  return items.sort((a, b) => a.d - b.d);
}
const myAds = () => S.posts.filter(p => p.type === 'job' && p.mine && !['removed', 'filled'].includes(p.status));
SCREENS.ads = () => { const a = myAds(); return bar('Mes annonces') + `<div class="scroll" data-k="ads"><div class="feed">${a.length ? a.map(card).join('') + `<p class="small muted center">Touchez « Poste comblé » quand vous avez trouvé quelqu’un.</p>` : empty('case', 'Aucune annonce en ligne', 'Vos offres d’emploi publiées paraissent ici.')}</div></div>`; };
const myReqs = () => S.posts.filter(p => p.type === 'req' && p.by === 'me' && p.status !== 'cancelled');
TABS.moi = () => {
  const nA = agenda().length, nR = myReqs().filter(p => p.status !== 'done').length;
  return `<div class="scroll" data-k="moi">
    ${S.reg.later && !S.reg.done ? `<button class="complete" data-a="completeReg">${ic('alert', 20)}<span><b>Complétez votre inscription</b><small>Encore trois petites étapes pour agir dans le quartier.</small></span>${ic('right', 18)}</button>` : ''}
    <div class="me-top">${avatar('me', 88)}<h1 class="h1">${P.me.name}</h1><p class="muted">${esc(S.hood)} · Membre depuis ${P.me.since}</p>
      <div class="me-btns"><button class="btn soft sm" data-a="editMe">${ic('edit', 16)} Modifier ma fiche</button><button class="btn soft sm" data-a="go:profile:me">${ic('eye', 16)} Voir ma fiche comme un voisin</button></div></div>
    ${stats('me')}
    <div class="pad stackv">
      <h2 class="wk">Mon activité</h2>
      <div class="list">${row('cal', 'Mon agenda', nA ? `${nA} rendez-vous à venir` : 'Aucun rendez-vous à venir', 'go:agenda')}${row('hand', 'Mes demandes', nR ? `${nR} demande${nR > 1 ? 's' : ''} en cours` : 'Aucune demande en cours', 'go:mine')}${myAds().length ? row('case', 'Mes annonces', `${myAds().length} offre${myAds().length > 1 ? 's' : ''} d’emploi en ligne`, 'go:ads') : ''}</div>
      <h2 class="wk">Mon compte</h2>
      <div class="list">${row('mail', 'Courriel et téléphone', '', 'go:account')}${row('heart', 'Les personnes que j’aide', S.proches.map(p => esc(p.nick)).join(', '), 'go:proches')}${row('sliders', 'Affichage et rappels', '', 'go:display')}</div>
      <div class="list solo">${row('tool', 'Voisin Pro', S.pro.active ? 'Votre abonnement est actif' : 'Offrez vos services rémunérés dans le quartier', S.pro.active ? 'go:pro' : 'becomePro')}</div>
      <div class="links"><button class="lnk" data-a="go:tips">Conseils de prudence</button><button class="lnk" data-a="go:terms">Conditions d’utilisation</button><button class="lnk" data-a="go:terms:conf">Confidentialité</button></div>
    </div>
  </div>`;
};
SCREENS.agenda = () => {
  const it = agenda();
  return bar('Mon agenda') + `<div class="scroll" data-k="ag"><div class="pad stackv">
    ${it.length ? `<div class="list">${it.map(i => `<button class="row" data-a="${i.go}">${i.av}<span class="row-b"><b>${esc(i.title)}</b><small>${esc(i.sub)}</small></span>${ic('right', 18, 'row-c')}</button>`).join('')}</div>` : empty('cal', 'Aucun rendez-vous à venir', 'Vos coups de main acceptés et vos sorties paraissent ici.')}
    ${note('bell', S.reminders ? 'Vous recevez un rappel la veille de chaque rendez-vous, avec les conseils de prudence.' : 'Les rappels la veille sont désactivés. Vous pouvez les remettre dans « Affichage et rappels ».')}
  </div></div>`;
};
SCREENS.mine = () => {
  const all = myReqs(), cur = all.filter(p => p.status !== 'done'), done = all.filter(p => p.status === 'done');
  return bar('Mes demandes') + `<div class="scroll" data-k="mine"><div class="feed">
    ${cur.length ? cur.map(card).join('') : empty('hand', 'Aucune demande en cours', 'Besoin d’un coup de main ? Vos voisins sont là.', btn('Demander un coup de main', 'publish', 'primary'))}
    ${done.length ? `<h2 class="wk pad-s">Terminées</h2>` + done.map(card).join('') : ''}
  </div></div>`;
};

/* ---------- la fiche publique, la même pour tout le monde ---------- */
SCREENS.profile = ({ id }) => {
  const me = id === 'me', u = P[id], can = me ? S.me.can : u.can, bio = me ? S.me.bio : u.bio, thanks = me ? S.me.thanks : u.thanks;
  const pro = me ? (S.pro.active && S.pro.services.length > 0) : !!u.pro, services = me ? S.pro.services : u.services;
  const known = (u.known || []).filter(x => x !== id);
  return bar(me ? 'Ma fiche' : 'Fiche du voisin', me ? '' : `<button class="ibtn" data-a="report:${id}" aria-label="Signaler ou bloquer">${ic('more')}</button>`) + `<div class="scroll" data-k="pf"><div class="pad stackv">
    ${me ? note('eye', 'Voici ce que vos voisins voient.') : ''}
    <div class="pf-top">${avatar(id, 96)}<h2 class="h1">${u.name}</h2><p class="muted">${me ? esc(S.hood) : distTxt(u.dist)} · Membre depuis ${u.since}</p>${pro ? `<span class="pill pro">${ic('tool', 13)} Offre des services rémunérés</span>` : ''}</div>
    ${bio ? `<p class="body center">${esc(bio)}</p>` : ''}
    ${stats(id)}
    ${pro ? `<section><h3 class="h4">${me ? 'Mes services et mes tarifs' : 'Ses services et ses tarifs'}</h3><div class="rates">${services.map(s => `<div><span>${esc(s[0])}</span><b>${esc(s[1])}</b></div>`).join('')}</div>${note('receipt', 'Le paiement se règle entre vous, sans passer par Entre Voisins.')}</section>` : ''}
    <section><h3 class="h4">${pro ? (me ? 'Ce que je fais aussi bénévolement' : `Ce qu’${il(id)} fait aussi bénévolement`) : 'Peut aider pour'}</h3><div class="tags">${can.length ? can.map(c => `<span class="pill">${c}</span>`).join('') : '<span class="muted small">Rien d’indiqué pour l’instant.</span>'}</div></section>
    <section><h3 class="h4">Les mercis des voisins</h3>${thanks.length ? thanks.map(t => `<blockquote class="qb"><p>« ${esc(t[1])} »</p><footer>${avatar(t[0], 24)} ${t[0] === 'me' ? P.me.first : first(t[0])}</footer></blockquote>`).join('') : `<p class="muted small">Pas encore de merci.</p>`}</section>
    ${known.length ? `<section><h3 class="h4">${knownTxt(id)}</h3><div class="going">${avStack(known, 34, 6)}</div></section>` : ''}
    ${me ? '' : `<button class="lnk worry" data-a="report:${id}">Quelque chose vous inquiète ?</button>`}
  </div></div>${me ? '' : `<footer class="foot">${btn(`${ic('chat', 18)} Écrire à ${u.first}`, 'write:' + id)}</footer>`}`;
};
A.editMe = () => { S.f['me.bio'] = S.me.bio; S.editCan = [...S.me.can]; push('editme'); };
SCREENS.editme = () => bar('Modifier ma fiche') + `<div class="scroll" data-k="ed"><div class="pad stackv">
    <div class="photo-pick">${avatar('me', 104)}<label class="btn soft sm">${ic('camera', 16)} ${S.me.photo ? 'Changer ma photo' : 'Ajouter ma photo'}<input type="file" accept="image/*" data-file="pickPhoto" hidden></label><small class="muted">Une photo où l’on voit bien votre visage.</small></div>
    ${field('Quelques mots sur vous', 'me.bio', { area: true, rows: 3, max: 150, count: true, ph: 'Ce que vos voisins aimeraient savoir.' })}
    <div class="field"><label>Je peux aider pour</label><div class="chips">${TOPICS.map(t => chip(t, 'topic:' + t, S.editCan.includes(t))).join('')}</div></div>
  </div></div><footer class="foot">${btn('Enregistrer ma fiche', 'saveMe')}</footer>`;
A.topic = t => { const a = S.editCan; a.includes(t) ? a.splice(a.indexOf(t), 1) : a.push(t); render(); };
A.saveMe = () => { S.me.bio = (S.f['me.bio'] || '').trim(); S.me.can = [...S.editCan]; back(); toast('Votre fiche est à jour.'); };

/* ---------- courriel et téléphone ---------- */
SCREENS.account = () => bar('Courriel et téléphone') + `<div class="scroll" data-k="ac"><div class="pad stackv">
    <div class="list">
      ${row('mail', 'Courriel', esc(S.me.email), 'editField:email', '<span class="row-e">Modifier</span>')}
      ${row('phone', 'Numéro de cellulaire', S.me.phone ? esc(S.me.phone) + ' · jamais affiché aux voisins' : 'Pas encore confirmé', S.me.phone ? 'editField:phone' : 'completeReg', `<span class="row-e">${S.me.phone ? 'Modifier' : 'Confirmer'}</span>`)}
      ${row('lock', 'Mot de passe', '••••••••', 'editField:pw', '<span class="row-e">Modifier</span>')}
    </div>
    <section><h3 class="h4">Personnes bloquées</h3>${S.blocked.length ? `<div class="list">${S.blocked.map(b => `<div class="row">${avatar(b, 40)}<span class="row-b"><b>${P[b].name}</b><small>Vos échanges sont coupés.</small></span><button class="btn sm soft" data-a="unblock:${b}">Débloquer</button></div>`).join('')}</div>` : `<p class="muted small">Vous n’avez bloqué personne.</p>`}</section>
    <div class="list">${row('out', 'Me déconnecter', '', 'logout')}</div>
    <button class="lnk danger" data-a="askDelete">${ic('trash', 15)} Supprimer mon compte</button>
  </div></div>`;
const EDIT = { email: ['Modifier mon courriel', 'Nouveau courriel', 'email'], phone: ['Modifier mon numéro', 'Nouveau numéro de cellulaire', 'tel'], pw: ['Modifier mon mot de passe', 'Nouveau mot de passe', 'password'] };
V.edit = () => { const k = S.editKey, v = S.f.edit || ''; return k === 'email' ? emailOk(v) : k === 'phone' ? v.replace(/\D/g, '').length >= 10 : v.length >= 8; };
A.editField = k => { S.editKey = k; S.f.edit = k === 'pw' ? '' : S.me[k]; sheet('edit'); };
SHEETS.edit = () => { const e = EDIT[S.editKey]; return sh(e[0], field(e[1], 'edit', { type: e[2], hint: S.editKey === 'pw' ? '8 caractères au minimum' : S.editKey === 'phone' ? 'Nous vous envoyons un code par texto pour le confirmer.' : 'Nous vous envoyons un code pour le confirmer.', enter: 'saveField' }), btn('Enregistrer', 'saveField', 'primary', 'data-v="edit"')); };
A.saveField = () => { if (!V.edit()) return; if (S.editKey !== 'pw') S.me[S.editKey] = S.f.edit.trim(); closeSheet(); toast(S.editKey === 'pw' ? 'Votre mot de passe est changé.' : 'C’est enregistré.'); };
A.unblock = id => { S.blocked = S.blocked.filter(b => b !== id); render(); toast(`${first(id)} est débloqué${P[id].g === 'f' ? 'e' : ''}.`); };
function reset(msg) { Object.keys(S).forEach(k => delete S[k]); Object.assign(S, fresh()); render(); if (msg) toast(msg); }
A.logout = () => reset('Déconnexion faite. À bientôt !');
A.askDelete = () => sheet('sure', { title: 'Supprimer votre compte ?', text: 'La suppression efface votre fiche, votre photo, vos demandes et vos messages. Les mercis que vous avez écrits restent, sans votre nom.', yes: 'Supprimer mon compte', act: 'doDelete', danger: true });
A.doDelete = () => reset('Votre compte est supprimé.');

/* ---------- les personnes que j’aide ---------- */
SCREENS.proches = () => bar('Les personnes que j’aide') + `<div class="scroll" data-k="pr"><div class="pad stackv">
    <p class="lead">Ces personnes n’ont pas de compte. Vous faites les demandes pour elles, dans leur quartier.</p>
    ${S.proches.map(p => `<article class="card proche">
      <header class="card-h">${disc('heart', 48, 'mauve')}<div class="who"><b>${esc(p.nick)}</b><small>${esc(p.first)} · ${esc(p.hood)}</small></div><button class="btn sm ghost" data-a="openProche:${p.id}">Modifier</button></header>
      ${p.note ? `<p class="card-x"><b>Bon à savoir.</b> ${esc(p.note)}</p>` : ''}
      <p class="meta ok">${ic('check', 15)}<span>D’accord pour recevoir l’aide de voisins</span></p>
      ${btn(`Demander de l’aide pour ${esc(p.nick)}`, 'askFor:' + p.id, 'primary')}
    </article>`).join('')}
    <button class="btn soft" data-a="openProche:new">${ic('plus', 18)} Ajouter une personne</button>
    ${note('lock', 'La note « bon à savoir » est envoyée seulement au voisin dont vous acceptez l’aide.')}
  </div></div>`;
W.proche = () => missing([(S.f['pr.nick'] || '').trim().length < 2 && 'un surnom', (S.f['pr.first'] || '').trim().length < 2 && 'son prénom', !S.f['pr.ok'] && 'son accord, avec la case du bas']);
W.pro = () => 'au moins un service avec son tarif';
W.edit = () => S.editKey === 'email' ? 'un courriel valide' : S.editKey === 'phone' ? 'un numéro à 10 chiffres' : 'un mot de passe de 8 caractères ou plus';
V.proche = () => (S.f['pr.nick'] || '').trim().length >= 2 && (S.f['pr.first'] || '').trim().length >= 2 && !!S.f['pr.hood'] && !!S.f['pr.ok'];
A.openProche = (id, then) => {
  const p = procheOf(id);
  Object.assign(S.f, { 'pr.nick': p ? p.nick : '', 'pr.first': p ? p.first : '', 'pr.hood': p ? p.hood : S.hood, 'pr.note': p ? p.note : '', 'pr.ok': p ? p.ok : false });
  sheet('proche', { id: p ? id : null, then });
};
SHEETS.proche = ({ id }) => sh(id ? 'Modifier cette personne' : 'Ajouter une personne', `
  ${field('Surnom', 'pr.nick', { ph: 'Maman', max: 20, hint: 'C’est le nom que vous verrez dans l’application.' })}
  ${field('Son prénom', 'pr.first', { ph: 'Denise', max: 30 })}
  <div class="field"><label for="f-pr-hood">Son quartier</label><select class="inp" id="f-pr-hood" data-f="pr.hood">${ARR.map(a => `<optgroup label="${a[0]}">${a[1].map(h => `<option${S.f['pr.hood'] === h ? ' selected' : ''}>${h}</option>`).join('')}</optgroup>`).join('')}</select></div>
  ${field('Bon à savoir', 'pr.note', { area: true, rows: 3, max: 200, count: true, ph: 'Ce qu’un voisin devrait savoir avant de venir.' })}
  ${check('Cette personne est d’accord pour recevoir l’aide de voisins.', 'toggleF:pr.ok', S.f['pr.ok'])}`,
  btn('Enregistrer', 'saveProche:' + (id || 'new'), 'primary', 'data-v="proche"') + (id ? btn('Retirer cette personne', 'delProche:' + id, 'ghost danger') : ''));
A.toggleF = k => { S.f[k] = !S.f[k]; render(); };
A.saveProche = id => {
  if (!V.proche()) return;
  const d = { nick: S.f['pr.nick'].trim(), first: S.f['pr.first'].trim(), hood: S.f['pr.hood'], note: (S.f['pr.note'] || '').trim(), ok: true };
  let p = procheOf(id);
  if (p) Object.assign(p, d); else { p = Object.assign({ id: 'k' + (++uid) }, d); S.proches.push(p); }
  const then = S.sheets[S.sheets.length - 1].p.then;
  S.sheets.pop();
  if (then === 'ask' && S.ask) { S.ask.who = p.id; S.ask.step = 'need'; }
  render(); toast(`${p.nick} est dans vos personnes aidées.`);
};
A.delProche = id => { S.proches = S.proches.filter(p => p.id !== id); S.sheets = []; render(); toast('Cette personne est retirée.'); };

/* ---------- affichage et rappels ---------- */
const toggle = (title, sub, a, on) => `<button class="toggle${on ? ' on' : ''}" data-a="${a}" role="switch" aria-checked="${!!on}"><span><b>${title}</b><small>${sub}</small></span><i class="sw"></i></button>`;
SCREENS.display = () => bar('Affichage et rappels') + `<div class="scroll" data-k="ds"><div class="pad stackv">
    <section><h3 class="h4">Taille du texte</h3>
      <div class="sizes" role="radiogroup">${[[15, 'Normal'], [17, 'Grand'], [20, 'Très grand']].map(([n, l]) => `<button class="size${S.size === n ? ' on' : ''}" data-a="size:${n}" role="radio" aria-checked="${S.size === n}"><span style="font-size:${n + 5}px">Aa</span><b>${l}</b><small>${n} pixels</small></button>`).join('')}</div>
      <p class="sample">Thérèse cherche quelqu’un pour l’accompagner à la pharmacie, lundi matin.</p></section>
    <div class="list">${toggle('Contraste renforcé', 'Un texte plus foncé et des contours plus nets.', 'contrast', S.contrast)}${toggle('Rappels la veille', 'Pour vos rendez-vous et vos sorties, avec les conseils de prudence.', 'reminders', S.reminders)}</div>
  </div></div>`;
A.size = n => { S.size = +n; store.set('size', String(S.size)); render(); };
A.contrast = () => { S.contrast = !S.contrast; render(); };
A.reminders = () => { S.reminders = !S.reminders; render(); };

/* ---------- conseils de prudence et conditions ---------- */
SCREENS.tips = () => bar('Conseils de prudence') + `<div class="scroll" data-k="tp"><div class="pad stackv">
    <div class="tips-top">${disc('shield', 56, 'blue')}<h2 class="h1">Avant une première rencontre</h2><p class="lead">Six gestes simples, pour vous et pour vos proches.</p></div>
    <ol class="tips">${TIPS.map(t => `<li>${t}</li>`).join('')}</ol>
    <a class="sos" href="tel:911">${ic('alert', 24)}<span><b>En danger maintenant ? Appelez le 911</b><small>Entre Voisins n’est pas un service d’urgence.</small></span></a>
  </div></div>`;
SCREENS.terms = ({ id }) => {
  const conf = id === 'conf', parts = TERMS.map((t, i) => [i + 1, t]).filter(([n]) => !conf || n === 5 || n === 7);
  return bar(conf ? 'Confidentialité' : 'Conditions d’utilisation') + `<div class="scroll" data-k="tm"><div class="pad stackv terms">
    ${note('info', 'Texte de démonstration. Tout reste à valider par un juriste avant le lancement.', 'warn')}
    ${parts.map(([n, t]) => `<section><h3 class="h3">${n}. ${t[0]}</h3><p class="body">${t[1]}</p></section>`).join('')}
    ${conf ? `<button class="lnk" data-a="go:terms">Lire toutes les conditions d’utilisation</button>` : ''}
  </div></div>`;
};

/* ---------- Services du quartier : le seul endroit où l’on voit des prix ---------- */
function pros() {
  const a = NEIGHBOURS.filter(n => P[n].pro && !S.blocked.includes(n)).map(n => ({ id: n, name: P[n].name, services: P[n].services, themes: P[n].themes, mercis: P[n].mercis, dist: P[n].dist }));
  if (S.pro.active && S.pro.services.length) a.push({ id: 'me', name: P.me.name, services: S.pro.services, themes: [], mercis: S.me.mercis, dist: 0 });
  return a.sort((x, y) => x.dist - y.dist);
}
const svcCard = p => `<button class="svc" data-a="go:profile:${p.id}">${avatar(p.id, 52)}<span class="svc-b"><b>${p.name}</b><span class="svc-l">${p.services.map(s => `<span><i>${esc(s[0])}</i><em>${esc(s[1])}</em></span>`).join('')}</span><small>${heartFull(11)} ${p.mercis} mercis · ${p.id === 'me' ? 'c’est vous' : distTxt(p.dist)}</small></span></button>`;
function svcList() {
  if (S.hood !== DEMO_HOOD) return empty('tool', `Aucun Voisin Pro dans ${esc(S.hood)} pour l’instant`, 'Dans cette démonstration, l’annuaire est rempli pour le Vieux-Limoilou.');
  const q = norm(S.f.svq).trim(), all = pros();
  if (!q) return all.map(svcCard).join('');
  const themes = Object.keys(THEMES).filter(t => norm(t).includes(q) || THEMES[t].some(k => q.includes(k) || (q.length >= 3 && k.includes(q))));
  let out = ''; const seen = new Set();
  themes.forEach(t => { const l = all.filter(p => p.themes.includes(t)); if (l.length) { out += `<h3 class="wk">${t}</h3>` + l.map(svcCard).join(''); l.forEach(p => seen.add(p.id)); } });
  const direct = all.filter(p => !seen.has(p.id) && (norm(p.name).includes(q) || p.services.some(s => norm(s[0]).includes(q))));
  if (direct.length) out += (out ? `<h3 class="wk">Autres résultats</h3>` : '') + direct.map(svcCard).join('');
  return out || empty('search', 'Aucun voisin n’offre ce service pour l’instant', themes.length ? `Thème reconnu : ${themes.join(', ')}. Demandez plutôt un coup de main dans le fil.` : 'Essayez un autre mot, ou demandez un coup de main dans le fil.', btn('Demander un coup de main', 'publish', 'soft'));
}
SCREENS.services = () => bar('Services du quartier') + `<div class="scroll" data-k="sv"><div class="pad stackv">
    <div class="searchbox">${ic('search', 18)}<input data-f="svq" data-live="svcSearch" value="${esc(S.f.svq || '')}" placeholder="Que cherchez-vous ?" aria-label="Que cherchez-vous ?" autocomplete="off"></div>
    <div><h3 class="h4">Les plus offerts</h3><div class="chips">${['Déneigement', 'Ménage', 'Petits travaux'].map(t => chip(t, 'svcTheme:' + t, norm(S.f.svq) === norm(t))).join('')}</div></div>
    <div class="note warn">${ic('alert', 18)}<span><b>Services payants, non garantis par Entre Voisins.</b> <button class="lnk" data-a="svcInfo">En savoir plus</button></span></div>
    ${tipNote()}
    <div id="svc-list" class="stackv">${svcList()}</div>
    <div class="cta"><b>Vous offrez des services dans le quartier ?</b><p class="small">Une place dans l’annuaire pour 7,99 $ par mois, plus taxes. Première semaine gratuite.</p>${S.pro.active ? btn('Gérer mes services', 'go:pro', 'soft') : btn('Devenir Voisin Pro', 'becomePro')}</div>
  </div></div>`;
A.svcSearch = () => { const o = $('#svc-list'); if (o) o.innerHTML = fr(svcList()); };
A.svcTheme = t => { S.f.svq = norm(S.f.svq) === norm(t) ? '' : t; render(); };
A.svcInfo = () => sheet('svcInfo');
SHEETS.svcInfo = () => sh('Services payants, non garantis', `<ul class="ticks">
    <li>${ic('info', 16)}<span>Les Voisins Pro sont des voisins qui offrent des services payés. Ce ne sont pas des employés d’Entre Voisins.</span></li>
    <li>${ic('info', 16)}<span>Entre Voisins ne garantit ni la qualité ni le résultat d’un service.</span></li>
    <li>${ic('info', 16)}<span>Le prix et le paiement se règlent entre vous. Entre Voisins ne prend aucune commission.</span></li>
    <li>${ic('info', 16)}<span>Chaque Voisin Pro déclare détenir les permis et les assurances exigés pour ses services.</span></li>
    <li>${ic('info', 16)}<span>Ne sont pas acceptés dans l’annuaire : les repas vendus, le transport payé et les soins à la personne.</span></li>
  </ul>
  <button class="note tip" data-a="go:tips">${ic('shield', 18)}<span><b>Conseils de prudence</b><small>Convenez du montant avant. Réglez une fois le service rendu.</small></span>${ic('right', 16)}</button>`, btn('J’ai compris', 'closeSheet', 'soft'));

/* ---------- Voisin Pro ---------- */
A.becomePro = () => gate(() => { S.f.proOk = false; S.sheets = []; sheet('becomePro'); });
SHEETS.becomePro = () => sh('Devenir Voisin Pro', `
  <div class="price"><b>7,99 $</b><span>par mois, plus taxes</span></div>
  <div class="tags"><span class="pill ok">Une semaine d’essai gratuite</span><span class="pill ok">Sans engagement</span></div>
  <ul class="ticks">
    <li>${ic('check', 16)}<span>Votre place dans « Services du quartier ».</span></li>
    <li>${ic('check', 16)}<span>La mention « Offre des services rémunérés » sur votre fiche.</span></li>
    <li>${ic('check', 16)}<span>Aucune commission. Ce que vous gagnez reste à vous.</span></li>
    <li>${ic('check', 16)}<span>Un rappel 3 jours avant le premier paiement.</span></li>
  </ul>
  <div class="note warn">${ic('ban', 18)}<span><b>Services refusés dans l’annuaire :</b> ${REFUSED.map(r => lc(r[0])).join(', ')}.</span></div>
  ${check('Je détiens les permis et les assurances exigés pour les services que j’offre.', 'toggleF:proOk', S.f.proOk)}
  <p class="hint">${ic('info', 16)}<span>Démonstration : aucun paiement réel n’est fait.</span></p>`,
  why(S.f.proOk ? '' : 'Cochez la case des permis et des assurances pour continuer.') + btn('Commencer ma semaine gratuite', 'startPro', 'primary', dis(!!S.f.proOk)));
A.startPro = () => {
  S.pro = { active: true, services: [], n: 1, err: {}, saved: false };
  ['0', '1', '2', '3', '4'].forEach(i => { S.f['ps.' + i] = ''; S.f['pt.' + i] = ''; });
  S.sheets = []; push('pro'); toast('Bienvenue parmi les Voisins Pro. Votre semaine gratuite commence.');
};
const refusedOf = t => { const n = norm(t); const hit = REFUSED.find(r => r[1].some(k => new RegExp('(^|[^a-z])' + k).test(n))); return hit ? hit[0] : ''; };
const proRows = () => Array.from({ length: S.pro.n }, (_, i) => [(S.f['ps.' + i] || '').trim(), (S.f['pt.' + i] || '').trim()]);
V.pro = () => proRows().some(r => r[0].length >= 3 && r[1].length >= 1);
SCREENS.pro = () => {
  const pr = S.pro;
  if (!pr.active) return bar('Voisin Pro') + `<div class="scroll"><div class="pad">${empty('tool', 'Vous n’êtes pas Voisin Pro', 'Offrez vos services rémunérés dans le quartier.', btn('Devenir Voisin Pro', 'becomePro'))}</div></div>`;
  return bar('Voisin Pro') + `<div class="scroll" data-k="pro"><div class="pad stackv">
    <div class="note ok">${ic('check', 18)}<span><b>Votre essai gratuit est en cours.</b><br>Premier paiement de 7,99 $ plus taxes le ${fLong(day(7))}. Nous vous le rappelons le ${fLong(day(4))}.</span></div>
    <section><h3 class="h4">Mes services et mes tarifs</h3><p class="small muted">Jusqu’à 5 services, en 40 caractères chacun. Vos tarifs paraissent seulement dans « Services du quartier » et sur votre fiche.</p>
      <div class="stackv">${Array.from({ length: pr.n }, (_, i) => `<div class="svc-row${pr.err[i] ? ' bad' : ''}"><div class="svc-in"><input class="inp" data-f="ps.${i}" value="${esc(S.f['ps.' + i] || '')}" maxlength="40" placeholder="Service ${i + 1}, par exemple : tonte de gazon" aria-label="Service ${i + 1}" autocomplete="off"><input class="inp rate" data-f="pt.${i}" value="${esc(S.f['pt.' + i] || '')}" maxlength="20" placeholder="Tarif" aria-label="Tarif du service ${i + 1}" autocomplete="off">${pr.n > 1 ? `<button class="ibtn sm" data-a="proDel:${i}" aria-label="Retirer le service ${i + 1}">${ic('x', 18)}</button>` : ''}</div>${pr.err[i] ? `<p class="err">${ic('alert', 16)}<span>${pr.err[i]}</span></p>` : ''}</div>`).join('')}</div>
      ${pr.n < 5 ? `<button class="btn soft sm mt-s" data-a="proAdd">${ic('plus', 16)} Ajouter un service</button>` : ''}</section>
    ${btn('Enregistrer mes services', 'savePro', 'primary', 'data-v="pro"')}
    ${pr.saved ? `<div class="note ok">${ic('check', 18)}<span>Vos services sont dans l’annuaire. <button class="lnk" data-a="go:services">Voir ma place</button></span></div>` : ''}
    <button class="lnk danger" data-a="cancelPro">Annuler mon abonnement</button>
  </div></div>`;
};
A.proAdd = () => { if (S.pro.n < 5) S.pro.n++; render(); };
A.proDel = i => {
  i = +i; for (let k = i; k < 4; k++) { S.f['ps.' + k] = S.f['ps.' + (k + 1)] || ''; S.f['pt.' + k] = S.f['pt.' + (k + 1)] || ''; }
  S.f['ps.4'] = ''; S.f['pt.4'] = ''; S.pro.n--; S.pro.err = {}; render();
};
A.savePro = () => {
  if (!V.pro()) return;
  const rows = proRows(), err = {};
  rows.forEach((r, i) => {
    const bad = refusedOf(r[0]);
    if (bad) err[i] = `Ce service n’est pas accepté dans l’annuaire (${lc(bad)}). Retirez-le pour enregistrer.`;
    else if (r[0] && !r[1]) err[i] = 'Ajoutez un tarif pour ce service.';
    else if (!r[0] && r[1]) err[i] = 'Écrivez le nom de ce service.';
  });
  S.pro.err = err;
  if (Object.keys(err).length) { S.pro.saved = false; return render(); }
  S.pro.services = rows.filter(r => r[0] && r[1]); S.pro.saved = true; render(); toast('Vos services sont enregistrés.');
};
A.cancelPro = () => { S.pro = { active: false, services: [] }; S.stack = S.stack.filter(s => s.name !== 'pro'); render(); toast('Votre abonnement est annulé. Vos services sont retirés de l’annuaire.'); };
