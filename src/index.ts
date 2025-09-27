import express, { type Express } from "express";
import { userRouter } from "./routes/user.route";
import { orderRouter } from "./routes/order.route";
import { productRouter } from "./routes/product.route";
import { mongoDB } from "./lib/connectionDB";

const app: Express = express();

const port: number = 3000;

const baseUrl: string = '/api/v1';

// Swagger setup
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerSpecs = swaggerJsdoc({
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
	apis: ['./routes/*.ts'], 
});

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use(`${baseUrl}/users`, userRouter)
app.use(`${baseUrl}/orders`, orderRouter)
app.use(`${baseUrl}/products`, productRouter)

mongoDB.then(() => {
	app.listen(port, () => {
		console.log(`Server running on ${port} port`)
	})
})