const math = require('mathjs');
const fs = require('fs');
const famillesFilePath = "./BD/listeFamilles.json";
const users = require("./users")
const utils = require("./utils")

/**
 * Envoie les données a fonction pour créer l'objet famille et ensuite enregistre dans la BD la nouvelle famille si elle est conforme
 * @param {Array} infoFamille 
 * @returns \{erreur,msg}
 */
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
        nouvFamille = CréerObjetFamille(maxId+1,infoFamille.name,infoFamille.idOwner);   
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

/**
 * Créer un objet famille à l'aide des informations fournies (N'ENREGISTRE PAS DANS LA BD)
 * @param {int} id 
 * @param {string} nameFamille 
 * @param {int} userId 
 * @returns L'objet famille créée
 */
function CréerObjetFamille(id,nameFamille,userId){
    let today = new Date();
    let now = today.toLocaleString();
    const longueur_mdp = 10
    let pass = utils.genererChaineRandom(longueur_mdp);
    return {
        Id:id,
        name: nameFamille,
        ownerId: userId,
        password: pass,
        dateCreation: now
    }
}

/**
 * Selon l'id de la famille, la fonction retourne les membres de la familles correspondants
 * @param {int} idFamille 
 * @returns Un tableau d'idUser correspondant aux membres de la famille
 */
function ObtenirMembreFamille(idFamille){
    //Vérifie ID famille est bon
    if(EstFamilleExistanteId(idFamille)){
        let membres = []
        let listeUsers = users.GetListeUsers()
        listeUsers.forEach((user)=>{
            if(user.idFamille == idFamille){
                let newUser = {
                    Id: user.Id,
                    username: user.prenom + " " + user.nom,
                    email:user.mail
                }
                membres.push(newUser)
            }
        })
        if(membres.length > 0){
            return{erreur:0,msg:"Réussi",famille:membres}
        }
        else{
            return{erreur:1,msg:"Aucun membres trouver correspondant à cette famille",famille:null}
        }
    }
    else{
        return{erreur:1,msg:"Id de famille erronée, Aucune famille trouvée"}
    }
}

function AjouterUneFamilleAuUser(idUser,nomFamille){
    let idFamille = null;
    let liste_familles = GetListeFamilles()
    liste_familles.forEach((famille)=>{
        if(famille.name == nomFamille)
            idFamille = famille.Id;
    })
    return users.AjouterUneFamilleAuUser(idUser,idFamille)
}

/**
 * Fonction booléen qui vérifie si la famille existe ou non selon son id
 * @param {string} nomFamille 
 * @returns Un booléen
 */
function EstFamilleExistante(nomFamille){
    liste_familles = GetListeFamilles();
    let find = false;
    liste_familles.forEach((famille)=>{
        if(famille.name == nomFamille){
            find = true;
        }
    })
    return find;
}

function EstFamilleExistanteId(idFamille){
    liste_familles = GetListeFamilles();
    let find = false;
    liste_familles.forEach((famille)=>{
        if(famille.Id == idFamille){
            find = true;
        }
    })
    return find;
}

/**
 * Vérifie si les informations de connexion à la famille sont exact et si oui associe l'user à cette famille
 * @param {int} userId 
 * @param {Array} infoConnexionFamille 
 * @returns \{erreur,msg}
 */
function ConnexionUserAFamille(userId, infoConnexionFamille){
    //Vérifie ID famille est bon
    if(EstFamilleExistante(infoConnexionFamille.nomFamille)){
        if(VérifierConnexionFamille(infoConnexionFamille.nomFamille,infoConnexionFamille.passFamille)){
            return AjouterUneFamilleAuUser(userId,infoConnexionFamille.nomFamille)
        }
        else{
            return{erreur:1,msg:"Les infos de connexion pour la famille sont inccorect"}
        }
    }
    else{
        return{erreur:1,msg:"Id de famille erronée, Aucune famille trouvée"}
    }
}

/**
 * Vérifie si les donnée fournie pour se connecter à la famille sont correct (autorisation)
 * @param {string} nomFamille 
 * @param {string} passFamille 
 * @returns Un booléen du status des données
 */
function VérifierConnexionFamille(nomFamille,passFamille){
    connexionReussi = false;
    let liste_familles = GetListeFamilles();
    liste_familles.forEach((famille)=>{
        if(famille.name == nomFamille){
            if(famille.password == passFamille){
                connexionReussi = true;
            }
        }
    })
    return connexionReussi;
}

/**
 * Retourne les infos complète de la famille selon l'Id fournie
 * @param {int} idFamille 
 * @returns Un tableau de donnée pour la famille [ id, name, password ]
 */
function GetFamille(idFamille){
    let liste_familles = GetListeFamilles()
    let infoFamille = null
    liste_familles.forEach((famille)=>{
        //console.log(famille)
        if(famille.Id == idFamille){
            infoFamille = famille
        }
    })
    return infoFamille;
}

function SupprimerMembreFamille(idUser){
    liste_users = users.GetListeUsers()
    let trouver = false;
    liste_users.forEach((user)=>{
        if(user.Id == idUser){
            console.log(user.idFamille);
            user.idFamille = null;
            trouver = true;
        }
    })
    if(trouver){
        return {erreur:0,msg:'Réussi'}
    }
    else{
        return {erreur:1,msg:'Id User inexistant'}
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
    ObtenirMembreFamille,
    GetFamille,
    ConnexionUserAFamille,
    AjouterUneFamilleAuUser,
    SupprimerMembreFamille
};