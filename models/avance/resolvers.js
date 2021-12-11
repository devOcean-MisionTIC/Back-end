import { ModeloAvance } from './avance.js';
import { ObjectId } from 'mongodb';
import { ProjectModel } from '../proyecto/proyecto.js';

const resolversAvance = {
  Query: {
    Avances: async (parent, args) => {
      const avances = await ModeloAvance.find()
      .populate('proyecto').populate('creadoPor');
      return avances;
    },
    filtrarAvance: async (parents, args) => {
      const avanceFiltrado = await ModeloAvance.find({ proyecto: args.idProject })
        .populate('proyecto')
        .populate('creadoPor');
      return avanceFiltrado;
    },
    filtrarAvancePorId: async (parents, args) => {
      const avanceFiltrado = await ModeloAvance.findOne({ _id: args._idAvance })
        .populate('proyecto')
        .populate('creadoPor');
      return avanceFiltrado;
    },
    filtrarAvancePorEstudiante: async (parents, args) => {
      const avanceFiltrado = await ModeloAvance.find({ creadoPor: new ObjectId(args.idEstudiante) });
 
      return avanceFiltrado;
    },
  },
  Mutation: {
    crearAvance: async (parents, args) => {
      // const firstAdvance= ModeloAvance.find({ proyecto: args.idProject });
      // console.log("first",firstAdvance);
      let datenow= new Date();
      // if(firstAdvance.length==0){
      //  const a= await ProjectModel.findByIdAndUpdate(args.idProject, {
      //     fase: "DESARROLLO",
      //     fechaInicio:datenow,
      //   });
      //   console.log("a",a);
      // }
     
      const avanceCreado = ModeloAvance.create({
        fecha: args.fecha,
        titulo: args.titulo,
        descripcion: args.descripcion,
        proyecto: args.proyecto,
        creadoPor: args.creadoPor,
      });
      if(args.numAdvances==="0"){
        console.log("first advance");
        const a=await ProjectModel.findByIdAndUpdate(args.proyecto, {
              fase: "DESARROLLO",
              fechaInicio:datenow,
            });
            console.log("a",a);
      }
      return avanceCreado;
    }, 
    editarAvanceEstudiante: async (parent, args) => {
      const avanceEdited =
      await ModeloAvance.findByIdAndUpdate(args._idAvance, {
        titulo: args.titulo,
        descripcion: args.descripcion,
        
      },{new:true});

      return avanceEdited;
    },
    // editarObservacionesAvance: async (parent, args) => {
    //   const avanceEdited = await ModeloAvance.findByIdAndUpdate(args._idAvance, {
    //     observaciones: args.observaciones
    //   },{new:true});

    //   return avanceEdited;
    // },
    addNewObservacionAvance: async (parent, args) => {
      const addObservacion= args.observacion;
      const avanceObjetivos = await ModeloAvance.findByIdAndUpdate(
        args._idAvance,
        {
          $addToSet: {
            observaciones:  addObservacion ,
          },
        },
        { new: true }
      );

      return avanceObjetivos;
    },
  },
};

export { resolversAvance };