# Entre Voisins

Prototype cliquable de l'application d'entraide entre voisins, pour la ville de Québec. Rattaché à Maison Sereine.

Ce n'est pas une vraie application : il n'y a aucun serveur. Les comptes, les textos, les courriels, les paiements et les réponses des voisins sont simulés.

## L'ouvrir

Ouvrez `index.html` dans un navigateur, de préférence sur un téléphone. Tout est dans ce seul fichier.

Pour entrer vite : « J'ai déjà un compte », puis n'importe quel courriel et mot de passe. Trois touchers sur « EntreVoisins », en haut d'une étape, font apparaître les liens du mode test.

## Le modifier

Ne modifiez pas `index.html` à la main : il est fabriqué à partir du dossier `src/`.

| Fichier | Contenu |
| --- | --- |
| `src/styles.css` | Le style visuel |
| `src/data.js` | Le contenu de démonstration : quartiers, voisins, fil, activités, messages |
| `src/gfx.js` | Les dessins : icônes, visages, maisons, carte |
| `src/core.js` | Le moteur : état, rendu, navigation |
| `src/onb.js` | L'inscription en deux temps |
| `src/home.js` | L'accueil, le fil, les publications |
| `src/help.js` | La demande d'aide, du besoin jusqu'au merci, et le signalement |
| `src/social.js` | Messages, activités, notifications, quartier |
| `src/me.js` | Onglet Moi, fiches, réglages, Services du quartier, Voisin Pro |

Après un changement, refabriquez le fichier :

```
python3 build.py
```

## Le contrôler

Les deux parcours du dossier `test/` traversent les écrans dans Chrome et signalent les erreurs.

```
cd test
npm install
node smoke.js "$PWD/../index.html" "$PWD/shots"
node smoke2.js "$PWD/../index.html" "$PWD/shots2"
```

## À savoir

- La correspondance entre le code postal et le quartier est approximative (trois premiers caractères). Elle est à remplacer par les limites officielles.
- Les conditions d'utilisation sont un texte de démonstration, à valider par un juriste.
