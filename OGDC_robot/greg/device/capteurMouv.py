import time
import grovepi

class controllerCapteurMouv:

    def __init__(self, port):
        self.port = port
        grovepi.pinMode(port, "INPUT")

    def lire(self):
        etat = ""
        try:
            if grovepi.digitalRead(self.port):
                etat = "Mouvement détecté"
            else:
                etat = "Aucun mouvement"
            time.sleep(.2)
        except IOError:
            etat = "Erreur de lecture du capteur de mouvement."
        return etat