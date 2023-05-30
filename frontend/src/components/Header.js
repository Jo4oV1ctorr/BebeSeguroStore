// direcionamento para tela de logado de admin

import { getUserInfo } from '../localStorage';


const Header = {
  render: () => {
    const { name } = getUserInfo();
    return ` 
  <div class="brand">
    <a href="/#/">BebêSeguro Store</a>
  </div>
  <div>
  ${
    name
      ? `<a href="/#/profile">${name}</a>`
      : `<a href="/#/signin">Entrar</a>`
  } 
    
    <a href="/#/cart">
      <i class="fa fa-shopping-bag fa-2x" aria-hidden="true"> </i>
    </a>
       
   
  </div>`;
  },
  after_render: () => {},
};
export default Header;


