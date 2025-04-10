# 💪 GymPlus - Sistema de Registro para Gimnasio

Este proyecto es una aplicación web desarrollada con **Django** (backend) y **Angular** (frontend) para gestionar el registro y autenticación de miembros en un gimnasio.

---

## 🚀 Tecnologías utilizadas

- 🐍 Django 5.x
- 🌐 Django REST Framework
- 🐘 PostgreSQL (u otro motor compatible)
- 🛡️ django-cors-headers (para CORS)
- 🔥 Angular 17+
- 🧪 Bootstrap / Angular Material (opcional)

---

## ⚙️ Requisitos

### Backend (Django)

- Python 3.10+
- PostgreSQL (opcional, puede usar SQLite en desarrollo)
- Virtualenv recomendado

### Frontend (Angular)

- Node.js 18+
- Angular CLI (`npm install -g @angular/cli`)

---

## 🧑‍💻 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/gymplus.git
cd gymplus

Instalar todas las dependencias
pip install -r requirements.txt

Migraciones y superusuario

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

Ejecutar el servidor

python manage.py runserver

Ir al directorio Angular
cd frontend  # o el nombre del proyecto Angular
npm install

Ejecutar en desarrollo
ng serve
