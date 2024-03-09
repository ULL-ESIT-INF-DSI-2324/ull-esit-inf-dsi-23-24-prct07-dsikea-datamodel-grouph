import 'mocha';
import {expect} from 'chai';
import {Mesa} from '../../src/Muebles/Mesa.js';

describe('Test Mesa', () => {
  it('Se crea una mesa con las medidas correctas', () => {
    const mesa = new Mesa(1, 'Mesa 1', 'Mesa de madera', 'Madera', {ancho: 110, alto: 100, largo: 200}, 100, 'Redonda', true);
    expect(mesa.id).to.be.equal(1);
    expect(mesa.nombre).to.be.equal('Mesa 1');
    expect(mesa.descripcion).to.be.equal('Mesa de madera');
    expect(mesa.material).to.be.equal('Madera');
    expect(mesa.dimensiones).to.be.deep.equal({ancho: 110, alto: 100, largo: 200});
    expect(mesa.precio).to.be.equal(100);
    expect(mesa.forma).to.be.equal('Redonda');
    expect(mesa.plegable).to.be.equal(true);
  });
  it('Se crea una mesa con las medidas incorrectas', () => {
    expect(() => new Mesa(1, 'Mesa 1', 'Mesa de madera', 'Madera', {ancho: -110, alto: 100, largo: 200}, 100, 'Redonda', true)).to.throw('Las dimensiones del mueble no pueden ser negativas.');
  });
});

describe('Test getters y setters Mesa', () => {
    const mesa = new Mesa(1, 'Mesa 1', 'Mesa de madera', 'Madera', {ancho: 110, alto: 100, largo: 200}, 100, 'Redonda', true);
    it('Se cambia el id de la mesa', () => {
        mesa.id = 2;
        expect(mesa.id).to.be.equal(2);
    });
    it('Se cambia el nombre de la mesa', () => {
        mesa.nombre = 'Mesa 2';
        expect(mesa.nombre).to.be.equal('Mesa 2');
    });
    it('Se cambia la descripción de la mesa', () => {
        mesa.descripcion = 'Mesa de madera y cristal';
        expect(mesa.descripcion).to.be.equal('Mesa de madera y cristal');
    });
    it('Se cambia el material de la mesa', () => {
        mesa.material = 'Madera y cristal';
        expect(mesa.material).to.be.equal('Madera y cristal');
    });
    it('Se cambian las dimensiones de la mesa', () => {
        mesa.dimensiones = {ancho: 120, alto: 110, largo: 210};
        expect(mesa.dimensiones).to.be.deep.equal({ancho: 120, alto: 110, largo: 210});
    });
    it('Se cambia el precio de la mesa', () => {
        mesa.precio = 200;
        expect(mesa.precio).to.be.equal(200);
    });
    it('Se cambia el número de sillas de la mesa', () => {
        mesa.forma = 'Cuadrada';
        expect(mesa.forma).to.be.equal('Cuadrada');
    });
    it('Se cambia si la mesa es plegable', () => {
        mesa.plegable = false;
        expect(mesa.plegable).to.be.equal(false);
    });
});