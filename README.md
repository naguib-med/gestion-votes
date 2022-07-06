# PROJET CONCEPTION D'APPLICATION WEB -- ÉLECTION MIF03

<h1>MOHAMED MAHAMOUD Naguib</h1>

<h2>  Programmation côté serveur 2 (servlets / JSP) - TP2 </h2>

- Configuration des serveurs Tomcat et Nginx pour notre projet
- Intégration continue et déploiement sur votre VM


<h2> Design patterns et cache - TP3 </h2>

- Utilisation de Java Beans
- Pas grand chose fait dans ce tp.
- Non deployer

<h2>Web API (programmation REST) - TP 4</h2>

Le TP4 est disponible sur : https://192.168.75.22/api/v3/

- Changement des contrôleurs et leurs responsabilités
- Contrôleur de résultats
- Contrôleur de candidats 

###### Mise en place mais pas terminé donc non totalement fonctionel

- Contrôleur de ballots
- Contrôleur d'utilisateurs 
- Modification des URLs


<h2>Programmation côté client (JavaScript, XHR, AJAX, DOM, jQuery) - TP 5</h2>

- Réalisation de l'application côté client sous forme de SPA

L'application est disponible sur : https://192.168.75.22/client/

À cet URL aussi : https://192.168.75.22/api/client/

<h4>Utilisateur connecté : </h4>
<ul>
    <li>Consultation de la liste des candidats</li>
    <li>Afficher les résultats courants de l'élection</li>
    <li>Gestion de compte</li>
    <li>Candidat individuel</li>
    <li>Création d'un ballot</li>
    <li>Confirmation de vote</li>
    <li>Suppression de vote </li>
    <li>Déconnexion</li>
</ul>

**J'ai utilisé des Modal et Alerts par exemple pour demander la confirmation de suppression de vote quand l'utilisateur veut supprimer son vote.**

**- Stockage du ballot quand l'utilisateur se déconnecte qui est essentiel.**

<h4>Ulisateur non connecté</h4>

<ul>
    <li>Accueil de l'application</li>
    <li>Formulaire de Connexion</li>
    <li>Gestion d'URLs</li>
    <li>Redirection vers une page 404</li>

</ul>

<h2>TP 7 - Optimisation d'une Single-Page Application</h2>

<h4>Depuis ma machine personnelle VPN</h4>

#### 1. Analyse de l'état initial de l'application (Sur Tomcat)

* Le temps de chargement de la page HTML initiale : **83.69 ms**
* Le temps d'affichage de l'app shell : **426.49 ms**
* Le temps d'affichage du chemin critique de rendu (CRP) : **426.49 ms**

#### 2. Déploiement des fichiers statiques sur Nginx

* Le temps de chargement de la page HTML initiale est : **39.10 ms**
* Le temps d'affichage de l'app shell : **300.80 ms** 
* Le temps d'affichage du chemin critique de rendu (CRP) : **387.40 ms**

##### Les améliorations :
* HTML :  **46.72 %** du temps de base
* App shell : **70.52 %** du temps de base
* CRP : **90.83 %** du temps de base



<h4>Depuis ma machine avec eudorom</h4>

#### 1. Analyse de l'état initial de l'application (Sur Tomcat)

* Le temps de chargement de la page HTML initiale : **52 ms**
* Le temps d'affichage de l'app shell : **748 ms**
* Le temps d'affichage du chemin critique de rendu (CRP) : **844 ms**

#### 2. Déploiement des fichiers statiques sur Nginx

* Le temps de chargement de la page HTML initiale est : **42 ms**
* Le temps d'affichage de l'app shell : **600 ms** 
* Le temps d'affichage du chemin critique de rendu (CRP) : **666 ms**

##### Les améliorations :
* HTML :  **80.76 %** du temps de base
* App shell : **80.21 %** du temps de base
* CRP : **78.90 %** du temps de base



<h4>Avec la machine de l'université</h4>

#### 1. Analyse de l'état initial de l'application (Sur Tomcat)

* Le temps de chargement de la page HTML initiale : **46 ms**
* Le temps d'affichage de l'app shell : **718 ms**
* Le temps d'affichage du chemin critique de rendu (CRP) : **798 ms**


#### 2. Déploiement des fichiers statiques sur Nginx

* Le temps de chargement de la page HTML initiale est : **42 ms** 
* Le temps d'affichage de l'app shell : **602 ms**
* Le temps d'affichage du chemin critique de rendu (CRP) : **690 ms**

##### Les améliorations :
* HTML :  **91.30 %** du temps de base
* App shell : **83.84 %** du temps de base
* CRP : **86.46 %** du temps de base



#### Exemple avec wifi eudorom de l'université

#### 3. Optimisation de l'application


<h4>Depuis ma machine avec eudorom</h4>

#### Analyse de l'état initial de l'application (Sur Tomcat)

* Le temps de chargement de la page HTML initiale : **17.19 ms**
* Le temps d'affichage de l'app shell : **462.89 ms**
* Le temps d'affichage du chemin critique de rendu (CRP) : **577.59 ms**


#### Déploiement des fichiers statiques sur Nginx

* Le temps de chargement de la page HTML initiale est : **11.69 ms** 
* Le temps d'affichage de l'app shell : **428.49 ms**
* Le temps d'affichage du chemin critique de rendu (CRP) : **566.30 ms**

##### Les améliorations :

* HTML :  **68 %** du temps de base
* App shell : **92.56 %** du temps de base
* CRP : **98.04 %** du temps de base



- **Utilisation d'attributs async et/ou defer pour décaler le chargement de scripts non nécessaires au CRP**
- **Minification réduction du nombre de ressources critiques (scripts et css)**





