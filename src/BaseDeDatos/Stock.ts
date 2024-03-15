import inquirer from "inquirer";
import { Low } from 'lowdb';
import { JSONFile } from "lowdb/node";
import { Silla } from "../Muebles/Silla.js";
import { Mesa } from "../Muebles/Mesa.js";
import { Armario } from "../Muebles/Armario.js";
import { Cliente } from "../Entidades/Clientes.js";
import { Proveedor } from "../Entidades/Proveedores.js";
import { gestionarMuebles, gestionarClientes , gestionarProveedores ,mainMenu } from '../index2.js';
import { Mueble } from "../abstract_classes/Mueble.js";

// Definición del esquema de la base de datos
interface DbSchema {
    sillas:Silla[];
    armarios:Armario[];
    mesas:Mesa[]
    proveedores: Proveedor[];
    clientes: Cliente[];
}

export class Stock {
    private db: Low<DbSchema>;

    constructor() {
        const adapter = new JSONFile<DbSchema>('db2.json');
        this.db = new Low(adapter);
        this.initializeDb();
    }

    private async initializeDb() {
        await this.db.read();
        this.db.data ||= { sillas: [], mesas: [], armarios: [], proveedores: [], clientes: [] };
        await this.db.write();
    }

    private async idEsUnico(id: number) {
        await this.db.read(); 
        return !(this.db.data?.armarios.some(mueble => mueble.id === id) || this.db.data?.sillas.some(mueble => mueble.id === id) || this.db.data?.mesas.some(mueble => mueble.id === id));
    }

    private async addArmario(mueble: Armario) {
        this.db.data?.armarios.push(mueble);
        await this.db.write();
    }
    
    private async addSilla(mueble: Silla) {
        this.db.data?.sillas.push(mueble);
        await this.db.write();
    }
    
    private async addMesa(mueble: Mesa) {
        this.db.data?.mesas.push(mueble);
        await this.db.write();
    }

    private async deleteSilla(id: number) {
        if (this.db.data) {
            this.db.data.sillas = this.db.data.sillas.filter(mueble => mueble.id !== id);
            await this.db.write();
        }
    }

    private async deleteMesa(id: number) {
        if (this.db.data) {
            this.db.data.mesas = this.db.data.mesas.filter(mueble => mueble.id !== id);
            await this.db.write();
        }
    }

    private async deleteArmario(id: number) {
        if (this.db.data) {
            this.db.data.armarios = this.db.data.armarios.filter(mueble => mueble.id !== id);
            await this.db.write();
        }
    }

    private async modifyMesa(mueble: Mesa, id:number) {
        this.deleteMesa(id);
        this.addMesa(mueble);
    }

    private async modifyArmario(mueble: Armario, id:number) {
        this.deleteArmario(id);
        this.addArmario(mueble);
    }

    private async modifySilla(mueble: Silla, id:number) {
        this.deleteSilla(id);
        this.addSilla(mueble);
    }

    private async getSilla() {
        await this.db.read();
        return this.db.data?.sillas || [];
    }

    private async getMesa() {
        await this.db.read();
        return this.db.data?.mesas || [];
    }

    private async getArmario() {
        await this.db.read();
        return this.db.data?.armarios || [];
    }

    private async getClientes() {
        await this.db.read();
        return this.db.data?.clientes || [];
    }

    private async getProveedores() {
        await this.db.read();
        return this.db.data?.proveedores || [];
    }

    private async addCliente(cliente: Cliente) {
        this.db.data?.clientes.push(cliente);
        await this.db.write();
    }

    private async addProveedor(proveedor: Proveedor) {
        this.db.data?.proveedores.push(proveedor);
        await this.db.write();
    }

    private async deleteCliente(id: number) {
        if (this.db.data) {
            this.db.data.clientes = this.db.data.clientes.filter(cliente => cliente.id !== id);
            await this.db.write();
        }
    }

    private async deleteProveedor(id: number) {
        if (this.db.data) {
            this.db.data.proveedores = this.db.data.proveedores.filter(proveedor => proveedor.id !== id);
            await this.db.write();
        }
    }

