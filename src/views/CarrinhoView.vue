<template>
  <Header />
  <div class="container mt-4">
    <Card>
      <template #header>
        <div class="rounded py-3" style="background-color: #444;">
          <div class="row align-items-center ps-4">
            <div class="col-6">
              <font-awesome-icon :icon="['fas', 'shopping-cart']" /> &nbsp;
              Carrinho
            </div>
            <div class="col-6">
              <a class="btn btn-outline-warning" href="/">
                Continuar comprando
              </a>
            </div>
          </div>
        </div>
      </template>
      <template #content>

        <DataTable :value="products" v-if="itensCarrinho.length == 0 && !itensCarrinho.status">
          <Column style="width:20%">
            <template #body>
              <Skeleton width="250" height="10rem"></Skeleton>
            </template>
          </Column>
          <Column header="Detalhes Produto" style="width: 100em">
            <template #body>
              <Skeleton height="10rem"></Skeleton>
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
          <Column header="Ações">
            <template #body="slotProps">
              <Skeleton width="40px" height="2.5rem"></Skeleton>
            </template>
          </Column>
        </DataTable>

        <DataTable v-else :value="itensCarrinho" column-resize-mode="fit">
          <Column hidden field="id" header="Id"></Column>
          <Column style="width:20%" field="produto.imagem">
            <template #body="slotProps">
              <Image :src="global.util.base64ToBlobLink(slotProps.data.produto.imagemBase64)" width="250" />
            </template>
          </Column>
          <Column field="produto.nome" header="Detalhes Produto" style="width: 100em;">
            <template #body="slotProps">
              <div style="height: 10rem;" class="text-white-50">
                <h5>
                  <b>
                    {{ slotProps.data.produto.nome }}
                  </b>
                </h5>
                <div class="fs-6">
                  {{ slotProps.data.produto.descricao }}
                </div>
              </div>
            </template>
          </Column>
          <Column header="Tamanho" field="produto.tamanho.sigla" class="text-center" body-class="text-white-50">
          </Column>
          <Column field="produto.preco" header="Preço" class="text-center">
            <template #body="slotProps">
              <div class="text-white-50">
                {{ formatCurrency(slotProps.data.produto.preco) }}
              </div>
            </template>
          </Column>
          <Column field="quantidade" class="text-center" header="Quantidade">
            <template #body="slotProps">
              <div class="text-white-50">
                {{ slotProps.data.quantidade }}
              </div>
            </template>
          </Column>
          <Column header="Ações">
            <template #body="slotProps">
              <Button size="small" v-tooltip.top="'Remover produto do carrinho'" icon="pi pi-trash"
                @click="removerItemCarrinho(slotProps.data.id)" severity="danger" />
            </template>
          </Column>
        </DataTable>

        <div class="row mt-3">
          <div class="col-6 d-flex align-items-center gap-3">
            <FloatLabel variant="in" class="ms-3">
              <label>Cupom:</label>
              <InputText v-model="cupom" @keydown="updateValue" @keyup="updateValue" />
            </FloatLabel>
            <Button v-if="!valorCompra.includes('=')" label="Aplicar" @click="applyCupom" />
            <Button v-else severity="danger" label="Remover" @click="removeCupom" />
          </div>
          <div class="col-6 d-flex align-items-center">
            <span class="text-warning fs-3">Valor da Compra: {{ valorCompra }}
            </span>
          </div>
        </div>
        <Divider />
      </template>
      <template #footer>
        <div class="row">
          <div class="col-6 col-md-3 offset-md-6">
          </div>
          <div class="col-6 col-md-3">
            <Button fluid label="Checkout" @click="router.push('/Checkout/' + itensCarrinho[0].carrinho.id)" />
          </div>
        </div>
      </template>

    </Card>
  </div>
</template>

<script setup lang="ts">
import { aplicarCupom, getCarrinhoByUser, removerCupom, removerDoCarrinho } from '@/stores/carrinho';
import global from '@/stores/global';
import {
  Button, Card, DataTable, Column, InputText, Image, Divider,
  Skeleton, FloatLabel,
  useToast
} from 'primevue';
import { onMounted, ref } from 'vue';
import Header from '@/components/Header.vue';
import router from '@/router';
import { getCupom } from '@/stores/cupom';
import { getAccessToken } from '@/services/auth';
import { jwtDecode } from 'jwt-decode';

