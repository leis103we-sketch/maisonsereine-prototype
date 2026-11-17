/* =====================================================================
   Messages, activités, notifications et quartier
   ===================================================================== */
const convName = c => c.group || c.biz ? c.name : P[c.with].name;
const convAv = (c, s) => c.group ? disc('users', s, 'mauve') : c.biz ? `<span class="av biz" style="--s:${s}px;background:${(BIZ[c.biz] || { color: '#178A5E' }).color}">${ic('store', Math.round(s * .520))}</span>` : avatar(c.with, s);
function lastMsg(c) {
  const m = c.msgs[c.msgs.length - 1]; if (!m) return 'Nouvelle conversation';
  const who = m.from === 'me' ? 'Vous : ' : c.group ? first(m.from) + ' : ' : '';
  return who + (m.voice ? 'Message vocal' : m.photo ? 'Photo' : esc(m.text));
}
function convList() {
  const q = norm(S.f.msgq), list = S.convs.filter(c => !q || norm(convName(c)).includes(q));
  if (!list.length) return empty('chat', q ? 'Aucune conversation à ce nom' : 'Aucun message pour l’instant', q ? 'Essayez un autre prénom, ou écrivez à un nouveau voisin.' : 'Quand vous écrivez à un voisin, la conversation paraît ici.');
  return list.map(c => `<div class="swipe"><button class="swipe-del" data-a="delConv:${c.id}">${ic('trash', 20)}<span>Supprimer</span></button>
    <button class="conv-row swipe-row${c.unread ? ' unread' : ''}" data-a="go:conv:${c.id}">${convAv(c, 52)}<span class="conv-b"><b>${esc(convName(c))}</b><small>${lastMsg(c)}</small></span><span class="conv-m"><small>${c.time}</small>${c.unread ? `<i class="dot">${c.unread}</i>` : ''}</span></button></div>`).join('');
}
TABS.messages = () => `<header class="tab-h"><h1 class="h1">Messages</h1><button class="ibtn fill" data-a="newMsg" aria-label="Écrire à un voisin">${ic('edit', 20)}</button></header>
  <div class="scroll" data-k="msgs">
    <div class="searchbox">${ic('search', 18)}<input data-f="msgq" data-live="msgSearch" value="${esc(S.f.msgq || '')}" placeholder="Chercher un voisin" aria-label="Chercher un voisin" autocomplete="off"></div>
    <div id="conv-list">${convList()}</div>
    <p class="tiny muted center pad-s">Glissez une conversation vers la gauche pour la supprimer.</p>
  </div>`;
A.msgSearch = () => { const o = $('#conv-list'); if (o) o.innerHTML = fr(convList()); };
A.delConv = id => { S.convs = S.convs.filter(c => c.id !== id); render(); toast('Conversation supprimée.'); };
SHEETS.newMsg = () => sh('Écrire à un voisin', `<div class="list">${NEIGHBOURS.filter(n => !S.blocked.includes(n)).map(n => `<button class="row" data-a="write:${n}">${avatar(n, 44)}<span class="row-b"><b>${P[n].name}</b><small>${distTxt(P[n].dist)}</small></span>${ic('right', 18, 'row-c')}</button>`).join('')}</div>`);
A.newMsg = () => sheet('newMsg');

