import 'mocha';
import {expect} from 'chai';
import {Silla} from '../../src/Muebles/Silla.js';

describe('Test Silla', () => {
  it('Se crea una silla con las medidas correctas', () => {
    const silla = new Silla(1, 'Silla 1', 'Silla de madera', 'Madera', {ancho: 110, alto: 100, largo: 200}, 100, true, false);
    expect(silla.id).to.be.equal(1);
    expect(silla.nombre).to.be.equal('Silla 1');
    expect(silla.descripcion).to.be.equal('Silla de madera');
    expect(silla.material).to.be.equal('Madera');
    expect(silla.dimensiones).to.be.deep.equal({ancho: 110, alto: 100, largo: 200});
    expect(silla.precio).to.be.equal(100);
    expect(silla.inclinable).to.be.equal(true);
    expect(silla.reposabrazos).to.be.equal(false);
  });
  it('Se crea una silla con las medidas incorrectas', () => {
    expect(() => new Silla(1, 'Silla 1', 'Silla de madera', 'Madera', {ancho: -110, alto: 100, largo: 200}, 100, true, false)).to.throw('Las dimensiones del mueble no pueden ser negativas.');
  });
});

describe('Test getters y setters Silla', () => {
    const silla = new Silla(1, 'Silla 1', 'Silla de madera', 'Madera', {ancho: 110, alto: 100, largo: 200}, 100, true, false);
    it('Se cambia el id de la silla', () => {
        silla.id = 2;
        expect(silla.id).to.be.equal(2);
    });
    it('Se cambia el nombre de la silla', () => {
        silla.nombre = 'Silla 2';
        expect(silla.nombre).to.be.equal('Silla 2');
    });
    it('Se cambia la descripción de la silla', () => {
        silla.descripcion = 'Silla de madera y cristal';
        expect(silla.descripcion).to.be.equal('Silla de madera y cristal');
    });
    it('Se cambia el material de la silla', () => {
        silla.material = 'Madera y cristal';
        expect(silla.material).to.be.equal('Madera y cristal');
    });
    it('Se cambian las dimensiones de la silla', () => {
        silla.dimensiones = {ancho: 120, alto: 110, largo: 210};
        expect(silla.dimensiones).to.be.deep.equal({ancho: 120, alto: 110, largo: 210});
    });
    it('Se cambia el precio de la silla', () => {
        silla.precio = 200;
        expect(silla.precio).to.be.equal(200);
    });
    it('Se cambia si la silla es inclinable', () => {
        silla.inclinable = false;
        expect(silla.inclinable).to.be.equal(false);
    });
    it('Se cambia si la silla tiene reposabrazos', () => {
        silla.reposabrazos = true;
        expect(silla.reposabrazos).to.be.equal(true);
    });
});

describe ('Test JSON Silla', () => {
    const silla = new Silla(1, 'Silla 1', 'Silla de madera', 'Madera', {ancho: 110, alto: 100, largo: 200}, 100, true, false);
    it('Se convierte a JSON', () => {
        expect(silla.toJSON()).to.be.deep.equal({id: 1, nombre: 'Silla 1', descripcion: 'Silla de madera', material: 'Madera', dimensiones: {ancho: 110, alto: 100, largo: 200}, precio: 100, inclinable: true, reposabrazos: false});
    });
});