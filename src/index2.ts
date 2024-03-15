import inquirer from "inquirer";
import { Stock } from "./BaseDeDatos/Stock.js"

const stock = new Stock();

async function init() {
    mainMenu();
}

async function mainMenu() {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: '¿Qué acción desea realizar?',
            choices: ['Gestionar muebles', 'Gestionar proveedores', 'Gestionar clientes', 'Gestionar transacciones', 'Salir'],
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
        case 'Gestionar transacciones':
            gestionarTransacciones();
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
            await stock.añadirMueble();
            break;
        case 'Eliminar mueble':
            await stock.eliminarMueble();
            break; 
        case 'Listar muebles':
            await stock.listarMuebles();
            break;
        case 'Modificar mueble':
            await stock.modificarMueblePorId();
            break;
        case 'Buscar muebles':
            await stock.buscarMueble();
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
            choices: ['Añadir proveedor', 'Eliminar proveedor', 'Modificar proveedor','Listar proveedores','Buscar proveedores' ,'Volver'],
        },
    ]);

    switch (answers.action) {
        case 'Añadir proveedor':
            await stock.añadirProveedor();
            break;
        case 'Eliminar proveedor':
            await stock.eliminarProveedor();
            break;
        case 'Modificar proveedor':
            await stock.modificarProveedorPorID();
            break;
        case 'Listar proveedores':
            await stock.listarProveedores();
            break;
        case 'Buscar proveedores':
            await stock.searchProveedores();
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
            choices: ['Añadir cliente', 'Eliminar cliente', 'Modificar cliente', 'Listar clientes','Buscar clientes', 'Volver'],
        },
    ]);

    switch (answers.action) {
        case 'Añadir cliente':
            await stock.añadirCliente();
            break;
        case 'Eliminar cliente':
            await stock.eliminarCliente();
            break;
        case 'Modificar cliente':
            await stock.modificarClientePorId();
            break;
        case 'Listar clientes':
            await stock.listarClientes();
            break;
        case 'Buscar clientes':
            await stock.searchClientes();
            break;
        case 'Volver':
            mainMenu();
            break;
    }
}

async function gestionarTransacciones() {
    const answers = await inquirer.prompt({
            type: 'list',
            name: 'choice',
            message: 'Seleccione una opción',
            choices: ['Generar venta', 'Generar compra', 'Generar devolución hecha por cliente', 'Generar devolución a proveedor', 'Volver'],
        });

    switch (answers.choice) {
        case 'Generar venta':
            await stock.realizarVenta();
            await gestionarTransacciones();
            break;
        case 'Generar compra':
            await stock.realizarCompra();
            await gestionarTransacciones();
            break;
        case 'Generar devolución hecha por cliente':
            await stock.realizarDevolucionCliente();
            await gestionarTransacciones();
            break;
        case 'Generar devolución a proveedor':
            await stock.realizarDevolucionProveedor();
            await gestionarTransacciones();
            break;
        case 'Volver':
            mainMenu();
            break;
    }
}

export {gestionarMuebles, gestionarProveedores, gestionarClientes, mainMenu, gestionarTransacciones};
init();
