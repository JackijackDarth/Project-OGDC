const { Router } = require('express');
const historiques = require('../historiques');
const historiquesRoutes = Router();


historiquesRoutes.route('/:idUser')
    /** 
     * get /idUser/
     * Obtenir l'historique de la famille selon l'id de l'admin
     * Return status historiques en JSON | 401
     */
    .get((req, res) => {
        console.log("Obtenir historiques de la famille de l'usager : ", req.params.idUser + " ---------------------------------------------");
        const resultat = historiques.ObtenirHistoriqueFamilleUsager(req.params.idUser);
        console.log(resultat);
        if (resultat.erreur !== 0) {
            res.status(401).send(resultat);
        } else {
            res.json(resultat.historiques);
        }
    });

module.exports = historiquesRoutes;
