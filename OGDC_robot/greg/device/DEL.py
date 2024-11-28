import grovepi
import json
import os

class controllerDEL:
    def __init__(self, port, led_id):
        self.port = port
        self.led_id = led_id
        grovepi.pinMode(self.port, "OUTPUT")
        self.etat = self.lire_etat_initial()

    def lire_etat_initial(self):
        """Lit l'état initial de la LED à partir du fichier data.json."""
        try:
            if os.path.exists("data.json"):
                with open("data.json", "r") as file:
                    data = json.load(file)
                    led_state = data.get("led_states", {}).get(self.led_id, 0)
                    return led_state
            return 0
        except (FileNotFoundError, json.JSONDecodeError):
            print("Erreur lors de la lecture de l'état initial de la LED.")
            return 0

    def allumer(self):
        grovepi.digitalWrite(self.port, 255)
        self.etat = 1
        self.sauvegarder_etat()

    def eteindre(self):
        grovepi.digitalWrite(self.port, 0)
        self.etat = 0
        self.sauvegarder_etat()

    def changer_etat(self):
        """Change l'état de la LED (allumer/éteindre)."""
        if self.etat == 0:
            self.allumer()
        else:
            self.eteindre()

    def sauvegarder_etat(self):
        """Sauvegarde l'état actuel de la LED dans data.json."""
        try:
            data = {}
            if os.path.exists("data.json"):
                with open("data.json", "r") as file:
                    data = json.load(file)

            if "led_states" not in data:
                data["led_states"] = {}
            data["led_states"][self.led_id] = self.etat

            with open("data.json", "w") as file:
                json.dump(data, file, indent=4)
        except (FileNotFoundError, json.JSONDecodeError):
            print("Erreur lors de la sauvegarde de l'état de la LED.")

    def lire_etat_actuel(self):
        """Lit l'état actuel de la LED à partir du fichier data.json."""
        try:
            if os.path.exists("data.json"):
                with open("data.json", "r") as file:
                    data = json.load(file)
                    return data.get("led_states", {}).get(self.led_id, 0)
            return 0
        except (FileNotFoundError, json.JSONDecodeError):
            print("Erreur lors de la lecture de l'état de la LED.")
            return 0

    def lire_etat(self):
        """Lit l'état actuel de la LED à partir du fichier data.json."""
        self.etat = self.lire_etat_actuel()
        return self.etat

    def fonctionnement(self):
        return "La lumière est fonctionnelle."
