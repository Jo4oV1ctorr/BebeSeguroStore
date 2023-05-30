import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import data from './data';
import config from './config';
import userRouter from './routers/userRouter';
import orderRouter from './routers/orderRouter';

mongoose
  .connect(config.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Conectado ao mongodb com sucesso');
  })
  .catch((error) => {
    console.log(error.reason);
  });


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.get('/api/paypal/clientId', (req, res) => {
  res.send({ clientId: config.PAYPAL_CLIENT_ID });
});
app.get('/api/products', (req, res) => {	
	res.send(data.products);
});

//pedaço do código destinado a busca do produto id
//e solicitando a resposta do erro 404 do servidor 
//usei a função send para enviar os dados. E resposta do servidor para o cliente
//caso cliente não ache produto id disponivel na loja ele retorna o erro 404


app.get('/api/products/:id', (req, res) => {
	const product = data.products.find((x) => x._id === req.params.id);
	if (product) {
		res.send(product);

	} else { 

		res.status(404).send({ message: 'Produto Não Encontrado!' });	
	}
});

app.use((err, req, res, next) =>{
  const status = err.name && err.name === 'ValidationError' ? 400 : 500;
  res.status(status).send({ message: err.message });
});

app.listen(5000, () => {
	console.log('servidor aberto na porta  http://localhost:5000');
});