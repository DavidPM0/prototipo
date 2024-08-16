import pyttsx3
import threading
import pywhatkit
import datetime
import wikipedia
from django.shortcuts import render
from django.http import JsonResponse

# Configuración global del motor de voz
engine = pyttsx3.init()
engine.setProperty('rate', 178)
engine.setProperty('volume', 0.7)

# Diccionario con los ingresos por mes
ingresos_por_mes = {
    "junio": "85 mil",
    "julio": "50 mil",
    "agosto": "20 mil"
}

# Función para hablar
def talk(text):
    def speak():
        try:
            engine.say(text)
            engine.runAndWait()
        except Exception as e:
            print(f"Error en la síntesis de voz: {e}")

    # Verifica si ya hay un hilo corriendo antes de iniciar uno nuevo
    if not any(t.name == 'speech_thread' for t in threading.enumerate()):
        thread = threading.Thread(target=speak, name='speech_thread')
        thread.start()

# Función para procesar el comando de voz
def run(rec):
    response = ""
    rec = rec.lower()

    if 'reproduce' in rec:
        music = rec.replace('reproduce', '').strip()
        response = 'Reproduciendo ' + music
        talk(response)
        pywhatkit.playonyt(music)
    elif 'hora' in rec:
        hora = datetime.datetime.now().strftime('%I:%M %p')
        response = "Son las " + hora
        talk(response)
    elif 'busca' in rec:
        order = rec.replace('busca', '').strip()
        wikipedia.set_lang("es")
        info = wikipedia.summary(order, 1)
        response = info
        talk(info)
    elif 'ingresos' in rec:
        response = "Los ingresos por mes son los siguientes: "
        for mes, ingreso in ingresos_por_mes.items():
            response += f"{mes.capitalize()}: {ingreso} soles. "
        talk(response)
    elif 'recomendaciones' in rec:
        response = (
            "Para mejorar el cuidado del medio ambiente según las estadísticas, te recomiendo lo siguiente: "
            "1. Reduce el consumo de energía, especialmente en los meses de mayor consumo como mayo y julio. Puedes hacerlo apagando dispositivos electrónicos cuando no los uses y utilizando electrodomésticos eficientes. "
            "2. Optimiza el consumo de agua, ya que los datos muestran que el uso ha sido elevado. Considera implementar técnicas de riego más eficientes y reducir el desperdicio de agua en actividades diarias. "
            "3. Los indicadores ambientales sugieren un alto nivel de huella de carbono. Puedes reducir esto utilizando más energía renovable y fomentando el uso de transporte público o vehículos eléctricos. "
            "4. Las condiciones climáticas indican un clima favorable para plantar más vegetación, lo que podría ayudar a absorber CO2 y mejorar la calidad del aire."
        )
        talk(response)
    else:
        response = "Vuelve a intentarlo, no reconozco: " + rec
        talk(response)
    return response

# Vista principal de Django
def home(request):
    if request.method == 'POST':
        try:
            rec = request.POST.get('command', '').strip().lower()
            response = run(rec)
            return JsonResponse({'status': 'success', 'response': response})
        except Exception as e:
            return JsonResponse({'status': 'error', 'response': str(e)})
    return render(request, 'aplicacion/index.html')