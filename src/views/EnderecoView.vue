<template>
  <Header />
  <div class="container mt-5">

    <Panel class="bg-dark">
      <template #header>
        <h1>Endereços</h1>
      </template>
      <template #default>
        <div class="row ms-4 mt-4">
          <div role="button" class="col-3 rounded d-flex align-items-center justify-content-center"
            style="border: 1px dashed white; height: 260px;" @click="modal = true">
            <span class="fs-4"><i class="pi pi-plus"></i> Adicionar Endereço</span>
          </div>
          <div class="col-4 fs-5" v-for="(item) in enderecos">
            <Card>
              <template #content>
                <div class="row d-flex row-gap-2">
                  <div class="col-12">
                    <b> {{ item.recebedor }}</b>
                  </div>
                  <div class="col-12">
                    {{ item.logradouro }}, {{ item.numero }}
                  </div>
                  <div class="col-12">
                    {{ item.complemento }} {{ item.bairro }}
                  </div>
                  <div class="col-12">
                    {{ item.cidade }}, {{ item.estado }} {{ item.cep }}
                  </div>
                </div>
              </template>
              <template #footer>
                <div class="gap-3 d-flex mt-3">
                  <Button @click="editEndereco(item)" severity="info" icon="pi pi-pencil"
                    v-tooltip.bottom="'Alterar'" />
                  <Button @click="deletarEndereco(item.id)" severity="danger" icon="pi pi-trash"
                    v-tooltip.bottom="'Excluir'" />
                </div>
              </template>
            </Card>
          </div>
        </div>
      </template>
    </Panel>

    <Dialog @after-hide="clearFields" v-model:visible="modal" modal header="Salvar Endereço" style="width: 30rem;">
      <div class="d-flex justify-items-center gap-4 mb-5">
        <FloatLabel variant="in" class="w-100">
          <InputText v-model="recebedor" fluid />
          <label>Recebedor:</label>
        </FloatLabel>
      </div>
      <div class="d-flex justify-items-center gap-4 mb-5">
        <FloatLabel variant="in" class="w-100">
          <label>CEP:</label>
          <InputMask v-model="cep" @blur="getEnderecoByCep" mask="99999-999" fluid />
        </FloatLabel>
      </div>
      <div class="d-flex justify-items-center gap-4 mb-5">
        <FloatLabel variant="in" class="w-100">
          <InputText v-model="logradouro" fluid />
          <label>Endereço:</label>
        </FloatLabel>
      </div>
      <div class="d-flex justify-items-center gap-4 mb-5">
        <FloatLabel variant="in" class="w-100">
          <InputNumber v-model="numero" fluid />
          <label>Número:</label>
        </FloatLabel>
      </div>
      <div class="d-flex justify-items-center gap-4 mb-5">
        <FloatLabel variant="in" class="w-100">
          <InputText v-model="complemento" fluid />
          <label>Complemento (opcional):</label>
        </FloatLabel>
      </div>
      <div class="d-flex justify-items-center gap-4 mb-5">
        <FloatLabel variant="in" class="w-100">
          <InputText v-model="bairro" fluid />
          <label>Bairro:</label>
        </FloatLabel>
      </div>
      <div class="d-flex justify-items-center gap-4 mb-5">
        <FloatLabel variant="in" class="w-100">
          <InputText v-model="cidade" disabled fluid />
          <label>Cidade:</label>
        </FloatLabel>
      </div>
      <div class="d-flex justify-items-center gap-4 mb-5">
        <FloatLabel variant="in" class="w-100">
          <InputText v-model="estado" disabled fluid />
          <label>Estado:</label>
        </FloatLabel>
      </div>
      <div class="d-flex justify-content-between">
        <Button severity="secondary" icon="pi pi-ban" label="Cancelar" @click="modal = false, clearFields()" />
        <Button icon="pi pi-save" label="Salvar" @click="salvarEndereco" />
      </div>

    </Dialog>
  </div>

