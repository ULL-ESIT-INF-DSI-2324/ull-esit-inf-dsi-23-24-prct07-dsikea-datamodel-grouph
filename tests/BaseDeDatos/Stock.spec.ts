import "mocha"
import { expect } from "chai";
import { Stock } from "../../src/BaseDeDatos/Stock.js";

describe('Test de Stock', () => {
    it('Creamos la clase Stock correctamente', () => {
        const stock1 = Stock.getInstance();
        expect(stock1.listarClientes()).to.equal('');
    });
});