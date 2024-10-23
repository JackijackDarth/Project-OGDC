const { Router } = require('express');
const commandes = require('../commandes');

const commandesRoutes = Router();


commandesRoutes.route('/')
    /**
     * commandesRoutes  /GET/
     * Obtiens toute les commandes enregistrer dans la BD
     * Retourne une liste de toute les commandes en attente
     * Si la liste est vide ou null, retourne une erreur 401 avec le resultat
     */
    .get((req,res)=>{
        console.log("Obtenir les commandes pour le robot ");
        const resultat = commandes.obtenirTouteCommandes();
        console.log("Résultat de obtenirTouteCommandes:", resultat);
        
        if (resultat.erreur !== 0) {
            res.status(401).send(resultat);
        } else {
            res.json(resultat.commandes);
        }
    })
commandesRoutes.route('/:param1')
    /**
     * commandesRoutes  /POST/nomCommande/
     * Recois les commande envoyer en POST et la crée à l'aide
     * de fonctions selon le keyword (nomCommande) de la commande et
     * le body de la requete
     * Retourne status 201 + resultat | status 401 + resultat
     */
    .post((req, res) => {
        console.log("Commande envoyer : ", req.params.param1);
        let resultat = commandes.EnvoyerCommande(req.body,req.params.param1);
        if (resultat.erreur !== 0) {
            res.status(401).send(resultat);
        } else {
            res.status(201).send(resultat);
        }
    })
    .delete((req,res)=>{
        console.log("Commande delete : ", req.params.param1);
        let resultat = commandes.SupprimerCommande(req.params.param1);
        console.log(resultat);
        if (resultat.erreur !== 0) {
            res.status(401).send(resultat);
        } else {
            res.status(201).send(resultat);
        }
    })

module.exports = commandesRoutes;
