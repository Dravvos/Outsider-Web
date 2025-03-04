<template>
  <Dialog v-model:visible="visivel" modal header="Criar Tabela Geral" :style="{ width: '25rem' }">
    <div class="d-flex justify-items-center gap-4 mb-4">
      <label for="Nome" class="font-semibold col-3 align-content-center">Nome</label>
      <InputText v-model="nome" id="Nome" class="flex-auto" autocomplete="off" />
    </div>
    <div class="d-flex justify-items-center gap-4 mb-8">
      <label for="Descricao" class="font-semibold col-3 align-content-center">Descrição</label>
      <InputText v-model="descricao" id="Descricao" class="flex-auto" autocomplete="off" />
    </div>

    <Divider />
    <h4>Item</h4>

    <div class="d-flex justify-items-center gap-4 mb-5">
      <label for="DescricaoItem" class="font-semibold col-3 align-content-center">Descrição</label>
      <InputText v-model="descricaoItem" id="DescricaoItem" class="flex-auto" autocomplete="off" />
    </div>

    <div class="d-flex justify-items-center gap-4 mb-4 mt-3">
      <label for="Sigla" class="font-semibold col-3 align-content-center">Sigla</label>
      <InputText v-model="sigla" id="Sigla" @keydown="updateValue" @keyup="updateValue" class="flex-auto"
        autocomplete="off" />
    </div>


    <div class="d-flex justify-content-between mt-5">
      <Button type="button" label="Cancelar" severity="secondary" @click="visivel = false; clearFields()"
        icon="pi pi-ban"></Button>
      <Button type="button" label="Salvar" severity="success" @click="saveTabelaGeral" icon="pi pi-save"></Button>
    </div>
  </Dialog>

  <Header />
  <Panel class="container mt-5">

    <Button severity="success" label="Adicionar Tabela Geral" icon="pi pi-plus" @click="visivel = true"></Button>

    <div class="card mt-4">
      <DataTable resizable-columns columnResizeMode="fit" removable-sort :value="tabelasGerais" show-gridlines
        table-style="min-width: 50rem" paginator :rows="15" :rows-per-page-options="[5, 15, 30, 50, 100]"
        sort-field="tabelaGeral.nome" :sort-order=1>
        <Column hidden field="id" header="Id"></Column>
        <Column sortable field="tabelaGeral.nome" header="Nome"></Column>
        <Column sortable field="tabelaGeral.descricao" header="Descrição"></Column>
        <Column sortable field="descricao" header="Item"></Column>
        <Column sortable field="sigla" header="Sigla"></Column>
        <Column header="Ações">
          <template #body="slotProps">
            <div class="gap-3 d-flex">
              <Button size="small" v-tooltip.top="'Adicionar Item'" icon="pi pi-plus"
                @click="adicionarItem(slotProps.data)" severity="success" />
              <Button size="small" v-tooltip.top="'Editar tabela geral'" icon="pi pi-pencil"
                @click="editTabelaGeral(slotProps.data)" severity="info" />
              <Button size="small" v-tooltip.top="'Deletar tabela geral'" icon="pi pi-trash"
                @click="removeTabelaGeral(slotProps.data.id)" severity="danger" />
            </div>
          </template>
        </Column>
      </DataTable>
      <Toast />
    </div>
  </Panel>

</template>

<script setup lang='ts'>
import global from '@/stores/global';
import { ref, onMounted } from 'vue';
import {
  DataTable, Column, Panel, Button, Dialog,
  InputText, Divider, useToast, Toast,
  useConfirm
} from 'primevue';
import {
  getTabelasGerais, addTabelaGeral, updateTabelaGeralItem,
  deleteTabelaGeralItem, addTabelaGeralItem
} from '@/stores/tabelaGeral';
import Header from '@/components/Header.vue';

const toast = useToast();
const confirm = useConfirm();
const emit = defineEmits(['update:value'])

