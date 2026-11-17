/* =====================================================================
   Demander de l’aide et aider : de la demande jusqu’au merci
   ===================================================================== */
function barB(title, backAct) {
  return `<header class="bar"><button class="ibtn" data-a="${backAct}" aria-label="Retour">${ic('left')}</button><h1 class="bar-t">${title}</h1><span class="ibtn-sp"></span></header>`;
}
A.ask = fam => gate(() => {
  S.sheets = []; S.f['ask.text'] = '';
  S.ask = { fam, step: fam === 'proche' ? 'who' : 'need', who: fam === 'proche' ? null : 'me', preset: false, need: null, mode: null, day: null, slot: null, hour: null };
  push('ask');
});
A.askFor = id => gate(() => {
  S.sheets = []; S.f['ask.text'] = '';
  S.ask = { fam: 'proche', step: 'need', who: id, preset: true, need: null, mode: null, day: null, slot: null, hour: null };
  push('ask');
});
A.askBack = () => {
  const a = S.ask;
  if (a.step === 'form') a.step = 'need';
  else if (a.step === 'need' && a.fam === 'proche' && !a.preset) a.step = 'who';
  else return back();
  render();
};
A.askWho = id => { if (id === 'new') return A.openProche('new', 'ask'); S.ask.who = id; S.ask.step = 'need'; render(); };
A.askNeed = id => { S.ask.need = id; S.ask.step = 'form'; render(); };
A.askMode = m => { const a = S.ask; a.mode = m; a.day = m === 'today' ? 0 : m === 'tomorrow' ? 1 : (a.day > 1 ? a.day : null); render(); };
A.askDate = k => { S.ask.day = +k; render(); };
A.askSlot = s => { S.ask.slot = s; if (s !== 'heure') S.ask.hour = null; render(); };
A.askHour = h => { S.ask.hour = h; render(); };
A.askTo = id => { S.ask.who = id; render(); };
const SLOTS = { matin: ['Matin', 'le matin'], apm: ['Après-midi', 'l’après-midi'], soir: ['Soir', 'le soir'], heure: ['Heure précise', ''] };
V.ask = () => { const a = S.ask; return !!a && (S.f['ask.text'] || '').trim().length >= 5 && a.day != null && !!a.slot && (a.slot !== 'heure' || !!a.hour); };
const procheOf = id => S.proches.find(x => x.id === id);
SCREENS.ask = () => {
  const a = S.ask, famLabel = a.fam === 'proche' ? 'De l’aide pour un proche' : 'Un coup de main';
  if (a.step === 'who') return barB(famLabel, 'askBack') + `<div class="scroll" data-k="ask"><div class="pad stackv">
      <h2 class="h1">Pour qui est cette aide ?</h2>
      <p class="lead">La personne n’a pas besoin de compte. Sa demande paraît dans son quartier à elle.</p>
      <div class="opts">
        ${S.proches.map(p => `<button class="opt" data-a="askWho:${p.id}">${disc('heart', 44, 'mauve')}<span class="opt-b"><b>${esc(p.nick)}</b><small>${esc(p.first)} · ${esc(p.hood)}</small></span>${ic('right', 18)}</button>`).join('')}
        <button class="opt" data-a="askWho:me">${avatar('me', 44)}<span class="opt-b"><b>Pour moi</b><small>${esc(S.hood)}</small></span>${ic('right', 18)}</button>
        <button class="opt dashed" data-a="askWho:new">${disc('plus', 44, 'grey')}<span class="opt-b"><b>Ajouter une personne</b><small>Un parent, un ami, une personne que vous aidez.</small></span>${ic('right', 18)}</button>
      </div></div></div>`;
  if (a.step === 'need') {
    const pr = procheOf(a.who);
    return barB(famLabel, 'askBack') + `<div class="scroll" data-k="ask"><div class="pad stackv">
      <h2 class="h1">${pr ? `Quel est le besoin ${esc(de(pr.nick))} ?` : 'Quel est votre besoin ?'}</h2>
      <div class="list">${NEEDS[a.fam].map(n => row(n[2], n[1], n[4] || '', 'askNeed:' + n[0])).join('')}</div></div></div>`;
  }
  const n = needOf(a.fam, a.need), pr = procheOf(a.who), hood = pr ? pr.hood : S.hood;
  return barB('Ma demande', 'askBack') + `<div class="scroll" data-k="ask"><div class="pad stackv">
      <button class="need-chip" data-a="askBack">${ic(n[2], 18)}<span>${n[1]}</span><small>Changer</small></button>
      ${field('1. Votre besoin, en quelques mots', 'ask.text', { area: true, rows: 3, ph: 'Ex. : ' + n[3], max: 200, count: true })}
      ${a.fam === 'proche' ? `<div class="field"><label>2. C’est pour qui ?</label><div class="chips">${S.proches.map(p => chip(esc(p.nick), 'askTo:' + p.id, a.who === p.id)).join('')}${chip('Pour moi', 'askTo:me', a.who === 'me')}</div></div>` : ''}
      <div class="field"><label>${a.fam === 'proche' ? '3' : '2'}. Quand ?</label>
        <div class="chips">${chip('Aujourd’hui', 'askMode:today', a.mode === 'today')}${chip('Demain', 'askMode:tomorrow', a.mode === 'tomorrow')}${chip(a.mode === 'date' && a.day > 1 ? cap(fShort(day(a.day))) : 'Une autre date', 'askMode:date', a.mode === 'date')}</div>
        ${a.mode === 'date' ? dayStrip(a.day, 'askDate', 28, 2) : ''}
        <div class="chips mt-s">${Object.keys(SLOTS).map(k => chip(SLOTS[k][0], 'askSlot:' + k, a.slot === k)).join('')}</div>
        ${a.slot === 'heure' ? `<div class="hscroll chips1" data-k="hrs">${HOURS.map(h => chip(h, 'askHour:' + h, a.hour === h)).join('')}</div>` : ''}
      </div>
      ${note('lock', `Visible par les membres inscrits de ${esc(hood)}. L’adresse n’est jamais affichée.`)}
    </div></div><footer class="foot">${btn('Envoyer à mes voisins', 'sendAsk', 'primary', 'data-v="ask"')}</footer>`;
};
const HELPERS = { deneiger: 'louis', outil: 'marcandre', travail: 'paul', lourd: 'paul', course: 'nadia', animal: 'sophie', rdv: 'jeannine', tablette: 'karim', autre: 'paul', repasacc: 'jeannine', repasprep: 'nadia', quotidien: 'nadia', social: 'therese', repit: 'jeannine', soins: 'karine' };
A.sendAsk = () => {
  if (!V.ask()) return;
  const a = S.ask, n = needOf(a.fam, a.need), pr = procheOf(a.who), hood = pr ? pr.hood : S.hood, text = S.f['ask.text'].trim(), d = day(a.day);
  const when = `${cap(fLong(d))}, ${a.slot === 'heure' ? 'à ' + a.hour : SLOTS[a.slot][1]}`;
  const id = 'u' + (++uid);
  const p = { id, type: 'req', by: 'me', ago: 'à l’instant', hood, fam: a.fam, need: a.need, title: a.need === 'autre' ? (text.length > 48 ? text.slice(0, 46).trim() + '…' : text) : n[1], text, when, date: d,
    dur: 'À préciser par message', zone: pr ? `Près de chez ${pr.nick}, dans ${hood}` : 'Près de chez vous', offers: [], status: 'open', likes: 0, seed: uid, comments: [], proche: pr ? pr.id : null, forWho: pr ? `Pour ${pr.nick}` : '' };
  S.posts.unshift(p); S.stack = []; S.tab = 'accueil'; S.filter = 'tout';
  ok({ title: 'Votre demande est envoyée', text: pr && hood !== S.hood ? `Elle est publiée dans ${esc(hood)}, le quartier de ${esc(pr.nick)}. Vous la retrouvez dans « Mes demandes ».` : '',
    steps: ['Les voisins du quartier sont prévenus.', 'Dès qu’un voisin propose son aide, vous recevez une notification. C’est vous qui choisissez qui vient.', 'Sans réponse après un jour, nous relançons discrètement les voisins proches.', 'Personne ne voit depuis quand vous attendez.'],
    btns: [['Voir ma demande', 'go:post:' + id, 'primary'], ['Fermer', 'closeSheet', 'ghost']] });
  simulateOffer(p, 6500);
};
/* Tout est simulé : un voisin propose son aide quelques secondes après une nouvelle demande. */
function simulateOffer(p, delay) {
  setTimeout(() => {
    if (p.status !== 'open' || S.phase !== 'app' || !S.posts.includes(p)) return;
    const tried = p.offers.map(o => o.by);
    const who = [HELPERS[p.need], 'sophie', 'marcandre', 'nadia', 'paul'].find(x => x && !tried.includes(x) && !S.blocked.includes(x));
    if (!who) return;
    p.offers.push({ by: who, type: 'gratuite', status: 'pending' });
    notify({ icon: 'hand', tone: 'rose', title: `${first(who)} peut vous aider`, text: `Pour votre demande : ${p.title}.`, go: `trust:${p.id}:${who}` });
    banner({ av: avatar(who, 40), title: `${first(who)} peut vous aider`, text: esc(p.title), go: `trust:${p.id}:${who}` });
  }, delay);
}