SCREENS.conv = ({ id }) => {
  const c = conv(id);
  if (!c) return bar('Conversation') + `<div class="scroll">${empty('chat', 'Conversation supprimée', 'Elle n’est plus dans votre liste.')}</div>`;
  const solo = !c.group && !c.biz, blocked = solo && S.blocked.includes(c.with), p = c.post && post(c.post);
  const off = p && p.offers && p.offers.find(o => (o.by === c.with || o.by === 'me') && o.status !== 'refused');
  const head = `<header class="bar"><button class="ibtn" data-a="back" aria-label="Retour">${ic('left')}</button>
    <button class="conv-who" data-a="${solo ? 'go:profile:' + c.with : 'noop'}">${convAv(c, 38)}<span><b>${esc(convName(c))}</b><small>${c.group ? `${c.members.length} voisins` : c.biz ? 'Commerce ou organisme' : c.online ? '<i class="live"></i>En ligne' : 'Hors ligne'}</small></span></button>
    ${solo ? `<button class="ibtn" data-a="report:${c.with}" aria-label="Signaler ou bloquer">${ic('more')}</button>` : '<span class="ibtn-sp"></span>'}</header>`;
  const ctx = p ? `<button class="ctx${p.type === 'job' ? ' job' : ''}" data-a="go:post:${p.id}">${ic(p.type === 'job' ? 'case' : 'hand', 18)}<span><small>${p.type === 'job' ? 'Offre d’emploi' : 'Demande concernée'}</small><b>${esc(p.title)}</b><small>${p.type === 'job' ? esc(p.job.kind) : `${p.when}${off ? ' · Aide ' + lc(HELP_TYPES[off.type]) : ''}`}</small></span>${ic('right', 16)}</button>` : '';
  const tip = solo ? `<button class="note tip" data-a="go:tips">${ic('shield', 18)}<span><b>Avant une première rencontre</b><small>Échangez quelques messages, rencontrez-vous dehors, prévenez un proche.</small></span>${ic('right', 16)}</button>` : '';
  const msgs = c.msgs.map((m, i) => {
    const me = m.from === 'me', prev = c.msgs[i - 1], showWho = c.group && !me && (!prev || prev.from !== m.from);
    const inner = m.voice ? `<button class="voice" data-a="playVoice" aria-label="Écouter le message vocal, ${m.voice}">${ic('play', 16)}<span class="bars">${Array.from({ length: 18 }, (_, k) => `<i style="height:${5 + Math.round(Math.abs(Math.sin(k * 1.700 + i)) * 15)}px"></i>`).join('')}</span><small>${m.voice}</small></button>`
      : m.photo ? `<span class="photo">${houses(m.photo, { w: 240, h: 150, sky: 'snow' })}</span>` : esc(m.text);
    return `${showWho ? `<small class="msg-who">${first(m.from)}</small>` : ''}<div class="msg ${me ? 'me' : 'them'}${m.photo ? ' media' : ''}">${inner}</div>`;
  }).join('');
  const composer = blocked ? note('ban', `Vos échanges avec ${first(c.with)} sont coupés.`)
    : `<div class="quick hscroll" data-k="qk">${(c.quick || []).map((q, i) => `<button class="chip" data-a="quick:${c.id}:${i}">${esc(q)}</button>`).join('')}</div>
       <div class="composer"><input class="inp" data-f="msg.${c.id}" value="${esc(S.f['msg.' + c.id] || '')}" placeholder="Écrire un message" aria-label="Écrire un message" data-enter="send:${c.id}" autocomplete="off"><button class="ibtn fill" data-a="send:${c.id}" aria-label="Envoyer">${ic('send', 18)}</button><button class="btn soft talk" data-a="talk:${c.id}">${ic('mic', 18)} Parler</button></div>`;
  return head + `<div class="scroll chat" data-k="chat" data-bottom><div class="chat-top">${ctx}${tip}</div><div class="msgs">${msgs || `<p class="muted small center">Dites bonjour. Les premiers messages servent à faire connaissance.</p>`}</div>${solo ? `<button class="lnk worry" data-a="report:${c.with}">Quelque chose vous inquiète ?</button>` : ''}</div><footer class="foot chat-f">${composer}</footer>`;
};
function pushMsg(c, m) {
  c.msgs.push(Object.assign({ from: 'me', t: 'À l’instant' }, m)); c.time = 'À l’instant';
  S.convs = [c, ...S.convs.filter(x => x !== c)];
  render(); scrollBottom();
  if (c.reply && !c.replied && !(c.with && S.blocked.includes(c.with))) {
    c.replied = true;
    setTimeout(() => {
      if (!S.convs.includes(c)) return;
      c.msgs.push({ from: c.with || c.biz, t: 'À l’instant', text: c.reply });
      if (!S.stack.some(s => s.name === 'conv' && s.p.id === c.id)) c.unread++;
      render(); scrollBottom();
    }, 2600);
  }
}
A.send = id => { const t = (S.f['msg.' + id] || '').trim(); if (!t) return; gate(() => { S.f['msg.' + id] = ''; pushMsg(conv(id), { text: t }); }); };
A.quick = (id, i) => gate(() => { const c = conv(id); pushMsg(c, { text: c.quick[+i] }); });
A.talk = id => gate(() => { toast('Enregistrement simulé pour la démonstration.'); setTimeout(() => { const c = conv(id); if (c) pushMsg(c, { voice: '0:06' }); }, 900); });
A.playVoice = function () { this.classList.add('playing'); setTimeout(() => this.classList.remove('playing'), 2400); };

