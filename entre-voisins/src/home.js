/* =====================================================================
   Navigation, accueil, fil et publications
   ===================================================================== */
function vTabbar() {
  const unread = S.convs.reduce((n, c) => n + c.unread, 0);
  const t = (id, icon, label, badge = '') => `<button class="tab${S.tab === id ? ' on' : ''}" data-a="tab:${id}" ${S.tab === id ? 'aria-current="page"' : ''}><span class="tab-i">${ic(icon, 24)}${badge}</span><span>${label}</span></button>`;
  return t('accueil', 'home', 'Accueil')
    + t('messages', 'chat', 'Messages', unread ? `<i class="dot">${unread}</i>` : '')
    + `<button class="tab tab-plus" data-a="publish" aria-label="Publier"><span class="plus">${ic('plus', 28)}</span><span>Publier</span></button>`
    + t('activites', 'cal', 'Activités')
    + t('moi', 'user', 'Moi', S.reg.later && !S.reg.done ? '<i class="dot red" aria-label="Inscription à compléter"></i>' : '');
}

/* ---------- le fil ---------- */
const isOpen = p => p.type === 'req' && p.status === 'open';
const visible = p => !p.hidden && !['cancelled', 'removed', 'filled'].includes(p.status) && (p.type === 'job' || p.hood === S.hood);
function feed(f) {
  let a = S.posts.filter(visible);
  if (f === 'demandes') a = a.filter(isOpen);
  if (f === 'quartier') a = a.filter(p => ['news', 'merci', 'offer'].includes(p.type));
  if (f === 'emploi') a = a.filter(p => p.type === 'job');
  const rank = p => (p.type === 'req' && (p.status === 'open' || (p.status === 'matched' && (p.by === 'me' || p.offers.some(o => o.by === 'me'))))) ? 0 : p.type === 'merci' ? 1 : 2;
  return a.map((p, i) => [p, i]).sort((x, y) => rank(x[0]) - rank(y[0]) || x[1] - y[1]).map(x => x[0]);
}
const ROUNDS = [['tout', 'Tout', 'grid', 'grey'], ['demandes', 'Demandes', 'hand', 'rose'], ['services', 'Services', 'tool', 'orange'], ['quartier', 'Quartier', 'houses', 'blue'], ['emploi', 'Emploi', 'case', 'green'], ['sorties', 'Sorties', 'cal', 'mauve']];
A.round = id => {
  if (id === 'services') return push('services');
  if (id === 'sorties') { S.tab = 'activites'; S.act = 'events'; return render(); }
  S.filter = id; render();
};
TABS.accueil = () => {
  const nNew = S.notifs.filter(n => n.isNew).length, nReq = feed('demandes').length, demo = S.hood === DEMO_HOOD;
  const posts = feed(S.filter);
  const rounds = ROUNDS.map(([id, label, icon, color]) => `<button class="round r-${color}${S.filter === id ? ' on' : ''}" data-a="round:${id}"><span class="ring"><span class="rdisc">${ic(icon, 28)}</span>${id === 'demandes' && nReq ? `<i class="dot">${nReq}</i>` : ''}</span><span class="lbl">${label}</span></button>`).join('');
  const soon = `<section class="soon"><header><h2>Bientôt dans le quartier</h2><button class="lnk" data-a="round:sorties">Tout voir</button></header><div class="hscroll" data-k="soon">${S.events.filter(e => !e.removed).slice().sort((a, b) => a.d - b.d).slice(0, 5).map(e => { const d = day(e.d); return `<button class="soon-t" data-a="go:event:${e.id}"><span class="soon-d"><small>${JOURS_C[d.getDay()]}</small><b>${d.getDate()}</b><small>${MOIS_C[d.getMonth()]}</small></span><span class="soon-b"><b>${esc(e.title)}</b><small>${e.time}</small></span></button>`; }).join('')}</div></section>`;
  let list = '';
  posts.forEach((p, i) => { list += card(p); if (i === 0 && S.filter === 'tout' && demo) list += soon; });
  const quiet = !demo && S.filter !== 'emploi'
    ? `<div class="quiet"><div class="quiet-art">${houses(31, { w: 360, h: 120, sky: 'snow' })}</div><b>Le fil de ${esc(S.hood)} est encore tranquille</b><p>Soyez la première personne à demander ou à offrir un coup de main. Les offres d’emploi, elles, sont visibles dans tous les quartiers.</p>${btn('Voir le Vieux-Limoilou, le quartier de la démonstration', 'setHood:' + DEMO_HOOD, 'soft')}</div>` : '';
  const none = !posts.length && (demo || S.filter === 'emploi') ? empty(S.filter === 'demandes' ? 'hand' : 'houses', S.filter === 'demandes' ? 'Aucune demande ouverte' : 'Rien ici pour l’instant', S.filter === 'demandes' ? 'Tous les voisins ont trouvé de l’aide. Revenez un peu plus tard.' : 'Les nouvelles publications apparaîtront ici.') : '';
  return `<div class="scroll" data-k="home">
    <header class="home-h">
      <button class="hood-btn" data-a="go:hood"><small>Mon quartier</small><span>${esc(S.hood)}${ic('down', 20)}</span></button>
      <button class="ibtn ring-btn" data-a="go:notifs" aria-label="Notifications${nNew ? `, ${nNew} nouvelles` : ''}">${ic('bell', 22)}${nNew ? `<i class="dot">${nNew}</i>` : ''}</button>
    </header>
    ${demo ? `<p class="pulse">${heartFull(13)} 38 coups de main ce mois-ci</p>` : ''}
    ${S.welcome ? `<div class="welcome"><div><b>Bienvenue, ${P.me.first} !</b><p>Ici, on se donne des coups de main entre voisins. Lisez le fil, ou dites-nous de quoi vous avez besoin.</p></div><button class="ibtn sm" data-a="closeWelcome" aria-label="Fermer le message de bienvenue">${ic('x', 18)}</button></div>` : ''}
    <button class="askbar" data-a="publish">${avatar('me', 38)}<span>De quoi avez-vous besoin ?</span><i>${ic('plus', 18)}</i></button>
    <nav class="rounds hscroll" data-k="rounds" aria-label="Filtrer le fil">${rounds}</nav>
    <div class="feed">${quiet}${list}${none}${posts.length ? `<p class="uptodate">${ic('check', 16)} Vous êtes à jour</p>` : ''}</div>
  </div>`;
};
A.closeWelcome = () => { S.welcome = false; store.set('welcome', '0'); render(); };
A.setHood = h => { S.hood = h; store.set('hood', h); S.filter = 'tout'; S.stack = []; render(); toast(`Vous regardez maintenant ${h}.`); };

