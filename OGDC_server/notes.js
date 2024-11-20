const fs = require('fs');
const users = require('./users');
const notesFilePath = "./BD/listeNotes.json";


function SupprimerNote(idNote){
    let liste_notes = GetListeNotes()
    let find = false;
    let index = null;
    liste_notes.forEach(note =>{
        if (note.Id == idNote) {
            index = liste_notes.indexOf(note);
            find = true;
        }
    })
    if(find && index != null){
        liste_notes.splice(index, 1);
        PostListeNotes(liste_notes)
        console.log("Index trouver et supprmier");
        return{erreur:0,msg:"Réussi"}
    }
    else{
        return{erreur:1,msg:"Notes non trouvé ou index null"}
    }
}

function CreerNotes(infoNote){
    if(infoNote!=null){
        let liste_notes = GetListeNotes()
        let maxId = 0
        liste_notes.forEach(note => {
            if(note.Id > maxId)
                maxId = note.Id;
        });
        nouvelle_Note = CreerObjetNote(maxId+1, infoNote.idUser, infoNote.message)
        if(nouvelle_Note.idOwner != null && nouvelle_Note.idFamille != null){
            liste_notes.push(nouvelle_Note);
            PostListeNotes(liste_notes);
            return{erreur:0,msg:"Réussi"}
        }
        else{
            return{erreur:1,msg:"idUser ou idFamille non-trouvé"}
        }
    }
    else{
        return{erreur:1,msg:"InfoNote null"}
    }
}

function CreerObjetNote(idNote, idUser, message){
    const minIdFamille = 1000;
    let today = new Date();
    let now = today.toLocaleString();
    let idFamille = null;
    if(idUser >= minIdFamille){
        idFamille = idUser  // Le message vient de la famille et est adresser à la famille (Quand c'est le robot)
    }
    else if(idUser < minIdFamille && idUser >= 0){
        let resultat = users.obtenirUsager(idUser)
        idFamille = resultat.user.idFamille
    }
    return {
        Id: idNote,
        message: message,
        idOwner: idUser,
        idFamille: idFamille,
        date: now
    }
}

function ObtenirNotesFamille(idFamille){
    let liste_notes = GetListeNotes();
    let notes = []
    liste_notes.forEach(note=>{
        if(note.idFamille == idFamille)
            if(note.idOwner >= 1000){
                noteModifier = {
                    Id:note.Id,
                    message:note.message,
                    name: 'Robot'
                }
            }
            else{
                var userNote = users.obtenirUsager(note.idOwner).user;
                noteModifier = {
                    Id:note.Id,
                    message:note.message,
                    name:userNote.prenom
                }
            }
            notes.push(noteModifier);
    })
    if(notes.length > 0){
        return{erreur:0,msg:"Réussi",notes:notes}
    }
    else{
        return{erreur:1,msg:"Aucune notes associé à cette famille"}
    }
}

function GetListeNotes(){
    return JSON.parse(fs.readFileSync(notesFilePath));
}
function PostListeNotes(listeNotes){
    fs.writeFileSync(notesFilePath, JSON.stringify(listeNotes));
}
module.exports = {
    CreerNotes,
    SupprimerNote,
    ObtenirNotesFamille
};