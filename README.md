# ol-map
Version 1.0.0-alpha

## Description
Cette application permet d'ajouter des cartes personnalisés à des pages html.

## Développement
Cloner le projet avec Git :
git clone https://github.com/Bloumy/ol-map.git

Installer les dépendances :
npm install

Générer les fichiers après modification du code :
npm run build

## structure du projet
Le projet est composé de différents répertoires :

Les css :
./src/css/

Les images
./src/img/

Les cartes personnalisées :
./src/js/customMap/

Les contrôles personnalisés :
./src/js/control/

Les modèles de classes :
./src/js/model/

Le dossier contenant l'application buildée :
./dist/
./dist/css/

Les démonstrations :
./examples/


# Utilisation
Des démonstrations se situent dans le dossier ./examples

Dans votre page html, ajouter les css et js des dépendances et de l'application :

    <!-- librairies externes  -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.9.0/css/ol.css" type="text/css">

    <!-- application -->
    <link href="./node_modules/ol-map/dist/css/app.min.css" rel="stylesheet">

    <!-- librairies externes  -->
    <script
            src="https://code.jquery.com/jquery-3.6.0.min.js"
            integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
            crossorigin="anonymous"></script>

    <script src="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.9.0/build/ol.js"></script>

    <!-- application -->
    <script src="./node_modules/ol-map/dist/app.min.js"></script>


Ainsi vous pouvez utiliser l'objet js 'jolieCarte' contenant les différentes cartes utilisables:

    <!-- script -->
    <script>
        var divMap = $('#its-a-map').get(0);
        var options = {};
        jolieCarte.customMaps.map1(divMap, options);
    </script>


## Dépendances
Pour fonctionner correctement, cette application aura besoin des dépendances externes suivantes :
- Jquery v3.6.0
- Openlayers v6.9.0

Dans le cadre du développement, il faudra ausssi les dépendances contenues dans le package.json ; elles sont installées automatiquement avec "npm install".