/* ---------- les cartes ---------- */
function author(p) {
  if (p.type === 'job') {
    const b = BIZ[p.biz] || { name: p.bizName, kind: 'Commerce ou organisme', color: '#178A5E' };
    return { name: b.name, sub: b.kind, av: s => `<span class="av biz" style="--s:${s}px;background:${b.color}">${ic('store', Math.round(s * .520))}</span>`, go: '' };
  }
  return { name: P[p.by].name, av: s => avatar(p.by, s), go: 'go:profile:' + p.by };
}
function tagOf(p) {
  if (p.type === 'req') { const n = needOf(p.fam, p.need); return [p.fam === 'proche' ? 'Pour un proche' : 'Coup de main', n[1], n[2]]; }
  if (p.type === 'job') return ['Offre d’emploi', p.job.kind, 'case'];
  if (p.type === 'event') return ['Événement', '', 'cal'];
  if (p.type === 'news') return ['Nouvelle du quartier', '', 'news'];
  if (p.type === 'offer') return ['Offre d’aide', HELP_TYPES[p.help], 'hand'];
  return ['', '', ''];
}
const distOf = p => p.by === 'me' ? '' : distTxt(p.type === 'job' ? 0 : P[p.by].dist);
const evWhen = e => `${cap(fLong(day(e.d)))}, ${e.time}`;
function reqState(p) {
  const mine = p.by === 'me', acc = p.offers.find(o => o.status === 'accepted'), pend = p.offers.filter(o => o.status === 'pending'), my = p.offers.find(o => o.by === 'me');
  if (p.status === 'done') return { info: `<div class="state done">${ic('check', 16)}<span>Pris en charge par ${first(acc.by)}</span></div>`, main: '' };
  if (mine) {
    if (acc) return { info: `<div class="state ok">${avatar(acc.by, 30)}<span><b>${first(acc.by)} vient vous aider</b><small>${p.when}</small></span></div>`, main: `<button class="btn primary grow" data-a="done:${p.id}">${ic('check', 18)} C’est fait</button><button class="btn soft" data-a="write:${acc.by}:${p.id}">Écrire</button>` };
    if (pend.length) { const o = pend[0]; return { info: `<div class="state offer">${avatar(o.by, 30)}<span><b>${first(o.by)} peut vous aider</b><small>Aide ${lc(HELP_TYPES[o.type])}</small></span></div>`, main: `<button class="btn primary grow" data-a="trust:${p.id}:${o.by}">Voir qui est ${first(o.by)}</button><button class="btn ghost" data-a="cancelPost:${p.id}">Annuler</button>` }; }
    return { info: `<div class="state wait">${ic('bell', 16)}<span>Vos voisins sont prévenus.</span></div>`, main: `<button class="btn ghost" data-a="cancelPost:${p.id}">Annuler</button>` };
  }
  if (my) {
    if (my.status === 'accepted') return { info: `<div class="state ok">${ic('check', 16)}<span><b>${first(p.by)} a accepté votre aide</b><small>${p.when}</small></span></div>`, main: `<button class="btn primary grow" data-a="write:${p.by}:${p.id}">Écrire à ${first(p.by)}</button>` };
    return { info: `<div class="state wait">${ic('check', 16)}<span>Aide proposée. Rien n’est engagé tant qu’${il(p.by)} n’a pas accepté.</span></div>`, main: '' };
  }
  return { info: '', main: `<button class="btn primary grow" data-a="offer:${p.id}">${ic('hand', 18)} Je peux aider</button>` };
}
function mainAct(p) {
  const mine = p.by === 'me' || p.mine;
  if (p.type === 'req') return reqState(p);
  if (p.type === 'job') return { info: '', main: mine ? `<button class="btn soft grow" data-a="filled:${p.id}">${ic('check', 18)} Poste comblé</button>` : `<button class="btn primary grow" data-a="reply:${p.id}">Répondre à l’annonce</button>` };
  if (p.type === 'event') { const e = evt(p.ev); return { info: '', main: `<button class="btn ${e.mine ? 'soft' : 'primary'} grow" data-a="going:${e.id}">${e.mine ? ic('check', 18) + ' J’y vais' : 'J’y vais'}</button>${mine ? `<button class="btn ghost" data-a="removePost:${p.id}">Retirer</button>` : ''}` }; }
  if (p.type === 'offer') return { info: '', main: `<button class="btn primary grow" data-a="write:${p.by}">Écrire à ${first(p.by)}</button>` };
  return { info: '', main: `<button class="act like${p.liked ? ' on' : ''}" data-a="like:${p.id}" aria-pressed="${!!p.liked}">${p.liked ? heartFull(20) : ic('heart', 20)}<span>J’aime${p.likes ? ` · ${p.likes}` : ''}</span></button>${mine ? `<button class="btn ghost" data-a="removePost:${p.id}">Retirer</button>` : ''}<span class="grow"></span>` };
}
function cardHead(p, s = 40) {
  const a = author(p), mine = p.by === 'me' || p.mine;
  const menu = `<button class="ibtn sm" data-a="postMenu:${p.id}" aria-label="Plus d’options">${ic('more', 20)}</button>`;
  if (p.type === 'merci') return `<header class="card-h"><span class="duo">${avatar(p.by, s)}${avatar(p.to, s)}<i>${heartFull(12)}</i></span><div class="who"><b>${first(p.by)} remercie ${first(p.to)}</b><small>${p.ago}</small></div>${menu}</header>`;
  return `<header class="card-h"><button class="avb" data-a="${a.go || 'noop'}" aria-label="Voir la fiche de ${esc(a.name)}">${a.av(s)}</button><div class="who"><b>${esc(a.name)}</b><small>${[a.sub, p.ago, mine ? 'Votre publication' : distOf(p)].filter(Boolean).join(' · ')}</small></div>${menu}</header>`;
}
const tagHTML = p => { const [t1, t2, ti] = tagOf(p); return t1 ? `<span class="tag">${ic(ti, 14)}<span>${t1}${t2 ? ` · ${t2}` : ''}</span></span>` : ''; };
function card(p) {
  const n = p.comments.length, long = p.text.length > 150, exp = S.expanded[p.id];
  const detail = ['req', 'job', 'event'].includes(p.type);
  const goDetail = p.type === 'event' ? 'go:event:' + p.ev : 'go:post:' + p.id;
  const more = detail ? `<button class="lnk" data-a="${goDetail}">Voir les détails</button>` : (long && !exp ? `<button class="lnk" data-a="expand:${p.id}">Voir plus</button>` : '');
  const meta = p.type === 'req' ? `<p class="meta">${ic('cal', 15)}<span>${p.when}</span></p>` : p.type === 'event' ? `<p class="meta">${ic('cal', 15)}<span>${evWhen(evt(p.ev))}</span></p>` : '';
  const st = mainAct(p);
  return `<article class="card t-${p.type}${p.status === 'done' ? ' closed' : ''}">
    ${cardHead(p)}
    ${tagHTML(p)}
    ${p.title ? `<h3 class="card-t">${esc(p.title)}</h3>` : ''}${p.forWho ? `<p class="for">${ic('heart', 15)}<span>${esc(p.forWho)}</span></p>` : ''}
    <p class="card-x${exp ? '' : ' clamp'}${p.type === 'merci' ? ' quote' : ''}">${p.type === 'merci' ? '« ' : ''}${esc(p.text)}${p.type === 'merci' ? ' »' : ''}</p>
    ${more}${meta}${st.info}
    <div class="acts">${st.main || '<span class="grow"></span>'}<button class="act" data-a="go:post:${p.id}:c" aria-label="Commenter${n ? `, ${n} commentaires` : ''}">${ic('chat', 20)}${n ? `<span>${n}</span>` : ''}</button><button class="act" data-a="share:${p.id}" aria-label="Partager">${ic('share', 20)}</button></div>
  </article>`;
}
A.expand = id => { S.expanded[id] = true; render(); };
A.like = id => gate(() => { const p = post(id); p.liked = !p.liked; p.likes += p.liked ? 1 : -1; render(); });
A.going = id => gate(() => { const e = evt(id); e.mine = !e.mine; e.going += e.mine ? 1 : -1; render(); toast(e.mine ? 'C’est noté. L’activité est dans votre agenda.' : 'Votre inscription à cette activité est retirée.'); });

