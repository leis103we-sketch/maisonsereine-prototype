/* =====================================================================
   Entre Voisins — contenu de démonstration
   La démonstration se passe le samedi 14 novembre 2026, dans le Vieux-Limoilou.
   ===================================================================== */
const TODAY = new Date(2026, 10, 14);
const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const JOURS_C = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const MOIS_C = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juill.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const day = n => { const d = new Date(TODAY); d.setDate(d.getDate() + n); return d; };
const dnum = d => d.getDate() === 1 ? '1er' : d.getDate();
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const fLong = d => `${JOURS[d.getDay()]} ${dnum(d)} ${MOIS[d.getMonth()]}`;
const fShort = d => `${JOURS_C[d.getDay()]} ${dnum(d)} ${MOIS_C[d.getMonth()]}`;
const dayDiff = d => Math.round((d - TODAY) / 864e5);
const fRel = d => { const n = dayDiff(d); return n === 0 ? 'aujourd’hui' : n === 1 ? 'demain' : fLong(d); };

/* ---------- la ville de Québec : 6 arrondissements, 35 quartiers ---------- */
const ARR = [
  ['Beauport', ['Chutes-Montmorency', 'Saint-Michel', 'Sainte-Thérèse-de-Lisieux', 'Vieux-Bourg', 'Vieux-Moulin']],
  ['Charlesbourg', ['Bourg-Royal', 'Jésuites', 'Notre-Dame-des-Laurentides', 'Orsainville', 'Saint-Charles-Borromée', 'Saint-Rodrigue']],
  ['La Cité-Limoilou', ['Lairet', 'Maizerets', 'Montcalm', 'Saint-Jean-Baptiste', 'Saint-Roch', 'Saint-Sacrement', 'Saint-Sauveur', 'Vieux-Limoilou', 'Vieux-Québec–Cap-Blanc–Colline Parlementaire']],
  ['La Haute-Saint-Charles', ['Des Châtels', 'Lac-Saint-Charles', 'Loretteville', 'Saint-Émile', 'Val-Bélair']],
  ['Les Rivières', ['Duberger–Les Saules', 'Neufchâtel Est–Lebourgneuf', 'Vanier']],
  ['Sainte-Foy–Sillery–Cap-Rouge', ['Aéroport', 'Cap-Rouge', 'Cité-Universitaire', 'Plateau', 'Pointe-de-Sainte-Foy', 'Saint-Louis', 'Sillery']]
];
const HOODS = ARR.flatMap(a => a[1]);
const DEMO_HOOD = 'Vieux-Limoilou';
/* Secteur postal (3 premiers caractères) → quartiers proposés. Correspondance approximative, à remplacer par les limites officielles. */
const FSA = {
  G1A: ['Vieux-Québec–Cap-Blanc–Colline Parlementaire'],
  G1B: ['Sainte-Thérèse-de-Lisieux', 'Chutes-Montmorency'],
  G1C: ['Chutes-Montmorency', 'Vieux-Bourg', 'Saint-Michel'],
  G1E: ['Vieux-Moulin', 'Vieux-Bourg', 'Saint-Michel'],
  G1G: ['Orsainville', 'Bourg-Royal', 'Notre-Dame-des-Laurentides'],
  G1H: ['Saint-Rodrigue', 'Saint-Charles-Borromée', 'Jésuites', 'Bourg-Royal'],
  G1J: ['Maizerets', 'Lairet'],
  G1K: ['Saint-Roch', 'Saint-Sauveur', 'Vieux-Québec–Cap-Blanc–Colline Parlementaire'],
  G1L: ['Vieux-Limoilou', 'Lairet', 'Maizerets'],
  G1M: ['Vanier'],
  G1N: ['Saint-Sauveur', 'Saint-Sacrement', 'Duberger–Les Saules'],
  G1P: ['Duberger–Les Saules'],
  G1R: ['Saint-Jean-Baptiste', 'Montcalm', 'Vieux-Québec–Cap-Blanc–Colline Parlementaire'],
  G1S: ['Saint-Sacrement', 'Montcalm', 'Sillery'],
  G1T: ['Sillery'],
  G1V: ['Cité-Universitaire', 'Saint-Louis', 'Plateau'],
  G1W: ['Saint-Louis', 'Pointe-de-Sainte-Foy', 'Sillery'],
  G1X: ['Pointe-de-Sainte-Foy', 'Plateau', 'Cap-Rouge'],
  G1Y: ['Cap-Rouge'],
  G2A: ['Loretteville', 'Saint-Émile'],
  G2B: ['Loretteville', 'Des Châtels'],
  G2C: ['Des Châtels', 'Neufchâtel Est–Lebourgneuf'],
  G2E: ['Aéroport'],
  G2G: ['Aéroport', 'Plateau'],
  G2J: ['Neufchâtel Est–Lebourgneuf'],
  G2K: ['Neufchâtel Est–Lebourgneuf'],
  G2L: ['Jésuites', 'Notre-Dame-des-Laurentides'],
  G2M: ['Notre-Dame-des-Laurentides'],
  G2N: ['Notre-Dame-des-Laurentides', 'Lac-Saint-Charles'],
  G3E: ['Saint-Émile'],
  G3G: ['Lac-Saint-Charles'],
  G3J: ['Val-Bélair'],
  G3K: ['Val-Bélair']
};

