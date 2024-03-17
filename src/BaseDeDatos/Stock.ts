import inquirer from "inquirer";
import { Low } from 'lowdb';
import { JSONFile } from "lowdb/node";
import { Silla } from "../Muebles/Silla.js";
import { Mesa } from "../Muebles/Mesa.js";
import { Armario } from "../Muebles/Armario.js";
import { Cliente } from "../Entidades/Clientes.js";
import { Proveedor } from "../Entidades/Proveedores.js";
import { gestionarMuebles, gestionarClientes, gestionarProveedores, mainMenu } from '../menus.js';
import { Mueble } from "../abstract_classes/Mueble.js";

/**
 * Representa una transacción de compra, venta o devolución de muebles.
 */
interface Transaction {
    id: number;
    type: 'SALE' | 'PURCHASE' | 'RETURNED_BY_CUSTOMER' | 'RETURN_TO_SUPPLIER';
    furnitureID: number;
    quantity: number;
    interactorID: number; // Cliente o Proveedor ID
    date: string;
    amount: number;
}

/**
 * Representa el esquema de la base de datos.
 */
interface DbSchema {
    sillas:Silla[];
    armarios:Armario[];
    mesas:Mesa[]
    proveedores: Proveedor[];
    clientes: Cliente[];
    stock: {
        [key: string]: { [id: number]: number }; // key puede ser 'sillas', 'mesas', 'armarios'
    };
    transactions: Transaction[];
}

/**
 * Gestiona el stock, operaciones de búsqueda y modificación, y las transacciones de una tienda de muebles.
 * Implementa el patrón Singleton para asegurar una única instancia de la clase.
 */
export class Stock {
    /**
     * La base de datos para almacenar el estado de la tienda.
     */
    private db: Low<DbSchema>;
    /**
     * La única instancia de la clase Stock.
     */
    private static instance: Stock;


    /**
     * Constructor privado para prevenir la creación directa de instancias y facilitar el patrón Singleton.
     */
    private constructor(dbPath:string) {
        const adapter = new JSONFile<DbSchema>(dbPath);
    
        this.db = new Low(adapter);
        this.initializeDb();
    }
    
    /**
     * Obtiene la instancia única de la clase Stock, creándola si no existe.
     * @returns La instancia única de la clase Stock.
     */
    public static getInstance(dbPath:string = 'db2.json'): Stock {
        if (!Stock.instance) {
            Stock.instance = new Stock(dbPath);
        }
        return Stock.instance;
    }

    /**
     * Inicializa la base de datos con estructuras de datos por defecto si está vacía.
     */
    private async initializeDb() {
        await this.db.read();
        this.db.data ||= { sillas: [], mesas: [], armarios: [], proveedores: [], clientes: [], stock: {}, transactions: [] };
        await this.db.write();
    }

    /**
     * Verifica si un ID es único entre todas las entidades de muebles.
     * @param id El ID a verificar.
     * @returns True si el ID es único, false de lo contrario.
     */
    private async idEsUnico(id: number) {
        await this.db.read(); 
        return !(this.db.data?.armarios.some(mueble => mueble.id === id) || this.db.data?.sillas.some(mueble => mueble.id === id) || this.db.data?.mesas.some(mueble => mueble.id === id));
    }

    /**
     * Añade un armario a la base de datos y actualiza el stock.
     * @param mueble El armario a añadir.
     */
    public async addArmario(mueble: Armario) {
        this.db.data?.armarios.push(mueble);
        this.db.data!.stock.armarios[mueble.id] = 10;
        await this.db.write();
    }
    
    /**
     * Añade una silla a la base de datos y actualiza el stock.
     * @param mueble La silla a añadir.
     */
    public async addSilla(mueble: Silla) {
        this.db.data?.sillas.push(mueble);
        this.db.data!.stock.sillas[mueble.id] = 10;
        await this.db.write();
    }
    
    /**
     * Añade una mesa a la base de datos y actualiza el stock.
     * @param mueble La mesa a añadir.
     */
    public async addMesa(mueble: Mesa) {
        this.db.data?.mesas.push(mueble);
        this.db.data!.stock.sillas[mueble.id] = 10;
        await this.db.write();
    }

    /**
     * Elimina una silla de la base de datos y actualiza el stock.
     * @param id El ID de la silla a eliminar.
     */
    public async deleteSilla(id: number) {
        if (this.db.data) {
            this.db.data.sillas = this.db.data.sillas.filter(mueble => mueble.id !== id);
            delete this.db.data!.stock.sillas[id];
            await this.db.write();
        }
    }

    /**
     * Elimina una mesa de la base de datos y actualiza el stock.
     * @param id El ID de la mesa a eliminar.
     */
    public async deleteMesa(id: number) {
        if (this.db.data) {
            this.db.data.mesas = this.db.data.mesas.filter(mueble => mueble.id !== id);
            delete this.db.data!.stock.mesas[id];
            await this.db.write();
        }
    }

    /**
     * Elimina un armario de la base de datos y actualiza el stock.
     * @param id El ID del armario a eliminar.
     */
    public async deleteArmario(id: number) {
        if (this.db.data) {
            this.db.data.armarios = this.db.data.armarios.filter(mueble => mueble.id !== id);
            delete this.db.data!.stock.armarios[id];
            await this.db.write();
        }
    }

    /**
     * Modifica una mesa existente reemplazándola con los datos de una nueva mesa.
     * Primero elimina la mesa existente con el ID proporcionado, luego añade la nueva mesa.
     * @param mueble La nueva mesa con la que se actualizará el registro.
     * @param id El ID de la mesa a modificar.
     */
    public async modifyMesa(mueble: Mesa, id:number) {
        this.deleteMesa(id);
        this.addMesa(mueble);
    }

    /**
     * Modifica un armario existente reemplazándolo con los datos de un nuevo armario.
     * Primero elimina el armario existente con el ID proporcionado, luego añade el nuevo armario.
     * @param mueble El nuevo armario con el que se actualizará el registro.
     * @param id El ID del armario a modificar.
     */
    public async modifyArmario(mueble: Armario, id:number) {
        this.deleteArmario(id);
        this.addArmario(mueble);
    }

