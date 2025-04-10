# miembros/serializers.py
from rest_framework import serializers
from .models import Miembro, Membresia

class MembresiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membresia
        fields = ['id', 'nombre']

class MiembroSerializer(serializers.ModelSerializer):
    membresia = MembresiaSerializer(read_only=True)

    class Meta:
        model = Miembro
        fields = '__all__'

