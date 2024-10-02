from device.bouton import controllerBtn
from device.capteurMouv import controllerCapteurMouv
from device.capteurTemp import controllerCapteurTemp
from device.DEL import controllerDEL
import device.camera
# from etatLEDs import red_led_state, blue_led_state, green_led_state

button = controllerBtn(5)
red_led = controllerDEL(2, "rouge")
blue_led = controllerDEL(4, "bleu")
green_led = controllerDEL(3, "vert")
movement_sensor = controllerCapteurMouv(8)
temperature_sensor = controllerCapteurTemp(7)

def get_devices():
    """Retourne un dictionnaire contenant les informations des périphériques."""
    devices = {
        "camera": {"pin": None, "status": device.camera.check_camera_status()},
        "button": {"pin": 5, "status": button.lire()},
        "red_led": {"pin": 2, "status": red_led.fonctionnement()},
        "blue_led": {"pin": 4, "status": blue_led.fonctionnement()},
        "green_led": {"pin": 3, "status": green_led.fonctionnement()},
        "movement_sensor": {"pin": 8, "status": movement_sensor.lire()},
        "temperature_sensor": {"pin": 7, "status": temperature_sensor.lire_temperature_humidite()}
    }
    return devices
