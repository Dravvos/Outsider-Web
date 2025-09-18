<script setup lang="ts">
import { getProduto, getProdutosEmEstoque } from '@/stores/produto';
import {
  Image, Card, Button, useToast, InputNumber, Badge, Divider,
  SelectButton, Panel
} from 'primevue';
import { onMounted, ref } from 'vue';
import global from '@/stores/global';
import router from '@/router';
import { getAccessToken } from '@/services/auth';
import { jwtDecode } from 'jwt-decode';
import { adicionarAoCarrinho } from '@/stores/carrinho';
import Header from '@/components/Header.vue';

const produto = ref<any>();
const tamanho = ref<any>();
const toast = useToast();
const count = ref(1);
const blobUrl = ref<string>();
const tamanhosEmEstoque = ref<any>([]);
const produtosEmEstoque = ref<any>([]);

async function AdicionarAoCarrinho() {

  if (global.util.isNullOrEmpty(tamanho.value)) {
    global.ui.notification.error(toast, "Escolha um tamanho (mesmo que só tenha uma opção)");
    return;
  }

  const token = jwtDecode(await getAccessToken());
  const itemCarrinho = {
    usuarioId: token.sub,
    produtoId: produto.value.id,
    quantidade: count.value
  }
  const resp = await adicionarAoCarrinho(itemCarrinho);
  if (resp.status === 200) {
    global.ui.notification.success(toast, 'Item adicionado ao carrinho com sucesso');
    setTimeout(() => {
      window.location.reload();
    }, 2800);
  }
  else if (resp.status === 401) {
    global.ui.notification.warning(toast, 'É necessário logar')
  }
}

onMounted(async () => {
  debugger;
  //await global.util.isAuthenticated();
  const lastSlash = window.location.href.lastIndexOf('/');
  const guid = window.location.href.substring(lastSlash + 1);

  const resp = await getProduto(guid);
  if (resp.status === 200) {
    produto.value = resp.data;

    blobUrl.value = global.util.base64ToBlobLink(produto.value?.imagemBase64);
    const ret = await getProdutosEmEstoque(produto.value?.idTGCategoria, produto.value.idTGCor, produto.value.nome);

    produtosEmEstoque.value = ret.data;
    ret.data.map((item: any) => {
      tamanhosEmEstoque.value.push(item.tamanho);
    })

  }
  else if (resp.status === 400 || resp.status === 500)
    global.ui.notification.error(toast, resp.error);
  else if (resp.status === 401) {
    global.ui.notification.warning(toast, 'É necessário logar')
    router.push('/')
  }
  else if (resp.status === 403)
    router.push('/')

})

function atualizarProdutoEscolhido(tgTamanho: any) {
  produto.value = produtosEmEstoque.value.find((x: any) => x.idTGTamanho == tgTamanho.id);
}

</script>

<template>
  <Header />
  <div class="pt-4 container">
    <Card>
      <template #header>
        <div class="row border-0 mx-3 mt-3">
          <div class="col-12 col-md-8">
            <h1>{{ produto?.nome }}</h1>
          </div>
          <div class="col-12 col-md-4 text-end">
            <h1 class="text-warning">{{ Intl.NumberFormat('pt-BR', {
              style: 'currency', currency: 'BRL'
            }).format(produto?.preco) }}</h1>
          </div>
        </div>
        <Divider layout="horizontal" />
      </template>

      <template #content>
        <div class="container rounded p-2">
          <div class="row">
            <div class="col-12 col-lg-4 pb-3 text-center">
              <Image preview>
                <template #previewicon>
                  <i class="pi pi-search"></i>
                </template>
                <template #image>
                  <img :src="blobUrl" width="250" />
                </template>
                <template #preview="slotProps">
                  <img :src="blobUrl" alt="preview" :style="slotProps.style" />
                </template>
              </Image>
            </div>
            <div class="col-12 col-lg-8">
              <div class="row ps-3">
                <div class="col-12">
                  <div class="d-flex gap-2">
                    <Badge severity="warn" :value="produto?.categoria?.descricao" />
                    <Badge severity="info" :value="produto?.cor?.descricao" />
                  </div>
                  <div class="d-flex justify-items-center gap-2 mt-2">
                    <SelectButton v-model="tamanho" @value-change="atualizarProdutoEscolhido" name="selection"
                      :options="tamanhosEmEstoque" option-label="sigla" />

                  </div>
                  <h3 class="text-success"></h3>
                  <p class="fs-6 text-white-50">{{ produto?.descricao }}</p>
                </div>
              </div>
              <div class="row px-4">
                <div class="col-3">
                  <InputNumber mode="decimal" input-id="qtdProduto" :min="1" :max="100" show-buttons
                    v-model:model-value="count" buttonLayout="horizontal">
                    <template #incrementicon><i class="pi pi-plus"></i></template>
                    <template #decrementicon><i class="pi pi-minus"></i></template>
                  </InputNumber>
                </div>
              </div>
            </div>
          </div>

        </div>
        <Divider layout="horizontal" />
      </template>
      <template #footer>
        <div class="row">
          <div class="col-12 col-md-6 pb-1">
            <Button fluid icon="pi pi-arrow-left" severity="contrast" as="router-link" to="/"
              label="Voltar para Listagem" />
          </div>
          <div class="col-12 col-md-6 pb-1">
            <Button fluid @click="AdicionarAoCarrinho" label="Adicionar ao Carrinho" icon="pi pi-cart-arrow-down" />
          </div>
        </div>
      </template>
    </Card>

  </div>
  <div class="pt-4 container">
    <Card>
      <template #title>
        <h1>Avaliações do produto</h1>
      </template>
      <template #content>
        <div>
          <p>Comentário</p>
        </div>
      </template>
    </Card>
  </div>
</template>
