const fs = require('fs');

const objetsFilePath = "./BD/listeObjets.json";
const robotsFilePath = "./BD/listeRobots.json";
let fichierListe = JSON.parse(fs.readFileSync(objetsFilePath));

function créerListe(listeObjetInfo) {
    let double = false;
    idRobot = null;
    let listeRobots = JSON.parse(fs.readFileSync(robotsFilePath));
    listeRobots.forEach(robot => {
        if (robot.username == listeObjetInfo.username)
            idRobot = robot.Id;
    });
    fichierListe.forEach(listeObjets => {
        try {
            if(listeObjets.robotId == idRobot)
                double = true;
        }
        catch(error){
            return{erreur:1, msg: "Robot inconnu"};
        }
    });
    if (!double) {
        const nouvelleListe = {
            robotId: idRobot,
            listeObjets: listeObjetInfo.devices,
        }
        fichierListe.push(nouvelleListe)
        fs.writeFileSync(objetsFilePath, JSON.stringify(fichierListe));
        return { erreur: 0, msg: "Réussi" };
    }

    return { erreur: 1, msg: "Une liste existante appartient déja à ce robot" };
};

function obtenirObjets(robotId){
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