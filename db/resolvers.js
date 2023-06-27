const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");

const resolvers = {
  Query: {},
  Mutation: {
    crearUsuario: async (_, { input }, ctx) => {
      const { email, password } = input;

      const existeUsuario = await Usuario.findOne({ email });

      if (existeUsuario) {
        throw new Error("El usuario ya esta registrado");
      }

      try {
        // Hashear password
        const salt = await bcryptjs.genSalt(10);
        input.password = await bcryptjs.hash(password, salt);

        console.log(input);

        // Registrar nuevo usuario
        const nuevoUsuario = new Usuario(input);

        nuevoUsuario.save();
        return "Usuario Creado Correctamente";
      } catch (error) {
        console.log(error);
      }
    },
    autenticarUsuario: async (_, { input }) => {
      const { email, password } = input;

      // Si el usuario existe
      const existeUsuario = await Usuario.findOne({ email });

      if (!existeUsuario) {
        throw new Error("El usuario no existe");
      }

      // Si el password es correcto
      const passwordCorrecto = await bcryptjs.compare(
        password,
        existeUsuario.password
      );

      if (!passwordCorrecto) {
        throw new Error("Password Incorrecto");
      }

      // Dar acceso a la app

      return "Has iniciado sesión";
    },
  },
};

module.exports = resolvers;