    /**
     * Modifica una silla existente reemplazándola con los datos de una nueva silla.
     * Primero elimina la silla existente con el ID proporcionado, luego añade la nueva silla.
     * @param mueble La nueva silla con la que se actualizará el registro.
     * @param id El ID de la silla a modificar.
     */
    public async modifySilla(mueble: Silla, id:number) {
        this.deleteSilla(id);
        this.addSilla(mueble);
    }

    /**
     * Obtiene la lista de todas las sillas registradas en la base de datos.
     * @returns Un arreglo de sillas.
     */
    public async getSilla() {
        await this.db.read();
        return this.db.data?.sillas || [];
    }

    /**
     * Obtiene la lista de todas las mesas registradas en la base de datos.
     * @returns Un arreglo de mesas.
     */
    public async getMesa() {
        await this.db.read();
        return this.db.data?.mesas || [];
    }

    /**
     * Obtiene la lista de todos los armarios registrados en la base de datos.
     * @returns Un arreglo de armarios.
     */
    public async getArmario() {
        await this.db.read();
        return this.db.data?.armarios || [];
    }

    /**
     * Obtiene la lista de todos los clientes registrados en la base de datos.
     * @returns Un arreglo de clientes.
     */
    public async getClientes() {
        await this.db.read();
        return this.db.data?.clientes || [];
    }

    /**
     * Obtiene la lista de todos los proveedores registrados en la base de datos.
     * @returns Un arreglo de proveedores.
     */
    public async getProveedores() {
        await this.db.read();
        return this.db.data?.proveedores || [];
    }

    /**
     * Añade un nuevo cliente a la base de datos y actualiza el registro.
     * @param cliente El cliente a añadir.
     */
    public async addCliente(cliente: Cliente) {
        this.db.data?.clientes.push(cliente);
        await this.db.write();
    }

    /**
     * Añade un nuevo proveedor a la base de datos y actualiza el registro.
     * @param proveedor El proveedor a añadir.
     */
    public async addProveedor(proveedor: Proveedor) {
        this.db.data?.proveedores.push(proveedor);
        await this.db.write();
    }

    /**
     * Elimina un cliente de la base de datos basado en su ID.
     * @param id El ID del cliente a eliminar.
     */
    public async deleteCliente(id: number) {
        if (this.db.data) {
            this.db.data.clientes = this.db.data.clientes.filter(cliente => cliente.id !== id);
            await this.db.write();
        }
    }

    /**
     * Elimina un proveedor de la base de datos basado en su ID.
     * @param id El ID del proveedor a eliminar.
     */
    public async deleteProveedor(id: number) {
        if (this.db.data) {
            this.db.data.proveedores = this.db.data.proveedores.filter(proveedor => proveedor.id !== id);
            await this.db.write();
        }
    }

