import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TabelaGeralView from '@/views/TabelaGeralView.vue'
import ProdutoView from '../views/ProdutoView.vue'
import ProdutosView from '@/views/ProdutosView.vue'
import UsuarioView from '@/views/UsuarioView.vue'
import CallbackView from '@/views/CallbackView.vue'
import PageNotFoundView from '@/views/PageNotFoundView.vue'
import CarrinhoView from '@/views/CarrinhoView.vue'
import CheckoutView from '@/views/CheckoutView.vue'
import MinhasComprasView from '@/views/MinhasComprasView.vue'
import CuponsView from '@/views/CuponsView.vue'
import EnderecoView from '@/views/EnderecoView.vue'
import SucessoView from '@/views/SucessoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return {
      top: 0,
      behavior: 'smooth',
    }
  },
  routes: [
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/User',
      name: 'User',
      component: UsuarioView,
    },
    {
      path: '/TabelaGeral',
      name: 'Tabela Geral',
      component: TabelaGeralView,
    },
    {
      path: '/callback',
      component: CallbackView
    },
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/Produtos',
      name: 'Produtos',
      component: ProdutosView,
    },
    {
      path: '/*',
      name: "PageNotFound",
      component: PageNotFoundView
    },
    {
      path: "/Produto/:id",
      name: "Produto",
      component: ProdutoView
    },
    {
      path: "/Carrinho",
      name: "Carrinho",
      component: CarrinhoView
    },
    {
      path: "/Checkout/:id",
      name: "Checkout",
      component: CheckoutView
    },
    {
      path: '/MinhasCompras',
      name: "Minhas Compras",
      component: MinhasComprasView
    },
    {
      path: "/Cupons",
      name: "Cupons",
      component: CuponsView
    },
    {
      path: '/Enderecos',
      name: "Enderecos",
      component: EnderecoView
    },
    {
      path: '/Sucesso',
      name: "Sucesso",
      component: SucessoView
    }

  ],
})

export default router