/* ---------- activités ---------- */
function eventCard(e) {
  const d = day(e.d);
  return `<article class="ev"><button class="ev-art" data-a="go:event:${e.id}" aria-label="${esc(e.title)}">${houses(e.seed, { sky: e.sky, lights: e.lights })}<span class="ev-d"><small>${JOURS_C[d.getDay()]}</small><b>${d.getDate()}</b><small>${MOIS_C[d.getMonth()]}</small></span></button>
    <div class="ev-b"><button class="ev-t" data-a="go:event:${e.id}"><h3>${esc(e.title)}</h3></button>
      <p class="meta">${ic('clock', 15)}<span>${e.time}</span></p><p class="meta">${ic('pin', 15)}<span>${esc(e.place)}</span></p>
      ${e.tags.length ? `<div class="tags">${e.tags.map(t => `<span class="pill">${t}</span>`).join('')}</div>` : ''}
      <div class="ev-f">${avStack(e.who, 26, 3)}<small>${e.going} voisin${e.going > 1 ? 's' : ''} inscrit${e.going > 1 ? 's' : ''}</small><button class="btn sm ${e.mine ? 'soft' : 'primary'}" data-a="going:${e.id}">${e.mine ? ic('check', 16) + ' J’y vais' : 'J’y vais'}</button></div>
    </div></article>`;
}
function eventList() {
  const q = norm(S.f.evq);
  const list = S.events.filter(e => !e.removed && (S.evf !== 'mine' || e.mine) && (!q || norm(e.title + ' ' + e.place).includes(q))).sort((a, b) => a.d - b.d);
  if (!list.length) return empty('cal', S.evf === 'mine' ? 'Aucune sortie prévue' : 'Aucune activité trouvée', S.evf === 'mine' ? 'Touchez « J’y vais » sur une activité pour la retrouver ici.' : 'Essayez un autre mot, ou proposez la vôtre.');
  const wk = e => e.d <= 1 ? 'Cette fin de semaine' : e.d <= 8 ? 'Semaine du 16 novembre' : e.d <= 15 ? 'Semaine du 23 novembre' : e.d <= 16 ? 'Semaine du 30 novembre' : 'En décembre';
  let out = '', cur = '';
  list.forEach(e => { const w = wk(e); if (w !== cur) { cur = w; out += `<h2 class="wk">${w}</h2>`; } out += eventCard(e); });
  return out;
}
function groupRow(g) {
  return `<div class="grp"><button class="grp-m" data-a="go:group:${g.id}">${disc(g.icon, 48, g.color)}<span><b>${esc(g.name)}</b><small>${g.members} membres</small><small class="grp-d">${esc(g.desc)}</small></span></button>${g.joined ? `<span class="pill ok">${ic('check', 13)} Membre</span>` : `<button class="btn sm primary" data-a="join:${g.id}">Rejoindre</button>`}</div>`;
}
TABS.activites = () => {
  const ev = S.act === 'events';
  if (S.hood !== DEMO_HOOD) return `<header class="tab-h"><h1 class="h1">Activités</h1></header><div class="scroll"><div class="pad">${empty('cal', `Aucune activité dans ${esc(S.hood)} pour l’instant`, 'Dans cette démonstration, les événements et les groupes sont dans le Vieux-Limoilou.', btn('Voir le Vieux-Limoilou', 'setHood:' + DEMO_HOOD, 'soft'))}</div></div>`;
  const body = ev
    ? `<div class="searchbox">${ic('search', 18)}<input data-f="evq" data-live="evSearch" value="${esc(S.f.evq || '')}" placeholder="Chercher une activité" aria-label="Chercher une activité" autocomplete="off"></div>
       <div class="chips row-between"><span class="chips">${chip('Tout', 'evf:tout', S.evf === 'tout')}${chip('Mes sorties', 'evf:mine', S.evf === 'mine')}</span><button class="btn sm soft" data-a="compose:event">${ic('plus', 16)} Proposer</button></div>
       <div id="ev-list" class="evs">${eventList()}</div>`
    : `<h2 class="wk">Mes groupes</h2><div class="grps">${S.groups.filter(g => g.joined).map(groupRow).join('') || `<p class="muted small">Vous n’avez rejoint aucun groupe pour l’instant.</p>`}</div>
       <h2 class="wk">Suggérés près de chez vous</h2><div class="grps">${S.groups.filter(g => !g.joined).map(groupRow).join('') || `<p class="muted small">Vous êtes dans tous les groupes du quartier.</p>`}</div>`;
  return `<header class="tab-h"><h1 class="h1">Activités</h1></header>
    <div class="seg" role="tablist"><button class="${ev ? 'on' : ''}" data-a="act:events" role="tab" aria-selected="${ev}">Événements</button><button class="${ev ? '' : 'on'}" data-a="act:groups" role="tab" aria-selected="${!ev}">Groupes</button></div>
    <div class="scroll" data-k="act-${S.act}"><div class="pad stackv">${body}</div></div>`;
};
A.act = t => { S.act = t; render(); };
A.evf = f => { S.evf = f; render(); };
A.evSearch = () => { const o = $('#ev-list'); if (o) o.innerHTML = fr(eventList()); };
A.join = id => gate(() => { const g = grp(id); g.joined = true; g.members++; render(); toast(`Vous faites maintenant partie du groupe ${g.name}.`); });
A.leave = id => { const g = grp(id); g.joined = false; g.members--; render(); toast(`Vous avez quitté le groupe ${g.name}.`); };
SCREENS.event = ({ id }) => {
  const e = evt(id);
  if (!e || e.removed) return bar('Événement') + `<div class="scroll">${empty('cal', 'Cet événement n’est plus en ligne', 'Il a été retiré par la personne qui l’organisait.')}</div>`;
  const o = e.org, oname = o === 'me' ? P.me.name : P[o].name;
  return bar('Événement') + `<div class="scroll" data-k="ev"><div class="hero">${houses(e.seed, { sky: e.sky, lights: e.lights, h: 170 })}</div><div class="pad stackv">
      <h2 class="h1">${esc(e.title)}</h2>
      ${e.tags.length ? `<div class="tags">${e.tags.map(t => `<span class="pill">${t}</span>`).join('')}</div>` : ''}
      <button class="pers" data-a="go:profile:${o}">${avatar(o, 44)}<span><small>Organisé par</small><b>${oname}</b></span>${ic('right', 18)}</button>
      <div class="kvs">${kv('cal', 'Quand', evWhen(e))}${kv('pin', 'Où', esc(e.place))}</div>
      <p class="body">${esc(e.desc)}</p>
      <section><h3 class="h4">Qui y va</h3><div class="going">${avStack(e.mine && !e.who.includes('me') ? ['me', ...e.who] : e.who, 34, 5)}<span>${e.going} voisin${e.going > 1 ? 's' : ''} inscrit${e.going > 1 ? 's' : ''}${e.mine ? ', dont vous' : ''}</span></div></section>
      <section class="ride"><h3 class="h4">${ic('car', 18)} Transport entre voisins</h3><p class="small muted">Vous n’avez pas de moyen d’y aller, ou il vous reste une place ? Arrangez-vous entre voisins.</p>
        <div class="two">${btn('Demander un transport', 'ride:' + e.id + ':ask', 'soft')}${btn('J’offre une place', 'ride:' + e.id + ':offer', 'soft')}</div></section>
    </div></div><footer class="foot"><div class="acts"><button class="btn ${e.mine ? 'soft' : 'primary'} grow" data-a="going:${e.id}">${e.mine ? ic('check', 18) + ' J’y vais' : 'J’y vais'}</button>${e.own ? btn('Retirer', 'removeEvent:' + e.id, 'ghost') : ''}</div></footer>`;
};
A.ride = (id, kind) => gate(() => {
  const e = evt(id);
  ok(kind === 'ask'
    ? { title: 'Votre demande de transport est publiée', steps: [`Les voisins inscrits à « ${esc(e.title)} » la voient.`, 'Un voisin qui a une place vous écrit par message.', 'Vous donnez votre adresse vous-même, quand vous êtes à l’aise.'] }
    : { title: 'Votre place est offerte', steps: [`Les voisins inscrits à « ${esc(e.title)} » la voient.`, 'Une personne intéressée vous écrit par message.', 'Vous convenez ensemble du lieu de rencontre.'] });
});
A.removeEvent = id => { evt(id).removed = true; S.posts.forEach(p => { if (p.ev === id) p.status = 'removed'; }); S.stack = []; render(); toast('Votre événement est retiré.'); };
SCREENS.group = ({ id }) => {
  const g = grp(id), next = S.events.filter(e => e.group === id && !e.removed);
  return bar('Groupe') + `<div class="scroll" data-k="grp"><div class="pad stackv">
      <div class="grp-top">${disc(g.icon, 72, g.color)}<h2 class="h1">${esc(g.name)}</h2><p class="muted">${g.members} membres · ${DEMO_HOOD}</p></div>
      <p class="body center">${esc(g.desc)}</p>
      <div class="two">${g.joined ? `<button class="btn soft" data-a="leave:${g.id}">${ic('check', 18)} Membre</button>` : btn('Rejoindre', 'join:' + g.id)}${btn(ic('share', 18) + ' Inviter', 'invite:' + g.id, 'soft')}</div>
      <section><h3 class="h4">Prochains rendez-vous</h3>${next.length ? `<div class="list">${next.map(e => row('cal', esc(e.title), `${evWhen(e)} · ${esc(e.place)}`, 'go:event:' + e.id)).join('')}</div>` : `<p class="muted small">Aucun rendez-vous prévu pour l’instant.</p>`}</section>
      <section><h3 class="h4">Publications du groupe</h3>${g.posts.map(p => `<div class="cmt">${avatar(p[0], 36)}<div><b>${P[p[0]].name}</b><p>${esc(p[1])}</p><small>${p[2]}</small></div></div>`).join('')}</section>
    </div></div>`;
};
A.invite = id => { S.sheets = []; sheet('share', { id: 'groupe-' + id }); };

