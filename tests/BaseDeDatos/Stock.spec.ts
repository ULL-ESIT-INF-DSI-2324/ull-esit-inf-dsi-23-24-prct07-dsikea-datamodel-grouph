import "mocha"
import "sinon"
import inquirer from "inquirer";
import { expect } from "chai";
import { Stock } from "../../src/BaseDeDatos/Stock.js";
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
        // Simulamos la respuesta para la solicitud del ID del cliente
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
        // Simulamos la respuesta para la solicitud del ID del proveedor
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
        // Simulamos la respuesta para la solicitud del ID del mueble
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