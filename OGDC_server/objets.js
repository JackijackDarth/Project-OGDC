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
                listeObjets.listeObjets = listeInfo.devices
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

/**
 * Fonction qui prend le keyWord de la commande et en crée une à l'aides des informations fournies
 * Appelle une autre fonction pour vérifier que les infos fournies sont correcte avec le style de commande due
 * @param {Array} infoObjet 
 * @param {string} nomCommande 
 * @returns 201 + "Réussi" | Error:1,msg:""
 */
function EnvoyerCommande(infoObjet,nomCommande){
    let pilesCommandes = GetListeObjets()
    let maxId = 0
    pilesCommandes.forEach(commande => {
        if (commande.Id > maxId) maxId = commande.Id;
    });
    if(infoObjet != null){
        let nouvelleCommande = null;
        switch (nomCommande){
            case "switchLed":
                if(EstUneLumiere(infoObjet))
                    nouvelleCommande = CreerCommande(maxId+1, "Allumer/Éteindre LED", infoObjet.name, infoObjet.pin, infoObjet.value)
                else
                    return {erreur:1,msg:"Type Lumière non-valide"}
                break;
            case "changeTemp":
                if(EstUnChauffage(infoObjet))
                    nouvelleCommande = CreerCommande(maxId+1, "Changer temp. cible", infoObjet.name, infoObjet.pin, infoObjet.value)
                else
                    return{erreur:1,msg:"Type Température non-valide"}
                break;
            case "startCamera":
                nouvelleCommande = CreerCommande(maxId+1, "Lancement caméra", infoObjet.name, infoObjet.pin, infoObjet.value)
                break;  // Vérifier Camera ? Besoin plus D'info
            case "captureMovement":
                if(EstUneDemandeDeMouvement(infoObjet))
                    nouvelleCommande = CreerCommande(maxId+1, "Lancement capteur de mouvement", infoObjet.name, infoObjet.pin, infoObjet.value)
                else
                    return{erreur:1,msg:"Type Mouvement non-valide"}
                break;
            case "pressButton":
                if(EstUnBouton(infoObjet))
                    nouvelleCommande = CreerCommande(maxId+1, "Appuyer sur bouton principal", infoObjet.name, infoObjet.pin, infoObjet.value)
                else
                    return{erreur:1,msg:"Type Bouton non-vslide"}
                break;
            default:
                return {error:1,msg:"Nom de commande incorrect ou inconnu"}

        }
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
        return{erreur:1,msg:"Information commande null ou incorrect"};
    }
}

/**
 * Fonction qui vérifie si la PIN est bien un nombre entier entre les constances de pin qui peut exister pour le robot (min,max)
 * @param {int} numPin 
 * @returns Un boolean de si la PIN est valide ou non
 */
function EstUnePinValide(numPin){
    const min_pin = 1
    const max_pin = 15
    return !numPin.isInteger() || numPin < min_pin || numPin > max_pin ? false : true
}

/**
 * Vérifie les informations fournies pour savoir si les donnée sont celle d'une LED VALIDE
 * @param {Array} infoLED 
 * @returns Un boolean de si les infos sont VALIDE ou NON
 */
function EstUneLumiere(infoLED){
    const minValLum = 0;
    const maxValLum = 1;
    let donneeValide = true
    console.log(infoLED.name.includes("LED"));
    if(infoLED.name == null || !infoLED.name.includes("LED"))
        donneeValide = false;
    if(infoLED.pin == null || !EstUnePinValide(infoLED.pin))
        donneeValide = false;
    if(infoLED.value == null || (infoLED.value != minValLum && infoLED.value != maxValLum))
        donneeValide = false;
    return donneeValide;
}

/**
 * Vérifie les informations fournies pour savoir si les donnée sont celle d'un détecteur de mouvement VALIDE
 * @param {Array} infoMouvement 
 * @returns Un boolean de si les infos sont VALIDE ou NON
 */
function EstUneDemandeDeMouvement(infoMouvement){
    const minValLum = 0;
    const maxValLum = 1;
    let donneeValide = true
    if(infoMouvement.name == null || !infoMouvement.name.includes("movement"))
        donneeValide = false;
    if(infoMouvement.pin == null || !EstUnePinValide(infoMouvement.pin))
        donneeValide = false;
    if(infoMouvement.value == null || (infoMouvement.value != minValLum && infoMouvement.value != maxValLum))
        donneeValide = false;
    return donneeValide;
}

/**
 * Vérifie les informations fournies pour savoir si les donnée sont celle d'un Bouton VALIDE
 * @param {Array} infoBouton 
 * @returns Un boolean de si les infos sont VALIDE ou NON
 */
function EstUnBouton(infoBouton){
    const minValLum = 0;
    const maxValLum = 1;
    let donneeValide = true
    if(infoBouton.name == null || !infoBouton.name.includes("button"))
        donneeValide = false;
    if(infoBouton.pin == null || !EstUnePinValide(infoBouton.pin))
        donneeValide = false;
    if(infoBouton.value == null || (infoBouton.value != minValLum && infoBouton.value != maxValLum))
        donneeValide = false;
    return donneeValide;
}

/**
 * Vérifie les informations fournies pour savoir si les donnée sont celle d'une température VALIDE
 * @param {Array} infoChauffage 
 * @returns Un boolean de si les infos sont VALIDE ou NON
 */
function EstUnChauffage(infoChauffage){
    const minValTemp = 0;   // Celcius
    const maxValTemp = 45;  // celcius
    let donneeValide = true
    if(infoChauffage.name == null || !infoChauffage.name.includes("temp"))      //À vérifier le nom de l'objet
        donneeValide = false;
    if(infoChauffage.pin == null || !EstUnePinValide(infoChauffage))
        donneeValide = false;
    if(infoChauffage.value == null || infoChauffage.value < minValTemp || infoChauffage.value > maxValTemp)
        donneValide = false;
    return donneeValide;
}

/**
 * Fonction qui retourne toute les commandes en cours dans le fichier JSON
 * @returns un tuple avec le status de la requete et la liste de commandes {erreur,msg,commandes}
 */
function obtenirTouteCommandes(){
    listeCommandes = GetListeObjets()
    if(listesCommandes!=null || listeCommandes.length > 0)
        return {erreur:0,msg:"Réussi",commandes:listeCommandes}
    else
        return {erreur:1,msg:"La liste est vide ou inexistante",commandes:null}
}

/**
 * Fonction retournant la liste de commande
 * @returns Un tableau JavaScript de la liste de commandes dans le fichier JSON
 */
function GetListeObjets(){      // Facilite et réduis le doublage de code
    return JSON.parse(fs.readFileSync(commandesFilePath));
}
module.exports = {
    créerListe,
    obtenirObjets,
    UpdateListe,
    EnvoyerCommande,
    obtenirTouteCommandes,
};