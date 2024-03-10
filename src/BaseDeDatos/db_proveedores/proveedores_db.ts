import inquirer from 'inquirer';
import { Proveedor } from '../../Entidades/Proveedores.js';
import { addProveedor, getProveedores, deleteProveedor, idEsUnico } from "../db.js";
import { gestionarProveedores } from "../../index.js";
import { db } from '../db.js';

async function listarProveedores() {
    const proveedores = await getProveedores();
    
    if (proveedores.length === 0) {
        console.log('No hay proveedores registrados.');
        return;
    }
    
    // Preparando los datos para mostrar en formato de tabla
    const proveedoresParaMostrar = proveedores.map((proveedor) => ({
        ID: proveedor.id,
        Nombre: proveedor.nombre,
        Teléfono: proveedor.contacto,
        Dirección: proveedor.direccion
    }));
    
    console.log('Lista de Proveedores:');
    console.table(proveedoresParaMostrar);
    
    // Vuelve al menú anterior después de mostrar los proveedores
    gestionarProveedores();
}

async function añadirProveedor() {
    const respuestas = await inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'ID del proveedor:',
            validate: input => !isNaN(parseInt(input)) || 'Por favor, introduce un número',
        },
        {
            type: 'input',
            name: 'nombre',
            message: 'Nombre del proveedor:',
        },
        {
            type: 'input',
            name: 'contacto',
            message: 'Teléfono del proveedor:',
            validate: input => !isNaN(parseInt(input)) || 'Por favor, introduce un número',
        },
        {
            type: 'input',
            name: 'direccion',
            message: 'Dirección del proveedor:',
        },
    ]);

    const id = parseInt(respuestas.id);
    const esUnico = await idEsUnico(id);

    if (!esUnico) {
        console.log('El ID introducido ya está en uso. Por favor, introduce un ID único.');
        await añadirProveedor();
        return;
    }

    const nuevoProveedor = new Proveedor(
        id,
        respuestas.nombre,
        parseInt(respuestas.contacto),
        respuestas.direccion
    );
    await addProveedor(nuevoProveedor);
    console.log('Proveedor añadido correctamente.');
    gestionarProveedores();
}

async function eliminarProveedor() {
    const respuesta = await inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'ID del proveedor a eliminar:',
            validate: function(value) {
                const valid = !isNaN(parseFloat(value));
                return valid || 'Por favor, introduce un número';
            },
            filter: Number
        },
    ]);

    await deleteProveedor(respuesta.id);
    console.log(`Proveedor con ID = ${respuesta.id} eliminado correctamente.`);
    gestionarProveedores();
}

async function modificarProveedorPorId() {
    await db.read();

    const { id } = await inquirer.prompt({
        type: 'number',
        name: 'id',
        message: 'Introduce el ID del proveedor a modificar:',
        validate: value => !isNaN(value) && value > 0 ? true : 'Por favor, introduce un ID válido.'
    });

    const proveedorIndex = db.data?.proveedores.findIndex(p => p.id === id);
    if (proveedorIndex === -1 || proveedorIndex === undefined) {
        console.log('Proveedor no encontrado.');
        return;
    }

    const proveedor = db.data?.proveedores[proveedorIndex];
    if (!proveedor) {
        console.log('Proveedor no encontrado.');
        return;
    }

    const preguntas = [
        { 
            name: 'id',
            type: 'number',
            message: 'Nuevo ID del proveedor:',
            default: proveedor.id,
            validate: async (value: number) => {
                if (isNaN(value) || value <= 0) {
                    return 'Por favor, introduce un ID válido.';
                }
                const existeId = db.data?.proveedores.some(p => p.id === value);
                if (existeId && value !== proveedor.id) { // Asegúrate de permitir el mismo ID si el usuario no desea cambiarlo
                    return 'Este ID ya está en uso por otro proveedor. Por favor, elige un ID diferente.';
                }
                return true;
            }
        },
        { name: 'nombre', type: 'input', message: 'Nuevo nombre del proveedor:', default: proveedor.nombre },
        {
            name: 'contacto',
            type: 'input',
            message: 'Nuevo contacto del proveedor:',
            default: proveedor.contacto.toString(), 
            validate: (input: string) => /^\d{9}$/.test(input) ? true : 'Por favor, introduce un número válido de 9 dígitos.',
            filter: (input: string) => parseInt(input, 10)
        },
        { name: 'direccion', type: 'input', message: 'Nueva dirección del proveedor:', default: proveedor.direccion }
    ];

    const respuestas = await inquirer.prompt(preguntas);

    // Actualizar el proveedor con las nuevas respuestas
    Object.assign(proveedor, respuestas);

    await db.write();
    console.log(`Proveedor con ID ${id} modificado correctamente.`);
    gestionarProveedores();
}

export { listarProveedores, añadirProveedor, eliminarProveedor, modificarProveedorPorId };