import tkinter as tk
import objets

#    light_button = tk.Button(root, text="Interface Lumières", 
#                             font=("TT Octosquares Trl", 14), 
#                             command=open_light_interface)
#    light_button.pack(side='bottom', anchor='se', padx=20, pady=20)

def turn_on_red():
    """Allume la lumière rouge."""
    objets.red_led.changer_etat()

def turn_on_blue():
    """Allume la lumière bleue."""
    objets.blue_led.changer_etat()

def turn_on_green():
    """Allume la lumière verte."""
    objets.green_led.changer_etat()


def show_light_interface(root):
    """Affiche l'interface de contrôle des lumières dans la même fenêtre."""
    # Efface les widgets existants
    for widget in root.winfo_children():
        widget.destroy()

    # Background noir
    root.configure(bg='black')

    # Titre
    title_label = tk.Label(root, text="Actions pour les lumières", 
                           font=("TT Octosquares Trl", 24), 
                           bg='black', 
                           fg='white')
    title_label.pack(pady=20)

    # Boutons pour contrôler les lumières
    red_button = tk.Button(root, text="Lumière Rouge", 
                           font=("TT Octosquares Trl", 14), 
                           command=turn_on_red, 
                           bg='red', 
                           fg='white')
    red_button.pack(pady=10)

    blue_button = tk.Button(root, text="Lumière Bleue", 
                            font=("TT Octosquares Trl", 14), 
                            command=turn_on_blue, 
                            bg='blue', 
                            fg='white')
    blue_button.pack(pady=10)

    green_button = tk.Button(root, text="Lumière Verte", 
                             font=("TT Octosquares Trl", 14), 
                             command=turn_on_green, 
                             bg='green', 
                             fg='white')
    green_button.pack(pady=10)

    # Bouton retour à l'interface principale
    return_button = tk.Button(root, text="Retour", 
                              font=("TT Octosquares Trl", 14), 
                              command=lambda: return_to_main(root))
    return_button.pack(side='bottom', pady=20)

def return_to_main(root):
    """Retourne à l'interface principale."""
    # Efface les widgets existants
    for widget in root.winfo_children():
        widget.destroy()
    
    # Importe la fonction pour restaurer l'interface principale
    from interface import change_background
    change_background()