/* ---------- les besoins ---------- */
const NEEDS = {
  main: [
    ['deneiger', 'Déneiger mon entrée', 'snow', 'Mon entrée et les trois marches du perron, après la bordée de cette nuit.'],
    ['outil', 'Emprunter un outil', 'tool', 'Une perceuse pour poser deux tablettes, samedi.'],
    ['travail', 'Un petit travail', 'key', 'Poser une tringle à rideaux dans le salon.'],
    ['lourd', 'Déplacer quelque chose de lourd', 'box', 'Monter une commode au deuxième étage. À deux, c’est dix minutes.'],
    ['course', 'Rapporter une course', 'bag', 'Du lait et du pain de l’épicerie de la 3e Avenue.'],
    ['animal', 'Garder un animal ou des plantes', 'paw', 'Nourrir mon chat matin et soir, de vendredi à dimanche.'],
    ['rdv', 'Aller à un rendez-vous', 'pin', 'M’accompagner à la clinique, à quinze minutes à pied.'],
    ['tablette', 'Aide avec ma tablette', 'phone', 'Installer une application pour parler à mes petits-enfants.'],
    ['autre', 'Autre chose', 'more', 'Décrivez votre besoin en une ou deux phrases.']
  ],
  proche: [
    ['repasacc', 'Accompagnement aux repas', 'fork', 'Tenir compagnie à ma mère pendant le dîner, deux fois par semaine.'],
    ['repasprep', 'Préparation de repas', 'coffee', 'Préparer une soupe et un plat pour deux jours.'],
    ['quotidien', 'Aide au quotidien', 'home', 'Passer la balayeuse et faire une brassée de lavage.', 'Ménage léger, lessive, petites tâches'],
    ['social', 'Soutien social', 'smile', 'Une visite d’une heure pour jaser et prendre un café.'],
    ['repit', 'Compagnie et répit', 'clock', 'Rester avec mon père deux heures pendant que je fais des courses.'],
    ['soins', 'Aide aux soins personnels', 'heart', 'Aider ma mère à se coiffer et à choisir ses vêtements.'],
    ['autre', 'Autre chose', 'more', 'Décrivez le besoin en une ou deux phrases.']
  ]
};
const needOf = (fam, id) => (NEEDS[fam] || []).find(n => n[0] === id) || NEEDS.main[8];
const HELP_TYPES = { gratuite: 'Gratuite', frais: 'Frais remboursés', remun: 'Rémunérée, à convenir' };
const HELP_SUB = { gratuite: 'Un coup de main bénévole.', frais: 'Essence, stationnement ou matériel, par exemple.', remun: 'Vous vous entendez ensemble sur le montant, par message.' };
const TOPICS = ['Aide au quotidien', 'Soutien social', 'Compagnie et répit', 'Préparation de repas', 'Petits travaux', 'Déneigement', 'Transport', 'Courses', 'Aide avec la techno'];
const CHARTER = [
  'Je respecte la personne, son rythme et sa maison.',
  'Je garde pour moi ce que je vois et entends.',
  'Je préviens si je ne peux pas venir.',
  'Ma photo montre bien mon visage.'
];
const TIPS = [
  'Échangez quelques messages avant de vous rencontrer. Vous pouvez vous donner vos numéros si vous le souhaitez.',
  'La première fois, rencontrez-vous dehors ou dans un lieu public.',
  'Prévenez un proche : qui vient, quand et pourquoi.',
  'Si un paiement est prévu, convenez du montant avant et réglez-le une fois le service rendu. Ne confiez jamais votre carte bancaire, votre NIP ni vos clés.',
  'Pour un proche : soyez sur place, ou joignable par téléphone, à la première visite.',
  'Si quelque chose vous met mal à l’aise, dites non. Vous n’avez pas à vous justifier.'
];

