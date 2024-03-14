import inquirer from "inquirer";
import { Mesa } from "../../Muebles/Mesa.js";
import { addMesa, idEsUnico } from "../db.js";
import { opcionesSiguientes } from "../db_muebles/muebles_db.js";

async function añadirMesa() {
    const respuestas = await inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'ID de la mesa:',
        },
        {
            type: 'input',
            name: 'nombre',
            message: 'Nombre de la mesa:',
        },
        {
            type: 'input',
            name: 'descripcion',
            message: 'Descripción de la mesa:',
        },
        {
            type: 'input',
            name: 'material',
            message: 'Material de la mesa:',
        },
        {
            type: 'input',
            name: 'ancho',
            message: 'Ancho de la mesa (cm):',
            validate: input => !isNaN(parseFloat(input)) || 'Por favor, introduce un número',
        },
        {
            type: 'input',
            name: 'alto',
            message: 'Alto de la mesa (cm):',
            validate: input => !isNaN(parseFloat(input)) || 'Por favor, introduce un número',
        },
        {
            type: 'input',
            name: 'largo',
            message: 'Largo de la mesa (cm):',
            validate: input => !isNaN(parseFloat(input)) || 'Por favor, introduce un número',
        },
        {
            type: 'input',
            name: 'precio',
            message: 'Precio de la mesa:',
            validate: input => !isNaN(parseFloat(input)) || 'Por favor, introduce un número',
        },
        {
            type: 'input',
            name: 'forma',
            message: 'Forma de la mesa:',
        },
        {
            type: 'confirm',
            name: 'plegable',
            message: '¿Es plegable la mesa?',
            default: false,
        }
    ]);

    const id = parseInt(respuestas.id);
    const esUnico = await idEsUnico(id);

    if (!esUnico) {
        console.log('El ID introducido ya está en uso. Por favor, introduce un ID único.');
        await añadirMesa();
        return;
    }

    const mesaNueva = new Mesa(
        id,
        respuestas.nombre,
        respuestas.descripcion,
        respuestas.material,
        {
            ancho: parseFloat(respuestas.ancho),
            alto: parseFloat(respuestas.alto),
            largo: parseFloat(respuestas.largo),
        },
        parseFloat(respuestas.precio),
        respuestas.forma,
        respuestas.plegable
    );

    await addMesa(mesaNueva);
    console.log('Mesa añadida correctamente');
    await opcionesSiguientes();
}

export { añadirMesa };