/* ---------- notifications ---------- */
SCREENS.notifs = () => {
  const nw = S.notifs.filter(n => n.isNew), old = S.notifs.filter(n => !n.isNew);
  const item = n => `<button class="notif${n.isNew ? ' new' : ''}" data-a="openNotif:${n.id}"><span class="av disc c-${n.tone}" style="--s:44px">${ic(n.icon, 22)}</span><span><b>${n.title}</b><small>${n.text}</small><small class="ago">${n.ago}</small></span></button>`;
  return bar('Notifications', nw.length ? `<button class="lnk bar-l" data-a="readAll">J’ai tout lu</button>` : '') + `<div class="scroll" data-k="nt"><div class="pad stackv">
      ${nw.length ? `<h2 class="wk">Nouveau pour vous</h2><div class="list flush">${nw.map(item).join('')}</div>` : ''}
      ${old.length ? `<h2 class="wk">Déjà lu</h2><div class="list flush">${old.map(item).join('')}</div>` : ''}
      ${!S.notifs.length ? empty('bell', 'Rien de nouveau', 'Les nouvelles du quartier arrivent ici.') : ''}
    </div></div>`;
};
A.readAll = () => { S.notifs.forEach(n => { n.isNew = false; }); render(); };
A.openNotif = id => { const n = S.notifs.find(x => x.id === id); n.isNew = false; if (n.go) run(n.go); else render(); };