/* ---------- les voisins ---------- */
const P = {
  me: { first: 'Julie', last: 'Fortin', g: 'f', job: 'Enseignante au primaire', since: 'mars 2025', given: 23, received: 4, mercis: 18, dist: 0,
    bio: 'Enseignante au primaire. J’aime rendre service, surtout quand il y a du café après.', can: ['Aide au quotidien', 'Courses', 'Aide avec la techno'],
    known: ['therese', 'paul', 'jeannine', 'marcandre', 'nadia'],
    thanks: [['therese', 'Julie m’a accompagnée à la clinique et elle a attendu avec moi. Une perle.'], ['marcandre', 'Merci pour le coup de main avec mon divan. Trois étages, sans un mot plus haut que l’autre !']],
    face: { skin: 1, hair: 'auburn', style: 'long', bg: '#DCE7FF', shirt: '#2F62E0' } },
  therese: { first: 'Thérèse', last: 'Gagnon', g: 'f', since: 'septembre 2025', given: 3, received: 6, mercis: 5, dist: 250,
    bio: 'Retraitée de la bibliothèque du quartier. J’aime jaser et je fais d’excellents carrés aux dattes.', can: ['Soutien social', 'Compagnie et répit'],
    known: ['jeannine', 'louis', 'me'],
    thanks: [['karine', 'Thérèse a tenu compagnie à mon père tout un après-midi. Il en parle encore.']],
    face: { skin: 0, hair: 'grey', style: 'bob', glasses: 1, bg: '#FFE0E9', shirt: '#B04E78' } },
  paul: { first: 'Paul', last: 'Tremblay', g: 'm', since: 'juin 2024', given: 41, received: 5, mercis: 31, dist: 300, pro: 'Montage de meubles',
    bio: 'Menuisier. Si ça se visse, se cloue ou se monte, je peux aider.', can: ['Petits travaux', 'Déneigement', 'Transport'],
    services: [['Montage de meubles', '30 $ l’heure'], ['Pose de tablettes et de cadres', '25 $ l’heure'], ['Petites réparations', '30 $ l’heure']], themes: ['Petits travaux'],
    known: ['louis', 'jeannine', 'marcandre', 'sophie', 'nadia', 'me'],
    thanks: [['louis', 'Paul a réparé ma rampe d’escalier en une demi-heure. Fiable et de bonne humeur.'], ['sophie', 'Il a monté le lit de mon plus jeune sans une vis de trop.']],
    face: { skin: 1, hair: 'brown', style: 'short', beard: 1, bg: '#D9ECFF', shirt: '#C4533B' } },
  nadia: { first: 'Nadia', last: 'Benali', g: 'f', since: 'janvier 2025', given: 17, received: 2, mercis: 14, dist: 450, pro: 'Ménage',
    bio: 'Maman de deux enfants. J’organise la guignolée du quartier cette année.', can: ['Aide au quotidien', 'Préparation de repas', 'Courses'],
    services: [['Ménage régulier', '30 $ l’heure'], ['Grand ménage', '35 $ l’heure'], ['Lavage de vitres, côté intérieur', '28 $ l’heure']], themes: ['Ménage'],
    known: ['sophie', 'therese', 'karim', 'me'],
    thanks: [['therese', 'Nadia m’a aidée à laver mes armoires. Douce et efficace.']],
    face: { skin: 2, hair: 'black', style: 'long', bg: '#D8F3E6', shirt: '#178A5E' } },
  louis: { first: 'Louis', last: 'Martel', g: 'm', since: 'novembre 2024', given: 36, received: 3, mercis: 27, dist: 180, pro: 'Déneigement',
    bio: 'Levé avant la charrue. L’hiver, c’est ma saison.', can: ['Déneigement', 'Petits travaux', 'Transport'],
    services: [['Déneigement d’une entrée', '25 $ la fois'], ['Escalier et balcon', '15 $ la fois'], ['Forfait pour tout l’hiver', '320 $']], themes: ['Déneigement'],
    known: ['jeannine', 'paul', 'therese', 'marcandre'],
    thanks: [['jeannine', 'Louis a déneigé mon escalier avant même que je me lève. Un vrai bon voisin.'], ['therese', 'Toujours le premier dehors après une bordée.']],
    face: { skin: 1, hair: 'grey', style: 'bald', beard: 1, bg: '#FFF0C7', shirt: '#3D4A6B' } },
  sophie: { first: 'Sophie', last: 'Lavoie', g: 'f', since: 'avril 2025', given: 9, received: 7, mercis: 8, dist: 350, pro: 'Gardiennage',
    bio: 'Éducatrice en garderie. Deux garçons pleins d’énergie à la maison.', can: ['Aide au quotidien', 'Courses'],
    services: [['Gardiennage en soirée', '16 $ l’heure'], ['Gardiennage de fin de semaine', '15 $ l’heure'], ['Aide aux devoirs', '20 $ l’heure']], themes: ['Garde d’enfants', 'Cours'],
    known: ['nadia', 'paul', 'jeannine'],
    thanks: [['nadia', 'Sophie a gardé mes enfants à la dernière minute. Ils l’adorent.']],
    face: { skin: 0, hair: 'blond', style: 'bun', bg: '#EFE6FF', shirt: '#7F56E8' } },
  karim: { first: 'Karim', last: 'Haddad', g: 'm', since: 'février 2025', given: 22, received: 1, mercis: 19, dist: 500, pro: 'Aide informatique',
    bio: 'Technicien en informatique. Patient avec les tablettes, les imprimantes et leurs propriétaires.', can: ['Aide avec la techno', 'Transport'],
    services: [['Aide avec un ordinateur ou une tablette', '25 $ l’heure'], ['Installation du Wi-Fi et d’une imprimante', '30 $ l’heure'], ['Initiation à la tablette, une heure', '25 $']], themes: ['Aide techno', 'Cours'],
    known: ['nadia', 'therese', 'me'],
    thanks: [['therese', 'Karim a réglé ma tablette et m’a montré comment appeler ma sœur en vidéo.']],
    face: { skin: 3, hair: 'black', style: 'curly', glasses: 1, bg: '#D5F1F2', shirt: '#EC7A1A' } },
  marcandre: { first: 'Marc-André', last: 'Roy', g: 'm', since: 'août 2025', given: 6, received: 4, mercis: 6, dist: 220,
    bio: 'Nouveau dans le quartier. Bricoleur du dimanche, bien outillé.', can: ['Petits travaux', 'Courses'],
    known: ['paul', 'louis', 'me'],
    thanks: [['paul', 'Marc-André prête ses outils sans compter. Merci pour la scie !']],
    face: { skin: 0, hair: 'auburn', style: 'side', glasses: 1, bg: '#FFE6D2', shirt: '#2C7A7B' } },
  jeannine: { first: 'Jeannine', last: 'Côté', g: 'f', since: 'mai 2024', given: 28, received: 12, mercis: 24, dist: 150, pro: 'Couture',
    bio: 'Couturière depuis quarante ans. Dans le quartier depuis toujours.', can: ['Soutien social', 'Compagnie et répit', 'Préparation de repas'],
    services: [['Bord de pantalon', '12 $'], ['Fermeture éclair à remplacer', '18 $'], ['Retouches simples', 'à partir de 10 $']], themes: ['Couture'],
    known: ['louis', 'therese', 'paul', 'sophie', 'me'],
    thanks: [['sophie', 'Jeannine a sauvé l’habit de neige de mon gars la veille de la première tempête.']],
    face: { skin: 0, hair: 'white', style: 'bun', glasses: 1, bg: '#FFE9D6', shirt: '#A9604C' } },
  karine: { first: 'Karine', last: 'Dubé', g: 'f', since: 'octobre 2025', given: 2, received: 3, mercis: 2, dist: 400,
    bio: 'Infirmière de nuit. Je m’occupe de mon père, qui habite à deux rues.', can: ['Aide au quotidien'],
    known: ['therese'],
    thanks: [['therese', 'Karine m’a rapporté mes courses un jour de verglas.']],
    face: { skin: 2, hair: 'brown', style: 'bob', bg: '#DDEBFF', shirt: '#E2457A' } }
};
Object.keys(P).forEach(k => { P[k].id = k; P[k].name = P[k].first + ' ' + P[k].last; });
const NEIGHBOURS = ['therese', 'paul', 'nadia', 'louis', 'sophie', 'karim', 'marcandre', 'jeannine', 'karine'];
const BIZ = {
  fournil: { id: 'fournil', name: 'Le Fournil de la 3e', kind: 'Boulangerie', color: '#E3A857' },
  popote: { id: 'popote', name: 'La Popote des Avenues', kind: 'Organisme', color: '#178A5E' }
};

