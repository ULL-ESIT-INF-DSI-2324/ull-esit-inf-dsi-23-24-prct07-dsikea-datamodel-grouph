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

### Interfaz Transaction

Esta interfaz define la estructura de una transacción dentro del sistema de gestión de inventario. Cada transacción captura una operación específica realizada sobre los muebles y puede representar varios tipos de movimientos financieros y de stock.

```
interface Transaction {
    id: number;
    type: 'SALE' | 'PURCHASE' | 'RETURNED_BY_CUSTOMER' | 'RETURN_TO_SUPPLIER';
    furnitureID: number;
    quantity: number;
    interactorID: number; // Cliente o Proveedor ID
    date: string;
    amount: number;
}
```

 - **id**: Un número único que identifica cada transacción dentro del sistema.
 - **type**: Un valor de tipo string que especifica el tipo de transacción. Puede ser una de las siguientes opciones:
   - `SALE`: Indica que la transacción fue una venta de mueble(s) a un cliente.
   - `PURCHASE`: Indica una compra de mueble(s) a un proveedor.
   - `RETURNED_BY_CUSTOMER`: Representa la devolución de mueble(s) por parte de un cliente.
   - `RETURN_TO_SUPPLIER`: Representa la devolución de mueble(s) a un proveedor.
 - **furnitureID**: El número de identificación del mueble al que se refiere la transacción. Este ID vincula la transacción con un mueble específico dentro del inventario.
 - **quantity**:La cantidad de unidades del mueble implicadas en la transacción.
 - **interactorID**: El ID del cliente o proveedor involucrado en la transacción. 
 - **date**:La fecha en que se realizó la transacción, representada como una *string*.
 - **amount**:El importe financiero de la transacción, reflejando el costo total de los muebles vendidos, comprados, o el valor de la devolución, según corresponda.

### Interfaz DbSchema

Antes de pasar con la pieza fundamental de nuestro sistema, debemos mencionar la siguiente interfaz:

```
interface DbSchema {
    sillas:Silla[];
    armarios:Armario[];
    mesas:Mesa[]
    proveedores: Proveedor[];
    clientes: Cliente[];
    stock: {
        [key: string]: { [id: number]: number }; // key puede ser 'sillas', 'mesas', 'armarios'
    };
    transactions: Transaction[];
}
```

Esta interfaz define la estructura que tendrá la base de datos de nuestro programa, incluye lo siguiente:

 - *Arrays* para almacenar objetos de tipos `Silla`, `Armario`, y `Mesa`, representando el inventario de muebles de la tienda.
 - *Arrays* para `proveedores` y `clientes`, conteniendo información relevante de cada uno.
 - Un objeto `stock`, que mapea identificadores de muebles a sus cantidades disponibles.
 - Un array `transactions` para registrar las transacciones realizadas, como ventas y compras.

### Stock

La clase `Stock` es la pieza fundamental de nuestro sistema de gestión. Además de llevar a cabo la gestión del inventario, también se encarga de las operaciones de la base de datos. El diseño de esta clase fue nuestra mayor preocupación, lo contamos más adelante en las `conclusiones`.

Para esta clase hemos decidido implementar el patrón de diseño `Singleton`, pues de este modo, nos aseguramos de que todas las operaciones sobre estos datos se realicen a través de una única instancia de la clase `Stock`. Además, en combinación con `Lowdb`, nos aseguraremos de que el estado del inventario persista entre diferentes sesiones de la aplicación.

 - **Propiedades:**

   - `db`: Es una instancia de Low<DbSchema>, que actúa como la base de datos de la aplicación. 
   - `instance`: Una propiedad estática que almacena la única instancia de la clase `Stock`, siguiendo el patrón Singleton.

   ```
    private db: Low<DbSchema>;
    private static instance: Stock;
   ```
- **Constructor:**

  - El constructor es privado, lo que impide crear instancias de `Stock` directamente con el operador `new`. Dentro del constructor, se inicializa la base de datos (db) con la ruta del archivo JSON especificado `dbPath`. Luego se llama al método `initializeDb()` para asegurar que la base de datos tenga una estructura inicial válida.

  ```
    private constructor(dbPath:string) {
        const adapter = new JSONFile<DbSchema>(dbPath);
    
        this.db = new Low(adapter);
        this.initializeDb();
    }
  ```
