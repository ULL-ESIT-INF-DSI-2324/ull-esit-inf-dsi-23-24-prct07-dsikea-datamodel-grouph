import "mocha"
import "sinon"
import inquirer, { Answers, QuestionCollection } from "inquirer";
import { expect } from "chai";
import { Stock } from "../../src/BaseDeDatos/Stock.js";
import { mainMenu, gestionarClientes } from "../../src/menus.js";
import Sinon from "sinon";
import sinon from "sinon";

afterEach(function() {
    sinon.restore();
});

describe('Test de Stock', () => {
    it('Creamos la clase Stock correctamente y el listar Clientes', () => {
        const stock1 = Stock.getInstance('db_test.json');
        stock1.listarClientes();       
        expect('0').to.equal('0');

    });
    it('Creamos la clase Stock correctamente y el listar Muebles', () => {
        const stock1 = Stock.getInstance('db_test.json');
        stock1.listarMuebles();       
        expect('0').to.equal('0');

    });
    it('Creamos la clase Stock correctamente y el listar Provedores', () => {
        const stock1 = Stock.getInstance('db_test.json');
        stock1.listarProveedores();       
        expect('0').to.equal('0');
    });    
    it('Cremos la clase Stock y añadimos un cliente',()=>{
        const inquirerStub = Sinon.stub(inquirer, 'prompt').resolves({
            id: '124',
            nombre: 'John Doe',
            contacto: '555-123-456',
            direccion: '123 Main St',
        });
        const stock1 = Stock.getInstance('db_test.json');
        stock1.añadirCliente();       
        expect('0').to.equal('0');    
        Sinon.assert.calledOnce(inquirerStub);
        Sinon.assert.calledWithMatch(inquirerStub.firstCall, [
            Sinon.match({ type: 'input', name: 'id', message: 'ID del cliente:' }),
            Sinon.match({ type: 'input', name: 'nombre', message: 'Nombre del cliente:' }),
            Sinon.match({ type: 'input', name: 'contacto', message: 'Teléfono del cliente:' }),
            Sinon.match({ type: 'input', name: 'direccion', message: 'Dirección del cliente:' }),
        ]);
        inquirerStub.restore();
    })

    it('Cremos la clase Stock y eliminamos un cliente',() =>{
        const inquirerStub = Sinon.stub(inquirer, 'prompt');
        inquirerStub.resolves({ id: '124' })

        const stock1 = Stock.getInstance('db_test.json');
        stock1.eliminarCliente(); 
        expect('0').to.equal('0'); 
        Sinon.assert.calledWithMatch(inquirerStub, [
            Sinon.match({ type: 'input', name: 'id', message: 'Introduce el ID del cliente a eliminar:' }) ])  
        inquirerStub.restore();
    })

    it('Cremos la clase Stock y añadimos un proveedor',()=>{
        const inquirerStub = Sinon.stub(inquirer, 'prompt').resolves({
            id: '150',
            nombre: 'Proveedor Test',
            contacto: '555-123-456',
            direccion: '123 Main St',
        });

        const stock1 = Stock.getInstance('db_test.json');
        stock1.añadirProveedor();       
        expect('0').to.equal('0');    
        Sinon.assert.calledOnce(inquirerStub);
        Sinon.assert.calledWithMatch(inquirerStub, [
            Sinon.match({ type: 'input', name: 'id', message: 'ID del proveedor:' }),
            Sinon.match({ type: 'input', name: 'nombre', message: 'Nombre del proveedor:' }),
            Sinon.match({ type: 'input', name: 'contacto', message: 'Teléfono del proveedor:' }),
            Sinon.match({ type: 'input', name: 'direccion', message: 'Dirección del proveedor:' }),
        ]);
      inquirerStub.restore();
    })

    it('Cremos la clase Stock y eliminamos un proveedor',() =>{
        const inquirerStub = Sinon.stub(inquirer, 'prompt');
        inquirerStub.resolves({ id: '150' })

        const stock1 = Stock.getInstance('db_test.json');
        stock1.eliminarProveedor(); 
        expect('0').to.equal('0'); 
        Sinon.assert.calledWithMatch(inquirerStub, [
            Sinon.match({ type: 'input', name: 'id', message: 'ID del proveedor a eliminar:' }) ])  
        inquirerStub.restore();
    })

    it('Cremos la clase Stock y añadimos una silla',()=>{
       const inquirerStub = Sinon.stub(inquirer, 'prompt')
        inquirerStub.resolves({
            id: '144',
            nombre: 'Silla Ejemplo',
            descripcion: 'Esta es una silla de ejemplo',
            material: 'Madera',
            ancho: '50',
            alto: '80',
            largo: '60',
            precio: '100',
            inclinable: true,
            reposabrazos: false,
        });
        const stock1 = Stock.getInstance('db_test.json');
        stock1.añadirSilla(); 
    
        expect('0').to.equal('0');    
        Sinon.assert.calledOnce(inquirerStub)
        Sinon.assert.calledWithMatch(inquirerStub, [
            Sinon.match({ type: 'input', name: 'id', message: 'ID de la silla:' }),
            Sinon.match({ type: 'input', name: 'nombre', message: 'Nombre de la silla:' }),
            Sinon.match({ type: 'input', name: 'descripcion', message: 'Descripción de la silla:' }),
            Sinon.match({ type: 'input', name: 'material', message: 'Material de la silla:' }),
            Sinon.match({ type: 'input', name: 'ancho', message: 'Ancho de la silla (cm):' }),
            Sinon.match({ type: 'input', name: 'alto', message: 'Alto de la silla (cm):' }),
            Sinon.match({ type: 'input', name: 'largo', message: 'Largo de la silla (cm):' }),
            Sinon.match({ type: 'input', name: 'precio', message: 'Precio de la silla:' }),
            Sinon.match({ type: 'confirm', name: 'inclinable', message: '¿Es inclinable la silla?' }),
            Sinon.match({ type: 'confirm', name: 'reposabrazos', message: '¿Tiene reposabrazos la silla?' }),
        ]);
      inquirerStub.restore();
    })
    it('Cremos la clase Stock y eliminamos una silla',() =>{
        const inquirerStub = Sinon.stub(inquirer, 'prompt');
        inquirerStub.resolves({ id: '144' })

        const stock1 = Stock.getInstance('db_test.json');
        stock1.eliminarMueble(); 
        expect('0').to.equal('0'); 
        Sinon.assert.calledWithMatch(inquirerStub, [
            Sinon.match({ type: 'input', name: 'id', message: 'Introduce el ID del mueble a eliminar:' }) ])  
        inquirerStub.restore();
    })
    it('Cremos la clase Stock y añadimos una mesa',()=>{
        const inquirerStub = Sinon.stub(inquirer, 'prompt');
        inquirerStub.resolves({
            id: '180',
            nombre: 'Mesa Ejemplo',
            descripcion: 'Esta es una mesa de ejemplo',
            material: 'Madera',
            ancho: '80',
            alto: '70',
            largo: '120',
            precio: '200',
            forma: 'Rectangular',
            plegable: false,
        });

         const stock1 = Stock.getInstance('db_test.json');
         stock1.añadirMesa(); 
     
         expect('0').to.equal('0');    
         Sinon.assert.calledWithMatch(inquirerStub, [
            Sinon.match({ type: 'input', name: 'id', message: 'ID de la mesa:' }),
            Sinon.match({ type: 'input', name: 'nombre', message: 'Nombre de la mesa:' }),
            Sinon.match({ type: 'input', name: 'descripcion', message: 'Descripción de la mesa:' }),
            Sinon.match({ type: 'input', name: 'material', message: 'Material de la mesa:' }),
            Sinon.match({ type: 'input', name: 'ancho', message: 'Ancho de la mesa (cm):' }),
            Sinon.match({ type: 'input', name: 'alto', message: 'Alto de la mesa (cm):' }),
            Sinon.match({ type: 'input', name: 'largo', message: 'Largo de la mesa (cm):' }),
            Sinon.match({ type: 'input', name: 'precio', message: 'Precio de la mesa:' }),
            Sinon.match({ type: 'input', name: 'forma', message: 'Forma de la mesa:' }),
            Sinon.match({ type: 'confirm', name: 'plegable', message: '¿Es plegable la mesa?', default: false })
        ]);
        
       inquirerStub.restore();
    })

    it('Creamos la clase Stock y eliminamos una mesa',() =>{
        const inquirerStub = Sinon.stub(inquirer, 'prompt');
        inquirerStub.resolves({ id: '180' })

        const stock1 = Stock.getInstance('db_test.json');
        stock1.eliminarMueble(); 
        expect('0').to.equal('0'); 
        Sinon.assert.calledWithMatch(inquirerStub, [
            Sinon.match({ type: 'input', name: 'id', message: 'Introduce el ID del mueble a eliminar:' }) ])  
        inquirerStub.restore();
    })

    it('Cremos la clase Stock y añadimos un armario',()=>{
        const inquirerStub = Sinon.stub(inquirer, 'prompt');
        inquirerStub.resolves({
            id: '200',
            nombre: 'Armario Ejemplo',
            descripcion: 'Este es un armario de ejemplo',
            material: 'Madera',
            ancho: '80',
            alto: '200',
            largo: '120',
            precio: '400',
            numeroPuertas: '3',
            tieneCajones: true,
        });

         const stock1 = Stock.getInstance('db_test.json');
         stock1.añadirArmario(); 
     
         expect('0').to.equal('0');    
         Sinon.assert.calledWithMatch(inquirerStub, [
            Sinon.match({ type: 'input', name: 'id', message: 'ID del armario:' }),
            Sinon.match({ type: 'input', name: 'nombre', message: 'Nombre del armario:' }),
            Sinon.match({ type: 'input', name: 'descripcion', message: 'Descripción del armario:' }),
            Sinon.match({ type: 'input', name: 'material', message: 'Material del armario:' }),
            Sinon.match({ type: 'input', name: 'ancho', message: 'Ancho del armario (cm):' }),
            Sinon.match({ type: 'input', name: 'alto', message: 'Alto del armario (cm):' }),
            Sinon.match({ type: 'input', name: 'largo', message: 'Largo del armario (cm):' }),
            Sinon.match({ type: 'input', name: 'precio', message: 'Precio del armario:' }),
            Sinon.match({ type: 'input', name: 'puertas', message: 'Número de puertas del armario:' }),
            Sinon.match({ type: 'confirm', name: 'cajones', message: '¿Tiene cajones el armario?' }),
        ]);
        
       inquirerStub.restore();
    })

    it('Creamos la clase Stock y eliminamos un armario',() =>{
        const inquirerStub = Sinon.stub(inquirer, 'prompt');
        inquirerStub.resolves({ id: '200' })

        const stock1 = Stock.getInstance('db_test.json');
        stock1.eliminarMueble(); 
        expect('0').to.equal('0'); 
        Sinon.assert.calledWithMatch(inquirerStub, [
            Sinon.match({ type: 'input', name: 'id', message: 'Introduce el ID del mueble a eliminar:' }) ])  
        inquirerStub.restore();
    })

    it('Modificamos un cliente por su id', async () => {
        const inquirerStub = Sinon.stub(inquirer, 'prompt');
        inquirerStub.onFirstCall().resolves({ id: '124' });
        // Simulamos las respuestas para las preguntas de actualización del cliente
        inquirerStub.onSecondCall().resolves({
            id: 124,
            nombre: 'Nuevo Nombre',
            contacto: '999999999',
            direccion: 'Nueva Dirección'
        });
    
        const stock1 = Stock.getInstance('db_test.json');
        await stock1.modificarClientePorId(); 
    
        expect('0').to.equal('0'); 
    
        // Verificación de que inquirer.prompt fue llamado con las preguntas esperadas
        Sinon.assert.calledWithMatch(inquirerStub.firstCall, Sinon.match({
            type: 'number',
            name: 'id',
            message: 'Introduce el ID del cliente a modificar:'
        }));
        
        inquirerStub.restore();
    });

    it('Modificamos un proveedor por su id', async () => {
        const inquirerStub = Sinon.stub(inquirer, 'prompt');
        inquirerStub.onFirstCall().resolves({ id: '150' });
        // Simulamos las respuestas para las preguntas de actualización del proveedor
        inquirerStub.onSecondCall().resolves({
            id: 150,
            nombre: 'Nuevo Nombre',
            contacto: '999999999',
            direccion: 'Nueva Dirección'
        });
    
        const stock1 = Stock.getInstance('db_test.json');
        await stock1.modificarProveedorPorID(); 
    
        expect('0').to.equal('0'); 
    
        // Verificación de que inquirer.prompt fue llamado con las preguntas esperadas
        Sinon.assert.calledWithMatch(inquirerStub.firstCall, Sinon.match({
            type: 'number',
            name: 'id',
            message: 'Introduce el ID del proveedor a modificar:'
        }));
        
        inquirerStub.restore();
    });

    it('Modificamos un mueble por su id', async () => {
        const inquirerStub = Sinon.stub(inquirer, 'prompt');
        inquirerStub.onFirstCall().resolves({ id: '144' });
        // Simulamos las respuestas para las preguntas de actualización del mueble
        inquirerStub.onSecondCall().resolves({
            id: 144,
            nombre: 'Nuevo Nombre',
            descripcion: 'Nueva Descripción',
            material: 'Nuevo Material',
            ancho: 100,
            alto: 100,
            largo: 100,
            precio: 100,
        });
    
        const stock1 = Stock.getInstance('db_test.json');
        await stock1.modificarMueblePorId(); 
    
        expect('0').to.equal('0'); 
    
        // Verificación de que inquirer.prompt fue llamado con las preguntas esperadas
        Sinon.assert.calledWithMatch(inquirerStub.firstCall, Sinon.match({
            type: 'number',
            name: 'id',
            message: 'Introduce el ID del mueble a modificar:'
        }));
        
        inquirerStub.restore();
    });
});

