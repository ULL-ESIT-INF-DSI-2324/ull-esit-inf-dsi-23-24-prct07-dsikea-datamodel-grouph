import inquirer from 'inquirer';
import { initializeDb, getMuebles } from './BaseDeDatos/db.js';
//import { Mueble } from './abstract_classes/Mueble.js';

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
            // Llamada a función para gestionar proveedores
            break;
        case 'Gestionar clientes':
            // Llamada a función para gestionar clientes
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
            choices: ['Añadir mueble', 'Eliminar mueble', 'Listar muebles', 'Volver'],
        },
    ]);

    switch (answers.action) {
        case 'Añadir mueble':
            //await anadirMueble();
            break;
        case 'Eliminar mueble':
            // Implementa la función para eliminar mueble
            break;
        case 'Listar muebles':
            await listarMuebles();
            break;
        case 'Volver':
            mainMenu();
            break;
    }
}

async function listarMuebles() {
    const muebles = await getMuebles();
    
    if (muebles.length === 0) {
        console.log('No hay muebles registrados.');
        return;
    }
    
    console.log('Lista de Muebles:');
    muebles.forEach((mueble, index) => {
        console.log(`${index + 1}. Nombre: ${mueble.nombre}, Descripción: ${mueble.descripcion}, Material: ${mueble.material} ,Precio: ${mueble.precio}`);
    });
    
    // Vuelve al menú anterior después de mostrar los muebles
    gestionarMuebles();
}

init();