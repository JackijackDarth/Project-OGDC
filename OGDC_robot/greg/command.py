import os
from vosk import Model, KaldiRecognizer
import pyaudio
from gtts import gTTS
from playsound import playsound
import multiprocessing
import objets
import time
model = Model("vosk-model-fr-0.22")
recognizer = KaldiRecognizer(model, 16000)
from etatLEDs import red_led_state, blue_led_state, green_led_state

language = 'fr'

musique_playing = False
pMusique = multiprocessing.Process(target=playsound, args=('musique.mp3'))

mic = pyaudio.PyAudio()
stream = mic.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=8192)
stream.start_stream()

def lecture_musique():
    musique_playing = True
    pMusique.start()
def arreter_musique():
    musique_playing = False
    pMusique.terminate()

while True:
    data = stream.read(512)

    if recognizer.AcceptWaveform(data):
        text = f"{recognizer.Result()[14:-3]}"
        print(text)
        if text != "":
            commande = text.split()
            print(commande)
            if (commande[0] == "greg" and len(commande) > 1):
                print("commande recu")
                if (commande[1] == "musique"):
                    #if musique_playing:
                    #    arreter_musique()
                    #else:
                    #    lecture_musique()
                    playsound("musique.mp3", block=False)
                elif (commande[1] == "rouge"):
                    objets.red_led.changer_etat()
                    if objets.red_led.etat == 0:
                        myobj = gTTS(text="Lumière rouge éteinte.", lang=language, slow=False)
                    elif objets.red_led.etat == 1:
                        myobj = gTTS(text="Lumière rouge allumée.", lang=language, slow=False)
                    myobj.save("speech.mp3")
                    playsound('speech.mp3')
                elif (commande[1] == "bleu"):
                    objets.blue_led.changer_etat()
                    if objets.blue_led.etat == 0:
                        myobj = gTTS(text="Lumière bleue éteinte.", lang=language, slow=False)
                    elif objets.blue_led.etat == 1:
                        myobj = gTTS(text="Lumière bleue allumée.", lang=language, slow=False)
                    myobj.save("speech.mp3")
                    playsound('speech.mp3')
                elif (commande[1] == "verte"):
                    objets.green_led.changer_etat()
                    if objets.green_led.etat == 0:
                        myobj = gTTS(text="Lumière verte éteinte.", lang=language, slow=False)
                    elif objets.green_led.etat == 1:
                        myobj = gTTS(text="Lumière verte allumée.", lang=language, slow=False)
                    myobj.save("speech.mp3")
                    playsound('speech.mp3')
                elif (commande[1] == "capteur"):
                    myobj = gTTS(text="J'active le capteur de mouvement pendant vingt secondes.", lang=language, slow=False)
                    myobj.save("speech.mp3")
                    playsound('speech.mp3')
                    start_time = time.time()
                    movement_detected = False
                    while time.time() - start_time < 20:
                        sensor_data = objets.movement_sensor.lire()
                        print(sensor_data)
                        if sensor_data == "Mouvement détecté":
                            playsound("bip.mp3")
                            movement_detected = True
                        time.sleep(0.5)
                    if not movement_detected:
                        print("Aucun mouvement détecté pendant 20 secondes.")
                elif (commande[1] == "température"):
                    temperature, humidity = objets.temperature_sensor.lire_temperature_humidite()
                    myobj = gTTS(text=f"La température de la pièce est de {temperature} degrés et l'humidité est de {humidity} pour cent.", lang=language, slow=False)
                    myobj.save("speech.mp3")
                    playsound('speech.mp3')
                elif (commande[1] == "quitter"):
                    print("Quittage en cours")
                    with open('exit_flag.txt', 'w') as f:
                        f.write('True')
                    exit_program = True
                    break
