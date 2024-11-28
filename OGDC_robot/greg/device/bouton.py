import grovepi
import threading

class controllerBtn:
    def __init__(self, port):
        self.port = port
        grovepi.pinMode(port, "INPUT")
        self.appuye = False

    def lire(self):
        return 1 if self.appuye or grovepi.digitalRead(self.port) else 0

    def simuler_appui(self):
        self.appuye = True

        def reset_appui():
            threading.Event().wait(2)
            self.appuye = False
        threading.Thread(target=reset_appui).start()

    def appuyer(self):
        self.appuye = True

    def relacher(self):
        self.appuye = False
    
    def attendre_clique(self):
        while True:
            if self.lire() == 1:
                while self.lire() == 1:
                    pass
                return