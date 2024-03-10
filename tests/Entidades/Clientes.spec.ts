import 'mocha';
import {expect} from 'chai';
import {Cliente} from '../../src/Entidades/Clientes.js';

describe('Test Cliente', () => {
  it('Se crea un cliente con los datos correctos', () => {
    const cliente = new Cliente(1, 'Cliente 1', 666666666, 'Calle Falsa 123');
    expect(cliente.id).to.be.equal(1);
    expect(cliente.nombre).to.be.equal('Cliente 1');
    expect(cliente.contacto).to.be.equal(666666666);
    expect(cliente.direccion).to.be.equal('Calle Falsa 123');
  });
  it('Se crea un cliente con el teléfono incorrecto', () => {
    expect(() => new Cliente(1, 'Cliente 1', 66666666, 'Calle Falsa 123')).to.throw('El número de teléfono del cliente no es válido.');
  });
});

describe('Test getters y setters Cliente', () => {
    const cliente = new Cliente(1, 'Cliente 1', 666666666, 'Calle Falsa 123');
    it('Se cambia el id del cliente', () => {
        cliente.id = 2;
        expect(cliente.id).to.be.equal(2);
    });
    it('Se cambia el nombre del cliente', () => {
        cliente.nombre = 'Cliente 2';
        expect(cliente.nombre).to.be.equal('Cliente 2');
    });
    it('Se cambia el contacto del cliente', () => {
        cliente.contacto = 666666667;
        expect(cliente.contacto).to.be.equal(666666667);
    });
    it('Se cambia la dirección del cliente', () => {
        cliente.direccion = 'Calle Falsa 124';
        expect(cliente.direccion).to.be.equal('Calle Falsa 124');
    });
});

describe('Test toJSON Cliente', () => {
    const cliente = new Cliente(1, 'Cliente 1', 666666666, 'Calle Falsa 123');
    it('Se convierte a JSON', () => {
        expect(cliente.toJSON()).to.be.deep.equal({id: 1, nombre: 'Cliente 1', contacto: 666666666, direccion: 'Calle Falsa 123'});
    });
});