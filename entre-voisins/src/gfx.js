/* =====================================================================
   Entre Voisins — dessins : icônes au trait, visages, maisons, carte
   ===================================================================== */
const IC = {
  home:'<path d="M3 10.500 12 3l9 7.500V20a1.500 1.500 0 0 1-1.500 1.500h-15A1.500 1.500 0 0 1 3 20z"/><path d="M9.500 21.500v-7h5v7"/>',
  chat:'<path d="M21 11.500a8.400 8.400 0 0 1-.900 3.800 8.500 8.500 0 0 1-7.600 4.700 8.400 8.400 0 0 1-3.800-.900L3 21l1.900-5.700a8.400 8.400 0 0 1-.900-3.800 8.500 8.500 0 0 1 4.700-7.600 8.400 8.400 0 0 1 3.800-.900h.500a8.500 8.500 0 0 1 8 8z"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  cal:'<rect x="3" y="4.500" width="18" height="17" rx="2.500"/><path d="M16 2.500v4M8 2.500v4M3 10h18"/>',
  user:'<path d="M20 21v-1.500a4.500 4.500 0 0 0-4.500-4.500h-7A4.500 4.500 0 0 0 4 19.500V21"/><circle cx="12" cy="7.500" r="4"/>',
  bell:'<path d="M18 8.500a6 6 0 0 0-12 0c0 7-3 8.500-3 8.500h18s-3-1.500-3-8.500"/><path d="M13.700 20.500a2 2 0 0 1-3.400 0"/>',
  search:'<circle cx="11" cy="11" r="7.500"/><path d="m21 21-4.600-4.600"/>',
  right:'<path d="m9 18 6-6-6-6"/>',
  left:'<path d="m15 18-6-6 6-6"/>',
  down:'<path d="m6 9 6 6 6-6"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  heart:'<path d="M20.800 4.600a5.500 5.500 0 0 0-7.800 0L12 5.700l-1-1.100a5.500 5.500 0 0 0-7.800 7.800l1 1.100L12 21.200l7.800-7.700 1-1.100a5.500 5.500 0 0 0 0-7.800z"/>',
  share:'<path d="M4 12v7.500A1.500 1.500 0 0 0 5.500 21h13a1.500 1.500 0 0 0 1.500-1.500V12"/><path d="m16 6-4-4-4 4M12 2v13"/>',
  more:'<circle cx="5" cy="12" r="1.300"/><circle cx="12" cy="12" r="1.300"/><circle cx="19" cy="12" r="1.300"/>',
  pin:'<path d="M20.500 10c0 6.500-8.500 12-8.500 12S3.500 16.500 3.500 10a8.500 8.500 0 0 1 17 0z"/><circle cx="12" cy="10" r="3"/>',
  clock:'<circle cx="12" cy="12" r="9.500"/><path d="M12 6.500V12l3.500 2"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  users:'<path d="M16.500 21v-1.500a4 4 0 0 0-4-4h-7a4 4 0 0 0-4 4V21"/><circle cx="9" cy="7.500" r="4"/><path d="M22.500 21v-1.500a4 4 0 0 0-3-3.900M15.500 3.600a4 4 0 0 1 0 7.800"/>',
  case:'<rect x="2.500" y="7" width="19" height="13.500" rx="2.500"/><path d="M16 20.500V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v15.500"/>',
  mic:'<rect x="9" y="1.500" width="6" height="13" rx="3"/><path d="M19 10.500V12a7 7 0 0 1-14 0v-1.500M12 19v3.500M8.500 22.500h7"/>',
  camera:'<path d="M22.500 18.500a2 2 0 0 1-2 2h-17a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2H7l2-3h6l2 3h3.500a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="2.500"/><circle cx="8.500" cy="8.500" r="1.500"/><path d="m21 15-5-5L5 21"/>',
  send:'<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
  mail:'<rect x="2.500" y="4.500" width="19" height="15" rx="2.500"/><path d="m3 7 9 6 9-6"/>',
  lock:'<rect x="3.500" y="11" width="17" height="10.500" rx="2.500"/><path d="M7.500 11V7.500a4.500 4.500 0 0 1 9 0V11"/>',
  flag:'<path d="M4.500 15s1-1 4-1 5 2 8 2 3.500-1 3.500-1V3.500s-.500 1-3.500 1-5-2-8-2-4 1-4 1zM4.500 22v-7"/>',
  eye:'<path d="M1.500 12S5.500 4.500 12 4.500 22.500 12 22.500 12 18.500 19.500 12 19.500 1.500 12 1.500 12z"/><circle cx="12" cy="12" r="3"/>',
  edit:'<path d="M17 3a2.800 2.800 0 1 1 4 4L7.500 20.500 2 22l1.500-5.500z"/>',
  trash:'<path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M8.500 6V4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2"/>',
  out:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  phone:'<rect x="5.500" y="2" width="13" height="20" rx="2.500"/><path d="M11 18.500h2"/>',
  tool:'<path d="M14.700 6.300a1 1 0 0 0 0 1.400l1.600 1.600a1 1 0 0 0 1.400 0l3.800-3.800a6 6 0 0 1-8 8l-6.900 6.900a2.100 2.100 0 0 1-3-3l6.900-6.900a6 6 0 0 1 8-8z"/>',
  bag:'<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/>',
  coffee:'<path d="M18 8.500h1a3.500 3.500 0 0 1 0 7h-1M2.500 8.500H18v8a4 4 0 0 1-4 4H6.500a4 4 0 0 1-4-4zM6.500 2v3M10.500 2v3M14.500 2v3"/>',
  info:'<circle cx="12" cy="12" r="9.500"/><path d="M12 16.500v-5M12 7.700v.300"/>',
  alert:'<path d="M10.300 3.900 1.800 18a2 2 0 0 0 1.700 3h17a2 2 0 0 0 1.700-3L13.700 3.900a2 2 0 0 0-3.400 0zM12 9v4.500M12 17v.300"/>',
  play:'<path d="M7 4 19 12 7 20z"/>',
  grid:'<rect x="3.500" y="3.500" width="7" height="7" rx="1.800"/><rect x="13.500" y="3.500" width="7" height="7" rx="1.800"/><rect x="3.500" y="13.500" width="7" height="7" rx="1.800"/><rect x="13.500" y="13.500" width="7" height="7" rx="1.800"/>',
  box:'<path d="M21 16V8a2 2 0 0 0-1-1.700l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.700l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.700z"/><path d="m3.300 7 8.700 5 8.700-5M12 22V12"/>',
  sliders:'<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1.500 14h5M9.500 8h5M17.500 16h5"/>',
  hand:'<path d="M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2M10 10.500V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.800 0-4.500-.900-6-2.300l-3.600-3.600a2 2 0 0 1 2.800-2.800L7 15"/>',
  snow:'<path d="M2 12h20M12 2v20M20 16l-4-4 4-4M4 8l4 4-4 4M16 4l-4 4-4-4M8 20l4-4 4 4"/>',
  news:'<path d="m3 11 18-5v12L3 14z"/><path d="M11.600 16.800a3 3 0 1 1-5.800-1.600"/>',
  houses:'<path d="M2.500 21V11L8 6.500l5.500 4.500v10M13.500 21v-6.500l3.500-3 4.500 3.700V21M1.500 21h21M7 21v-4.500h2V21"/>',
  car:'<path d="M19 17h2a1 1 0 0 0 1-1v-3c0-.900-.700-1.700-1.500-1.900C18.700 10.600 16 10 16 10s-1.300-1.400-2.200-2.300c-.500-.400-1.100-.700-1.800-.700H5c-.600 0-1.100.400-1.400.900l-1.400 2.900A3.700 3.700 0 0 0 2 12v4a1 1 0 0 0 1 1h2M9 17h6"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
  paw:'<circle cx="6.500" cy="10" r="1.700"/><circle cx="10.500" cy="6" r="1.700"/><circle cx="15.500" cy="6.500" r="1.700"/><circle cx="18.500" cy="11" r="1.700"/><path d="M8 17c0-2.600 2-4.700 4.400-4.700s4.100 1.900 4.100 4.400c0 1.800-1.200 3-2.700 3-1 0-1.400-.500-2.100-.500s-1.300.600-2.200.600C8.600 19.800 8 18.700 8 17z"/>',
  fork:'<path d="M3 2v7a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6a2 2 0 0 0 2 2zm0 0v7"/>',
  smile:'<circle cx="12" cy="12" r="9.500"/><path d="M8 14s1.500 2 4 2 4-2 4-2M9 9.300v.300M15 9.300v.300"/>',
  store:'<path d="M4 10.500V20.500h16V10.500"/><path d="M2.500 7 4.500 3h15l2 4a3 3 0 0 1-5.500 1.300 3 3 0 0 1-4.500.200 3 3 0 0 1-4.500-.200A3 3 0 0 1 2.500 7z"/><path d="M9.500 20.500v-5.500h5v5.500"/>',
  link:'<path d="M10 13a5 5 0 0 0 7.500.500l3-3a5 5 0 0 0-7-7l-1.700 1.700M14 11a5 5 0 0 0-7.500-.500l-3 3a5 5 0 0 0 7 7l1.700-1.700"/>',
  ban:'<circle cx="12" cy="12" r="9.500"/><path d="m5.300 5.300 13.400 13.400"/>',
  wave:'<path d="M3 12v0M6.500 9v6M10 5.500v13M13.500 8.500v7M17 6.500v11M20.500 10v4"/>',
  sun:'<circle cx="12" cy="12" r="4.200"/><path d="M12 2v2.500M12 19.500V22M4.900 4.900l1.800 1.800M17.300 17.300l1.800 1.800M2 12h2.500M19.500 12H22M4.900 19.100l1.800-1.800M17.300 6.700l1.800-1.800"/>',
  key:'<circle cx="7.500" cy="15.500" r="4.500"/><path d="m10.700 12.300 9.800-9.800M17 6l3 3M14 9l2 2"/>',
  receipt:'<path d="M5 2.500v19l2.300-1.500 2.400 1.500 2.300-1.500 2.300 1.500 2.400-1.500 2.300 1.500v-19l-2.300 1.500L14.300 2.500 12 4 9.700 2.500 7.300 4z"/><path d="M8.500 9h7M8.500 13h7"/>'
};
function ic(n, s = 22, cls = '') {
  return `<svg class="ic ${cls}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n] || ''}</svg>`;
}
/* cœur plein, pour les mercis */
function heartFull(s = 16) {
  return `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${IC.heart}</svg>`;
}

