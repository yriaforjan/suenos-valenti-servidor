# 🧘 SUEÑOS VALENTI - Portal de Sesiones de Supraconciencia

[![Status](https://img.shields.io/badge/Status-Pendiente%20de%20Revisión-orange.svg)](https://github.com/yriaforjan/css-lab)

## 🌟 Descripción del Proyecto

Aplicación web `Node.js` renderizada en servidor con `Express.js` para la gestión de sesiones espirituales, featuring autenticación de usuarios, carrito de compras personalizado y persistencia en archivos JSON.

## 📋 Características Principales

* **Autenticación:** Sistema completo de registro e inicio de sesión de usuarios con validación de credenciales en el servidor y gestión de acceso a rutas protegidas.
* **Carrito de Sesiones:** Gestión de selección de sesiones espirituales mediante `req.session`, permitiendo añadir y gestionar elementos con almacenamiento temporal en la memoria del servidor.
* **Persistencia de Preferencias:** Implementación de cookies para el almacenamiento permanente de configuraciones de usuario (Tema Oscuro/Claro), modificando dinámicamente la interfaz.
* **Sistema de Logs:** Trazabilidad completa de la actividad del usuario (accesos y acciones) registrada de forma asíncrona en `data/accesos.log` para auditoría y seguimiento.

---

## 🛠️ Stack Tecnológico

### Backend y Runtime

#### 🟢 Node.js

**Runtime** principal que ejecuta el servidor **JavaScript**. Proporciona el entorno para todos los módulos y dependencias del proyecto.

#### ⚡ Express.js

**Framework** web central que maneja:
* Configuración del servidor y rutas
* Middleware para procesamiento de requests
* Sistema de renderizado server-side

### Motor de Plantillas

#### 🎨 EJS (Embedded JavaScript)

**Motor de plantillas** para renderizado HTML dinámico con:
* Sistema de layouts compartidos
* Inyección de variables de servidor en vistas
* Sintaxis simple para condicionales y bucles

#### 📋 express-ejs-layouts

**Extensión** que proporciona:
* Layouts reutilizables para mantener consistencia visual
* Sistema de herencia de plantillas
* Reducción de código duplicado en vistas

### Gestión de Sesiones y Estado

#### 🔐 express-session

**Middleware** para gestión de *sesiones* con:
* Almacenamiento en memoria del servidor
* Configuración de cookies `HTTP-only`
* Expiración automática de sesiones (1 hora)

#### 🍪 cookie-parser

**Middleware** para manejo de *cookies* del cliente:

* Gestión de preferencias de tema persistente
* Lectura/escritura de cookies en las requests

### Persistencia de Datos

#### 📁 Sistema JSON/FS
Uso del módulo `fs` para persistencia en archivos JSON (usuarios) y generación de logs (.log).

### Utilidades y Configuración

#### 🔧 dotenv

Gestión de *variables de entorno*:

* Configuración segura de secrets y puertos
* Separación de configuración de desarrollo/producción

#### 🛡️ Middleware Personalizados
* `requiereAuth`: Protección de rutas autenticadas
* Middleware global para exposición de datos a vistas

---

## 📋 Requisitos Previos

* 🟢 **Node.js**: Runtime JavaScript necesario para ejecutar la aplicación servidor
* 📦 **npm**: Gestor de paquetes para instalar las dependencias del proyecto

---

## 🚀 Instalación y Configuración

### 1️⃣ Clonar el Proyecto
```bash
git clone <repository-url>
cd sueños-valenti-servidor
```

### 2️⃣ Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
PORT=3000
SESSION_SECRET=tu_clave_secreta_aqui
```
> **Importante**: El `SESSION_SECRET` debe ser una cadena única y segura para la gestión de sesiones.

### 3️⃣ Instalar Dependencias
```bash
npm install
```
Esto instalará los paquetes principales:
* `express`: Framework web servidor
* `ejs`: Motor de plantillas HTML
* `express-session`: Gestión de sesiones de usuario
* `dotenv`: Manejo de variables de entorno

### 4️⃣ Iniciar la Aplicación
Una vez configurado todo, inicia el servidor con:
```bash
npm start
```

Verás el mensaje: `Servidor escuchando en http://localhost:3000`

### 5️⃣ Verificación
Abre tu navegador y accede a `http://localhost:3000` para verificar que la aplicación está funcionando correctamente.

---

## 🗂️ Estructura del Proyecto

```text
sueños-valenti-servidor/  
├── app.js                    # Servidor principal y configuración de Express  
├── package.json              # Dependencias y scripts del proyecto  
├── .env                      # Variables de entorno (PORT, SESSION_SECRET)  
├── README.md                 # Documentación del proyecto  
│  
├── data/                     # Persistencia de datos  
│   ├── sesiones.js           # Catálogo de sesiones espirituales  
│   ├── usuarios.json         # Base de datos de usuarios  
│   └── accesos.log           # Logs de actividad del sistema  
│  
├── utils/                    # Utilidades de acceso a datos  
│   ├── guardarUsuario.js     # Crear nuevos usuarios  
│   ├── obtenerUsuarios.js    # Leer usuarios del JSON  
│   ├── actualizarUsuario.js  # Modificar preferencias de usuario  
│   └── registrarLog.js       # Sistema de logging  
│  
├── middlewares/              # Middleware personalizados  
│   └── requiereAuth.js       # Protección de rutas autenticadas  
│  
├── views/                    # Plantillas EJS  
│   ├── layout.ejs            # Layout base compartido  
│   ├── inicio.ejs            # Página principal  
│   ├── login.ejs             # Formulario de login  
│   ├── registro.ejs          # Formulario de registro  
│   ├── perfil.ejs            # Dashboard de usuario  
│   └── preferencias.ejs      # Configuración de tema  
│  
├── public/                   # Archivos estáticos  
│   ├── style.css             # Estilos principales  
│   ├── favicon.ico           # Icono del sitio  
│   └── images/               # Imágenes y logos  
│  
└── node_modules/             # Dependencias instaladas (npm install)
```

### Componentes Clave

#### 🔧 Servidor Principal (`app.js`)
* **Configuración:** Inicialización de Express.js y configuración de middlewares esenciales.
* **Rutas:** Definición de los manejadores (handlers) para las peticiones del cliente.
* **Sistema de Sesiones:** Gestión de `express-session` y `cookie-parser` para el estado del usuario.

#### 💾 Capa de Datos (`data/`)
* **`sesiones.js`**: Catálogo estático que contiene la información de las 8 sesiones espirituales.
* **`usuarios.json`**: Almacenamiento persistente de los perfiles de usuario en formato JSON.
* **`accesos.log`**: Registro de auditoría para la trazabilidad de actividad del sistema.

#### 🛠️ Utilidades (`utils/`)
* **Funciones CRUD**: Lógica independiente para crear, leer y actualizar usuarios en el archivo JSON.
* **Sistema de Logging**: Implementación de registro de eventos de forma sincrónica/asincrónica.
* **Abstracción**: Separación de las operaciones de sistema de archivos para un código más limpio.

#### 🎨 Vistas (`views/`)
* **Motor EJS**: Uso de plantillas para el renderizado dinámico desde el servidor.
* **Layouts**: Sistema de plantillas base para mantener la consistencia visual en toda la aplicación.
* **Inyección de Datos**: Renderizado dinámico de formularios de autenticación y datos de perfil.

#### 🔐 Seguridad (`middlewares/`)
* **`requiereAuth.js`**: Middleware de protección de rutas.

---
## 📡 Endpoints

### 👤 Rutas Públicas (GET)

| Endpoint | Descripción | Respuesta |
| :--- | :--- | :--- |
| **GET /** | Página principal de bienvenida | Renderiza `inicio.ejs` |
| **GET /registro** | Formulario de registro de usuario | Renderiza `registro.ejs` con campos vacíos |
| **GET /login** | Formulario de inicio de sesión | Renderiza `login.ejs` con mensaje de éxito si aplica |
| **GET /preferencias** | Página de configuración de tema | Renderiza `preferencias.ejs` |
| **GET /preferencias/:tema** | Cambiar tema (claro/oscuro) | Redirige a `/preferencias` con cookie actualizada |

### 🔒 Rutas Protegidas (Requieren autenticación)

| Endpoint | Método | Descripción | Middleware |
| :--- | :--- | :--- | :--- |
| **/perfil** | **GET** | Dashboard con sesiones recomendadas y carrito | `requiereAuth` |
| **/logout** | **GET** | Cierra sesión y elimina cookies | Ninguno (destruye sesión) |
| **/carrito/add** | **POST** | Añade sesión al carrito del usuario | `requiereAuth` |
| **/carrito/vaciar** | **POST** | Vacía el carrito completamente | `requiereAuth` |

### 🔑 Rutas de Autenticación (POST)

| Endpoint | Descripción | Body Request | Respuesta |
| :--- | :--- | :--- | :--- |
| **POST /registro** | Crea nuevo usuario | `nombre, email, password, edad, ciudad, intereses[]` | Redirección a `/login?success=true` o errores 400 |
| **POST /login** | Inicia sesión de usuario | `email, password` | Redirección a `/perfil` o errores de credenciales |

### 🚦 Códigos de Estado y Respuestas

#### Éxito (2xx)
* **200** - Renderizado de vistas exitoso.
* **302** - Redirecciones (login, logout, acciones del carrito).

#### Errores de Cliente (4xx)
* **400** - Validación de formulario fallida (registro).
* **404** - Ruta no encontrada (middleware final).

#### Errores de Servidor (5xx)
* **500** - Error interno del servidor (base de datos, lógica).

### 🛡️ Middleware de Autenticación

El middleware `requiereAuth` protege las rutas sensibles verificando la existencia de `req.session.usuario`:

```javascript
if (!req.session.usuario) {
  return res.redirect("/login");
}
```

---

## 📄 Licencia

Este proyecto es **de carácter escolar y educativo**, desarrollado como parte de un trabajo de la asignatura *Desarrollo Web Entorno Servidor*.

---

## 👩🏼‍💻 Autor  
  
Desarrollado por **Yria Forján Oliveira**
