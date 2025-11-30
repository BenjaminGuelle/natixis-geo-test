# Test Technique Natixis - Geo France

Application Angular de recherche de régions françaises et affichage des communes.

🔗 **Démo :** [natixis-geo-test.vercel.app](https://natixis-geo-test.vercel.app)

## Stack

- Angular 21 (signals, standalone)
- Tailwind CSS 4
- Angular CDK (virtual scroll)
- Vitest + Cucumber/Playwright

## Lancer le projet
```bash
npm install
npm start        # http://localhost:4200
npm test         # Tests unitaires (15)
npm run e2e      # Tests E2E (3)
```

## Architecture
```
src/app/
├── core/
│   ├── domain/models/       # Interfaces métier
│   ├── domain/dtos/         # Types API
│   └── services/            # API + cache
└── features/
    ├── region-search/       # Autocomplete + départements
    └── municipality-list/   # Virtual scroll + filtre
```

## Points techniques

| Feature | Justification |
|---------|---------------|
| Virtual scroll | 500+ communes par département |
| Cache régions | 18 régions, appelées souvent |
| Signals | État réactif sans NgRx |
| InputSearch custom | Démo composant Angular moderne |

## API

[geo.api.gouv.fr](https://geo.api.gouv.fr/)

---
