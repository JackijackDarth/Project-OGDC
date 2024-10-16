const listeObjets = require('../objets');

const { Router } = require('express');

const liste_objets = Router();

/**
 * liste_objet  /POST/
 * Création liste robot
 * Envoie de la liste a une fonction
 * Liste mis dans la BD si conforme
 * Retourne msg si erreur
 * Sinon retourn status 200
 */
liste_objets.route('/')
    .post((req, res) => {
        console.log("Initialiser liste pour Robot");
        const listeInfo = req.body;
        console.table(listeInfo);
        const resultat = listeObjets.créerListe(listeInfo);
        if (resultat.erreur !== 0) {
            res.status(400).send(resultat.msg);
        } else {
            res.status(201).send();
        }
    })
    .put((req,res)=>{
        console.log("Update liste pour Robot");
        const listeInfo = req.body;
        console.table(listeInfo);
        const resultat = listeObjets.UpdateListe(listeInfo);
        if (resultat.erreur !== 0) {
            res.status(400).send(resultat.msg);
        } else {
            res.status(201).send();
        }
    })
/**
 * liste_objets /GET/ id
 * Obtenir liste d'objet pour un robot précisément
 * Recherche via ID
 * Si liste trouver Retourne la liste
 * Sinon retourne erreur
 */
liste_objets.route('/:id')
    .get((req, res) => {
        console.log("Obtenir la liste d'objet pour robot %d", req.params.id);
        const resultat = listeObjets.obtenirObjets(req.params.id);
        //console.log("listobjt", resultat.items.listeObjets.camera)
        if (resultat.erreur !== 0)
            res.status(401).send(resultat);
        else
            res.json(resultat.items);
        
     })
module.exports = liste_objets;
    