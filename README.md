# Campus Food Sharing API

Bienvenido a la API de Campus Food Sharing, una plataforma backend robusta construida con Node.js, Express, TypeScript y MongoDB. Esta API está diseñada para facilitar la compra y venta de alimentos dentro de un campus, gestionando usuarios, productos y pedidos con un sistema de roles bien definido.

## Características Principales

  * **Gestión de Usuarios**: Registro, inicio de sesión y administración de perfiles de usuario.
  * **Sistema de Roles**: Control de acceso granular para `buyer`, `seller` y `admin`.
  * **Catálogo de Productos**: Los vendedores pueden crear, actualizar, listar y eliminar sus productos.
  * **Sistema de Pedidos**: Los compradores pueden crear pedidos, y los vendedores pueden gestionar su estado (`pending`, `accepted`, `delivered`, `canceled`).
  * **Seguridad**: Autenticación basada en JWT (JSON Web Tokens) para proteger las rutas.
  * **Documentación de API**: Documentación completa y interactiva generada con Swagger (OpenAPI).
  * **Alta Calidad de Código**: Cobertura de pruebas superior al **80%**, incluyendo pruebas unitarias y de integración.

##  Stack Tecnológico

  * **Backend**: Node.js, Express, TypeScript
  * **Base de Datos**: MongoDB con Mongoose
  * **Gestor de Paquetes**: Bun
  * **Testing**: Jest
  * **Autenticación**: JWT, bcrypt
  * **Documentación**: Swagger (OpenAPI)

-----

## Puesta en Marcha

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### **1. Prerrequisitos**

Asegúrate de tener instalado lo siguiente:

  * [Node.js](https://nodejs.org/) (v18 o superior)
  * [Bun](https://bun.sh/)
  * Una instancia de [MongoDB](https://www.mongodb.com/) (local o en la nube)

### **2. Instalación**

1.  **Clona el repositorio:**

    ```bash
    git clone http://github.com/RonyOz/campus-food-sharing
    cd campus-food-sharing
    ```

2.  **Instala las dependencias:**

    ```bash
    bun install
    ```

3.  **Configura las variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables:

    ```env

    MONGO_INITDB_ROOT_USER=
    MONGO_INITDB_ROOT_PASSWORD=
    MONGO_URI=

    ```

### **3. Ejecución**

Para iniciar el servidor en modo de desarrollo, ejecuta el siguiente comando:

```bash
bun run start
```

El servidor se iniciará en `http://localhost:3000`.

-----

##  Pruebas

El proyecto cuenta con una suite completa de **pruebas unitarias y de integración** para garantizar la fiabilidad y el correcto funcionamiento de la lógica de negocio.

Para ejecutar todas las pruebas, utiliza el siguiente comando:

```bash
npx jest
```

La cobertura de código actual supera el **80%**, asegurando una alta calidad en el proyecto.

-----

##  Documentación de la API (Swagger)

La API está completamente documentada utilizando **Swagger (OpenAPI)**. Puedes explorar todos los endpoints, ver los modelos de datos y probar la API directamente desde tu navegador.

Una vez que el servidor esté en ejecución, accede a la documentación interactiva en la siguiente URL:

️ **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

-----

##  Resumen de Endpoints

A continuación se muestra una descripción general de los endpoints disponibles. Para ver los detalles completos de los cuerpos de solicitud (`request body`) y las respuestas, consulta la [documentación de Swagger](http://localhost:3000/api-docs).

### Auth

| Método | Endpoint         | Descripción                                  | Acceso  |
| :----- | :--------------- | :------------------------------------------- | :------ |
| `POST` | `/auth/signup`   | Registra un nuevo usuario (rol por defecto: `buyer`). | Público |
| `POST` | `/auth/login`    | Inicia sesión y devuelve un token JWT.       | Público |
| `GET`  | `/auth/profile`  | Obtiene el perfil del usuario autenticado.   | Logueado|

-----

### Users

| Método | Endpoint         | Descripción                           | Acceso  |
| :----- | :--------------- | :------------------------------------ | :------ |
| `GET`  | `/users`         | Lista todos los usuarios.             | Admin   |
| `GET`  | `/users/{id}`    | Obtiene un usuario por su ID.         | Logueado|
| `PUT`  | `/users/{id}`    | Actualiza un usuario por su ID.       | Logueado|
| `DELETE`| `/users/{id}`    | Elimina un usuario por su ID.         | Admin   |

-----

### Products

| Método | Endpoint         | Descripción                                    | Acceso        |
| :----- | :--------------- | :--------------------------------------------- | :------------ |
| `GET`  | `/products`      | Lista todos los productos disponibles.         | Público       |
| `POST` | `/products`      | Crea un nuevo producto.                        | Seller, Admin |
| `GET`  | `/products/{id}` | Obtiene un producto por su ID.                 | Público       |
| `PUT`  | `/products/{id}` | Actualiza un producto por su ID.               | Seller, Admin |
| `DELETE`| `/products/{id}` | Elimina un producto por su ID.                 | Seller, Admin |

  * **Documento `Product` (para `POST` / `PUT`):**
    ```json
    {
      "name": "string",
      "description": "string",
      "price": "number",
      "available": "boolean"
    }
    ```

-----

### Orders

| Método | Endpoint             | Descripción                                   | Acceso        |
| :----- | :------------------- | :-------------------------------------------- | :------------ |
| `GET`  | `/orders`            | Lista todos los pedidos.                      | Admin         |
| `POST` | `/orders`            | Crea un nuevo pedido.                         | Buyer         |
| `GET`  | `/orders/{id}`       | Obtiene un pedido por su ID.                  | Involucrados  |
| `PUT`  | `/orders/{id}/status`| Actualiza el estado de un pedido.             | Seller, Admin |
| `DELETE`| `/orders/{id}`       | Cancela un pedido.                            | Involucrados  |

  * **Documento `Order` (para `POST`):**
    ```json
    {
      "items": [
        {
          "productId": "string (ObjectId)",
          "quantity": "number"
        }
      ]
    }
    ```

-----

### Seller

| Método | Endpoint         | Descripción                                    | Acceso  |
| :----- | :--------------- | :--------------------------------------------- | :------ |
| `GET`  | `/seller`        | Lista todos los usuarios con rol `seller`.     | Público |
| `GET`  | `/seller/{id}`   | Obtiene el perfil público de un vendedor.      | Público |

-----

### Admin

| Método | Endpoint         | Descripción                           | Acceso  |
| :----- | :--------------- | :------------------------------------ | :------ |
| `POST` | `/admin/user`    | Crea un usuario con un rol específico.| Admin   |