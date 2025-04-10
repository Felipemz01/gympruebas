from django.urls import path
from . import views
from .views import LoginView,HorariosDisponiblesView,reservar_clase,LogoutView,cancelar_reserva,reservas_por_miembro, obtener_csrf_token,obtener_membresias




urlpatterns = [
    path('api/miembros/', views.registrar_miembro, name='registrar_miembro'),
    path('login/', LoginView.as_view(), name='login'),
    path('horarios/', HorariosDisponiblesView.as_view(), name='horarios_disponibles'),
    path('reservar/', reservar_clase, name='reservar_clase'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('cancelar-reserva/<int:id_reserva>/', cancelar_reserva, name='cancelar_reserva'),
    path('mis-reservas/', views.reservas_por_miembro, name='reservas_por_miembro'),
    path("csrf-token/", obtener_csrf_token),  # 👈 Añade esta línea
    path('membresias/', obtener_membresias),

]