/* ---------- menu « … », partage, retrait ---------- */
SHEETS.postMenu = ({ id }) => {
  const p = post(id), mine = p.by === 'me' || p.mine;
  const rows = mine
    ? row('trash', p.type === 'req' ? 'Annuler ma demande' : p.type === 'job' ? 'Marquer le poste comme comblé' : 'Retirer ma publication', '', p.type === 'req' ? 'cancelPost:' + id : p.type === 'job' ? 'filled:' + id : 'removePost:' + id)
    : row('flag', 'Signaler cette publication', 'Elle disparaît de votre fil. L’équipe la regarde.', 'reportPost:' + id) + (p.by ? row('alert', `Quelque chose vous inquiète au sujet de ${first(p.by)} ?`, '', 'report:' + p.by) : '');
  return sh('Cette publication', `<div class="list">${rows}${row('share', 'Partager', '', 'share:' + id)}</div>`);
};
A.postMenu = id => sheet('postMenu', { id });
SHEETS.share = ({ id }) => sh('Partager', `<p class="muted">Envoyez cette publication à un voisin, ou copiez son lien.</p>
  <div class="hscroll people" data-k="shp">${NEIGHBOURS.map(n => `<button class="person" data-a="shareTo:${n}">${avatar(n, 56)}<span>${first(n)}</span></button>`).join('')}</div>
  <div class="list">${row('link', 'Copier le lien', '', 'copyLink:' + id)}</div>`);