/* ---------- mon quartier ---------- */
function hoodList() {
  const q = norm(S.f.hoodq);
  if (q) {
    const found = HOODS.filter(h => norm(h).includes(q));
    return found.length ? `<div class="list">${found.map(h => row('pin', esc(h), esc(arrOf(h)), 'setHood:' + h, h === S.hood ? ic('check', 18, 'row-ok') : undefined)).join('')}</div>` : empty('pin', 'Aucun quartier à ce nom', 'Entre Voisins couvre les 35 quartiers de la ville de Québec.');
  }
  return ARR.map(([name, hoods]) => { const open = S.openArr === name; return `<div class="acc${open ? ' open' : ''}"><button class="acc-h" data-a="arr:${name}" aria-expanded="${open}"><b>${name}</b><small>${hoods.length} quartiers</small>${ic('down', 18)}</button>${open ? `<div class="list">${hoods.map(h => row('pin', esc(h), '', 'setHood:' + h, h === S.hood ? ic('check', 18, 'row-ok') : undefined)).join('')}</div>` : ''}</div>`; }).join('');
}
SCREENS.hood = () => bar('Mon quartier') + `<div class="scroll" data-k="hood"><div class="pad stackv">
    <div class="hood-now"><div class="hood-art">${houses(8, { w: 360, h: 110, sky: 'day' })}</div><div><small>Quartier actuel</small><b>${esc(S.hood)}</b><small>${esc(arrOf(S.hood))}</small></div></div>
    <div class="searchbox">${ic('search', 18)}<input data-f="hoodq" data-live="hoodSearch" value="${esc(S.f.hoodq || '')}" placeholder="Chercher un quartier" aria-label="Chercher un quartier" autocomplete="off"></div>
    <p class="small muted">Vous pouvez changer de quartier quand vous voulez. Les 6 arrondissements :</p>
    <div id="hood-list" class="stackv">${hoodList()}</div>
  </div></div>`;
A.hoodSearch = () => { const o = $('#hood-list'); if (o) o.innerHTML = fr(hoodList()); };
A.arr = name => { S.openArr = S.openArr === name ? '' : name; render(); };
