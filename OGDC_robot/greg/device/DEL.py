import grovepi
from etatLEDs import update_led_state

class controllerDEL:
    def __init__(self, port, couleur):
        self.port = port
        self.couleur = couleur
        grovepi.pinMode(self.port, "OUTPUT")
        self.etat = 0
        self.mettre_a_jour_etat()

    def allumer(self):
        grovepi.analogWrite(self.port, 255)
        self.etat = 1
        self.mettre_a_jour_etat()

    def eteindre(self):
        grovepi.analogWrite(self.port, 0)
        self.etat = 0
        self.mettre_a_jour_etat()

    def changer_etat(self):
        if self.etat == 0:
            self.allumer()
        else:
            self.eteindre()

    def mettre_a_jour_etat(self):
        update_led_state(self.couleur, self.etat)

    def fonctionnement(self):
        return "La lumière est fonctionnelle."
