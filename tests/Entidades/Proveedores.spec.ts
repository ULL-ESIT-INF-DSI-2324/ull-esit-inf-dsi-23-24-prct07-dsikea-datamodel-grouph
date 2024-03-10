import 'mocha';
import {expect} from 'chai';
import {Proveedor} from '../../src/Entidades/Proveedores.js';

describe('Test Proveedor', () => {
  it('Se crea un proveedor con los datos correctos', () => {
    const proveedor = new Proveedor(1, 'Proveedor 1', 666666666, 'Calle Falsa 123');
    expect(proveedor.id).to.be.equal(1);
    expect(proveedor.nombre).to.be.equal('Proveedor 1');
    expect(proveedor.contacto).to.be.equal(666666666);
    expect(proveedor.direccion).to.be.equal('Calle Falsa 123');
  });
  it('Se crea un proveedor con el teléfono incorrecto', () => {
    expect(() => new Proveedor(1, 'Proveedor 1', 66666666, 'Calle Falsa 123')).to.throw('El número de teléfono del proveedor no es válido.');
  });
});

describe('Test getters y setters Proveedor', () => {
    const proveedor = new Proveedor(1, 'Proveedor 1', 666666666, 'Calle Falsa 123');
    it('Se cambia el id del proveedor', () => {
        proveedor.id = 2;
        expect(proveedor.id).to.be.equal(2);
    });
    it('Se cambia el nombre del proveedor', () => {
        proveedor.nombre = 'Proveedor 2';
        expect(proveedor.nombre).to.be.equal('Proveedor 2');
    });
    it('Se cambia el contacto del proveedor', () => {
        proveedor.contacto = 666666667;
        expect(proveedor.contacto).to.be.equal(666666667);
    });
    it('Se cambia la dirección del proveedor', () => {
        proveedor.direccion = 'Calle Falsa 124';
        expect(proveedor.direccion).to.be.equal('Calle Falsa 124');
    });
});

describe ('Test toJSON Proveedor', () => {
    const proveedor = new Proveedor(1, 'Proveedor 1', 666666666, 'Calle Falsa 123');
    it('Se convierte a JSON', () => {
        expect(proveedor.toJSON()).to.be.deep.equal({id: 1, nombre: 'Proveedor 1', contacto: 666666666, direccion: 'Calle Falsa 123'});
    });
});