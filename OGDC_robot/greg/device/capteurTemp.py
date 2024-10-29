import grovepi

class controllerCapteurTemp:

    def __init__(self, port):
        self.port = port
        grovepi.pinMode(port, "INPUT")

    def lire_temperature_humidite(self):
        [temp, humidity] = grovepi.dht(self.port, 0)
        return temp, humidity
    
    def lire_temperature(self):
        temp = grovepi.dht(self.port, 0)
        return temp
