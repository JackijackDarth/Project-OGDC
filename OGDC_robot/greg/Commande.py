from gtts import gTTS
from playsound import playsound
import multiprocessing
import python_weather
import os
import asyncio
import json
import time
import pyaudio
import objets
import connServ
import note_user
from text_to_num import text2num
import interfaceCam

language = 'fr'
json_path = "./note.json"

class Commande:
    rep_info = None
    root = None
    change_background_method = None

    def __init__(self, commande):
        self.commande = commande
        self.en_fonction = True
        if Commande.rep_info:
            self.note_user = note_user.NoteUser(Commande.rep_info.get("Id"))

    @classmethod
    def set_user(cls, user_info):
        cls.rep_info = user_info

    @classmethod
    def set_root(cls, root_instance):
        cls.root = root_instance

    @classmethod
    def set_change_background_method(cls, method):
        cls.change_background_method = method

    def update_command_status(self, command_name):
        try:
            with open("commandes_data.json", "r") as file:
                data = json.load(file)

            for key in data:
                data[key] = command_name if key == command_name else None

            with open("commandes_data.json", "w") as file:
                json.dump(data, file, indent=4)
        except Exception as e:
            print(f"Erreur lors de la mise à jour de commandes_data.json : {e}")
    
    def execute_command(self):
        if("musique" in self.commande): self.musique()
        elif("répète" in self.commande): self.repete()
        elif("météo" in self.commande or "meteo" in self.commande): asyncio.run(self.meteo())
        elif("supprimer" in self.commande): self.delete_note()
        elif("note" in self.commande): self.note()
        elif("rouge" in self.commande): self.rouge()
        elif("bleu" in self.commande): self.bleu()
        elif("vert" in self.commande or "verte" in self.commande): self.vert()
        elif("capteur" in self.commande): self.capteur()
        elif("température" in self.commande): self.temperature()
        elif("caméra" in self.commande): self.camera()
        elif("quitter" in self.commande): self.quitter()
        elif("teste" in self.commande or "test" in self.commande): self.test()

        else: self.inconnue()

    def word_to_numbers(self):
        commande = "supprimer"
        print(self.extract_word(commande))
        try:
            return text2num(self.extract_word(commande), language, True)
        except:
            return 0
    
    def parler(self, text):
        myobj = gTTS(text=text , lang=language, slow=False)
        myobj.save("speech.mp3")
        playsound('speech.mp3')
    
    def extract_word(self, mot):
        temp = self.commande.split(mot, 1)
        if len(temp) > 1:
            temp = temp[1].strip()
        else:
            temp = self.commande
        return temp
    
    def musique(self):
        self.update_command_status("musique")
        self.parler("Lecture")
        playsound('musique.mp3')
        self.update_command_status(None)

    def repete(self):
        commande = self.extract_word("répète")
        self.update_command_status("repete")
        self.parler(commande)
        self.update_command_status(None)

    def test(self):
        self.update_command_status("test")
        self.parler("test test test")
        self.update_command_status(None)

    async def meteo(self):
            client = python_weather.Client(unit=python_weather.METRIC, locale=python_weather.Locale.FRENCH)
            #weather = await client.get("Sainte-Thérèse")
            temp = self.extract_word("météo")
            if("à" in temp):
                temp = self.extract_word("à")
            weather = await client.get(temp)
            if(weather.location == "Ban Not"):
                self.update_command_status("meteo")
                self.parler("Nom de ville invalide.")
                self.update_command_status(None)
            else:
                meteo = []
                meteo.append("La météo à " + weather.location)
                meteo.append(", Température: " + str(weather.temperature) + "°C")
                meteo.append(", L'humidité: " + str(weather.humidity) + "%")
                meteo.append(", Température ressentis: " + str(weather.feels_like) + "°C")
                meteo.append(", La vitesse du vent: " + str(weather.wind_speed) + " kilomètre par heure")
                meteo = " ".join(meteo)
                print(meteo)
                self.update_command_status("meteo")
                self.parler(meteo)
                self.update_command_status(None)

            await client.close()

    def inconnue(self):
        self.update_command_status("inconnue")
        self.parler("Commande inconnue")
        self.update_command_status(None)

    def camera(self):
        try:
            with open("data.json", "r") as file:
                data = json.load(file)

            if data.get("camera") == "La caméra est en cours d'utilisation":
                self.update_command_status("camera")
                self.parler("La caméra est déjà ouverte.")
                self.update_command_status(None)
                return

            self.update_command_status("camera")
            self.parler("Ouverture de la caméra")
            self.update_command_status(None)
            interfaceCam.CameraInterface(Commande.root, Commande.change_background_method)

            data["camera"] = "La caméra est en cours d'utilisation"
            with open("data.json", "w") as file:
                json.dump(data, file, indent=4)

        except Exception as e:
            print(f"Erreur lors de l'ouverture de la caméra : {e}")
            self.update_command_status("camera")
            self.parler("Erreur lors de l'ouverture de la caméra.")
            self.update_command_status(None)

    def quitter(self):
        global exit_program
        self.update_command_status("quitter")
        self.parler("Fermeture de l'application")
        self.update_command_status(None)
        with open('data.json', 'r') as file:
            data = json.load(file)
        
        data['exit_flag'] = True
        
        with open('data.json', 'w') as file:
            json.dump(data, file, indent=4)
        exit_program = True
        self.en_fonction = False
    
    def note(self):
        note = self.extract_word("note")
        if hasattr(self, 'note_user'):
            noteServ = self.note_user.add_note(note)
            if not noteServ:
                print("Échec de la publication de la note sur le serveur.")
            else:
                self.update_command_status("note")
                self.parler("Note prise " + note)
                self.update_command_status(None)
        else:
            print("L'id n'a pas été passée correctement.")

    def delete_note(self):
        id = self.word_to_numbers()
        noteServ = connServ.delete_note(id)
        if noteServ:
            print("Échec de la suppression de la note sur le serveur.")
        else:
            self.update_command_status("delete_note") 
            self.parler("Note " + str(id) + " supprimée")
            self.update_command_status(None)

    def rouge(self):
        if objets.red_led.lire_etat() == 0:
            objets.red_led.allumer()
            text="Lumière rouge allumée."
        elif objets.red_led.lire_etat() == 1:
            objets.red_led.eteindre()
            text="Lumière rouge éteinte."
        self.update_command_status("rouge")
        self.parler(text)
        self.update_command_status(None)
    
    def bleu(self):
        if objets.blue_led.lire_etat() == 0:
            objets.blue_led.allumer()
            text="Lumière bleu allumée."
        elif objets.blue_led.lire_etat() == 1:
            objets.blue_led.eteindre()
            text="Lumière bleu éteinte."
        self.update_command_status("bleu")
        self.parler(text)
        self.update_command_status(None)

    def vert(self):
        if objets.green_led.lire_etat() == 0:
            objets.green_led.allumer()
            text="Lumière verte allumée."
        elif objets.green_led.lire_etat() == 1:
            objets.green_led.eteindre()
            text="Lumière verte éteinte."
        self.update_command_status("vert")
        self.parler(text)
        self.update_command_status(None)
   
    def capteur(self):
        text="J'active le capteur de mouvement pendant dix secondes."
        self.update_command_status("capteur")
        self.parler(text)
        start_time = time.time()
        movement_detected = False
        while time.time() - start_time < 10:
            sensor_data = objets.movement_sensor.lire()
            print(sensor_data)
            if sensor_data == "Mouvement détecté":
                playsound("bip.mp3")
                movement_detected = True
            time.sleep(0.5)
        if not movement_detected:
            print("Aucun mouvement détecté pendant 10 secondes.")
        self.update_command_status(None)

    def temperature(self):
        temperature, humidity = objets.temperature_sensor.lire_temperature_humidite()
        text=f"La température de la pièce est de {temperature} degrés et l'humidité est de {humidity} pour cent."
        self.update_command_status("temperature")
        self.parler(text)
        self.update_command_status(None)