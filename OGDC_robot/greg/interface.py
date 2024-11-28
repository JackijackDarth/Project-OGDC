import os
import tkinter as tk
from PIL import Image, ImageTk
import connServ
import objets
import requests
import threading
from playsound import playsound
from Commande import *
import wave
import pyaudio
import json
import asyncio
from tkinter import ttk
from datetime import datetime

jours_fr = {
    'Monday': 'Lundi', 'Tuesday': 'Mardi', 'Wednesday': 'Mercredi',
    'Thursday': 'Jeudi', 'Friday': 'Vendredi', 'Saturday': 'Samedi', 'Sunday': 'Dimanche'
}

mois_fr = {
    'January': 'Janvier', 'February': 'Février', 'March': 'Mars', 'April': 'Avril',
    'May': 'Mai', 'June': 'Juin', 'July': 'Juillet', 'August': 'Août',
    'September': 'Septembre', 'October': 'Octobre', 'November': 'Novembre', 'December': 'Décembre'
}

connected = False
stop_event = threading.Event()
exit_program = False
voice_thread_1 = None  # Thread de détection du mot "Greg"
voice_thread_2 = None  # Thread pour exécuter des commandes
server_ip = "74.56.163.144"
duration = 5
trigger = "greg"

scheduled_task_id = None
check_exit_task_id = None
initialize_devices_task_id = None
execute_manage_temp_task_id = None
fetch_commands_task_id = None
fetch_note_id = None
note_list_task_id = None
update_message_task_id = None
check_button_task_id = None
update_status_id = None
execute_manage_camera_id = None
fetch_automatisation_id = None
date_id = None

voice_thread_lock = threading.Lock()
json_lock = threading.Lock()

idFamille = None

is_closing = False

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

async def envoyer(fichier):
    url = "http://" + server_ip + ":5000/vosk"
    with open(fichier, 'rb') as f:
        files = {'file': f}
        reponse = requests.post(url, files=files)
    return reponse.json()

def detect_greg():
    while not stop_event.is_set():
        fichier = "speech.wav"
        record(fichier, duration=2.75)
        result = asyncio.run(envoyer(fichier))
        print(result)
        if "greg" in result["text"].lower():
            print("Mot 'Greg' détecté")
            start_command_recognition()
            break
    stop_event.clear()

def start_command_recognition():
    global voice_thread_2
    fichier = "speech.wav"

    update_button_while_listening()

    with voice_thread_lock:
        record(fichier, duration=duration)
        result = asyncio.run(envoyer(fichier))

        commande = Commande("")
        text = result["text"]
        if text != "":
            commandeText = text.split()
            print(commandeText)

            if len(commandeText) > 0:
                print("Commande reçue")
                commande.commande = " ".join(commandeText)
                commande.execute_command()

    reset_button_after_recognition()
    restart_first_thread()

def update_button_while_listening():
    voice_button_canvas.itemconfig("square", fill="#4B0082")
    voice_button_canvas.itemconfig("text", text="À l'écoute")
    root.update_idletasks()

def reset_button_after_recognition():
    root.after(100, lambda: (
        voice_button_canvas.itemconfig("square", fill="blue"),
        voice_button_canvas.itemconfig("text", text="Activer\nr. vocale"),
        root.update_idletasks()
    ))

def restart_first_thread():
    global voice_thread_1
    stop_event.clear()
    voice_thread_1 = threading.Thread(target=detect_greg)
    voice_thread_1.start()

def start_voice_recognition():
    global voice_thread_1
    if voice_thread_1 is None or not voice_thread_1.is_alive():
        voice_thread_1 = threading.Thread(target=detect_greg)
        voice_thread_1.start()

def button_pressed():
    global voice_thread_1, voice_thread_2
    if voice_thread_1 is not None and voice_thread_1.is_alive():
        stop_event.set()
        voice_thread_1.join()

    if voice_thread_2 is None or not voice_thread_2.is_alive():
        voice_thread_2 = threading.Thread(target=start_command_recognition)
        voice_thread_2.start()

def reset_exit_flag():
    with json_lock:
        with open('data.json', 'r') as file:
            data = json.load(file)
        
        data['exit_flag'] = False
        
        with open('data.json', 'w') as file:
            json.dump(data, file, indent=4)
