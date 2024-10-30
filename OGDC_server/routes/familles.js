const { Router } = require('express');
const familles = require('../familles');

const famillesRoutes = Router();


famillesRoutes.route('/')
    /**
     * familles /POST/
     * Créer une famille avec les infos de la famille envoyé
     * Retourne status 401 ou 201 avec le resultat
     */
    .post((req, res) => {
        console.log("Création groupe famille ---------------------------------------------------");
        let resultat = familles.CreerFamille(req.body);
        console.log(resultat);
        if (resultat.erreur !== 0) {
            res.status(401).send(resultat);
        } else {
            res.status(201).send(resultat);
        }
    })

famillesRoutes.route('/:param1')
    /**
     * familles /GET/idFamille={id}
     * Retourne les membres de la famille associé à l'ID donner
     * Si trouver elle retourne les membres de la famille en JSON
     * Sinon retourne status 401
     */
    .get((req,res)=>{
        console.log("Obtenir les membres de la famille ",req.params.param1 + " -----------------------------------------------");
        const resultat = familles.ObtenirMembreFamille(req.params.param1);
        console.log("Résultat de obtenirMembreFamille:", resultat);
        if (resultat.erreur !== 0) {
            res.status(401).send(resultat);
        } else {
            res.json(resultat.famille);
        }
    })
    /**
     * familles /PUT/idUser
     * Prend l'id du user et ajoute une famille passer par le body
     * Si l'ajout du user se fait avec succès                               EN TRAVAUX
     * status 201 | status 401
     */
    .put((req, res) => {
        console.log("Ajouter à la famille le user # ",req.params.param1 + " ------------------------------------------------------");
        let resultat = familles.ConnexionUserAFamille(req.params.param1,req.body);
        console.log(resultat);
        if (resultat.erreur !== 0) {
            res.status(401).send(resultat);
        } else {
            res.status(201).send(resultat);
        }
    })

famillesRoutes.route('/:param1/:param2')
    /**
         * familles /GET/infoFamille/idFamille
         * Retourne les infos de la famille associé à l'ID donner
         * Si trouver elle retourne les infos de la famille en JSON
         * Sinon retourne status 401
         */
    .get((req,res)=>{
        if(req.params.param1 == "infoFamille"){
            console.log("Obtenir les infos de la famille ",req.params.param2 + " ------------------------------------------");
            const resultat = familles.GetFamille(req.params.param2);
            console.log("Résultat de GetFamille:", resultat);
            if (resultat == null) {
                res.status(401).send(resultat);
            } else {
                res.json(resultat);
            }
        }
    })

module.exports = famillesRoutes;
