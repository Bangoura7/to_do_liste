# To Do Liste

Application moderne de gestion de liste des tâches avec Webpack et architecture modulaire.

## ✨ Fonctionnalités

### Gestion des projets
- ✅ Création et suppression de projets
- ✅ Navigation entre projets via sidebar
- ✅ Projet par défaut créé automatiquement
- ✅ Compteur de tâches actives par projet
- ✅ Statistiques en temps réel

### Gestion des tâches
- ✅ Propriétés complètes: titre, description, date d'échéance, priorité, notes, checklist
- ✅ Création, modification et suppression de tâches
- ✅ Marquage comme terminée
- ✅ Checklists avec suivi de progression
- ✅ Priorités (haute, moyenne, basse) avec codes couleur

### Filtres avancés
- ✅ Toutes les tâches
- ✅ Actives / Terminées
- ✅ Aujourd'hui
- ✅ À venir (7 prochains jours)
- ✅ En retard
- ✅ Par priorité

### Interface utilisateur
- ✅ Design moderne inspiré de Todoist/Things/Any.do
- ✅ Recherche en temps réel
- ✅ Dates formatées en français avec date-fns
- ✅ Dates relatives (il y a X jours, dans X jours)
- ✅ Barres de progression pour checklists
- ✅ Badges visuels (aujourd'hui, en retard)
- ✅ Responsive design
- ✅ Animations fluides

### Persistence des données
- ✅ Sauvegarde automatique dans localStorage
- ✅ Gestion d'erreurs robuste
- ✅ Réhydratation des objets après chargement
- ✅ Protection contre les données corrompues
- ✅ Export/Import des données (backup)

## 🏗️ Architecture

### Séparation des responsabilités

```
src/
├── logic.js       # Logique métier pure (sans DOM)
│   ├── TodoLogic      # Gestion des tâches
│   ├── ProjectLogic   # Gestion des projets
│   └── AppLogic       # Gestionnaire global
│
├── ui.js          # Gestion de l'interface (100% DOM)
│   └── UIManager      # Rendu et interactions
│
├── index.js       # Point d'entrée
├── index.html     # Structure HTML
└── styles.css     # Styles
```

## 📦 Technologies

- **Webpack 5** - Bundler et dev server
- **date-fns** - Manipulation et formatage des dates
- **LocalStorage API** - Persistence des données
- **CSS3** - Animations et styles modernes
- **ES6 Modules** - Architecture modulaire

## 🚀 Installation

```bash
npm install
```

## 📝 Commandes

```bash
npm start           # Lance le serveur de dev (port 9000)
npm run build       # Build de production
npm run dev         # Mode développement avec watch
```

## 💾 Stockage des données

Les données sont automatiquement sauvegardées dans le localStorage du navigateur. Pour inspecter les données :

1. Ouvrez les DevTools (F12)
2. Allez dans l'onglet "Application" (Chrome) ou "Stockage" (Firefox)
3. Sélectionnez "Local Storage"
4. Cherchez la clé `todoApp`

**Note**: Les données sont uniquement disponibles sur l'ordinateur où elles ont été créées.

## 🔧 Dépendances

### Production
- `date-fns` ^4.1.0 - Manipulation des dates

### Développement
- `webpack` ^5.89.0
- `webpack-cli` ^5.1.4
- `webpack-dev-server` ^4.15.1
- `html-webpack-plugin` ^5.5.3
- `css-loader` ^6.8.1
- `style-loader` ^3.3.3

## 📖 Utilisation

### Créer un projet
1. Cliquez sur le bouton "+" dans la sidebar
2. Entrez le nom du projet
3. Cliquez sur "Enregistrer"

### Créer une tâche
1. Cliquez sur "+ Nouvelle Tâche"
2. Remplissez les champs obligatoires (titre, description, date)
3. Optionnel: ajoutez une priorité, des notes, une checklist
4. Cliquez sur "Enregistrer"

### Filtrer les tâches
Utilisez les boutons de filtre pour afficher:
- Toutes les tâches
- Seulement les tâches actives
- Les tâches terminées
- Les tâches du jour
- Les tâches à venir
- Les tâches en retard

### Rechercher
Utilisez la barre de recherche pour trouver des tâches par titre, description ou notes.

## 🎨 Personnalisation

Modifiez `src/styles.css` pour personnaliser:
- Couleurs principales (recherchez `#3498db`, `#2c3e50`)
- Couleurs de priorité (recherchez `.priority-high`, `.priority-medium`, `.priority-low`)
- Tailles et espacements
- Animations

## 🔒 Sécurité et confidentialité

- Toutes les données sont stockées localement
- Aucune donnée n'est envoyée à un serveur externe
- Les entrées HTML sont échappées pour prévenir les injections XSS

## 📄 Licence

Ce projet est libre d'utilisation.
