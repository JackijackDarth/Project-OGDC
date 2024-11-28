import tkinter as tk
from PIL import Image, ImageTk
import os
from device.camera import controllerCamera
from datetime import datetime
import json
from playsound import playsound

def update_camera_status(status):
    try:
        with open("data.json", "r") as file:
            data = json.load(file)

        data["camera"] = status

        with open("data.json", "w") as file:
            json.dump(data, file, indent=4)
    except Exception as e:
        print(f"Erreur lors de la mise à jour de l'état de la caméra : {e}")

class CameraInterface:
    def __init__(self, root, change_background_callback):
        self.root = root
        self.change_background_callback = change_background_callback
        self.camera = controllerCamera()
        self.running = True
        update_camera_status("La caméra est en cours d'utilisation")
        self.camera_canvas = tk.Canvas(self.root, width=self.camera.largeur, height=self.camera.hauteur, bg="black")
        self.camera_canvas.place(relx=0.5, rely=0.5, anchor="center")

        self.close_button = tk.Button(
            self.root,
            text="X",
            font=("TT Octosquares Trl", 18, "bold"),
            bg="red",
            fg="white",
            command=self.close_camera_interface
        )
        self.close_button.place(relx=0.95, rely=0.05, anchor="ne")

        self.capture_button = tk.Button(
            self.root,
            text="Prendre une photo",
            font=("TT Octosquares Trl", 16),
            bg="blue",
            fg="white",
            command=self.capture_image
        )
        self.capture_button.place(relx=0.5, rely=0.9, anchor="center")

        self.update_camera_feed()

    def update_camera_feed(self):
        if self.running:
            frame = self.camera.picam2.capture_array()
            frame_image = Image.fromarray(frame)
            frame_photo = ImageTk.PhotoImage(frame_image)

            self.camera_canvas.create_image(0, 0, anchor="nw", image=frame_photo)
            self.camera_canvas.image = frame_photo

            self.root.after(33, self.update_camera_feed)

    def capture_image(self):
        image = self.camera.picam2.capture_array()
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        file_path = f"photo_{timestamp}.png"
        Image.fromarray(image).save(file_path)
        playsound('shutter.mp3')
        print(f"Photo enregistrée : {file_path}")

    def close_camera_interface(self):
        self.camera.arreter()
        self.running = False
        self.camera_canvas.destroy()
        self.close_button.destroy()
        self.capture_button.destroy()
        self.change_background_callback()
        update_camera_status("La caméra est éteinte")
