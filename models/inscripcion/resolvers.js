import { InscriptionModel } from './inscripcion.js';
const resolverInscripciones = {
  Query: {
    Inscripciones: async (parent, args) => {
      const inscripciones = await InscriptionModel.find()
      .populate('estudiante') 
      .populate('proyecto');
      return inscripciones;
    },
    filtrarInscripcionesPorEstudiante: async (parents, args) => {
      const filterInscriptions = 
      await InscriptionModel.find({ "estudiante": args.id_estudiante })
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
        estado: args.estado,
        proyecto: args.proyecto,
        estudiante: args.estudiante,
        
      });
      return inscripcionCreada;
    },
    aprobarInscripcion: async (parent, args) => {
      const inscripcionAprobada = await InscriptionModel.findByIdAndUpdate(args.id, {
        estado: 'ACEPTADO',
        fechaIngreso: Date.now(),
      },{new:true});
      return inscripcionAprobada;
    },
  },
};

export { resolverInscripciones };
