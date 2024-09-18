let Username = "admin"
let Password = "password"

const serveur_ip = "172.22.172.220";

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
export function creerUtilisateurJSON(nouvUtilisateur) {
    /*let utilisateurInfo = {
        prenom : nouvUtilisateur.prenom,
        nom : nouvUtilisateur.nom,
        username : nouvUtilisateur.username,
        pass : nouvUtilisateur.pass,
        mail : nouvUtilisateur.mail,
        phone: nouvUtilisateur.phone,
        isLogin : false,
    }*/
    return créerJSON_Post("creationUtilisateur", nouvUtilisateur);
}