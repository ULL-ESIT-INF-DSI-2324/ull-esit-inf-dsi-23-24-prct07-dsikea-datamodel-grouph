import inquirer from 'inquirer';
import { añadirSilla } from './addSilla.js';
import { añadirMesa } from './addMesa.js';
import { añadirArmario } from './addArmario.js';
import { getArmario,getMesa,getSilla, deleteSilla,deleteArmario,deleteMesa,idEsUnico, modifyArmario, modifyMesa, modifySilla } from '../db.js';
import { db } from '../db.js';
import { gestionarMuebles, mainMenu } from '../../index.js';
import { Silla } from '../../Muebles/Silla.js';
import { Mesa } from '../../Muebles/Mesa.js';
import { Armario } from '../../Muebles/Armario.js';
import { searchSilla } from './searchSilla.js';
import { searchMesa } from './searchMesa.js';
import { searchArmario } from './searchArmario.js';


async function listarMuebles() {
    const armarios = await getArmario();
    const mesas = await getMesa();
    const sillas = await getSilla()
    if (armarios.length === 0) {
        console.log('No hay armarios registrados.');
        return;
    }
    if (sillas.length === 0) {
        console.log('No hay sillas registrados.');
        return;
    }    
    if (mesas.length === 0) {
        console.log('No hay mesas registrados.');
        return;
    }       
    // Preparando los datos para mostrar en formato de tabla
    const mueblesParaMostrar = armarios.map((mueble) => ({
        ID: mueble.id,
        Nombre: mueble.nombre,
        Descripción: mueble.descripcion,
        Material: mueble.material,
        Dimensiones: `A: ${mueble.dimensiones.ancho} cm, Al: ${mueble.dimensiones.alto} cm, L: ${mueble.dimensiones.largo} cm`,
        Precio: `${mueble.precio} €`
    }));
    const mueblesParaMostrar1 = sillas.map((mueble) => ({
        ID: mueble.id,
        Nombre: mueble.nombre,
        Descripción: mueble.descripcion,
        Material: mueble.material,
        Dimensiones: `A: ${mueble.dimensiones.ancho} cm, Al: ${mueble.dimensiones.alto} cm, L: ${mueble.dimensiones.largo} cm`,
        Precio: `${mueble.precio} €`
    }));    
    const mueblesParaMostrar2 = mesas.map((mueble) => ({
        ID: mueble.id,
        Nombre: mueble.nombre,
        Descripción: mueble.descripcion,
        Material: mueble.material,
        Dimensiones: `A: ${mueble.dimensiones.ancho} cm, Al: ${mueble.dimensiones.alto} cm, L: ${mueble.dimensiones.largo} cm`,
        Precio: `${mueble.precio} €`
    }));
    console.log('Lista de Armarios:');
    console.table(mueblesParaMostrar);
    console.log('Lista de Sillas:');
    console.table(mueblesParaMostrar1);
    console.log('Lista de Mesas:')
    console.table(mueblesParaMostrar2)
    
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
    if((await getArmario()).find((x) =>x.id === respuesta.id))
       deleteArmario(respuesta.id);
    if((await getMesa()).find((x) =>x.id === respuesta.id))
       deleteMesa(respuesta.id);
    if(((await getSilla()).find((x) =>x.id === respuesta.id)))
       deleteSilla(respuesta.id);
    console.log(`Mueble con ID = ${respuesta.id} eliminado correctamente.`);
    gestionarMuebles();
}

async function buscarMueble() {
    const respuesta = await inquirer.prompt([
        {
        type: 'list',
        name: 'tipo',
        message: '¿Qué tipo de mueble desea buscar?',
        choices: [
            { name: 'Silla', value: 'silla' },
            { name: 'Mesa', value: 'mesa' },
            { name: 'Armario', value: 'armario' },]
        }
    ])
    switch(respuesta.tipo)
    {
        case 'silla':
            await searchSilla();
        case 'mesa':
            await searchMesa();
        case 'armario':
           await searchArmario();
    }
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

    const armarioIndex = db.data?.armarios.findIndex(m => m.id === id);
    const mesaIndex = db.data?.mesas.findIndex(m => m.id === id);
    const sillaIndex = db.data?.sillas.findIndex(m => m.id === id);
    let index:number = 0;
    let mueble_temp:Armario | Silla | Mesa | undefined;
    if ((mesaIndex === -1 || mesaIndex === undefined )) {
        if((sillaIndex === -1 || sillaIndex === undefined )){
          if((armarioIndex === -1 || armarioIndex === undefined )){
            console.log('Mueble no encontrado.');
            return; // Salir de la función si no se encuentra el mueble
          }
          else
            mueble_temp= db.data?.armarios[armarioIndex];
        }else
        mueble_temp=db.data?.sillas[sillaIndex];
    }else
    mueble_temp=db.data?.mesas[mesaIndex];
    // Asegurarte de que mueble no es undefined antes de proceder
    const mueble = mueble_temp as Armario | Silla | Mesa;
    console.log(mueble)
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
                const existeId = !(await idEsUnico(value));
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
    console.log(mueble.constructor.name)
    if('forma' in mueble)
    {
        Object.assign(mueble, respuestasComunes, respuestasEspecificas);
         modifyMesa(mueble,id)
    }
    if('numeroPuertas' in mueble)
    {
        Object.assign(mueble, respuestasComunes, respuestasEspecificas);
         modifyArmario(mueble,id)
    } 
    if('inclinable' in mueble)
    {
        Object.assign(mueble, respuestasComunes, respuestasEspecificas);
         modifySilla(mueble,id)        
    }
   // await db.write();
    console.log(`Mueble con ID ${id} modificado correctamente.`);
    gestionarMuebles();
}


export { listarMuebles, añadirMueble, eliminarMueble, opcionesSiguientes, modificarMueblePorId,buscarMueble
 };


