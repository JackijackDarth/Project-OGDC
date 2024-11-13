const fs = require('fs');
const commandes = require('./commandes');
const { exit } = require('process');
const automatisationFilePath = './BD/automatisations.json';

const typeAutomatisation = ['heure', '']

function EnvoyerAutomatisation(infoAutomatisation){
    // infoAutomatisation = automatisation et commande dedans
    if(infoAutomatisation != null){
        let pilesAutomatisations = GetListeAutomatisations()
        let maxId = 0
        pilesAutomatisations.forEach(automatisation => {
            if (automatisation.Id > maxId) maxId = automatisation.Id;
        });
        let resultat = commandes.EnvoyerCommande(infoAutomatisation.commande, infoAutomatisation.commande.fonction, true)
        if(resultat.erreur == 0){
            let automatisation = CreerAutomatisation(maxId + 1, infoAutomatisation.automatisation, resultat.commande);
            if(automatisation != null){
                pilesAutomatisations.push(automatisation)
                PostListeAutomatisations(pilesAutomatisations);
                return {erreur:0,msg:'Réussi'};
            }
            else{
                return{erreur:1,msg:'Type d\'automatisation non valide'}
            }
        }
        else{
            return{erreur: 1, msg:'Erreur dans la commande envoyer'}
        }
    }
    else{
        return{erreur: 1, msg:'InfoAutomatisation null ou inexistant'}
    }
}

function CreerAutomatisation(id, automatisation, commande) {
    let today = new Date();
    let now = today.toLocaleString();
    let typeValide = false;
    let name = "";
    typeAutomatisation.forEach(type=>{
        if(type == Object.keys(automatisation)[0])
            typeValide = true;
            if(type == "heure")
                name = "Automatisation a partir d'une heure"
    })
    if(typeValide){
        return {
            Id: id,
            name: name,
            condition: automatisation,
            commande: commande,
            date_creation: now
        }
    }
    else{
        return null;
    }
}

function SupprimerAutomatisation(idAutomatisation){
    liste_automatisations = GetListeAutomatisations();
    let find = false;
    let index = null;

    liste_automatisations.forEach((automatisation)=>{
        if(automatisation.Id == idAutomatisation){
            index = liste_automatisations.indexOf(automatisation);
            find = true;
        }

    })
    
    if(find && index != null){
        liste_automatisations.splice(index, 1);
        if(PostListeAutomatisations(liste_automatisations)){
            console.log("Index trouver et supprmier");
            return{erreur:0,msg:"Réussi"}
        }
        else{
            return{erreur:1,msg:"Erreur en la sauvegardant"}
        }
    }
    else{
        return{erreur:1,msg:"Automatisations non trouvé ou index null"}
    }
}

function ObtenirAutomatisationUser(idUser){
    let liste_automatisations = GetListeAutomatisations()
    let automatisations = []
    liste_automatisations.forEach((automatisation)=>{
        if(automatisation.commande.idUser == idUser){
            automatisations.push(automatisation);
        }
    })
    if (automatisations != null && automatisations.length > 0){
        return{erreur:0,msg:"Réussi",automatisations: automatisations}
    }
    else{
        return{erreur:1,msg:"Aucune automatisation appartenant au idUser"}
    }
}

function ObtenirAutomatisationRobot(idRobot){
    let liste_automatisations = GetListeAutomatisations()
    let automatisations = []
    liste_automatisations.forEach((automatisation)=>{
        if(automatisation.commande.idRobot == idRobot){
            automatisations.push(automatisation);
        }
    })
    if (automatisations != null && automatisations.length > 0){
        return{erreur:0,msg:"Réussi",automatisations: automatisations}
    }
    else{
        return{erreur:1,msg:"Aucune automatisation appartenant au idUser", automatisations:null}
    }
}

/**
 * Fonction retournant la liste de Automatisations
 * @returns Un tableau JavaScript de la liste de Automatisations dans le fichier JSON
 */
function GetListeAutomatisations() {      // Facilite et réduis le doublage de code
    return JSON.parse(fs.readFileSync(automatisationFilePath));
}

/**
 * Fonction qui prend la nouvelle liste de commande et l'enregistre dans la BD (JSON)
 * @param {Array} listeCommandes 
 * @returns Le status de la requete (TRUE) si cela à fonctionner | False si une erreur c'est produite
 */
function PostListeAutomatisations(listeAutomatisations){
    try{
        fs.writeFileSync(automatisationFilePath, JSON.stringify(listeAutomatisations))
    }
    catch(ex){
        return false;
    }
    return true;
}
module.exports = {
    EnvoyerAutomatisation,
    SupprimerAutomatisation,
    ObtenirAutomatisationUser,
    ObtenirAutomatisationRobot,
};