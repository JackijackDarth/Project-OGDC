const { Router } = require('express');
const objets = require('../objets');

const commandesRoutes = Router();


commandesRoutes.route('/:nomCommande')
    .post((req, res) => {
        console.log("Commande envoyer : ", req.params.nomCommande);
        let resultat = objets.EnvoyerCommande(req.body,req.params.nomCommande);
        if (resultat.erreur !== 0) {
            res.status(401).send(resultat);
        } else {
            res.status(201).send(resultat);
        }
    });

module.exports = commandesRoutes;
