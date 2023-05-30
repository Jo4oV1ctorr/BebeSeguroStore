 //criando rota de função
 //caminho de fluxo de tela entre tela deslogada para tela logada
 //todas as telas da aplicação se baseia dentro deste arquivo 

import CartScreen from './screens/CartScreen';
import HomeScreen from './screens/HomeScreen.js';
import ProductScreen from './screens/ProductScreen.js';
import { parseRequestUrl, showLoading, hideLoading } from './utils.js';
import Error404Screen from './screens/Error404Screen.js';
import SigninScreen from './screens/SigninScreen';
import Header from './components/Header';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';

const routes = {
	'/': HomeScreen,
	'/product/:id': ProductScreen,
	'/order/:id': OrderScreen,
	'/cart/:id': CartScreen,
	'/cart': CartScreen,
	'/signin': SigninScreen,
	'/register': RegisterScreen,
	'/profile': ProfileScreen,
	'/shipping': ShippingScreen,
	'/payment': PaymentScreen,
	'/placeorder': PlaceOrderScreen,


};

const router = async() =>{
	showLoading();
	const request = parseRequestUrl();
	const parseUrl = 
	(request.resource ? `/${request.resource}`: '/') + 
	(request.id ? '/:id' : '') + 
	(request.verb ? `/${request.verb}` : '');
	const screen = routes[parseUrl] ? routes[parseUrl] : Error404Screen;
	const header = document.getElementById('header-container');
	header.innerHTML = await Header.render();
	await Header.after_render(); 

	const main = document.getElementById("main-container");
 	main.innerHTML = await screen.render();
 	if (screen.after_render) await screen.after_render();
 	hideLoading();
};

window.addEventListener('load', router);
window.addEventListener('hashchange', router);
