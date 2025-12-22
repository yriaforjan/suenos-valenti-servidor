# 🧘 Sueños Valenti

Aplicación **Node.js** para la gestión de sesiones espirituales con persistencia en **JSON**.

## ⚙️ Configuración

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
SESSION_SECRET=tu_clave_secreta
```

## 🚀 Arranque

Ejecuta los siguientes comandos en tu terminal:

```bash
npm install
node app.js
```

## 📋 Características

- **Auth**: Sistema de registro e inicio de sesión de usuarios.
- **Carrito**: Selección de sesiones espirituales gestionada mediante `req.session`.
- **Persistencia**: Preferencias de usuario (Tema Oscuro/Claro) almacenadas de forma permanente en archivos JSON.
- **Logs**: Sistema de trazabilidad de actividad incluido en `data/accesos.log`  (archivo subido para facilitar la evaluación de la práctica).

## 👩‍💻 Desarrollado por Yria Forján

