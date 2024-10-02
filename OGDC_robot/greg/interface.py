import os
import tkinter as tk
from PIL import Image, ImageTk
import connServ
import objets
import requests
import subprocess
from playsound import playsound

exit_program = False

def reset_exit_flag():
    """Réinitialise le fichier exit_flag.txt à False au lancement."""
    with open('exit_flag.txt', 'w') as f:
        f.write('False')
reset_exit_flag()

def resize_image(image_path, screen_width, screen_height):
    """Redimensionne l'image pour qu'elle s'adapte à l'écran."""
    with Image.open(image_path) as img:
        img = img.resize((screen_width, screen_height), Image.LANCZOS)
        return img

def update_status():
    """Met à jour le texte de statut en fonction de la connexion et affiche un message de bienvenue à l'usager connecté."""
    try:
        notification = connServ.post_user_notification(connServ.raspberry_name, connServ.raspberry_device)

        user_info = connServ.get_connected_user()

        if user_info and user_info.get('isLogin'):
            username = user_info.get('username', 'Utilisateur')
            status_label.config(text=f"Bienvenue, {username} !")
            root.after(5000, change_background)
        else:
            status_label.config(text="En attente d'association...")

        print("User Info:", user_info)

    except requests.exceptions.RequestException:
        status_label.config(text="Erreur de connexion au serveur !")

def change_background():
    """Change l'image de fond et met à jour le texte."""
    global bg_image_tk
    background_image = resize_image('background2.png', screen_width, screen_height)
    bg_image_tk = ImageTk.PhotoImage(background_image)
    
    bg_label.config(image=bg_image_tk)
    bg_label.image = bg_image_tk

    status_label.destroy()
    label.config(text="Que voulez-vous faire ?")
    global new_status_label
    new_status_label = tk.Label(root, text="", 
                                 font=("TT Octosquares Trl", 18), 
                                 bg='black', 
                                 fg='white')
    new_status_label.pack(pady=7)
    subprocess.Popen(['bash', 'VA.sh'])
    update_message()
    check_button()
    
def update_message():
    """Met à jour le texte du label toutes les 5 secondes."""
    messages = [
        "Pour savoir la température et humidité, dites 'Greg, température'.",
        "Pour allumer ou éteindre, dites 'Greg, <couleur_del>'.",
        "Pour utiliser le capteur de mouvement, dites 'Greg, capteur'.",
        "Essayez 'Greg, musique'.",
        "Appuyez sur le bouton, juste pour voir."
    ]

    current_message_index = getattr(update_message, 'index', 0)

    new_status_label.config(text=messages[current_message_index])

    current_message_index = (current_message_index + 1) % len(messages)
    update_message.index = current_message_index

    root.after(5000, update_message)

def check_authentication():
    """Vérifie périodiquement l'état de l'authentification."""
    update_status()
    global scheduled_task_id
    scheduled_task_id = root.after(10000, check_authentication)

def check_exit_status():
    global exit_program
    if os.path.exists('exit_flag.txt'):
        with open('exit_flag.txt', 'r') as f:
            status = f.read().strip()
            if status == 'True':
                quit_program()
    
    if exit_program:
        quit_program()
    else:
        root.after(500, check_exit_status)

def quit_program():
    root.destroy()
    root.quit()

def check_button():
   """Vérifie l'état du bouton pour quitter le programme."""
   etat_bouton = objets.button.lire()
   if etat_bouton == 1:
        etat_bouton = objets.button.lire()
        playsound('greg.mp3')
   root.after(500, check_button)

def initialize_devices():
    """Initialise les périphériques et les envoie au serveur."""    
    devices = objets.get_devices()
    connServ.post_device_list(connServ.raspberry_name, devices)
    root.after(5000, initialize_devices)

root = tk.Tk()
root.attributes('-fullscreen', True)

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

check_exit_status()
check_authentication()
initialize_devices()

root.mainloop()
