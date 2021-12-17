import { tipos } from './graphql/tipos.js';
import { resolvers } from './graphql/resolvers.js';
import { gql } from 'apollo-server-express';
import { ApolloServer } from 'apollo-server-express';
import conectarBD from './db/db.js';
import dotenv from 'dotenv';
import assert from 'assert';

dotenv.config();
await conectarBD();

const server = new ApolloServer({
  typeDefs: tipos,
  resolvers: resolvers,
});
// PRUEBA PARA VERIFICAR LA MUTACION PARA CREAR UN USUARIO
it('creates user', async () => {
  const result = await server.executeOperation({
    query: gql`
    mutation CrearUsuario($apellido: String!, $identificacion: String!, $correo: String!, $rol: Enum_Rol!, $password: String!, $nombre: String!) {
        crearUsuario(apellido: $apellido, identificacion: $identificacion, correo: $correo, rol: $rol, password: $password,nombre: $nombre) {
          nombre
        }
      }
    `,
    variables: {
      nombre: 'test',
      apellido: 'test',
      identificacion: '123456',
      correo: 'prueba@testing.com',
      rol: 'ADMINISTRADOR',
      password: 'test',
    },
  });
  console.log(JSON.stringify(result))
  assert.equal(result.data.crearUsuario.nombre, 'test');
});


// PRUEBA PARA VERIFICAR EL QUERY PARA BUSCAR USUARIO POR ID
it('fetches user', async () => {
  const result = await server.executeOperation({
    query: gql`
      query Usuario($id: String!) {
        Usuario(_id: $id) {
          correo
        }
      }
    `,
    variables: {
      id:"61bb5e7c5fe5570f1460fb64"
      },
  });
  
  assert.equal(result.data.Usuario.correo, 'yeisonAdmin2@hotmail.com');
});


// PRUEBA PARA VERIFICAR LA MUTACION PARA ELIMINAR UN USUARIO
it('deletes user', async () => {
  const result = await server.executeOperation({
    query: gql`
      mutation EliminarUsuario($correo: String) {
        eliminarUsuario(correo: $correo) {
          correo
        }
      }
    `,
    variables: {
      correo: 'prueba@testing.com',
    },
  });
  assert.equal(result.data.eliminarUsuario.correo, 'prueba@testing.com');
});