reset_exit_flag()

def reset_temp_flag():
    with json_lock:
        with open('data.json', 'r') as file:
            data = json.load(file)
        
        data['manage_temp'] = None
        
        with open('data.json', 'w') as file:
            json.dump(data, file, indent=4)
reset_temp_flag()

def reset_camera_flag():
    with json_lock:
        with open('data.json', 'r') as file:
            data = json.load(file)
        
        data['camera'] = "La caméra est éteinte"
        
        with open('data.json', 'w') as file:
            json.dump(data, file, indent=4)
reset_camera_flag()

def resize_image(image_path, screen_width, screen_height):
    with Image.open(image_path) as img:
        img = img.resize((screen_width, screen_height), Image.LANCZOS)
        return img

def update_status():
    global update_status_id
    global connected
    try:
        rep_info = connServ.get_connected_user()
        if rep_info is not None:
            Commande.set_user(rep_info)
            set_userId(rep_info)
            # print("User Info:", rep_info)
            if rep_info.get('type') == 'user':
                if rep_info.get('isLogin'):
                    username = rep_info.get('username', 'Utilisateur')
                    if status_label.winfo_exists():
                        status_label.config(text=f"Bienvenue, {username} !")
                    if not connected:
                        connected = True
                        root.after(5000, change_background)
                else:
                    status_label.config(text="En attente d'association...")
                    connected = False
            elif rep_info.get('type') == 'famille':
                name = rep_info.get('name', 'Nom')
                if status_label.winfo_exists():
                    status_label.config(text=f"Bienvenue, {name} !")
                if not connected:
                    connected = True
                    root.after(5000, change_background)
    except requests.exceptions.RequestException as e:
        if status_label.winfo_exists():
            status_label.config(text="Erreur de connexion au serveur.")
        print(f"Erreur lors de la tentative de connexion au serveur : {e}")
    
    update_status_id = root.after(300000, update_status)

def reset_devices():
    objets.red_led.eteindre()
    objets.green_led.eteindre()
    objets.blue_led.eteindre()
    objets.button.relacher()
    objets.temperature_sensor.annuler_simulation()

    print("Tous les périphériques ont été réinitialisés.")

def create_voice_button():
    global voice_button_canvas, reset_button, notes_frame, scrollable_frame, scroll_canvas, up_button, down_button

    voice_button_canvas = tk.Canvas(root, width=200, height=200, highlightthickness=0, bg=root['bg'])
    voice_button_canvas.place(relx=0.3, rely=0.6, anchor='center')

    square_size = 160
    x_center, y_center = 100, 100

    voice_button_canvas.create_rectangle(
        x_center - square_size // 2, y_center - square_size // 2,
        x_center + square_size // 2, y_center + square_size // 2,
        fill="blue", outline="", tags="square"
    )

    voice_button_canvas.create_text(
        x_center, y_center, text="Activer\n r. vocale",
        font=("TT Octosquares Trl", 16), fill="white", justify="center", tags="text"
    )

    voice_button_canvas.tag_bind("square", "<Button-1>", lambda e: button_pressed())
    voice_button_canvas.tag_bind("text", "<Button-1>", lambda e: button_pressed())

    notes_frame = tk.Frame(root, bg=root['bg'])
    notes_frame.place(relx=0.7, rely=0.6, anchor='center', width=260, height=260)

    title_label = tk.Label(
        notes_frame, text="Notes", font=("TT Octosquares Trl", 18, "bold"), bg="yellow", fg="black"
    )
    title_label.pack(side="top", fill="x", pady=5)

    scroll_canvas = tk.Canvas(notes_frame, bg="yellow", highlightthickness=1, highlightbackground="black")
    scrollbar = ttk.Scrollbar(notes_frame, orient="vertical", command=scroll_canvas.yview)

    scrollable_frame = tk.Frame(scroll_canvas, bg="yellow")

    scroll_canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
    scroll_canvas.configure(yscrollcommand=scrollbar.set)

    scroll_canvas.pack(side="left", fill="both", expand=True)
    scrollbar.pack(side="right", fill="y")

    def on_swipe(event):
        """Gère les événements de glissement pour le défilement tactile."""
        if event.num == 1:
            scroll_canvas.yview_scroll(-1 if event.delta < 0 else 1, "units")

    scroll_canvas.bind("<B1-Motion>", on_swipe)

    scrollable_frame.bind(
        "<Configure>",
        lambda e: scroll_canvas.configure(scrollregion=scroll_canvas.bbox("all"))
    )

    def page_up():
        scroll_canvas.yview_scroll(-1, "units")

    def page_down():
        scroll_canvas.yview_scroll(1, "units")

    up_button = tk.Button(root, text="↑", font=("TT Octosquares Trl", 14), command=page_up, bg="yellow", relief="flat")
    down_button = tk.Button(root, text="↓", font=("TT Octosquares Trl", 14), command=page_down, bg="yellow", relief="flat")

    up_button.place(relx=0.9, rely=0.55, anchor="center")
    down_button.place(relx=0.9, rely=0.65, anchor="center")

    display_notes(scrollable_frame)

    reset_button = tk.Button(root, text="Réinitialiser périf.", 
                             font=("TT Octosquares Trl", 14), 
                             command=reset_devices)
    reset_button.pack(side='bottom', anchor='se', padx=20, pady=10)


