import { ProjectModel } from '../proyecto/proyecto.js';
import { UserModel } from '../usuario/usuario.js';
import { InscriptionModel } from './inscripcion.js';
const resolverInscripciones = {
  Inscripcion: {
    proyecto: async (parent, args, context) => {
      return await ProjectModel.findOne({ _id: parent.proyecto });
    },
    estudiante: async (parent, args, context) => {
      return await UserModel.findOne({ _id: parent.estudiante });
    },
  },
  Query: {
    Inscripciones: async (parent, args, context) => {
      let filtro = {};
      if (context.userData) {
        if (context.userData.rol === 'LIDER') {
          const projects = await ProjectModel.find({ lider: context.userData._id });
          const projectList = projects.map((p) => p._id.toString());
          filtro = {
            proyecto: {
              $in: projectList,
            },
          };
        }
      }
      const inscripciones = await InscriptionModel.find({ ...filtro });
      return inscripciones;
    },

    filtrarInscripcionesPorEstudiante: async (parents, args) => {
      const filterInscriptions = 
      await InscriptionModel.find({ "estudiante": args.id_estudiante })
      .populate('proyecto')
      .populate('estudiante');
      return filterInscriptions;
    }, 
    filtrarInscripcionesPorProyecto: async (parents, args) => {
      const filterInscriptions = 
      await InscriptionModel.find({ "proyecto": args.idProyecto })
      .populate('proyecto')
      .populate('estudiante');
      return filterInscriptions;
    }, 
    // filtrarInscripcionesPorLider: async (parents, args) => {
    //   const filterInscriptions = await InscriptionModel.find();
    //   await InscriptionModel.find().populate({
    //     path: 'proyecto',
    //     match: {
    //        lider: args.id_lider,
    //     }
    //  }).exec();
      
    //   return filterInscriptions;
    // }, 
    // filtrarInscripcionesPorLider: async (parents, args) => {
      
    //   const filterInscriptions = 
    //   await InscriptionModel.find().populate('proyecto');
    //   console.log("lista f",filterInscriptions);
    //   const lista= filterInscriptions.filter((elem) => {
    //     return elem.lider.contains(args.id_lider);
    // });
    //   console.log("lista",lista);
     
    //   return lista;
    // },
    // filtrarInscripcionesPorLider: async (parents, args) => {
    //   const filterInscriptions = 
    //   await InscriptionModel.find({ "lider_proyecto": args.id_lider })
    //   .populate('proyecto')
    //   .populate('estudiante');
    //   return filterInscriptions;
    // }, 
  },
  Mutation: {
    crearInscripcion: async (parent, args) => {
      
      const inscripcionCreada = await InscriptionModel.create({
        proyecto: args.proyecto,
        estudiante: args.estudiante,
        
      });
      return inscripcionCreada;
    },
    aprobarInscripcion: async (parent, args) => {
      const inscripcionAprobada = await InscriptionModel.findByIdAndUpdate(
        args.id,
        {
          estado: 'ACEPTADO',
          fechaIngreso: Date.now(),
        },
        { new: true }
      );
      return inscripcionAprobada;
    },
    rechazarInscripcion: async (parent, args) => {
      const inscripcionRechazada = await InscriptionModel.findByIdAndUpdate(
        args.id,
        {
          estado: 'RECHAZADO',
          fechaEgreso: Date.now(),
        },
        { new: true }
      );
      return inscripcionRechazada;
    },
  },
};

export { resolverInscripciones };