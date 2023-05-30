// local de pedido finalizado e integrado com o paypal
// toda configuração de finalização de vinculo do pedido com o paypal está aqui 

//opção de troca de moeda dentro da função ''payment'' nela utilizo propriedade ''currency''
// e o objeto ''amount'' 

//o order é caracterizado pelo ID do pedido que toda compra tem que ter quando é efetuada no processo de pagamento

import {
  parseRequestUrl,
  showLoading,
  hideLoading,
  showMessage,
  rerender,
} from '../utils';
import { getOrder, getPaypalClientId, payOrder } from '../api';




const addPaypalSdk = async (totalPrice) => {
const clientId = await getPaypalClientId();
showLoading();
if(!window.paypal){

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://www.paypalobjects.com/api/checkout.js';
  script.async = true;
  script.onload = () => handlePayment(clientId, totalPrice);
  document.body.appendChild(script);

  }else{
    handlePayment(clientId, totalPrice);
  }
};

//config de credenciais de pagamento 

const handlePayment = (clientId, totalPrice) =>{
  window.paypal.Button.render({
    env: 'sandbox',
    client: {
      sandbox: clientId,
      production: '',
    },
    locale: 'en_BR',
    style: {

      size: 'responsive',
      color: 'gold',
      shape: 'pill',

    },


     commit: true,
      payment(data, actions) {
        return actions.payment.create({
          transactions: [
            {
              amount: {
                total: totalPrice,
                currency: 'BRL',
              },
            },
          ],
        });
      },
      onAuthorize(data, actions) {
        return actions.payment.execute().then(async () => {
          showLoading();
          await payOrder(parseRequestUrl().id, {
            orderID: data.orderID,
            payerID: data.payerID,
            paymentID: data.paymentID,
          });
          hideLoading();
          showMessage('Pagamento realizado com sucesso.', () => {
            rerender(OrderScreen);
          });
        });
      },
    },
    '#paypal-button'
  ).then(() => {
    hideLoading();
  });
};

 

const OrderScreen = {
  after_render: async () => {},
  render: async () => {
    const request = parseRequestUrl();
    const {
      _id,
      shipping,
      payment,
      orderItems,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      isDelivered,
      deliveredAt,
      isPaid,
      paidAt,
    } = await getOrder(request.id);
     if (!isPaid) {
      addPaypalSdk(totalPrice);
    }
    return `
    <div>
    <h1> ID do pedido: ${_id}</h1>
      <div class="order">
        <div class="order-info">
          <div>
            <h2>Envio</h2>
            <div>
            ${shipping.address}, ${shipping.city}, ${shipping.postalCode}, 
            ${shipping.country}
            </div>
            ${
              isDelivered
                ? `<div class="success">Entrega em Andamento ${deliveredAt}</div>`
                : `<div class="error">Não Entregue</div>`
            }
             
          </div>
          <div>
            <h2>Pagamento</h2>
            <div>
              Forma de Pagamento : ${payment.paymentMethod}
            </div>
            ${
              isPaid
                ? `<div class="success">Pedido Pago em ${paidAt}</div>`
                : `<div class="error">Pedido não Pago</div>`
            }
          </div>
          <div>
            <ul class="cart-list-container">
              <li>
                <h2>Carrinho de Compras</h2>
                <div>Preço</div>
              </li>
              ${orderItems
                .map(
                  (item) => `
                <li>
                  <div class="cart-image">
                    <img src="${item.image}" alt="${item.name}" />
                  </div>
                  <div class="cart-name">
                    <div>
                      <a href="/#/product/${item.product}">${item.name} </a>
                    </div>
                    <div> Quantidade: ${item.qty} </div>
                  </div>
                  <div class="cart-price"> R$${item.price}</div>
                </li>
                `
                )
                .join('\n')}
            </ul>
          </div>
        </div>
        <div class="order-action">
           <ul>
                <li>
                  <h2>Resumo do Pedido</h2>
                 </li>
                 <li><div>Subtotal dos Produtos</div><div>R$${itemsPrice}</div></li>
                 <li><div>Envio</div><div>R$${shippingPrice}</div></li>
                 <li><div>Tax</div><div>R$${taxPrice}</div></li>
                  <li class="total"><div>Pagamento Total</div><div>$${totalPrice}</div></li>                  
                 <li><div class="fw" id="paypal-button"></div></li> 
                 <li>
               
        </div>
      </div>
    </div>
    `;
  },
};
export default OrderScreen;