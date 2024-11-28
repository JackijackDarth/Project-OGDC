import requests
import os
import objets
import json
from datetime import datetime, timedelta
import time

raspberry_name = "OGDC"
raspberry_device = "1"
ServeurIP = "192.168.137.113"

def write_manage_temp(command):
    try:
        data = {}
        if os.path.exists("data.json"):
            with open("data.json", "r") as file:
                data = json.load(file)

        data["manage_temp"] = command

        with open("data.json", "w") as file:
            json.dump(data, file, indent=4)

    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Erreur lors de l'écriture de la commande de gestion de la température : {e}")


def get_ogdc():
    ressource = "robot_connecter"
    url = f"http://{ServeurIP}:1883/ogdc/{ressource}"

    try:
        response = requests.get(url)
        if response.status_code == 200:
            ogdcs = response.json()
            for ogdc in ogdcs:
                if ogdc.get('username') == raspberry_name:
                    return ogdc['Id']
            else:
                print(f"Erreur: Code de réponse {response.status_code}")
                return None
            return None
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de la récupération de l'utilisateur connecté : {e}")
        return None

raspberry_id = get_ogdc()

def get_authentication_status(name, number):
    ressource = "authentification"

    url = f"http://{ServeurIP}:1883/ogdc/{ressource}"
    custom_auth_header = f"Basic {name}:{number}"

    response = requests.get(url, headers={"Authorization": custom_auth_header})

    if response.status_code == 200:
        return response.json()
    else:
        return None

def post_user_notification(name, number):
    ressource = "robot_connecter"

    url = f"http://{ServeurIP}:1883/ogdc/{ressource}"
    custom_auth_header = f"Basic {name}:{number}"

    data = {
        "username": name,
        "password": number
    }
    try:
        response = requests.post(url, headers={"Authorization": custom_auth_header}, json=data)
        if response.status_code == 200:
            return response.json()
        else:
            return None
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de l'envoi de la requête POST : {e}")
        return None
    
def post_device_list(name, devices):
    ressource = "liste_objets"

    url = f"http://{ServeurIP}:1883/ogdc/{ressource}"
    # custom_auth_header = f"Basic {name}:{number}"

    data = {
        "username": name,
        "listeObjets": devices
    }
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            return response.json()
        else:
            return None
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de l'envoi de la requête POST : {e}")
        return None

def put_device_list(name, devices):
    ressource = "liste_objets"

    url = f"http://{ServeurIP}:1883/ogdc/{ressource}"
    # custom_auth_header = f"Basic {name}:{number}"

    data = {
        "username": name,
        "listeObjets": devices
    }
    try:
        response = requests.put(url, json=data)
        if response.status_code == 200:
            return response.json()
        else:
            return None
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de l'envoi de la requête PUT : {e}")
        return None

def get_device_list():
    ressource = "liste_objets"

    url = f"http://{ServeurIP}:1883/ogdc/{ressource}/{raspberry_id}"
    # custom_auth_header = f"Basic {name}:{number}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            return None
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de l'envoi de la requête GET : {e}")
        return None
    
def get_commands_app():
    ressource = "commandes"
    url = f"http://{ServeurIP}:1883/ogdc/{ressource}/{raspberry_id}"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            cmds = response.json()
            
            for cmd in cmds:
                if cmd.get('name') == 'Allumer/Éteindre LED':
                    led_object = cmd.get('object')
                    new_value = cmd.get('newValue')
                    
                    if led_object == 'red_led':
                        if new_value == 1:
                            objets.red_led.allumer()
                        elif new_value == 0:
                            objets.red_led.eteindre()
                    elif led_object == 'green_led':
                        if new_value == 1:
                            objets.green_led.allumer()
                        elif new_value == 0:
                            objets.green_led.eteindre()
                    elif led_object == 'blue_led':
                        if new_value == 1:
                            objets.blue_led.allumer()
                        elif new_value == 0:
                            objets.blue_led.eteindre()
                elif cmd.get('name') == 'Appuyer sur bouton principal':
                    btn_object = cmd.get('object')
                    new_value = cmd.get('newValue')
                    if btn_object == 'button':
                        if new_value == 1:
                            objets.button.simuler_appui()
                        elif new_value == 0:
                            objets.button.relacher()
                elif cmd.get('name') == 'Changer temp. cible':
                    temp_object = cmd.get('object')
                    new_value = float(cmd.get('newValue'))
                    if temp_object == 'temperature_sensor':
                        current_temp = objets.temperature_sensor.lire_temp_from_file()
                        if new_value > current_temp and new_value <= 40.0:
                            objets.temperature_sensor.definir_temperature_cible(new_value)
                            write_manage_temp('heater_on')
                        elif new_value < current_temp and new_value >= 0.0:
                            objets.temperature_sensor.definir_temperature_cible(new_value)
                            write_manage_temp('ac_on')
                delete_command(cmd.get('Id'))
            return True
        else:
            # print(f"Erreur: Code de réponse {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        # print(f"Erreur lors de la récupération des commandes : {e}")
        return False

