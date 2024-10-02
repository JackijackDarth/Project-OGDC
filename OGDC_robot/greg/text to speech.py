# Import the required module for text 
# to speech conversion
from gtts import gTTS

from playsound import playsound


# The text that you want to convert to audio
mytext = 'test test test'

# Language in which you want to convert
language = 'fr'

# Passing the text and language to the engine, 
# here we have marked slow=False. Which tells 
# the module that the converted audio should 
# have a high speed
myobj = gTTS(text=mytext, lang=language, slow=False)

# Saving the converted audio in a mp3 file named
# welcome 
myobj.save("speech.mp3")

# for playing note.mp3 file
playsound('speech.mp3')
print('playing sound using  playsound')