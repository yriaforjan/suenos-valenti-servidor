const fs = require("fs").promises;
const path = require("path");

const DATA_DIR = path.join(__dirname, "../data");
const DATA_FILE = path.join(DATA_DIR, "usuarios.json");

const actualizarUsuario = async (email, nuevosDatos) => {
  try {
    const content = await fs.readFile(DATA_FILE, "utf-8");
    let usuarios = JSON.parse(content);

    // Buscamos el índice del usuario por su email
    const index = usuarios.findIndex((u) => u.email === email);

    if (index !== -1) {
      // Fusionamos los datos antiguos con los nuevos (ej: el tema)
      usuarios[index] = { ...usuarios[index], ...nuevosDatos };

      await fs.writeFile(DATA_FILE, JSON.stringify(usuarios, null, 2), "utf-8");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }
};

module.exports = actualizarUsuario;
