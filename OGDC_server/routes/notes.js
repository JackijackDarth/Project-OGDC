const fs = require('fs');
const { Router } = require('express');
const user = require('../users');

const notesRoutes = Router();

/**
 * deconnexionRoutes /GET/ idUser/
 * Déconnexion de l'usager connecter
 * Retourne 201 + user | 401
 */
notesRoutes.route('/')
    .get((req, res) => {
        console.log("Déconnexion l'usager ", req.params.idUser);
        const resultat = user.Deconnexion(req.params.idUser);
        if (resultat.erreur !== 0) {
            res.status(401).send(resultat);
        } else {
            res.json(resultat.user);
        }
    });

module.exports = notesRoutes;
