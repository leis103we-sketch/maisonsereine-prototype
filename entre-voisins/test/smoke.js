// Parcours de contrôle : ouvre le prototype, traverse les écrans, note les erreurs, prend des captures.
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const FILE = process.argv[2];
const OUT = process.argv[3];
const only = process.argv[4] || '';
fs.mkdirSync(OUT, { recursive: true });
const fdir = path.join(__dirname, 'node_modules/@fontsource-variable');
const b64 = f => fs.readFileSync(f).toString('base64');
const fontCSS = `
@font-face{font-family:'Bricolage Grotesque';font-weight:200 800;src:url(data:font/woff2;base64,${b64(fdir + '/bricolage-grotesque/files/bricolage-grotesque-latin-opsz-normal.woff2')}) format('woff2')}
@font-face{font-family:'Atkinson Hyperlegible Next';font-weight:200 800;font-style:normal;src:url(data:font/woff2;base64,${b64(fdir + '/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-wght-normal.woff2')}) format('woff2')}
@font-face{font-family:'Atkinson Hyperlegible Next';font-weight:200 800;font-style:italic;src:url(data:font/woff2;base64,${b64(fdir + '/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-wght-italic.woff2')}) format('woff2')}`;
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
  await page.goto('file://' + FILE);
  await page.addStyleTag({ content: fontCSS });
  await page.evaluate(() => document.fonts.ready);
  let n = 0;
  const shot = async name => { await wait(480); if (!only || name.includes(only)) await page.screenshot({ path: path.join(OUT, String(++n).padStart(2, '0') + '-' + name + '.png') }); else n++; };
  const act = async (...a) => { const r = await page.evaluate(args => { try { const [k, ...rest] = args; A[k](...rest); return 'ok'; } catch (e) { return 'ERR ' + args.join(':') + ' → ' + e.message; } }, a); if (r !== 'ok') errors.push(r); await wait(60); };
  const ev = fn => page.evaluate(fn);
  const type = async (sel, v) => { await page.focus(sel); await page.keyboard.type(v); await wait(50); };
  const tap = async sel => { const el = await page.$(":not(.leave) > * " + sel) || await page.$(sel); if (!el) { errors.push('ABSENT ' + sel); return; } await el.evaluate(e => e.click()); await wait(280); };

  await shot('ouverture');
  await tap('[data-a="onbStart:postal"]');
  await type('#f-postal', 'g1l2k4'); await shot('code-postal');
  await tap('[data-a^="pickHood:Vieux-Limoilou"]'); await tap('[data-a="onbNext"]');
  await tap('[data-a="toggleAge"]'); await shot('compte');
  await tap('[data-a="acct:courriel"]');
  await type('#f-email', 'julie@exemple.ca'); await type('#f-pw', 'motdepasse'); await tap('[data-a="onbNext"]');
  await type('#f-code', '123456'); await shot('code'); await tap('[data-a="onbNext"]');
  await shot('accueil');
  for (const y of [520, 1150, 1800, 2500, 3200]) { await ev(`document.querySelector('[data-k="home"]').scrollTop=${y}`); await shot('fil-' + y); }
  await ev(`document.querySelector('[data-k="home"]').scrollTop=0`);
  // lecture libre
  await act('go', 'post', 'p1'); await shot('fiche-demande'); await ev(`document.querySelector('[data-k="post"]').scrollTop=700`); await shot('fiche-demande-bas'); await act('back');
  await act('go', 'post', 'p9'); await shot('fiche-emploi'); await act('back');
  await act('go', 'post', 'p4'); await shot('fiche-merci'); await act('back');
  await act('trust', 'p3', 'paul'); await shot('confiance'); await ev(`document.querySelector('.sheet-b').scrollTop=600`); await shot('confiance-bas'); await act('closeSheet');
  await act('publish'); await shot('publier');
  // deuxième temps
  await tap('[data-a="ask:main"]'); await shot('etapes-telephone');
  await type('#f-phone', '418 555-0123'); await tap('[data-a="regSend"]'); await type('#f-regcode', '654321'); await shot('etapes-code'); await tap('[data-a="regNext"]');
  await shot('etapes-photo');
  await tap('.sheet .wm'); await tap('.sheet .wm'); await tap('.sheet .wm'); await wait(100); await tap('[data-a="skipStep"]');
  for (const i of [0, 1, 2, 3]) await tap(`[data-a="charter:${i}"]`);
  await shot('etapes-charte'); await tap('[data-a="regNext"]'); await wait(600);
  await shot('besoin'); await tap('[data-a="askNeed:deneiger"]');
  await type('#f-ask-text', 'Mon entrée et mon escalier, après la bordée.'); await tap('[data-a="askMode:date"]'); await tap('[data-a="askDate:4"]'); await tap('[data-a="askSlot:heure"]'); await tap('[data-a="askHour:10 h"]');
  await shot('ma-demande'); await tap('[data-a="sendAsk"]'); await shot('demande-envoyee'); await act('closeSheet');
  await shot('accueil-apres-demande');
  await wait(6800); await shot('voisin-propose');
  const newId = await ev(`S.posts[0].id`);
  await act('trust', newId, 'louis'); await tap(`[data-a="accept:${newId}:louis"]`); await shot('accepte'); await act('closeSheet'); await shot('accueil-accepte');
  await act('done', newId); await shot('cest-fait'); await tap('[data-a="doneYes"]'); await type('#f-merci', 'Merci Louis, mon escalier n’a jamais été aussi propre !'); await tap('[data-a="toggleShowMerci"]'); await shot('merci'); await tap(`[data-a="sendMerci:${newId}"]`); await shot('merci-envoye'); await act('closeSheet'); await shot('accueil-merci');
  // aider
  await act('offer', 'p1'); await tap('[data-a="offerType:gratuite"]'); await shot('je-peux-aider'); await tap('[data-a="sendOffer:p1"]'); await shot('aide-proposee'); await act('closeSheet');
  // pour un proche
  await act('ask', 'proche'); await shot('pour-qui'); await tap('[data-a="askWho:pr1"]'); await shot('besoin-proche'); await tap('[data-a="askNeed:repit"]'); await type('#f-ask-text', 'Une visite pour jaser avec maman.'); await tap('[data-a="askMode:tomorrow"]'); await tap('[data-a="askSlot:apm"]'); await shot('demande-proche'); await tap('[data-a="sendAsk"]'); await shot('demande-proche-envoyee'); await act('closeSheet');
  // messages
  await act('tab', 'messages'); await shot('messages');
  await act('go', 'conv', 'c_paul'); await shot('conversation'); await tap('[data-a="quick:c_paul:0"]'); await wait(2900); await shot('conversation-reponse'); await act('back');
  await act('go', 'conv', 'c_therese'); await shot('conversation-vocal'); await act('back');
  await act('go', 'conv', 'c_marcandre'); await shot('conversation-photo'); await act('back');
  await act('go', 'conv', 'c_guignolee'); await shot('conversation-groupe'); await act('back');
  await act('newMsg'); await shot('nouveau-message'); await act('closeSheet');
  // activités
  await act('tab', 'activites'); await shot('activites'); await ev(`document.querySelector('[data-k="act-events"]').scrollTop=900`); await shot('activites-bas');
  await act('go', 'event', 'e_marche'); await shot('evenement'); await ev(`document.querySelector('[data-k="ev"]').scrollTop=500`); await shot('evenement-bas'); await act('back');
  await act('act', 'groups'); await shot('groupes'); await act('go', 'group', 'g_outils'); await shot('groupe'); await act('back');
  await act('compose', 'event'); await shot('proposer-evenement'); await act('back');
  // notifications, quartier
  await act('tab', 'accueil'); await act('go', 'notifs'); await shot('notifications'); await act('back');
  await act('go', 'hood'); await shot('mon-quartier'); await act('back');
  // services, voisin pro, emploi
  await act('go', 'services'); await shot('services'); await ev(`S.f.svq='pelleter'`); await act('svcSearch'); await shot('services-recherche'); await act('svcInfo'); await shot('services-info'); await act('closeSheet');
  await act('go', 'profile', 'paul'); await shot('fiche-pro'); await ev(`document.querySelector('[data-k="pf"]').scrollTop=600`); await shot('fiche-pro-bas'); await act('back'); await act('back');
  await act('becomePro'); await shot('devenir-pro'); await tap('[data-a="toggleF:proOk"]'); await tap('[data-a="startPro"]');
  await type('[data-f="ps.0"]', 'Tutorat en français'); await type('[data-f="pt.0"]', '25 $ l’heure'); await tap('[data-a="proAdd"]'); await type('[data-f="ps.1"]', 'Transport à l’aéroport'); await type('[data-f="pt.1"]', '40 $'); await tap('[data-a="savePro"]'); await shot('pro-refus');
  await tap('[data-a="proDel:1"]'); await tap('[data-a="savePro"]'); await shot('pro-enregistre'); await act('back');
  await act('compose', 'job'); await type('#f-j-biz', 'Café des Avenues'); await type('#f-j-title', 'Barista'); await type('#f-j-pay', '17 $ l’heure'); await type('#f-j-place', '3e Avenue'); await type('#f-j-desc', 'Service au comptoir, matins de semaine.'); await shot('emploi-formulaire'); await tap('[data-a="jobReview"]'); await shot('emploi-prix'); await tap('[data-a="postJob"]'); await shot('emploi-publie'); await act('closeSheet'); await act('tab','moi'); await act('go','ads'); await shot('mes-annonces'); await tap('[data-a^="filled:"]'); await shot('poste-comble'); await tap('[data-a^="doFilled:"]');
  await act('compose', 'news'); await shot('nouvelle'); await act('back');
  // moi
  await act('tab', 'moi'); await shot('moi'); await ev(`document.querySelector('[data-k="moi"]').scrollTop=500`); await shot('moi-bas');
  await act('go', 'profile', 'me'); await shot('ma-fiche'); await act('back');
  await act('editMe'); await shot('modifier-fiche'); await act('back');
  await act('go', 'agenda'); await shot('agenda'); await act('back');
  await act('go', 'mine'); await shot('mes-demandes'); await act('back');
  await act('go', 'account'); await shot('compte-reglages'); await act('back');
  await act('go', 'proches'); await shot('proches'); await act('openProche', 'new'); await shot('ajouter-proche'); await act('closeSheet'); await act('back');
  await act('go', 'display'); await shot('affichage'); await act('size', '20'); await act('contrast'); await shot('affichage-grand'); await act('back'); await act('tab', 'accueil'); await shot('accueil-grand-contraste'); await act('size', '15'); await act('contrast');
  await act('go', 'tips'); await shot('conseils'); await act('back');
  await act('go', 'terms'); await shot('conditions'); await act('back');
  await act('report', 'paul'); await shot('signalement'); await tap('[data-a="doReport:paul:team"]'); await shot('signalement-envoye'); await act('closeSheet');
  await act('postMenu', 'p6'); await shot('menu-publication'); await act('closeSheet');
  await act('share', 'p6'); await shot('partager'); await act('closeSheet');
  await act('setHood', 'Saint-Roch'); await shot('autre-quartier'); await act('setHood', 'Vieux-Limoilou');
  // texte : aucun « vérifié » hors des conditions, aucun prix dans le fil
  const audit = await ev(() => {
    S.stack = []; S.sheets = []; S.tab = 'accueil'; S.filter = 'tout'; render();
    const feedTxt = document.querySelector('.feed').innerText;
    return { prixDansFil: (feedTxt.match(/\d[\d,]*\s?\$/g) || []), demandes: feed('demandes').length };
  });
  console.log('AUDIT', JSON.stringify(audit));
  console.log(errors.length ? 'ERREURS\n' + errors.join('\n') : 'AUCUNE ERREUR');
  await browser.close();
})().catch(e => { console.error('ECHEC', e); process.exit(1); });
