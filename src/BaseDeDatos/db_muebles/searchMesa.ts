import inquirer from "inquirer";
import { getMesa} from "../db.js";
import { Mueble } from "../../abstract_classes/Mueble.js";
import { opcionesSiguientes } from "../db_muebles/muebles_db.js";
//import { Mesa } from "../../Muebles/Mesa.js";

async function searchMesa() {
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
  let filtros;
  let filtros1;
  let filtros2;

  switch(metodo)
  {
    case 'nombre':
      filtros = await filtros_a_nombre(a_buscar, a_ordenar, asc);
      return filtros;
    case 'material':
      filtros1 = await filtros_a_material(a_buscar, a_ordenar, asc);
      return filtros1;
    case 'descripcion':
      filtros2 = await filtros_a_descripcion(a_buscar, a_ordenar, asc);
      console.log(filtros2.length);
      return filtros2;
    default:
      return [];
  }
}

async function filtros_a_nombre(a_buscar:string,a_ordenar:string,asc:string):Promise<Mueble[]> 
{

    if(a_ordenar === 'precio')
    {
      if(asc === 'descendente')
        return (await getMesa()).filter((x) => x.nombre.includes(a_buscar)).sort((a,b) =>b.precio - a.precio);
      else
      return (await getMesa()).filter((x) => x.nombre.includes(a_buscar)).sort((a, b) => a.precio - b.precio);
    }
    if(asc === 'descendente')
       return (await getMesa()).filter((x)=>x.nombre.includes(a_buscar)).sort((a,b) =>b.descripcion.localeCompare(a.descripcion));
    else
       return (await getMesa()).filter((x)=>x.nombre.includes(a_buscar)).sort((a,b) =>a.descripcion.localeCompare(b.descripcion));    
}

async function filtros_a_material(a_buscar:string,a_ordenar:string,asc:string):Promise<Mueble[]>
{

    if(a_ordenar === 'precio')
    {
      if(asc === 'descendente')
        return (await getMesa()).filter((x)=>x.material === a_buscar).sort((a,b) =>b.precio - a.precio);
      else
        return (await getMesa()).filter((x)=>x.material === a_buscar).sort((a,b) =>a.precio - b.precio);   
    }
    if(asc === 'descendente')
      return (await getMesa()).filter((x)=>x.material === a_buscar).sort((a,b) =>b.descripcion.localeCompare(a.descripcion));
    else
      return (await getMesa()).filter((x)=>x.material === a_buscar).sort((a,b) =>a.descripcion.localeCompare(b.descripcion));    
}

async function filtros_a_descripcion(a_buscar:string,a_ordenar:string,asc:string):Promise<Mueble[]>
{
    if(a_ordenar === 'precio')
    {
      if(asc === 'descendente')
        return (await getMesa()).filter((x)=>x.descripcion.includes(a_buscar)).sort((a,b) =>b.precio - a.precio);
      else
        return (await getMesa()).filter((x)=>x.descripcion.includes(a_buscar)).sort((a,b) =>a.precio - b.precio);   
    }
    if(asc === 'descendente')
      return (await getMesa()).filter((x)=>x.descripcion.includes(a_buscar)).sort((a,b) =>b.descripcion.localeCompare(a.descripcion));
    else
      return (await getMesa()).filter((x)=>x.descripcion.includes(a_buscar)).sort((a,b) =>a.descripcion.localeCompare(b.descripcion));    
}



export{searchMesa}