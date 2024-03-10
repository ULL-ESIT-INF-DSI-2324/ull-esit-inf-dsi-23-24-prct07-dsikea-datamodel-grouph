import inquirer from 'inquirer';
import { añadirSilla } from './addSilla.js';
import { añadirMesa } from './addMesa.js';
import { añadirArmario } from './addArmario.js';
import { getMuebles, deleteMueble } from '../db.js';
import { db } from '../db.js';
import { gestionarMuebles, mainMenu } from '../../index.js';
import { Silla } from '../../Muebles/Silla.js';
import { Mesa } from '../../Muebles/Mesa.js';
import { Armario } from '../../Muebles/Armario.js';

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

async function modificarMueblePorId() {
    await db.read();

    const { id } = await inquirer.prompt({
        type: 'number',
        name: 'id',
        message: 'Introduce el ID del mueble a modificar:',
        validate: value => !isNaN(value) && value > 0 ? true : 'Por favor, introduce un ID válido.'
    });

    const muebleIndex = db.data?.muebles.findIndex(m => m.id === id);
    if (muebleIndex === -1 || muebleIndex === undefined) {
        console.log('Mueble no encontrado.');
        return; // Salir de la función si no se encuentra el mueble
    }

    // Asegurarte de que mueble no es undefined antes de proceder
    const mueble = db.data?.muebles[muebleIndex];
    if (!mueble) {
        console.log('Error al acceder al mueble.');
        return; // Salir de la función si el mueble es undefined
    }

    const preguntasComunes = [
        {
            name: 'id',
            type: 'number',
            message: 'Nuevo ID del mueble:',
            default: mueble.id,
            validate: async (value: number) => {
                if (isNaN(value) || value <= 0) {
                    return 'Por favor, introduce un ID válido.';
                }
                const existeId = db.data?.muebles.some(m => m.id === value);
                if (existeId && value !== mueble.id) { // Asegúrate de permitir el mismo ID si el usuario no desea cambiarlo
                    return 'Este ID ya está en uso por otro mueble. Por favor, elige un ID diferente.';
                }
                return true;
            }
        },
        { name: 'nombre', type: 'input', message: 'Nuevo nombre del mueble:', default: mueble.nombre },
        { name: 'descripcion', type: 'input', message: 'Nueva descripción del mueble:', default: mueble.descripcion },
        { name: 'material', type: 'input', message: 'Nuevo material del mueble:', default: mueble.material },
        {
            name: 'ancho',
            type: 'number',
            message: 'Nuevo ancho del mueble (cm):',
            default: mueble.dimensiones.ancho,
            validate: (value: number) => !isNaN(value) && value > 0 ? true : 'Por favor, introduce un ancho válido.'
        },
        {
            name: 'alto',
            type: 'number',
            message: 'Nuevo alto del mueble (cm):',
            default: mueble.dimensiones.alto,
            validate: (value: number) => !isNaN(value) && value > 0 ? true : 'Por favor, introduce un alto válido.'
        },
        {
            name: 'largo',
            type: 'number',
            message: 'Nuevo largo del mueble (cm):',
            default: mueble.dimensiones.largo,
            validate: (value: number) => !isNaN(value) && value > 0 ? true : 'Por favor, introduce un largo válido.'
        },
        {
            name: 'precio', 
            type: 'number', 
            message: 'Nuevo precio del mueble:', 
            default: mueble.precio, 
            validate: (value: number) => !isNaN(value) && value > 0 ? true : 'Introduce un precio válido.'
        }
    ];

    const preguntasEspecificas = [];
    if ('inclinable' in (mueble as Silla)) {
        // Es probablemente una Silla
        preguntasEspecificas.push(
            { name: 'inclinable', type: 'confirm', message: '¿Es inclinable?', default: (mueble as Silla).inclinable },
            { name: 'reposabrazos', type: 'confirm', message: '¿Tiene reposabrazos?', default: (mueble as Silla).reposabrazos }
        );
    } else if ('forma' in (mueble as Mesa)) {
        // Es probablemente una Mesa
        preguntasEspecificas.push(
            { name: 'forma', type: 'input', message: 'Forma:', default: (mueble as Mesa).forma },
            { name: 'plegable', type: 'confirm', message: '¿Es plegable?', default: (mueble as Mesa).plegable }
        );
    } else if ('numeroPuertas' in (mueble as Armario)) {
        // Es probablemente un Armario
        preguntasEspecificas.push(
            { name: 'numeroPuertas', type: 'number', message: 'Número de puertas:', default: (mueble as Armario).numeroPuertas, filter: Number },
            { name: 'tieneCajones', type: 'confirm', message: '¿Tiene cajones?', default: (mueble as Armario).tieneCajones }
        );
    }

    // Realizar las preguntas comunes y específicas
    const respuestasComunes = await inquirer.prompt(preguntasComunes);
    const respuestasEspecificas = await inquirer.prompt(preguntasEspecificas);

    // Antes de llamar a Object.assign(), construye el objeto dimensiones correctamente
    if (respuestasComunes.ancho !== undefined && respuestasComunes.alto !== undefined && respuestasComunes.largo !== undefined) {
        mueble.dimensiones = {
            ancho: respuestasComunes.ancho,
            alto: respuestasComunes.alto,
            largo: respuestasComunes.largo
        };
        // Elimina las propiedades individuales de dimensiones de respuestasComunes para evitar añadirlas al nivel superior
        delete respuestasComunes.ancho;
        delete respuestasComunes.alto;
        delete respuestasComunes.largo;
    }

    // Combinar respuestas comunes y específicas para actualizar el mueble
    Object.assign(mueble, respuestasComunes, respuestasEspecificas);

    await db.write();
    console.log(`Mueble con ID ${id} modificado correctamente.`);
    gestionarMuebles();
}


export { listarMuebles, añadirMueble, eliminarMueble, opcionesSiguientes, modificarMueblePorId };