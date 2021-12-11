import { gql } from 'apollo-server-express';

const tiposAvance = gql`
  type Avance {
    _id: ID!
    fecha: Date!
    titulo: String!
    descripcion: String!
    observaciones: [String]
    proyecto: Proyecto!
    creadoPor: Usuario!
  }

  type Query {
    Avances: [Avance]
    filtrarAvance(idProject: String!): [Avance]
    filtrarAvancePorId(_idAvance: String!): Avance
    filtrarAvancePorEstudiante(idEstudiante: String!): Avance
  }
  type Mutation {
    crearAvance(fecha: Date!, titulo: String!, descripcion: String!, proyecto: String!, creadoPor: String!,numAdvances:String!): Avance
    editarAvanceEstudiante(_idAvance: String!,titulo: String!, descripcion: String! ): Avance
    
    addNewObservacionAvance(_idAvance: String!, observacion: String!): Avance
  
  }
`;

export { tiposAvance };
