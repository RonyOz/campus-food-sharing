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
	},
	apis: ['./src/routes/*.ts'], 
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
	console.log('Swagger docs available at http://localhost:3000/api-docs');
};

export { specs };
