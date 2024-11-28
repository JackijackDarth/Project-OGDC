import requests
import wave
import pyaudio
from Commande import *

server_ip = "74.56.163.144"
duration = 5

def record(fichier, duration=5):
    chunk = 1024
    sample_format = pyaudio.paInt16
    channels = 1
    fs = 16000

    p = pyaudio.PyAudio()

    print("Enregistrement...")
    stream = p.open(format=sample_format, channels=channels, rate=fs, input=True, frames_per_buffer=chunk)
    
    frames = []
    
    for _ in range(0, int(fs / chunk * duration)):
        data = stream.read(chunk)
        frames.append(data)

    print("Enregistrement complété")
    
    stream.stop_stream()
    stream.close()
    p.terminate()
    
    with wave.open(fichier, 'wb') as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(p.get_sample_size(sample_format))
        wf.setframerate(fs)
        wf.writeframes(b''.join(frames))

def envoyer(fichier):
    url = "http://" + server_ip + ":5000/vosk"
    with open(fichier, 'rb') as f:
        files = {'file': f}
        reponse = requests.post(url, files=files)
    return reponse.json()

if __name__ == "__main__":
    fichier = "speech.wav"
    record(fichier, duration=duration)
    result = envoyer(fichier)
    commande = Commande("")
    text = result["text"]
    
    if text != "":
        commandeText = text.split()
        print(commandeText)
        
        if len(commandeText) > 0:
            print("Commande reçue")
            commande.commande = " ".join(commandeText)
            commande.execute_command()
