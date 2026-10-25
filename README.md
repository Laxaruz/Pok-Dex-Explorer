# PokéDex Explorer

Aplicación móvil del taller de consumo de API con React Native, Expo y JavaScript. Consulta [PokéAPI](https://pokeapi.co/) con `fetch`, muestra Pokémon en una cuadrícula y permite buscarlos y abrir su ficha.

## Ejecutar el proyecto

Se necesita Node.js, npm y Expo Go en un teléfono, o un emulador Android.

```bash
npm ci
npx expo start
```

Con Expo Go se escanea el QR que muestra Expo. En un emulador Android se puede presionar `a` desde la terminal de Expo. La aplicación necesita conexión a Internet para consultar la API y cargar las imágenes.

## Funciones

- La lista consulta 20 Pokémon al iniciar y los presenta en dos columnas, con imagen oficial, número de tres dígitos y nombre. En pantalla solo se ven las tarjetas que caben; los demás aparecen al desplazarse.
- Al acercarse al final de los 20 Pokémon cargados, `FlatList` pide los siguientes 20 con `limit=20` y el siguiente `offset`. Un indicador muestra la carga; si falla, se puede reintentar la misma página.
- La búsqueda acepta nombre o número y elimina los espacios de los extremos e ignora mayúsculas. Un 404 muestra el estado sin coincidencias; otros errores permiten reintentar.
- Al tocar una tarjeta se abre la ficha con imagen, tipos, altura en metros, peso en kilogramos y seis estadísticas base. Un botón regresa a la lista.
- La lista y la ficha distinguen carga, error y resultado. La lista también muestra un estado vacío.

## Organización del código

```text
Pok-Dex-Explorer/
├── App.js
├── index.js
├── app.json
├── package.json
├── package-lock.json
├── assets/
├── src/
│   ├── components/
│   │   └── PokemonCard.js
│   ├── screens/
│   │   ├── PokemonDetailScreen.js
│   │   └── PokemonListScreen.js
│   ├── services/
│   │   └── pokemonApi.js
│   └── utils/
│       └── pagination.js
└── docs/
    └── evidencias/
```

| Archivo o carpeta | Responsabilidad |
| --- | --- |
| `App.js` | Coordina la lista, búsqueda, paginación, selección y estados de carga o error. |
| `index.js` y `app.json` | Registran la app y definen la configuración de Expo. |
| `src/components/PokemonCard.js` | Presenta cada tarjeta y abre su ficha al tocarla. |
| `src/screens/PokemonListScreen.js` | Muestra la búsqueda, la cuadrícula y el indicador o error al cargar más. |
| `src/screens/PokemonDetailScreen.js` | Muestra la ficha y convierte medidas y estadísticas para la interfaz. |
| `src/services/pokemonApi.js` | Realiza las consultas de lista y detalle; comprueba `response.ok` antes de leer JSON. |
| `src/utils/pagination.js` | Une páginas sin repetir Pokémon según su URL. |
| `assets/` | Guarda los recursos gráficos locales de Expo. |
| `docs/` | Contiene las [capturas de evidencia](docs/evidencias/README.md) del taller. |

La red está en `src/services/`, separada del JSX y los estilos. Las pantallas se encargan de mostrar datos; `App.js` decide cuándo consultar y qué estado presentar. La utilidad de paginación evita duplicados sin mezclar esa regla con la interfaz. Esta separación permite explicar y comprobar cada parte por separado.

## API y estados

| Consulta | Uso |
| --- | --- |
| `GET /pokemon?limit=20&offset=0` | Primera página de la lista. |
| `GET /pokemon?limit=20&offset={n}` | Páginas siguientes; el desplazamiento avanza solo después de una respuesta correcta. |
| `GET /pokemon/{nombre o id}` | Búsqueda y ficha de detalle. |

PokéAPI devuelve 404 con texto plano cuando no existe un nombre. Por eso el servicio revisa `response.ok` antes de llamar `response.json()`. La búsqueda distingue ese caso de una falla de red o del servidor. La imagen de una tarjeta se obtiene del identificador al final de su URL, sin solicitar el detalle completo de cada elemento de la lista.

## Evidencias

Las [capturas tomadas en Expo Go](docs/evidencias/README.md) documentan la lista inicial, la búsqueda de Raichu por número y la ficha de Charmeleon.

## Reparto del trabajo

| Avance | Responsable | Entrega |
| --- | --- | --- |
| 1 | Kevin | Base Expo y estructura inicial. |
| 2 | Kevin | Servicio de consultas a PokéAPI. |
| 3 | Jhoseth | Lista inicial de 20 Pokémon. |
| 4 | Kevin | Ficha básica desde la lista. |
| 5 | Jhoseth | Búsqueda por nombre o número. |
| 6 | Kevin | Tipos, medidas y estadísticas del detalle. |
| 7 | Jhoseth | Paginación de 20 en 20. |
| 8 | Jhoseth | Documentación y evidencias. |
