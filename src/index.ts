import express, { type Express } from "express";
import { mongoDB } from "./lib/connectionDB";
import { orderRouter, productRouter, userRouter } from "./routes";

const swaggerUi = require('swagger-ui-express');

const app: Express = express();
const port: number = 3000;
const baseUrl: string = '/api/v1';

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use(`${baseUrl}/users`, userRouter)
app.use(`${baseUrl}/orders`, orderRouter)
app.use(`${baseUrl}/products`, productRouter)

mongoDB.then(() => {
	app.listen(port, () => {
		console.log(`Server running on ${port} port`)
	})
})