/* ---------- proposer son aide ---------- */
A.offer = id => gate(() => { S.f.offerType = ''; S.sheets = []; sheet('offer', { id }); });
SHEETS.offer = ({ id }) => {
  const p = post(id), t = S.f.offerType;
  return sh(`Aider ${first(p.by)}`, `
    <div class="mini">${avatar(p.by, 44)}<span><b>${esc(p.title)}</b><small>${P[p.by].name}</small></span></div>
    <div class="kvs">${kv('cal', 'Quand', p.when)}${kv('pin', 'Distance', distTxt(P[p.by].dist))}</div>
    ${note('info', `Rien n’est engagé tant qu’${il(p.by)} n’a pas accepté.`)}
    <h3 class="h4">Votre aide est…</h3>
    <div class="opts" role="radiogroup">${Object.keys(HELP_TYPES).map(k => `<button class="opt${t === k ? ' on' : ''}" data-a="offerType:${k}" role="radio" aria-checked="${t === k}"><span class="radio"></span><span class="opt-b"><b>${HELP_TYPES[k]}</b><small>${HELP_SUB[k]}</small></span></button>`).join('')}</div>`,
    btn('Proposer mon aide', 'sendOffer:' + id, 'primary', dis(!!t)));
};
A.offerType = t => { S.f.offerType = t; render(); };
function ensureConv(who, postId) {
  let c = S.convs.find(x => x.with === who);
  if (!c) { c = { id: 'c_' + who, with: who, online: false, unread: 0, time: 'À l’instant', msgs: [], quick: ['Bonjour !', 'Êtes-vous disponible ?', 'Merci beaucoup'], reply: `Bonjour ${P.me.first} ! Avec plaisir.` }; S.convs.unshift(c); }
  if (postId) c.post = postId;
  return c;
}
A.sendOffer = id => {
  const p = post(id), t = S.f.offerType; if (!t) return;
  p.offers.push({ by: 'me', type: t, status: 'pending' });
  const who = p.by, Il = cap(il(who));
  ok({ title: 'Votre aide est proposée', steps: [`${first(who)} reçoit une notification.`, `${Il} peut voir votre fiche et vous écrire avant de décider.`, `Rien n’est engagé tant qu’${il(who)} n’a pas accepté.`] });
  setTimeout(() => {
    const o = p.offers.find(x => x.by === 'me');
    if (!o || o.status !== 'pending' || p.status !== 'open' || S.phase !== 'app' || S.blocked.includes(who)) return;
    o.status = 'accepted'; p.status = 'matched';
    const c = ensureConv(who, p.id);
    c.msgs.push({ from: who, t: 'À l’instant', text: 'Merci beaucoup ! Je vous écris ici pour vous donner mon adresse.' }); c.unread++; c.time = 'À l’instant';
    S.convs = [c, ...S.convs.filter(x => x !== c)];
    notify({ icon: 'check', tone: 'green', title: `${first(who)} a accepté votre aide`, text: `${p.title}. ${p.when}.`, go: 'go:post:' + p.id });
    banner({ av: avatar(who, 40), title: `${first(who)} a accepté votre aide`, text: p.when, go: 'go:post:' + p.id });
  }, 8000);
};