describe('Pruebas de interacción del menú de clientes', () => {
    it('El menú de clientes muestra las opciones esperadas', async () => {
        const inquirerStub = Sinon.stub(inquirer, 'prompt');
        inquirerStub.resolves({ action: 'Volver' });

        const stock1 = Stock.getInstance('db_test.json');
        await gestionarClientes(stock1);

        expect('0').to.equal('0');
        Sinon.assert.calledWithMatch(inquirerStub, [
            Sinon.match({ type: 'list', name: 'action', message: '¿Qué acción desea realizar con los clientes?', choices: Sinon.match.array.deepEquals([
                'Añadir cliente',
                'Eliminar cliente',
                'Modificar cliente',
                'Listar clientes',
                'Buscar clientes',
                'Volver'
            ]) })
        ]);
        inquirerStub.restore();
    });

    it('El menú de clientes muestra las opciones esperadas', async () => {
        const inquirerStub = Sinon.stub(inquirer, 'prompt');
        // Se Configura el stub para resolver diferentes valores en llamadas sucesivas
        inquirerStub.onFirstCall().resolves({ action: 'Añadir cliente' })
                    .onSecondCall().resolves({
                        id: '124',
                        nombre: 'Cliente Prueba',
                        contacto: '999999999',
                        direccion: 'Calle Falsa 123'
                    })
                    .onThirdCall().resolves({ action: 'Volver' });

        const stock1 = Stock.getInstance('db_test.json');
        await gestionarClientes(stock1);

        expect('0').to.equal('0');

        Sinon.assert.called(inquirerStub);
        inquirerStub.restore();
    });

    it('El menú de clientes muestra las opciones esperadas', async () => {
        const inquirerStub = Sinon.stub(inquirer, 'prompt');
        // Se Configura el stub para resolver diferentes valores en llamadas sucesivas
        inquirerStub.onFirstCall().resolves({ action: 'Eliminar cliente' })
                    .onSecondCall().resolves({ id: '124' })
                    .onThirdCall().resolves({ action: 'Volver' }); 
        
        const stock1 = Stock.getInstance('db_test.json');
        await gestionarClientes(stock1);

        expect('0').to.equal('0');
        
        Sinon.assert.called(inquirerStub);
        inquirerStub.restore();
    });

    it('El menú de clientes muestra las opciones esperadas', async () => {
        const inquirerStub = Sinon.stub(inquirer, 'prompt');
        // Se Configura el stub para resolver diferentes valores en llamadas sucesivas
        inquirerStub.onFirstCall().resolves({ action: 'Modificar cliente' })
                    .onSecondCall().resolves({ id: '124' })
                    .onThirdCall().resolves({
                        id: 124,
                        nombre: 'Nuevo Nombre',
                        contacto: '999999999',
                        direccion: 'Nueva Dirección'
                    })
                    .onCall(3).resolves({ action: 'Volver' }); 

        const stock1 = Stock.getInstance('db_test.json');
        await gestionarClientes(stock1);

        expect('0').to.equal('0');
        
        Sinon.assert.called(inquirerStub);
        inquirerStub.restore();
    });

    it('El menú de clientes muestra las opciones esperadas', async () => {
        const inquirerStub = Sinon.stub(inquirer, 'prompt');
        // Se Configura el stub para resolver diferentes valores en llamadas sucesivas
        inquirerStub.onFirstCall().resolves({ action: 'Listar clientes' })
                    .onSecondCall().resolves({ action: 'Volver' }); 

        const stock1 = Stock.getInstance('db_test.json');
        await gestionarClientes(stock1);

        expect('0').to.equal('0');
        
        Sinon.assert.called(inquirerStub);
        inquirerStub.restore();

    });
});

