<template>
  <Header />
  <div class="container">
    <span class="fs-4 ms-3 text-white">Insira os detalhes e faça o pedido</span>
    <br />
  </div>
  <div class="container mt-2">
    <div class="row container">
      <div class="col-7">
        <div class="row row-gap-3 mb-3">
          <div class="col-4">
            <FloatLabel variant="in">
              <InputText fluid v-model="nome" style="background-color: #30313D;" />
              <label class="text-white">Nome</label>
            </FloatLabel>
          </div>
          <div class="col-8">
            <FloatLabel variant="in">
              <InputText fluid v-model="sobrenome" style="background-color: #30313D;" />
              <label class="text-white">Sobrenome</label>
            </FloatLabel>
          </div>
          <div class="col-9">
            <FloatLabel variant="in">
              <InputText v-model="email" type="email" fluid style="background-color: #30313D;" />
              <label class="text-white">E-mail</label>
            </FloatLabel>
          </div>
          <div class="col-3">
            <FloatLabel variant="in">
              <InputMask v-model="telefone" mask="(99) 9 9999-9999" fluid style="background-color: #30313D;" />
              <label class="text-white">Telefone</label>
            </FloatLabel>
          </div>
          <div class="col-12">
            <FloatLabel variant="in">
              <Select fluid :options="enderecos" v-model="endereco" option-label="logradouro"
                style="background-color: #30313D;">
                <template #option="slotProps">
                  <div>
                    {{ slotProps.option.logradouro }}, {{ slotProps.option.numero }} - {{ slotProps.option.bairro
                    }}, {{ slotProps.option.cidade }} - {{ slotProps.option.estado }}
                  </div>
                </template>
              </Select>
              <label class="text-white">Endereço</label>
            </FloatLabel>
          </div>
        </div>

        <form>
          <div class="mb-3" id="payment-element"></div>
          <Button @click="handleSubmit" :disabled="isLoading" label="Realizar Pedido" fluid />
        </form>
      </div>

      <div class="col-5">
        <div class="mt-4">
          <Card>
            <template #content>
              <DataTable :value="products" v-if="itensCarrinho.length == 0 && !itensCarrinho.status">
                <Column header="Detalhes Produto" style="width: 100em">
                  <template #body>
                    <Skeleton></Skeleton>
                  </template>
                </Column>
                <Column header="Preço">
                  <template #body>
                    <Skeleton width="50px"></Skeleton>
                  </template>
                </Column>
                <Column field="quantidade" header="Quantidade">
                  <template #body>
                    <Skeleton width="50px"></Skeleton>
                  </template>
                </Column>
              </DataTable>

              <DataTable v-else :value="itensCarrinho" column-resize-mode="fit" class="mb-3">
                <Column hidden field="id" header="Id"></Column>
                <Column field="produto.nome" header="Detalhes Produto" style="width: 100em;">
                  <template #body="slotProps">
                    <h4>
                      {{ slotProps.data.produto.nome }} - {{
                        slotProps.data.produto.tamanho.sigla }}

                    </h4>

                  </template>
                </Column>
                <Column field="produto.preco" header="Preço" class="text-center" body-class="fs-4">
                  <template #body="slotProps">

                    {{ formatCurrency(slotProps.data.produto.preco) }}

                  </template>
                </Column>
                <Column field="quantidade" class="text-center" body-class="fs-4" header="Quantidade">
                </Column>
              </DataTable>

              <span class="text-warning">Valor a pagar: {{ valorPagarTexto }}</span>
              <br />
              <span style="color:rgb(52, 211, 153)">Desconto: {{ descontoTexto }}</span>

            </template>
          </Card>
        </div>
      </div>
    </div>

  </div>

</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from "vue"
import { loadStripe, } from "@stripe/stripe-js"
import Header from "@/components/Header.vue"
import type {
  Stripe, StripeElements,
  StripeElementsOptionsClientSecret
} from "@stripe/stripe-js"
import global from "@/stores/global"
import { getAccessToken } from '@/services/auth';
import { jwtDecode } from 'jwt-decode';
import { checkout, getCarrinhoByUser } from '@/stores/carrinho';
import { Card, Button, DataTable, Column, useToast, FloatLabel, InputText, InputMask, Select } from 'primevue';
import router from '@/router';
import { getCupom } from '@/stores/cupom';
import { processarPagamento } from "@/stores/pagamento"
import { getEnderecos } from "@/stores/endereco"

