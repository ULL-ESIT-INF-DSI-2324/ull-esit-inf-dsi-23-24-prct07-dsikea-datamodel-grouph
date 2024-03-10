import inquirer from 'inquirer';
import { Proveedor } from '../../Entidades/Proveedores.js';
import { addProveedor, getProveedores, deleteProveedor, idEsUnico } from "../db.js";
import { gestionarProveedores } from "../../index.js";

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

export { listarProveedores, añadirProveedor, eliminarProveedor };