const toast = useToast();
const itensCarrinho = ref<any>([])
const products = ref(new Array(4));
const cupom = ref<string>('');
const valorCompra = ref<string>('');
const totalCompra = ref<Number>();
const usuarioId = ref<string>('');

const emit = defineEmits(['update:value'])

onMounted(async () => {
  await global.util.isAuthenticated()
  const token = await getAccessToken();
  if (global.util.isNullOrEmpty(token) == false) {
    const tokenInfo: any = await jwtDecode(token);
    usuarioId.value = tokenInfo.sub;
  }
  if (global.util.isGuid(usuarioId.value)) {
    await loadCarrinho();

    if (usuarioId.value != itensCarrinho.value[0].carrinho.usuarioId) {
      router.push('/');
    }
  }


})


const updateValue = (e: Event) => {
  emit('update:value', (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.toUpperCase())
};

async function loadCarrinho() {
  const resp = await getCarrinhoByUser(usuarioId.value);
  if (resp.status === 200) {
    itensCarrinho.value = resp.data;
    valorCompra.value = await getTotalCarrinhoMoeda(resp.data)
    totalCompra.value = await getTotalCarrinhoNumero(resp.data)
  }
  else if (resp.status === 401 || resp.status === 403)
    router.push('/');
  else if (resp.status === 404) {
    itensCarrinho.value.status = 'Sem coisa'
    global.ui.notification.warning(toast, 'Carrinho está vazio')
    setTimeout(() => {
      router.push('/')
    }, 3000);
  }

}

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const getTotalCarrinhoMoeda = async (itensCarrinho: any) => {
  var total: number = itensCarrinho.reduce((total: number, item: any) => total + (item.produto.preco * item.quantidade), 0)
  cupom.value = '';
  if (global.util.isNullOrEmpty(itensCarrinho[0].carrinho.codigoCupom) === false) {
    const resp = await getCupom(itensCarrinho[0].carrinho.codigoCupom)
    if (resp.status === 200) {
      const valorDesconto = resp.data.porcentagemDesconto;
      cupom.value = resp.data.nome;
      var retorno: string = formatCurrency(total);
      var novoPreco = total - (total * (valorDesconto / 100))
      retorno += " - " + (total * (valorDesconto / 100)).toFixed(2) + " = " + novoPreco;
      return retorno;
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
  else
    return formatCurrency(total);
}

const getTotalCarrinhoNumero = async (itensCarrinho: any): Promise<Number> => {
  var total: number = itensCarrinho.reduce((total: Number, item: any) => total + item.produto.preco, 0)
  cupom.value = '';
  if (global.util.isNullOrEmpty(itensCarrinho[0].carrinho.codigoCupom) === false) {
    const resp = await getCupom(itensCarrinho[0].carrinho.codigoCupom)
    if (resp.status === 200) {
      const valorDesconto = resp.data.porcentagemDesconto;
      cupom.value = resp.data.nome;
      const novoPreco: number = total - (total * (valorDesconto / 100))
      return novoPreco;
    }
    else if (resp.status === 401) {
      global.ui.notification.success(toast, 'Sua sessão expirou');
      setTimeout(() => {
        router.push('/')
      }, 3000);
      return 0;
    }
    else return 0;
  }
  else
    return total;
}


async function removerItemCarrinho(id: string) {
  const resp = await removerDoCarrinho(id);
  if (resp.status === 200) {
    global.ui.notification.success(toast, 'Item removido do carrinho com sucesso')
    await loadCarrinho();
  }
  else if (resp.status === 401) {
    global.ui.notification.warning(toast, 'Sua sessão expirou')
    setTimeout(() => {
      router.push('/');
    }, 3000);

  }
}

async function applyCupom() {
  const res = await aplicarCupom(usuarioId.value, cupom.value);
  if (res.status === 200) {
    global.ui.notification.success(toast, 'Cupom adicionado com sucesso');
    await loadCarrinho();
  }
  else if (res.status === 401) {
    global.ui.notification.warning(toast, 'Sua sessão expirou');
    setTimeout(() => {
      router.push('/');
    }, 3000);
  }
}

async function removeCupom() {
  const res = await removerCupom(usuarioId.value);
  if (res.status === 200) {
    global.ui.notification.success(toast, 'Cupom removido com sucesso');
    await loadCarrinho();
  }
  else if (res.status === 401) {
    global.ui.notification.warning(toast, 'Sua sessão expirou');
    setTimeout(() => {
      router.push('/');
    }, 3000);
  }
}

</script>
