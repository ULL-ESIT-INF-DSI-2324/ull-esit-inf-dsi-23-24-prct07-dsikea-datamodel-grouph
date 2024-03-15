import { Cliente } from "../../Entidades/Clientes.js";
import {getClientes} from "../db.js"
import inquirer from "inquirer";
import { gestionarClientes } from "./clientes_db.js";



async function searchCliente() {
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
    gestionarClientes();

}

async function filtrar(metodo:string,a_buscar:string):Promise<Cliente[]> {
  let number: number;
  switch(metodo)
  {
    case 'nombre':
      return (await getClientes()).filter((x) => x.nombre.includes(a_buscar))
    case 'contacto':
      number = Number(a_buscar);
      return (await getClientes()).filter((x) => x.contacto === number)
    case 'direccion':
       return (await getClientes()).filter((x) => x.direccion.includes(a_buscar))
    default:
      return [];
  }
}


export {searchCliente} 