const fs = require('fs');

const objetsFilePath = "./BD/listeObjets.json";
const robotsFilePath = "./BD/listeRobots.json";

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
        if (double) {
            return { erreur: 1, msg: "Liste déja créer" };
        }
        else {
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
    return { erreur: 1, msg: "Robot associé a cette liste non trouver" }
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
function UpdateListe(listeInfo) {
    let idRobot = null;
    let listeRobots = JSON.parse(fs.readFileSync(robotsFilePath));
    let fichierListe = JSON.parse(fs.readFileSync(objetsFilePath));

    //Vérifier si ID envoyer
    let found = false;

    if (listeInfo.robotId != null) {
        idRobot = listeInfo.robotId
        found = false;
        //Vérifier robot existe
        listeRobots.forEach(robot => {
            if (robot.Id == idRobot)
                found = true;
        });
    }
    else {
        found = false;
        //Vérifier robot existe
        listeRobots.forEach(robot => {
            if (robot.username == listeInfo.username){
                idRobot = robot.Id;
                found = true;
            }
        });
    }
    if (found) {
        // Liste déja créer ? true = update, false = erreur
        let double = false;
        fichierListe.forEach(listeObjets => {
            if (listeObjets.robotId == idRobot) {
                listeObjets.listeObjets = listeInfo.listeObjets
                double = true;
            }
        });
        if (double) {
            fs.writeFileSync(objetsFilePath, JSON.stringify(fichierListe))
            return { erreur: 0, msg: "Liste changer" };
        }
        else {
            return { erreur: 1, msg: "Liste pas créer ultérieurement" };
        }
    }
    return { erreur: 1, msg: "Robot associé a cette liste non trouver" }
}

/**
 * Fonction retournant la liste des objets
 * @returns Un tableau JavaScript de la liste des objets affilier au robot dans le fichier JSON
 */
function GetListesObjets() {      // Facilite et réduis le doublage de code
    return JSON.parse(fs.readFileSync(objetsFilePath));
}
module.exports = {
    créerListe,
    obtenirObjets,
    UpdateListe,
};