from vosk import Model, KaldiRecognizer
import pyaudio

model = Model("vosk-model-fr-0.22")
recognizer = KaldiRecognizer(model, 16000)

mic = pyaudio.PyAudio()
stream = mic.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=8192)
stream.start_stream()

while True:
    data = stream.read(512)


    if recognizer.AcceptWaveform(data):
        text = recognizer.Result()
        print(f"' {text[14:-3]} '")