/* ---------- choisir qui vient : le panneau de confiance ---------- */
A.trust = (id, by) => { S.f.present = false; S.sheets = []; S.banner = null; sheet('trust', { id, by }); };
SHEETS.trust = ({ id, by }) => {
  const p = post(id), u = P[by], o = p && p.offers.find(x => x.by === by);
  if (!p || !o || o.status !== 'pending') return sh(u.name, `<p class="muted">Cette proposition n’est plus en attente.</p>`, btn('Fermer', 'closeSheet', 'soft'));
  const pr = procheOf(p.proche), th = u.thanks[0];
  return sh('', `
    <div class="trust-top">${avatar(by, 88)}<h2>${u.name}</h2><p class="muted">propose son aide pour « ${esc(p.title)} »</p></div>
    <div class="kvs">
      ${kv('hand', 'Type d’aide déclaré', HELP_TYPES[o.type])}
      ${kv('cal', 'Ancienneté', `Membre depuis ${u.since}`)}
      ${kv('check', 'Compte', 'Courriel et téléphone confirmés')}
      ${kv('heart', 'Mercis reçus', `${u.mercis} mercis`)}
      ${kv('pin', 'Distance', pr && p.hood !== S.hood ? `Dans le quartier de ${esc(pr.nick)}` : distTxt(u.dist))}
      ${kv('users', 'Dans le quartier', knownTxt(by))}
    </div>
    ${th ? `<blockquote class="qb"><p>« ${esc(th[1])} »</p><footer>${avatar(th[0], 24)} ${th[0] === 'me' ? P.me.first : first(th[0])}</footer></blockquote>` : ''}
    ${note('receipt', 'L’argent se règle entre vous. Si un montant est prévu, convenez-en avant. Entre Voisins ne prend aucune commission et ne gère aucun paiement.')}
    ${pr ? check('Je serai sur place, ou joignable par téléphone, à la première visite.', 'togglePresent', S.f.present) + `<p class="small muted">La note « bon à savoir » sur ${esc(pr.nick)} est envoyée à ${u.first} seulement si vous acceptez son aide.</p>` : ''}
    <button class="lnk" data-a="go:profile:${by}">Voir sa fiche complète</button>`,
    btn('Accepter son aide', `accept:${id}:${by}`, 'primary', dis(!pr || S.f.present)) + btn('Lui écrire d’abord', `write:${by}:${id}`, 'soft') + btn('Non merci', `refuse:${id}:${by}`, 'ghost'));
};
A.togglePresent = () => { S.f.present = !S.f.present; render(); };
A.accept = (id, by) => {
  const p = post(id), pr = procheOf(p.proche);
  p.offers.forEach(o => { o.status = o.by === by ? 'accepted' : (o.status === 'pending' ? 'refused' : o.status); });
  p.status = 'matched';
  const c = ensureConv(by, id);
  if (pr && pr.note) c.msgs.push({ from: 'me', t: 'À l’instant', text: `Bon à savoir sur ${pr.nick} : ${pr.note}` });
  S.notifs.forEach(n => { if (n.go === `trust:${id}:${by}`) { n.isNew = false; n.go = 'go:post:' + id; } });
  const steps = ['Le rendez-vous est inscrit dans votre agenda.', 'La veille, vous recevez un rappel avec les conseils de prudence.', `Votre conversation avec ${first(by)} est ouverte, avec le rappel de la demande.`];
  if (pr && pr.note) steps.push(`La note « bon à savoir » sur ${esc(pr.nick)} est envoyée à ${first(by)}.`);
  ok({ title: `C’est entendu avec ${first(by)}`, text: p.when, steps, tip: true, btns: [[`Écrire à ${first(by)}`, `write:${by}:${id}`, 'primary'], ['Fermer', 'closeSheet', 'ghost']] });
};
A.refuse = (id, by) => {
  const p = post(id), o = p.offers.find(x => x.by === by); if (o) o.status = 'refused';
  S.notifs.forEach(n => { if (n.go === `trust:${id}:${by}`) { n.isNew = false; n.go = 'go:post:' + id; } });
  S.sheets = []; render(); toast(`${first(by)} reçoit un mot gentil. Votre demande reste ouverte.`);
  simulateOffer(p, 7000);
};
A.write = (who, postId) => gate(() => {
  if (S.blocked.includes(who)) { S.sheets = []; render(); return toast(`Vos échanges avec ${first(who)} sont coupés.`); }
  const c = ensureConv(who, postId); S.sheets = []; push('conv', { id: c.id });
});

