const fs = require('fs');
const { Router } = require('express');
const user = require('../users');
const robots = require('../robots');
const deconnexionRoutes = Router();

/**
 * deconnexionRoutes /GET/ idUser/
 * Déconnexion de l'usager connecter
 * Retourne 201 + user | 401
 */
deconnexionRoutes.route('/:idUser')
    .get((req, res) => {
        console.log("Déconnexion l'usager ", req.params.idUser + " ---------------------------------------------");
        const resultat = user.Deconnexion(req.params.idUser);
        if (resultat.erreur !== 0) {
            res.status(401).send(resultat);
        } else {
            res.json(resultat.user);
        }
    });
/**
 * deconnexionRoutes /GET/ idUser/idRobot/
 * Déconnexion de l'usager aux robots connecter
 * Retourne 201 + user | 401
 */
deconnexionRoutes.route('/:idUser/:idRobot')
    .get((req, res) => {
        console.log("Déconnexion l'usager ", req.params.idUser + " aux robots " + req.params.idRobot + " ---------------------------------------------");
        const resultat = robots.DeconnexionRobots(req.params.idUser, req.params.idRobot);
        if (resultat.erreur !== 0) {
            res.status(401).send(resultat);
        } else {
            res.status(201);
        }
    });

module.exports = deconnexionRoutes;
