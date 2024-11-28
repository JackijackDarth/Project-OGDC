from picamera2 import Picamera2, libcamera
import numpy as np

class controllerCamera:
    def __init__(self):
        self.picam2 = Picamera2()
        self.largeur = 800
        self.hauteur = 480
        self.config = self.picam2.create_video_configuration(main={"format": 'RGB888', "size": (self.largeur, self.hauteur)})
        self.config["transform"] = libcamera.Transform(hflip=True, vflip=True)
        self.picam2.configure(self.config)
        self.picam2.start()
        self.image = None

    def capturer_image(self):
        self.image = self.picam2.capture_array()

    def arreter(self):
        if self.picam2:
            self.picam2.stop()
            self.picam2.close()
            self.picam2 = None