// Deuxième parcours : chemins secondaires et captures ciblées.
const puppeteer = require('puppeteer-core'); const path = require('path'); const fs = require('fs');
const FILE = process.argv[2], OUT = process.argv[3]; fs.mkdirSync(OUT, { recursive: true });
const fdir = path.join(__dirname, 'node_modules/@fontsource-variable'); const b64 = f => fs.readFileSync(f).toString('base64');
const fontCSS = `@font-face{font-family:'Bricolage Grotesque';font-weight:200 800;src:url(data:font/woff2;base64,${b64(fdir + '/bricolage-grotesque/files/bricolage-grotesque-latin-opsz-normal.woff2')}) format('woff2')}
@font-face{font-family:'Atkinson Hyperlegible Next';font-weight:200 800;src:url(data:font/woff2;base64,${b64(fdir + '/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-wght-normal.woff2')}) format('woff2')}`;
const wait = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_/.test(m.text())) errors.push('CONSOLE ' + m.text()); });
  await page.setRequestInterception(true);
  page.on('request', r => (/fonts\.(googleapis|gstatic)/.test(r.url()) ? r.abort() : r.continue()));
  await page.goto('file://' + FILE); await page.addStyleTag({ content: fontCSS }); await page.evaluate(() => document.fonts.ready);
  let n = 0;
  const shot = async name => { await wait(480); await page.screenshot({ path: path.join(OUT, String(++n).padStart(2, '0') + '-' + name + '.png') }); };
  const act = async (...a) => { const r = await page.evaluate(args => { try { const [k, ...rest] = args; A[k](...rest); return 'ok'; } catch (e) { return 'ERR ' + args.join(':') + ' → ' + e.message; } }, a); if (r !== 'ok') errors.push(r); await wait(60); };
  const ev = fn => page.evaluate(fn);
  const type = async (sel, v) => { await page.focus(sel); await page.keyboard.type(v); await wait(50); };
  const tap = async sel => { const el = await page.$(':not(.leave) > * ' + sel) || await page.$(sel); if (!el) { errors.push('ABSENT ' + sel); return; } await el.evaluate(e => e.click()); await wait(300); };
  const has = async (sel, label) => { if (!(await page.$(sel))) errors.push('ATTENDU ' + (label || sel)); };

  await shot('ouverture');
  // code postal hors Québec, puis connexion
  await tap('[data-a="onbStart:postal"]'); await type('#f-postal', 'h2x1y4'); await shot('hors-quebec'); await has('.err', 'message hors Québec');
  if (await ev(`!document.querySelector('[data-v="postal"]').disabled`)) errors.push('Continuer devrait être bloqué hors Québec');
  await tap('[data-a="onbBack"]'); await tap('[data-a="onbStart:login"]'); await tap('[data-a="onbStart:forgot"]'); await type('#f-email', 'julie@exemple.ca'); await tap('[data-a="onbNext"]');
  await type('#f-pw', 'x'); await tap('[data-a="onbNext"]');
  await has('.tabview.on .home-h', 'accueil après connexion');
  // aimer → étapes → plus tard → bandeau et pastille
  await tap('[data-a="like:p6"]'); await has('.sheet .prog', 'panneau des trois étapes'); await tap('[data-a="regLater"]');
  await act('tab', 'moi'); await shot('moi-plus-tard'); await has('.complete', 'bandeau Complétez votre inscription'); await has('.tab .dot.red', 'pastille rouge');
  await tap('[data-a="completeReg"]'); await ev(`S.test=true;render()`);
  await tap('[data-a="skipStep"]'); await tap('[data-a="skipStep"]'); await tap('[data-a="skipStep"]'); await wait(500);
  if (!(await ev(`S.reg.done`))) errors.push('inscription non complétée');
  await act('tab', 'accueil');
  await tap('[data-a="like:p6"]'); if (!(await ev(`post('p6').liked`))) errors.push('like non pris');
  await act('go', 'post', 'p6', 'c'); await type('[data-f="cm.p6"]', 'Je la prends samedi !'); await tap('[data-a="comment:p6"]'); await shot('commentaire'); await act('back');
  await act('going', 'e_soupe'); await act('join', 'g_cafe');
  // publier une nouvelle et un événement
  await act('compose', 'news'); await type('#f-n-text', 'Mon ancien vélo est à donner, il roule bien.'); await tap('[data-a="postNews"]'); await act('closeSheet');
  await act('compose', 'event'); await type('#f-e-title', 'Soirée jeux de société'); await tap('[data-a="evDay:6"]'); await tap('[data-a="evTime:19 h"]'); await type('#f-e-place', 'Centre communautaire'); await tap('[data-a="evTag:Gratuit"]'); await tap('[data-a="postEvent"]'); await shot('evenement-publie'); await act('closeSheet');
  await shot('accueil-mes-publications');
  const ids = await ev(`S.posts.slice(0,2).map(p=>p.id)`);
  await act('removePost', ids[1]); await act('go', 'event', await ev(`S.events[S.events.length-1].id`)); await shot('mon-evenement'); await tap('[data-a^="removeEvent"]');
  // refuser Paul, puis nouvelle proposition
  await act('trust', 'p3', 'paul'); await tap('[data-a="refuse:p3:paul"]'); await wait(7400); await shot('apres-refus');
  // annuler une demande
  await act('cancelPost', 'p3'); await shot('annuler'); await tap('[data-a="doCancel:p3"]');
  // signaler une publication, répondre à une annonce, transport, inviter, copier le lien
  await act('reportPost', 'p8'); await act('closeSheet');
  await act('reply', 'p9'); await tap('[data-a^="quick:c_p9:0"]'); await wait(2900); await shot('reponse-annonce'); await act('back');
  await act('go', 'event', 'e_guignolee'); await tap('[data-a="ride:e_guignolee:ask"]'); await act('closeSheet'); await act('back');
  await act('invite', 'g_outils'); await tap('[data-a^="copyLink"]');
  // messages : chercher, écrire, vocal, supprimer
  await act('tab', 'messages'); await type('[data-f="msgq"]', 'kar'); await shot('messages-recherche'); await ev(`S.f.msgq=''`);
  await act('write', 'sophie'); await type('[data-f="msg.c_sophie"]', 'Bonjour Sophie !'); await tap('[data-a="send:c_sophie"]'); await tap('[data-a="talk:c_sophie"]'); await wait(1300); await shot('nouvelle-conversation'); await act('back');
  await act('delConv', 'c_karim');
  // glisser pour supprimer
  await act('tab', 'messages'); await wait(200);
  const row = await page.$('.conv-row'); const bb = await row.boundingBox();
  await page.mouse.move(bb.x + 300, bb.y + 30); await page.mouse.down(); await page.mouse.move(bb.x + 200, bb.y + 32, { steps: 6 }); await page.mouse.up(); await shot('glisser');
  // quartier : recherche, nom long ; activités : recherche
  await act('tab', 'accueil'); await act('go', 'hood'); await type('[data-f="hoodq"]', 'saint'); await shot('quartier-recherche'); await act('setHood', 'Vieux-Québec–Cap-Blanc–Colline Parlementaire'); await shot('nom-long');
  await act('tab', 'activites'); await shot('activites-autre-quartier'); await act('setHood', 'Vieux-Limoilou');
  await act('tab', 'activites'); await type('[data-f="evq"]', 'café'); await shot('activites-recherche'); await act('evf', 'mine');
  // proche : ajouter puis demander
  await act('tab', 'accueil'); await act('ask', 'proche'); await tap('[data-a="askWho:new"]'); await type('#f-pr-nick', 'Papa'); await type('#f-pr-first', 'Gilles'); await page.select('#f-pr-hood', 'Montcalm'); await tap('[data-a="toggleF:pr.ok"]'); await tap('[data-a^="saveProche"]'); await shot('besoin-papa');
  await tap('[data-a="askNeed:repasprep"]'); await type('#f-ask-text', 'Préparer une soupe pour deux jours.'); await tap('[data-a="askMode:today"]'); await tap('[data-a="askSlot:soir"]'); await tap('[data-a="sendAsk"]'); await act('closeSheet');
  const pid = await ev(`S.posts[0].id`); await wait(6900);
  await act('trust', pid, 'nadia'); await shot('confiance-proche'); if (await ev(`!document.querySelector('[data-a^="accept:"]').disabled`)) errors.push('Accepter devrait attendre la case de présence');
  await tap('[data-a="togglePresent"]'); await tap(`[data-a="accept:${pid}:nadia"]`); await tap(`[data-a="write:nadia:${pid}"]`); await shot('conversation-proche'); await act('back');
  // réglages : modifier, bloquer/débloquer, confidentialité
  await act('tab', 'moi'); await act('go', 'account'); await act('editField', 'email'); await shot('modifier-courriel'); await act('closeSheet');
  await act('doReport', 'karim', 'mute'); await act('closeSheet'); await shot('bloques'); await act('unblock', 'karim'); await act('back');
  await act('go', 'terms', 'conf'); await shot('confidentialite'); await act('back');
  await act('cancelPro'); await act('askDelete'); await shot('supprimer'); await tap('[data-a="doDelete"]'); await has('.splash', 'retour à l’ouverture'); await shot('apres-suppression');
  // grand écran
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 }); await act('onbStart', 'login'); await ev(`S.f.email='a@b.ca';S.f.pw='x'`); await act('onbNext'); await shot('grand-ecran');
  console.log(errors.length ? 'ERREURS\n' + errors.join('\n') : 'AUCUNE ERREUR');
  await browser.close();
})().catch(e => { console.error('ECHEC', e); process.exit(1); });