def display_notes(frame):
    for widget in frame.winfo_children():
        widget.destroy()

    notes = fetch_note()

    if not notes:
        tk.Label(frame, text="Aucune note disponible.", font=("TT Octosquares Trl", 14), bg="yellow").pack(pady=10)
        return

    headers = ["ID", "Message", "Nom"]
    for col, text in enumerate(headers):
        tk.Label(frame, text=text, font=("TT Octosquares Trl", 12, "bold"), bg="yellow", fg="black", anchor="w").grid(
            row=0, column=col, padx=5, pady=5, sticky="w"
        )

    for row, note in enumerate(notes, start=1):
        id_note = note.get('Id', 'X')
        message = note.get('message', 'Message non disponible')[:12]
        if len(note.get('message', '')) > 12:
            message += "..."
        name = note.get('name', 'Aucun')[:8]
        if len(note.get('name', '')) > 8:
            name += "..."
        values = [id_note, message, name]
        for col, value in enumerate(values):
            tk.Label(frame, text=value, font=("TT Octosquares Trl", 12), bg="yellow", fg="black", anchor="w", wraplength=220).grid(
                row=row, column=col, padx=5, pady=5, sticky="w"
            )

def reset_background_image():
    global bg_image_tk
    if bg_image_tk:
        bg_image_tk = None
    bg_label.config(image=None)
    bg_label.image = None

def change_background():
    reset_background_image()

    background_image = resize_image('background2.png', screen_width, screen_height)
    bg_image_tk = ImageTk.PhotoImage(background_image)
    bg_label.config(image=bg_image_tk)
    bg_label.image = bg_image_tk

    update_status_label()

    global new_status_label
    if 'new_status_label' in globals() and new_status_label.winfo_exists():
        new_status_label.destroy()

    new_status_label = tk.Label(
        root, 
        text="", 
        font=("TT Octosquares Trl", 18), 
        bg='black', 
        fg='white'
    )
    new_status_label.pack(pady=7)

    if 'voice_button_canvas' in globals() and voice_button_canvas.winfo_exists():
        voice_button_canvas.destroy()

    if 'reset_button' in globals() and reset_button.winfo_exists():
        reset_button.destroy()

    if 'notes_frame' in globals() and notes_frame.winfo_exists():
        notes_frame.destroy()

    if 'up_button' in globals() and up_button.winfo_exists():
        up_button.destroy()

    if 'down_button' in globals() and down_button.winfo_exists():
        down_button.destroy()

    create_voice_button()

    if not hasattr(change_background, 'tasks_started'):
        execute_manage_temp()
        start_periodic_tasks()
        fetch_note_list()
        change_background.tasks_started = True

    start_voice_recognition()

def start_periodic_tasks():
    global update_message_task_id, check_button_task_id, fetch_commands_task_id, fetch_note_id, fetch_automatisation_id, date_id

    def update_all_periodic_tasks():
        update_status_label()
        update_message()
        check_button()
        fetch_commands()
        fetch_note()
        fetch_automatisation()
        root.after(1000, update_all_periodic_tasks)

    update_all_periodic_tasks()

