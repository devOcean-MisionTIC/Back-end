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
    filtrarAvance(_id: String!): [Avance]
  }
  type Mutation {
    crearAvance(fecha: Date!, titulo: String!, descripcion: String!, proyecto: String!, creadoPor: String!): Avance
  }
`;

export { tiposAvance };
