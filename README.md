# Quiz de Football - Forum des Sports

Ce projet est un quiz interactif sur le thème du football, développé en HTML, CSS, JavaScript et PHP. Il permet aux utilisateurs de tester leurs connaissances et de soumettre leurs scores en ligne. Les scores sont stockés dans une base de données MySQL.

## Prérequis

- Serveur web (Apache, Nginx, etc.)
- PHP 7.x ou supérieur
- MySQL/MariaDB
- Navigateur moderne compatible avec JavaScript

### Structure du projet

- **assets/** : Contient les fichiers multimédias tels que les images et les sons utilisés dans le quiz.
- **css/** : Feuilles de style pour la mise en page et le design du quiz.
- **js/** : Fichier JavaScript pour gérer les interactions et la logique du quiz.
- **php/** : Scripts PHP pour la soumission et la récupération des scores.
- **db.sql** : Script SQL pour créer la base de données et la table des scores.
- **index.html** : Page principale du quiz où l'utilisateur répond aux questions.

### Installation

#### 1. Cloner le projet

Clonez le dépôt GitHub dans le répertoire de votre serveur web local ou distant :

` `git clone git@github.com:C2Bx/quiz.git`

#### 2. Configuration de la base de données

1. Créez une base de données MySQL en utilisant votre outil préféré (phpMyAdmin, ligne de commande, etc.).
2. Importez la structure de la base de données en exécutant le fichier **db.sql** fourni avec le projet :

` `mysql -u [votre_utilisateur] -p [nom_de_la_base_de_donnees] < /chemin/vers/le/fichier/db.sql`

Cela créera une table ` `scores` ` pour stocker les résultats des utilisateurs.

#### 3. Configuration du fichier de connexion à la base de données

Modifiez les fichiers PHP pour renseigner les informations de connexion à votre base de données. Dans les fichiers **get_scores.php** et **submit_score.php**, complétez les variables ` `$servername` `, ` `$username` `, ` `$password` `, et ` `$dbname` ` avec vos propres informations de connexion.

` `php
$servername = "localhost"; // ou l'adresse de votre serveur MySQL
$username = "votre_utilisateur";
$password = "votre_mot_de_passe";
$dbname = "nom_de_la_base_de_donnees";
`

#### 4. Déploiement sur un serveur

Assurez-vous que votre serveur est configuré pour exécuter du PHP et qu'il est connecté à la base de données MySQL.

Déposez tous les fichiers du projet dans un répertoire accessible par votre serveur web (ex. ` `/var/www/html/` ` pour Apache).

#### 5. Accès au quiz

Une fois le serveur configuré et les fichiers placés correctement, accédez au quiz via un navigateur à l'adresse suivante :

` `http://[votre_domaine]/quiz/`

⚠️ **Important** : N'oubliez pas de modifier les liens si le domaine change, comme dans les chemins vers les fichiers ou les URLs du projet.

## Fonctionnalités

- **Quiz interactif** : Sélection aléatoire de 10 questions parmi une liste préconfigurée.
- **Effets sonores** : Sons différents selon les bonnes ou mauvaises réponses, et musique de fond.
- **Tableau des scores** : Les utilisateurs peuvent soumettre leurs scores et voir leur classement.
- **Formulaire de soumission sécurisé** : Gestion des scores avec validation des champs et RGPD.

## Personnalisation

Vous pouvez personnaliser le quiz en modifiant les fichiers HTML et CSS dans le répertoire **css/** pour ajuster le design, ainsi que dans le fichier **questions.json** pour ajouter ou modifier des questions.

## Contributeurs

- **Bastian Cazaux** - Développeur principal
- **Arthis** - Collaboration sur divers projets du Forum des sports

## Licence

Ce projet est sous licence MIT - voir le fichier ` `[LICENSE]` ` pour plus de détails.
