import { expect } from "chai";
import "mocha";
import { suma } from '../src/ejercicio-1.js'
describe("Ejercicio 1", () => {
  it("should return the sum of the numbers", () => {
    expect(suma(1, 2)).to.equal(3);
  });
});