/* ---------- le fil de départ ---------- */
function seedPosts() {
  return [
    { id: 'p1', type: 'req', by: 'therese', ago: 'il y a 25 min', hood: DEMO_HOOD, fam: 'main', need: 'rdv', title: 'Quelqu’un pour m’accompagner à la pharmacie',
      text: 'J’ai une ordonnance à aller chercher à la pharmacie de la 3e Avenue. Les trottoirs sont glissants et je serais plus rassurée à deux. C’est vingt minutes de marche, aller-retour.',
      when: 'Lundi 16 novembre, le matin', date: day(2), dur: 'Environ 45 minutes', zone: 'Près de la 3e Avenue et de la 8e Rue', offers: [], status: 'open', likes: 0, seed: 3,
      comments: [{ by: 'jeannine', text: 'Je ne suis pas libre lundi, mais je peux mardi si personne ne se manifeste.', ago: 'il y a 10 min' }] },
    { id: 'p2', type: 'req', by: 'karine', ago: 'il y a 2 h', hood: DEMO_HOOD, fam: 'proche', need: 'repit', title: 'Une visite pour mon père de 84 ans', forWho: 'Pour son père, 84 ans',
      text: 'Mon père vit seul sur la 10e Rue. Il aimerait jaser et jouer aux cartes une heure ou deux, mardi après-midi. Il a de bonnes histoires sur le quartier, vous verrez.',
      when: 'Mardi 17 novembre, l’après-midi', date: day(3), dur: 'Une à deux heures', zone: 'Près de la 1re Avenue et de la 10e Rue', offers: [], status: 'open', likes: 0, seed: 9,
      comments: [{ by: 'therese', text: 'Votre père est un bon joueur de 500, je m’en souviens !', ago: 'il y a 1 h' }] },
    { id: 'p3', type: 'req', by: 'me', ago: 'il y a 3 h', hood: DEMO_HOOD, fam: 'main', need: 'lourd', title: 'Monter mes boîtes de Noël du sous-sol',
      text: 'Mes boîtes de décorations sont au sous-sol et elles sont lourdes. J’aurais besoin d’une paire de bras pendant une vingtaine de minutes.',
      when: 'Dimanche 15 novembre, l’après-midi', date: day(1), dur: 'Environ 20 minutes', zone: 'Près de la 3e Avenue et de la 12e Rue', offers: [{ by: 'paul', type: 'gratuite', status: 'pending' }], status: 'open', likes: 0, seed: 5, comments: [] },
    { id: 'p4', type: 'merci', by: 'jeannine', to: 'louis', ago: 'il y a 4 h', hood: DEMO_HOOD, text: 'Louis a déneigé mon escalier avant même que je me lève. Un vrai bon voisin. Merci !', likes: 12,
      comments: [{ by: 'nadia', text: 'Bravo Louis !', ago: 'il y a 3 h' }] },
    { id: 'p5', type: 'event', by: 'nadia', ago: 'hier', hood: DEMO_HOOD, ev: 'e_guignolee', title: 'Guignolée du quartier',
      text: 'On cherche des bénévoles pour passer de porte en porte et pour trier les denrées. Deux heures de votre samedi, et des paniers de Noël pour une centaine de familles du quartier.', likes: 0,
      comments: [{ by: 'louis', text: 'J’apporte mon camion pour les boîtes.', ago: 'hier' }, { by: 'sophie', text: 'On vient en famille !', ago: 'hier' }] },
    { id: 'p6', type: 'news', by: 'marcandre', ago: 'hier', hood: DEMO_HOOD, title: 'Perceuse à prêter',
      text: 'J’ai une perceuse à percussion qui dort dans mon placard. Si vous posez des tablettes cette fin de semaine, écrivez-moi et passez la prendre.', likes: 5,
      comments: [{ by: 'paul', text: 'Bonne idée. J’ai aussi un niveau à prêter.', ago: 'hier' }] },
    { id: 'p7', type: 'offer', by: 'paul', ago: 'hier', hood: DEMO_HOOD, title: 'Libre dimanche matin pour un coup de main', help: 'gratuite',
      text: 'J’ai du temps dimanche matin. Si quelqu’un doit rentrer son bois ou ranger ses meubles de patio avant la prochaine neige, faites-moi signe.', likes: 0, comments: [] },
    { id: 'p8', type: 'news', by: 'sophie', ago: 'il y a 2 jours', hood: DEMO_HOOD, title: 'Poussette à donner',
      text: 'Poussette en bon état, à donner. Elle a promené deux enfants et elle roule encore très bien. Premier arrivé, premier servi.', likes: 7,
      comments: [{ by: 'karine', text: 'Elle est encore disponible ?', ago: 'hier' }, { by: 'sophie', text: 'Oui ! Écris-moi.', ago: 'hier' }] },
    { id: 'p9', type: 'job', biz: 'fournil', ago: 'il y a 2 jours', hood: DEMO_HOOD, title: 'Commis au comptoir',
      job: { kind: 'Temps partiel', pay: '18,50 $ l’heure', place: '3e Avenue, Vieux-Limoilou' },
      text: 'Nous cherchons une personne souriante pour servir au comptoir les samedis et dimanches matin. Aucune expérience demandée : on vous montre tout, et le pain est fourni.', likes: 0, comments: [] },
    { id: 'p10', type: 'job', biz: 'popote', ago: 'il y a 3 jours', hood: DEMO_HOOD, title: 'Bénévoles pour livrer des repas',
      job: { kind: 'Bénévolat', pay: '', place: 'Vieux-Limoilou et Lairet' },
      text: 'Une tournée par semaine, le midi, à pied ou en voiture. Vous apportez un repas chaud à des personnes du quartier, et souvent un peu de conversation.', likes: 0, comments: [] }
  ];
}

