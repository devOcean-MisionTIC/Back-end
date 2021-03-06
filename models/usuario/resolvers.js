import { UserModel } from "./usuario.js";
import bcrypt from "bcrypt";

const resolversUsuario = {
  Query: {
    Usuarios: async (parent, args, context) => {
      if (context.userData.rol === "ADMINISTRADOR") {
        const usuarios = await UserModel.find().populate([
          {
            path: "inscripciones",
            populate: {
              path: "proyecto",
              populate: [{ path: "lider" }],
            },
          },
          {
            path: "proyectosLiderados",
          },
        ]);
        return usuarios;
      } else if (context.userData.rol === "LIDER") {
        const usuarios = await UserModel.find({ rol: "ESTUDIANTE" });
        return usuarios;
      }
    },
    Usuario: async (parent, args) => {
      const usuario = await UserModel.findOne({ _id: args._id });
      return usuario;
    },
    filtrarUsuario: async (parents, args) => {
      const usuarioFilter = await UserModel.find({ rol: args.rol });
      return usuarioFilter;
    },
  },
  Mutation: {
    crearUsuario: async (parent, args) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(args.password, salt);

      const usuarioExiste = await UserModel.findOne({
        identificacion: args.identificacion,
      });

      if (usuarioExiste === null) {
        const usuarioCreado = await UserModel.create({
          nombre: args.nombre,
          apellido: args.apellido,
          identificacion: args.identificacion,
          correo: args.correo,
          rol: args.rol,
          password: hashedPassword,
        });

        if (Object.keys(args).includes("estado")) {
          usuarioCreado.estado = args.estado;
        }
        return usuarioCreado;
      } else {
        return "ID existente";
      }
    },
    editarUsuario: async (parent, args) => {
      const usuarioEditado = await UserModel.findByIdAndUpdate(
        args._id,
        {
          nombre: args.nombre,
          apellido: args.apellido,
          identificacion: args.identificacion,
          correo: args.correo,
          estado: args.estado,
        },
        { new: true }
      );

      return usuarioEditado;
    },
    editarMiUsuario: async (parent, args) => {
      const MiUsuarioEditado = await UserModel.findByIdAndUpdate(
        args._id,
        {
          nombre: args.nombre,
          apellido: args.apellido,
          identificacion: args.identificacion,
          correo: args.correo,
        },
        { new: true }
      );

      return MiUsuarioEditado;
    }, 
    resetPassword: async (parent,args)=> {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(args.password, salt);
      const actualizarContrasena = await UserModel.findByIdAndUpdate(
        args._id,
        {
          password: hashedPassword,
        },
        { new: true }
      );
      return "Contrasena actualizada",actualizarContrasena;
    },
    cambiarEstadoUsuario: async (parent, args) => {
      const usuarioEditado = await UserModel.findByIdAndUpdate(
        args._id,
        {
          estado: args.estado,
        },
        { new: true }
      );

      return usuarioEditado;
    },
    eliminarUsuario: async (parent, args) => {
      if (Object.keys(args).includes("_id")) {
        const usuarioEliminado = await UserModel.findOneAndDelete({
          _id: args._id,
        });
        return usuarioEliminado;
      } else if (Object.keys(args).includes("correo")) {
        const usuarioEliminado = await UserModel.findOneAndDelete({
          correo: args.correo,
        });
        return usuarioEliminado;
      }
    },
  },
};

export { resolversUsuario };