def get_automatisation():
    ressource = "automatisation"
    url = f"http://{ServeurIP}:1883/ogdc/{ressource}/idRobot/{raspberry_id}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            automatisations = response.json()
            
            current_time = datetime.now().time()
            for automatisation in automatisations:
                condition = automatisation.get('condition', {})
                if 'heure' in condition:
                    automation_time = datetime.strptime(condition['heure'], "%H:%M:%S").time()
                    
                    delai = timedelta(seconds=5)
                    
                    current_time_delta = timedelta(
                        hours=current_time.hour,
                        minutes=current_time.minute,
                        seconds=current_time.second
                    )
                    automation_time_delta = timedelta(
                        hours=automation_time.hour,
                        minutes=automation_time.minute,
                        seconds=automation_time.second
                    )
            
                    if automation_time_delta - delai <= current_time_delta <= automation_time_delta + delai:
                        execute_command(automatisation['commande'])
            return True
        else:
            return False
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de l'envoi de la requête GET : {e}")
        return False
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de l'envoi de la requête GET : {e}")
        return False

def execute_command(commande):
    if commande['name'] == 'Allumer/Éteindre LED':
        led_object = commande.get('object')
        new_value = commande.get('newValue')
        
        if led_object == 'blue_led':
            if new_value == 1:
                objets.blue_led.allumer()
            elif new_value == 0:
                objets.blue_led.eteindre()
        elif led_object == 'green_led':
            if new_value == 1:
                objets.green_led.allumer()
            elif new_value == 0:
                objets.green_led.eteindre()
        elif led_object == 'red_led':
            if new_value == 1:
                objets.red_led.allumer()
            elif new_value == 0:
                objets.red_led.eteindre()
    elif commande['name'] == 'Changer temp. cible':
        temp_object = commande.get('object')
        new_value = float(commande.get('newValue'))
        if temp_object == 'temperature_sensor':
            current_temp = objets.temperature_sensor.lire_temp_from_file()
            if new_value > current_temp and new_value <= 40.0:
                objets.temperature_sensor.definir_temperature_cible(new_value)
                write_manage_temp('heater_on')
            elif new_value < current_temp and new_value >= 0.0:
                objets.temperature_sensor.definir_temperature_cible(new_value)
                write_manage_temp('ac_on')
    elif commande['name'] == 'Appuyer sur bouton principal':
        btn_object = commande.get('object')
        new_value = commande.get('newValue')
        if btn_object == 'button':
            if new_value == 1:
                objets.button.simuler_appui()
            elif new_value == 0:
                objets.button.relacher()

def delete_command(command_id):
    url = f"http://{ServeurIP}:1883/ogdc/commandes/{command_id}"
    try:
        response = requests.delete(url)
        if not (response.status_code == 200 or response.status_code == 201):
            print(f"Erreur de suppression de la commande {command_id}: Code {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de la suppression de la commande {command_id} : {e}")

def post_user_notification(name, number):
    ressource = "robot_connecter"

    url = f"http://{ServeurIP}:1883/ogdc/{ressource}"
    custom_auth_header = f"Basic {name}:{number}"

    data = {
        "username": name,
        "password": number
    }
    try:
        response = requests.post(url, headers={"Authorization": custom_auth_header}, json=data)
        if response.status_code == 200:
            return response.json()
        else:
            return None
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de l'envoi de la requête POST : {e}")
        return None

def get_connected_user():
    ressource = f"connexion/{raspberry_name}"

    url = f"http://{ServeurIP}:1883/ogdc/{ressource}"

    try:
        response = requests.get(url)
        if response.status_code == 200:
            rep = response.json()
            if (rep.get('Id') >= 1000):
                rep['type'] = 'famille'
                return rep
            elif (rep.get('Id') >= 0):
                if (rep.get('isLogin') == True):
                    rep['type'] = 'user'
                    return rep
        else:
            print(f"Erreur: Code de réponse {response.status_code}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de la récupération de l'utilisateur connecté : {e}")
        return None

def post_note(idFamille, message):
    ressource = "notes"
    url = f"http://{ServeurIP}:1883/ogdc/{ressource}"
    data = {
        "idUser": idFamille,
        "message": message
    }
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Échec de la requête POST, code de statut : {response.status_code}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de l'envoi de la requête POST : {e}")
        return None

def get_note(idFamille):
    ressource = "notes"
    url = f"http://{ServeurIP}:1883/ogdc/{ressource}/get/{idFamille}"

    try:
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            return None 
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de l'envoi de la requête GET : {e}")
        return None

def delete_note(note_id):
    url = f"http://{ServeurIP}:1883/ogdc/notes/delete/{note_id}"
    try:
        response = requests.delete(url)
        if not (response.status_code == 200 or response.status_code == 201):
            print(f"Erreur de suppression de la note {note_id}: Code {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de la suppression de la note {note_id} : {e}")



