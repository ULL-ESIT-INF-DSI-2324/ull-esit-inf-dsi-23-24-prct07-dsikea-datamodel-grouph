import inquirer from "inquirer";
import { Armario } from "../../Muebles/Armario.js";
import { addMueble } from "../db.js";
import { opcionesSiguientes } from "../db_muebles/muebles_db.js";

async function añadirArmario() {
    const respuestas = await inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'ID del armario:',
        },
        {
            type: 'input',
            name: 'nombre',
            message: 'Nombre del armario:',
        },
        {
            type: 'input',
            name: 'descripcion',
            message: 'Descripción del armario:',
        },
        {
            type: 'input',
            name: 'material',
            message: 'Material del armario:',
        },
        {
            type: 'input',
            name: 'ancho',
            message: 'Ancho del armario (cm):',
            validate: input => !isNaN(parseFloat(input)) || 'Por favor, introduce un número',
        },
        {
            type: 'input',
            name: 'alto',
            message: 'Alto del armario (cm):',
            validate: input => !isNaN(parseFloat(input)) || 'Por favor, introduce un número',
        },
        {
            type: 'input',
            name: 'largo',
            message: 'Largo del armario (cm):',
            validate: input => !isNaN(parseFloat(input)) || 'Por favor, introduce un número',
        },
        {
            type: 'input',
            name: 'precio',
            message: 'Precio del armario:',
            validate: input => !isNaN(parseFloat(input)) || 'Por favor, introduce un número',
        },
        {
            type: 'input',
            name: 'puertas',
            message: 'Número de puertas del armario:',
            validate: input => !isNaN(parseFloat(input)) || 'Por favor, introduce un número',
        },
        {
            type: 'confirm',
            name: 'cajones',
            message: '¿Tiene cajones el armario?',
            default: false,
        },
    ]);

    const armario = new Armario(
        parseInt(respuestas.id),
        respuestas.nombre,
        respuestas.descripcion,
        respuestas.material,
        {
            ancho: parseFloat(respuestas.ancho),
            alto: parseFloat(respuestas.alto),
            largo: parseFloat(respuestas.largo),
        },
        parseFloat(respuestas.precio),
        respuestas.puertas,
        respuestas.cajones
    );

    await addMueble(armario);
    console.log('Armario añadido correctamente.');
    opcionesSiguientes();
}

export { añadirArmario };