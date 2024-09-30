const listeObjets = require('../objets');

const { Router } = require('express');

const liste_objets = Router();

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
liste_objets.route('/:id')
    .get(async (req, res) => {
        console.log("Obtenir la liste d'objet pour robot %d", req.params.id);
        const resultat = listeObjets.obtenirObjets(req.params.id);
        console.log("listobjt", resultat)
        // if (resultat.erreur !== 0)
        //     res.status(401).send(resultat);
        // else
            res.json(resultat.items);
        
     })
module.exports = liste_objets;
    