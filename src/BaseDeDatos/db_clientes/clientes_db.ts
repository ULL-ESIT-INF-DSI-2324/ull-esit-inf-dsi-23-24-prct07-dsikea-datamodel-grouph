import inquirer from 'inquirer';
import { Cliente } from "../../Entidades/Clientes.js";
import { getClientes, addCliente } from "../db.js";
import { gestionarClientes } from "../../index.js";

async function listarClientes() {
    const clientes = await getClientes();
    
    if (clientes.length === 0) {
        console.log('No hay clientes registrados.');
        return;
    }
    
    // Preparando los datos para mostrar en formato de tabla
    const clientesParaMostrar = clientes.map((cliente) => ({
        ID: cliente.id,
        Nombre: cliente.nombre,
        Contacto: cliente.contacto,
        Dirección: cliente.direccion
    }));
    
    console.log('Lista de Clientes:');
    console.table(clientesParaMostrar);
    
    // Vuelve al menú anterior después de mostrar los clientes
    gestionarClientes();
}

async function añadirCliente() {
    const respuestas = await inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'ID del cliente:',
            validate: input => !isNaN(parseInt(input)) || 'Por favor, introduce un número',
        },
        {
            type: 'input',
            name: 'nombre',
            message: 'Nombre del cliente:',
        },
        {
            type: 'input',
            name: 'contacto',
            message: 'Teléfono del cliente:',
            validate: input => !isNaN(parseInt(input)) || 'Por favor, introduce un número',
        },
        {
            type: 'input',
            name: 'direccion',
            message: 'Dirección del cliente:',
        },
    ]);

    const nuevoCliente = new Cliente(
        parseInt(respuestas.id),
        respuestas.nombre,
        parseInt(respuestas.contacto),
        respuestas.direccion
    );
    
    await addCliente(nuevoCliente);
    console.log('Cliente añadido correctamente.');
    gestionarClientes();
}

export { listarClientes, añadirCliente };