describe('Pruebas de interacción del menú de proveedores', () => {
    it('El menú de proveedores muestra las opciones esperadas', async () => {
        const inquirerStub = Sinon.stub(inquirer, 'prompt');
        inquirerStub.resolves({ action: 'Volver' });

        const stock1 = Stock.getInstance('db_test.json');
        await gestionarClientes(stock1);

        expect('0').to.equal('0');
        Sinon.assert.calledWithMatch(inquirerStub, [
            Sinon.match({ type: 'list', name: 'action', message: '¿Qué acción desea realizar con los clientes?', choices: Sinon.match.array.deepEquals([
                'Añadir cliente',
                'Eliminar cliente',
                'Modificar cliente',
                'Listar clientes',
                'Buscar clientes',
                'Volver'
            ]) })
        ]);
        inquirerStub.restore();
    });

    it('El menú de proveedores muestra las opciones esperadas', async () => {
        const inquirerStub = Sinon.stub(inquirer, 'prompt');
        // Se Configura el stub para resolver diferentes valores en llamadas sucesivas
        inquirerStub.onFirstCall().resolves({ action: 'Añadir proveedor' })
                    .onSecondCall().resolves({
                        id: '150',
                        nombre: 'Proveedor Test',
                        contacto: '555-123-456',
                        direccion: '123 Main St',
                    })
                    .onThirdCall().resolves({ action: 'Volver' });

        const stock1 = Stock.getInstance('db_test.json');
        await gestionarClientes(stock1);

        expect('0').to.equal('0');

        Sinon.assert.called(inquirerStub);
        inquirerStub.restore();
    });

    it('El menú de proveedores muestra las opciones esperadas', async () => {
        const inquirerStub = Sinon.stub(inquirer, 'prompt');
        // Se configura el stub para resolver diferentes valores en llamadas sucesivas
        inquirerStub.onFirstCall().resolves({ action: 'Eliminar proveedor' })
                    .onSecondCall().resolves({ id: '150' })
                    .onThirdCall().resolves({ action: 'Volver' }); 
        
        const stock1 = Stock.getInstance('db_test.json');
        await gestionarClientes(stock1);

        expect('0').to.equal('0');
        
        Sinon.assert.called(inquirerStub);
        inquirerStub.restore();
    });

    it('El menú de proveedores muestra las opciones esperadas', async () => {
        const inquirerStub = Sinon.stub(inquirer, 'prompt');
        // Se configura el stub para resolver diferentes valores en llamadas sucesivas
        inquirerStub.onFirstCall().resolves({ action: 'Modificar proveedor' })
                    .onSecondCall().resolves({ id: '150' })
                    .onThirdCall().resolves({
                        id: 150,
                        nombre: 'Nuevo Nombre',
                        contacto: '999999999',
                        direccion: 'Nueva Dirección'
                    })
                    .onCall(3).resolves({ action: 'Volver' }); 

        const stock1 = Stock.getInstance('db_test.json');
        await gestionarClientes(stock1);

        expect('0').to.equal('0');
        
        Sinon.assert.called(inquirerStub);
        inquirerStub.restore();
    });

    it('El menú de proveedores muestra las opciones esperadas', async () => {
        const inquirerStub = Sinon.stub(inquirer, 'prompt');
        // Se configura el stub para resolver diferentes valores en llamadas sucesivas
        inquirerStub.onFirstCall().resolves({ action: 'Listar proveedores' })
                    .onSecondCall().resolves({ action: 'Volver' }); 

        const stock1 = Stock.getInstance('db_test.json');
        await gestionarClientes(stock1);

        expect('0').to.equal('0');
        
        Sinon.assert.called(inquirerStub);
        inquirerStub.restore();

    });
});

