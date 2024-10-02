import grovepi

class controllerBtn:

    def __init__(self, port):
        self.port = port
        grovepi.pinMode(port, "INPUT")

    def lire(self):
        return grovepi.digitalRead(self.port)
    
    def attendre_clique(self):
        while True:
            if self.lire() == 1:
                while self.lire() == 1:
                    pass
                return