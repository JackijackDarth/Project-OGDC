import subprocess
import time
import speech_recognition as sr
import os

def start_voice_recognition():
    """Lance la reconnaissance vocale."""
    recognizer = sr.Recognizer()
    microphone = sr.Microphone()

    with microphone as source:
        print("Dites quelque chose...")
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)

    try:
        if os.path.exists('activate_voice.txt'):
            with open('activate_voice.txt', 'r') as file:
                not_active = file.read().strip() == 'False'
        
        command = recognizer.recognize_google(audio, language="fr-FR")
        print(f"Vous avez dit : '{command}'")
        
        if "Greg" in command and not_active:
            with open('trigger_voice_recognition.txt', 'w') as f:
                f.write('triggered')
            return True
            
    except sr.UnknownValueError:
        print("Je n'ai pas compris votre commande.")
    except sr.RequestError as e:
        print(f"Erreur avec le service de reconnaissance vocale : {e}")

    return False

def check_exit_flag():
    """Vérifie si le fichier exit_flag.txt est à True."""
    if os.path.exists('exit_flag.txt'):
        with open('exit_flag.txt', 'r') as f:
            status = f.read().strip()
            if status == 'True':
                return True
    return False

def main():
    """Boucle principale pour la reconnaissance vocale."""
    while True:
        if check_exit_flag():
            print("Arrêt de la reconnaissance vocale en raison du signal d'arrêt.")
            break

        if os.path.exists('activate_voice.txt'):
            with open('activate_voice.txt', 'r') as file:
                not_active = file.read().strip() == 'False'
            
            if not_active:
                start_voice_recognition()
            else:
                print("La reconnaissance vocale est désactivée.")
                break
        else:
            print("Le fichier 'activate_voice.txt' n'existe pas.")
            break

if __name__ == "__main__":
    main()