import { gql } from 'apollo-server-express';

const tiposUsuario = gql`
  type Usuario {
    _id: ID!
    nombre: String!
    apellido: String!
    identificacion: String!
    correo: String!
    rol: Enum_Rol!
    estado: Enum_EstadoUsuario
    inscripciones: [Inscripcion]
    avancesCreados: [Avance]
    proyectosLiderados: [Proyecto]
  }

  type Query {
    Usuarios: [Usuario]
    Usuario(_id: String!): Usuario
    filtrarUsuario(rol:String!):[Usuario]
  }

  type Mutation {
    crearUsuario(
      nombre: String!
      apellido: String!
      identificacion: String!
      correo: String!
      rol: Enum_Rol!
      estado: Enum_EstadoUsuario
      password: String!
    ): Usuario

    editarUsuario(
      _id: String!
      nombre: String!
      apellido: String!
      identificacion: String!
      correo: String!
      estado: Enum_EstadoUsuario!
    ): Usuario

    editarMiUsuario(
      _id: String!
      nombre: String
      apellido: String
      identificacion: String
      correo: String
    ): Usuario

    resetPassword(
      _id: String!
      password: String!
    ): Usuario

    cambiarEstadoUsuario(
      _id: String!
      estado: Enum_EstadoUsuario!
    ): Usuario
    eliminarUsuario(_id: String, correo: String): Usuario
  }
`;

export { tiposUsuario };