    /**
     * Lista todos los muebles registrados en la base de datos, incluyendo armarios, sillas y mesas.
     * Imprime en consola la lista de cada tipo de mueble si están registrados. Si no hay muebles registrados de algún tipo,
     * imprime un mensaje indicando que no hay registros.
     */
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
    }

    /**
     * Lista todos los clientes registrados en la base de datos.
     * Imprime en consola una lista de clientes si hay registros. Si no hay clientes registrados,
     * imprime un mensaje indicando que no hay registros.
     */
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
    }

    /**
     * Lista todos los proveedores registrados en la base de datos.
     * Imprime en consola una lista de proveedores si hay registros. Si no hay proveedores registrados,
     * imprime un mensaje indicando que no hay registros.
     */
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
    }

    /**
     * Interactúa con el usuario para recoger los datos necesarios y añadir una nueva silla a la base de datos.
     * Valida que el ID sea único y solicita las características de la silla. Si el ID ya existe, solicita uno nuevo.
     * Una vez validados y recogidos todos los datos, añade la silla y actualiza el stock inicial para este nuevo mueble.
     */
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
    
        // Comprueba si el ID introducido ya está en uso
        const id = parseInt(respuestas.id);
        const esUnico = await this.idEsUnico(id);
    
        // Si el ID no es único, muestra un mensaje y reinicia el proceso
        if (!esUnico) {
            console.log('El ID introducido ya está en uso. Por favor, introduce un ID único.');
            await this.añadirSilla();
            return;
        }
    
        // Crea una nueva instancia de Silla y la añade a la base de datos
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
    }

    /**
     * Interactúa con el usuario para recoger los datos necesarios y añadir una nueva mesa a la base de datos.
     * Valida que el ID sea único y solicita las características de la mesa. Si el ID ya existe, solicita uno nuevo.
     * Una vez validados y recogidos todos los datos, añade la mesa y actualiza el stock inicial para este nuevo mueble.
     */
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
    
        // Comprueba si el ID introducido ya está en uso
        const id = parseInt(respuestas.id);
        const esUnico = await this.idEsUnico(id);
    
        // Si el ID no es único, muestra un mensaje y reinicia el proceso
        if (!esUnico) {
            console.log('El ID introducido ya está en uso. Por favor, introduce un ID único.');
            await this.añadirMesa();
            return;
        }
    
        // Crea una nueva instancia de Mesa y la añade a la base de datos
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
    }

    /**
     * Interactúa con el usuario para recoger los datos necesarios y añadir un nuevo armario a la base de datos.
     * Valida que el ID sea único y solicita las características del armario. Si el ID ya existe, solicita uno nuevo.
     * Una vez validados y recogidos todos los datos, añade el armario y actualiza el stock inicial para este nuevo mueble.
     */
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
    
        // Comprueba si el ID introducido ya está en uso
        const id = parseInt(respuestas.id);
        const esUnico = await this.idEsUnico(id);
    
        // Si el ID no es único, muestra un mensaje y reinicia el proceso
        if (!esUnico) {
            console.log('El ID introducido ya está en uso. Por favor, introduce un ID único.');
            await this.añadirArmario();
            return;
        }
    
        // Crea una nueva instancia de Armario y la añade a la base de datos
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
    }

    /**
     * Permite al usuario elegir qué tipo de mueble desea añadir (silla, mesa o armario) y llama al método correspondiente.
     */
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
                await this.añadirSilla(); 
                break;
            case 'mesa':
                await this.añadirMesa(); 
                break;
            case 'armario':
                await this.añadirArmario();
                break;
        }
    }

    /**
     * Permite al usuario eliminar un mueble especificando su ID. Verifica el tipo de mueble y lo elimina de la base de datos,
     * actualizando también el stock.
     */
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
    }

    /**
     * Presenta al usuario una serie de opciones a seguir después de realizar una acción, como añadir un mueble.
     * Permite añadir otro mueble, gestionar muebles existentes, volver al menú principal o salir de la aplicación.
     */
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
                await this.añadirMueble(); 
                break;
            case 'gestionarMuebles':
                await gestionarMuebles(this); 
                break;
            case 'menuPrincipal':
                await mainMenu(this); 
                break;
            case 'salir':
                console.log('Gracias por usar la aplicación. ¡Hasta la próxima!');
                process.exit(); // Cierra la aplicación
        }
    }

    /**
     * Permite al usuario modificar los detalles de un mueble existente por su ID.
     * El usuario puede cambiar cualquiera de las propiedades del mueble, incluyendo su tipo si es necesario.
     */
    public async modificarMueblePorId() {
        // Leemos la base de datos y pedimos al usuario que introduzca el ID del mueble a modificar
        await this.db.read();

        const { id } = await inquirer.prompt({
            type: 'number',
            name: 'id',
            message: 'Introduce el ID del mueble a modificar:',
            validate: value => !isNaN(value) && value > 0 ? true : 'Por favor, introduce un ID válido.'
        });
        
        // Compobamos si el mueble existe y obtenemos su índice
        const armarioIndex = this.db.data?.armarios.findIndex(m => m.id === id);
        const mesaIndex = this.db.data?.mesas.findIndex(m => m.id === id);
        const sillaIndex = this.db.data?.sillas.findIndex(m => m.id === id);
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

        // Nos aseguramos de que mueble no es undefined antes de proceder
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
                    if (existeId && value !== mueble.id) { // Nos aseguramos de permitir el mismo ID si el usuario no desea cambiarlo
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
            // Es una Silla
            preguntasEspecificas.push(
                { name: 'inclinable', type: 'confirm', message: '¿Es inclinable?', default: (mueble as Silla).inclinable },
                { name: 'reposabrazos', type: 'confirm', message: '¿Tiene reposabrazos?', default: (mueble as Silla).reposabrazos }
            );
        } else if ('forma' in (mueble as Mesa)) {
            // Es una Mesa
            preguntasEspecificas.push(
                { name: 'forma', type: 'input', message: 'Forma:', default: (mueble as Mesa).forma },
                { name: 'plegable', type: 'confirm', message: '¿Es plegable?', default: (mueble as Mesa).plegable }
            );
        } else if ('numeroPuertas' in (mueble as Armario)) {
            // Es un Armario
            preguntasEspecificas.push(
                { name: 'numeroPuertas', type: 'number', message: 'Número de puertas:', default: (mueble as Armario).numeroPuertas, filter: Number },
                { name: 'tieneCajones', type: 'confirm', message: '¿Tiene cajones?', default: (mueble as Armario).tieneCajones }
            );
        }
    
        // Realizar las preguntas comunes y específicas
        const respuestasComunes = await inquirer.prompt(preguntasComunes);
        const respuestasEspecificas = await inquirer.prompt(preguntasEspecificas);
    
        // Antes de llamar a Object.assign(), se construye el objeto dimensiones correctamente
        if (respuestasComunes.ancho !== undefined && respuestasComunes.alto !== undefined && respuestasComunes.largo !== undefined) {
            mueble.dimensiones = {
                ancho: respuestasComunes.ancho,
                alto: respuestasComunes.alto,
                largo: respuestasComunes.largo
            };
            // Eliminamos las propiedades individuales de dimensiones de respuestasComunes para evitar añadirlas al nivel superior
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
       
        console.log(`Mueble con ID ${id} modificado correctamente.`);
    }

    /**
     * Inicia el proceso para añadir un nuevo cliente, solicitando al usuario información como ID, nombre, contacto, y dirección.
     * Verifica que el ID sea único y, de ser así, procede a añadir el cliente a la base de datos, mostrando un mensaje de confirmación.
     * En caso de que el ID ya esté en uso, notifica al usuario.
     */
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
    }

    /**
     * Permite al usuario eliminar un cliente existente de la base de datos por su ID.
     * Solicita al usuario el ID del cliente a eliminar y, procede con la eliminación.
     * Muestra un mensaje de confirmación una vez que el cliente ha sido eliminado correctamente.
     */
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
    }

    /**
     * Permite al usuario modificar los detalles de un cliente existente por su ID.
     * El usuario puede cambiar cualquiera de las propiedades del cliente.
     */
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
    }


    /**
     * Realiza una búsqueda de clientes en la base de datos, basada en un conjunto de opciones de criterio.
     */
    public async searchClientes() {
        await this.searchGenerico('clientes', ['nombre', 'contacto', 'direccion']);
    }

    /**
     * Realiza una búsqueda de proveedores en la base de datos, basada en un conjunto de opciones de criterio.
     */
    public async searchProveedores() {
        await this.searchGenerico('proveedores', ['nombre', 'contacto', 'direccion']);
    }

    /**
     * Realiza una búsqueda genérica en la base de datos, ya sea de clientes o proveedores, basada en un conjunto de opciones de criterio.
     * Solicita al usuario seleccionar un criterio de búsqueda y proporcionar un valor de búsqueda correspondiente.
     * Filtra los elementos (clientes o proveedores) que coinciden con el criterio de búsqueda y el valor proporcionado, y los muestra en una tabla.
     * @param tipo Define si la búsqueda es entre 'clientes' o 'proveedores'.
     * @param opciones Un array de string que representa los criterios de búsqueda disponibles (ej. nombre, contacto, dirección).
     */
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
            // Si no, buscar por coincidencia de cadena de texto
            return elemento[respuestas.tipo].toLowerCase().includes(respuestas.valor.toLowerCase());
        });

        const mostrar = elementos?.map(elemento => ({
            ID: elemento.id,
            Nombre: elemento.nombre,
            Contacto: elemento.contacto,
            Dirección: elemento.direccion
        }));

        console.table(mostrar);
        
        // Vuelve al menú anterior después de mostrar los resultados
        if (tipo === 'clientes') {
            gestionarClientes(this); 
        } else {
            gestionarProveedores(this); 
        }
    }

    /**
     * Permite al usuario añadir un nuevo proveedor a la base de datos.
     * Solicita al usuario que ingrese los detalles del proveedor, incluyendo ID, nombre, teléfono y dirección.
     * Valida que el ID no esté en uso y que los valores ingresados sean correctos.
     * Si el ID ya está en uso, informa al usuario y le pide que reintente.
     * Al finalizar, agrega el nuevo proveedor a la base de datos y muestra un mensaje de confirmación.
     */
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
    }

    /**
     * Permite al usuario eliminar un proveedor existente de la base de datos por su ID.
     * Solicita al usuario el ID del proveedor a eliminar y, procede con la eliminación.
     * Muestra un mensaje de confirmación una vez que el proveedor ha sido eliminado correctamente.
     */
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
    }

    /**
     * Permite al usuario modificar los detalles de un proveedor existente por su ID.
     * El usuario puede cambiar cualquiera de las propiedades del proveedor.
     */
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
    }

    /**
     * Permite al usuario buscar muebles en la base de datos según varios criterios y ordenaciones.
     * Inicialmente, el usuario selecciona el tipo de mueble a buscar (Silla, Mesa, Armario), el criterio de búsqueda (nombre, material, descripción),
     * cómo ordenar los resultados (precio o descripción), y la dirección de la ordenación (ascendente o descendente).
     * A continuación, se solicita al usuario un valor clave para filtrar los resultados.
     * Los resultados se filtran y ordenan según las selecciones del usuario y se muestran en formato de tabla.
     * Finalmente, se ofrece al usuario opciones siguientes para continuar navegando por la aplicación.
     */
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

    /**
     * Filtra y ordena una lista de muebles según los criterios especificados por el usuario.
     * Se aplica un filtro basado en un criterio y un valor clave ingresados por el usuario. La comparación es insensible a mayúsculas y minúsculas.
     * Posteriormente, se ordenan los muebles filtrados según el criterio de ordenación y la dirección especificados (ascendente o descendente).
     * Este método es utilizado por el método buscarMueble() para obtener los muebles filtrados y ordenados.
     * @param tipo Tipo de mueble a filtrar ('sillas', 'mesas', 'armarios').
     * @param criterio Criterio por el cual se filtrará (por ejemplo, 'nombre' o 'material').
     * @param clave Valor clave para el filtro.
     * @param ordenacion Criterio de ordenación ('precio' o 'descripcion').
     * @param asc Dirección de la ordenación ('ascendente' o 'descendente').
     * @returns Una promesa que resuelve a una lista de muebles filtrados y ordenados.
     */
    public async filtrarMuebles(tipo: 'sillas' | 'mesas' | 'armarios', criterio: string, clave: string, ordenacion: string, asc: string): Promise<Mueble[]> {
        await this.db.read();
        const muebles = this.db.data?.[tipo] ?? [];
        // Convertir clave a minúsculas para hacer la comparación insensible a mayúsculas y minúsculas
        const claveMinusc = clave.toLowerCase();
        // Asegurarse de que el criterio es una clave válida para el tipo de mueble
        const mueblesFiltrados = muebles.filter(mueble => {
            // Utilizar aserción de tipo para acceder a la propiedad del objeto  (quebadero de cabeza esto)
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
        } else { 
            mueblesFiltrados.sort((a, b) => asc === 'ascendente' ? a.descripcion.localeCompare(b.descripcion) : b.descripcion.localeCompare(a.descripcion));
        }

        return mueblesFiltrados;
    }

    /**
     * Inicia el proceso de realizar una venta solicitando al usuario que introduzca los detalles de la venta,
     * como el ID del mueble vendido, la cantidad, el ID del cliente y el importe de la venta.
     * Valida los inputs y una vez recopilados los datos, verifica si el mueble existe y si hay suficiente stock para completar la venta.
     * Si es posible, procede a procesar la venta actualizando el stock y registrando la transacción.
     */
    public async realizarVenta() {
        const respuestas = await inquirer.prompt([
            {
                type: 'input',
                name: 'furnitureID',
                message: 'Introduce el ID del mueble vendido:',
                validate: value => value.trim() !== '' && !isNaN(value) ? true : 'Por favor, introduce un número válido.',
            },
            {
                type: 'input',
                name: 'quantity',
                message: 'Introduce la cantidad vendida:',
                validate: value => value.trim() !== '' && !isNaN(value) && parseInt(value) > 0 ? true : 'Por favor, introduce una cantidad válida.',
            },
            {
                type: 'input',
                name: 'customerID',
                message: 'Introduce el ID del cliente que lo compró:',
                validate: value => value.trim() !== '' && !isNaN(value) ? true : 'Por favor, introduce un número válido.',
            },
            {
                type: 'input',
                name: 'amount',
                message: 'Introduce el importe de la venta:',
                validate: value => value.trim() !== '' && !isNaN(value) && parseFloat(value) > 0 ? true : 'Por favor, introduce un importe válido.',
            }
        ]);
    
        const furnitureID = parseInt(respuestas.furnitureID);
        const quantity = parseInt(respuestas.quantity);
        const customerID = parseInt(respuestas.customerID);
        const amount = parseFloat(respuestas.amount);
    
        // Identifica el tipo de mueble
        const tipoMueble = this.identificarTipoMueble(furnitureID);
        if (!tipoMueble) {
            console.log("ID de mueble no válido. Asegúrate de que el ID corresponde a un mueble existente.");
            return;
        }
    
        // Verifica si hay suficiente stock y procesa la venta
        const ventaExitosa = await this.procesarVenta(tipoMueble, furnitureID, quantity, customerID, amount);
    
        if (!ventaExitosa) {
            console.log("No se pudo completar la venta. Revisa el stock disponible.");
        }
    }
    
    /**
     * Procesa una venta actualizando el stock del mueble vendido y registrando la transacción.
     * Verifica si hay suficiente stock para la cantidad vendida. Si no hay suficiente, informa al usuario y no procede con la venta.
     * Si hay suficiente stock, actualiza el stock en la base de datos, registra la transacción con los detalles proporcionados
     * y guarda los cambios en la base de datos.
     * @param tipoMueble El tipo de mueble vendido ('sillas', 'mesas', 'armarios').
     * @param furnitureID El ID del mueble vendido.
     * @param quantity La cantidad de muebles vendidos.
     * @param customerID El ID del cliente que realiza la compra.
     * @param amount El importe total de la venta.
     * @returns Una promesa que resuelve a true si la venta fue exitosa o false si no pudo completarse.
     */
    public async procesarVenta(tipoMueble: 'sillas' | 'mesas' | 'armarios', furnitureID: number, quantity: number, customerID: number, amount: number): Promise<boolean> {
        // Leer los datos más actuales
        await this.db.read();
    
        // Verifica si hay suficiente stock
        const stockActual = this.db.data!.stock[tipoMueble][furnitureID] || 0;
        if (stockActual < quantity) {
            console.log("No hay suficiente stock para realizar la venta.");
            return false; 
        }
    
        // Actualiza stock
        this.db.data!.stock[tipoMueble][furnitureID] -= quantity;
    
        // Registra la transacción
        const transaccion: Transaction = {
            id: this.db.data!.transactions.length + 1, 
            type: 'SALE',
            furnitureID: furnitureID,
            quantity: quantity,
            interactorID: customerID,
            date: new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }),
            amount: amount,
        };
        this.db.data!.transactions.push(transaccion);
    
        // Guardar cambios
        await this.db.write();
    
        console.log("Venta procesada correctamente.");
        return true;
    }

    /**
     * Inicia el proceso de realizar una compra solicitando al usuario que introduzca los detalles de la compra,
     * como el ID del mueble comprado, la cantidad, el ID del proveedor y el importe de la compra.
     * Valida los inputs y una vez recopilados los datos, verifica si el mueble existe y luego procede a procesar la compra 
     * actualizando el stock y registrando la transacción.
     */
    public async realizarCompra() {
        const respuestas = await inquirer.prompt([
            {
                type: 'input',
                name: 'furnitureID',
                message: 'Introduce el ID del mueble comprado:',
                validate: value => value.trim() !== '' && !isNaN(value) ? true : 'Por favor, introduce un número válido.',
            },
            {
                type: 'input',
                name: 'quantity',
                message: 'Introduce la cantidad comprada:',
                validate: value => value.trim() !== '' && !isNaN(value) && parseInt(value) > 0 ? true : 'Por favor, introduce una cantidad válida.',
            },
            {
                type: 'input',
                name: 'supplierID',
                message: 'Introduce el ID del proveedor que lo vendió:',
                validate: value => value.trim() !== '' && !isNaN(value) ? true : 'Por favor, introduce un número válido.',
            },
            {
                type: 'input',
                name: 'amount',
                message: 'Introduce el importe de la compra:',
                validate: value => value.trim() !== '' && !isNaN(value) && parseFloat(value) > 0 ? true : 'Por favor, introduce un importe válido.',
            }
        ]);
    
        const furnitureID = parseInt(respuestas.furnitureID);
        const quantity = parseInt(respuestas.quantity);
        const supplierID = parseInt(respuestas.supplierID);
        const amount = parseFloat(respuestas.amount);
    
        // Identifica el tipo de mueble
        const tipoMueble = this.identificarTipoMueble(furnitureID);
        if (!tipoMueble) {
            console.log("ID de mueble no válido. Asegúrate de que el ID corresponde a un mueble existente.");
            return;
        }
    
        // Procesa la compra
        const compraExitosa = await this.procesarCompra(tipoMueble, furnitureID, quantity, supplierID, amount);
    
        if (!compraExitosa) {
            console.log("No se pudo completar la compra.");
        }
    }
    
    /**
     * Procesa una compra actualizando el stock del mueble comprado y registrando la transacción.
     * Actualiza el stock en la base de datos incrementando la cantidad según lo comprado y registra la transacción con los detalles proporcionados.
     * @param tipoMueble El tipo de mueble comprado ('sillas', 'mesas', 'armarios').
     * @param furnitureID El ID del mueble comprado.
     * @param quantity La cantidad de muebles comprados.
     * @param supplierID El ID del proveedor que vende el mueble.
     * @param amount El importe total de la compra.
     * @returns Una promesa que resuelve a true si la compra fue exitosa.
     */
    public async procesarCompra(tipoMueble: 'sillas' | 'mesas' | 'armarios', furnitureID: number, quantity: number, supplierID: number, amount: number): Promise<boolean> {
        // Leer los datos más actuales
        await this.db.read();
    
        // Actualiza stock
        if (!this.db.data!.stock[tipoMueble]) {
            this.db.data!.stock[tipoMueble] = {};
        }
    
        const stockActual = this.db.data!.stock[tipoMueble][furnitureID] || 0;
        this.db.data!.stock[tipoMueble][furnitureID] = stockActual + quantity;
    
        // Registra la transacción
        const transaccion: Transaction = {
            id: this.db.data!.transactions.length + 1,
            type: 'PURCHASE',
            furnitureID: furnitureID,
            quantity: quantity,
            interactorID: supplierID,
            date: new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }),
            amount: amount,
        };
        this.db.data!.transactions.push(transaccion);
    
        // Guardar cambios
        await this.db.write();
    
        console.log("Compra procesada correctamente.");
        return true; 
    }

    /**
     * Inicia el proceso de realizar una devolución por parte del cliente solicitando al usuario que introduzca los detalles de la devolución,
     * como el ID del mueble devuelto, la cantidad, el ID del cliente y el importe de la devolución.
     * Valida los inputs y una vez recopilados los datos, verifica si el mueble existe y luego procede a procesar la devolución 
     * actualizando el stock y registrando la transacción.
     */
    public async realizarDevolucionCliente() {
        const respuestas = await inquirer.prompt([
            {
                type: 'input',
                name: 'furnitureID',
                message: 'Introduce el ID del mueble devuelto:',
                validate: value => value.trim() !== '' && !isNaN(value) ? true : 'Por favor, introduce un número válido.',
            },
            {
                type: 'input',
                name: 'quantity',
                message: 'Introduce la cantidad devuelta:',
                validate: value => value.trim() !== '' && !isNaN(value) && parseInt(value) > 0 ? true : 'Por favor, introduce una cantidad válida.',
            },
            {
                type: 'input',
                name: 'customerID',
                message: 'Introduce el ID del cliente:',
                validate: value => value.trim() !== '' && !isNaN(value) ? true : 'Por favor, introduce un número válido.',
            },
            {
                type: 'input',
                name: 'amount',
                message: 'Introduce el importe de la devolución:',
                validate: value => value.trim() !== '' && !isNaN(value) && parseFloat(value) > 0 ? true : 'Por favor, introduce un importe válido.',
            }
        ]);
    
        const furnitureID = parseInt(respuestas.furnitureID);
        const quantity = parseInt(respuestas.quantity);
        const customerID = parseInt(respuestas.customerID);
        const amount = parseFloat(respuestas.amount);
    
        // Identifica el tipo de mueble
        const tipoMueble = this.identificarTipoMueble(furnitureID);
        if (!tipoMueble) {
            console.log("ID de mueble no válido. Asegúrate de que el ID corresponde a un mueble existente.");
            return;
        }
        
        // Procesar devolución
        const devolucionExitosa = await this.procesarDevolucionCliente(furnitureID, quantity, customerID, amount);
        
        if (!devolucionExitosa) {
            console.log("No se pudo completar la devolución.");
        }
    }

    /**
     * Procesa una devolución realizada por un cliente actualizando el stock del mueble devuelto e
     * incorporando la transacción de devolución en la base de datos.
     * @param furnitureID El ID del mueble devuelto.
     * @param quantity La cantidad del mueble devuelto.
     * @param customerID El ID del cliente que realiza la devolución.
     * @param amount El importe de la devolución.
     * @returns Una promesa que resuelve a true si la devolución fue procesada correctamente.
     */
    public async procesarDevolucionCliente(furnitureID: number, quantity: number, customerID: number, amount: number): Promise<boolean> {
        await this.db.read();
    
        const tipoMueble = this.identificarTipoMueble(furnitureID);
        if (!tipoMueble) {
            console.log("El ID de mueble no es válido.");
            return false;
        }
    
        // Incrementar stock debido a la devolución
        this.db.data!.stock[tipoMueble][furnitureID] = (this.db.data!.stock[tipoMueble][furnitureID] || 0) + quantity;
    
        // Registrar la transacción de devolución por parte del cliente
        const transaccion: Transaction = {
            id: this.db.data!.transactions.length + 1,
            type: 'RETURNED_BY_CUSTOMER',
            furnitureID: furnitureID,
            quantity: quantity,
            interactorID: customerID,
            date: new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }),
            amount: -amount, // Negativo porque es una devolución
        };
        this.db.data!.transactions.push(transaccion);
    
        await this.db.write();
        console.log("Devolución por cliente procesada correctamente.");
        return true;
    }

    /**
     * Inicia el proceso de realizar una devolución a un proveedor solicitando al usuario
     * que introduzca los detalles de la devolución como el ID del mueble, la cantidad devuelta,
     * el ID del proveedor y el importe de la devolución. Valida los inputs y procede a procesar la devolución.
     */
    public async realizarDevolucionProveedor() {
        const respuestas = await inquirer.prompt([
            {
                type: 'input',
                name: 'furnitureID',
                message: 'Introduce el ID del mueble devuelto:',
                validate: value => value.trim() !== '' && !isNaN(value) ? true : 'Por favor, introduce un número válido.',
            },
            {
                type: 'input',
                name: 'quantity',
                message: 'Introduce la cantidad devuelta:',
                validate: value => value.trim() !== '' && !isNaN(value) && parseInt(value) > 0 ? true : 'Por favor, introduce una cantidad válida.',
            },
            {
                type: 'input',
                name: 'supplierID',
                message: 'Introduce el ID del proveedor:',
                validate: value => value.trim() !== '' && !isNaN(value) ? true : 'Por favor, introduce un número válido.',
            },
            {
                type: 'input',
                name: 'amount',
                message: 'Introduce el importe de la devolución:',
                validate: value => value.trim() !== '' && !isNaN(value) && parseFloat(value) > 0 ? true : 'Por favor, introduce un importe válido.',
            }
        ]);
    
        const furnitureID = parseInt(respuestas.furnitureID);
        const quantity = parseInt(respuestas.quantity);
        const supplierID = parseInt(respuestas.supplierID);
        const amount = parseFloat(respuestas.amount);
    
        // Identificar el tipo de mueble
        const tipoMueble = this.identificarTipoMueble(furnitureID);
        if (!tipoMueble) {
            console.log("El ID del mueble no es válido. Asegúrate de que el ID corresponde a un mueble existente.");
            return;
        }
    
        // Procesar la devolución
        const devolucionExitosa = await this.procesarDevolucionProveedor(furnitureID, quantity, supplierID, amount);

        if (!devolucionExitosa) {
            console.log("No se pudo completar la devolución.");
        }
    }

    /**
     * Procesa una devolución a un proveedor disminuyendo el stock del mueble devuelto y
     * registrando la transacción de devolución en la base de datos.
     * @param furnitureID El ID del mueble devuelto.
     * @param quantity La cantidad del mueble devuelto.
     * @param supplierID El ID del proveedor al que se devuelve el mueble.
     * @param amount El importe de la devolución.
     * @returns Una promesa que resuelve a true si la devolución fue procesada correctamente.
     */
    public async procesarDevolucionProveedor(furnitureID: number, quantity: number, supplierID: number, amount: number): Promise<boolean> {
        await this.db.read();
    
        const tipoMueble = this.identificarTipoMueble(furnitureID);
        if (!tipoMueble) {
            console.log("El ID de mueble no es válido.");
            return false;
        }
    
        // Disminuimos el stock debido a la devolución al proveedor
        this.db.data!.stock[tipoMueble][furnitureID] = (this.db.data!.stock[tipoMueble][furnitureID] || 0) - quantity;
    
        // Registramos la transacción de devolución al proveedor
        const transaccion: Transaction = {
            id: this.db.data!.transactions.length + 1,
            type: 'RETURN_TO_SUPPLIER',
            furnitureID: furnitureID,
            quantity: quantity,
            interactorID: supplierID,
            date: new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }),
            amount: -amount, // Negativo porque es una devolución
        };
        this.db.data!.transactions.push(transaccion);
    
        await this.db.write();
        console.log("Devolución a proveedor procesada correctamente.");
        return true;
    }

    /**
     * Identifica el tipo de mueble basado en el ID proporcionado verificando en qué colección
     * de muebles (sillas, mesas o armarios) se encuentra el ID.
     * @param furnitureID El ID del mueble a identificar.
     * @returns El tipo de mueble ('sillas', 'mesas', 'armarios') o undefined si no se encuentra.
     */
    private identificarTipoMueble(furnitureID: number): 'sillas' | 'mesas' | 'armarios' | undefined {
        if (this.db.data!.sillas.some(mueble => mueble.id === furnitureID)) return 'sillas';
        if (this.db.data!.mesas.some(mueble => mueble.id === furnitureID)) return 'mesas';
        if (this.db.data!.armarios.some(mueble => mueble.id === furnitureID)) return 'armarios';
        return undefined;
    }

    /**
     * Muestra el stock disponible para cada categoría de muebles o para todas las categorías,
     * según la elección del usuario. Utiliza 'inquirer' para que el usuario elija una categoría y
     * luego muestra el stock disponible de esa categoría o de todas las categorías.
     */
    public async mostrarStockDisponible() {
        // Asegura que los datos están actualizados
        await this.db.read(); 

        // Accede directamente a los datos de stock
        const { stock } = this.db.data!; 

        // Solicita al usuario que elija una categoría de mueble
        const respuesta = await inquirer.prompt({
            type: 'list',
            name: 'categoria',
            message: 'Seleccione la categoría de muebles para la cual desea ver el stock:',
            choices: ['sillas', 'mesas', 'armarios', 'Todos'],
        });

        // Muestra el stock basado en la selección del usuario
        if (respuesta.categoria === 'Todos') {
            console.log('Stock disponible por categoría:');
            Object.keys(stock).forEach(categoria => {
                console.log(`\nCategoría: ${categoria.toUpperCase()}`);
                console.table(stock[categoria]);
            });
        } else {
            console.log(`Stock disponible para ${respuesta.categoria}:`);
            console.table(stock[respuesta.categoria]);
        }
    }

    /**
     * Identifica y muestra los muebles más vendidos basándose en las transacciones de venta registradas.
     * Agrupa las transacciones por el ID del mueble y suma las cantidades vendidas para cada uno.
     * Luego, ordena los muebles por la cantidad vendida y muestra un resumen de los más vendidos.
     */
    public async mueblesMasVendidos() {
        // Asegura que los datos están actualizados
        await this.db.read(); 

        // Accede directamente a las transacciones
        const { transactions } = this.db.data!; 

        // Agrupa transacciones por ID de mueble y suma las cantidades
        const mueblesVendidos = transactions
            .filter(t => t.type === 'SALE') // Filtrar solo las transacciones de venta
            .reduce((acc, t) => {
                if (!acc[t.furnitureID]) {
                    acc[t.furnitureID] = 0;
                }
                acc[t.furnitureID] += t.quantity;
                return acc;
            }, {} as { [key: number]: number });
        
        // Ordena el objeto de muebles vendidos por la cantidad vendida
        const mueblesVendidosOrdenados = Object.entries(mueblesVendidos)
            .sort(([, cantidadA], [, cantidadB]) => cantidadB - cantidadA)
            .map(([id, cantidad]) => ({ id: parseInt(id), cantidad }));
        
        // Muestra los muebles más vendidos
        console.log('Los muebles más vendidos son:');
        console.table(mueblesVendidosOrdenados);
    }

    /**
     * Convierte una cadena de texto que representa una fecha en el formato 'dd/mm/yyyy' a un objeto Date.
     * @param fechaStr La cadena de texto que representa la fecha.
     * @returns Un objeto Date que representa la fecha proporcionada.
     */
    private convertirAFecha(fechaStr: string): Date {
        const [dia, mes, año] = fechaStr.split('/').map(part => parseInt(part));
        return new Date(año, mes - 1, dia);
    }

    /**
     * Verifica si una fecha dada está dentro de un rango especificado por una fecha de inicio y una de fin.
     * Utiliza la función 'convertirAFecha' para convertir la cadena de texto de la fecha a un objeto Date.
     * @param fecha La fecha a verificar, como cadena de texto.
     * @param fechaInicio La fecha de inicio del rango.
     * @param fechaFin La fecha de fin del rango.
     * @returns true si la fecha está dentro del rango, false en caso contrario.
     */
    private fechaEnRango(fecha: string, fechaInicio: Date, fechaFin: Date): boolean {
        const fechaTransaccion = this.convertirAFecha(fecha);
        return fechaTransaccion >= fechaInicio && fechaTransaccion <= fechaFin;
    }

    /**
     * Calcula y muestra la facturación total por ventas realizadas dentro de un periodo especificado por el usuario.
     * Utiliza 'inquirer' para solicitar al usuario las fechas de inicio y fin del periodo y filtra las transacciones
     * de tipo 'SALE' que caen dentro de este rango. Finalmente, suma los montos de estas transacciones y muestra el total.
     */
    public async facturacionEnPeriodo() {
        // Solicitar al usuario las fechas de inicio y fin
        const { fechaInicioStr, fechaFinStr } = await inquirer.prompt([
          {
            type: 'input',
            name: 'fechaInicioStr',
            message: 'Introduce la fecha de inicio (DD/MM/YYYY):',
            validate: input => /^\d{2}\/\d{2}\/\d{4}$/.test(input) ? true : 'Por favor, introduce una fecha en formato DD/MM/YYYY.',
          },
          {
            type: 'input',
            name: 'fechaFinStr',
            message: 'Introduce la fecha de fin (DD/MM/YYYY):',
            validate: input => /^\d{2}\/\d{2}\/\d{4}$/.test(input) ? true : 'Por favor, introduce una fecha en formato DD/MM/YYYY.',
          }
        ]);
      
        // Convertir las cadenas de fecha a objetos Date
        const fechaInicio = this.convertirAFecha(fechaInicioStr);
        const fechaFin = this.convertirAFecha(fechaFinStr);
        
        // Filtrar las transacciones que caen dentro del rango de fechas
        const ventas = this.db.data!.transactions.filter(transaccion => 
          transaccion.type === 'SALE' && this.fechaEnRango(transaccion.date, fechaInicio, fechaFin)
        );
        
        // Calcular el total de las ventas
        const totalVentas = ventas.reduce((sum, transaccion) => sum + transaccion.amount, 0);
        console.log(`Total facturado por ventas entre ${fechaInicioStr} y ${fechaFinStr}: ${totalVentas} €.`);
      }
    
    /**
     * Calcula y muestra el total de gastos en compras realizadas dentro de un periodo especificado por el usuario.
     * Utiliza 'inquirer' para solicitar al usuario las fechas de inicio y fin del periodo y filtra las transacciones
     * de tipo 'PURCHASE' que caen dentro de este rango. Finalmente, suma los montos de estas transacciones y muestra el total.
     */
    public async gastosEnPeriodo() {
        // Solicitar al usuario las fechas de inicio y fin
        const { fechaInicioStr, fechaFinStr } = await inquirer.prompt([
          {
            type: 'input',
            name: 'fechaInicioStr',
            message: 'Introduce la fecha de inicio (DD/MM/YYYY):',
            validate: input => /^\d{2}\/\d{2}\/\d{4}$/.test(input) ? true : 'Por favor, introduce una fecha en formato DD/MM/YYYY.',
          },
          {
            type: 'input',
            name: 'fechaFinStr',
            message: 'Introduce la fecha de fin (DD/MM/YYYY):',
            validate: input => /^\d{2}\/\d{2}\/\d{4}$/.test(input) ? true : 'Por favor, introduce una fecha en formato DD/MM/YYYY.',
          }
        ]);
      
        // Convertir las cadenas de fecha a objetos Date
        const fechaInicio = this.convertirAFecha(fechaInicioStr);
        const fechaFin = this.convertirAFecha(fechaFinStr);
      
        // Filtrar las transacciones de tipo 'PURCHASE' que caen dentro del rango de fechas
        const compras = this.db.data!.transactions.filter(transaccion => 
          transaccion.type === 'PURCHASE' && this.fechaEnRango(transaccion.date, fechaInicio, fechaFin)
        );
      
        // Calcular el total de los gastos
        const totalGastos = compras.reduce((sum, transaccion) => sum + transaccion.amount, 0);
      
        console.log(`Total gastado en compras entre ${fechaInicioStr} y ${fechaFinStr}: ${totalGastos} €.`);
    }

    /**
     * Muestra un histórico de transacciones realizadas, ya sea ventas a clientes o compras a proveedores,
     * basado en la elección del usuario. Solicita al usuario que especifique si desea ver ventas o compras
     * y el ID correspondiente al cliente o proveedor. Filtra las transacciones basadas en esta selección y
     * muestra un resumen de las mismas.
     */
    public async historicoTransacciones() {
        const { tipoTransaccion } = await inquirer.prompt({
            type: 'list',
            name: 'tipoTransaccion',
            message: '¿Deseas ver el histórico de ventas a un cliente o compras a un proveedor?',
            choices: ['Ventas a Cliente', 'Compras a Proveedor']
        });
    
        let mensajeId = '';
        let tipoFiltro = '';
    
        if (tipoTransaccion === 'Ventas a Cliente') {
            mensajeId = 'Introduce el ID del cliente:';
            tipoFiltro = 'SALE';
        } else {
            mensajeId = 'Introduce el ID del proveedor:';
            tipoFiltro = 'PURCHASE';
        }
    
        const { idInteractor } = await inquirer.prompt({
            type: 'input',
            name: 'idInteractor',
            message: mensajeId,
            validate: value => value.trim() !== '' && !isNaN(value) ? true : 'Por favor, introduce un número válido.',
        });
    
        // Asegura que los datos están actualizados
        await this.db.read();
    
        // Filtra las transacciones basadas en el tipo y el interactor ID
        const transaccionesFiltradas = this.db.data!.transactions.filter(transaccion => 
            transaccion.type === tipoFiltro && transaccion.interactorID === parseInt(idInteractor)
        );
    
        if (transaccionesFiltradas.length > 0) {
            console.log(`Histórico de ${tipoTransaccion.toLowerCase()} para el ID ${idInteractor}:`);
            console.table(transaccionesFiltradas.map(transaccion => ({
                ID: transaccion.id,
                Tipo: transaccion.type,
                ID_Mueble: transaccion.furnitureID,
                Cantidad: transaccion.quantity,
                Fecha: transaccion.date,
                Importe: `${transaccion.amount} €`
            })));
        } else {
            console.log(`No se encontraron ${tipoTransaccion.toLowerCase()} para el ID ${idInteractor}.`);
        }
    }
    
}
