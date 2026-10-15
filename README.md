# API de gestión de productos

API REST para administrar un catálogo de productos, construida con Node.js y Express como proyecto final del módulo de Node.js.

Permite consultar, crear, modificar y eliminar productos, con búsqueda, filtros, paginación, validación de datos y protección de las operaciones de escritura mediante API key.

**API desplegada:** _(pendiente)_

## Tecnologías

- Node.js 20 o superior
- Express 5
- Persistencia en archivo JSON
- Postman para las pruebas

## Instalación y ejecución en local

1. Clona el repositorio e instala las dependencias:

   ```bash
   npm install
   ```

2. Crea el archivo `.env` a partir de la plantilla y pon tu propia clave:

   ```bash
   cp .env.example .env
   ```

   Puedes generar una clave aleatoria con:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. Arranca el servidor en modo desarrollo:

   ```bash
   npm run dev
   ```

   La API queda disponible en `http://localhost:3000`.

### Variables de entorno

| Variable | Obligatoria | Descripción |
|---|---|---|
| `API_KEY` | Sí | Clave necesaria para crear, modificar y eliminar productos. Sin ella, el servidor no arranca. |
| `PORT` | No | Puerto del servidor. Por defecto, `3000`. |

## Endpoints

| Método | Ruta | Descripción | Requiere API key |
|---|---|---|---|
| GET | `/` | Comprueba que la API está activa | No |
| GET | `/productos` | Lista los productos, con filtros y paginación | No |
| GET | `/productos/:id` | Obtiene un producto | No |
| POST | `/productos` | Crea un producto | Sí |
| PUT | `/productos/:id` | Modifica uno o varios campos de un producto | Sí |
| DELETE | `/productos/:id` | Elimina un producto | Sí |

### Parámetros de `GET /productos`

Todos son opcionales y se pueden combinar.

| Parámetro | Ejemplo | Descripción |
|---|---|---|
| `buscar` | `?buscar=pizza` | Productos cuyo nombre contiene el texto |
| `categoria` | `?categoria=bebidas` | Productos de esa categoría |
| `precioMin` | `?precioMin=2` | Precio mayor o igual |
| `precioMax` | `?precioMax=5` | Precio menor o igual |
| `pagina` | `?pagina=2` | Página a mostrar. Por defecto, 1 |
| `limite` | `?limite=5` | Productos por página. Por defecto, 10; máximo, 50 |

### Autenticación

Las rutas de escritura requieren la cabecera:

```
x-api-key: <tu clave>
```

Sin ella, o con una clave incorrecta, la API responde `401 No autorizado`.

### Datos de un producto

| Campo | Tipo | Reglas |
|---|---|---|
| `nombre` | texto | Obligatorio, máximo 100 caracteres |
| `categoria` | texto | Obligatorio. Se guarda en minúsculas |
| `precio` | número | Obligatorio, mayor que 0 |
| `stock` | número entero | Obligatorio, mayor o igual que 0 |

En `PUT` solo se envían los campos que se quieren cambiar.

## Formato de las respuestas

Respuesta correcta:

```json
{
  "success": true,
  "data": { "id": 3, "nombre": "Hamburguesa clásica", "categoria": "comidas", "precio": 8.75, "stock": 30 }
}
```

`GET /productos` incluye además la información de paginación:

```json
"paginacion": { "pagina": 1, "limite": 10, "total": 12, "totalPaginas": 2 }
```

Respuesta de error:

```json
{
  "success": false,
  "error": "Datos inválidos",
  "detalles": ["precio debe ser un número mayor que 0"]
}
```

| Código | Significado |
|---|---|
| 200 | Correcto |
| 201 | Producto creado |
| 400 | Datos o parámetros inválidos |
| 401 | Falta la API key o es incorrecta |
| 404 | El producto o la ruta no existen |
| 500 | Error interno del servidor |

## Pruebas con Postman

La colección está en `postman/node29-API-Productos.postman_collection.json`. Las peticiones están organizadas en dos carpetas: `Lectura` (públicas) y `Escritura` (requieren API key). Incluye también ejemplos de errores (400, 401 y 404).

Para usarla:

1. En Postman, pulsa **Import** y selecciona el archivo de la colección.
2. Crea un entorno (*Environments*) con la variable `apiKey` y tu clave como valor. La clave no está incluida en la colección por seguridad.
3. Selecciona ese entorno en el desplegable de la esquina superior derecha.
4. La colección usa la variable `baseUrl`, que apunta a `http://localhost:3000`. Para probar la API desplegada, cambia su valor por la dirección pública.

## Estructura del proyecto

```
node29/
├── server.js              Punto de entrada
├── routes/                Rutas y middlewares de cada ruta
├── controllers/           Lógica de cada endpoint
├── middlewares/           Registro, API key, validación y errores
├── models/                Acceso a los datos
├── utils/                 Funciones compartidas
├── data/                  Datos iniciales (semilla)
└── postman/               Colección de Postman
```

## Limitaciones conocidas

- Los datos se guardan en un archivo JSON. Es suficiente para un proyecto de aprendizaje, pero no admite bien escrituras simultáneas; un entorno real usaría una base de datos.
- En el plan gratuito de Render el disco no es persistente: al reiniciarse el servicio, los cambios se pierden y la API vuelve a los datos iniciales.
- La protección con una única API key sirve para separar lectura y escritura, pero no distingue entre usuarios.

## Autora

Nuria Ruiz de Azua Montero