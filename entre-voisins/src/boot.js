/* ---------- installation sur le téléphone ---------- */
let installEvt = null;
const standalone = () => { try { return matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; } catch (e) { return false; } };
const canInstall = () => /^https?:$/.test(location.protocol) && !standalone() && window.self === window.top;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; });
window.addEventListener('appinstalled', () => { installEvt = null; toast('Entre Voisins est installée sur votre téléphone.'); render(); });
A.install = () => {
  if (installEvt) { const e = installEvt; installEvt = null; try { e.prompt(); } catch (err) { sheet('install'); } return; }
  sheet('install');
};
SHEETS.install = () => sh('Installer sur mon téléphone', `
  <p class="muted">Entre Voisins s’ouvre alors comme une application : sa propre icône, en plein écran.</p>
  <section><h3 class="h4">Sur iPhone, dans Safari</h3><ol class="steps"><li>Touchez le bouton « Partager », en bas de l’écran.</li><li>Choisissez « Sur l’écran d’accueil ».</li><li>Touchez « Ajouter ».</li></ol></section>
  <section><h3 class="h4">Sur Android, dans Chrome</h3><ol class="steps"><li>Touchez le menu « ⋮ », en haut à droite.</li><li>Choisissez « Installer l’application » ou « Ajouter à l’écran d’accueil ».</li><li>Touchez « Installer ».</li></ol></section>`,
  btn('J’ai compris', 'closeSheet', 'soft'));
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && window.self === window.top) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => { /* sans mode hors connexion */ }); });
}

/* ---------- démarrage ---------- */
render();