def update_status_label():
    current_datetime = datetime.now()
    day_of_week = current_datetime.strftime("%A")
    day = current_datetime.day
    month = current_datetime.strftime("%B")
    time = current_datetime.strftime("%H:%M")
    year = current_datetime.strftime("%Y")

    day_of_week_fr = jours_fr.get(day_of_week, day_of_week)
    month_fr = mois_fr.get(month, month)

    datetime_string = f"{day_of_week_fr}, {day} {month_fr} {year} | {time}"

    status_label.destroy()
    label.config(text=f"{datetime_string}")
    
def open_light_interface():
    import greg.interfaceTestDEL as interfaceTestDEL
    interfaceTestDEL.show_light_interface(root)

def update_message():
    messages = [
        "Pour savoir la température et humidité, dites 'Greg, température'.",
        "Pour allumer ou éteindre, dites 'Greg, <couleur_del>'.",
        "Pour utiliser le capteur de mouvement, dites 'Greg, capteur'.",
        "Essayez 'Greg, musique'.",
        "Appuyez sur le bouton, juste pour voir."
    ]

    current_message_index = getattr(update_message, 'index', 0)
    new_status_label.config(text=messages[current_message_index])
    update_message.index = (current_message_index + 1) % len(messages)

def check_authentication():
    global scheduled_task_id
    update_status()
    scheduled_task_id = root.after(300000, check_authentication)

def check_exit_status():
    global check_exit_task_id
    global exit_program
    try:
        with open('data.json', 'r') as file:
            data = json.load(file)
            exit_flag = data.get('exit_flag', False)
            
            if exit_flag:
                quit_program()
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Erreur lors de la lecture du fichier data.json : {e}")
    
    if exit_program:
        quit_program()
    else:
        check_exit_task_id = root.after(1000, check_exit_status)

def quit_program():
    global is_closing, voice_thread_1, voice_thread_2, update_status_id, scheduled_task_id, check_exit_task_id, initialize_devices_task_id
    global execute_manage_temp_task_id, fetch_commands_task_id, fetch_note_id, note_list_task_id, update_message_task_id, check_button_task_id, fetch_automatisation_id, execute_manage_camera_id, date_id

    if is_closing:
        return

    is_closing = True
    stop_event.set()

    scheduled_tasks = [
        update_status_id, scheduled_task_id, check_exit_task_id, initialize_devices_task_id,
        execute_manage_temp_task_id, fetch_commands_task_id, fetch_note_id, note_list_task_id, update_message_task_id,
        check_button_task_id, fetch_automatisation_id, execute_manage_camera_id, date_id
    ]
    for task_id in scheduled_tasks:
        if task_id is not None:
            root.after_cancel(task_id)

    with voice_thread_lock:
        if voice_thread_1 is not None and voice_thread_1.is_alive():
            voice_thread_1.join()
        if voice_thread_2 is not None and voice_thread_2.is_alive():
            voice_thread_2.join()

    print("Tous les threads ont été arrêtés.")
    root.quit()
    root.destroy()

def check_button():
    etat_bouton = objets.button.lire()
    if etat_bouton == 1:
        playsound('greg.mp3')

def fetch_commands():
    if not connServ.get_commands_app():
        print("Aucune commandes passées ou à effectuer.")

def set_userId(id):
    global idFamille
    idFamille = id.get("Id")

def fetch_note():
    global idFamille
    notes = connServ.get_note(idFamille)
    return notes

def fetch_note_list():
    global note_list_task_id
    display_notes(scrollable_frame)
    note_list_task_id = root.after(10000, fetch_note_list)

def fetch_automatisation():
    automatisationServ = connServ.get_automatisation()
    if (automatisationServ == None):
        print("Échec de l'obtention des automatisations sur le serveur.")

def play_sound(sound_file):
    playsound(sound_file)

