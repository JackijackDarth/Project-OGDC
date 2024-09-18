let Username = "admin"
let Password = "password"

const serveur_ip = "172.22.172.220";

function obtenirRessourceJSON(ressource) {
    console.log("username: %s", Username);
    console.log("password: %s", Password);

    let url = new URL(`http://${serveur_ip}:4242/cafehomer/${ressource}`);
    return fetch(url, {
        headers: {
            "Authorization": `Basic ${Username}:${Password}`,
        },
    })  // Exécute une requête HTTP GET
        .then(res => {      // Lorsque la réponse commence à arriver,
            if (!res.ok)
                throw new Error(res.status);

            return res.json(); // Retourner un objet "Promise" représentant
            // le contenu de la requête.
            // L'objet Response expose la méthode json et text
            // pour traiter le contenu.
        })
}
function créerRessourceJSON(ressource, resInfo) {
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
function modifierRessourceJSON(ressource, id, resInfo) {
    let url = new URL(`http://${serveur_ip}:4242/cafehomer/${ressource}/${id}`);
    return fetch(url, {
        method: "PUT",
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
// export function obtenirAuthenJSON(username, password) {
//     Username = username;
//     Password = password;
//     return obtenirRessourceJSON("authentification");
// }
export function obtenirMenuJSON() {
    return obtenirRessourceJSON("menu");
}
export function obtenirAuthenJSON(username, password) {
    Username = username;
    Password = password;
    return obtenirRessourceJSON("authentification")
        .then((res) => {
            console.log("login succès: %s", res);
            Nom = res.nom;
            Prénom = res.prénom;
            return res;
        });}
