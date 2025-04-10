from django.db import models

class Membresia(models.Model):
    nombre = models.CharField(max_length=50)
    duracion = models.IntegerField()  # en días o meses, según el negocio
    precio = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'membresias'  # Para que use el nombre exacto en la BD

    def __str__(self):
        return self.nombre


class Miembro(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20, blank=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    contrasena = models.CharField(max_length=255)
    membresia = models.ForeignKey(Membresia, on_delete=models.CASCADE)

    class Meta:
        db_table = 'miembros'

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

class Instructor(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)

    class Meta:
        db_table = 'instructores'

    def __str__(self):
        return self.nombre


class Sala(models.Model):
    nombre = models.CharField(max_length=100)

    class Meta:
        db_table = 'salas'

    def __str__(self):
        return self.nombre


class Clase(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    instructor = models.ForeignKey('Instructor', on_delete=models.CASCADE)
    sala = models.ForeignKey('Sala', on_delete=models.CASCADE)
    cupos_disponibles = models.IntegerField()

    class Meta:
        db_table = 'clases'

    def __str__(self):
        return self.nombre


class Horario(models.Model):
    clase = models.ForeignKey(Clase, on_delete=models.CASCADE)
    dia_semana = models.CharField(max_length=20)
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()

    class Meta:
        db_table = 'horarios'

    def __str__(self):
        return f"{self.clase.nombre} - {self.dia_semana} {self.hora_inicio}-{self.hora_fin}"


class Reserva(models.Model):
    miembro = models.ForeignKey(Miembro, on_delete=models.CASCADE)
    horario = models.ForeignKey(Horario, on_delete=models.CASCADE)
    fecha_reserva = models.DateTimeField(auto_now_add=True)
    fecha_cancelacion = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'reservas'

    def __str__(self):
        return f"{self.miembro_id} - {self.horario_id}"