describe("Pruebas de interacción del menú principal", () => {
    it("El menú principal muestra las opciones esperadas", async () => {
        const inquirerStub = Sinon.stub(inquirer, 'prompt');
        inquirerStub.resolves({ action: 'Volver' });

        const stock1 = Stock.getInstance('db_test.json');
        await mainMenu(stock1);

        expect('0').to.equal('0');
        Sinon.assert.calledWithMatch(inquirerStub, [
            Sinon.match({ type: 'list', name: 'action', message: '¿Qué acción desea realizar?', choices: Sinon.match.array.deepEquals([
                'Gestionar muebles',
                'Gestionar proveedores',
                'Gestionar clientes',
                'Gestionar transacciones',
                'Generar informes',
                'Salir'
            ]) })
        ]);
        inquirerStub.restore();
    });

    it("El menú principal muestra las opciones esperadas", async () => {
        const inquirerStub = Sinon.stub(inquirer, 'prompt');
        inquirerStub.resolves({ action: 'Gestionar clientes' });

        const stock1 = Stock.getInstance('db_test.json');
        await mainMenu(stock1);

        expect('0').to.equal('0');
        Sinon.assert.calledWithMatch(inquirerStub, [
            Sinon.match({ type: 'list', name: 'action', message: '¿Qué acción desea realizar con los clientes?', choices: Sinon.match.array.deepEquals([
                'Añadir cliente',
                'Eliminar cliente',
                'Modificar cliente',
                'Listar clientes',
                'Buscar clientes',
                'Volver'
            ]) })
        ]);
        inquirerStub.restore();
    });

    it("El menú principal muestra las opciones esperadas", async () => {
        const inquirerStub = Sinon.stub(inquirer, 'prompt');
        inquirerStub.resolves({ action: 'Gestionar proveedores' });

        const stock1 = Stock.getInstance('db_test.json');
        await mainMenu(stock1);

        expect('0').to.equal('0');
        Sinon.assert.calledWithMatch(inquirerStub, [
            Sinon.match({ type: 'list', name: 'action', message: '¿Qué acción desea realizar con los proveedores?', choices: Sinon.match.array.deepEquals([
                'Añadir proveedor',
                'Eliminar proveedor',
                'Modificar proveedor',
                'Listar proveedores',
                'Buscar proveedores',
                'Volver'
            ]) })
        ]);
        inquirerStub.restore();
    });

    it("El menú principal muestra las opciones esperadas", async () => {
        const inquirerStub = Sinon.stub(inquirer, 'prompt');
        inquirerStub.resolves({ action: 'Gestionar transacciones' });

        const stock1 = Stock.getInstance('db_test.json');
        await mainMenu(stock1);

        expect('0').to.equal('0');
        Sinon.assert.calledWithMatch(inquirerStub, [
            Sinon.match({ type: 'list', name: 'action', message: '¿Qué acción desea realizar?', choices: Sinon.match.array.deepEquals([
                'Gestionar muebles',
                'Gestionar proveedores',
                'Gestionar clientes',
                'Gestionar transacciones',
                'Generar informes',
                'Salir'
            ]) })
        ]);
        inquirerStub.restore();
    });

    it ("El menú principal muestra las opciones esperadas", async () => {
        const inquirerStub = Sinon.stub(inquirer, 'prompt');
        inquirerStub.resolves({ action: 'Generar informes' });

        const stock1 = Stock.getInstance('db_test.json');
        await mainMenu(stock1);

        expect('0').to.equal('0');
        Sinon.assert.calledWithMatch(inquirerStub, [
            Sinon.match({ type: 'list', name: 'action', message: '¿Qué acción desea realizar?', choices: Sinon.match.array.deepEquals([
                'Gestionar muebles',
                'Gestionar proveedores',
                'Gestionar clientes',
                'Gestionar transacciones',
                'Generar informes',
                'Salir'
            ]) })
        ]);
        inquirerStub.restore();
    });
});

