import connServ

class NoteUser:
    def __init__(self, IdFamille):
        self.IdFamille = IdFamille

    def add_note(self, message):
        response = connServ.post_note(self.IdFamille, message)
        if response is None:
            print("Échec de la publication de la note sur le serveur.")
        else:
            print("Note ajoutée avec succès :", response.get("msg", "message"))