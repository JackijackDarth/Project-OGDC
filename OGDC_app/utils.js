let Username = "admin"
let Password = "password"

const serveur_ip = "192.168.137.33";

async function obtenirJSON_Get(ressource) {
    // console.log("username: %s", Username);
    // console.log("password: %s", Password);

    let url = new URL(`http://${serveur_ip}:1883/cafehomer/${ressource}`);
    const res = await fetch(url, {
        headers: {
            "Authorization": `Basic ${Username}:${Password}`,
        },
    });
    if (!res.ok)
        throw new Error(res.status);
    return await res.json();
}
export function obtenirRobotsJSON() {
    return obtenirJSON_Get("robot_connecter");
}
export function obtenirUser(usrId){
    return obtenirJSON_Get(`creationUtilisateur/id/${usrId}`);
}
export function obtenirUserUsrnm(username){
    return obtenirJSON_Get(`creationUtilisateur/username/${username}`);
}
export function obtenirObjets(rbtId){
    return obtenirJSON_Get(`liste_objets/${rbtId}`);
}
export function UpdateObjet(lst){
    return ModifierJSON_Put(`liste_objets`,lst);
}

export function getCommandeAsync(){
    return obtenirRessourceJSON("commandes");
}
export function creerFamille(nomFamille){
    return créerJSON_Post("familles",nomFamille)
}
export function getMembresFamille(idFamille){
    return obtenirRessourceJSON("familles/${idFamille}")
}

//Modif 21/10/2024
export function lancerCommande(keyCommand,infoObject){
    return créerJSON_Post(`commandes/${keyCommand}`,infoObject);
}
//Fin modif MS
export function deconnexion(usrId){
    return obtenirJSON_Get(`deconnexion/${usrId}`);
}
async function créerJSON_Post(ressource, resInfo) {
    let url = new URL(`http://${serveur_ip}:1883/cafehomer/${ressource}`);
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${Username}:${Password}`,
        },
        body: JSON.stringify(resInfo),
    });
    if (!res.ok)
        throw new Error(res.status);
    return { res };
}
async function ModifierJSON_Put(ressource, resInfo) {
    let url = new URL(`http://${serveur_ip}:1883/cafehomer/${ressource}`);
    const res = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${Username}:${Password}`,
        },
        body: JSON.stringify(resInfo),
    });
    if (!res.ok)
        throw new Error(res.status);
    return { res };
}

async function supprimerRessourceJSON(ressource) {
    let url = new URL(`http://${serveur_ip}:1883/cafehomer/$%7Bressource%7D/%60`);
    const res = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${Username}:${Password}`,
        },
    });
    return { satut: `${res.status}` };
}


// À implémenter
// function modifierRessourceJSON(ressource, id, resInfo) {
//     let url = new URL(`http://${serveur_ip}:1883/caType": "application/json",
//             "Authorization": `Basic ${Username}:${Password}`,
//         },
//         body: JSON.stringify(resInfo),
//     })
//         .then(res => {
//             return { satut: `${res.status}` }
//         })
// }
// export default function obtenirMenuJSON() {
//     return obtenirRessourceJSON("menu");
// }fehomer/${ressource}/${id}`);
//     return fetch(url, {
//         method: "PUT",
//         headers: {
//             "Content-
export async function connecterUtilisateur(username, password) {
    Username = username;
    Password = password;
    const res = await obtenirJSON_Get("authentification");
    console.log("login succès: %s", res);
    Nom = res.nom;
    Prénom = res.prénom;
    return res;}
export function ConnecterRobot(usrId, rbtId, MdpRbt){
    let connInfo = {
        usrId : usrId,
        rbtId : rbtId,
        MdpRbt : MdpRbt
    }
    console.log("cnn infos",connInfo)
    return créerJSON_Post(`robot_connecter/${rbtId}`,connInfo);
}
export function creerUtilisateurJSON(nouvUtilisateur) {
    return créerJSON_Post("creationUtilisateur", nouvUtilisateur);
}