from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from rest_framework.response import Response
from django.contrib.auth import logout
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.contrib.auth import login as auth_login
from django.views.decorators.http import require_GET, require_POST, require_http_methods
import json
from .models import Miembro, Membresia, Horario, Reserva

@csrf_exempt
def registrar_miembro(request):
    if request.method == 'OPTIONS':
        # Responder al preflight CORS request
        response = JsonResponse({})
        #response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            membresia = Membresia.objects.get(pk=data['id_membresia'])

            miembro = Miembro.objects.create(
                nombre=data['nombre'],
                apellido=data['apellido'],
                email=data['email'],
                telefono=data.get('telefono', ''),
                contrasena=data['contrasena'],
                membresia=membresia
            )

            response = JsonResponse({'mensaje': 'Miembro registrado correctamente'}, status=201)
            #response["Access-Control-Allow-Origin"] = "*"
            return response

        except Exception as e:
            response = JsonResponse({'error': str(e)}, status=400)
            #response["Access-Control-Allow-Origin"] = "*"
            return response

    return JsonResponse({'error': 'Método no permitido'}, status=405)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        contrasena = request.data.get('contrasena')

        try:
            miembro = Miembro.objects.get(email=email)
            if miembro.contrasena == contrasena:
                # Marcar la sesión como autenticada
                request.session['autenticado'] = True
                request.session['miembro_id'] = miembro.id

                print(f"✅ Login OK - Session ID: {request.session.session_key}")

                return Response({'message': 'Login exitoso', 
                                 'miembro_id': miembro.id,
                                 'nombre': miembro.nombre}, status=200)
            else:
                return Response({'error': 'Contraseña incorrecta'}, status=401)
        except Miembro.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=404)
        

class HorariosDisponiblesView(APIView):
    def get(self, request):
        horarios = Horario.objects.select_related('clase', 'clase__instructor', 'clase__sala').all()
        resultado = []

        for h in horarios:
            resultado.append({
                'id': h.id,
                'dia_semana': h.dia_semana,
                'hora_inicio': h.hora_inicio.strftime("%H:%M"),
                'hora_fin': h.hora_fin.strftime("%H:%M"),
                'clase': h.clase.nombre,
                'instructor': h.clase.instructor.nombre,
                'apellido': h.clase.instructor.apellido,
                'sala': h.clase.sala.nombre,
                'cupos_disponibles': h.clase.cupos_disponibles,
            })

        return JsonResponse(resultado, safe=False)
    

@csrf_exempt
def reservar_clase(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        id_miembro = data.get('id_miembro')
        id_horario = data.get('id_horario')

        try:
            miembro = Miembro.objects.get(id=id_miembro)
            horario = Horario.objects.select_related('clase').get(id=id_horario)
            clase = horario.clase

            if clase.cupos_disponibles <= 0:
                return JsonResponse({'error': 'No hay cupos disponibles para esta clase.'}, status=400)

            # Verificar si ya tiene una reserva para ese horario
            if Reserva.objects.filter(miembro=miembro, horario=horario).exists():
                return JsonResponse({'error': 'Ya tienes una reserva para este horario.'}, status=400)

            # Crear la reserva
            Reserva.objects.create(miembro=miembro, horario=horario)

            # Restar cupo disponible en la clase
            clase.cupos_disponibles -= 1
            clase.save()

            return JsonResponse({'mensaje': 'Reserva realizada con éxito.'})
        except Miembro.DoesNotExist:
            return JsonResponse({'error': 'Miembro no encontrado.'}, status=404)
        except Horario.DoesNotExist:
            return JsonResponse({'error': 'Horario no encontrado.'}, status=404)

    return JsonResponse({'error': 'Método no permitido'}, status=405)
        

@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return JsonResponse({'mensaje': 'Sesión cerrada correctamente'})
    
@csrf_exempt
def cancelar_reserva(request, id_reserva):
    if request.method == 'DELETE':
        try:
            reserva = Reserva.objects.select_related('horario__clase').get(id=id_reserva)
            clase = reserva.horario.clase

            # Eliminar la reserva
            reserva.delete()

            # Aumentar el cupo disponible
            clase.cupos_disponibles += 1
            clase.save()

            return JsonResponse({'mensaje': 'Reserva cancelada y cupo liberado.'})
        except Reserva.DoesNotExist:
            return JsonResponse({'error': 'Reserva no encontrada.'}, status=404)

    return JsonResponse({'error': 'Método no permitido'}, status=405)
        
@require_GET
def reservas_por_miembro(request):
    id_miembro = request.GET.get('id_miembro')
    if not id_miembro:
        return JsonResponse({'error': 'ID de miembro requerido'}, status=400)

    reservas = Reserva.objects.filter(miembro_id=id_miembro, fecha_cancelacion__isnull=True)\
    .select_related('horario__clase__instructor', 'horario__clase__sala', 'horario__clase')\
    .order_by('horario__dia_semana', 'horario__hora_inicio')

    data = []
    for reserva in reservas:
        horario = reserva.horario
        data.append({
            'id': reserva.id,
            'clase': horario.clase.nombre,
            'dia_semana': horario.dia_semana,
            'hora_inicio': horario.hora_inicio.strftime('%H:%M'),
            'hora_fin': horario.hora_fin.strftime('%H:%M'),
            'sala': horario.clase.sala.nombre,
            'instructor': horario.clase.instructor.nombre,
            'apellido': horario.clase.instructor.apellido
        })

    return JsonResponse(data, safe=False)

@ensure_csrf_cookie
def obtener_csrf_token(request):
    return JsonResponse({'mensaje': 'Token CSRF generado correctamente'})

def obtener_membresias(request):
    membresias = list(Membresia.objects.values('id', 'nombre', 'duracion', 'precio'))
    return JsonResponse(membresias, safe=False)