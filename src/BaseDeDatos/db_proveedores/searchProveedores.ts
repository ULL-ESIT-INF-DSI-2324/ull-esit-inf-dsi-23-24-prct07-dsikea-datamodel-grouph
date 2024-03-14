import { Proveedor } from "../../Entidades/Proveedores.js";
import {getProveedores} from "../db.js"
import inquirer from "inquirer";
import { gestionarProveedores } from "./proveedores_db.js";



async function searchProveedores() {
    const respuestas = await inquirer.prompt([
      {
        type: 'list',
        name: 'tipo',
        message: '¿Como quieres buscar?',
        choices: ['nombre','contacto','direccion']
      },
      {
        type: 'input',
        name: 'valor',
        message: 'Introduce el valor con el que quieres buscar',
      }
    ])
    const clientes = await filtrar(respuestas.tipo,respuestas.valor)
      const mostrar=clientes.map((cliente) => ({
        ID: cliente.id,
        Nombre: cliente.nombre,
        Contacto: cliente.contacto,
        Dirección: cliente.direccion

    }));
    console.log(mostrar);
    gestionarProveedores();

}

async function filtrar(metodo:string,a_buscar:string):Promise<Proveedor[]> {
    switch(metodo)
    {
        case 'nombre':
            return (await getProveedores()).filter((x) => x.nombre.includes(a_buscar))
        case 'contacto':
            let number=Number(a_buscar)
            return (await getProveedores()).filter((x) => x.contacto === number)
        case 'direccion':
             return (await getProveedores()).filter((x) => x.direccion.includes(a_buscar))
        default:
            return [];
    }
}


export {searchProveedores} 