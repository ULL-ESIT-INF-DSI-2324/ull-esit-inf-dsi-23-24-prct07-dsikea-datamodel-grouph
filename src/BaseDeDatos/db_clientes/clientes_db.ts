import inquirer from 'inquirer';
import { Cliente } from "../../Entidades/Clientes.js";
import { getClientes, addCliente, deleteCliente, idEsUnico } from "../db.js";
import { gestionarClientes } from "../../index.js";
import { db } from '../db.js';

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

    const id = parseInt(respuestas.id);
    const esUnico = await idEsUnico(id);

    if (!esUnico) {
        console.log('El ID introducido ya está en uso. Por favor, introduce un ID único.');
        await añadirCliente();
        return;
    }

    const nuevoCliente = new Cliente(
        id,
        respuestas.nombre,
        parseInt(respuestas.contacto),
        respuestas.direccion
    );
    
    await addCliente(nuevoCliente);
    console.log('Cliente añadido correctamente.');
    gestionarClientes();
}

async function eliminarCliente() {
    const respuesta = await inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'Introduce el ID del cliente a eliminar:',
            validate: function(value) {
                const valid = !isNaN(parseFloat(value));
                return valid || 'Por favor, introduce un número';
            },
            filter: Number
        }
    ]);

    await deleteCliente(respuesta.id);
    console.log(`Cliente con ID = ${respuesta.id} eliminado correctamente.`);
    gestionarClientes();
}

async function modificarClientePorId() {
    await db.read();

    const { id } = await inquirer.prompt({
        type: 'number',
        name: 'id',
        message: 'Introduce el ID del cliente a modificar:',
        validate: value => !isNaN(value) && value > 0 ? true : 'Por favor, introduce un ID válido.'
    });

    const clienteIndex = db.data?.clientes.findIndex(c => c.id === id);
    if (clienteIndex === -1 || clienteIndex === undefined) {
        console.log('Cliente no encontrado.');
        return;
    }

    const cliente = db.data?.clientes[clienteIndex];
    if (!cliente) {
        console.log('Cliente no encontrado.');
        return;
    }

    const preguntas = [
        {
            name: 'id',
            type: 'number',
            message: 'Nuevo ID del cliente:',
            validate: async (input: number) => {
                if (input === id) return true;
                if (await idEsUnico(input)) return true;
                return 'El ID introducido ya está en uso. Por favor, introduce un ID único.';
            }
        },
        { name: 'nombre', type: 'input', message: 'Nuevo nombre del cliente:', default: cliente.nombre },
        {
            name: 'contacto',
            type: 'input',
            message: 'Nuevo contacto del cliente:',
            default: cliente.contacto.toString(), 
            validate: (input: string) => /^\d{9}$/.test(input) ? true : 'Por favor, introduce un número válido de 9 dígitos.',
            filter: (input: string) => parseInt(input, 10) 
        },
        { name: 'direccion', type: 'input', message: 'Nueva dirección del cliente:', default: cliente.direccion }
    ];

    const respuestas = await inquirer.prompt(preguntas);

    // Actualizar el cliente con las nuevas respuestas
    Object.assign(cliente, respuestas);

    await db.write();
    console.log(`Cliente con ID ${id} modificado correctamente.`);
    gestionarClientes();
}


export { listarClientes, añadirCliente, eliminarCliente, modificarClientePorId };

