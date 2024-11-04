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

<br/>

## Desarrollo local - levantar db de desarrollo local

### Pre requisitos

- [docker](https://docs.docker.com/engine/install/) y [docker compose](https://docs.docker.com/compose/install/)
- [cli de supabase](https://supabase.com/docs/guides/local-development/cli/getting-started)

### Instalar self hosted supabase

```
cd ${DIRECTORIO_DE_EMERGENCY_CV}
supabase login
supabase init
supabase link --project-ref nmvcsenkfqbdlfdtiqdo
supabase start
```

### Para hacer cambios en el schema

- Editar como queremos que sea en local (studio de supabase)
- Ejecutar el comando:

```
// nombre de la migracion es indicativo, no tiene nigun efecto
supabase db diff -f ${NOMBRE_DE_LA_MIGRACION}
```

- Esto generara una migracion en el local, hay que añadir esto al PR y github actions lo pondra en produccion.