- **Métodos:**

  - **getInstance**: Es un método que permite obtener la instancia única de `Stock`. Si `instance` no ha sido inicializada, se crea una nueva instancia de `Stock` con el `dbPath` proporcionado (por defecto 'db2.json') y se asigna a instance. Este método garantiza que todas las llamadas retornarán la misma instancia de `Stock`.

  - **initializeDb**: Es un método asíncrono que lee el estado actual de la base de datos. Si es la primera vez o si está vacía (this.db.data es nulo o *undefined*), se establece una estructura de datos por defecto con listas vacías para sillas, mesas, armarios, proveedores, clientes, un objeto vacío para el stock, y una lista vacía para transacciones. Después, guarda estos cambios en el archivo JSON correspondiente para persistir el estado inicial.

  - **idEsUnico**: Verifica la unicidad del ID entre armarios, sillas y mesas para prevenir duplicados.

  - **addArmario**, **addSilla**, **addMesa**: Añaden nuevos armarios, sillas y mesas a la base de datos, respectivamente, e inicializan su stock a 10 unidades. Esto se hace de esta manera ya que al ser una tienda, no nos saldría rentable comprar unidades sueltas, por lo que el mínimo es de 10.

  - **deleteSilla**, **deleteMesa**, **deleteArmario**: Eliminan una silla, mesa o armario específicos de la base de datos y actualizan el stock.

  - **modifyMesa**, **modifyArmario**, **modifySilla**: Actualizan los detalles de una mesa, armario o silla existente, reemplazando el objeto antiguo con uno nuevo en la base de datos.

  - **getSilla**, **getMesa**, **getArmario**: Obtienen la lista completa de sillas, mesas o armarios disponibles en la base de datos.

  - **getClientes**, **getProveedores**: Obtienen la lista completa de clientes o proveedores registrados en la base de datos.

  - **addCliente**, **addProveedor**: Añaden un nuevo cliente o proveedor a la base de datos y actualizan los registros.

  - **deleteCliente**, **deleteProveedor**: Eliminan un cliente o proveedor específico de la base de datos basándose en su ID.

  - **listarMuebles**: Muestra en consola todos los muebles disponibles en la base de datos, incluyendo armarios, sillas y mesas, formateando la salida en tablas para fácil lectura. Si no hay registros, indica que no hay disponibles.

  - **listarClientes** y **listarProveedores**: Similar a listarMuebles, estos métodos muestran en forma de tabla, todos los clientes o proveedores registrados, respectivamente. Si no hay registros, notifica que no hay disponibles.

  - **añadirSilla**, **añadirMesa** y **añadirArmario**:  Interactúan con el usuario para recopilar los datos necesarios para añadir una nueva silla, mesa o armario, respectivamente. Validan que el ID sea único, crean una nueva instancia con los datos recopilados y la añaden a la base de datos haciendo uso de `addSilla`, `addMesa` o `addArmario`, respectivamente.

  - **añadirMueble**:  Ofrece al usuario elegir qué tipo de mueble desea añadir y llama al método correspondiente.

  - **eliminarMueble**: Solicita al usuario el ID del mueble a eliminar, verifica su existencia y lo elimina de la base de datos, actualizando el stock. Este método hace uso de `deleteSilla`, `deleteMesa` o `deleteArmario` según el *id* del mueble a eliminar.

  - **opcionesSiguientes**: Presenta al usuario opciones después de realizar una acción, como añadir un mueble o volver al menú principal.

  - **modificarMueblePorId**: Este método permite al usuario modificar los detalles de un mueble específico, identificado por su ID, en la base de datos. Primero, solicita al usuario el ID del mueble a modificar. Luego, verifica si el mueble existe buscando entre sillas, mesas y armarios. Si el mueble se encuentra, se le pide al usuario que introduzca los nuevos datos para ese mueble, incluyendo campos comunes como nombre, descripción, material, dimensiones y precio, y campos específicos según el tipo de mueble (por ejemplo, si es inclinable para sillas). Finalmente, se actualizan los detalles del mueble en la base de datos con la nueva información proporcionada por el usuario.

  - **añadirCliente** y **añadirProveedor**: Similar a los métodos de añadir muebles, permiten recoger datos para añadir un nuevo cliente o proveedor, validando que el ID se único.

  - **eliminarCliente** y **eliminarProveedor**: Solicitan al usuario el ID del cliente o proveedor a eliminar y proceden con la eliminación, mostrando un mensaje de confirmación.

  - **modificarClientePorID** y **modificarProveedorPorID**: Estos métodos permiten al usuario modificar los detalles de un cliente o proveedor específico en la base de datos. nicialmente, lee la base de datos y solicita el ID del cliente o proveedor a modificar. Si encuentra al cliente o proveedor, presenta un conjunto de preguntas para recoger nuevos datos, incluyendo posiblemente un nuevo ID, nombre, contacto, y dirección. Cada entrada es validada para asegurar que es correcta. Tras recoger y validar estas entradas, actualiza los detalles del cliente o proveedor en la base de datos con esta nueva información y confirma la modificación al usuario.

  - **buscarMueble**: Permite al usuario buscar muebles en la base de datos según varios criterios y ordenaciones. Inicialmente, el usuario selecciona el tipo de mueble a buscar (Silla, Mesa, Armario), el criterio de búsqueda (nombre, material, descripción), cómo ordenar los resultados (precio o descripción), y la forma de ordenación (ascendente o descendente). A continuación, se solicita al usuario el valor por el que quiere filtrar los resultados. Los resultados se filtran y ordenan según las selecciones del usuario y se muestran en formato de tabla.

  - **filtrarMuebles**: Este método filtra y ordena una lista de muebles según los criterios especificados por el usuario. Se aplica un filtro basado en un criterio y un valor clave ingresados por el usuario. La comparación es insensible a mayúsculas y minúsculas. Luego, se ordenan los muebles filtrados según el criterio de ordenación y la forma especificadas (ascendente o descendente). Este método es utilizado por el método `buscarMueble()` para obtener los muebles filtrados y ordenados.

  - **searchGenerico**: Actúa como base para los métodos de búsqueda específicos (`searchClientes` y `searchProveedores`). Presenta al usuario una interfaz para seleccionar un criterio de búsqueda y proporcionar un valor correspondiente. Después, filtra la base de datos según el tipo de entidad (clientes o proveedores) y los criterios seleccionados, mostrando los resultados en forma de tabla. 

  - **searchClientes** y **searchProveedores**: Realizan búsquedas de clientes o proveedores en la base de datos según criterios especificados.

  - **realizarVenta**: Inicia el proceso de realizar una venta solicitando al usuario que introduzca los detalles de la venta, como el ID del mueble vendido, la cantidad, el ID del cliente y el importe de la venta. Luego valida los inputs, y una vez recopilados los datos, verifica si el mueble existe y si hay suficiente stock para completar la venta invocando al método `procesarVenta`. Si es posible, procede a procesar la venta actualizando el stock y registrando la transacción.

  - **procesarVenta**: Procesa una venta actualizando el stock del mueble vendido y registrando la transacción. Verifica si hay suficiente stock para la cantidad vendida. Si no hay suficiente, informa al usuario y no procede con la venta. Si hay suficiente stock, actualiza el stock en la base de datos, registra la transacción con los detalles proporcionados y guarda los cambios en la base de datos.

  - **realizarCompra**: Inicia el proceso de realizar una compra solicitando al usuario que introduzca los detalles de la compra, como el ID del mueble comprado, la cantidad, el ID del proveedor y el importe de la compra. Luego valida los inputs, y una vez recopilados los datos, verifica si el mueble existe y luego procede a procesar la compra invocando al método `procesarCompra`. Si es posible, procede a procesar la compra actualizando el stock y registrando la transacción.

  - **procesarCompra**: Actualiza el stock del mueble comprado y registra la transacción en la base de datos. Aumenta el stock según la cantidad comprada y devuelve true si la compra fue exitosa.

  - **realizarDevolucionCliente**: Inicia el proceso de realizar una devolución por parte del cliente solicitando al usuario que introduzca los detalles de la devolución, como el ID del mueble devuelto, la cantidad, el ID del cliente y el importe de la devolución. Luego valida los inputs, y una vez recopilados los datos, verifica si el mueble existe y luego procede a procesar la devolución haciendo uso de `procesarDevolucionCliente`.

  - **procesarDevolucionCliente**: Procesa la devolución de un cliente actualizando el stock del mueble devuelto e incorporando la transacción de devolución en la base de datos. Devuelve true si la devolución se procesó correctamente.

  - **realizarDevolucionProveedor**: Inicia el proceso de realizar una devolución a un proveedor solicitando al usuario que introduzca los detalles de la devolución como el ID del mueble, la cantidad devuelta, el ID del proveedor y el importe de la devolución. Luego valida los inputs, y procede a procesar la devolución haciendo uso de `procesarDevolucionProveedor`.

  - **procesarDevolucionProveedor**: Disminuye el stock del mueble devuelto y registra la transacción de devolución al proveedor en la base de datos. Retorna true si la devolución se procesó con éxito.

  - **identificarTipoMueble**: Determina el tipo de mueble (sillas, mesas, armarios) basado en el ID proporcionado, verificando en qué colección de la base de datos se encuentra el mueble.

  - **mostrarStockDisponible**: Muestra el stock actual disponible para una categoría de muebles seleccionada por el usuario o para todas las categorías, según la elección.

  - **mueblesMasVendidos**: Identifica y muestra los muebles más vendidos basándose en las transacciones de venta registradas. Es decir, agrupa las transacciones por el ID del mueble y suma las cantidades vendidas para cada uno. Luego, ordena los muebles por la cantidad vendida y muestra un resumen de los más vendidos.

  - **convertirAFecha**: Convierte una cadena de texto que representa una fecha en el formato 'dd/mm/yyyy' a un objeto Date.

  - **fechaEnRango**: Verifica si una fecha dada está dentro de un rango especificado por una fecha de inicio y una de fin. Utiliza la función 'convertirAFecha' para convertir la cadena de texto de la fecha a un objeto Date.

  - **facturacionEnPeriodo**: Calcula y muestra la facturación total por ventas realizadas dentro de un periodo especificado por el usuario. Utiliza 'inquirer' para solicitar al usuario las fechas de inicio y fin del periodo y filtra las transacciones de tipo 'SALE' que caen dentro de este rango. Finalmente, suma los "montos" de estas transacciones y muestra el total.

  - **gestosEnPeriodo**: Calcula y muestra el total de gastos en compras realizadas dentro de un periodo especificado por el usuario. Utiliza 'inquirer' para solicitar al usuario las fechas de inicio y fin del periodo y filtra las transacciones de tipo 'PURCHASE' que caen dentro de este rango. Finalmente, suma los "montos" de estas transacciones y muestra el total.

  - **historicoTransacciones**: Muestra un histórico de transacciones realizadas, ya sea ventas a clientes o compras a proveedores, basado en la elección del usuario. Solicita al usuario que especifique si desea ver ventas o compras y el ID correspondiente al cliente o proveedor. Filtra las transacciones basadas en esta selección y muestra un resumen de las mismas.

