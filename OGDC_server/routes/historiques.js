const { Router } = require('express');
const historiques = require('../historiques');
const historiquesRoutes = Router();

/**
 * deconnexionRoutes /GET/ idUser/
 * Déconnexion de l'usager connecter
 * Retourne 201 + user | 401
 */
historiquesRoutes.route('/:idUser')
    .get((req, res) => {
        console.log("Obtenir historiques de la famille de l'usager : ", req.params.idUser + " ---------------------------------------------");
        const resultat = historiques.ObtenirHistoriqueFamilleUsager(req.params.idUser);
        if (resultat.erreur !== 0) {
            res.status(401).send(resultat);
        } else {
            res.json(resultat.historiques);
        }
    });

module.exports = historiquesRoutes;
