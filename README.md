# Linktree Clone

## Présentation du Projet

Ce projet vise à créer une plateforme web moderne et fonctionnelle similaire à Linktree, permettant aux utilisateurs de partager tous leurs liens en un seul endroit. Il utilise des technologies modernes pour offrir une expérience utilisateur fluide et réactive.

## Technologies Utilisées

- **Frontend** : [Next.js](https://nextjs.org) avec des composants UI basés sur la bibliothèque [shadcn/ui](https://ui.shadcn.com).
- **Styles** : [TailwindCSS](https://tailwindcss.com) pour un design réactif et personnalisable.
- **Authentification** : [Auth.js](https://authjs.dev) permettant aux utilisateurs de se connecter via Discord, Google, et Facebook.
- **Base de Données** : [Prisma](https://www.prisma.io) connecté à une base de données relationnelle PostgreSQL, hébergée dans un conteneur Docker via Docker Compose.
- **Cache** : Serveur [Redis](https://redis.io) inclus dans le fichier `docker-compose.yml` pour gérer les sessions ou les caches.

## Fonctionnalités Principales

### Page d'Accueil (Landing Page)

- Design attrayant avec des Call-to-Action pour inciter les visiteurs à s’inscrire.
- Sections mettant en avant les fonctionnalités : gestion des liens, QR codes, statistiques, etc.
- Une section de contact et de branding pour présenter la plateforme.

### Gestion des Comptes Utilisateur

- Pages de profil utilisateur permettant de mettre à jour l'avatar, le nom, l'email, et le mot de passe.
- Option pour supprimer le compte avec confirmation.
- Authentification sécurisée et gestion des connexions via OAuth (Discord, Google, Facebook).

### Gestion des Liens et des Pages de Liens

- Interface utilisateur pour créer et organiser des pages contenant des listes de liens.
- Personnalisation des liens : icônes des plateformes courantes ou icônes personnalisées.
- Fonctionnalité de raccourcissement des URL et de génération de QR codes associés à chaque lien.
- Gestion des redirections simples vers des URL externes.
- Statistiques détaillées pour chaque lien ou page de liens : nombre de clics, localisation géographique, appareil utilisé, etc.

### Dashboard Utilisateur

- Vue d'ensemble des statistiques globales pour un utilisateur.
- Présentation des performances des pages de liens et des liens individuels.

### Super Administration

- Tableau de bord pour surveiller les statistiques globales de la plateforme (liens, pages vues, utilisateurs actifs, etc.).
- Mécanisme de logging avancé : IP de l’utilisateur, appareil utilisé, et autres métadonnées pertinentes.
- Outils pour modérer ou supprimer des contenus.

## Backend

- Serveur Next.js pour gérer les API REST ou GraphQL nécessaires aux fonctionnalités.
- Gestion des données utilisateurs, liens, et logs avec Prisma et PostgreSQL.

## Infrastructure et DevOps

- Hébergement de la base de données PostgreSQL et d'un serveur Redis via Docker Compose.
- Configurations prêtes pour le déploiement sur un environnement cloud (AWS, Vercel, ou autre).

## Instructions Complémentaires

- Garantir une interface intuitive et accessible sur tous les appareils.
- Intégrer une architecture modulaire permettant des évolutions futures (ajout de nouvelles fonctionnalités).
- Fournir un code propre et bien documenté pour faciliter la maintenance.

## Démarrage

Pour démarrer le projet, suivez ces étapes :

1. Clonez le dépôt :
   ```bash
   git clone <URL_DU_DEPOT>
   cd linktree-clone
   ```

2. Installez les dépendances :
   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   ```

3. Exécutez Docker Compose pour démarrer les services :
   ```bash
   docker-compose up
   ```

4. Ouvrez votre navigateur et accédez à [http://localhost:3000](http://localhost:3000).

## Contributions

Les retours et contributions sont les bienvenus ! N'hésitez pas à ouvrir des issues ou des pull requests sur le dépôt GitHub.
