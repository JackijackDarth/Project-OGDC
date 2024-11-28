import json
import os
from device.bouton import controllerBtn
from device.capteurMouv import controllerCapteurMouv
from device.capteurTemp import controllerCapteurTemp
from device.DEL import controllerDEL

button = controllerBtn(5)
red_led = controllerDEL(2, "red_led")
blue_led = controllerDEL(4, "blue_led")
green_led = controllerDEL(3, "green_led")
movement_sensor = controllerCapteurMouv(8)
temperature_sensor = controllerCapteurTemp(7)

def load_camera_status():
    """Charge l'état de la caméra depuis le fichier data.json."""
    file_path = 'data.json'
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            data = json.load(f)
            return data.get("camera")
    return "La caméra est éteinte"

def get_devices():
    camera_status = load_camera_status()

    devices = {
        "camera": {"pin": None, "status": camera_status, "location": None},
        "button": {"pin": 5, "status": button.lire(), "location": None},
        "red_led": {"pin": 2, "status": red_led.lire_etat(), "location": None},
        "blue_led": {"pin": 4, "status": blue_led.lire_etat(), "location": None},
        "green_led": {"pin": 3, "status": green_led.lire_etat(), "location": None},
        "movement_sensor": {"pin": 8, "status": movement_sensor.lire(), "location": None},
        "temperature_sensor": {"pin": 7, "status": temperature_sensor.lire_temperature_humidite(), "location": None}
    }
    return devices

def new_list(new_devices):
    current_statuses = {
        "camera": load_camera_status(),
        "button": button.lire(),
        "red_led": red_led.lire_etat(),
        "blue_led": blue_led.lire_etat(),
        "green_led": green_led.lire_etat(),
        "movement_sensor": movement_sensor.lire(),
        "temperature_sensor": temperature_sensor.lire_temperature_humidite()
    }

    for device_name, device_info in new_devices.items():
        if isinstance(device_info, dict) and 'status' in device_info:
            device_info['status'] = current_statuses.get(device_name, "Unknown")
    return new_devices