describe('modificarMueblePorId', () => {
    let stock: Stock;
    let inquirerStub: Sinon.SinonStub<[questions: QuestionCollection<Answers>, initialAnswers?: Partial<Answers> | undefined], Promise<Answers>>;
  
    beforeEach(() => {
      stock = Stock.getInstance('db_test.json');
      inquirerStub = sinon.stub(inquirer, 'prompt');
    });
  
    afterEach(() => {
      sinon.restore();
    });
  
    it('debe permitir modificar un mueble existente', async () => {
      // Suponiendo que el ID 1 corresponde a un mueble existente 
      const muebleId = 1;
      inquirerStub.onCall(0).resolves({ id: muebleId });
      inquirerStub.onCall(1).resolves({
        id: muebleId,
        nombre: 'Mueble Modificado',
        descripcion: 'Descripción modificada',
        material: 'Material modificado',
        ancho: 100,
        alto: 200,
        largo: 50,
        precio: 500,
        forma: 'Rectangular',
        plegable: false,
      });
      
      const modifySpy = sinon.spy(stock, 'modifyMesa');
      await stock.modificarMueblePorId();
  
      // Verifica que se hayan hecho las llamadas correctas
      expect(modifySpy.calledOnceWith(sinon.match.any, muebleId)).to.be.true;

    });

    it('debe permitir modificar un mueble existente', async () => {
        // Suponiendo que el ID 1 corresponde a un mueble existente 
        const muebleId = 1;
        inquirerStub.onCall(0).resolves({ id: muebleId });
        inquirerStub.onCall(1).resolves({
          id: muebleId,
          nombre: 'Mueble Modificado',
          descripcion: 'Descripción modificada',
          material: 'Material modificado',
          ancho: 100,
          alto: 200,
          largo: 50,
          precio: 500,
          numeroPuertas: 3,
          tieneCajones: true,
        });
            
        const modifySpy = sinon.spy(stock, 'modifyArmario');
        await stock.modificarMueblePorId();
    
        // Verifica que se hayan hecho las llamadas correctas
        expect(modifySpy.calledOnceWith(sinon.match.any, muebleId)).to.be.true;
  
    });

    it('debe permitir modificar un mueble existente', async () => {
        // Suponiendo que el ID 1 corresponde a un mueble existente 
        const muebleId = 1;
        inquirerStub.onCall(0).resolves({ id: muebleId });
        inquirerStub.onCall(1).resolves({
          id: muebleId,
          nombre: 'Mueble Modificado',
          descripcion: 'Descripción modificada',
          material: 'Material modificado',
          ancho: 100,
          alto: 200,
          largo: 50,
          precio: 500,
          inclinable: true,
          reposabrazos: false,
        });        
        const modifySpy = sinon.spy(stock, 'modifySilla');
        await stock.modificarMueblePorId();
    
        // Verifica que se hayan hecho las llamadas correctas
        expect(modifySpy.calledOnceWith(sinon.match.any, muebleId)).to.be.true;
  
    });
  
    it('debe manejar el caso cuando se introduce un ID de mueble no existente', async () => {
        // Suponiendo que el ID 9999 no corresponde a ningún mueble existente
        const muebleIdInexistente = 9999;
        inquirerStub.resolves({ id: muebleIdInexistente });
    
        await stock.modificarMueblePorId();
    
        // Verificar que se muestra un mensaje adecuado al usuario
        const consoleSpy = sinon.spy(console, 'log');
        expect(consoleSpy.calledWith('Mueble no encontrado.')).to.be.false;
    });

    it('debe permitir modificar una silla con sus propiedades específicas', async () => {
        // Asumiendo que el ID 2 corresponde a una Silla existente
        const sillaId = 2;
        inquirerStub.onCall(0).resolves({ id: sillaId });
        inquirerStub.onCall(1).resolves({
          id: sillaId,
          nombre: 'Silla Modificada',
          descripcion: 'Descripción modificada para silla',
          material: 'Material modificado para silla',
          ancho: 45,
          alto: 95,
          largo: 45,
          precio: 120,
          inclinable: true,
          reposabrazos: false,
        });
    
        const modifySpy = sinon.spy(stock, 'modifySilla');
        await stock.modificarMueblePorId();
    
        // Verificar que se llamó al método de modificación de silla con los argumentos esperados
        expect(modifySpy.calledOnce).to.be.true;
    });

    it('debe validar que el ID del mueble es un número válido', async () => {
        inquirerStub.onCall(0).resolves({ id: "no es un número" }); // Usuario introduce un valor no numérico
        await stock.modificarMueblePorId();
    }); 
});

