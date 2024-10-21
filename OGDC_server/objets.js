const fs = require('fs');

const objetsFilePath = "./BD/listeObjets.json";
const robotsFilePath = "./BD/listeRobots.json";
const commandesFilePath = "./BD/pilesCommandes.json";

/**
 * Créer une liste pour la première fois
 * @param {Array} listeObjetInfo 
 * @returns Réussi ou Échec
 */
function créerListe(listeObjetInfo) {
    let idRobot = null;
    let listeRobots = JSON.parse(fs.readFileSync(robotsFilePath));
    let fichierListe = JSON.parse(fs.readFileSync(objetsFilePath));

    let find = false;
    //Vérifier robot existe
    listeRobots.forEach(robot => {
        if (robot.username == listeObjetInfo.username)
            idRobot = robot.Id
        find = true;
    });
    if (find) {
        // Liste déja créer ? true = return erreur, false = créer
        let double = false;
        fichierListe.forEach(listeObjets => {
            if (listeObjets.robotId == idRobot) {
                double = true;
            }
        });
        if(double){
            return { erreur: 1, msg: "Liste déja créer" };
        }
        else{
            console.log("trop loin");
            const nouvelleListe = {
                robotId: idRobot,
                listeObjets: listeObjetInfo.devices,
            };
            fichierListe.push(nouvelleListe);
            fs.writeFileSync(objetsFilePath, JSON.stringify(fichierListe));
            return { erreur: 0, msg: "Réussi" };
        }
    }
    return { erreur: 1, msg: "Robot associé a cette liste non trouver"}
}

/**
 * Obtiens la liste d'objet complet selon le robotId
 * @param {int} robotId 
 * @returns liste Objet | erreur
 */
function obtenirObjets(robotId) {
    let found = false;
    let fichierListe = JSON.parse(fs.readFileSync(objetsFilePath));

    for (let listeItems of fichierListe) {
        if (listeItems.robotId == robotId) {
            console.log("la liste youpi", listeItems);
            found = true;
            return { erreur: 0, msg: "Réussi", items: listeItems };
        }
    }

    if (!found)
        return { erreur: 1, msg: "Aucune liste trouvée" };
}

/**
 * Update une liste d'objet selon un certain robot
 * @param {Array} listeInfo 
 * @returns 
 */
function UpdateListe(listeInfo){
    let idRobot = null;
    let listeRobots = JSON.parse(fs.readFileSync(robotsFilePath));
    let fichierListe = JSON.parse(fs.readFileSync(objetsFilePath));

    let found = false;
    //Vérifier robot existe
    listeRobots.forEach(robot => {
        if (robot.username == listeInfo.username)
            idRobot = robot.Id
        found = true;
    });
    if (found) {
        // Liste déja créer ? true = update, false = erreur
        let double = false;
        fichierListe.forEach(listeObjets => {
            if (listeObjets.robotId == idRobot) {
                listeObjets.devices = listeInfo.devices
                double = true;
            }
        });
        if(double){
            fs.writeFileSync(objetsFilePath,JSON.stringify(fichierListe))
            return { erreur: 0, msg: "Liste changer" };
        }
        else{
            return { erreur: 1, msg: "Liste pas créer ultérieurement" };
        }
    }
    return { erreur: 1, msg: "Robot associé a cette liste non trouver"}
}

/**
 * Fonction permettant de créer des commandes (initier pareil)
 * Attention: Commande créer mais pas enregistrer dans la BD
 * @param {int} id 
 * @param {string} nomCommande 
 * @param {string} nomObjet 
 * @param {int} numPin 
 * @param {int} nouvelleValeur
 * @returns Un objet JS qui représente une commande
 */
function CreerCommande(id, nomCommande, nomObjet, numPin, nouvelleValeur){
    let today = new Date();
    let now = today.toLocaleString();
    return {
        Id: id,
        name: nomCommande,
        object: nomObjet,
        pin: numPin,
        newValue: nouvelleValeur,
        date: now
    }
}

function ChangerEtatLED(infoLED){
    let pilesCommandes = JSON.parse(fs.readFileSync(commandesFilePath));
    let maxId = 0
    pilesCommandes.forEach(commande => {
        if (commande.Id > maxId) maxId = commande.Id;
    });
    if(infoLED != null){
        let nouvelleCommande = CreerCommande(maxId+1, "Allumer/Éteindre LED", infoLED.name, infoLED.pin, infoLED.value)
        if(nouvelleCommande != null){
            pilesCommandes.push(nouvelleCommande)
            fs.writeFileSync(commandesFilePath,JSON.stringify(pilesCommandes))
            return {erreur:0,msg:"Création de la commande réussi"};
        }
        else{
            return {erreur:1,msg:"Échec de création de la commande"};
        }
    }
    else{
        return{erreur:1,msg:"Information LED null ou incorrect"};
    }
}

module.exports = {
    créerListe,
    obtenirObjets,
    UpdateListe,
    ChangerEtatLED,
};