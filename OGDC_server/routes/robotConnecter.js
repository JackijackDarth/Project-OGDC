const listeRobots = require('../robots');

const { Router } = require('express');

const robot_Connecter = Router();

/**
 * robot_Connecter  /POST/ 
 * Création robot
 * Reçois les informations du robot envoie a une fonction
 * Si la création réussis envoie status 201
 * Sinon renvoie erreur + msg
 */
robot_Connecter.route('/')
    .post((req, res) => {
        console.log("Créer un robot");
        const robotInfo = req.body;
        console.table(robotInfo);
        const resultat = listeRobots.créerRobot(robotInfo);
        if (resultat.erreur !== 0) {
            res.status(400).send(resultat.msg);
        } else {
            res.status(201).send();
        }
    })
    /**
     * robot_Connecter /GET/
     * Retourne une liste de tout les robots existants donner par la fonction
     */
    .get(async (req, res) => {
        console.log("Obtenir toutes les robots");
        res.json(listeRobots.obtenirRobots());
    })
/**
 * robot_connecter /POST/ id/
 * Connexion à un robot précis
 * Envoie des informations de connexions à une fonction
 * Retourne status 201 si connection réussi
 * Retourne Erreur + msg si connection non réussi
 */
robot_Connecter.route('/:id')
    .post((req, res) => {
        console.log("Connexions robots");
        const connexionInfo = req.body;
        const resultat = listeRobots.connexionRobots(connexionInfo);
        if (resultat.erreur !== 0) {
            res.status(400).send(resultat.msg);
        } else {
            res.status(201).send();
        }
    })

module.exports = robot_Connecter;
    