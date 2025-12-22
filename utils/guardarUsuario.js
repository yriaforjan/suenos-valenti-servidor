const fs = require("fs").promises;
const path = require("path");

const DATA_DIR = path.join(__dirname, "../data");
const DATA_FILE = path.join(DATA_DIR, "usuarios.json");

const guardarUsuario = async (nuevoUsuario) => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    let usuarios = [];
    try {
      const content = await fs.readFile(DATA_FILE, "utf-8");
      usuarios = JSON.parse(content);
    } catch (error) {
      console.log("Iniciando nuevo archivo de base de datos...");
    }

    usuarios.push({
      id: Date.now(),
      ...nuevoUsuario,
      fecha: new Date().toISOString(),
    });

    await fs.writeFile(DATA_FILE, JSON.stringify(usuarios, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error en fileManager:", error);
    throw error;
  }
};

module.exports = guardarUsuario;