/* ---------- la fin : « C’est fait », puis merci ---------- */
A.done = id => { S.f.merci = ''; S.f.showMerci = false; S.sheets = []; sheet('done', { id, step: 1 }); };
V.merci = () => (S.f.merci || '').trim().length >= 2;
SHEETS.done = p => {
  const q = post(p.id), by = q.offers.find(o => o.status === 'accepted').by;
  if (p.step === 1) return sh('L’aide a bien eu lieu ?', `<div class="mini">${avatar(by, 44)}<span><b>${first(by)} devait vous aider</b><small>${esc(q.title)} · ${q.when}</small></span></div>`,
    btn('Oui, c’est fait', 'doneYes') + btn('Pas encore', 'closeSheet', 'soft') + btn('Signaler un problème', 'report:' + by, 'ghost'));
  return sh(`Dire merci à ${first(by)}`, `
    ${field('Votre mot', 'merci', { area: true, rows: 3, ph: `Un mot pour ${first(by)}, en toute simplicité.`, max: 200, count: true })}
    ${check('Afficher mon merci dans le fil du quartier', 'toggleShowMerci', S.f.showMerci)}
    ${note('heart', `Votre merci s’ajoute à la fiche de ${first(by)}. Il n’y a ni note ni étoiles.`)}`,
    btn('Envoyer mon merci', 'sendMerci:' + p.id, 'primary', 'data-v="merci"') + btn('Terminer sans écrire', 'finishDone:' + p.id, 'ghost'));
};
A.doneYes = () => { S.sheets[S.sheets.length - 1].p.step = 2; render(); };
A.toggleShowMerci = () => { S.f.showMerci = !S.f.showMerci; render(); };
function closeReq(id) { const p = post(id); p.status = 'done'; S.me.received++; return p.offers.find(o => o.status === 'accepted').by; }
A.sendMerci = id => {
  if (!V.merci()) return;
  const by = closeReq(id), text = S.f.merci.trim(), show = S.f.showMerci;
  P[by].mercis++; P[by].thanks.unshift(['me', text]);
  if (show) S.posts.unshift({ id: 'u' + (++uid), type: 'merci', by: 'me', to: by, ago: 'à l’instant', hood: S.hood, text, likes: 0, comments: [] });
  ok({ title: `Merci envoyé à ${first(by)}`, text: show ? 'Il est sur sa fiche et dans le fil du quartier.' : 'Il est sur sa fiche.', steps: [`Votre demande est fermée : « Pris en charge par ${first(by)} ».`, `${first(by)} reçoit votre merci tout de suite.`] });
};
A.finishDone = id => { closeReq(id); S.sheets = []; render(); toast('Votre demande est terminée.'); };

