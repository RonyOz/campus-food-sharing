import express, { type Express } from "express";
import { userRouter } from "./routes/user.route";
import { orderRouter } from "./routes/order.route";
import { productRouter } from "./routes/product.route";

const app: Express = express();

const port: number = 3000;

const baseUrl: string = '/api/v1';

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use(`${baseUrl}/users`, userRouter)
app.use(`${baseUrl}/orders`, orderRouter)
app.use(`${baseUrl}/products`, productRouter)

app.listen(port, ()=>{
    console.log(`Server running on ${port} port`)
})


// db.then(()=>{
//     app.listen(port, ()=>{
//         console.log(`Server running on ${port} port`)
//     })
// })