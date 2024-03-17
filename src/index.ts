import { Stock } from "./BaseDeDatos/Stock.js"
import inquirer from "inquirer";

async function mainMenu(stock:Stock) {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: '¿Qué acción desea realizar?',
            choices: ['Gestionar muebles', 'Gestionar proveedores', 'Gestionar clientes', 'Gestionar transacciones', 'Generar informes','Salir'],
        },
    ]);

    switch (answers.action) {
        case 'Gestionar muebles':
            gestionarMuebles(stock);
            break;
        case 'Gestionar proveedores':
            gestionarProveedores(stock);
            break;
        case 'Gestionar clientes':
            gestionarClientes(stock);
            break;
        case 'Gestionar transacciones':
            gestionarTransacciones(stock);
            break;
        case 'Generar informes':
            generarInformes(stock);
            break;
        case 'Salir':
            console.log('Saliendo...');
            process.exit();
    }
}

async function gestionarMuebles(stock:Stock) {
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
            await stock.opcionesSiguientes();
            break;
        case 'Eliminar mueble':
            await stock.eliminarMueble();
            await gestionarMuebles(stock);
            break; 
        case 'Listar muebles':
            await stock.listarMuebles();
            await gestionarMuebles(stock);
            break;
        case 'Modificar mueble':
            await stock.modificarMueblePorId();
            await gestionarMuebles(stock);
            break;
        case 'Buscar muebles':
            await stock.buscarMueble();
            break;
        case 'Volver':
            mainMenu(stock);
            break;
    }
}

async function gestionarProveedores(stock:Stock) {
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
            await gestionarProveedores(stock);
            break;
        case 'Eliminar proveedor':
            await stock.eliminarProveedor();
            await gestionarProveedores(stock);
            break;
        case 'Modificar proveedor':
            await stock.modificarProveedorPorID();
            await gestionarProveedores(stock);
            break;
        case 'Listar proveedores':
            await stock.listarProveedores();
            await gestionarProveedores(stock);
            break;
        case 'Buscar proveedores':
            await stock.searchProveedores();
            break;
        case 'Volver':
            mainMenu(stock);
            break;
    }
}

async function gestionarClientes(stock:Stock) {
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
            await gestionarClientes(stock);
            break;
        case 'Eliminar cliente':
            await stock.eliminarCliente();
            await gestionarClientes(stock);
            break;
        case 'Modificar cliente':
            await stock.modificarClientePorId();
            await gestionarClientes(stock);
            break;
        case 'Listar clientes':
            await stock.listarClientes();
            await gestionarClientes(stock)
            break;
        case 'Buscar clientes':
            await stock.searchClientes();
            break;
        case 'Volver':
            mainMenu(stock);
            break;
    }
}

async function gestionarTransacciones(stock:Stock) {
    const answers = await inquirer.prompt({
            type: 'list',
            name: 'choice',
            message: 'Seleccione una opción',
            choices: ['Generar venta', 'Generar compra', 'Generar devolución hecha por cliente', 'Generar devolución a proveedor', 'Volver'],
        });

    switch (answers.choice) {
        case 'Generar venta':
            await stock.realizarVenta();
            await gestionarTransacciones(stock);
            break;
        case 'Generar compra':
            await stock.realizarCompra();
            await gestionarTransacciones(stock);
            break;
        case 'Generar devolución hecha por cliente':
            await stock.realizarDevolucionCliente();
            await gestionarTransacciones(stock);
            break;
        case 'Generar devolución a proveedor':
            await stock.realizarDevolucionProveedor();
            await gestionarTransacciones(stock);
            break;
        case 'Volver':
            mainMenu(stock);
            break;
    }
}

async function generarInformes(stock:Stock) {
    const answers = await inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: '¿Sobre qué desea generar un informe?',
        choices: ['Stock de muebles', 'Muebles más vendidos', 'Facturación por ventas en un periodo de tiempo', 'Gastos por compras en un periodo de tiempo', 'Histórico de ventas/compras', 'Volver'],
    });

    switch (answers.choice) {
        case 'Stock de muebles':
            await stock.mostrarStockDisponible();
            await generarInformes(stock);
            break;
        case 'Muebles más vendidos':
            await stock.mueblesMasVendidos();
            await generarInformes(stock);
            break;
        case 'Facturación por ventas en un periodo de tiempo':
            await stock.facturacionEnPeriodo();
            await generarInformes(stock);
            break;
        case 'Gastos por compras en un periodo de tiempo':
            await stock.gastosEnPeriodo();
            await generarInformes(stock);
            break;
        case 'Histórico de ventas/compras':
            await stock.historicoTransacciones();
            await generarInformes(stock);
            break;
        case 'Volver':
            mainMenu(stock);
            break;
    }

}

export {gestionarMuebles, gestionarProveedores, gestionarClientes, mainMenu, gestionarTransacciones, generarInformes};