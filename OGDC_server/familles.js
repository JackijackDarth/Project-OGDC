const math = require('mathjs');
const fs = require('fs');
const famillesFilePath = "./BD/listeFamilles.json";
const users = require("./users")

function CreerFamille(infoFamille){
    let listeFamille = GetListeFamilles();
    let maxId = 1000;   // Id de famille matricule commencant à 1000
    let nouvFamille = null;
    if(listeFamille != null || listeFamille.length > 0){
        let double = false;
        listeFamille.forEach(famille => {
            if(famille.Id >= maxId) 
                maxId = famille.Id
            if(famille.name == infoFamille.name)
                double = true
        });
        if(!double)
            nouvFamille = CréerObjetFamille(maxId+1,infoFamille.name,infoFamille.idOwner);
        else{
            return{erreur:1,msg:"Une famille portant le même nom est déja créer"}
        }
    }
    else{
        nouvFamille = CréerObjetFamille(maxId+1,infoFamille.name,infoFamille.idOwner);    //Ultérieurement doit sync le owner de la famille à l'aide de infoFamille.idOwner
    }
    if(nouvFamille != null){
        listeFamille.push(nouvFamille);
        let resultat = users.AjouterUneFamilleAuUser(nouvFamille.ownerId,nouvFamille.Id)
        if(resultat.erreur == 0){
            if(PostListeFamilles(listeFamille)){
                return{erreur:0,msg:"Réussi"}
            }
            else{
                return{erreur:1,msg:"Erreur lors de l'enregistrement dans la BD "}
            }
        }
        else{
            return{erreur:1,msg:resultat.msg}
        }
    }
    else{
        return{erreur:1,msg:"Nouvelle famille est null"}
    }
    
    
}

function CréerObjetFamille(id,nameFamille,userId){
    let today = new Date();
    let now = today.toLocaleString();
    return {
        Id:id,
        name: nameFamille,
        ownerId: userId,
        dateCreation: now
    }
}
/**
 * Fonction retournant la liste de familles
 * @returns Un tableau JavaScript de la liste de familles dans le fichier JSON
 */
function GetListeFamilles() {      // Facilite et réduis le doublage de code
    return JSON.parse(fs.readFileSync(famillesFilePath));
}

/**
 * Fonction qui prend la nouvelle liste de familles et l'enregistre dans la BD (JSON)
 * @param {Array} listeFamilles 
 * @returns Le status de la requete (TRUE) si cela à fonctionner | False si une erreur c'est produite
 */
function PostListeFamilles(listeFamilles){
    try{
        fs.writeFileSync(famillesFilePath, JSON.stringify(listeFamilles))
    }
    catch(ex){
        return false;
    }
    return true;
}

module.exports = {
    CreerFamille,
};