A.share = id => { S.sheets = []; sheet('share', { id }); };
A.shareTo = n => gate(() => { S.sheets = []; render(); toast(`Publication envoyée à ${first(n)}.`); });
A.copyLink = id => {
  const done = () => { S.sheets = []; render(); toast('Lien copié.'); };
  try { navigator.clipboard.writeText('https://entrevoisins.example/p/' + id).then(done, done); } catch (e) { done(); }
};
A.cancelPost = id => sheet('sure', { title: 'Annuler votre demande ?', text: 'Elle disparaît du fil. Les voisins qui ont proposé leur aide sont prévenus avec un mot gentil.', yes: 'Oui, annuler ma demande', act: 'doCancel:' + id });
A.doCancel = id => { post(id).status = 'cancelled'; S.sheets = []; S.stack = S.stack.filter(s => !(s.name === 'post' && s.p.id === id)); render(); toast('Votre demande est annulée.'); };
A.removePost = id => { post(id).status = 'removed'; S.sheets = []; S.stack = S.stack.filter(s => !(s.name === 'post' && s.p.id === id)); render(); toast('Votre publication est retirée.'); };
A.filled = id => { post(id).status = 'filled'; S.sheets = []; S.stack = S.stack.filter(s => !(s.name === 'post' && s.p.id === id)); render(); toast('Poste comblé. L’annonce est retirée du fil.'); };
SHEETS.sure = p => sh(p.title, `<p>${p.text}</p>`, btn(p.yes, p.act, p.danger ? 'danger' : 'primary') + btn('Non, revenir', 'closeSheet', 'ghost'));
const tipNote = () => `<button class="note tip" data-a="go:tips">${ic('shield', 18)}<span><b>Avant une première rencontre</b><small>Échangez quelques messages, rencontrez-vous dehors, prévenez un proche.</small></span>${ic('right', 16)}</button>`;
SHEETS.ok = p => sh('', `<div class="okk"><span class="okc">${ic('check', 30)}</span><h2>${p.title}</h2>${p.text ? `<p>${p.text}</p>` : ''}</div>${p.steps ? `<h3 class="h4">Ce qui se passe maintenant</h3><ol class="steps">${p.steps.map(s => `<li>${s}</li>`).join('')}</ol>` : ''}${p.tip ? tipNote() : ''}`,
  (p.btns || [['Fermer', 'closeSheet', 'primary']]).map(b => btn(b[0], b[1], b[2] || 'soft')).join(''));
