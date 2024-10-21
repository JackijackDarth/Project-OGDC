const { Router } = require('express');
const objets = require('../objets');

const commandesRoutes = Router();


commandesRoutes.route('/:nomCommande')
    .post((req, res) => {
        console.log("Commande envoyer : ", req.params.nomCommande);
        let resultat;
        if(req.params.nomCommande == "switchLed"){
            console.log("Dans switchLED");
            resultat = objets.ChangerEtatLED(req.body);
        }
        else if (req.params.nomCommande == "changeTemp"){
            resultat = objets.ChangerTempérature(req.body);
        }
        else if (req.params.nomCommande == "startCamera"){
            resultat = objets.LancerCamera(req.body);
        }
        else if (req.params.nomCommande == "pressButon"){
            resultat = objets.AppuyerBouton(req.body);
        }
        else if (req.params.nomCommande == "captureMovements"){
            resultat = objets.CapturerMouvements(req.body);
        }
        else{
            resultat = {erreur:1,msg:"La commande n'a pu être trouver"}
        }
        if (resultat.erreur !== 0) {
            res.status(401).send(resultat);
        } else {
            console.log("Envoi de 'Send réussi' avec status 200");
            res.status(200).send("Send réussi");
        }
    });

module.exports = commandesRoutes;
