# Contribuir al proyecto

Si tienes alguna sugerencia que podría mejorar el proyecto, por favor haz un [_fork_](https://github.com/pedrolivaresanchez/emergency-cv/fork) del repositorio y crea una [_pull request_](https://github.com/pedrolivaresanchez/emergency-cv/pulls).

Aquí tienes una guía rápida:

1. Haz un [_fork_](https://github.com/pedrolivaresanchez/emergency-cv/fork) del Proyecto
2. Clona tu [_fork_](https://github.com/pedrolivaresanchez/emergency-cv/fork) (`git clone <URL del fork>`)
3. Crea tu Rama de Funcionalidad (`git checkout -b feature/CaracteristicaIncreible`)
4. Realiza tus Cambios (`git commit -m 'tipo(área): descripción corta [opcional]'`)
5. Haz Push a la Rama (`git push origin feature/CaracteristicaIncreible`)
6. Abre una [_pull request_](https://github.com/pedrolivaresanchez/emergency-cv/pulls)
7. Espera la revisión. Un mantenedor revisará tu PR, te proporcionará comentarios y lo aprobará si está listo para ser fusionado.

## Mensajes de Commit

Para mantener un historial de cambios consistente y claro, utilizamos una convención para los mensajes de commit. El formato es el siguiente:

```scss
tipo(área): descripción corta [opcional];
```

- **tipo**: indica la naturaleza del cambio. Algunos ejemplos son:
  - `feat`: una nueva característica para el proyecto.
  - `fix`: corrección de errores.
  - `docs`: cambios en la documentación.
  - `style`: cambios que no afectan la lógica del código (formato, espacios, etc.).
  - `refactor`: cambios en el código que no corrigen errores ni agregan funciones.
  - `test`: agregar o corregir pruebas.
  - `chore`: cambios en el proceso de construcción o herramientas auxiliares.
- **área**: especifica la parte del proyecto que se ve afectada (por ejemplo, un archivo o módulo).
- **descripción breve**: explica de manera concisa qué se ha hecho. Usa el modo imperativo (por ejemplo, "agrega", "corrige").
- **descripción detallada opcional**: puede incluir más detalles sobre el commit.

<br/>

**Ejemplo de mensaje de commit:**

```scss
docs(readme.md): add local install instructions;
```

Este mensaje indica que se han añadido instrucciones de instalación local en el archivo `readme.md`.

<br/>

¡Gracias por contribuir! Tu ayuda hace una gran diferencia para el proyecto.

## Desarrollo local - levantar db de desarrollo local

### Pre requisitos

- [Docker](https://docs.docker.com/engine/install/) y [Docker Compose](https://docs.docker.com/compose/install/)
- [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)

Si ya tienes cualquiera de los dos, **actualizalos para evitar errores**.

Si usas docker desktop en Windows, esta es la configuración que deberías tener.
<img src="https://supabase.com/docs/_next/image?url=%2Fdocs%2Fimg%2Fguides%2Fcli%2Fdocker-win.png&w=3840&q=75&dpl=dpl_EU6MXvnLKJuwyo4VfbBx9GiJt9Qx" style="margin: 10px 0px; width: 55rem;">

### Iniciar supabase en local

Entramos en la carpeta del repositorio

```bash
cd ${DIRECTORIO_DE_EMERGENCY_CV}
```

Iniciamos la base de datos (**tener docker encendido**)

```bash
supabase start
```

Si no vemos las tablas ni los datos de ejemplo cargados podemos refrescar la base de datos con:

```bash
supabase db reset
```

### Hacer cambios en el schema

#### Crear migracion automatica

Nos interesa usar esta opción, cuando queremos **editar la base de datos desde el studio web**

Cuando acabemos de realizar los cambios en el studio web, ejecutaremos el siguiente comando para generar la migration.

```bash
supabase db diff -f nombre_migracion
```

#### Crear migración manual

Nos interesa usar esta opción, cuando queremos **editar la base de datos con codigo SQL manual**.

Primero, creamos la el archivo migration con

```bash
supabase migration new nombre_migracion
```

Se creara un **nuevo fichero** con el nombre que hemos usado **en supabase/migrations**

En ese archivo añadiremos todo el código SQL que necesitemos

Si queremos visualizar nuestros cambios en local, podemos usar

```bash
supabase db reset
```

<br>
La migration que generemos, la añadiremos en el PR.
