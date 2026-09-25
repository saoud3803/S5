# 🎓 S5 Ressources — Bibliothèque Numérique Génie Civil

Plateforme web moderne, rapide et minimaliste regroupant toutes les ressources pédagogiques du semestre **S5** conforme à l'**emploi du temps officiel**.

---

## 📅 Modules du Semestre S5

| Jour | Horaires | Module | Enseignant |
| :--- | :--- | :--- | :--- |
| **Lundi** | 14h30 - 18h45 | **Ponts & ouvrages d'art** | Prof. F. ELABASSI |
| **Mardi** | 08h30 - 12h45 | **Dynamiques des structures et Etude parasismique** | Prof. S. SAKAMI |
| **Mardi** | 14h30 - 18h45 | **Ouvrages géotechniques** | Prof. S. CHERIF |
| **Mercredi** | 08h30 - 12h45 | **Construction métallique** | Prof. R. Bouferra |
| **Mercredi** | 14h30 - 18h45 | **Innovation et simulation de jeu d'entreprise** | Prof. Ghatay Khadija |
| **Jeudi** | 14h30 - 18h45 | **Projets et marchés publics** | Prof. F. ELABASSI |
| **Vendredi** | 08h30 - 12h45 | **Langues et techniques d'Expression Anglais LTC3** | — |

---

## ✨ Fonctionnalités Principales

- 📚 **Organisation par module S5** : 7 modules ordonnés selon votre planning hebdomadaire avec classement par catégories (Cours, TD, TP, Examens, Corrigés, Projets, Autres).
- 🔍 **Recherche instantanée** : Palette de recherche globale avec raccourci clavier `⌘K` / `Ctrl+K`.
- 👁️ **Visionneuse de documents intégrée** : Lecture des fichiers PDF et images directement dans le navigateur.
- ⬇️ **Téléchargement rapide** : Téléchargement direct des fichiers Word, PowerPoint, Excel et archives ZIP/RAR.
- 🌓 **Mode Sombre & Clair** : Design soigné avec persistance des préférences.
- 📱 **100% Responsive** : Optimisé pour ordinateur, tablette et smartphone.
- ⚡ **Zéro base de données complexe** : Fonctionne directement à partir de vos fichiers locaux dans `public/resources/`.

---

## 🚀 Démarrage Rapide

### 1. Installation des dépendances

```bash
npm install
```

### 2. Lancement du serveur local

```bash
npm run dev
```

Ouvrez ensuite votre navigateur sur :
👉 [http://localhost:3000](http://localhost:3000)

---

## 📂 Organisation des Dossiers

Les fichiers sont stockés directement dans `public/resources/` :

```text
public/resources/
├── Ponts & ouvrages d'art/
├── Dynamiques des structures et Etude parasismique/
├── Ouvrages géotechniques/
├── Construction métallique/
├── Innovation et simulation de jeu d'entreprise/
├── Projets et marchés publics/
└── Langues et techniques d'Expression Anglais LTC3/
```

---

## 🔄 Ajouter de Nouveaux Documents

1. Déposez vos fichiers dans le sous-dossier correspondant dans `public/resources/<Nom_du_Module>/<Categorie>/`.
2. Lancez la synchronisation automatique :
   ```bash
   npm run sync
   ```
3. Vos nouvelles ressources apparaîtront instantanément sur le site.
