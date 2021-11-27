import { ProjectModel } from './proyecto.js';

const resolversProyecto = {
  Query: {
    Proyectos: async (parent, args) => {
      const proyectos = await ProjectModel.find()
      .populate({
        path: 'avances',
        populate: {
          path: 'creadoPor',
        },
      })
      .populate('lider');
      return proyectos;
    },
    filtrarProyecto: async (parents, args) => {
      const projectFilter = await ProjectModel.findOne({ _id: args._id })
      .populate('lider');
      return projectFilter;
    }
  },
  Mutation: {
    crearProyecto: async (parent, args) => {
      const proyectoCreado = await ProjectModel.create({
        nombre: args.nombre,
        estado: args.estado,
        fase: args.fase,
        fechaInicio: args.fechaInicio,
        fechaFin: args.fechaFin,
        presupuesto: args.presupuesto,
        lider: args.lider,
        objetivos: args.objetivos,
      });
      return proyectoCreado;
    },
  },
};

export { resolversProyecto };