const ok = p => { S.sheets = []; sheet('ok', p); };

/* ---------- fiche d’une publication ---------- */
function commentsBlock(p) {
  return `<section class="cmts" id="cm-${p.id}"><h3 class="h4">Commentaires${p.comments.length ? ` · ${p.comments.length}` : ''}</h3>
    ${p.comments.length ? p.comments.map(c => `<div class="cmt">${avatar(c.by, 32)}<div><b>${c.by === 'me' ? P.me.name : P[c.by].name}</b><p>${esc(c.text)}</p><small>${c.ago}</small></div></div>`).join('') : `<p class="muted small">Aucun commentaire pour l’instant.</p>`}
    <div class="composer in"><input class="inp" data-f="cm.${p.id}" value="${esc(S.f['cm.' + p.id] || '')}" placeholder="Écrire un commentaire" aria-label="Écrire un commentaire" data-enter="comment:${p.id}" autocomplete="off"><button class="ibtn fill" data-a="comment:${p.id}" aria-label="Envoyer">${ic('send', 18)}</button></div></section>`;
}
A.comment = id => {
  const t = (S.f['cm.' + id] || '').trim(); if (!t) return;
  gate(() => { post(id).comments.push({ by: 'me', text: t, ago: 'à l’instant' }); S.f['cm.' + id] = ''; render(); });
};
SCREENS.post = ({ id }) => {
  const p = post(id);
  if (!p || !visible(p) && p.by !== 'me') return bar('Publication') + `<div class="scroll">${empty('houses', 'Cette publication n’est plus en ligne', 'Elle a été retirée ou le besoin est comblé.')}</div>`;
  const a = author(p), st = mainAct(p), mine = p.by === 'me' || p.mine;
  const menu = `<button class="ibtn" data-a="postMenu:${p.id}" aria-label="Plus d’options">${ic('more')}</button>`;
  let body = '', foot = '', title = 'Publication';
  if (p.type === 'req') {
    title = 'Demande d’aide';
    const u = P[p.by], offs = p.offers.filter(o => o.status !== 'refused');
    body = `<button class="pers" data-a="go:profile:${p.by}">${avatar(p.by, 52)}<span><b>${u.name}</b><small>Membre depuis ${u.since} · ${heartFull(11)} ${stat(p.by, 'mercis')} mercis</small></span>${ic('right', 18)}</button>
      ${tagHTML(p)}<h2 class="h2">${esc(p.title)}</h2>${p.forWho ? `<p class="for">${ic('heart', 15)} ${esc(p.forWho)}</p>` : ''}<p class="body">${esc(p.text)}</p>
      <div class="kvs">${kv('cal', 'Quand', p.when)}${kv('clock', 'Durée', p.dur)}${kv('pin', 'Zone de voisinage', `${p.zone}${mine ? '' : ' · ' + distTxt(u.dist)}`)}</div>
      <figure class="map">${mapSVG(p.seed || 4)}<figcaption>${ic('lock', 14)} Zone approximative. L’adresse n’est jamais affichée.</figcaption></figure>
      <section><h3 class="h4">Qui a offert son aide</h3>${offs.length ? offs.map(o => `<div class="offer-l">${avatar(o.by, 34)}<span><b>${o.by === 'me' ? 'Vous' : P[o.by].name}</b><small>Aide ${lc(HELP_TYPES[o.type])}${o.status === 'accepted' ? ' · acceptée' : ''}</small></span></div>`).join('') : `<p class="muted small">Personne pour l’instant.${mine ? '' : ' Vous pouvez être la première personne.'}</p>`}</section>
      <button class="note tip" data-a="go:tips">${ic('shield', 18)}<span><b>Avant une première rencontre</b><small>Échangez quelques messages, rencontrez-vous dehors, prévenez un proche.</small></span>${ic('right', 16)}</button>
      ${commentsBlock(p)}
      ${mine ? '' : `<button class="lnk danger" data-a="reportPost:${p.id}">${ic('flag', 15)} Signaler cette publication</button>`}`;
    foot = p.status === 'done' ? '' : (st.info + `<div class="acts">${st.main}${mine || p.offers.some(o => o.by === 'me' && o.status === 'accepted') ? '' : `<button class="btn soft${st.main ? '' : ' grow'}" data-a="write:${p.by}:${p.id}">${ic('chat', 18)} Écrire</button>`}</div>`);
  } else if (p.type === 'job') {
    title = 'Offre d’emploi';
    body = `<div class="pers">${a.av(52)}<span><b>${esc(a.name)}</b><small>${esc(a.sub)} · ${p.ago}</small></span></div>
      ${tagHTML(p)}<h2 class="h2">${esc(p.title)}</h2><p class="body">${esc(p.text)}</p>
      <div class="kvs">${kv('case', 'Type de poste', p.job.kind)}${p.job.pay ? kv('receipt', 'Salaire', esc(p.job.pay)) : ''}${kv('pin', 'Lieu', esc(p.job.place))}</div>
      ${note('houses', 'Les offres d’emploi sont visibles dans tous les quartiers, jusqu’à ce que le poste soit comblé.')}
      ${commentsBlock(p)}`;
    foot = `<div class="acts">${st.main}</div>`;
  } else {
    title = p.type === 'merci' ? 'Merci' : p.type === 'offer' ? 'Offre d’aide' : p.type === 'event' ? 'Événement' : 'Nouvelle du quartier';
    body = `<article class="card flat t-${p.type}">${cardHead(p, 44)}${tagHTML(p)}${p.title ? `<h2 class="h2">${esc(p.title)}</h2>` : ''}<p class="card-x${p.type === 'merci' ? ' quote' : ''}">${p.type === 'merci' ? '« ' : ''}${esc(p.text)}${p.type === 'merci' ? ' »' : ''}</p>${p.type === 'event' ? `<p class="meta">${ic('cal', 15)}<span>${evWhen(evt(p.ev))}</span></p><button class="lnk" data-a="go:event:${p.ev}">Voir l’événement</button>` : ''}<div class="acts">${st.main}</div></article>${commentsBlock(p)}`;
  }
  return bar(title, menu) + `<div class="scroll" data-k="post"><div class="pad stackv detail t-${p.type}">${body}</div></div>${foot ? `<footer class="foot">${foot}</footer>` : ''}`;
};