    private async modifyCliente(cliente: Cliente) {
        if (this.db.data) {
            this.db.data.clientes = this.db.data.clientes.map(p => p === cliente ? cliente : p);
            await this.db.write();
        }
    }

    private async modifyProveedor(proveedor: Proveedor) {
        if (this.db.data) {
            this.db.data.proveedores = this.db.data.proveedores.map(p => p === proveedor ? proveedor : p);
            await this.db.write();
        }
    }

    public async listarMuebles() {
        const armarios = await this.getArmario();
        const sillas = await this.getSilla();
        const mesas = await this.getMesa();

        if (armarios.length === 0){
            console.log("No hay armarios registrados en la base de datos.");
            return;
        }
        if (sillas.length === 0){
            console.log("No hay sillas registradas en la base de datos.");
            return;
        }
        if (mesas.length === 0){
            console.log("No hay mesas registradas en la base de datos.");
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

    public async listarClientes() {
        const clientes = await this.getClientes();
        
        if (clientes.length === 0) {
            console.log('No hay clientes registrados en la base de datos.');
            return;
        }
        
        // Preparando los datos para mostrar en formato de tabla
        const clientesParaMostrar = clientes.map((cliente) => ({
            ID: cliente.id,
            Nombre: cliente.nombre,
            Contacto: cliente.contacto,
            Dirección: cliente.direccion
        }));
        
        console.log('Lista de Clientes:');
        console.table(clientesParaMostrar);
        
        // Vuelve al menú anterior después de mostrar los clientes
        gestionarClientes();
    }

    public async listarProveedores() {
        const proveedores = await this.getProveedores();
        
        if (proveedores.length === 0) {
            console.log('No hay proveedores registrados en la base de datos.');
            return;
        }
        
        // Preparando los datos para mostrar en formato de tabla
        const proveedoresParaMostrar = proveedores.map((proveedor) => ({
            ID: proveedor.id,
            Nombre: proveedor.nombre,
            Contacto: proveedor.contacto,
            Dirección: proveedor.direccion
        }));
        
        console.log('Lista de Proveedores:');
        console.table(proveedoresParaMostrar);
        
        // Vuelve al menú anterior después de mostrar los proveedores
        gestionarProveedores();
    }

    public async añadirSilla() {
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
    
        const id = parseInt(respuestas.id);
        const esUnico = await this.idEsUnico(id);
    
        if (!esUnico) {
            console.log('El ID introducido ya está en uso. Por favor, introduce un ID único.');
            await this.añadirSilla();
            return;
        }
    
        const sillaNueva = new Silla(
            id, 
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
    
        await this.addSilla(sillaNueva);
        console.log('Silla añadida correctamente.');
        await this.opcionesSiguientes();
    }

    public async añadirMesa() {
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
        const esUnico = await this.idEsUnico(id);
    
        if (!esUnico) {
            console.log('El ID introducido ya está en uso. Por favor, introduce un ID único.');
            await this.añadirMesa();
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
    
        await this.addMesa(mesaNueva);
        console.log('Mesa añadida correctamente');
        await this.opcionesSiguientes();
    }

    public async añadirArmario() {
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
    
        const id = parseInt(respuestas.id);
        const esUnico = await this.idEsUnico(id);
    
        if (!esUnico) {
            console.log('El ID introducido ya está en uso. Por favor, introduce un ID único.');
            await this.añadirArmario();
            return;
        }
    
        const armario = new Armario(
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
            respuestas.puertas,
            respuestas.cajones
        );
    
        await this.addArmario(armario);
        console.log('Armario añadido correctamente.');
        this.opcionesSiguientes();
    }

    public async añadirMueble() {
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
                await this.añadirSilla(); // Esta función inicia el proceso de añadir una silla.
                break;
            case 'mesa':
                await this.añadirMesa(); // Esta función inicia el proceso de añadir una mesa.
                break;
            case 'armario':
                await this.añadirArmario(); // Esta función inicia el proceso de añadir un armario.
                break;
        }
    }

    public async eliminarMueble() {
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
        if((await this.getArmario()).find((x) =>x.id === respuesta.id))
           this.deleteArmario(respuesta.id);
        if((await this.getMesa()).find((x) =>x.id === respuesta.id))
           this.deleteMesa(respuesta.id);
        if(((await this.getSilla()).find((x) =>x.id === respuesta.id)))
           this.deleteSilla(respuesta.id);
        console.log(`Mueble con ID = ${respuesta.id} eliminado correctamente.`);
        gestionarMuebles();
    }

    //public async searchSilla() {

   // }

    //public async searchMesa() {
    //}

    //public async searchArmario() {

    //}

    /*public async buscarMueble() {
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
                await this.searchSilla();
                break;
            case 'mesa':
                await this.searchMesa();
                break;
            case 'armario':
               await this.searchArmario();
                break;
        }
    }*/

    public async opcionesSiguientes() {
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
                await this.añadirMueble(); // Esta función inicia el proceso de añadir un mueble nuevamente.
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

    public async modificarMueblePorId() {
        await this.db.read();

        const { id } = await inquirer.prompt({
            type: 'number',
            name: 'id',
            message: 'Introduce el ID del mueble a modificar:',
            validate: value => !isNaN(value) && value > 0 ? true : 'Por favor, introduce un ID válido.'
        });
    
        const armarioIndex = this.db.data?.armarios.findIndex(m => m.id === id);
        const mesaIndex = this.db.data?.mesas.findIndex(m => m.id === id);
        const sillaIndex = this.db.data?.sillas.findIndex(m => m.id === id);
        //const index:number = 0;
        let mueble_temp:Armario | Silla | Mesa | undefined;
        if ((mesaIndex === -1 || mesaIndex === undefined )) {
            if((sillaIndex === -1 || sillaIndex === undefined )){
              if((armarioIndex === -1 || armarioIndex === undefined )){
                console.log('Mueble no encontrado.');
                return; // Salir de la función si no se encuentra el mueble
              }
              else
                mueble_temp = this.db.data?.armarios[armarioIndex];
            } else
            mueble_temp = this.db.data?.sillas[sillaIndex];
        } else
        mueble_temp = this.db.data?.mesas[mesaIndex];
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
                    const existeId = !(await this.idEsUnico(value));
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
             this.modifyMesa(mueble,id)
        }
        if('numeroPuertas' in mueble)
        {
            Object.assign(mueble, respuestasComunes, respuestasEspecificas);
             this.modifyArmario(mueble,id)
        } 
        if('inclinable' in mueble)
        {
            Object.assign(mueble, respuestasComunes, respuestasEspecificas);
             this.modifySilla(mueble,id)        
        }
       // await db.write();
        console.log(`Mueble con ID ${id} modificado correctamente.`);
        gestionarMuebles();
    }

    public async añadirCliente() {
        const respuestas = await inquirer.prompt([
            {
                type: 'input',
                name: 'id',
                message: 'ID del cliente:',
                validate: input => !isNaN(parseInt(input)) || 'Por favor, introduce un número',
            },
            {
                type: 'input',
                name: 'nombre',
                message: 'Nombre del cliente:',
            },
            {
                type: 'input',
                name: 'contacto',
                message: 'Teléfono del cliente:',
                validate: input => !isNaN(parseInt(input)) || 'Por favor, introduce un número',
            },
            {
                type: 'input',
                name: 'direccion',
                message: 'Dirección del cliente:',
            },
        ]);
    
        const id = parseInt(respuestas.id);
        const esUnico = await this.idEsUnico(id);
    
        if (!esUnico) {
            console.log('El ID introducido ya está en uso. Por favor, introduce un ID único.');
            await this.añadirCliente();
            return;
        }
    
        const nuevoCliente = new Cliente(
            id,
            respuestas.nombre,
            parseInt(respuestas.contacto),
            respuestas.direccion
        );
        
        await this.addCliente(nuevoCliente);
        console.log('Cliente añadido correctamente.');
        gestionarClientes();
    }

    public async eliminarCliente() {
        const respuesta = await inquirer.prompt([
            {
                type: 'input',
                name: 'id',
                message: 'Introduce el ID del cliente a eliminar:',
                validate: function(value) {
                    const valid = !isNaN(parseFloat(value));
                    return valid || 'Por favor, introduce un número';
                },
                filter: Number
            }
        ]);
    
        await this.deleteCliente(respuesta.id);
        console.log(`Cliente con ID = ${respuesta.id} eliminado correctamente.`);
        gestionarClientes();
    }

    public async modificarClientePorId() {
        await this.db.read();

        const { id } = await inquirer.prompt({
            type: 'number',
            name: 'id',
            message: 'Introduce el ID del cliente a modificar:',
            validate: value => !isNaN(value) && value > 0 ? true : 'Por favor, introduce un ID válido.'
        });
    
        const clienteIndex = this.db.data?.clientes.findIndex(c => c.id === id);
        if (clienteIndex === -1 || clienteIndex === undefined) {
            console.log('Cliente no encontrado.');
            return;
        }
    
        const cliente = this.db.data?.clientes[clienteIndex];
        if (!cliente) {
            console.log('Cliente no encontrado.');
            return;
        }
    
        const preguntas = [
            {
                name: 'id',
                type: 'number',
                message: 'Nuevo ID del cliente:',
                validate: async (input: number) => {
                    if (input === id) return true;
                    if (await this.idEsUnico(input)) return true;
                    return 'El ID introducido ya está en uso. Por favor, introduce un ID único.';
                }
            },
            { name: 'nombre', type: 'input', message: 'Nuevo nombre del cliente:', default: cliente.nombre },
            {
                name: 'contacto',
                type: 'input',
                message: 'Nuevo contacto del cliente:',
                default: cliente.contacto.toString(), 
                validate: (input: string) => /^\d{9}$/.test(input) ? true : 'Por favor, introduce un número válido de 9 dígitos.',
                filter: (input: string) => parseInt(input, 10) 
            },
            { name: 'direccion', type: 'input', message: 'Nueva dirección del cliente:', default: cliente.direccion }
        ];
    
        const respuestas = await inquirer.prompt(preguntas);
    
        // Actualizar el cliente con las nuevas respuestas
        Object.assign(cliente, respuestas);
    
        await this.db.write();
        console.log(`Cliente con ID ${id} modificado correctamente.`);
        gestionarClientes();
    }

    public async searchClientes() {
        await this.searchGenerico('clientes', ['nombre', 'contacto', 'direccion']);
    }

    public async searchProveedores() {
        await this.searchGenerico('proveedores', ['nombre', 'contacto', 'direccion']);
    }

    private async searchGenerico(tipo: 'clientes' | 'proveedores', opciones: string[]) {
        const respuestas = await inquirer.prompt([
            {
                type: 'list',
                name: 'tipo',
                message: '¿Cómo quieres buscar?',
                choices: opciones
            },
            {
                type: 'input',
                name: 'valor',
                message: 'Introduce el valor con el que quieres buscar',
            }
        ]);

        await this.db.read();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const elementos = this.db.data?.[tipo].filter((elemento: any) => {
            if (respuestas.tipo === 'contacto' && !isNaN(Number(respuestas.valor))) {
                // Si el tipo de búsqueda es por contacto, convertir a número
                return Number(elemento[respuestas.tipo]) == Number(respuestas.valor);
            }
            // Si no, buscar por inclusión de cadena de texto
            return elemento[respuestas.tipo].toLowerCase().includes(respuestas.valor.toLowerCase());
        });

        const mostrar = elementos?.map(elemento => ({
            ID: elemento.id,
            Nombre: elemento.nombre,
            Contacto: elemento.contacto,
            Dirección: elemento.direccion
        }));


        console.table(mostrar);
        
        // Deberás llamar al menú correspondiente de manera correcta dependiendo de tu implementación
        // Por ejemplo, si estás en búsqueda de clientes, regresa al menú de gestión de clientes
        if (tipo === 'clientes') {
            gestionarClientes(); // Asumiendo que existe este método en tu clase
        } else {
            gestionarProveedores(); // Asumiendo que existe este método en tu clase
        }
    }

    public async añadirProveedor() {
        const respuestas = await inquirer.prompt([
            {
                type: 'input',
                name: 'id',
                message: 'ID del proveedor:',
                validate: input => !isNaN(parseInt(input)) || 'Por favor, introduce un número',
            },
            {
                type: 'input',
                name: 'nombre',
                message: 'Nombre del proveedor:',
            },
            {
                type: 'input',
                name: 'contacto',
                message: 'Teléfono del proveedor:',
                validate: input => !isNaN(parseInt(input)) || 'Por favor, introduce un número',
            },
            {
                type: 'input',
                name: 'direccion',
                message: 'Dirección del proveedor:',
            },
        ]);
    
        const id = parseInt(respuestas.id);
        const esUnico = await this.idEsUnico(id);
    
        if (!esUnico) {
            console.log('El ID introducido ya está en uso. Por favor, introduce un ID único.');
            await this.añadirProveedor();
            return;
        }
    
        const nuevoProveedor = new Proveedor(
            id,
            respuestas.nombre,
            parseInt(respuestas.contacto),
            respuestas.direccion
        );
        await this.addProveedor(nuevoProveedor);
        console.log('Proveedor añadido correctamente.');
        gestionarProveedores();
    }

    public async eliminarProveedor() {
        const respuesta = await inquirer.prompt([
            {
                type: 'input',
                name: 'id',
                message: 'ID del proveedor a eliminar:',
                validate: function(value) {
                    const valid = !isNaN(parseFloat(value));
                    return valid || 'Por favor, introduce un número';
                },
                filter: Number
            },
        ]);
    
        await this.deleteProveedor(respuesta.id);
        console.log(`Proveedor con ID = ${respuesta.id} eliminado correctamente.`);
        gestionarProveedores();
    }

    public async modificarProveedorPorID() {
        await this.db.read();

        const { id } = await inquirer.prompt({
            type: 'number',
            name: 'id',
            message: 'Introduce el ID del proveedor a modificar:',
            validate: value => !isNaN(value) && value > 0 ? true : 'Por favor, introduce un ID válido.'
        });
    
        const proveedorIndex = this.db.data?.proveedores.findIndex(p => p.id === id);
        if (proveedorIndex === -1 || proveedorIndex === undefined) {
            console.log('Proveedor no encontrado.');
            return;
        }
    
        const proveedor = this.db.data?.proveedores[proveedorIndex];
        if (!proveedor) {
            console.log('Proveedor no encontrado.');
            return;
        }
    
        const preguntas = [
            { 
                name: 'id',
                type: 'number',
                message: 'Nuevo ID del proveedor:',
                default: proveedor.id,
                validate: async (value: number) => {
                    if (isNaN(value) || value <= 0) {
                        return 'Por favor, introduce un ID válido.';
                    }
                    const existeId = this.db.data?.proveedores.some(p => p.id === value);
                    if (existeId && value !== proveedor.id) { // Asegúrate de permitir el mismo ID si el usuario no desea cambiarlo
                        return 'Este ID ya está en uso por otro proveedor. Por favor, elige un ID diferente.';
                    }
                    return true;
                }
            },
            { name: 'nombre', type: 'input', message: 'Nuevo nombre del proveedor:', default: proveedor.nombre },
            {
                name: 'contacto',
                type: 'input',
                message: 'Nuevo contacto del proveedor:',
                default: proveedor.contacto.toString(), 
                validate: (input: string) => /^\d{9}$/.test(input) ? true : 'Por favor, introduce un número válido de 9 dígitos.',
                filter: (input: string) => parseInt(input, 10)
            },
            { name: 'direccion', type: 'input', message: 'Nueva dirección del proveedor:', default: proveedor.direccion }
        ];
    
        const respuestas = await inquirer.prompt(preguntas);
    
        // Actualizar el proveedor con las nuevas respuestas
        Object.assign(proveedor, respuestas);
    
        await this.db.write();
        console.log(`Proveedor con ID ${id} modificado correctamente.`);
        gestionarProveedores();
    }

    public async buscarMueble() {
        const respuesta = await inquirer.prompt([
            {
                type: 'list',
                name: 'tipoMueble',
                message: '¿Qué tipo de mueble deseas buscar?',
                choices: ['Silla', 'Mesa', 'Armario']
            },
            {
                type: 'list',
                name: 'criterio',
                message: '¿Por qué criterio te gustaría buscar?',
                choices: ['nombre', 'material', 'descripcion']
            },
            {
                type: 'list',
                name: 'ordenacion',
                message: '¿Cómo quieres ordenar la búsqueda?',
                choices: ['precio', 'descripcion']
            },
            {
                type: 'list',
                name: 'asc',
                message: '¿De forma ascendente o descendente?',
                choices: ['ascendente', 'descendente']
            },
            {
                type: 'input',
                name: 'clave',
                message: '¿Qué deseas filtrar?',
            }
        ]);

        let mueblesFiltrados: Mueble[] = [];
        switch (respuesta.tipoMueble) {
            case 'Silla':
                mueblesFiltrados = await this.filtrarMuebles('sillas', respuesta.criterio, respuesta.clave, respuesta.ordenacion, respuesta.asc);
                break;
            case 'Mesa':
                mueblesFiltrados = await this.filtrarMuebles('mesas', respuesta.criterio, respuesta.clave, respuesta.ordenacion, respuesta.asc);
                break;
            case 'Armario':
                mueblesFiltrados = await this.filtrarMuebles('armarios', respuesta.criterio, respuesta.clave, respuesta.ordenacion, respuesta.asc);
                break;
        }

        const mueblesMostrar = mueblesFiltrados.map((mueble) => ({
            ID: mueble.id,
            Nombre: mueble.nombre,
            Descripción: mueble.descripcion,
            Material: mueble.material,
            Dimensiones: `A: ${mueble.dimensiones.ancho} cm, Al: ${mueble.dimensiones.alto} cm, L: ${mueble.dimensiones.largo} cm`,
            Precio: `${mueble.precio} €`
        }));

        console.table(mueblesMostrar);
        await this.opcionesSiguientes();
    }

    private async filtrarMuebles(tipo: 'sillas' | 'mesas' | 'armarios', criterio: string, clave: string, ordenacion: string, asc: string): Promise<Mueble[]> {
        await this.db.read();
        const muebles = this.db.data?.[tipo] ?? [];
        // Convertir clave a minúsculas para hacer la comparación insensible a mayúsculas y minúsculas
        const claveMinusc = clave.toLowerCase();
        // Asegurarse de que el criterio es una clave válida para el tipo de mueble
        const mueblesFiltrados = muebles.filter(mueble => {
            // Utilizar aserción de tipo para acceder a la propiedad del objeto de manera segura
            const valor = mueble[criterio as keyof typeof mueble];
            if (typeof valor === 'string') {
            // Convertir el valor a minúsculas antes de la comparación
            return valor.toLowerCase().includes(claveMinusc);
            }
            return false; // Si la propiedad no es una cadena, no incluir el mueble
        });

        // Ordenar según el criterio de ordenación
        if (ordenacion === 'precio') {
            mueblesFiltrados.sort((a, b) => asc === 'ascendente' ? a.precio - b.precio : b.precio - a.precio);
        } else { // asumiendo que el otro criterio es 'descripcion'
            mueblesFiltrados.sort((a, b) => asc === 'ascendente' ? a.descripcion.localeCompare(b.descripcion) : b.descripcion.localeCompare(a.descripcion));
        }

        return mueblesFiltrados;
    }




}