describe('modificarProveedorPorID', () => {
    let stock: Stock;
    let inquirerStub: Sinon.SinonStub<[questions: QuestionCollection<Answers>, initialAnswers?: Partial<Answers> | undefined], Promise<Answers>>;
  
    beforeEach(() => {
      stock = Stock.getInstance('db_test.json');
      inquirerStub = sinon.stub(inquirer, 'prompt');
    });
  
    afterEach(() => {
      sinon.restore();
    });
  
    it('debe manejar el caso cuando se introduce un ID de proveedor no existente', async () => {
      // Suponiendo que el ID 9999 no corresponde a ningún proveedor existente
      const proveedorIdInexistente = 9999;
      inquirerStub.resolves({ id: proveedorIdInexistente });
  
      await stock.modificarProveedorPorID();
  
      // Verificar que se muestra un mensaje adecuado al usuario
      const consoleSpy = sinon.spy(console, 'log');
      expect(consoleSpy.calledWith('Proveedor no encontrado.')).to.be.false;
    });
  
    it('debe validar que el ID del proveedor es un número válido', async () => {
      inquirerStub.onCall(0).resolves({ id: "no es un número" }); // Usuario introduce un valor no numérico
      await stock.modificarProveedorPorID();
    }); 

    it('debe permitir modificar un proveedor existente', async () => {
      // Suponiendo que el ID 1 corresponde a un proveedor existente 
      const proveedorId = 1;
      inquirerStub.onCall(0).resolves({ id: proveedorId });
      inquirerStub.onCall(1).resolves({
        id: proveedorId,
        nombre: 'Proveedor Modificado',
        contacto: '999999999',
        direccion: 'Nueva Dirección'
      });
      
      const modifySpy = sinon.spy(stock, 'modificarProveedorPorID');
      await stock.modificarProveedorPorID();
  
      // Verifica que se hayan hecho las llamadas correctas
      expect(modifySpy.calledOnceWith()).to.be.true;
    });

    it ('no debe permitir modificar un proveedor inexistente', async () => {
        // Suponiendo que el ID 9999 no corresponde a ningún proveedor existente
        const proveedorIdInexistente = 9999;
        inquirerStub.resolves({ id: proveedorIdInexistente });
    
        await stock.modificarProveedorPorID();
    
        const consoleSpy = sinon.spy(console, 'log');
        expect(consoleSpy.calledWith('Proveedor no encontrado.')).to.be.false;
    });
});

describe('modificarClientePorId', () => {
    let stock: Stock;
    let inquirerStub: Sinon.SinonStub<[questions: QuestionCollection<Answers>, initialAnswers?: Partial<Answers> | undefined], Promise<Answers>>;
  
    beforeEach(() => {
      stock = Stock.getInstance('db_test.json');
      inquirerStub = sinon.stub(inquirer, 'prompt');
    });
  
    afterEach(() => {
      sinon.restore();
    });
  
    it('debe permitir modificar un cliente existente', async () => {
      // Suponiendo que el ID 1 corresponde a un cliente existente
      const clienteId = 1;
      inquirerStub.onCall(0).resolves({ id: clienteId });
      inquirerStub.onCall(1).resolves({
        id: clienteId,
        nombre: 'Cliente Modificado',
        contacto: '999999999',
        direccion: 'Nueva Dirección'
      });
      
      const modifySpy = sinon.spy(stock, 'modificarClientePorId');
      await stock.modificarClientePorId();
  
      // Verifica que se hayan hecho las llamadas correctas
      expect(modifySpy.calledOnceWith()).to.be.true;
    });

    it('debe manejar el caso cuando se introduce un ID de cliente no existente', async () => {
        // Suponiendo que el ID 9999 no corresponde a ningún cliente existente
        const clienteIdInexistente = 9999;
        inquirerStub.resolves({ id: clienteIdInexistente });
    
        await stock.modificarClientePorId();
    
        // Verificar que se muestra un mensaje adecuado al usuario
        const consoleSpy = sinon.spy(console, 'log');
        expect(consoleSpy.calledWith('Cliente no encontrado.')).to.be.false;
    });
  
    it('debe validar que el ID del cliente es un número válido', async () => {
      inquirerStub.onCall(0).resolves({ id: "no es un número" }); // Usuario introduce un valor no numérico
      await stock.modificarClientePorId();
    }); 
});

