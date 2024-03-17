# Práctica 7 - DSIkea

- **Grupo H**
  - Francisco Felipe Martín Vide
  - Emilio González Díaz
  - Laura Álvarez Zamora
- Desarrollo de Sistemas Informáticos
- Grado en Ingeniería Informática
- Universidad de La Laguna


<p align="center">
    <a href = "https://coveralls.io/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct07-dsikea-datamodel-grouph?branch=main">
        <img alt = "Coverage" src="https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct07-dsikea-datamodel-grouph/badge.svg?branch=main">
    </a>
    <a href = "https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct07-dsikea-datamodel-grouph/actions/workflows/node.js.yml">
        <img alt="Github" src="https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct07-dsikea-datamodel-grouph/actions/workflows/node.js.yml/badge.svg">
    </a>
    <a href = "https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct07-dsikea-datamodel-grouph">
        <img alt = "Quality gate" src="https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct07-dsikea-datamodel-grouph&metric=alert_status">
    </a>
</p>

## Introducción y objetivos

En esta primera práctica grupal, se nos ha pedido desarrollar un diseño orientado a objetos del modelo de datos de un sistema de información destinado a gestionar una tienda de muebles. 

Para llevar a cabo este proyecto, será necesario que nos familiaricemos con los módulos `Inquirer.js` y `Lowdb`, pues serán esenciales para poder realizar una gestión de la línea de comandos de forma interactiva, y almacenar y manipular los datos de manera sencilla, con una base de datos en formato `JSON` en la que se guardará de manera local toda la información que vayamos creando en el programa.

Además, tendremos que seguir la meotodlogía `TDD` (**Test Driven Development**), lo que significa que también deberemos llevar a cabo un conjunto de pruebas unitarias para las diferentes funcionalidades del programa. 
Por último, también haremos uso de **Typedoc** para generar la documentación de nuestros métodos de forma "automática", además de otras herramientas como `c8` y `coveralls`, para llevar a cabo el cubrimiento de nuestro código y la visualización del mismo, y `Sonar Cloud` para comprobar la calidad y seguridad de el código fuente desarrollado.