def heater():
    heater_image_path = 'heater.png'
    if not os.path.exists(heater_image_path):
        print(f"Image {heater_image_path} non trouvée.")
        return

    heater_img = Image.open(heater_image_path)
    heater_img.thumbnail((100, 100))
    global heater_tk
    heater_tk = ImageTk.PhotoImage(heater_img)

    heater_label = tk.Label(root, image=heater_tk, bg='black')
    heater_label.place(x=10, y=screen_height - 110)

    sound_thread = threading.Thread(target=play_sound, args=('heater_sound.mp3',))
    sound_thread.start()

    def check_target_temp():
        current_temp = objets.temperature_sensor.lire_temp_from_file()
        target_temp = objets.temperature_sensor.obtenir_temperature_cible()
        if current_temp < target_temp:
            blink_red_led(True, 5)
            root.after(100, check_target_temp)
        else:
            heater_label.destroy()
            objets.red_led.eteindre()
            reset_temp_flag()

    def blink_red_led(state, remaining_blinks):
        if remaining_blinks > 0:
            if state:
                objets.red_led.allumer()
            else:
                objets.red_led.eteindre()
            root.after(100, lambda: blink_red_led(not state, remaining_blinks - 1))
        else:
            objets.red_led.eteindre()

    check_target_temp()

def ac():
    ac_image_path = 'ac.png'
    if not os.path.exists(ac_image_path):
        print(f"Image {ac_image_path} non trouvée.")
        return

    ac_img = Image.open(ac_image_path)
    ac_img.thumbnail((100, 100))
    global ac_tk
    ac_tk = ImageTk.PhotoImage(ac_img)

    ac_label = tk.Label(root, image=ac_tk, bg='black')
    ac_label.place(x=10, y=screen_height - 110)

    sound_thread = threading.Thread(target=play_sound, args=('ac_sound.mp3',))
    sound_thread.start()

    def check_target_temp():
        current_temp = objets.temperature_sensor.lire_temp_from_file()
        target_temp = objets.temperature_sensor.obtenir_temperature_cible()
        if current_temp > target_temp:
            blink_blue_led(True, 5)
            root.after(500, check_target_temp)
        else:
            ac_label.destroy()
            objets.blue_led.eteindre()
            reset_temp_flag()

    def blink_blue_led(state, remaining_blinks):
        if remaining_blinks > 0:
            if state:
                objets.blue_led.allumer()
            else:
                objets.blue_led.eteindre()
            root.after(500, lambda: blink_blue_led(not state, remaining_blinks - 1))
        else:
            objets.blue_led.eteindre()

    check_target_temp()


devices = objets.get_devices()
connServ.post_device_list(connServ.raspberry_name, devices)

def initialize_devices():
    global initialize_devices_task_id
    list_objets = connServ.get_device_list()
    update_list = objets.new_list(list_objets['listeObjets'])
    connServ.put_device_list(connServ.raspberry_name, update_list)
    initialize_devices_task_id = root.after(500, initialize_devices)

def execute_manage_temp():
    global execute_manage_temp_task_id
    with open('data.json', 'r') as file:
        data = json.load(file)
    command = data.get('manage_temp')
    if command == 'heater_on':
        heater()
    elif command == 'ac_on':
        ac()
    execute_manage_temp_task_id = root.after(500, execute_manage_temp)

root = tk.Tk()
root.attributes('-fullscreen', True)
root.config(cursor='none')

screen_width = root.winfo_screenwidth()
screen_height = root.winfo_screenheight()

background_image = resize_image('background.png', screen_width, screen_height)
bg_image_tk = ImageTk.PhotoImage(background_image)

bg_label = tk.Label(root, image=bg_image_tk)
bg_label.place(relwidth=1, relheight=1)

label = tk.Label(root, text="Salut, je suis OGDC.\nVous pouvez m'appeler Greg.", 
                 font=("TT Octosquares Trl", 24), 
                 bg='black', 
                 fg='white')
label.pack(pady=20)

status_label = tk.Label(root, text="En attente d'association...", 
                        font=("TT Octosquares Trl", 18), 
                        bg='black', 
                        fg='white')
status_label.pack(pady=10)

Commande.set_root(root)
Commande.set_change_background_method(change_background)
connServ.post_user_notification(connServ.raspberry_name, connServ.raspberry_device)
check_exit_status()
check_authentication()
initialize_devices()
root.mainloop()