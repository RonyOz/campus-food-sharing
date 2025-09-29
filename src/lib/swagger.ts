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
						_id: { type: 'string', example: '6512f1c2e1b2a3c4d5e6f7a8' },
						username: { type: 'string', example: 'Juan Perez' },
						email: { type: 'string', example: 'juan@example.com' },
						role: { type: 'string', example: 'buyer' },
					},
				},
			},
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
