import inquirer from "inquirer";
import { Silla } from "../../Muebles/Silla.js";
import { addMueble } from "../db.js";
import { opcionesSiguientes } from "../db_muebles/muebles_db.js";

async function añadirSilla() {
    const respuestas = await inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'ID de la silla:',
        },
        {
            type: 'input',
            name: 'nombre',
            message: 'Nombre de la silla:',
        },
        {
            type: 'input',
            name: 'descripcion',
            message: 'Descripción de la silla:',
        },
        {
            type: 'input',
            name: 'material',
            message: 'Material de la silla:',
        },
        {
            type: 'input',
            name: 'ancho',
            message: 'Ancho de la silla (cm):',
            validate: input => !isNaN(parseFloat(input)) || 'Por favor, introduce un número',
        },
        {
            type: 'input',
            name: 'alto',
            message: 'Alto de la silla (cm):',
            validate: input => !isNaN(parseFloat(input)) || 'Por favor, introduce un número',
        },
        {
            type: 'input',
            name: 'largo',
            message: 'Largo de la silla (cm):',
            validate: input => !isNaN(parseFloat(input)) || 'Por favor, introduce un número',
        },
        {
            type: 'input',
            name: 'precio',
            message: 'Precio de la silla:',
            validate: input => !isNaN(parseFloat(input)) || 'Por favor, introduce un número',
        },
        {
            type: 'confirm',
            name: 'inclinable',
            message: '¿Es inclinable la silla?',
            default: false,
        },
        {
            type: 'confirm',
            name: 'reposabrazos',
            message: '¿Tiene reposabrazos la silla?',
            default: false,
        }
    ]);

    const sillaNueva = new Silla(
        parseInt(respuestas.id), 
        respuestas.nombre, 
        respuestas.descripcion,
        respuestas.material,
        {
            ancho: parseFloat(respuestas.ancho),
            alto: parseFloat(respuestas.alto),
            largo: parseFloat(respuestas.largo)
        },
        parseFloat(respuestas.precio),
        respuestas.inclinable,
        respuestas.reposabrazos
    );

    await addMueble(sillaNueva); // Asegúrate de que esta función maneje correctamente las instancias de las clases
    console.log('Silla añadida correctamente.');
    await opcionesSiguientes();
}

export { añadirSilla };