/* ---------- un signalement juste ---------- */
A.report = id => { S.sheets = []; sheet('report', { id }); };
SHEETS.report = ({ id }) => sh('Quelque chose vous inquiète ?', `
  <a class="sos" href="tel:911">${ic('alert', 24)}<span><b>En danger maintenant ? Appelez le 911</b><small>Entre Voisins n’est pas un service d’urgence.</small></span></a>
  <div class="list">
    ${row('flag', `Signaler ${first(id)} à l’équipe`, 'Vos échanges sont coupés tout de suite.', `doReport:${id}:team`)}
    ${row('receipt', 'On m’a demandé de l’argent sans prévenir', 'L’équipe est avertie. Vos échanges sont coupés.', `doReport:${id}:money`)}
    ${row('ban', 'Seulement ne plus recevoir ses messages', 'Sans signalement à l’équipe.', `doReport:${id}:mute`)}
  </div>
  <p class="small muted">Une personne de l’équipe lit chaque signalement. Aucun compte n’est suspendu automatiquement.</p>`);
A.doReport = (id, kind) => {
  if (!S.blocked.includes(id)) S.blocked.push(id);
  if (kind === 'mute') return ok({ title: `Vous ne recevrez plus les messages de ${first(id)}`, text: 'Aucun signalement n’a été fait. Vous pouvez revenir sur ce choix dans « Courriel et téléphone ».' });
  ok({ title: 'Votre signalement est envoyé', steps: [`Vos échanges avec ${first(id)} sont coupés dès maintenant.`, 'Une personne de l’équipe le regarde d’ici un jour ouvrable.', 'Aucun compte n’est suspendu automatiquement : c’est une personne de l’équipe qui décide.', `${first(id)} ne saura pas d’où vient le signalement.`] });
};
A.reportPost = id => {
  post(id).hidden = true; S.stack = S.stack.filter(s => !(s.name === 'post' && s.p.id === id));
  ok({ title: 'Publication signalée', steps: ['Elle a disparu de votre fil.', 'Une personne de l’équipe la regarde d’ici un jour ouvrable.', 'Aucun compte n’est suspendu automatiquement.', 'La personne qui l’a publiée ne saura pas d’où vient le signalement.'] });
};
