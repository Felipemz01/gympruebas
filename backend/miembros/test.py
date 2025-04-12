from django.test import TestCase
from miembros.models import Miembro, Membresia
from datetime import datetime
from django.utils import timezone

class MiembroModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.membresia = Membresia.objects.create(
            nombre="Plan Mensual",
            duracion=30,
            precio=50000.00
        )

        cls.miembro = Miembro.objects.create(
            nombre="Ana",
            apellido="López",
            email="ana@example.com",
            telefono="123456789",
            contrasena="claveSegura123",
            membresia=cls.membresia
        )

    def test_str_representation(self):
        print("Prueba: test_str_representation - Verifica el método __str__ de Miembro")
        self.assertEqual(str(self.miembro), "Ana López")

    def test_email_unique(self):
        print("Prueba: test_email_unique - Verifica restricción UNIQUE en el email")
        with self.assertRaises(Exception):
            Miembro.objects.create(
                nombre="Otro",
                apellido="Usuario",
                email="ana@example.com",  # Duplicado
                telefono="000000000",
                contrasena="otraClave",
                membresia=self.membresia
            )

    def test_telefono_content(self):
        print("Prueba: test_telefono_content - Verifica si el teléfono se guarda correctamente")
        self.assertEqual(self.miembro.telefono, "123456789")

    def test_contrasena_almacenada(self):
        print("Prueba: test_contrasena_almacenada - Verifica si la contraseña se almacena correctamente")
        self.assertEqual(self.miembro.contrasena, "claveSegura123")

    def test_fecha_registro_auto(self):
        print("Prueba: test_fecha_registro_auto - Verifica si la fecha de registro se setea automáticamente")
        self.assertIsNotNone(self.miembro.fecha_registro)
        self.assertLessEqual(self.miembro.fecha_registro, timezone.now())

    def test_relacion_membresia(self):
        print("Prueba: test_relacion_membresia - Verifica si la relación con Membresia es correcta")
        self.assertEqual(self.miembro.membresia.nombre, "Plan Mensual")