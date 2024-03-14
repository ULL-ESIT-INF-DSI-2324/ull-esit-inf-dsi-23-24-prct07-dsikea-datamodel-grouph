import inquirer from 'inquirer';
import { initializeDb } from './BaseDeDatos/db.js';

import { listarMuebles, añadirMueble, eliminarMueble, modificarMueblePorId,buscarMueble } from './BaseDeDatos/db_muebles/muebles_db.js';
import { listarProveedores, añadirProveedor, eliminarProveedor, modificarProveedorPorId } from './BaseDeDatos/db_proveedores/proveedores_db.js';
import { listarClientes, añadirCliente, eliminarCliente, modificarClientePorId } from './BaseDeDatos/db_clientes/clientes_db.js';



async function init() {
    await initializeDb();
    mainMenu();
}

async function mainMenu() {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: '¿Qué acción desea realizar?',
            choices: ['Gestionar muebles', 'Gestionar proveedores', 'Gestionar clientes', 'Salir'],
        },
    ]);

    switch (answers.action) {
        case 'Gestionar muebles':
            gestionarMuebles();
            break;
        case 'Gestionar proveedores':
            gestionarProveedores();
            break;
        case 'Gestionar clientes':
            gestionarClientes();
            break;
        case 'Salir':
            console.log('Saliendo...');
            process.exit();
    }
}

async function gestionarMuebles() {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: '¿Qué acción desea realizar con los muebles?',
            choices: ['Añadir mueble', 'Eliminar mueble', 'Modificar mueble', 'Listar muebles','Buscar muebles', 'Volver'],

        },
    ]);

    switch (answers.action) {
        case 'Añadir mueble':
            await añadirMueble();
            break;
        case 'Eliminar mueble':
            await eliminarMueble();
            break; 
        case 'Listar muebles':
            await listarMuebles();
            break;
        case 'Modificar mueble':
            await modificarMueblePorId();
        
            break;
        case 'Buscar muebles':
            await buscarMueble();
            break;
            
        case 'Volver':
            mainMenu();
            break;
    }
}

async function gestionarProveedores() {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: '¿Qué acción desea realizar con los proveedores?',
            choices: ['Añadir proveedor', 'Eliminar proveedor', 'Modificar proveedor','Listar proveedores', 'Volver'],
        },
    ]);

    switch (answers.action) {
        case 'Añadir proveedor':
            await añadirProveedor();
            break;
        case 'Eliminar proveedor':
            await eliminarProveedor();
            break;
        case 'Modificar proveedor':
            await modificarProveedorPorId();
            break;
        case 'Listar proveedores':
            await listarProveedores();
            break;
        case 'Volver':
            mainMenu();
            break;
    }
}

async function gestionarClientes() {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: '¿Qué acción desea realizar con los clientes?',
            choices: ['Añadir cliente', 'Eliminar cliente', 'Modificar cliente', 'Listar clientes', 'Volver'],
        },
    ]);

    switch (answers.action) {
        case 'Añadir cliente':
            await añadirCliente();
            break;
        case 'Eliminar cliente':
            await eliminarCliente();
            break;
        case 'Modificar cliente':
            await modificarClientePorId();
            break;
        case 'Listar clientes':
            await listarClientes();
            break;
        case 'Volver':
            mainMenu();
            break;
    }
}

export {gestionarMuebles, gestionarProveedores, gestionarClientes, mainMenu};
init();