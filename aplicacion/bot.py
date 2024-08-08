import pyttsx3
import pywhatkit
import datetime
import wikipedia

engine = pyttsx3.init()

voices = engine.getProperty('voices')
engine.setProperty('voice', voices[0].id)
engine.setProperty('rate', 178)
engine.setProperty('volume', 0.7)

def talk(text):
    engine.say(text)
    engine.runAndWait()

def process_command(command):
    if 'reproduce' in command:
        music = command.replace('reproduce', '').strip()
        pywhatkit.playonyt(music)
        return f'Reproduciendo {music}'
    elif 'hora' in command:
        hora = datetime.datetime.now().strftime('%I:%M %p')
        return f"Son las {hora}"
    elif 'busca' in command:
        order = command.replace('busca', '').strip()
        wikipedia.set_lang("es")
        info = wikipedia.summary(order, 1)
        return info
    elif 'exit' in command:
        return "Saliendo..."
    else:
        return f"No reconozco: {command}"