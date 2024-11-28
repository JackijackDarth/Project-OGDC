import grovepi
import json
import math

class controllerCapteurTemp:
    def __init__(self, port):
        self.port = port
        self.simulated_temp = None
        self.target_temp = None
        grovepi.pinMode(port, "INPUT")

        self.last_temp = None
        self.last_humidity = None

    def lire_temperature(self):
        temp = grovepi.dht(self.port, 0)
        return temp

    def lire_temperature_humidite(self):
        if self.simulated_temp is None:
            temp, humidity = grovepi.dht(self.port, 0)
            if not math.isnan(temp) and not math.isnan(humidity):
                self.last_temp, self.last_humidity = temp, humidity
                self.ecrire_temp_hum(temp, humidity)
            else:
                temp, humidity = self.last_temp, self.last_humidity
            return temp, humidity
        else:
            _, humidity = grovepi.dht(self.port, 0)
            humidity = humidity if not math.isnan(humidity) else self.last_humidity
            self.ecrire_temp_hum(self.simulated_temp, humidity)
            return self.simulated_temp, humidity

    def simuler_temperature(self, new_temp):
        self.simulated_temp = new_temp

    def annuler_simulation(self):
        self.simulated_temp = None

    def ecrire_temp_hum(self, temp, humidity):
        try:
            with open('data.json', 'r') as file:
                data = json.load(file)
        except (FileNotFoundError, json.JSONDecodeError):
            data = {}

        data['temp'] = {
            'temperature': temp,
            'humidity': humidity
        }

        with open('data.json', 'w') as file:
            json.dump(data, file, indent=4)

    def lire_temp_from_file(self):
        try:
            with open('data.json', 'r') as file:
                data = json.load(file)
                temp = data.get('temp', {}).get('temperature', None)
                return temp
        except (FileNotFoundError, json.JSONDecodeError) as e:
            print(f"Error reading data.json: {e}")
            return None

    def definir_temperature_cible(self, target_temp):
        self.target_temp = target_temp

    def obtenir_temperature_cible(self):
        return self.target_temp