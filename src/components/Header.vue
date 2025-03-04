<script setup lang="ts">
import { Button, Badge } from 'primevue';
import { getAccessToken, login, logout, signUp } from '../services/auth';
import global from '@/stores/global';
import { onMounted, ref } from 'vue';
import { jwtDecode } from 'jwt-decode';
import { getCarrinhoByUser } from '@/stores/carrinho';
import router from '@/router';

const logged = ref(false);
const admin = ref(false);
const carrinho = ref<any>([]);

onMounted(async () => {

  const token = ref<string>("");
  var tokenInfo: any = null;
  token.value = await getAccessToken();

  if (global.util.isNullOrEmpty(token.value) === false) {
    logged.value = true;
    tokenInfo = await jwtDecode(token.value);
    if (tokenInfo.role === 'Admin')
      admin.value = true;
    if (Math.floor(new Date().getTime() / 1000) > tokenInfo.exp)
      logged.value = false;
  }

  if (admin.value === false && logged.value) {
    const resp = await getCarrinhoByUser(tokenInfo.sub);
    if (resp.status === 200) {
      carrinho.value = resp.data;
    }
  }

});

</script>

<template>
  <header class="bg-dark mb-4">
    <div class="container">
      <div class="row">
        <div class="col-1 my-3">
          <Button as="router-link" to="/" label="Home" variant="link" />
        </div>

        <div v-if="logged == false" class="d-flex col-11 justify-content-end my-3 gap-4">
          <Button severity="secondary" @click="login" label="Login" />
          <Button severity="secondary" @click="signUp" label="Sign Up" />
        </div>
        <div v-else class="col-11 d-flex justify-content-end my-3 gap-3">
          <Button v-if="admin" label="Produtos" variant="link" as="router-link" to="/Produtos" />
          <Button v-tooltip.bottom="'Minhas Compras'" v-else as="router-link" to="/MinhasCompras"
            icon="pi pi-shopping-bag" />

          <Button v-if="admin" label="Cupons" variant="link" as="router-link" to="/Cupons" />
          <button class="btn btn-secondary" @click="router.push('/Carrinho')" v-else v-tooltip.bottom="'Carrinho'">
            <i class="pi pi-shopping-cart"></i> &nbsp;
            <Badge severity="contrast" :value="carrinho.length"></Badge>
          </button>

          <Button v-if="admin" label="Tabela Geral" variant="link" as="router-link" to="/TabelaGeral" />
          <Button v-tooltip.bottom="'Endereços'" v-else as="router-link" to="/Enderecos" icon="pi pi-home"
            severity="info" />

          <Button severity="secondary" @click="logout" label="Log Out" />

        </div>
      </div>

      <div class="">

      </div>

    </div>
  </header>
</template>
