<script setup lang="ts">
import {
  DataTable, Column, Card, InputText, Button, Textarea, InputNumber,
  Select, useToast, FileUpload, Panel, Image, useConfirm, Skeleton
} from 'primevue';
import { onBeforeMount, onMounted, ref } from 'vue';
import Header from '@/components/Header.vue';
import { getTabelaGeral, getTabelasGerais } from '@/stores/tabelaGeral';
import { addProduto, deleteProduto, getProdutosAdmin, updateProduto } from '@/stores/produto';
import global from '@/stores/global';
import router from '@/router';

//#region Refs
const produtos = ref<any>([]);
const fileUpload = ref();
const produtoId = ref<string | null>(null);
const nome = ref('');
const preco = ref<number>(0);
const descricao = ref('');
const tamanhos = ref<any>([]);
const tamanho = ref<any>();
const colors = ref<any>([]);
const color = ref<any>();
const peso = ref<number>(0);
const estoque = ref<number>(0);
const sku = ref('');
const categorias = ref<any>([])
const categoria = ref<any>(null);
const imagem = ref<any>(null);
const modal = ref<boolean>(false);

const products = ref(new Array(4));
//#endregion

const toast = useToast();
const confirm = useConfirm();

//#region Functions

onBeforeMount(async () => {
  await global.util.isAuthenticated();
  await global.util.userIsAdmin();

})

onMounted(async () => {

  var buscaProdutos = setInterval(async () => {
    await loadProdutos();
    if (produtos.value.length > 0)
      clearInterval(buscaProdutos);
  }, 1000);



  const resp = await getTabelaGeral('Categoria');
  if (resp.status === 200) {
    const respItens = await getTabelasGerais(resp.data.id);
    if (respItens.status === 200) {
      categorias.value = respItens.data;
    }
  }

  const res = await getTabelaGeral('TamanhoRoupa')
  if (res.status === 200) {
    const response = await getTabelasGerais(res.data.id);
    if (response.status === 200)
      tamanhos.value = response.data.sort((a: any, b: any) => {
        if (a.dataInclusao < b.dataInclusao)
          return -1;
        else
          return 1;
      });;
  }

  const response = await getTabelaGeral('Cor');
  if (response.status === 200) {
    const response2 = await getTabelasGerais(response.data.id);
    colors.value = response2.data;
  }

})


function onFileSelect(event: any) {

  const file = event.files[0];
  const reader = new FileReader();

  reader.onload = async (e: any) => {

    imagem.value = e.target.result.split(',')[1];
  };

  reader.readAsDataURL(file);
}


async function loadProdutos() {
  const resp = await getProdutosAdmin();
  if (resp.status === 200) {
    produtos.value = resp.data;
  }
}

function clearFields() {
  produtoId.value = null;
  nome.value = '';
  descricao.value = '';
  estoque.value = 0;
  preco.value = 0;
  categoria.value = null;
  tamanho.value = null;
  color.value = null;
  sku.value = '';
  imagem.value = null;
  peso.value = 0;
}

async function salvarProduto() {
  await gerarSKU();

  const produto = {
    id: produtoId.value,
    nome: nome.value,
    estoque: estoque.value,
    preco: preco.value.toFixed(2),
    peso: peso.value.toFixed(2),
    descricao: descricao.value,
    idTGCategoria: categoria.value.id,
    idTGTamanho: tamanho.value.id,
    idTGCor: color.value.id,
    sku: sku.value,
    imagemBase64: imagem.value,
    dataInclusao: new Date()
  }
  var res = null;
  if (global.util.guidIsNullOrEmpty(produtoId.value))
    res = await addProduto(produto);
  else
    res = await updateProduto(produtoId.value!, produto);
  if (res.status === 200) {
    global.ui.notification.success(toast, 'Produto salvo com sucesso');
    clearFields();
    await loadProdutos();
  }
  else if (res.status === 400 || res.status === 500)
    global.ui.notification.error(toast, res.error);
  else if (res.status === 401 || res.status === 403) {
    router.push('/')
  }
}

async function gerarSKU() {
  var categoriaNome = categoria.value.descricao;
  var categoriaSku = categoriaNome.replace(/[aeiou]/gi, '').substring(0, 4).toUpperCase();

  var tamanhoSku = tamanho.value.sigla.padStart(4, tamanho.value.sigla).toUpperCase();
  var corSku = color.value.sigla.toUpperCase();

  sku.value = categoriaSku + "-" + corSku + "-" + tamanhoSku;
  console.log('sku: ', sku.value);
}

