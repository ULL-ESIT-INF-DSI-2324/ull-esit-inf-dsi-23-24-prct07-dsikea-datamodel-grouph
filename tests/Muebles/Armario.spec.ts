import 'mocha';
import {expect} from 'chai';
import {Armario} from '../../src/Muebles/Armario.js';

describe('Test Armario', () => {
  it('Se crea un armario con las medidas correctas', () => {
    const armario = new Armario(1, 'Armario 1', 'Armario de madera', 'Madera', {ancho: 110, alto: 100, largo: 200}, 100, 2, false);
    expect(armario.id).to.be.equal(1);
    expect(armario.nombre).to.be.equal('Armario 1');
    expect(armario.descripcion).to.be.equal('Armario de madera');
    expect(armario.material).to.be.equal('Madera');
    expect(armario.dimensiones).to.be.deep.equal({ancho: 110, alto: 100, largo: 200});
    expect(armario.precio).to.be.equal(100);
    expect(armario.numeroPuertas).to.be.equal(2);
    expect(armario.tieneCajones).to.be.equal(false);
  });
  it('Se crea un armario con las medidas incorrectas', () => {
    expect(() => new Armario(1, 'Armario 1', 'Armario de madera', 'Madera', {ancho: -110, alto: 100, largo: 200}, 100, 2, false)).to.throw('Las dimensiones del mueble no pueden ser negativas.');
  });
});

describe('Test getters y setters Armario', () => {
    const armario = new Armario(1, 'Armario 1', 'Armario de madera', 'Madera', {ancho: 110, alto: 100, largo: 200}, 100, 2, false);
    it('Se cambia el id del armario', () => {
        armario.id = 2;
        expect(armario.id).to.be.equal(2);
    });
    it('Se cambia el nombre del armario', () => {
        armario.nombre = 'Armario 2';
        expect(armario.nombre).to.be.equal('Armario 2');
    });
    it('Se cambia la descripción del armario', () => {
        armario.descripcion = 'Armario de madera y cristal';
        expect(armario.descripcion).to.be.equal('Armario de madera y cristal');
    });
    it('Se cambia el material del armario', () => {
        armario.material = 'Madera y cristal';
        expect(armario.material).to.be.equal('Madera y cristal');
    });
    it('Se cambian las dimensiones del armario', () => {
        armario.dimensiones = {ancho: 120, alto: 110, largo: 210};
        expect(armario.dimensiones).to.be.deep.equal({ancho: 120, alto: 110, largo: 210});
    });
    it('Se cambia el precio del armario', () => {
        armario.precio = 200;
        expect(armario.precio).to.be.equal(200);
    });
    it('Se cambia el número de puertas del armario', () => {
        armario.numeroPuertas = 3;
        expect(armario.numeroPuertas).to.be.equal(3);
    });
    it('Se cambia si el armario tiene cajones', () => {
        armario.tieneCajones = true;
        expect(armario.tieneCajones).to.be.equal(true);
    });
});

describe ('Test JSON Armario', () => {
    const armario = new Armario(1, 'Armario 1', 'Armario de madera', 'Madera', {ancho: 110, alto: 100, largo: 200}, 100, 2, false);
    it('Se convierte a JSON', () => {
        expect(armario.toJSON()).to.be.deep.equal({id: 1, nombre: 'Armario 1', descripcion: 'Armario de madera', material: 'Madera', dimensiones: {ancho: 110, alto: 100, largo: 200}, precio: 100, numeroPuertas: 2, tieneCajones: false});
    });
});