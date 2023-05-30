// parte final do checkout ''finalização de pedido''


// usando a função math.round na const taxPrice para calcular a taxa de porcentagem 
// a taxa é calculada em 15% em cima de cada produto da loja que é fornecido 
// usei a função math.round para arredondar o valor entre a porcentagem e o total do valor dos items multiplicada por 100
// ele arredonda o resultado para o numero inteiro mais próximo 


import { getCartItems, getShipping, getPayment, cleanCart, } from '../localStorage';
import CheckoutSteps from '../components/CheckoutSteps';
import { showLoading, hideLoading, showMessage } from '../utils';
import { createOrder } from '../api';


const convertCartToOrder = () => {
  const orderItems = getCartItems();
  if (orderItems.length === 0) {
    document.location.hash = '/cart';
  }
  const shipping = getShipping();
  if (!shipping.address) {
    document.location.hash = '/shipping';
  }
  const payment = getPayment();
  if (!payment.paymentMethod) {
    document.location.hash = '/payment';
  }
  const itemsPrice = orderItems.reduce((a, c) => a + c.price * c.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Math.round(0.15 * itemsPrice * 100) / 100;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;
  return {
    orderItems,
    shipping,
    payment,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };
};

const PlaceOrderScreen = {
  after_render: async () => {
    document 
    .getElementById('placeorder-button')
    .addEventListener('click', async () => {
      const order = convertCartToOrder();
      showLoading();
      const data = await createOrder(order);
      hideLoading();
      if (data.error) {
        showMessage(data.error);
      }else {
        cleanCart();
        document.location.hash = `/order/${data.order._id}`;
      }
    });

  },
  render: () => {
    const {
      orderItems,
      shipping,
      payment,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = convertCartToOrder();
    return `
    <div>
      ${CheckoutSteps.render({
        step1: true,
        step2: true,
        step3: true,
        step4: true,
      })}
      <div class="order">
        <div class="order-info">
          <div>
            <h2>Endereço de entrega <i class="fa fa-map-marker" aria-hidden="true"></i></h2>

            <div>
            ${shipping.address}, ${shipping.city}, ${shipping.postalCode}, 
            ${shipping.country}
            </div>
          </div>
          <div>
            <h2>Pagamento <i class="fa fa-money" aria-hidden="true"></i> </h2>
            <div>
              Opção de Pagamento: ${payment.paymentMethod}

            </div>
          </div>
          <div>
            <ul class="cart-list-container">
              <li>
                <h2>Carrinho de Compras <i class="fa fa-shopping-bag fa-1x" aria-hidden="true"></i></h2>
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
                      <a href="/#/product/${item.product}">${item.name}</a>
                    </div>
                    <div>Quantidade: ${item.qty}</div>
                  </div>
                  <div class="cart-price">$${item.price}</div>
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
              <h2>Detalhes de Pagamento</h2>
            </li>
            <li><div>Subtotal dos Produtos</div><div>R$${itemsPrice}</div></li>
            <li><div>Envio</div><div>R$${shippingPrice}</div></li>
            <li><div>Tax</div><div>R$${taxPrice}</div></li>
            <li class="total"><div>Pagamento Total</div><div>R$${totalPrice}</div></li> 
            <li>
              
              <button id="placeorder-button" class="primary fw">

                Fazer Pedido
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    `;
  },
};

export default PlaceOrderScreen;

