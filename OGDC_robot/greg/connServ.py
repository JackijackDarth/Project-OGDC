import requests
import objets

raspberry_name = "OGDC"
raspberry_device = "1"

def get_authentication_status(name, number):
    """Obtient le statut d'authentification en fonction des informations d'identification fournies."""
    ServeurIP = "sgourgue.ddns.net"
    ressource = "authentification"

    url = f"http://{ServeurIP}:4242/cafehomer/{ressource}"
    custom_auth_header = f"Basic {name}:{number}"

    response = requests.get(url, headers={"Authorization": custom_auth_header})

    if response.status_code == 200:
        return response.json()
    else:
        return None

def post_user_notification(name, number):
    """Envoie une notification au serveur via une requête POST."""
    ServeurIP = "sgourgue.ddns.net"
    ressource = "robot_connecter"

    url = f"http://{ServeurIP}:4242/cafehomer/{ressource}"
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
    """Envoie la liste des objets GrovePi au serveur via une requête POST."""
    ServeurIP = "sgourgue.ddns.net"
    ressource = "liste_objets"

    url = f"http://{ServeurIP}:4242/cafehomer/{ressource}"
    # custom_auth_header = f"Basic {name}:{number}"

    data = {
        "username": name,
        "devices": devices
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

def post_user_notification(name, number):
    """Envoie une notification au serveur via une requête POST."""
    ServeurIP = "sgourgue.ddns.net"
    ressource = "robot_connecter"

    url = f"http://{ServeurIP}:4242/cafehomer/{ressource}"
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
    """Récupère l'utilisateur connecté pour un appareil."""
    ServeurIP = "sgourgue.ddns.net"
    ressource = f"connexion/{raspberry_name}"

    url = f"http://{ServeurIP}:4242/cafehomer/{ressource}"

    try:
        response = requests.get(url)
        if response.status_code == 200:
            users = response.json()

            for user in users:
                if user.get('isLogin') == True:
                    return user
            return None
        else:
            print(f"Erreur: Code de réponse {response.status_code}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de la récupération de l'utilisateur connecté : {e}")
        return None





