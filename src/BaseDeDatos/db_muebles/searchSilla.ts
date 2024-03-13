import inquirer from "inquirer";
import { getMuebles} from "../db.js";
import { Mueble } from "../../abstract_classes/Mueble.js";
import { opcionesSiguientes } from "../db_muebles/muebles_db.js";
import { Silla } from "../../Muebles/Silla.js";

async function searchSilla() {
    const respuestas = await inquirer.prompt([
        {
            type: 'list',
            name: 'tipo',
            message: '¿Como quieres buscar?',
            choices: ['nombre','material', 'descripcion']
        },
        {
            type: 'list',
            name: 'ordenacion',
            message: '¿Como ordenar la busqueda?',
            choices: ['precio', 'descripcion']
        },
        {
            type: 'list',
            name: 'asc',
            message: '¿ascendente o descendente?',
            choices: ['ascendente','descendente']
        },
        {
            type: 'input',
            name: 'clave',
            message: '¿Que desas  filtrar?',
        }
    ]
    )

    const mueblesPromise = await filtros(respuestas.clave,respuestas.tipo,respuestas.ordenacion,respuestas.asc);
      const mostrar=mueblesPromise.map((mueble) => ({
        ID: mueble.id,
        Nombre: mueble.nombre,
        Descripción: mueble.descripcion,
        Material: mueble.material,
        Dimensiones: `A: ${mueble.dimensiones.ancho} cm, Al: ${mueble.dimensiones.alto} cm, L: ${mueble.dimensiones.largo} cm`,
        Precio: `${mueble.precio} €`
    }));



    console.log(mostrar);

    await opcionesSiguientes()
}             


async function filtros(a_buscar:string,metodo:string,a_ordenar:string,asc:string):Promise<Mueble[]>
{
   switch(metodo)
   {
      case 'nombre':
        const filtros= await  filtros_a_nombre(a_buscar,a_ordenar,asc);
        return filtros;
      case 'material':
        return filtros_a_material(a_buscar,a_ordenar,asc);
      case 'tamaño':
        return filtros_a_descripcion(a_buscar,a_ordenar,asc);
      default:
        return [];
   }
}

async function filtros_a_nombre(a_buscar:string,a_ordenar:string,asc:string):Promise<Mueble[]> 
{

    if(a_ordenar === 'precio')
    {
      if(asc === 'descendente')
        return (await getMuebles()).filter((x) => x instanceof(Silla)).filter((x) => x.nombre.includes(a_buscar)).sort((a,b) =>b.precio - a.precio);
      else
      return (await getMuebles()).filter((x) => x instanceof(Silla)).filter((x) => x.nombre.includes(a_buscar)).sort((a, b) => a.precio - b.precio);
    }
    if(asc === 'descendente')
       return (await getMuebles()).filter((x) => x typeof Mueble).filter((x)=>x.nombre.includes(a_buscar)).sort((a,b) =>b.descripcion.localeCompare(a.descripcion));
    else
       return (await getMuebles()).filter((x) => x instanceof(Silla)).filter((x)=>x.nombre.includes(a_buscar)).sort((a,b) =>a.descripcion.localeCompare(b.descripcion));    
}

async function filtros_a_material(a_buscar:string,a_ordenar:string,asc:string):Promise<Mueble[]>
{

    if(a_ordenar === 'precio')
    {
      if(asc === 'descendente')
        return (await getMuebles()).filter((x) => x instanceof(Silla)).filter((x)=>{x.material === a_buscar}).sort((a,b) =>b.precio - a.precio);
      else
        return (await getMuebles()).filter((x) => x instanceof(Silla)).filter((x)=>{x.material === a_buscar}).sort((a,b) =>a.precio - b.precio);   
    }
    if(asc === 'descendente')
      return (await getMuebles()).filter((x) => x instanceof(Silla)).filter((x)=>{x.material === a_buscar}).sort((a,b) =>b.descripcion.localeCompare(a.descripcion));
    else
      return (await getMuebles()).filter((x) => x instanceof(Silla)).filter((x)=>{x.material === a_buscar}).sort((a,b) =>a.descripcion.localeCompare(b.descripcion));    
}

async function filtros_a_descripcion(a_buscar:string,a_ordenar:string,asc:string):Promise<Mueble[]>
{
    if(a_ordenar === 'precio')
    {
      if(asc === 'descendente')
        return (await getMuebles()).filter((x) => x instanceof(Silla)).filter((x)=>{x.descripcion.includes(a_buscar)}).sort((a,b) =>b.precio - a.precio);
      else
        return (await getMuebles()).filter((x) => x instanceof(Silla)).filter((x)=>{x.descripcion.includes(a_buscar)}).sort((a,b) =>a.precio - b.precio);   
    }
    if(asc === 'descendente')
      return (await getMuebles()).filter((x) => x instanceof(Silla)).filter((x)=>{x.descripcion.includes(a_buscar)}).sort((a,b) =>b.descripcion.localeCompare(a.descripcion));
    else
      return (await getMuebles()).filter((x) => x instanceof(Silla)).filter((x)=>{x.descripcion.includes(a_buscar)}).sort((a,b) =>a.descripcion.localeCompare(b.descripcion));    
}


export {searchSilla}