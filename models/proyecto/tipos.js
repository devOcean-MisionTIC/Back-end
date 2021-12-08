import { gql } from 'apollo-server-express';

const tiposProyecto = gql`
  type Objetivo {
    _id: ID!
    descripcion: String!
    tipo: Enum_TipoObjetivo!
  }

  input crearObjetivo {
    descripcion: String!
    tipo: String!
  }

  input camposObjetivo {
    descripcion: String!
    tipo: Enum_TipoObjetivo!
  }

  input camposProyecto {
    nombre: String
    presupuesto: Float
    fechaInicio: Date
    fechaFin: Date
    estado: Enum_EstadoProyecto
    fase: Enum_FaseProyecto
    lider: String
  }

  type Proyecto {
    _id: ID!
    nombre: String!
    presupuesto: Float!
    fechaInicio: Date
    fechaFin: Date
    fechaCreacion: Date
    estado: Enum_EstadoProyecto!
    fase: Enum_FaseProyecto!
    lider: Usuario!
    objetivos: [Objetivo]
    avances: [Avance]
    inscripciones: [Inscripcion]
  }

  type Query {
    Proyectos: [Proyecto]
    filtrarProyecto(_id: String!):Proyecto
    filtrarProyectoPorLider(id_lider: String!): [Proyecto]
    filtrarProyectoPorLiderOtro(id_lider: String!): [Proyecto]
  }

  type Mutation {
    crearProyecto(
      nombre: String!
      presupuesto: Float!
      fechaInicio: Date
      fechaFin: Date
      estado: Enum_EstadoProyecto!
      fase: Enum_FaseProyecto!
      lider: String!
      objetivos: [crearObjetivo]
    ): Proyecto


    editarProyecto(_id: String!,   
      nombre: String
      presupuesto: Float
      fechaInicio: Date
      fechaFin: Date
      estado: Enum_EstadoProyecto
      fase: Enum_FaseProyecto
      lider: String): Proyecto
      editarProyectoPorLider(idProyecto: String!,nombre: String, presupuesto: Float ): Proyecto
      editarProyectoPorAdmin(idProyecto: String!,estado: Enum_EstadoProyecto, fase: Enum_FaseProyecto , fechaInicio:Date,fechaFin:Date): Proyecto
    
    crearObjetivo(idProyecto: String!, tipo: String!, descripcion:String!): Proyecto
    editarObjetivo1(idProyecto: String!, idObjetivo: String!,tipo: String!, descripcion:String!): Proyecto
    editarObjetivo(idProyecto: String!, indexObjetivo: Int!,tipo: String!, descripcion:String!): Proyecto
    eliminarObjetivo(idProyecto: String!, idObjetivo: String!): Proyecto
  }
`;

export { tiposProyecto };