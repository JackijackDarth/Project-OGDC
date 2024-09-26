const listeObjets = require('../listeObjets');

const { Router } = require('express');

const liste_objets = Router();

liste_objets.route('/')
    .post((req, res) => {
        console.log("Initialiser liste Robot");
        const listeInfo = req.body;
        console.table(listeInfo);
        const resultat = listeObjets.créerListe(listeInfo);
        if (resultat.erreur !== 0) {
            res.status(400).send(resultat.msg);
        } else {
            res.status(201).send();
        }
    })
    // .get(async (req, res) => {
    //     console.log("Obtenir toutes les robots");
    //     res.json(listeRobots.obtenirRobots());
    // })
liste_objets.route('/:id')
    .get((req, res) => {
        console.log("Obtenir le robot %d", req.params.id);
        const resultat = listeObjets.obtenirObjets(req.params.id);
        if (resultat.erreur !== 0)
            res.status(404).send(resultat);
        else
            res.json(resultat.liste);
        
     })
module.exports = liste_objets;
    