/* ---------- « De quoi avez-vous besoin ? » ---------- */
SHEETS.publish = () => sh('De quoi avez-vous besoin ?', `
  <div class="stackv">
    <button class="big r-rose" data-a="ask:main"><span class="big-i">${ic('hand', 26)}</span><span><b>Un coup de main</b><small>Pour vous, vite fait : déneiger, emprunter un outil, déplacer un meuble.</small></span>${ic('right', 18)}</button>
    <button class="big r-mauve" data-a="ask:proche"><span class="big-i">${ic('heart', 26)}</span><span><b>De l’aide pour un proche</b><small>Pour un parent ou une personne que vous aidez.</small></span>${ic('right', 18)}</button>
  </div>
  <h3 class="h4 sep">Ou publier autre chose</h3>
  <div class="list">
    ${row('news', 'Une nouvelle', 'Un objet à donner, un avis, une bonne adresse.', 'compose:news')}
    ${row('cal', 'Un événement', 'Une activité ouverte aux voisins.', 'compose:event')}
    ${row('case', 'Une offre d’emploi', 'Pour les commerces et les organismes. 20 $ plus taxes.', 'compose:job')}
  </div>`);
A.publish = () => { if (!S.sheets.some(s => s.name === 'publish')) sheet('publish'); };

/* ---------- publier une nouvelle, un événement, une offre d’emploi ---------- */
A.compose = kind => gate(() => { S.sheets = []; S.f = Object.assign(S.f, { 'n.title': '', 'n.text': '', 'e.title': '', 'e.place': '', 'e.desc': '', 'e.time': '', 'j.biz': '', 'j.title': '', 'j.pay': '', 'j.place': '', 'j.desc': '' }); S.compose = { kind: 'Temps partiel', tags: [], d: null }; push('compose', { id: kind }); });
V.news = () => (S.f['n.text'] || '').trim().length >= 5;
V.event = () => (S.f['e.title'] || '').trim().length >= 3 && S.compose.d != null && !!S.f['e.time'] && (S.f['e.place'] || '').trim().length >= 3;
V.job = () => (S.f['j.biz'] || '').trim().length >= 2 && (S.f['j.title'] || '').trim().length >= 3 && (S.f['j.place'] || '').trim().length >= 2 && (S.f['j.desc'] || '').trim().length >= 10 && (S.compose.kind === 'Bénévolat' || (S.f['j.pay'] || '').trim().length >= 1);
const HOURS = ['8 h', '9 h', '10 h', '11 h', '12 h', '13 h', '14 h', '15 h', '16 h', '17 h', '18 h', '19 h', '20 h'];
function dayStrip(sel, act, n = 21, from = 0) {
  return `<div class="hscroll days" data-k="days">${Array.from({ length: n }, (_, i) => { const k = i + from, d = day(k); return `<button class="dayb${sel === k ? ' on' : ''}" data-a="${act}:${k}" aria-pressed="${sel === k}"><small>${k === 0 ? 'auj.' : JOURS_C[d.getDay()]}</small><b>${d.getDate()}</b><small>${MOIS_C[d.getMonth()]}</small></button>`; }).join('')}</div>`;
}
SCREENS.compose = ({ id }) => {
  const c = S.compose;
  if (id === 'news') return bar('Une nouvelle') + `<div class="scroll" data-k="cp"><div class="pad stackv">
      ${field('Titre, si vous voulez', 'n.title', { ph: 'Poussette à donner', max: 60 })}
      ${field('Votre nouvelle', 'n.text', { area: true, rows: 5, ph: 'Dites-le simplement, comme à un voisin croisé sur le trottoir.', max: 500, count: true })}
      ${note('houses', `Visible par les membres inscrits de ${esc(S.hood)}.`)}
    </div></div><footer class="foot">${btn('Publier dans le quartier', 'postNews', 'primary', 'data-v="news"')}</footer>`;
  if (id === 'event') return bar('Un événement') + `<div class="scroll" data-k="cp"><div class="pad stackv">
      ${field('Nom de l’activité', 'e.title', { ph: 'Café-jasette', max: 60 })}
      <div class="field"><label>Quel jour ?</label>${dayStrip(c.d, 'evDay', 42, 1)}</div>
      <div class="field"><label>À quelle heure ?</label><div class="hscroll chips1" data-k="hrs">${HOURS.map(h => chip(h, 'evTime:' + h, S.f['e.time'] === h)).join('')}</div></div>
      ${field('Lieu', 'e.place', { ph: 'Centre communautaire, 2e Rue', max: 80, hint: 'Un lieu public, pas une adresse personnelle.' })}
      ${field('Description', 'e.desc', { area: true, rows: 4, ph: 'À quoi s’attendre, quoi apporter.', max: 400, count: true })}
      <div class="field"><label>Bon à savoir</label><div class="chips">${['Gratuit', 'Accès sans marches', 'Transport offert'].map(t => chip(t, 'evTag:' + t, c.tags.includes(t))).join('')}</div></div>
    </div></div><footer class="foot">${btn('Publier l’événement', 'postEvent', 'primary', 'data-v="event"')}</footer>`;
  return bar('Une offre d’emploi') + `<div class="scroll" data-k="cp"><div class="pad stackv">
      ${note('store', 'Réservée aux commerces et aux organismes, bénévolat compris. 20 $ plus taxes, payés une seule fois.')}
      ${field('Nom du commerce ou de l’organisme', 'j.biz', { ph: 'Le Fournil de la 3e', max: 50, hint: 'Obligatoire. Il devient l’auteur de l’annonce.' })}
      ${field('Titre du poste', 'j.title', { ph: 'Commis au comptoir', max: 60 })}
      <div class="field"><label>Type de poste</label><div class="chips">${['Temps partiel', 'Temps plein', 'Saisonnier', 'Bénévolat'].map(t => chip(t, 'jobKind:' + t, c.kind === t)).join('')}</div></div>
      ${c.kind === 'Bénévolat' ? '' : field('Salaire horaire', 'j.pay', { ph: '18,50 $ l’heure', max: 30 })}
      ${field('Lieu', 'j.place', { ph: '3e Avenue, Vieux-Limoilou', max: 60 })}
      ${field('Description', 'j.desc', { area: true, rows: 5, ph: 'Les tâches, l’horaire, ce que vous offrez.', max: 600, count: true })}
    </div></div><footer class="foot">${btn('Continuer', 'jobReview', 'primary', 'data-v="job"')}</footer>`;
};
A.evDay = k => { S.compose.d = +k; render(); };
A.evTime = h => { S.f['e.time'] = h; render(); };
A.evTag = t => { const a = S.compose.tags; a.includes(t) ? a.splice(a.indexOf(t), 1) : a.push(t); render(); };
A.jobKind = k => { S.compose.kind = k; render(); };
A.postNews = () => {
  if (!V.news()) return;
  S.posts.unshift({ id: 'u' + (++uid), type: 'news', by: 'me', ago: 'à l’instant', hood: S.hood, title: (S.f['n.title'] || '').trim(), text: S.f['n.text'].trim(), likes: 0, comments: [] });
  S.stack = []; S.tab = 'accueil'; S.filter = 'tout';
  ok({ title: 'Votre nouvelle est publiée', text: `Elle est dans le fil de ${esc(S.hood)}.` });
};
A.postEvent = () => {
  if (!V.event()) return;
  const id = 'x' + (++uid), c = S.compose;
  S.events.push({ id, title: S.f['e.title'].trim(), d: c.d, time: S.f['e.time'], place: S.f['e.place'].trim(), tags: c.tags.slice(), going: 1, org: 'me', who: ['me'], sky: 'dawn', seed: uid + 20, mine: true, own: true, desc: (S.f['e.desc'] || '').trim() || 'Les détails suivront.' });
  S.posts.unshift({ id: 'u' + (++uid), type: 'event', by: 'me', ago: 'à l’instant', hood: S.hood, ev: id, title: S.f['e.title'].trim(), text: (S.f['e.desc'] || '').trim() || 'Les détails suivront.', likes: 0, comments: [] });
  S.stack = []; S.tab = 'accueil'; S.filter = 'tout';
  ok({ title: 'Votre événement est publié', text: 'Il paraît dans le fil et dans l’onglet Activités.', steps: ['Vos voisins peuvent s’inscrire avec « J’y vais ».', 'Vous recevez un rappel la veille.'] });
};
SHEETS.jobPay = () => sh('Avant de publier', `
  <div class="price"><b>20 $</b><span>plus taxes, payés une seule fois</span></div>
  <ul class="ticks">
    <li>${ic('check', 16)}<span>Votre annonce est visible dans tous les quartiers.</span></li>
    <li>${ic('check', 16)}<span>Elle reste en ligne jusqu’à ce que le poste soit comblé.</span></li>
    <li>${ic('check', 16)}<span>Tous les 30 jours, nous vous demandons si l’annonce est toujours valide.</span></li>
    <li>${ic('check', 16)}<span>Sans réponse de votre part sous 7 jours, l’annonce est masquée. Vous la remettez en ligne sans payer de nouveau.</span></li>
    <li>${ic('check', 16)}<span>Un reçu part par courriel à ${esc(S.me.email)}.</span></li>
  </ul>
  <p class="hint">${ic('info', 16)}<span>Démonstration : aucun paiement réel n’est fait.</span></p>`,
  btn('Payer 20 $ plus taxes et publier', 'postJob') + btn('Revenir à l’annonce', 'closeSheet', 'ghost'));