El enunciado de proyecto en el que se explican todos los requisitos que debe cumplir, lo podemos encontrar [aquí](https://ull-esit-inf-dsi-2324.github.io/prct07-DSIkea-dataModel/).

## Desarrollo

### Muebles

Para representar un mueble, decimidos crear la clase abstracta `Mueble`, la cual establece la estructura base que todos los tipos de muebles del sistema deben tener, incluyendo propiedades como el `id`, `nombre`, `descripción`, `material`, `dimensiones` y `precio`. El constructor de esta clase se encargará además de validar que las dimensiones asignadas al mueble sean correctas. La clase también proporciones diferentes `getters` y `setters` para poder leer y modificar el valor de los atributos. 

Por último, tiene un método `toJSON`, que convierte las propiedades del mueble a un objeto JSON, este método nos ayudará a la hora de introducir correctamente los datos en la base de datos `db.json`.

```
export abstract class Mueble {
    constructor(protected id_: number, protected nombre_: string, protected descripcion_: string, protected material_: string,
                protected dimensiones_: IDimensiones, protected precio_: number) {
        if (dimensiones_.ancho < 0 || dimensiones_.alto < 0 || dimensiones_.largo < 0) {
            throw new Error("Las dimensiones del mueble no pueden ser negativas.");
        }
    }
}
```

Aquí podemos ver cómo funciona el método `toJSON`:

```
    toJSON() {
        return {
            id: this.id_,
            nombre: this.nombre_,
            descripcion: this.descripcion_,
            material: this.material_,
            dimensiones: this.dimensiones_,
            precio: this.precio_,
        };
    }
```

A continuación, tenemos las clases `Silla`, `Mesa` y `Armario`, las cuales extendienden de la clase `Mueble` y además de heredar todas sus propiedades y métodos, también incluyen características específicas para cada tipo.

 - **Silla**: Representa una silla. Introduce las propiedades específicas `inclinabe` y `reposabrazos`, ambas de tipo *boolean*. Es decir, sus atributos son los siguientes:

 ```
    private id_: number;
    private nombre_: string;
    private descripcion_: string;
    private material_: string;
    private dimensiones_: IDimensiones;
    private precio_: number;
    private inclinable_: boolean;
    private reposabrazos_: boolean;
 ```

 - **Mesa**: Representa una mesa. Introduce las propiedades específicas `forma` y `plegable` de tipos *string* y *boolean* respectivamente. Es decir, sus atributos son los siguieentes:

 ```
    private id_: number;
    private nombre_: string;
    private descripcion_: string;
    private material_: string;
    private dimensiones_: IDimensiones;
    private precio_: number;
    private forma_: string;
    private plegable_: boolean;
 ```

 - **Armario**: Representa un armario. Introduce las propiedades específicas `numeroPuertas` y `tieneCajones` de tipos *number* y *boolean* respectivamente. Es decir, sus atributos son los siguientes:

```
    private id_: number;
    private nombre_: string;
    private descripcion_: string;
    private material_: string;
    private dimensiones_: IDimensiones;
    private precio_: number;
    private numeroPuertas_: number;
    private tieneCajones_: boolean;
```

Por último, cabe mencionar la creación del tipo `IDimensiones`, el cual nos permitirá representar las dimensiones del mueble correctamente.

```
export type IDimensiones = {
    ancho: number;
    alto: number;
    largo: number;
}
```

### Entidades

Para representar una entidad, decidimos crear la clase abstracta `Entidad`, la cual establece la estructura base que todos los tipos de entidad interactuadora, como lo son los clientes o proveedores del sistema, deben tener. Esta clase incluye propiedades como el `id`, `nombre`, `contacto` y `dirección`. El constructor de la clase simplemente se encargará de inicializar estos atributos. 

La clase, además de proporcionar diferentes *getters* y *setters* para poder leer y modificar el valor de los atributos, también proporciona un método `validarTeléfono`, el cual comprueba mediante una expresión regular que un número de teléfono cumple con el formato esperado, es decir, que tiene 9 dígitos.

Por último, al igual que en la clase mueble, también contamos con un método `toJSON`.

A continuación, tenemos las clases `Cliente` y `Proveedor`, las cuales extienden de `Entidad` y heredan todas sus propiedades y métodos. Además, también extienden la funcionalidad de la clase base, ya que incluyen en sus constructores, la validación del número de teléfono.

 - **Cliente**: Representa a un cliente del sistema. Su constructor se ve así:

 ```
    constructor(id: number, nombre: string, contacto: number, direccion: string) {
        super(id, nombre, contacto, direccion);
        if (!this.validarTelefono(contacto)) { 
            throw new Error("El número de teléfono del cliente no es válido.");
        }
    }
 ```

 - **Proveedor**: Representa a un proveedor del sistema. Su constructor se ve así:

 ```
    constructor(id: number, nombre: string, contacto: number, direccion: string) {
        super(id, nombre, contacto, direccion);
        if (!this.validarTelefono(contacto)) { 
            throw new Error("El número de teléfono del proveedor no es válido.");
        }
    }
 ```

### Stock



## Conclusiones

El desarrollo de este proyecto nos ha servido para poner en práctica los conocimientos aprendidos hasta ahora en la asignatura, aunque bien es cierto que debido a dos factores como lo son nuestra escasa lógica de programación - diseño, y la escasez de tiempo, no pudimos llevar a cabo un código que fuese algo más eficiente, legible, y menos repetitivo.

La mayor dificultad que nos encontramos fue la de decidir si cambiar el código luego de haberlo terminado, ya que creíamos que la implementación de la clase `Stock` no era correcta, pues concentraba tanto la gestión del inventario como las operaciones de la base de datos en una única clase. 
Esto nos hizo pensar más aun en lo importante que son los `principios SOLID`, como el `Single responsabily principle`, el cual sugiere que separar estas dos funciones en clases distintas, una dedicada a `Stock` y otra a la `Base de datos` podría mejorar la organización del código y su escalabilidad futura. 

Sin embargo, debido a la falta de tiempo y a lo complejo que sería refactorizar todo el código, decidimos no arriesgarnos y mantener la estructura actual, la cual funciona sin problemas, siendo concientes de que esta decisión limita claramente la flexibilidad y "claridad" del diseño a largo plazo.
Todo esto, nos hizo ver lo importante que es realizar una planificación anticipada sobre la estructura del código en los primeros momentos del desarrollo, pues **más vale prevenir, que curar**.

## Bibliografía

- [ChatGPT](https://chat.openai.com/)
- [Inquirer.js](https://www.npmjs.com/package/inquirer)
- [Lowdb](https://www.npmjs.com/package/lowdb)
- [Tutorial básico sobre Inquirer](https://www.youtube.com/watch?v=8hbOlxGlWI8)