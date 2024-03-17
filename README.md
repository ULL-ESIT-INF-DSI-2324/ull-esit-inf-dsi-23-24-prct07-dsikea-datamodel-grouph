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

## Conclusiones

El desarrollo de este proyecto nos ha servido para poner en práctica los conocimientos aprendidos hasta ahora en la asignatura, aunque bien es cierto que debido a dos factores como lo son nuestra escasa lógica de programación - diseño, y la escasez de tiempo, no pudimos llevar a cabo un código que fuese algo más eficiente, legible, y menos repetitivo.

La mayor dificultad que nos encontramos fue la de decidir si cambiar el código luego de haberlo terminado, ya que creíamos que la implementación de la clase `Stock` no era correcta, pues concentraba tanto la gestión del inventario como las operaciones de la base de datos en una única clase. 
Esto nos hizo pensar más aun en lo importante que son los `principios SOLID`, como el `Single responsabily principle`, el cual sugiere que separar estas dos funciones en clases distintas, una dedicada a `Stock` y otra a la `Base de datos` podría mejorar la organización del código y su escalabilidad futura. 

Sin embargo, debido a la falta de tiempo y a lo complejo que sería refactorizar todo el código, decidimos no arriesgarnos y mantener la estructura actual, la cual funciona sin problemas, siendo concientes de que esta decisión limita claramente la flexibilidad y "claridad" del diseño a largo plazo.
Todo esto, nos hizo ver lo importante que es realizar una planificación anticipada sobre la estructura del código en los primeros momentos del desarrollo, pues **más vale prevenir, que curar**.

## Bibliografía

- []()
- []()
- []()
- []()