let Username = "admin"
let Password = "password"

const serveur_ip = "192.168.137.181";

function obtenirJSON_Get(ressource) {
    console.log("username: %s", Username);
    console.log("password: %s", Password);

    let url = new URL(`http://${serveur_ip}:4242/cafehomer/${ressource}`);
    return fetch(url, {
        headers: {
            "Authorization": `Basic ${Username}:${Password}`,
        },
    })
        .then(res => {  
            if (!res.ok)
                throw new Error(res.status);

            return res.json(); 
        })
}
export function obtenirRobotsJSON() {
    return obtenirJSON_Get("robot_connecter");
}
export function obtenirUser(usrId){
    return obtenirJSON_Get(`creationUtilisateur/${usrId}`);
}
function créerJSON_Post(ressource, resInfo) {
    let url = new URL(`http://${serveur_ip}:4242/cafehomer/${ressource}`);
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${Username}:${Password}`,
        },
        body: JSON.stringify(resInfo),
    })
        .then(res => {
            if (!res.ok)
                throw new Error(res.status);

            return { satut: `${res.status}` }
        })
}
// À implémenter
// function modifierRessourceJSON(ressource, id, resInfo) {
//     let url = new URL(`http://${serveur_ip}:4242/cafehomer/${ressource}/${id}`);
//     return fetch(url, {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json",
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
// }
export function connecterUtilisateur(username, password) {
    Username = username;
    Password = password;
    return obtenirJSON_Get("authentification")
        .then((res) => {
            console.log("login succès: %s", res);
            Nom = res.nom;
            Prénom = res.prénom;
            return res;
        });}
export function ConnecterRobot(usrId, rbtId, MdpRbt){
    let connInfo = {
        usrId : usrId,
        rbtId : rbtId,
        MdpRbt : MdpRbt
    }
    return créerJSON_Post(`robot_connecter/${rbtId}`,connInfo);
}
export function creerUtilisateurJSON(nouvUtilisateur) {
    return créerJSON_Post("creationUtilisateur", nouvUtilisateur);
}