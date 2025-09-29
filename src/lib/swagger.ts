import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import type { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Campus Food Sharing API',
      version: '1.0.0',
      description: 'API para la gestión de usuarios, productos y pedidos.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: "ID único del usuario", example: '6512f1c2e1b2a3c4d5e6f7a8' },
            username: { type: 'string', description: "Nombre del usuario", example: 'Juan Perez' },
            email: { type: 'string', format: 'email', description: "Correo electrónico del usuario", example: 'juan@example.com' },
            role: { type: 'string', enum: ['admin', 'seller', 'buyer'], description: "Rol del usuario", example: 'buyer' },
          },
        },
        Product: {
            type: 'object',
            properties: {
                _id: { type: 'string', description: "ID único del producto", example: '652a9b4b9b7e4a5b6c7d8e9f' },
                name: { type: 'string', description: "Nombre del producto", example: 'Hamburguesa Clásica' },
                sellerId: { type: 'string', description: "ID del vendedor", example: '6512f1c2e1b2a3c4d5e6f7a8' },
                description: { type: 'string', description: "Descripción del producto", example: 'Carne de 150g, queso, lechuga y tomate' },
                price: { type: 'number', format: 'float', description: "Precio del producto", example: 12.50 },
                available: { type: 'boolean', description: "Disponibilidad del producto", example: true },
            }
        },
        OrderItem: {
            type: 'object',
            properties: {
                productId: { type: 'string', description: "ID del producto", example: '652a9b4b9b7e4a5b6c7d8e9f' },
                quantity: { type: 'number', description: "Cantidad del producto", example: 2 },
            }
        },
        Order: {
            type: 'object',
            properties: {
                _id: { type: 'string', description: "ID único del pedido", example: '652aa0b7b3e8c1f4a5b6c7d8' },
                buyerId: { type: 'string', description: "ID del comprador", example: '6512f1c2e1b2a3c4d5e6f7a8' },
                items: {
                    type: 'array',
                    description: "Lista de productos en el pedido",
                    items: {
                        $ref: '#/components/schemas/OrderItem'
                    }
                },
                status: { type: 'string', enum: ['pending', 'accepted', 'delivered', 'canceled'], description: "Estado actual del pedido", example: 'pending' },
                createdAt: { type: 'string', format: 'date-time', description: 'Fecha de creación' },
                updatedAt: { type: 'string', format: 'date-time', description: 'Última actualización' },
            }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token de autenticación JWT'
        }
      }
    },
  },
  apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
	console.log('Swagger docs available at http://localhost:3000/api-docs');
};

export { specs };
