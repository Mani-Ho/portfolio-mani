# Portfolio Mani

Portfolio créatif construit avec **Vite + React + TypeScript**, animations Three.js et Canvas 2D.

## Stack

- **Vite 5** — build tool ultra rapide (dev avec hot reload, build optimisé en production)
- **React 18** + **TypeScript 5** — composants typés
- **Three.js** — particules 3D en arrière-plan
- **ESLint** — analyse statique du code
- **GitHub Actions** — CI automatique (lint + typecheck + build) à chaque push

## Setup

```bash
npm install
npm run dev      # serveur de dev → http://localhost:5173
```

Place ta vidéo de fond hero dans `public/videos/hero.mp4`.

## Scripts

| Commande            | Description                                     |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | Serveur de dev avec hot reload                  |
| `npm run build`     | Build de production (sortie dans `dist/`)      |
| `npm run preview`   | Aperçu du build de production                  |
| `npm run lint`      | Lance ESLint sur tout le projet                 |
| `npm run typecheck` | Vérifie les types TypeScript sans builder       |

## Structure

```
.
├── index.html              # Template HTML servi par Vite
├── package.json            # Dépendances + scripts npm
├── vite.config.ts          # Configuration Vite
├── tsconfig.json           # Configuration TypeScript (racine)
├── eslint.config.js        # Configuration ESLint
├── .github/workflows/ci.yml # GitHub Actions
├── public/
│   └── videos/hero.mp4     # ⚠️ Vidéo de fond à ajouter
└── src/
    ├── main.tsx            # Entry point React
    ├── App.tsx             # Composant racine
    ├── styles/
    │   └── global.css      # Styles globaux
    ├── hooks/
    │   ├── useReveal.ts            # Reveal on scroll
    │   ├── useScrollNav.ts         # Nav qui change au scroll
    │   ├── useSmoothScroll.ts      # Scroll fluide sur ancres
    │   └── useThreeBackground.ts   # Particules Three.js
    └── components/
        ├── Loader.tsx
        ├── Cursor.tsx
        ├── Nav.tsx
        ├── Hero.tsx
        ├── Ticker.tsx
        ├── Divider.tsx
        ├── Work.tsx
        ├── Philosophy.tsx
        ├── Process.tsx
        ├── Testimonials.tsx
        ├── Contact.tsx
        └── Footer.tsx
```

## Déploiement

Le `npm run build` génère un dossier `dist/` statique déployable sur n'importe quel hébergeur (Vercel, Netlify, GitHub Pages, OVH, etc.).
