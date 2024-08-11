from django.shortcuts import render
from django.http import JsonResponse
import pyttsx3
import pywhatkit
import datetime
import wikipedia

# Create your views here.
def home(request):
    return render(request, 'aplicacion/index.html')

name = 'will'
engine = pyttsx3.init()
voices = engine.getProperty('voices')
engine.setProperty('voice', voices[0].id)
engine.setProperty('rate', 178)
engine.setProperty('volume', 0.7)

def talk(text):
    engine.say(text)
    engine.runAndWait()

def run_bot(request):
    if request.method == 'POST':
        rec = request.POST.get('command', '').lower()
        if name in rec:
            rec = rec.replace(name, '')
            response = run(rec)
            return JsonResponse({'status': 'Bot activated', 'response': response})
        else:
            response = "Vuelve a intentarlo, no reconozco: " + rec
            talk(response)
            return JsonResponse({'status': 'Command not recognized', 'response': response})
    return render(request, 'bot.html')

def run(rec):
    response = ""
    if 'reproduce' in rec:
        music = rec.replace('reproduce', '')
        response = 'Reproduciendo ' + music
        talk(response)
        pywhatkit.playonyt(music)
    elif 'hora' in rec:
        hora = datetime.datetime.now().strftime('%I:%M %p')
        response = "Son las " + hora
        talk(response)
    elif 'busca' in rec:
        order = rec.replace('busca', '')
        wikipedia.set_lang("es")
        info = wikipedia.summary(order, 1)
        response = info
        talk(info)
    else:
        response = "Vuelve a intentarlo, no reconozco: " + rec
        talk(response)
    return response