/* ---------- outils ---------- */
function rng(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const c = v => Math.max(0, Math.min(255, v + amt));
  return '#' + ((1 << 24) + (c(n >> 16) << 16) + (c((n >> 8) & 255) << 8) + c(n & 255)).toString(16).slice(1);
}

/* ---------- logo ---------- */
function logo(s = 32) {
  return `<svg class="logo" width="${s}" height="${s}" viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="14" fill="#2F62E0"/><path d="M7.500 35.500V22.500l9.500-8.500 9.500 8.500v13z" fill="#fff"/><path d="M21.500 35.500V22.500L31 14l9.500 8.500v13z" fill="#fff" opacity=".62"/><path d="M24 33.200l-4.400-4.300a2.750 2.750 0 0 1 3.900-3.900l.500.500.500-.500a2.750 2.750 0 0 1 3.900 3.900z" fill="#E2457A"/></svg>`;
}
function wordmark(tap) {
  return `<span class="wm"${tap ? ' data-a="tapLogo"' : ''}>${logo(26)}<span>Entre<b>Voisins</b></span></span>`;
}

/* ---------- visages dessinés ---------- */
const SKIN = ['#F8D9C0', '#F0C4A2', '#DDA77F', '#BD8459', '#8E5D3C'];
const HAIR = { black: '#2A2422', brown: '#5B3A29', auburn: '#A5562B', blond: '#D8B26A', grey: '#A9ABB5', white: '#E6E6EC' };
function faceSVG(f) {
  const sk = SKIN[f.skin], sk2 = shade(sk, -24), h = HAIR[f.hair], line = '#2A2430';
  const cap = `<path d="M19.500 29C17.500 17 24 11.500 32 11.500S46.500 17 44.500 29c-1-4.500-3-7.500-6.500-8.500-4 1.500-10 1.500-13 0-2.500 1-4.500 4-5.500 8.500z" fill="${h}"/>`;
  const fringe = `<path d="M20 28c-.500-10 5-14.500 12-14.500S44.500 18 44 28c-2.500-5-6.500-7.500-12-7.500S22.500 23 20 28z" fill="${h}"/>`;
  let back = '', front = '';
  switch (f.style) {
    case 'side': front = `<path d="M19.500 29C17.500 17 24 11 33 11.500c8 .500 13.500 6 11.500 17.500-1-4-2.500-6.500-4.500-8-5 1.500-12 .500-16-3.500-2 2.500-3.500 6.500-4.500 11.500z" fill="${h}"/>`; break;
    case 'bob': back = `<path d="M17 31C15 14 25 9.500 32 9.500S49 14 47 31v11c0 3.500-4.500 4-6 2H23c-1.500 2-6 1.500-6-2z" fill="${h}"/>`; front = fringe; break;
    case 'long': back = `<path d="M16 31C14 13 25 9 32 9s18 4 16 22l1.500 23h-35z" fill="${h}"/>`; front = `<path d="M20 29c-1-11 5-16 13-16 7 0 12 5 11 16-1.500-5-4-8-8-9-5 2-11 2.500-14 1-1 2.500-1.500 5-2 8z" fill="${h}"/>`; break;
    case 'bun': back = `<circle cx="32" cy="9.500" r="5.500" fill="${h}"/>`; front = cap; break;
    case 'bald': front = `<path d="M19.800 30.500c-1.500-4.500-.800-8.500 1.400-11 .200 3.700.200 7.400-.200 11zM44.200 30.500c1.500-4.500.800-8.500-1.400-11-.200 3.700-.200 7.400.200 11z" fill="${h}"/>`; break;
    case 'curly': front = [[23, 18, 5], [28.500, 14.500, 5.500], [35.500, 14.500, 5.500], [41, 18, 5], [20.500, 23.500, 3.800], [43.500, 23.500, 3.800], [32, 13, 5]].map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="${c[2]}" fill="${h}"/>`).join(''); break;
    default: front = cap;
  }
  const beard = f.beard ? `<path d="M20.700 31c0 10 5 14.800 11.300 14.800S43.300 41 43.300 31c-1 4.500-4.300 6.500-11.300 6.500S21.700 35.500 20.700 31z" fill="${h}"/>` : '';
  const glasses = f.glasses ? `<g fill="none" stroke="${line}" stroke-width="1.300"><circle cx="27" cy="29.500" r="3.900"/><circle cx="37" cy="29.500" r="3.900"/><path d="M30.900 29.500h2.200M23.100 29l-2.800-1M40.900 29l2.800-1"/></g>` : '';
  return `<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" fill="${f.bg}"/>${back}<path d="M8 64c0-13 12-17 24-17s24 4 24 17z" fill="${f.shirt}"/><rect x="27.500" y="38" width="9" height="13" rx="4.500" fill="${sk2}"/><circle cx="20.300" cy="30" r="2.300" fill="${sk}"/><circle cx="43.700" cy="30" r="2.300" fill="${sk}"/><ellipse cx="32" cy="29" rx="12" ry="13.500" fill="${sk}"/>${front}<circle cx="24.800" cy="34" r="2.400" fill="#EE6F86" opacity=".26"/><circle cx="39.200" cy="34" r="2.400" fill="#EE6F86" opacity=".26"/>${beard}<circle cx="27" cy="29.500" r="1.350" fill="${line}"/><circle cx="37" cy="29.500" r="1.350" fill="${line}"/><path d="M31.200 32.900q.800.800 1.600 0" fill="none" stroke="${sk2}" stroke-width="1.100" stroke-linecap="round"/><path d="M27.800 35.600q4.200 3.300 8.400 0" fill="none" stroke="${f.beard ? '#fff' : line}" stroke-width="1.400" stroke-linecap="round"/>${glasses}</svg>`;
}

/* ---------- maisons du Vieux-Limoilou : façades colorées, corniches, balcons, escaliers extérieurs ---------- */
const SKY = {
  day: ['#B9D9F6', '#EAF4FF'], dawn: ['#FFC6B3', '#FFEBD6'], dusk: ['#43387F', '#EE9FB3'],
  night: ['#131A44', '#3A4890'], snow: ['#C4D2E8', '#EDF1F8']
};
const FACADE = ['#C4533B', '#E3A857', '#7BA7CC', '#86B58F', '#DB8FA8', '#A98AD3', '#EAD9A0', '#A9604C', '#5C90AA', '#F1B77E', '#D46A4C', '#9DB7D5'];
function houses(seed, o = {}) {
  const w = o.w || 360, h = o.h || 150, sky = o.sky || 'day';
  const r = rng(seed * 7919 + 13), pick = a => a[Math.floor(r() * a.length)], n1 = v => v.toFixed(1);
  const dark = sky === 'night' || sky === 'dusk', id = 'sk' + seed + sky + w;
  const [c1, c2] = SKY[sky], G = h - 14;
  let s = `<svg class="art" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#${id})"/>`;
  const ax = w * (.66 + r() * .2), ay = Math.max(16, G - 150 - r() * 20);
  if (dark) {
    for (let i = 0; i < Math.round(w * h / 2400); i++) s += `<circle cx="${n1(r() * w)}" cy="${n1(r() * (G - 60))}" r="${n1(.400 + r() * .700)}" fill="#fff" opacity="${(.350 + r() * .600).toFixed(2)}"/>`;
    s += `<circle cx="${n1(ax)}" cy="${n1(ay)}" r="9" fill="#FFF2C2"/><circle cx="${n1(ax + 4.500)}" cy="${n1(ay - 2.500)}" r="8" fill="${shade(c1, 6)}"/>`;
  } else if (sky !== 'snow') {
    s += `<circle cx="${n1(ax)}" cy="${n1(ay + 8)}" r="11" fill="#FFF6D6"/>`;
    for (let i = 0; i < 2; i++) { const cx = r() * w * .800, cy = 14 + r() * 26; s += `<g fill="#fff" opacity=".800"><ellipse cx="${n1(cx)}" cy="${n1(cy)}" rx="17" ry="5.500"/><ellipse cx="${n1(cx + 11)}" cy="${n1(cy - 4)}" rx="10" ry="5"/></g>`; }
  }
  /* toits au loin */
  let bx = -20; const bc = dark ? shade(c1, 26) : shade(c2, -26);
  while (bx < w + 20) { const bw = 28 + r() * 30, bt = G - (78 + r() * 34); s += `<rect x="${n1(bx)}" y="${n1(bt)}" width="${n1(bw + 1)}" height="${n1(G - bt)}" fill="${bc}" opacity=".500"/>`; bx += bw; }
  /* rangée de maisons */
  let x = -8 - Math.round(r() * 22);
  while (x < w + 8) {
    const hw = Math.round(52 + r() * 22), floors = r() < .600 ? 3 : 2, fh = 25, hh = floors * fh + 10, top = G - hh;
    const col = pick(FACADE), dk = shade(col, -36), iron = '#23263A';
    s += `<rect x="${x}" y="${top}" width="${hw}" height="${hh}" fill="${col}"/><rect x="${x + hw - 3}" y="${top}" width="3" height="${hh}" fill="#000" opacity=".100"/>`;
    s += `<rect x="${x - 2}" y="${top - 4}" width="${hw + 4}" height="7" rx="1.500" fill="${dk}"/><rect x="${x - 3}" y="${top - 8}" width="${hw + 6}" height="5.500" rx="2.750" fill="#fff"/>`;
    const n = hw > 64 ? 3 : 2, pad = 9, step = (hw - 2 * pad - 10) / (n - 1), door = r() < .500 ? 0 : n - 1;
    for (let f = 0; f < floors; f++) {
      const wy = top + 11 + f * fh;
      for (let i = 0; i < n; i++) {
        const wx = x + pad + i * step;
        if (f === floors - 1 && i === door) {
          s += `<rect x="${n1(wx)}" y="${G - 19}" width="10" height="19" rx="1.500" fill="${shade(col, -78)}"/><rect x="${n1(wx + 2.500)}" y="${G - 16}" width="5" height="5" rx="1" fill="${dark ? '#FFD98A' : '#EAF2FF'}"/>`;
          continue;
        }
        const lit = dark ? r() < .620 : r() < .120;
        s += `<rect x="${n1(wx)}" y="${wy}" width="10" height="13" rx="1.500" fill="${lit ? '#FFD98A' : (dark ? '#27305E' : '#E4EEFA')}" stroke="#fff" stroke-opacity="${dark ? .450 : .900}" stroke-width="1.200"/>`;
      }
      if (f < floors - 1) {
        const by = wy + 16.500; let rl = '';
        for (let k = x + 5.500; k < x + hw - 4; k += 3.500) rl += `M${n1(k)} ${by - 6}v6`;
        s += `<path d="${rl}M${x + 4} ${by - 6}h${hw - 8}" stroke="${iron}" stroke-width=".900" fill="none" opacity=".750"/><rect x="${x + 3}" y="${by}" width="${hw - 6}" height="2.200" rx=".500" fill="${dk}"/>`;
      }
    }
    /* escalier extérieur, du trottoir au premier balcon */
    if (r() < .800) {
      const by = top + 11 + (floors - 2) * fh + 16.500, rise = G - by, steps = 8, dy = rise / steps, dx = 3;
      const dir = door === 0 ? -1 : 1, sx = door === 0 ? x + hw - 5 : x + 5;
      let p = `M${sx} ${G}`;
      for (let k = 0; k < steps; k++) p += `v${(-dy).toFixed(2)}h${dir * dx}`;
      s += `<path d="${p}" stroke="${iron}" stroke-width="1.500" fill="none" stroke-linejoin="miter"/><path d="M${sx} ${G - 8}L${sx + dir * dx * steps} ${n1(by - 8)}M${sx} ${G}v-8" stroke="${iron}" stroke-width="1.100" fill="none"/>`;
    }
    x += hw + (r() < .180 ? 5 : 0);
  }
  /* arbre nu et lampadaire */
  const tx = Math.round(w * (.120 + r() * .200));
  s += `<path d="M${tx} ${G + 2}v-30M${tx} ${G - 12}l-7-10M${tx} ${G - 17}l8-11M${tx} ${G - 24}l-5-8M${tx} ${G - 26}l4-7M${tx - 7} ${G - 22}l-4-1M${tx + 8} ${G - 28}l4 0" stroke="${dark ? '#151833' : '#4A4257'}" stroke-width="1.700" fill="none" stroke-linecap="round"/>`;
  const lx = Math.round(w * (.700 + r() * .200));
  s += `<path d="M${lx} ${G + 2}v-36q0-4 4-4" stroke="#23263A" stroke-width="1.600" fill="none" stroke-linecap="round"/><circle cx="${lx + 5}" cy="${G - 37}" r="2.600" fill="${dark ? '#FFE9A8' : '#fff'}"/>${dark ? `<circle cx="${lx + 5}" cy="${G - 37}" r="9" fill="#FFE9A8" opacity=".220"/>` : ''}`;
  if (o.lights) {
    const cols = ['#FF6B6B', '#FFD166', '#6BCB77', '#4D96FF', '#FF9CEE']; let d = '';
    for (let k = 0; k <= 16; k++) { const t = k / 16, lxx = t * w, lyy = G - 96 + Math.sin(t * Math.PI * 3) * 7 + 9; d += `<circle cx="${n1(lxx)}" cy="${n1(lyy)}" r="2.200" fill="${cols[k % 5]}"/>`; }
    s += d;
  }
  /* neige au sol et flocons */
  s += `<path d="M0 ${G}q${w / 8} -4 ${w / 4} 0t${w / 4} 0 ${w / 4} 0 ${w / 4} 0V${h}H0z" fill="#fff"/>`;
  if (sky === 'snow' || dark || o.flakes) for (let i = 0; i < Math.round(w * h / 700); i++) s += `<circle cx="${n1(r() * w)}" cy="${n1(r() * G)}" r="${n1(.700 + r() * 1.100)}" fill="#fff" opacity="${(.500 + r() * .500).toFixed(2)}"/>`;
  return s + '</svg>';
}

/* ---------- carte du quartier, avec une zone floue ---------- */
function mapSVG(seed) {
  const r = rng(seed * 31 + 7), w = 340, h = 160, cx = Math.round(110 + r() * 120), cy = Math.round(58 + r() * 44), id = 'bl' + seed;
  let s = `<svg class="art" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Carte du quartier avec une zone approximative"><defs><filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter></defs><rect width="${w}" height="${h}" fill="#DCE1EA"/><g transform="rotate(-13 ${w / 2} ${h / 2})">`;
  for (let i = -2; i < 10; i++) for (let j = -3; j < 8; j++) {
    const bx = i * 47 - 18 + (i > 3 ? 5 : 0), by = j * 33 - 26;
    const park = (i === 6 && (j === 0 || j === 1)) || (i === 0 && j === 3);
    s += `<rect x="${bx}" y="${by}" width="42" height="28.500" rx="3" fill="${park ? '#CBE6CF' : '#F8F9FC'}"/>`;
  }
  s += `<g font-family="inherit" font-size="7.500" font-weight="600" fill="#70768A"><text x="92" y="38.800">8e Rue</text><text x="198" y="71.800">10e Rue</text><text x="40" y="104.800">12e Rue</text><text transform="translate(174 150) rotate(-90)">3e Avenue</text><text transform="translate(75.500 96) rotate(-90)">1re Avenue</text></g></g>`;
  s += `<path d="M-10 ${h - 8}C50 ${h - 34} 96 ${h + 2} 150 ${h + 14}L-10 ${h + 20}z" fill="#BFD9F2"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="42" fill="#2F62E0" opacity=".330" filter="url(#${id})"/><circle cx="${cx}" cy="${cy}" r="36" fill="none" stroke="#2F62E0" stroke-width="1.400" stroke-dasharray="2.500 4.500" opacity=".800"/>`;
  return s + '</svg>';
}