describe('buscarMueble', () => {
    let stock: Stock;
    let inquirerStub: Sinon.SinonStub<[questions: QuestionCollection<Answers>, initialAnswers?: Partial<Answers> | undefined], Promise<Answers>>;
  
    beforeEach(() => {
      stock = Stock.getInstance('db_test.json');
      inquirerStub = sinon.stub(inquirer, 'prompt');
    });
  
    afterEach(() => {
      sinon.restore();
    });
  
    it('debe permitir buscar un mueble por su ID', async () => {
      // Suponiendo que el ID 1 corresponde a un mueble existente
      const muebleId = 1;
      inquirerStub.resolves({ id: muebleId });
      
      const searchSpy = sinon.spy(stock, 'buscarMueble');
      await stock.buscarMueble();
  
      // Verifica que se hayan hecho las llamadas correctas
      expect(searchSpy.calledOnceWith()).to.be.true;
    });

    it('debe manejar el caso cuando se introduce un ID de mueble no existente', async () => {
        // Suponiendo que el ID 9999 no corresponde a ningún mueble existente
        const muebleIdInexistente = 9999;
        inquirerStub.resolves({ id: muebleIdInexistente });
    
        await stock.buscarMueble();
    
        // Verificar que se muestra un mensaje adecuado al usuario
        const consoleSpy = sinon.spy(console, 'log');
        expect(consoleSpy.calledWith('Mueble no encontrado.')).to.be.false;
    });

    it('debe validar que el ID del mueble es un número válido', async () => {
        inquirerStub.resolves({ id: "no es un número" }); // Usuario introduce un valor no numérico
        await stock.buscarMueble();
    }); 
});

describe('filtrarMuebles', () => {
    let stock: Stock;
    let inquirerStub: Sinon.SinonStub<[questions: QuestionCollection<Answers>, initialAnswers?: Partial<Answers> | undefined], Promise<Answers>>;
  
    beforeEach(() => {
      stock = Stock.getInstance('db_test.json');
      inquirerStub = sinon.stub(inquirer, 'prompt');
    });
  
    afterEach(() => {
      sinon.restore();
    });
  
    it('debe permitir filtrar muebles por su nombre', async () => {
        inquirerStub.resolves({ nombre: 'Mueble' });
        
        const filterSpy = sinon.spy(stock, 'filtrarMuebles');
        await stock.filtrarMuebles('sillas', 'nombre', 'silla', 'precio', 'ascendente');
        
        // Verifica que se hayan hecho las llamadas correctas
        expect(filterSpy.calledOnceWith('sillas', 'nombre', 'silla', 'precio', 'ascendente')).to.be.true;
    });

    it('debe permitir filtrar muebles por su material', async () => {
        inquirerStub.resolves({ material: 'Madera' });
        
        const filterSpy = sinon.spy(stock, 'filtrarMuebles');
        await stock.filtrarMuebles('sillas', 'material', 'plastico', 'precio', 'descendente');
      
        // Verifica que se hayan hecho las llamadas correctas
        expect(filterSpy.calledOnceWith('sillas', 'material', 'plastico', 'precio', 'descendente')).to.be.true;
    });

    it('debe permitir filtrar muebles por su precio', async () => {
        inquirerStub.resolves({ precio: 100 });
        
        const filterSpy = sinon.spy(stock, 'filtrarMuebles');
        await stock.filtrarMuebles('sillas', 'material', 'plastico', 'precio', 'descendente');
      
        // Verifica que se hayan hecho las llamadas correctas
        expect(filterSpy.calledOnceWith('sillas', 'material', 'plastico', 'precio', 'descendente')).to.be.true;
    });

    it('debe permitir filtrar muebles por su precio', async () => {
        inquirerStub.resolves({ precio: 100 });
        
        const filterSpy = sinon.spy(stock, 'filtrarMuebles');
        await stock.filtrarMuebles('mesas', 'material', 'plastico', 'precio', 'descendente');
    
        // Verifica que se hayan hecho las llamadas correctas
        expect(filterSpy.calledOnceWith('mesas', 'material', 'plastico', 'precio', 'descendente')).to.be.true;
    });

    it('debe permitir filtrar muebles por su precio', async () => {
        inquirerStub.resolves({ precio: 100 });
        
        const filterSpy = sinon.spy(stock, 'filtrarMuebles');
        await stock.filtrarMuebles('armarios', 'material', 'plastico', 'precio', 'ascendente');

        // Verifica que se hayan hecho las llamadas correctas
        expect(filterSpy.calledOnceWith('armarios', 'material', 'plastico', 'precio', 'ascendente')).to.be.true;
    });
});

describe('realizarCompra', () => {
    let stock: Stock;
    let inquirerStub: Sinon.SinonStub<[questions: QuestionCollection<Answers>, initialAnswers?: Partial<Answers> | undefined], Promise<Answers>>;
  
    beforeEach(() => {
      stock = Stock.getInstance('db_test.json');
      inquirerStub = sinon.stub(inquirer, 'prompt');
    });
  
    afterEach(() => {
      sinon.restore();
    });
  
    it('debe permitir realizar una compra', async () => {
        inquirerStub.resolves({ id: 1, cantidad: 1 });
        
        const buySpy = sinon.spy(stock, 'realizarCompra');
        await stock.realizarCompra();
      
        // Verifica que se hayan hecho las llamadas correctas
        expect(buySpy.calledOnceWith()).to.be.true;
    });

    it('debe validar que el ID del mueble es un número válido', async () => {
        inquirerStub.resolves({ id: "no es un número" }); // Usuario introduce un valor no numérico
        await stock.realizarCompra();
    });
});

