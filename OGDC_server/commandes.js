const math = require('mathjs');
const fs = require('fs');
const commandesFilePath = "./BD/pilesCommandes.json";

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
function CreerCommande(id, nomCommande, nomObjet, numPin, nouvelleValeur) {
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
function EnvoyerCommande(infoObjet, nomCommande) {
    let pilesCommandes = GetListeCommandes()
    let maxId = 0
    pilesCommandes.forEach(commande => {
        if (commande.Id > maxId) maxId = commande.Id;
    });
    if (infoObjet != null) {
        let nouvelleCommande = null;
        switch (nomCommande) {
            case "switchLed":
                if (EstUneLumiere(infoObjet))
                    nouvelleCommande = CreerCommande(maxId + 1, "Allumer/Éteindre LED", infoObjet.name, infoObjet.pin, infoObjet.value)
                else
                    return { erreur: 1, msg: "Type Lumière non-valide" }
                break;
            case "changeTemp":
                if (EstUnChauffage(infoObjet))
                    nouvelleCommande = CreerCommande(maxId + 1, "Changer temp. cible", infoObjet.name, infoObjet.pin, infoObjet.value)
                else
                    return { erreur: 1, msg: "Type Température non-valide" }
                break;
            case "startCamera":
                nouvelleCommande = CreerCommande(maxId + 1, "Lancement caméra", infoObjet.name, infoObjet.pin, infoObjet.value)
                break;  // Vérifier Camera ? Besoin plus D'info
            case "captureMovement":
                if (EstUneDemandeDeMouvement(infoObjet))
                    nouvelleCommande = CreerCommande(maxId + 1, "Lancement capteur de mouvement", infoObjet.name, infoObjet.pin, infoObjet.value)
                else
                    return { erreur: 1, msg: "Type Mouvement non-valide" }
                break;
            case "pressButton":
                if (EstUnBouton(infoObjet))
                    nouvelleCommande = CreerCommande(maxId + 1, "Appuyer sur bouton principal", infoObjet.name, infoObjet.pin, infoObjet.value)
                else
                    return { erreur: 1, msg: "Type Bouton non-vslide" }
                break;
            default:
                return { error: 1, msg: "Nom de commande incorrect ou inconnu" }

        }
        if (nouvelleCommande != null) {
            pilesCommandes.push(nouvelleCommande)
            PostListeCommandes(pilesCommandes)
            return { erreur: 0, msg: "Création de la commande réussi" };
        }
        else {
            return { erreur: 1, msg: "Échec de création de la commande" };
        }
    }
    else {
        return { erreur: 1, msg: "Information commande null ou incorrect" };
    }
}

/**
 * Fonction qui vérifie si la PIN est bien un nombre entier entre les constances de pin qui peut exister pour le robot (min,max)
 * @param {int} numPin 
 * @returns Un boolean de si la PIN est valide ou non
 */
function EstUnePinValide(numPin) {
    const min_pin = 1
    const max_pin = 15
    return !math.isInteger(numPin) || numPin < min_pin || numPin > max_pin ? false : true
}

/**
 * Vérifie les informations fournies pour savoir si les donnée sont celle d'une LED VALIDE
 * @param {Array} infoLED 
 * @returns Un boolean de si les infos sont VALIDE ou NON
 */
function EstUneLumiere(infoLED) {
    const minValLum = 0;
    const maxValLum = 1;
    let donneeValide = true
    console.log(infoLED.name.includes("LED"));
    if (infoLED.name == null || !infoLED.name.includes("LED"))
        donneeValide = false;
    if (infoLED.pin == null || !EstUnePinValide(infoLED.pin))
        donneeValide = false;
    if (infoLED.value == null || (infoLED.value != minValLum && infoLED.value != maxValLum))
        donneeValide = false;
    return donneeValide;
}

/**
 * Vérifie les informations fournies pour savoir si les donnée sont celle d'un détecteur de mouvement VALIDE
 * @param {Array} infoMouvement 
 * @returns Un boolean de si les infos sont VALIDE ou NON
 */
function EstUneDemandeDeMouvement(infoMouvement) {
    const minValLum = 0;
    const maxValLum = 1;
    let donneeValide = true
    if (infoMouvement.name == null || !infoMouvement.name.includes("movement"))
        donneeValide = false;
    if (infoMouvement.pin == null || !EstUnePinValide(infoMouvement.pin))
        donneeValide = false;
    if (infoMouvement.value == null || (infoMouvement.value != minValLum && infoMouvement.value != maxValLum))
        donneeValide = false;
    return donneeValide;
}

/**
 * Vérifie les informations fournies pour savoir si les donnée sont celle d'un Bouton VALIDE
 * @param {Array} infoBouton 
 * @returns Un boolean de si les infos sont VALIDE ou NON
 */
function EstUnBouton(infoBouton) {
    const minValLum = 0;
    const maxValLum = 1;
    let donneeValide = true
    if (infoBouton.name == null || !infoBouton.name.includes("button"))
        donneeValide = false;
    if (infoBouton.pin == null || !EstUnePinValide(infoBouton.pin))
        donneeValide = false;
    if (infoBouton.value == null || (infoBouton.value != minValLum && infoBouton.value != maxValLum))
        donneeValide = false;
    return donneeValide;
}

/**
 * Vérifie les informations fournies pour savoir si les donnée sont celle d'une température VALIDE
 * @param {Array} infoChauffage 
 * @returns Un boolean de si les infos sont VALIDE ou NON
 */
function EstUnChauffage(infoChauffage) {
    const minValTemp = 0;   // Celcius
    const maxValTemp = 45;  // celcius
    let donneeValide = true
    if (infoChauffage.name == null || !infoChauffage.name.includes("temp"))      //À vérifier le nom de l'objet
        donneeValide = false;
    if (infoChauffage.pin == null || !EstUnePinValide(infoChauffage))
        donneeValide = false;
    if (infoChauffage.value == null || infoChauffage.value < minValTemp || infoChauffage.value > maxValTemp)
        donneValide = false;
    return donneeValide;
}

/**
 * Fonction qui retourne toute les commandes en cours dans le fichier JSON
 * @returns un tuple avec le status de la requete et la liste de commandes {erreur,msg,commandes}
 */
function obtenirTouteCommandes() {
    listeCommandes = GetListeCommandes()
    if (listeCommandes != null || listeCommandes.length > 0)
        return { erreur: 0, msg: "Réussi", commandes: listeCommandes }
    else
        return { erreur: 1, msg: "La liste est vide ou inexistante", commandes: null }
}

/**
 * Fonction qui trouve la commande et la supprime de la liste. 
 * Après elle appelle une fonction pour Post la nouvelle liste dans BD
 * @param {int} idCommande 
 * @returns Un tuple du status et un message {erreur,msg}
 */
function SupprimerCommande(idCommande){
    let listeCommandes = GetListeCommandes()
    let find = false;
    let index = null;
    listeCommandes.forEach(commande =>{
        if (commande.Id == idCommande) {
            indexTrouver = index;
            index = listeCommandes.indexOf(commande);
            find = true;
        }
    })
    if(find && index != null){
        listeCommandes.splice(index, 1);
        if(PostListeCommandes(listeCommandes)){
            console.log("Index trouver et supprmier");
            return{erreur:0,msg:"Réussi"}
        }
        else{
            return{erreur:1,msg:"Erreur en la sauvegardant"}
        }
    }
    else{
        return{erreur:1,msg:"Commande non trouvé ou index null"}
    }
}

/**
 * Fonction retournant la liste de commande
 * @returns Un tableau JavaScript de la liste de commandes dans le fichier JSON
 */
function GetListeCommandes() {      // Facilite et réduis le doublage de code
    return JSON.parse(fs.readFileSync(commandesFilePath));
}

/**
 * Fonction qui prend la nouvelle liste de commande et l'enregistre dans la BD (JSON)
 * @param {Array} listeCommandes 
 * @returns Le status de la requete (TRUE) si cela à fonctionner | False si une erreur c'est produite
 */
function PostListeCommandes(listeCommandes){
    try{
        fs.writeFileSync(commandesFilePath, JSON.stringify(listeCommandes))
    }
    catch(ex){
        return false;
    }
    return true;
}

module.exports = {
    EnvoyerCommande,
    obtenirTouteCommandes,
    SupprimerCommande,
};