/* ---------- les activités ---------- */
function seedEvents() {
  return [
    { id: 'e_soupe', title: 'Soupe du dimanche', d: 1, time: '11 h 30', place: 'Sous-sol de l’église, 8e Avenue', tags: ['Gratuit', 'Accès sans marches'], going: 23, org: 'jeannine', who: ['jeannine', 'therese', 'louis'], sky: 'day', seed: 11,
      desc: 'Une soupe chaude, du pain frais et des voisins. Apportez votre bol si vous y pensez. On en garde toujours pour les personnes qui arrivent tard.' },
    { id: 'e_cafe', title: 'Café-jasette', d: 3, time: '10 h', place: 'Bibliothèque du quartier, 4e Rue', tags: ['Gratuit', 'Accès sans marches'], going: 11, org: 'therese', who: ['therese', 'jeannine', 'karine'], sky: 'dawn', seed: 12, group: 'g_cafe',
      desc: 'Un café, une chaise et de la bonne compagnie. On parle de tout, sauf de politique. Venez seul ou avec un voisin.' },
    { id: 'e_tablette', title: 'Atelier tablette', d: 4, time: '14 h', place: 'Bibliothèque du quartier, 4e Rue', tags: ['Gratuit', 'Accès sans marches'], going: 8, org: 'karim', who: ['karim', 'therese'], sky: 'day', seed: 13, group: 'g_techno',
      desc: 'Apportez votre tablette ou votre cellulaire. On règle un problème à la fois, sans jargon : courriels, photos, appels vidéo.' },
    { id: 'e_57', title: '5 à 7 des voisins', d: 5, time: '17 h', place: 'Microbrasserie de la 3e Avenue', tags: ['Accès sans marches'], going: 34, org: 'marcandre', who: ['marcandre', 'paul', 'sophie', 'nadia'], sky: 'dusk', seed: 14, mine: true,
      desc: 'Pour mettre des visages sur les noms. Chacun paie sa consommation. Les nouveaux arrivants sont attendus de pied ferme.' },
    { id: 'e_corvee', title: 'Corvée de déneigement', d: 7, time: '9 h', place: 'Coin de la 3e Avenue et de la 8e Rue', tags: ['Gratuit'], going: 16, org: 'louis', who: ['louis', 'paul', 'marcandre'], sky: 'snow', seed: 15, group: 'g_brigade',
      desc: 'On dégage les entrées et les escaliers des voisins qui ne peuvent pas le faire. Les pelles sont fournies. Chocolat chaud à la fin.' },
    { id: 'e_troc', title: 'Troc de vêtements d’enfants', d: 8, time: '13 h', place: 'Centre communautaire, 2e Rue', tags: ['Gratuit', 'Accès sans marches'], going: 19, org: 'sophie', who: ['sophie', 'nadia', 'karine'], sky: 'day', seed: 16,
      desc: 'Habits de neige, bottes, tuques : apportez ce qui ne fait plus et repartez avec la bonne taille. Aucun argent ne change de mains.' },
    { id: 'e_repare', title: 'Café-réparation', d: 14, time: '13 h', place: 'Centre communautaire, 2e Rue', tags: ['Gratuit', 'Accès sans marches'], going: 14, org: 'paul', who: ['paul', 'marcandre', 'jeannine'], sky: 'dawn', seed: 17, group: 'g_outils',
      desc: 'Grille-pain, lampe, fermeture éclair : avant de jeter, on essaie de réparer ensemble. Apportez l’objet et sa pièce si vous l’avez.' },
    { id: 'e_guignolee', title: 'Guignolée du quartier', d: 21, time: '9 h', place: 'Départ du centre communautaire, 2e Rue', tags: ['Gratuit', 'Transport offert'], going: 27, org: 'nadia', who: ['nadia', 'louis', 'sophie', 'me'], sky: 'snow', seed: 18, mine: true,
      desc: 'Porte-à-porte le matin, tri des denrées l’après-midi. Deux heures suffisent. Les paniers vont à une centaine de familles du quartier.' },
    { id: 'e_marche', title: 'Marché de Noël', d: 28, time: '10 h', place: '3e Avenue, entre la 6e Rue et la 10e Rue', tags: ['Gratuit', 'Accès sans marches'], going: 58, org: 'jeannine', who: ['jeannine', 'nadia', 'karim', 'sophie'], sky: 'night', seed: 19, lights: true,
      desc: 'Les artisans du quartier, du vin chaud sans alcool et une chorale à 15 h. La rue est fermée aux voitures pour la journée.' }
  ];
}
function seedGroups() {
  return [
    { id: 'g_outils', name: 'Prêt d’outils', members: 96, joined: true, icon: 'tool', color: 'orange', desc: 'On se prête perceuses, échelles et pelles au lieu d’en acheter.',
      posts: [['marcandre', 'Ma perceuse à percussion est libre toute la fin de semaine.', 'hier'], ['paul', 'Quelqu’un a une scie à onglets ? J’en aurais besoin jeudi.', 'il y a 3 jours']] },
    { id: 'g_brigade', name: 'Brigade de déneigement', members: 52, joined: true, icon: 'snow', color: 'blue', desc: 'Après chaque bordée, on dégage les entrées des voisins qui ne peuvent pas le faire.',
      posts: [['louis', 'Première corvée de la saison samedi prochain, 9 h. Qui en est ?', 'il y a 5 h']] },
    { id: 'g_conseil', name: 'Conseil de quartier', members: 214, joined: false, icon: 'users', color: 'ink', desc: 'Les séances publiques, les projets et les consultations du Vieux-Limoilou.',
      posts: [['nadia', 'Prochaine séance publique mercredi 25 novembre. À l’ordre du jour : la rue piétonne d’hiver.', 'il y a 2 jours']] },
    { id: 'g_cafe', name: 'Café-jasette', members: 38, joined: false, icon: 'coffee', color: 'rose', desc: 'Un café, une chaise, des voisins. Tous les mardis matin.',
      posts: [['therese', 'Mardi, j’apporte mes carrés aux dattes.', 'hier']] },
    { id: 'g_jardin', name: 'Jardin communautaire', members: 67, joined: false, icon: 'sun', color: 'green', desc: 'Les jardinets de la 4e Rue. L’hiver, on planifie les semis.',
      posts: [['jeannine', 'Les bacs sont rangés pour l’hiver. Merci aux six paires de bras !', 'il y a 4 jours']] },
    { id: 'g_techno', name: 'Entraide techno', members: 45, joined: false, icon: 'phone', color: 'mauve', desc: 'Tablettes, cellulaires, ordinateurs : on s’explique les choses sans jargon.',
      posts: [['karim', 'Atelier tablette mercredi à la bibliothèque. Apportez vos questions.', 'hier']] }
  ];
}

