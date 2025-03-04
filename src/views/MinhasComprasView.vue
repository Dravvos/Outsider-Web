<template>
  <Header />
  <div class="container mt-4">
    <Card>
      <template #title>
        <h1>Minhas Compras</h1>
      </template>
      <template #content>
        <DataTable :value="pedidos">
          <Column header="Data da Compra" field="dataInclusao">
            <template #body="slotProps">
              {{ new Date(slotProps.data.dataInclusao).toLocaleString() }}
            </template>
          </Column>
          <Column header="Produto" field="produto.nome"></Column>
          <Column header="Quantidade" field="quantidade"></Column>
          <Column header="Preço unitário" field="preco">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.preco) }}
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>
<script setup lang="ts">

import Header from '@/components/Header.vue';
import { getAccessToken } from '@/services/auth';
import global from '@/stores/global';
import { getByUser } from '@/stores/pedido';
import { jwtDecode } from 'jwt-decode';
import { onBeforeMount, onMounted, ref } from 'vue';
import { DataTable, Column, Card } from 'primevue';

const pedidos = ref<any>([])

onBeforeMount(async () => {
  await global.util.isAuthenticated();
})

onMounted(async () => {
  const token = await getAccessToken();
  const tokenInfo: any = jwtDecode(token);
  const res = await getByUser(tokenInfo.sub);
  if (res.status === 200) {
    pedidos.value = res.data;
  }
})


const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

</script>
