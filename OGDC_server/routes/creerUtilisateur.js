const fs = require('fs');
const user = require('../users');


const { Router } = require('express');

const creationRoute = Router();

creationRoute.route('/')
    .post((req, res) => {
        console.log("Créer un usager");
        const usagerInfo = req.body;
        console.table(usagerInfo);
        const resultat = user.créerUtilisateur(usagerInfo);
        if (resultat.erreur !== 0) {
            res.status(400).send(resultat);
        } else {
            res.status(201).send();
        }
    })

module.exports = connexionRoutes;
