import { InscriptionModel } from '../inscripcion/inscripcion.js';
import { ProjectModel } from './proyecto.js';

const resolversProyecto = {
  Query: {
    Proyectos: async (parent, args, context) => {
      if (context.userData) {
     if (context.userData.rol === 'ESTUDIANTE') {
       return ProjectModel.find()
       .populate('lider')
       .populate("inscripciones");
     }}else{
      const proyectos = await ProjectModel.find()
      .populate('lider')
     
        return proyectos;}
    },
    filtrarProyecto: async (parents, args) => {
      const projectFilter = await ProjectModel.findOne({ _id: args._id })
      .populate('lider');
      return projectFilter;
    }, 

    filtrarProyectoPorLider: async (parents, args) => {
      const projectsFilter = await ProjectModel.find({ "lider": args.id_lider })
      .populate('lider');
      return projectsFilter;
    }, 
    // ProyectosConInscripciones: async (parent, args, context) => {
    //   // const proyectos = await ProjectModel.find()
    //   // .populate('inscripciones');
    //   let filtro = {};
    //   // if (context.userData) {
    //   //   if (context.userData.rol === 'ESTUDIANTE') {
    //       // const projects = await InscriptionModel.find({ estudiante: context.userData._id });
    //       const projects = await InscriptionModel.find({ estudiante: "61a95aebeb450051e9c2dc10" });
    //       const projectList = projects.map((p) => p.proyecto.toString());
    //       console.log("projects",projectList);
    //       filtro = {
    //         _id: {
    //           $ne: projectList,
    //         },
    //       };
    //   //   }   
    //   // }
      
    //   const sinInscripciones = await ProjectModel.find({ ...filtro });
    //   return sinInscripciones;
      
    // },
  //   ProyectosConInscripciones: async (parent, args, context) => {
  //     // const proyectos = await ProjectModel.find()
  //     // .populate('inscripciones');
  //     let filtro = {};
  //     // if (context.userData) {
  //     //   if (context.userData.rol === 'ESTUDIANTE') {
  //         // const projects = await InscriptionModel.find({ estudiante: context.userData._id });
  //           const proyectos = await ProjectModel.find().populate('inscripciones');
  //         const projectList = proyectos.inscripciones.filter((p) => 
  //         p.filter((el) => el.estudiante === "61a95aebeb450051e9c2dc10" ));
  //         console.log("projects",projectList);
  //       return projectList;
  //     //   }   
  //     // }
      
  //     // const sinInscripciones = await ProjectModel.find({ ...filtro });
  //     // return sinInscripciones;
      
  //   },
  },
  Mutation: {
    crearProyecto: async (parent, args, context) => {
      let s= args.nombre;
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
    editarProyecto: async (parent, args) => {
      const proyectoEditado = await ProjectModel.findByIdAndUpdate(
        args._id,
        {nombre: args.nombre,
          estado: args.estado,
          fase: args.fase,
          fechaInicio: args.fechaInicio,
          fechaFin: args.fechaFin,
          presupuesto: args.presupuesto,
          lider: args.lider

        },{new:true});

      return proyectoEditado;

    }, editarProyectoPorLider: async (parent, args) => {
      const edited =
      await ProjectModel.findByIdAndUpdate(args.idProyecto, {
        nombre: args.nombre,
        presupuesto: args.presupuesto,
        
      },{new:true});
    return edited;
  }
,
editarProyectoPorAdmin: async (parent, args) => {
  
  
let egreso=Date.now();
  if(args.estado=="INACTIVO"){
  const a= InscriptionModel.updateMany({"proyecto": args.idProyecto,fechaEgreso:null}, 
  {"$set":{"fechaEgreso": egreso}}, {"multi": true}, (err, writeResult) => {});
   
  }
const edited=  await ProjectModel.findByIdAndUpdate(args.idProyecto, {
    estado: args.estado,
    fase: args.fase,
    fechaInicio:args.fechaInicio,
    fechaFin:args.fechaFin,
  },{new:true});

return edited;
},
    
    crearObjetivo: async (parent, args) => {
      const nuevo= {"tipo":args.tipo, "descripcion":args.descripcion};
      const proyectoConObjetivo = await ProjectModel.findByIdAndUpdate(
        args.idProyecto,
        {
          $addToSet: {
            objetivos:  nuevo ,
          },
        },
        { new: true }
      );

      return proyectoConObjetivo;
    },
    editarObjetivo: async (parent, args) => {
      const proyectoEditado = await ProjectModel.findByIdAndUpdate(
        args.idProyecto,
        {
          $set: {
            [`objetivos.${args.indexObjetivo}.descripcion`]: args.descripcion,
            [`objetivos.${args.indexObjetivo}.tipo`]: args.tipo,
          },
        },
        { new: true }
      );
      return proyectoEditado;
    },
    editarObjetivo1: async (parent, args) => {
      const proyectoEditado = await ProjectModel.updateOne(
        {
          "_id" : args.idProyecto,
          'objetivos': {
            '$elemMatch': {
              '_id': args.idObjetivo,
            }
          }
        },
        {
          $set: {
            "objetivos.$[outer].tipo": args.tipo,
            "objetivos.$[outer].descripcion": args.descripcion
           
          }
        },
        {
          arrayFilters: [
            { "outer._id": args.idObjetivo},
            
  
        ]
        }
      );
      return proyectoEditado;
    },
    // editarObjetivo1: async (parent, args) => {
    //   const e={};
    //   const proyectoEditado = await ProjectModel.updateMany(
    //     {_id:args.idProyecto},
    //     {$set: {
    //         [`objetivos.${e}.descripcion`]: args.descripcion,
    //         [`objetivos.${e}.tipo`]: args.tipo,  }
    //       },  {arrayFilters:[{"e":{_id:args.idObjetivo}}]}
          
          
    //     // args.idProyecto,
    //     // {
    //     //   $set: {
    //     //     [`objetivos.${args.indexObjetivo}.descripcion`]: args.descripcion,
    //     //     [`objetivos.${args.indexObjetivo}.tipo`]: args.tipo,
    //     //   },
    //     // },
    //     // { new: true }
    //   );
    //   return proyectoEditado;
    // },
    eliminarObjetivo: async (parent, args) => {
      const proyectoObjetivo = await ProjectModel.findByIdAndUpdate(
        { _id: args.idProyecto },
        {
          $pull: {
            objetivos: {
              _id: args.idObjetivo,
            },
          },
        },
        { new: true }
      );
      return proyectoObjetivo;
    },
  },
};

export { resolversProyecto };