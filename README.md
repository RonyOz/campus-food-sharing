
# Campus Food Sharing API

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Backend-blue?logo=express)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen?logo=mongodb)
![Bun](https://img.shields.io/badge/Bun-Package_Manager-yellow?logo=bun)
![Coverage >80%](https://img.shields.io/badge/Coverage-%3E80%25-success?logo=jest)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-green?logo=swagger)

> **Nota:**
> Esta API facilita la compra y venta de alimentos dentro de un campus universitario, gestionando usuarios, productos y pedidos con un sistema de roles bien definido.

---

## Autores

- David Artunduaga ([@David104087](https://github.com/David104087))
- Jennifer Castro ([@JenniferCastrocd](https://github.com/JenniferCastrocd))
- Rony Ordoñez ([@RonyOz](https://github.com/RonyOz))
- Juan de la Pava ([@JuanJDlp](https://github.com/JuanJDlp))
  
---

## Despliegue

Puedes acceder a la API desplegada en producción o entorno demo aquí:

> [https://cfs-api.onrender.com/](https://cfs-api.onrender.com/)

<img src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=https://cfs-api.onrender.com/api-docs/" alt="QR code for API docs" width="140" height="140" />

## Características Principales

- **Gestión de Usuarios**: Registro, inicio de sesión y administración de perfiles de usuario.
- **Sistema de Roles**: Control de acceso granular para `buyer`, `seller` y `admin`.
- **Catálogo de Productos**: Los vendedores pueden crear, actualizar, listar y eliminar sus productos.
- **Sistema de Pedidos**: Los compradores pueden crear pedidos, y los vendedores pueden gestionar su estado (`pending`, `accepted`, `delivered`, `canceled`).
- **Seguridad**: Autenticación basada en JWT (JSON Web Tokens) para proteger las rutas.
- **Documentación de API**: Documentación completa e interactiva generada con Swagger (OpenAPI).
- **Alta Calidad de Código**: Cobertura de pruebas superior al **80%**, incluyendo pruebas unitarias y de integración.


## Stack Tecnológico

- **Backend**: Node.js, Express, TypeScript
- **Base de Datos**: MongoDB con Mongoose
- **Gestor de Paquetes**: Bun
- **Testing**: Jest
- **Autenticación**: JWT, bcrypt
- **Documentación**: Swagger (OpenAPI)

-----



---


## Puesta en Marcha

> **Tip:** Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.


### 1. Prerrequisitos

Asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v18 o superior)
- [Bun](https://bun.sh/)
- Una instancia de [MongoDB](https://www.mongodb.com/) (local o en la nube)


### 2. Instalación

```bash
# Clona el repositorio
git clone http://github.com/RonyOz/campus-food-sharing
cd campus-food-sharing

# Instala las dependencias
bun install
```

> **Nota:**
> Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables:

```env
MONGO_INITDB_ROOT_USER=
MONGO_INITDB_ROOT_PASSWORD=
MONGO_URI=
```


### 3. Ejecución

```bash
bun run start
```

El servidor se iniciará en [http://localhost:3000](http://localhost:3000).

-----


---


## Pruebas

El proyecto cuenta con una suite completa de **pruebas unitarias y de integración** para garantizar la fiabilidad y el correcto funcionamiento de la lógica de negocio.

```bash
npx jest
```

> **Cobertura:** La cobertura de código actual supera el **80%**.

-----


---


## Documentación de la API (Swagger)

La API está completamente documentada utilizando **Swagger (OpenAPI)**. Puedes explorar todos los endpoints, ver los modelos de datos y probar la API directamente desde tu navegador.

> **URL:** Una vez que el servidor esté en ejecución, accede a la documentación interactiva en:
> 
> [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

-----


---


## Resumen de Endpoints

<details>
<summary><strong>Ver tabla de endpoints principales</strong></summary>

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


</details>

---

### Ejemplo de documento `Product` (para `POST` / `PUT`):
```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "available": "boolean"
}
```

### Ejemplo de documento `Order` (para `POST`):
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