A.jobReview = () => { if (V.job()) sheet('jobPay'); };
A.postJob = () => {
  const c = S.compose;
  S.posts.unshift({ id: 'u' + (++uid), type: 'job', mine: true, bizName: S.f['j.biz'].trim(), ago: 'à l’instant', hood: S.hood, title: S.f['j.title'].trim(), job: { kind: c.kind, pay: c.kind === 'Bénévolat' ? '' : S.f['j.pay'].trim(), place: S.f['j.place'].trim() }, text: S.f['j.desc'].trim(), likes: 0, comments: [] });
  S.stack = []; S.tab = 'accueil'; S.filter = 'tout';
  ok({ title: 'Votre annonce est en ligne', text: `Publiée au nom de ${esc(S.f['j.biz'].trim())}.`, steps: ['Elle est visible dans tous les quartiers.', `Un reçu de 20 $ plus taxes part à ${esc(S.me.email)}.`, 'Dans 30 jours, nous vous demandons si elle est toujours valide.', 'Quand le poste est comblé, touchez « Poste comblé ».'] });
};
A.reply = id => gate(() => {
  const p = post(id), cid = 'c_' + id; let c = conv(cid);
  if (!c) { const a = author(p); c = { id: cid, biz: p.biz || 'own', name: a.name, post: id, unread: 0, time: 'À l’instant', msgs: [], quick: ['Le poste est-il encore ouvert ?', 'Je suis disponible la fin de semaine', 'Comment faire pour postuler ?'], reply: 'Bonjour ! Oui, le poste est toujours ouvert. Passez nous voir quand vous voulez.' }; S.convs.unshift(c); }
  S.sheets = []; push('conv', { id: cid });
});
