import express, { type Express } from "express";
import { mongoDB } from "./lib/connectionDB";
import { authRouter, orderRouter, productRouter, userRouter, sellerRouter, adminRouter } from "./routes";
import { setupSwagger } from "./lib/swagger";
import { auth, authorizeRoles } from "./middlewares/auth.middleware";

const app: Express = express();
const port: number = 3000;
const baseUrl: string = '/api/v1';

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
	const { method, originalUrl, body, query, params } = req;
	const start = Date.now();

	res.on('finish', () => {
		const duration = Date.now() - start;
		console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} - Status: ${res.statusCode} - ${duration}ms`);
	});

	next();
});

// Setup Swagger
setupSwagger(app);

// Routes
app.use(`${baseUrl}/auth`, authRouter)
app.use(`${baseUrl}/users`, userRouter)
app.use(`${baseUrl}/orders`, orderRouter)
app.use(`${baseUrl}/products`, productRouter)
app.use(`${baseUrl}/seller`, sellerRouter)
app.use(`${baseUrl}/admin`, auth, authorizeRoles(['admin']), adminRouter)

mongoDB.then(() => {
	app.listen(port, () => {
		console.log(`Server running on ${port} port`)
	})
})