## Conclusiones

El desarrollo de este proyecto nos ha servido para poner en práctica los conocimientos aprendidos hasta ahora en la asignatura, aunque bien es cierto que debido a dos factores como lo son nuestra escasa lógica de programación - diseño, y la escasez de tiempo, no pudimos llevar a cabo un código que fuese algo más eficiente, legible, y menos repetitivo.

La mayor dificultad que nos encontramos fue la de decidir si cambiar el código luego de haberlo terminado, ya que creíamos que la implementación de la clase `Stock` no era correcta, pues concentraba tanto la gestión del inventario como las operaciones de la base de datos en una única clase. 
Esto nos hizo pensar más aun en lo importante que son los `principios SOLID`, como el `Single responsabily principle`, el cual sugiere que separar estas dos funciones en clases distintas, una dedicada a `Stock` y otra a la `Base de datos` podría mejorar la organización del código y su escalabilidad futura. 

Sin embargo, debido a la falta de tiempo y a lo complejo que sería refactorizar todo el código, decidimos no arriesgarnos y mantener la estructura actual, la cual funciona sin problemas, siendo concientes de que esta decisión limita claramente la flexibilidad y "claridad" del diseño a largo plazo.
Todo esto, nos hizo ver lo importante que es realizar una planificación anticipada sobre la estructura del código en los primeros momentos del desarrollo, pues **más vale prevenir, que curar**.

Por último, también debemos resaltar la complejidad a la hora de realizar los `tests`, pues al tener un diseño poco "claro" y tener que interactuar con la consola en la mayoría de métodos a testear, no sabíamos muy bien como hacerlo. Sin embargo, descubrimos la herramienta `sinon` e hicimos uso de ella para simular la entrada de datos del `inquirer`. Aún así, no conseguimos llevar a cabo el cubrimiento de código que nos hubiese gustado.

## Bibliografía

- [ChatGPT](https://chat.openai.com/)
- [Inquirer.js](https://www.npmjs.com/package/inquirer)
- [Lowdb](https://www.npmjs.com/package/lowdb)
- [Tutorial básico sobre Inquirer](https://www.youtube.com/watch?v=8hbOlxGlWI8)
- [Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)