async function trocaCategoria() {
  const resp = await getTabelaGeral('categoria');
  if (resp.status === 200) {
    const respItens = await getTabelasGerais(resp.data.id);
    if (respItens.status === 200) {
      if (resp.status === 200) {
        if (resp.data.descricao.toUpperCase() === "CALÇA" || resp.data.nome.toUpperCase() === "TÊNIS" || resp.data.nome.toUpperCase() === "CHINELO") {
          const response = await getTabelaGeral('TamanhoCalcado');
          if (response.status === 200) {
            const res = await getTabelasGerais(response.data.id);
            tamanhos.value = res.data.sort((a: any, b: any) => {
              if (a.sigla < b.sigla)
                return -1;
              else
                return 1;
            });
          }
        }
        else {
          const res = await getTabelaGeral('TamanhoRoupa')
          if (res.status === 200) {
            const response = await getTabelasGerais(res.data.id);
            if (response.status === 200)
              tamanhos.value = response.data.sort((a: any, b: any) => {
                if (a.dataInclusao < b.dataInclusao)
                  return -1;
                else
                  return 1;
              });
          }
        }
      }
    }
  }
}


const editProduto = (produto: any) => {
  produtoId.value = produto.id;
  nome.value = produto.nome;
  descricao.value = produto.descricao;
  categoria.value = produto.categoria;
  preco.value = produto.preco;
  peso.value = produto.peso;
  estoque.value = produto.estoque;
  color.value = produto.cor;
  sku.value = produto.sku;
  tamanho.value = produto.tamanho;
  imagem.value = produto.imagemBase64;
  modal.value = true;
}


const removeProduto = async (id: string) => {

  global.ui.confirmation(confirm, 'Deseja realmente deletar este item', async () => {
    const res = await deleteProduto(id);
    if (res.status == 200) {
      global.ui.notification.success(toast, 'Produto deletado com sucesso');
      modal.value = false;
      await loadProdutos();
    }
  })

}

//#endregion

</script>