const updateValue = (e: Event) => {
  emit('update:value', (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.toUpperCase())
};


onMounted(async () => {
  await global.util.isAuthenticated();
  await global.util.userIsAdmin();
  await loadData();
});

async function loadData() {
  const resp = await getTabelasGerais('');
  if (resp.status === 200)
    tabelasGerais.value = resp.data;
}

const removeTabelaGeral = async (id: string) => {

  global.ui.confirmation(confirm, 'Deseja realmente deletar este item', async () => {
    const res = await deleteTabelaGeralItem(id);
    if (res.status == 200) {
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Item deletado com sucesso', life: 2800 });
      visivel.value = false;
      await loadData();
    }
  })

}

const editTabelaGeral = (tabelaGeralItem: any) => {
  itemId.value = tabelaGeralItem.id;
  nome.value = tabelaGeralItem.tabelaGeral.nome;
  descricao.value = tabelaGeralItem.tabelaGeral.descricao;
  sigla.value = tabelaGeralItem.sigla;
  descricaoItem.value = tabelaGeralItem.descricao;
  tabelaGeralId.value = tabelaGeralItem.tabelaGeral.id;
  visivel.value = true;

}

const adicionarItem = (tabelaGeralItem: any) => {
  tabelaGeralId.value = tabelaGeralItem.tabelaGeral.id;
  visivel.value = true;
  nome.value = tabelaGeralItem.tabelaGeral.nome;
  descricao.value = tabelaGeralItem.tabelaGeral.descricao;
}


const saveTabelaGeral = async () => {
  if (global.util.isNullOrEmpty(tabelaGeralId.value) === false) {

    const tgi = {
      Id: null,
      Descricao: descricaoItem.value,
      Sigla: sigla.value,
      TabelaGeralId: tabelaGeralId.value,
      dataInclusao: new Date()
    }

    const res = await addTabelaGeralItem(tgi);
    if (res.status == 200 || res.status == 201) {
      global.ui.notification.success(toast, 'Item criado com sucesso', 2800);
      visivel.value = false;
      await loadData();
      clearFields();
    }
    else if (res.status === 400 || res.status === 500) {
      console.log('reponse: ', res);
      global.ui.notification.error(toast, res.data);
    }
  }
  else if (global.util.isNullOrEmpty(tabelaGeralId.value) && global.util.isNullOrEmpty(itemId.value)) {
    const tg = {
      Id: null,
      Nome: nome.value,
      Descricao: descricao.value,
      dataInclusao: new Date()
    };

    const tgi = {
      Id: null,
      Descricao: descricaoItem.value,
      Sigla: sigla.value,
      dataInclusao: new Date()
    }
    const res = await addTabelaGeral(tg, tgi);
    const guidRegex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
    if (res.status == 200 || res.status == 201 || guidRegex.test(res.data)) {
      global.ui.notification.success(toast, 'Tabela geral salva com sucesso', 2800);
      visivel.value = false;
      await loadData();
      clearFields();
    }
    else if (res.status === 400 || res.status === 500) {
      console.log('reponse: ', res);
      global.ui.notification.error(toast, res.data);
    }

  }
  else {
    const tgi = {
      Id: itemId.value,
      Descricao: descricaoItem.value,
      Sigla: sigla.value,
      TabelaGeralId: tabelaGeralId.value
    }

    const res = await updateTabelaGeralItem(itemId.value, tgi);
    if (res.status == 200 || res.status == 204) {
      global.ui.notification.success(toast, 'Tabela geral salva com sucesso', 2800);
      visivel.value = false;
      await loadData();
      clearFields();
    }
    else if (res.status === 400 || res.status === 500) {
      console.log('reponse: ', res);
      global.ui.notification.error(toast, res.data);
    }
  }

}

const clearFields = () => {
  itemId.value = '';
  tabelaGeralId.value = '';
  nome.value = '';
  descricao.value = '';
  descricaoItem.value = '';
  sigla.value = '';
}

const itemId = ref<string>('');
const tabelaGeralId = ref<string>('');
const nome = ref<string>('');
const descricao = ref<string>('');
const descricaoItem = ref<string>('');
const sigla = ref<string>('');
const tabelasGerais = ref<[]>([]);
const visivel = ref<boolean>(false);
</script>
