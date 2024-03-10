import inquirer from 'inquirer';
import { añadirSilla } from './addSilla.js';
import { añadirMesa } from './addMesa.js';
import { añadirArmario } from './addArmario.js';
import { getMuebles, deleteMueble } from '../db.js';
import { gestionarMuebles, mainMenu } from '../../index.js';

async function listarMuebles() {
    const muebles = await getMuebles();
    
    if (muebles.length === 0) {
        console.log('No hay muebles registrados.');
        return;
    }
    
    // Preparando los datos para mostrar en formato de tabla
    const mueblesParaMostrar = muebles.map((mueble) => ({
        ID: mueble.id,
        Nombre: mueble.nombre,
        Descripción: mueble.descripcion,
        Material: mueble.material,
        Dimensiones: `A: ${mueble.dimensiones.ancho} cm, Al: ${mueble.dimensiones.alto} cm, L: ${mueble.dimensiones.largo} cm`,
        Precio: `${mueble.precio} €`
    }));
    
    console.log('Lista de Muebles:');
    console.table(mueblesParaMostrar);
    
    // Vuelve al menú anterior después de mostrar los muebles
    gestionarMuebles();
}

async function añadirMueble() {
    const respuesta = await inquirer.prompt([
        {
            type: 'list',
            name: 'tipo',
            message: '¿Qué tipo de mueble desea añadir?',
            choices: [
                { name: 'Silla', value: 'silla' },
                { name: 'Mesa', value: 'mesa' },
                { name: 'Armario', value: 'armario' },
            ],
        },
    ]);

    switch (respuesta.tipo) {
        case 'silla':
            await añadirSilla(); // Esta función inicia el proceso de añadir una silla.
            break;
        case 'mesa':
            await añadirMesa(); // Esta función inicia el proceso de añadir una mesa.
            break;
        case 'armario':
            await añadirArmario(); // Esta función inicia el proceso de añadir un armario.
            break;
    }
}

async function eliminarMueble() {
    const respuesta = await inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'Introduce el ID del mueble a eliminar:',
            validate: function(value) {
                const valid = !isNaN(parseFloat(value));
                return valid || 'Por favor, introduce un número';
            },
            filter: Number
        }
    ]);

    await deleteMueble(respuesta.id);
    console.log(`Mueble con ID = ${respuesta.id} eliminado correctamente.`);
    gestionarMuebles();
}

async function opcionesSiguientes() {
    const respuesta = await inquirer.prompt([
        {
            type: 'list',
            name: 'siguiente',
            message: '¿Qué te gustaría hacer ahora?',
            choices: [
                { name: 'Añadir otro mueble', value: 'añadirOtro' },
                { name: 'Gestionar muebles (añadir, eliminar, modificar otro mueble)', value: 'gestionarMuebles' },
                { name: 'Volver al menú principal', value: 'menuPrincipal' },
                { name: 'Salir', value: 'salir' },
            ],
        },
    ]);

    switch (respuesta.siguiente) {
        case 'añadirOtro':
            await añadirMueble(); // Esta función inicia el proceso de añadir un mueble nuevamente.
            break;
        case 'gestionarMuebles':
            await gestionarMuebles(); // Lleva al usuario al menú específico para gestionar muebles.
            break;
        case 'menuPrincipal':
            await mainMenu(); // Lleva al usuario de vuelta al menú principal de la aplicación.
            break;
        case 'salir':
            console.log('Gracias por usar la aplicación. ¡Hasta la próxima!');
            process.exit(); // Cierra la aplicación
    }
}

export { listarMuebles, añadirMueble, eliminarMueble, opcionesSiguientes };