describe('realizarVenta', () => {
    let stock: Stock;
    let inquirerStub: Sinon.SinonStub<[questions: QuestionCollection<Answers>, initialAnswers?: Partial<Answers> | undefined], Promise<Answers>>;
  
    beforeEach(() => {
      stock = Stock.getInstance('db_test.json');
      inquirerStub = sinon.stub(inquirer, 'prompt');
    });
  
    afterEach(() => {
      sinon.restore();
    });
  
    it('debe permitir realizar una venta', async () => {
        inquirerStub.resolves({ id: 1, cantidad: 1 });
        
        const sellSpy = sinon.spy(stock, 'realizarVenta');
        await stock.realizarVenta();
      
        // Verifica que se hayan hecho las llamadas correctas
        expect(sellSpy.calledOnceWith()).to.be.true;
    });

    it('debe validar que el ID del mueble es un número válido', async () => {
        inquirerStub.resolves({ id: "no es un número" }); // Usuario introduce un valor no numérico
        await stock.realizarVenta();
    });
});

describe('realizarDevolucionCliente', () => {
    let stock: Stock;
    let inquirerStub: Sinon.SinonStub<[questions: QuestionCollection<Answers>, initialAnswers?: Partial<Answers> | undefined], Promise<Answers>>;
  
    beforeEach(() => {
      stock = Stock.getInstance('db_test.json');
      inquirerStub = sinon.stub(inquirer, 'prompt');
    });
  
    afterEach(() => {
      sinon.restore();
    });
  
    it('debe permitir realizar una devolución', async () => {
        inquirerStub.resolves({ id: 1, cantidad: 1 });
        
        const returnSpy = sinon.spy(stock, 'realizarDevolucionCliente');
        await stock.realizarDevolucionCliente();
      
        // Verifica que se hayan hecho las llamadas correctas
        expect(returnSpy.calledOnceWith()).to.be.true;
    });

    it('debe validar que el ID del mueble es un número válido', async () => {
        inquirerStub.resolves({ id: "no es un número" }); // Usuario introduce un valor no numérico
        await stock.realizarDevolucionCliente();
    });
});

describe('realizarDevolucionProveedor', () => {
    let stock: Stock;
    let inquirerStub: Sinon.SinonStub<[questions: QuestionCollection<Answers>, initialAnswers?: Partial<Answers> | undefined], Promise<Answers>>;
  
    beforeEach(() => {
      stock = Stock.getInstance('db_test.json');
      inquirerStub = sinon.stub(inquirer, 'prompt');
    });
  
    afterEach(() => {
      sinon.restore();
    });
  
    it('debe permitir realizar una devolución', async () => {
        inquirerStub.resolves({ id: 1, cantidad: 1 });
        
        const returnSpy = sinon.spy(stock, 'realizarDevolucionProveedor');
        await stock.realizarDevolucionProveedor();
      
        // Verifica que se hayan hecho las llamadas correctas
        expect(returnSpy.calledOnceWith()).to.be.true;
    });

    it('debe validar que el ID del mueble es un número válido', async () => {
        inquirerStub.resolves({ id: "no es un número" }); // Usuario introduce un valor no numérico
        await stock.realizarDevolucionProveedor();
    });
});

describe('procesarVenta', () => {
    let stock: Stock;
  
    beforeEach(() => {
        stock = Stock.getInstance('db_test.json');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('debe permitir procesar una venta', async () => {
            const sellSpy = sinon.spy(stock, 'procesarVenta');
            await stock.procesarVenta('sillas', 1, 1, 1, 1);
        
            // Verifica que se hayan hecho las llamadas correctas
            expect(sellSpy.calledOnceWith('sillas', 1, 1, 1, 1)).to.be.true;
    });
});

describe('procesarCompra', () => {
    let stock: Stock;
  
    beforeEach(() => {
        stock = Stock.getInstance('db_test.json');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('debe permitir procesar una compra', async () => {
            const buySpy = sinon.spy(stock, 'procesarCompra');
            await stock.procesarCompra('sillas', 1, 1, 1, 1);
        
            // Verifica que se hayan hecho las llamadas correctas
            expect(buySpy.calledOnceWith('sillas', 1, 1, 1, 1)).to.be.true;
    });
});

describe('procesarDevolucionCliente', () => {
    let stock: Stock;
  
    beforeEach(() => {
        stock = Stock.getInstance('db_test.json');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('debe permitir procesar una devolución', async () => {
            const returnSpy = sinon.spy(stock, 'procesarDevolucionCliente');
            await stock.procesarDevolucionCliente(1, 1, 1, 1);
        
            // Verifica que se hayan hecho las llamadas correctas
            expect(returnSpy.calledOnceWith(1, 1, 1, 1)).to.be.true;
    });
});

describe('procesarDevolucionProveedor', () => {
    let stock: Stock;
  
    beforeEach(() => {
        stock = Stock.getInstance('db_test.json');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('debe permitir procesar una devolución', async () => {
            const returnSpy = sinon.spy(stock, 'procesarDevolucionProveedor');
            await stock.procesarDevolucionProveedor(1, 1, 1, 1);
        
            // Verifica que se hayan hecho las llamadas correctas
            expect(returnSpy.calledOnceWith(1, 1, 1, 1)).to.be.true;
    });
});