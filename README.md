# Pokédex Explorer

Aplicación móvil del taller de consumo de API con React Native y Expo. El proyecto parte de la plantilla blank y mantiene las consultas de red separadas de la interfaz.

## Estructura prevista

```text
Pok-Dex-Explorer/
|-- App.js
|-- app.json
|-- index.js
|-- package.json
|-- package-lock.json
|-- .gitignore
|-- assets/
|-- src/
    |-- components/
    |-- screens/
    |-- services/
```

- `App.js`: punto de entrada visual de la aplicación.
- `index.js`: registra el componente principal para que Expo inicie la app.
- `app.json`: configura el nombre y los recursos de Expo.
- `package.json` y `package-lock.json`: describen y fijan las dependencias instaladas.
- `.gitignore`: evita incluir dependencias y archivos locales generados.
- `src/components/`: componentes reutilizables de la interfaz.
- `src/screens/`: vistas de lista y detalle de Pokémon.
- `src/services/`: funciones que consultan PokéAPI, separadas de la interfaz.
- `assets/`: recursos gráficos del proyecto.

Las carpetas dentro de `src/` se crearán junto con los archivos de sus respectivas partes, para que el repositorio no tenga directorios vacíos.
