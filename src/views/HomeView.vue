<script setup lang="ts">
import Header from '@/components/Header.vue';
import { getProdutosClient } from '@/stores/produto';
import { Divider, Card, useToast, Button, Skeleton } from 'primevue';
import { onMounted, ref } from 'vue';
import global from '@/stores/global';
import router from '@/router';

const toast = useToast();
const produtos = ref<any[]>([]);


onMounted(async () => {


  var buscaProdutos = setInterval(async () => {
    const res = await getProdutosClient();
    if (res.status === 200) {
      produtos.value = res.data;
      clearInterval(buscaProdutos);
    }
  }, 1000);

})

function substringNome(nome: string) {
  if (nome.length < 24) return nome;
  return nome.substring(0, 21) + "...";
}


function substringDescricao(descricao: string) {
  if (descricao.length < 355) return descricao;
  return descricao.substring(0, 352) + "...";
}

</script>

<template>
  <Header />
  <div class="container">
    <div v-if="produtos.length > 0" class="row row-gap-4">
      <div class="col-3 " v-for="(item, index) in produtos">
        <Card>
          <template #title>
            <h1>{{
              substringNome(item.nome)
            }}</h1>
            <Divider />
          </template>
          <template #content>
            <div class="text-center">
              <img style="width: 250px;" :src="'data:image;base64,' + item.imagemBase64" />
            </div>
            <br />
            <p>{{ substringDescricao(item.descricao) }}</p>
            <div class="row">
              <div class="col pt-1">
                <span class="fs-3">{{ Intl.NumberFormat('pt-BR', {
                  style: 'currency', currency: 'BRL'
                }).format(item.preco)
                  }}</span>
              </div>
            </div>
          </template>
          <template #footer>
            <Button @click="router.push('/Produto/' + item.id)" label="Detalhes" />
          </template>
        </Card>
      </div>
    </div>
    <div v-else class="row row-gap-4">
      <div class="col-3">
        <Card>
          <template #title>
            <h1>
              <Skeleton height="3.5rem"></Skeleton>
            </h1>
            <Divider />
          </template>
          <template #content>
            <div class="text-center">
              <Skeleton width="250px" height="200px"></Skeleton>
            </div>
            <br />
            <p class="row row-gap-1">
              <Skeleton></Skeleton>
              <Skeleton></Skeleton>
              <Skeleton></Skeleton>
              <Skeleton></Skeleton>
              <Skeleton></Skeleton>
              <Skeleton></Skeleton>
              <Skeleton></Skeleton>
            </p>
            <div class="row">
              <div class="col pt-1">
                <span class="fs-3">
                  <Skeleton height="25px" width="80px"></Skeleton>
                </span>
              </div>
            </div>
          </template>
          <template #footer>
            <Skeleton width="93px" height="44px"></Skeleton>
          </template>
        </Card>
      </div>
      <div class="col-3">
        <Card>
          <template #title>
            <h1>
              <Skeleton height="3.5rem"></Skeleton>
            </h1>
            <Divider />
          </template>
          <template #content>
            <div class="text-center">
              <Skeleton width="250px" height="200px"></Skeleton>
            </div>
            <br />
            <p class="row row-gap-1">
              <Skeleton></Skeleton>
              <Skeleton></Skeleton>
              <Skeleton></Skeleton>
              <Skeleton></Skeleton>
              <Skeleton></Skeleton>
              <Skeleton></Skeleton>
              <Skeleton></Skeleton>
            </p>
            <div class="row">
              <div class="col pt-1">
                <span class="fs-3">
                  <Skeleton height="25px" width="80px"></Skeleton>
                </span>
              </div>
            </div>
          </template>
          <template #footer>
            <Skeleton width="93px" height="44px"></Skeleton>
          </template>
        </Card>
      </div>
      <div class="col-3">
        <Card>
          <template #title>
            <h1>
              <Skeleton height="3.5rem"></Skeleton>
            </h1>
            <Divider />
          </template>
          <template #content>
            <div class="text-center">
              <Skeleton width="250px" height="200px"></Skeleton>
            </div>
            <br />
            <p class="row row-gap-1">
              <Skeleton></Skeleton>
              <Skeleton></Skeleton>
              <Skeleton></Skeleton>
              <Skeleton></Skeleton>
              <Skeleton></Skeleton>
              <Skeleton></Skeleton>
              <Skeleton></Skeleton>
            </p>
            <div class="row">
              <div class="col pt-1">
                <span class="fs-3">
                  <Skeleton height="25px" width="80px"></Skeleton>
                </span>
              </div>
            </div>
          </template>
          <template #footer>
            <Skeleton width="93px" height="44px"></Skeleton>
          </template>
        </Card>
      </div>
      <div class="col-3">
        <Card>
          <template #title>
            <h1>
              <Skeleton height="3.5rem"></Skeleton>
            </h1>
            <Divider />
          </template>
          <template #content>
            <div class="text-center">
              <Skeleton width="250px" height="200px"></Skeleton>
            </div>
            <br />
            <p class="row row-gap-1">
              <Skeleton></Skeleton>
              <Skeleton></Skeleton>
              <Skeleton></Skeleton>
              <Skeleton></Skeleton>
              <Skeleton></Skeleton>
              <Skeleton></Skeleton>
              <Skeleton></Skeleton>
            </p>
            <div class="row">
              <div class="col pt-1">
                <span class="fs-3">
                  <Skeleton height="25px" width="80px"></Skeleton>
                </span>
              </div>
            </div>
          </template>
          <template #footer>
            <Skeleton width="93px" height="44px"></Skeleton>
          </template>
        </Card>
      </div>
    </div>

  </div>
</template>
