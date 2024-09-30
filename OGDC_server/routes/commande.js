const { Router } = require('express');
const commande = require('../commandes');

const commandeRoutes = Router();

commandeRoutes.route('/')
    .post((req, res) => {
        console.log("Créer une commande");
        const commandeInfo = req.body;
        console.table(commandeInfo);
        const resultat = commande.créerCommande(commandeInfo);
        if (resultat.erreur !== 0) {
          res.status(400).send(resultat);
        } else {
          res.status(201).send();
        }
    })
    .delete((req, res) => {
        console.log("Supprimer toutes les commandes");
        commande.supprimerCommandes();
        res.send('Commandes supprimées');
    })
    .get(async (req, res) => {
        console.log("Obtenir toutes les commande");
        res.json(commande.obtenirCommandes());
    });

commandeRoutes.route('/:id')
    .get((req, res) => {
        console.log("Obtenir la commande %d", req.params.id);

        const resultat = commande.obtenirUneCommandes(req.params.id);
        if (resultat.erreur !== 0)
            res.status(404).send(resultat);
        else
            res.json(resultat.commande);
    })
    .put((req, res) => {
        console.log("Modifier la commande %d", req.params.id);
        const commandeModifiée = req.body;
        const resultat = commande.modifierCommande(req.params.id, commandeModifiée);
        if (resultat.erreur !== 0) {
            res.status(400).send(resultat);
        } else {
            res.status(201).send();
        }
    })
    .delete((req, res) => {
        console.log("Supprimer la commande %d", req.params.id);
        commande.supprimerCommande(req.params.id);
        res.status(201).send();
    });

module.exports = commandeRoutes;