<template>
  <Header />
  <div class="container-fluid" style="width: 85%;">
    <Panel>
      <template #header>
        <div class="mt-3 ms-3">
          <Button @click="modal = true" label="Criar Produto" />
        </div>
      </template>

      <DataTable v-if="produtos.length > 0" :value="produtos" class="rounded">
        <Column hidden field="id" header="Id"></Column>
        <Column header="Foto">
          <template #body="slotProps">
            <Image preview>
              <template #previewicon>
                <i class="pi pi-search"></i>
              </template>
              <template #image>
                <img :src="global.util.base64ToBlobLink(slotProps.data.imagemBase64)" width="200" />
              </template>
              <template #preview>
                <img :src="global.util.base64ToBlobLink(slotProps.data.imagemBase64)" alt="preview" />
              </template>
            </Image>
          </template>
        </Column>
        <Column header="Nome" field="nome"></Column>
        <Column header-class="d-flex justify-content-center" header="Descrição" field="descricao">

        </Column>
        <Column class="text-center" header="Categoria" field="categoria.sigla"></Column>
        <Column class="text-center" header="Preço" field="preco">
          <template #body="slotProps">
            {{ Intl.NumberFormat('pt-BR', {
              style: 'currency', currency: 'BRL'
            }).format(slotProps.data.preco) }}
          </template>
        </Column>
        <Column class="text-center" header="Estoque" field="estoque"></Column>
        <Column class="text-center" header="Tamanho" field="tamanho.sigla"></Column>
        <Column header="Cor" field="cor.descricao"></Column>
        <Column header="Peso" field="peso" style="width: 86px;">
          <template #body="slotProps">
            {{ Intl.NumberFormat('pt-BR', {
              style: 'decimal'
            }).format(slotProps.data.peso) }} kg
          </template>
        </Column>
        <Column header-class="d-flex justify-content-center" style="width: 150px;" header="SKU" field="sku">
        </Column>
        <Column header="Ações">
          <template #body="slotProps">
            <div class="gap-3 d-flex">
              <Button size="small" v-tooltip.top="'Editar produto'" icon="pi pi-pencil"
                @click="editProduto(slotProps.data)" severity="info" />
              <Button size="small" v-tooltip.top="'Deletar tabela geral'" icon="pi pi-trash"
                @click="removeProduto(slotProps.data.id)" severity="danger" />
            </div>
          </template>
        </Column>
      </DataTable>

      <DataTable v-else :value="products">
        <Column header="Foto" style="width: 15em">
          <template #body>
            <Skeleton height="10rem"></Skeleton>
          </template>
        </Column>
        <Column header="Nome">
          <template #body>
            <Skeleton width="10rem"></Skeleton>
          </template>
        </Column>
        <Column header="Descrição">
          <template #body>
            <div class=" row row-gap-1">
              <Skeleton width="20rem"></Skeleton>
              <Skeleton width="20rem"></Skeleton>
              <Skeleton width="20rem"></Skeleton>
              <Skeleton width="20rem"></Skeleton>
              <Skeleton width="20rem"></Skeleton>
              <Skeleton width="20rem"></Skeleton>
            </div>
          </template>
        </Column>
        <Column header="Categoria">
          <template #body>
            <Skeleton></Skeleton>
          </template>
        </Column>
        <Column header="Preço">
          <template #body>
            <Skeleton width="50px"></Skeleton>
          </template>
        </Column>
        <Column header="Estoque">
          <template #body>
            <Skeleton width="50px"></Skeleton>
          </template>
        </Column>
        <Column header="Tamanho">
          <template #body>
            <Skeleton></Skeleton>
          </template>
        </Column>
        <Column header="Cor">
          <template #body>
            <Skeleton></Skeleton>
          </template>
        </Column>
        <Column header="Peso">
          <template #body>
            <Skeleton></Skeleton>
          </template>
        </Column>
        <Column header="SKU">
          <template #body>
            <div class="row row-gap-1">
              <Skeleton width="100px"></Skeleton>
              <Skeleton width="100px"></Skeleton>
            </div>
          </template>
        </Column>
        <Column header="Ações" style="width: 120px;">
          <template #body="slotProps">
            <div class="row gap-2">
              <Skeleton width="40px" height="2.5rem"></Skeleton>
              <Skeleton width="40px" height="2.5rem"></Skeleton>
            </div>
          </template>
        </Column>
      </DataTable>
    </Panel>
  </div>

  <Dialog @after-hide="clearFields" v-model:visible="modal" modal header="Salvar Produto">
    <Card class="container">
      <template #content>
        <div class="row row-gap-5">
          <div class="col-4">
            <label>Nome</label>
            <InputText required fluid v-model="nome" />
          </div>

          <div class="col-4">
            <label>Descrição</label>
            <Textarea required auto-resize fluid v-model="descricao" />
          </div>

          <div class="col-4">
            <label>Categoria</label>
            <Select @change="trocaCategoria" size="large" v-model="categoria" :options="categorias"
              option-label="descricao" showClear required filter placeholder="Selecione uma categoria" fluid>
            </Select>
          </div>

          <div class="col-4">
            <label>Tamanho</label>
            <Select fluid :options="tamanhos" v-model="tamanho" option-label="descricao" showClear filter size="large"
              placeholder="Escolha um tamanho" required>

            </Select>
          </div>

          <div class="col-4">
            <label>Cor</label>
            <Select fluid :options="colors" v-model="color" option-label="descricao" showClear filter size="large"
              placeholder="Escolha uma cor" required>

            </Select>
          </div>

          <div class="col-4">
            <label>Estoque</label>
            <InputNumber locale="pt-BR" v-model="estoque" fluid required />
          </div>

          <div class="col-4">
            <label>Peso (kg)</label>
            <InputNumber locale="pt-BR" mode="decimal" v-model="peso" fluid :max-fraction-digits="2" required />
          </div>

          <div class="col-4">
            <label>Preço</label>
            <InputNumber mode="currency" currency="BRL" v-model="preco" fluid required />
          </div>
          <div class="col-5">
            <div class="d-flex justify-content-start">
              <FileUpload @select="onFileSelect" auto ref="fileUpload" custom-upload mode="basic" accept="image/*"
                class="p-button-info p-button-outlined" :max-file-size="10000000" choose-label="Procurar Imagem"
                invalidFileSizeMessage=": Arquivo de tamanho inválido, tamanho do arquivo deve ser menor que {1.}"
                invalidFileTypeMessage="{0}: Tipo de arquivo inválido." />

            </div>
            <img v-if="imagem" :src="'data:image;base64,' + imagem" alt="Image"
              class="shadow-md rounded-xl w-full sm:w-64 pt-4" style="width: 500px;" />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="d-flex justify-content-between mt-4">
          <Button @click="clearFields(); modal = false" label="Cancelar" severity="secondary" icon="pi pi-ban" />
          <Button @click="salvarProduto" label="Salvar" icon="pi pi-save" />
        </div>
      </template>
    </Card>
  </Dialog>
</template>