const enderecos = ref<any>([]);
const endereco = ref<any>();
const clientSecret = ref<string>('');

const valorPagar = ref<number>(1);
const desconto = ref<number>();
const telefone = ref<string>();
const nome = ref<string>();
const sobrenome = ref<string>();
const email = ref<string>();

const isLoading = ref(false);
const toast = useToast();

const stripe = ref<Stripe | null>();
const elements = ref<StripeElements>();
const stripeLoaded = ref(false)

const usuarioId = ref<string>('');
const itensCarrinho = ref<any>([])
const products = ref(new Array(4));
const carrinhoId = ref<string>('');
const valorPagarTexto = ref<string>();
const descontoTexto = ref<string>();

onBeforeMount(async () => {
  await global.util.isAuthenticated();
})

onMounted(async () => {
  var token = await getAccessToken();

  if (global.util.isNullOrEmpty(token) === false) {
    var tokenInfo: any = await jwtDecode(token);
    usuarioId.value = tokenInfo.sub;
  }
  const lastSlash = window.location.href.lastIndexOf('/');
  carrinhoId.value = window.location.href.substring(lastSlash + 1);
  if (global.util.isGuid(carrinhoId.value) && global.util.guidIsNullOrEmpty(carrinhoId.value) == false) {
    await loadCarrinho();
    if (usuarioId.value != itensCarrinho.value[0].carrinho.usuarioId) {
      router.push('/');
    }
    valorPagarTexto.value = await getTotalCarrinhoMoeda(itensCarrinho.value);
    const ret = await processarPagamento(carrinhoId.value, valorPagar.value)
    if (ret.status === 200)
      clientSecret.value = ret.data;
    stripe.value = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

    stripeLoaded.value = true;
    const appearance = { /* appearance */ };
    const options: StripeElementsOptionsClientSecret = {
      appearance: {
        theme: 'night',
        labels: 'floating',
        disableAnimations: false
      },
      clientSecret: clientSecret.value,
      locale: 'pt-BR',
    }
    elements.value = stripe?.value?.elements(options);
    const paymentElement = elements?.value?.create("payment");

    paymentElement?.mount('#payment-element');

    isLoading.value = false;
  }

  const ret = await getEnderecos(tokenInfo.sub);
  if (ret.status === 200) {
    enderecos.value = ret.data;
  }
})

const getTotalCarrinhoMoeda = async (itensCarrinho: any) => {
  var total: number = itensCarrinho.reduce((total: number, item: any) => total + (item.produto.preco * item.quantidade), 0)

  if (global.util.isNullOrEmpty(itensCarrinho[0].carrinho.codigoCupom) === false) {
    const resp = await getCupom(itensCarrinho[0].carrinho.codigoCupom)
    if (resp.status === 200) {
      const valorDesconto = resp.data.porcentagemDesconto;
      const discount = (total * (valorDesconto / 100));
      desconto.value = discount;
      const novoPreco = total - discount;
      valorPagar.value = novoPreco;
      descontoTexto.value = formatCurrency(discount);
      return formatCurrency(novoPreco);
    }
    else if (resp.status === 401) {
      global.ui.notification.success(toast, 'Sua sessão expirou');
      setTimeout(() => {
        router.push('/')
      }, 3000);
      return '';
    }
    else return "R$";
  }
  else {
    valorPagar.value = total;
    return formatCurrency(total);
  }
}

async function loadCarrinho() {
  const resp = await getCarrinhoByUser(usuarioId.value);
  if (resp.status == 200) {
    itensCarrinho.value = resp.data;

  }
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

async function handleSubmit() {

  var itensPedido: number = 0;
  itensCarrinho.value.map((item: any) => {
    itensPedido += item.quantidade;
  });

  const checkoutDTO: any = {
    id: carrinhoId.value,
    usuarioId: usuarioId.value,
    codigoCupom: itensCarrinho.value[0].carrinho.codigoCupom,
    nome: nome.value,
    sobrenome: sobrenome.value,
    telefone: telefone.value,
    email: email.value,
    valorCompra: valorPagar.value,
    valorDesconto: desconto.value,
    quantidadeItens: itensPedido,
    enderecoId: endereco.value.id
  }
  const ret = await checkout(checkoutDTO);
  if (ret.status === 200) {
    elements.value?.submit();
    await stripe?.value?.confirmPayment({
      elements: elements.value,
      confirmParams: {
        return_url: `${window.location.origin}/Sucesso`,
      },

      clientSecret: clientSecret.value
    });
  }
}


</script>