/* ---------- les messages ---------- */
function seedConvs() {
  return [
    { id: 'c_paul', with: 'paul', online: true, post: 'p3', unread: 1, time: '10 h 42',
      quick: ['Oui, ça me va', 'Non, une autre heure', 'Pouvez-vous préciser ?'], reply: 'Parfait. À dimanche !',
      msgs: [{ from: 'paul', t: '10 h 41', text: 'Bonjour Julie ! Je peux passer dimanche pour vos boîtes de Noël.' }, { from: 'paul', t: '10 h 42', text: 'Vers 14 h, ça vous irait ?' }] },
    { id: 'c_guignolee', group: true, name: 'Bénévoles guignolée', members: ['nadia', 'louis', 'sophie', 'me'], unread: 2, time: '9 h 15',
      quick: ['J’y serai', 'Je ne peux pas', 'À quelle heure ?'],
      msgs: [{ from: 'nadia', t: 'Hier', text: 'Bonjour l’équipe ! On se retrouve le 5 décembre à 9 h au centre communautaire.' }, { from: 'louis', t: 'Hier', text: 'J’apporte mon camion pour transporter les boîtes.' }, { from: 'sophie', t: '9 h 12', text: 'Qui peut m’aider à trier les denrées l’après-midi ?' }, { from: 'nadia', t: '9 h 15', text: 'Julie, on compte sur toi pour le porte-à-porte de la 12e Rue ?' }] },
    { id: 'c_therese', with: 'therese', online: false, unread: 0, time: 'Hier',
      quick: ['Avec plaisir', 'Je vous écris demain', 'Merci !'], reply: 'Vous êtes bien fine. Bonne soirée !',
      msgs: [{ from: 'me', t: 'Hier', text: 'Bien rentrée, madame Gagnon ?' }, { from: 'therese', t: 'Hier', voice: '0:14' }, { from: 'therese', t: 'Hier', text: 'Merci encore pour la clinique. Je vous garde des carrés aux dattes.' }] },
    { id: 'c_marcandre', with: 'marcandre', online: true, unread: 0, time: 'Jeudi',
      quick: ['Merci !', 'Je passe ce soir', 'C’est noté'], reply: 'Pas de trouble. Sonne en arrivant.',
      msgs: [{ from: 'marcandre', t: 'Jeudi', text: 'Regarde la 3e Avenue ce matin. L’hiver est arrivé !' }, { from: 'marcandre', t: 'Jeudi', photo: 21 }, { from: 'me', t: 'Jeudi', text: 'Magnifique. Je sors ma pelle.' }] },
    { id: 'c_karim', with: 'karim', online: false, unread: 0, time: 'Lundi',
      quick: ['Tout fonctionne', 'Encore un souci', 'Merci Karim'], reply: 'Tant mieux. Bonne journée !',
      msgs: [{ from: 'me', t: 'Lundi', text: 'Merci pour l’imprimante de ma classe. Elle n’a jamais si bien fonctionné.' }, { from: 'karim', t: 'Lundi', text: 'Avec plaisir. Le Wi-Fi tient bon aussi ?' }] }
  ];
}

