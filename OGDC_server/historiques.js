const fs = require('fs');
const users = require('users.js');
const familles = require('familles.js');
const historiquesFilePath = "./BD/historiques.json";

function ObtenirHistoriqueFamilleUsager(idUser){
    let user = users.obtenirUsager(idUser);
    let famille = familles.GetFamille(user.idFamille);
    if(famille.ownerId == user.Id){
        let historiques = GetHistoriquesPourUnRobot(famille.idRobot);
        if(historiques.length > 0){
            let historiqueModifier = [];
            historiques.forEach(historique => {
                let userHistorique = users.obtenirUsager(historique.idUser);
                let nouvelleHistorique = {
                    Id:historique.Id,
                    name: userHistorique.prenom + " " + userHistorique.nom,
                    action:historique.action,
                    date:historique.date
                }
                historiqueModifier.push(nouvelleHistorique);
            });
            if(historiqueModifier.length > 0){
                return{erreur:0,msg:"Réussi",historiques:historiqueModifier}
            }
            else{
                return{erreur:1,msg:"Erreur dans les données de l'historique",historiques:null}
            }
        }
        else{
            return{erreur:1,msg:"Aucune historique trouver pour ce robot",historiques:null}
        }

    }
    else{
        return{erreur:1,msg:"L'usager n'est pas l'admin de la famille",historiques:null}
    }    
}

function EnregistrerHistorique(){
    let maxId = 0
    historiques = GetListeHistoriques();
    historiques.forEach(historique => {
        if (historique.Id > maxId) maxId = historique.Id;
    });
    let nouvelleHistorique = {
        Id:maxId+1,
        action:nouvelleCommande.name,
        idUser:nouvelleCommande.idUser,
        idRobot:nouvelleCommande.idRobot,
        date:nouvelleCommande.date
    }
    historiques.push(nouvelleHistorique);
    PostHistoriques(historiques);
}

function GetHistoriquesPourUnRobot(idRobot){
    let historiques = GetListeHistoriques();
    let historiquesFiltrer = []
    historiques.forEach((historique)=>{
        if(historique.idRobot == idRobot){
            historiquesFiltrer.push(historique);
        }
    })
    return historiquesFiltrer;
}

function GetListeHistoriques(){
    return JSON.parse(fs.readFileSync(historiquesFilePath));
}

function PostHistoriques(historiques){
    fs.writeFileSync(historiquesFilePath, JSON.stringify(historiques))
}

module.exports = {
    ObtenirHistoriqueFamilleUsager,
    EnregistrerHistorique,
};