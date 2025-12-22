const fs = require("fs").promises;
const path = require("path");

const DATA_DIR = path.join(__dirname, "../data");
const LOG_FILE = path.join(DATA_DIR, "accesos.log");

const registrarLog = async (accion, usuario = "Anónimo") => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    const ahora = new Date().toLocaleString();
    const linea = `[${ahora}] Usuario: ${usuario} | Acción: ${accion}\n`;

    await fs.appendFile(LOG_FILE, linea, "utf-8");
  } catch (error) {
    console.error("Error al escribir el log:", error);
  }
};

module.exports = registrarLog;
