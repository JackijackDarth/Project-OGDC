import subprocess

def check_camera_status():
    try:
        result = subprocess.run(["pgrep", "libcamera-hello"], capture_output=True, text=True)
        if result.returncode == 0:
            return "La caméra est active."
        else:
            return "La caméra n'est pas active."
    except Exception as e:
        return f"Erreur lors de la vérification de l'état de la caméra : {e}"