/* ---------- les notifications ---------- */
function seedNotifs() {
  return [
    { id: 'n1', icon: 'hand', tone: 'rose', title: 'Paul peut vous aider', text: 'Pour monter vos boîtes de Noël, dimanche après-midi.', ago: 'il y a 12 min', isNew: true, go: 'trust:p3:paul' },
    { id: 'n2', icon: 'pin', tone: 'rose', title: 'Nouvelle demande près de chez vous', text: 'Thérèse cherche quelqu’un pour l’accompagner à la pharmacie.', ago: 'il y a 25 min', isNew: true, go: 'post:p1' },
    { id: 'n3', icon: 'snow', tone: 'blue', title: 'Avis du quartier', text: 'Opération déneigement cette nuit. Le stationnement est interdit dans les rues où les feux clignotent.', ago: 'il y a 1 h', isNew: true, go: '' },
    { id: 'n4', icon: 'cal', tone: 'mauve', title: 'Rappel : 5 à 7 des voisins', text: 'Jeudi 19 novembre, 17 h, à la microbrasserie de la 3e Avenue.', ago: 'hier', isNew: false, go: 'event:e_57' },
    { id: 'n5', icon: 'heart', tone: 'cream', title: 'Thérèse vous a dit merci', text: '« Julie m’a accompagnée à la clinique et elle a attendu avec moi. Une perle. »', ago: 'hier', isNew: false, go: 'profile:me' },
    { id: 'n6', icon: 'users', tone: 'orange', title: 'Prêt d’outils', text: 'Marc-André a publié : « Ma perceuse à percussion est libre toute la fin de semaine. »', ago: 'hier', isNew: false, go: 'group:g_outils' },
    { id: 'n7', icon: 'houses', tone: 'blue', title: 'Bienvenue dans Entre Voisins', text: 'Lisez le fil du quartier, ou dites-nous de quoi vous avez besoin.', ago: 'il y a 3 jours', isNew: false, go: '' }
  ];
}

