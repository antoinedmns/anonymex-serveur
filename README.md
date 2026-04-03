# Anonymex : serveur
Anonymex est une plateforme d'anonymisation des copies d'examen. Permet la lecture automatisée des documents rendus et la génération du matériel d'examen.

## Compatibilité
Compatibilité native pour les systèmes Linux (x86/ARM), fonctionne également sous MacOS. **Incompatible avec Windows** *(Docker disponible)*.

Installer les dépendances :
```bash
npm i
```

> [!CAUTION]
> Version Node.js recommandée : `v22.22.0`. Les versions trop récentes ne sont pas compatibles.

Transpilation :
```bash
npm run build
```

Lancer le serveur :
```bash
npm run start
```

## Configuration
Copier et compléter le fichier `.env.example`, puis le renommer en `.env`.

Une base de données MariaDB (recommandée) ou MySQL est nécessaire, le schéma sera importé automatiquement.

## Modèles
Un modèle de classification CNN (pour la lecture des lettres manuscrites), entraîné sur le jeu de données **EMNIST** est fourni par défaut. Il peut être modifié/ré-entraîné via le script `resources/scripts/entrainementEMNIST.js` (TensorFlow).

> Cohen, G., Afshar, S., Tapson, J., & van Schaik, A. (2017). EMNIST: an extension of MNIST to handwritten letters. Retrieved from http://arxiv.org/abs/1702.05373