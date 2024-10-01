const fs = require('fs');

const objetsFilePath = "./BD/listeObjets.json";
const robotsFilePath = "./BD/listeRobots.json";
let fichierListe = JSON.parse(fs.readFileSync(objetsFilePath));

function créerListe(listeObjetInfo) {
    let idRobot = null;
    let listeRobots = JSON.parse(fs.readFileSync(robotsFilePath));
    let fichierListe = JSON.parse(fs.readFileSync(objetsFilePath));

    listeRobots.forEach(robot => {
        if (robot.username == listeObjetInfo.username)
            idRobot = robot.Id;
    });

    let updated = false;
    fichierListe.forEach(listeObjets => {
        if (listeObjets.robotId == idRobot) {
            listeObjets.listeObjets = listeObjetInfo.devices;
            updated = true;
        }
    });
    if (!updated) {
        const nouvelleListe = {
            robotId: idRobot,
            listeObjets: listeObjetInfo.devices,
        };
        fichierListe.push(nouvelleListe);
    }
    fs.writeFileSync(objetsFilePath, JSON.stringify(fichierListe));

    return { erreur: 0, msg: "Réussi" };
}


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


module.exports = {
    créerListe,
    obtenirObjets,
};