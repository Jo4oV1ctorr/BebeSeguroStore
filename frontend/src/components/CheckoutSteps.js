//parte de checkout 

const CheckoutSteps = {
	render: (props) => {

	return `
	<div class="checkout-steps">
		<div class="${props.step1 ? 'active' : ''}">Entrar</div>
		<div class="${props.step2 ? 'active' : ''}">Envio</div>
		<div class="${props.step3 ? 'active' : ''}">Pagamento</div>
		<div class="${props.step4 ? 'active' : ''}">Finalizar Compra</div> 
	</div>	
	`;
	},
};

export default CheckoutSteps;