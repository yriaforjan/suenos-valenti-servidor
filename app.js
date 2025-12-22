require("dotenv").config();
const express = require("express");
const path = require("path");
const layouts = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const guardarUsuario = require("./utils/guardarUsuario");
const obtenerUsuarios = require("./utils/obtenerUsuarios");
const actualizarUsuario = require("./utils/actualizarUsuario");
const requiereAuth = require("./middlewares/requiereAuth");
const todasLasSesiones = require("./data/sesiones");
const registrarLog = require("./utils/registrarLog");

const PORT = process.env.PORT || 3000;
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "layout");

app.use(express.static("public"));
app.use(layouts);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CONFIGURACIÓN DE SESIÓN
app.use(
  session({
    secret: process.env.SESION_SECRET || "secreto_valenti",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    },
  })
);

app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  if (req.session.usuario) {
    res.locals.tema = req.session.usuario.tema || "claro";
  } else {
    res.locals.tema = req.cookies.tema || "claro";
  }

  next();
});

/* RUTAS GET */
app.get("/registro", (req, res, next) => {
  res.render("registro", {
    title: "Registro",
    nombre: "",
    email: "",
    password: "",
    edad: "",
    ciudad: "",
    intereses: [],
    errores: [],
  });
});

app.get("/login", (req, res, next) => {
  const mensaje = req.query.success
    ? "¡Registro completado! Ya puedes entrar."
    : null;
  res.render("login", {
    title: "Acceder",
    errores: [],
    mensaje: mensaje,
  });
});

app.get("/logout", (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      return res.redirect("/");
    }
    res.clearCookie("connect.sid");
    res.clearCookie("tema");
    res.redirect("/login");
  });
});

app.get("/perfil", requiereAuth, async (req, res, next) => {
  const interesesUsuario = req.session.usuario.intereses || [];
  const carrito = req.session.carrito || [];
  const recomendadas = todasLasSesiones.filter((s) =>
    interesesUsuario.includes(s.categoria)
  );
  const otras = todasLasSesiones.filter(
    (s) => !interesesUsuario.includes(s.categoria)
  );

  await registrarLog("Acceso a zona privada", req.session.usuario.email);

  res.render("perfil", {
    title: "Mis Sesiones",
    usuario: req.session.usuario,
    recomendadas,
    otras,
    carrito,
  });
});

app.get("/preferencias", (req, res, next) => {
  res.render("preferencias", { title: "Preferencias de tema" });
});

// Cambiar el tema
app.get("/preferencias/:tema", async (req, res, next) => {
  const { tema } = req.params;
  const nuevoTema = tema === "oscuro" ? "oscuro" : "claro";

  res.cookie("tema", nuevoTema, { maxAge: 1000 * 60 * 60 * 24 * 30 });

  if (req.session.usuario) {
    req.session.usuario.tema = nuevoTema;
    const email = req.session.usuario.email;

    try {
      await actualizarUsuario(email, { tema: nuevoTema });
      await registrarLog(`Cambio de tema a ${nuevoTema}`, email);
    } catch (err) {
      console.error("Error al guardar en JSON");
    }
  }

  res.redirect("/preferencias");
});

app.get("/", (req, res, next) => {
  res.render("inicio", {
    layout: false,
    usuario: req.session.usuario || null,
    tema: req.cookies.tema || "claro",
  });
});

/* RUTAS POST */
app.post("/registro", async (req, res, next) => {
  const { nombre, email, password, edad, ciudad } = req.body;
  let intereses = req.body.intereses || [];
  if (!Array.isArray(intereses)) intereses = [intereses];

  let errores = [];
  if (!nombre || nombre.trim().length < 2) {
    errores.push("El nombre tiene que tener mínimo 2 caracteres");
  }
  if (!email || !email.includes("@")) {
    errores.push("Introduce un email válido");
  }
  if (!password || password.length < 8) {
    errores.push("La contraseña debe tener un mínimo de 8 caracteres");
  }
  if (!Number(edad) || isNaN(Number(edad)) || Number(edad) <= 0) {
    errores.push("La edad debe ser mayor a 0");
  }
  if (!ciudad || ciudad.length === 0) {
    errores.push("La ciudad no puede estar vacía");
  }
  if (errores.length) {
    return res.status(400).render("registro", {
      title: "Registro",
      nombre,
      email,
      password,
      edad,
      ciudad,
      intereses,
      errores,
    });
  }

  try {
    await guardarUsuario({
      nombre,
      email,
      password,
      edad,
      ciudad,
      intereses,
      tema: "claro",
    });
    await registrarLog("Nuevo usuario registrado", email);
    res.redirect("/login?success=true");
  } catch (error) {
    res.status(500).send("Error registrando el usuario");
  }
});

app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const usuarios = await obtenerUsuarios();
    const usuario = usuarios.find(
      (u) => u.email === email && u.password === password
    );

    if (!usuario) {
      return res.render("login", {
        title: "Acceder",
        errores: ["Credenciales incorrectas"],
        mensaje: null,
      });
    }

    req.session.usuario = {
      nombre: usuario.nombre,
      email: usuario.email,
      intereses: usuario.intereses,
      tema: usuario.tema || "claro", // Si no tiene, por defecto claro
    };

    res.cookie("tema", usuario.tema || "claro", {
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    await registrarLog("Login exitoso", usuario.email);
    res.redirect("/perfil");
  } catch (error) {
    res.status(500).send("Error interno");
  }
});

app.post("/carrito/add", requiereAuth, async (req, res) => {
  const { sessionId, nombreSesion } = req.body;
  if (!req.session.carrito) req.session.carrito = [];

  const existe = req.session.carrito.find((s) => s.id === sessionId);
  if (!existe) {
    req.session.carrito.push({ id: sessionId, nombre: nombreSesion });
    await registrarLog(
      `Sesión añadida: ${nombreSesion}`,
      req.session.usuario.email
    );
  }
  res.redirect("/perfil");
});

app.post("/carrito/vaciar", requiereAuth, async (req, res) => {
  req.session.carrito = [];
  await registrarLog("Carrito vaciado", req.session.usuario.email);
  res.redirect("/perfil");
});


app.use((req, res, next) => {
  return res.status(400).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Servidor escucHando en http://localhost:${PORT}`);
});
