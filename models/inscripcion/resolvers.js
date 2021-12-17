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

      if (context.userData) {
        if (context.userData.rol === 'ESTUDIANTE') {
          const projectsEstudiante = await InscriptionModel.find({ estudiante: context.userData._id });
         return projectsEstudiante;
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
    filtrarSiEstaInscrito: async (parents, args) => {
      const filterInscriptions = 
      await InscriptionModel.findOne({ "proyecto": args.idProyecto ,
      "estudiante":args.idEstudiante,"estado":"ACEPTADO",fechaEgreso:null});
      
      return filterInscriptions;
    }, 
  
    filtrarInscripcionesPorProyecto: async (parents, args) => {
      const filterInscriptions = 
      await InscriptionModel.find({ "proyecto": args.idProyecto })
      .populate('proyecto')
      .populate('estudiante');
      return filterInscriptions;
    }, 
    
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
          
        },
        { new: true }
      );
      return inscripcionRechazada;
    },
  },
};

export { resolverInscripciones };