</template>
<script setup lang="ts">
import { getEnderecos, createEndereco, updateEndereco, deleteEndereco } from '@/stores/endereco';
import Header from '@/components/Header.vue';
import { Panel, Card, Dialog, FloatLabel, InputText, InputNumber, InputMask, Button, useToast, useConfirm } from 'primevue';
import { onMounted, ref } from 'vue';
import global from '@/stores/global';
import { getAccessToken } from '@/services/auth';
import { jwtDecode } from 'jwt-decode';
import { get } from '@/services/viacep-api-handler';
import router from '@/router';

const enderecos = ref<any>([]);
const enderecoId = ref<string | null>();
const logradouro = ref<string>();
const cep = ref<string>();
const cidade = ref<string>();
const bairro = ref<string>();
const estado = ref<string>();
const complemento = ref<string>();
const numero = ref<number>();
const modal = ref<boolean>(false);
const usuarioId = ref<string>('');
const recebedor = ref<string>('');

const toast = useToast();
const confirm = useConfirm();

onMounted(async () => {
  await global.util.isAuthenticated();
  await loadEnderecos();
})

async function loadEnderecos() {
  const token = await getAccessToken();
  const tokenInfo: any = jwtDecode(token);
  usuarioId.value = tokenInfo.sub
  const resp = await getEnderecos(usuarioId.value);
  if (resp.status === 200) {
    enderecos.value = resp.data;
  }
}

async function salvarEndereco() {
  const address = {
    id: enderecoId.value,
    logradouro: logradouro.value,
    cidade: cidade.value,
    estado: estado.value,
    bairro: bairro.value,
    numero: numero.value,
    complemento: complemento.value,
    cep: cep.value,
    usuarioId: usuarioId.value,
    recebedor: recebedor.value
  }

  if (global.util.isNullOrEmpty(enderecoId.value)) {
    const res = await createEndereco(address);
    if (res.status === 200) {
      global.ui.notification.success(toast, 'Endereço adicionado com sucesso');
      await loadEnderecos();
      clearFields();
    }
    else if (res.status === 401 || res.status === 403)
      router.push('/');
    else if (res.status === 400 || res.status === 500) {
      global.ui.notification.error(toast, res.data);
    }
  }
  else {
    const res = await updateEndereco(address);
    if (res.status === 200) {
      global.ui.notification.success(toast, 'Endereço adicionado com sucesso');
      await loadEnderecos();
      clearFields();
    }
    else if (res.status === 401 || res.status === 403)
      router.push('/');
    else if (res.status === 400 || res.status === 500) {
      global.ui.notification.error(toast, res.data);
    }
  }

}

async function getEnderecoByCep() {
  const resp = await get(cep.value + '/json');
  if (resp.status === 200) {
    console.log('Endereço completo: ', resp.data);
    logradouro.value = resp.data.logradouro;
    bairro.value = resp.data.bairro;
    cidade.value = resp.data.localidade;
    estado.value = resp.data.uf;
  }
}

function clearFields() {
  enderecoId.value = null;
  cep.value = '';
  logradouro.value = ''
  numero.value = 0;
  complemento.value = ''
  bairro.value = ''
  cidade.value = ''
  estado.value = ''
}

function editEndereco(endereco: any) {
  enderecoId.value = endereco.id;
  cep.value = endereco.cep;
  logradouro.value = endereco.logradouro;
  numero.value = endereco.numero;
  complemento.value = endereco.complemento;
  bairro.value = endereco.bairro;
  cidade.value = endereco.cidade;
  estado.value = endereco.estado;
  recebedor.value = endereco.recebedor;
  modal.value = true;
}

function deletarEndereco(id: string) {
  global.ui.confirmation(confirm, 'Deseja realmente deletar este endereço?', async () => {
    const ret = await deleteEndereco(id);
    if (ret.status === 200) {
      global.ui.notification.success(toast, 'Endereço deletado com sucesso');
      await loadEnderecos();
    }
    else if (ret.status === 400) {
      global.ui.notification.error(toast, ret.data);
    }
    else if (ret.status === 401) {
      global.ui.notification.warning(toast, 'Sua sessão expirou');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }
  })
}

</script>