/* ---------- Services du quartier ---------- */
const THEMES = {
  'Déneigement': ['deneig', 'neige', 'pelle', 'pellet', 'entree', 'souffleuse', 'glace'],
  'Ménage': ['menage', 'nettoy', 'laver', 'lavage', 'vitre', 'balayeuse', 'propre'],
  'Petits travaux': ['travaux', 'meuble', 'monter', 'montage', 'repar', 'tablette murale', 'peintur', 'bricol', 'cadre', 'menuis'],
  'Courses': ['course', 'epicerie', 'commission', 'pharmacie', 'livraison'],
  'Aide techno': ['techno', 'ordinateur', 'tablette', 'cellulaire', 'wifi', 'wi-fi', 'internet', 'imprimante', 'informatique', 'telephone'],
  'Compagnie': ['compagnie', 'visite', 'jaser', 'presence'],
  'Couture': ['coutur', 'retouche', 'bord', 'pantalon', 'fermeture', 'repriser', 'ourlet'],
  'Jardinage': ['jardin', 'gazon', 'feuille', 'tondre', 'tonte', 'haie', 'plante'],
  'Garde d’animaux': ['animal', 'animaux', 'chien', 'chat', 'promen'],
  'Garde d’enfants': ['enfant', 'gardien', 'garde', 'bebe', 'garderie'],
  'Cours': ['cours', 'tutorat', 'devoir', 'lecon', 'initiation', 'apprendre']
};
const REFUSED = [
  ['Repas vendus', ['repas', 'traiteur', 'plats cuisin', 'nourriture', 'gateau', 'patisserie', 'cuisine a vendre']],
  ['Transport payé', ['transport', 'taxi', 'chauffeur', 'covoiturage', 'raccompagn', 'navette']],
  ['Soins à la personne', ['soins personnels', 'soins a la personne', 'soins a domicile', 'soins infirmiers', 'soins de', 'bain', 'toilette', 'medicament', 'injection', 'infirmi', 'massage', 'pedicure']]
];
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/* ---------- conditions d’utilisation : texte de démonstration ---------- */
const TERMS = [
  ['Ce que fait Entre Voisins', 'Entre Voisins met en contact les habitants d’un même quartier de la ville de Québec pour qu’ils s’entraident. Nous ne fournissons aucun service nous-mêmes : nous faisons se rencontrer des voisins. Pour créer un compte, vous devez avoir 18 ans ou plus.'],
  ['L’identité des membres', 'Nous ne vérifions pas l’identité des membres. Nous confirmons seulement un courriel et un numéro de téléphone. Soyez prudent, comme avec toute personne que vous rencontrez pour la première fois, et lisez nos conseils de prudence.'],
  ['Les arrangements entre voisins', 'L’entraide bénévole est gratuite, et le restera. Des voisins peuvent aussi convenir d’un remboursement de frais ou d’une rémunération. Ces arrangements se font entre eux. Entre Voisins ne prend aucune commission, ne gère aucun paiement entre voisins et ne garantit aucun service.'],
  ['Les signalements', 'Vous pouvez signaler une personne ou une publication en tout temps. Vos échanges avec la personne signalée sont coupés tout de suite. Une personne de notre équipe examine chaque signalement. Aucun compte n’est suspendu automatiquement.'],
  ['Les renseignements que nous gardons', 'Nous gardons votre courriel, votre numéro de téléphone, votre photo, votre quartier, vos publications et vos messages. Votre numéro et votre adresse ne sont jamais affichés aux autres membres. Vos voisins voient une distance approximative et une zone floue sur une carte.'],
  ['Les urgences', 'Entre Voisins n’est pas un service d’urgence. Si vous êtes en danger, ou si une personne est en danger, appelez le 911.'],
  ['Politique de confidentialité', 'Vos renseignements servent seulement à faire fonctionner l’application. Nous ne les vendons pas. Vous pouvez les consulter, les corriger ou supprimer votre compte en tout temps, à partir de l’onglet Moi. Quand vous supprimez votre compte, nous effaçons votre fiche, votre photo, vos demandes et vos messages. Les mercis que vous avez écrits restent, sans votre nom.']
];
