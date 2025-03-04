<template>
  <Header />
  <div class="container pt-4">
    <Card>
      <template #title>
        <h1>Cupons</h1>
        <Button label="Adicionar cupom" @click="visivel = true" icon="pi pi-plus" class="mb-4 mt-2" />
      </template>
      <template #content>
        <DataTable sort-field="codigoCupom" :sort-order="1" :value="cupons">
          <Column sortable field="codigoCupom" header="Código"></Column>
          <Column sortable field="porcentagemDesconto" header="Desconto">
            <template #body="slotprops">
              {{ formatDiscount(slotprops.data.porcentagemDesconto) }}
            </template>
          </Column>
          <Column sortable field="dataValidade" header="Validade do Cupom">
            <template #body="slotProps">
              {{ new Date(slotProps.data.dataValidade).toLocaleString() }}
            </template>
          </Column>
          <Column header="Ações">
            <template #body="slotProps">
              <div class="gap-3 d-flex">
                <Button size="small" v-tooltip.top="'Editar cupom'" icon="pi pi-pencil"
                  @click="editCupom(slotProps.data)" severity="info" />
                <Button size="small" v-tooltip.top="'Deletar cupom'" icon="pi pi-trash"
                  @click="removeCupom(slotProps.data.id)" severity="danger" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
  <Dialog header="Salvar Cupom" modal v-model:visible="visivel" style="width: 35rem;">
    <Card>
      <template #content>
        <div class="row row-gap-3">
          <div class="col-6">
            <FloatLabel variant="on">
              <label>Código:</label>
              <InputText v-model="codigoCupom" fluid />
            </FloatLabel>
          </div>
          <div class="col-6">
            <FloatLabel variant="on">

              <InputNumber :min="1" :max="99" :max-fraction-digits="2" v-model="desconto" fluid />
              <label>% Desconto:</label>
            </FloatLabel>
          </div>
          <div class="col-12">
            <FloatLabel variant="on">
              <label>Validade:</label>
              <DatePicker showButtonBar v-model="dataValidade" fluid date-format="dd/MM/yy" showTime hour-format="24" />
            </FloatLabel>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="d-flex justify-content-between mt-2">
          <Button icon="pi pi-ban" label="Cancelar" @click="clearFields" severity="secondary" />
          <Button icon="pi pi-save" label="Salvar" @click="salvarCupom" />
        </div>
      </template>
    </Card>
  </Dialog>
</template>
<script setup lang="ts">
import router from '@/router';
import { getCupons, createCupom, updateCupom, deleteCupom } from '@/stores/cupom';
import global from '@/stores/global';
import { Card, DataTable, Column, useToast, useConfirm, Dialog, InputText, InputNumber, DatePicker, Button, FloatLabel } from 'primevue';
import { onMounted, ref } from 'vue';
import Header from '@/components/Header.vue';

const cupons = ref<any>();
const codigoCupom = ref<string>();
const desconto = ref<number>();
const dataValidade = ref<Date>();
const cupomId = ref<string | null>(null);
const visivel = ref<boolean>(false);

const confirm = useConfirm();
const toast = useToast();

onMounted(async () => {
  await global.util.userIsAdmin();
  await loadCupons();
})

async function loadCupons() {
  const resp = await getCupons();
  if (resp.status === 200) {
    cupons.value = resp.data;
  }
  else if (resp.status === 401 || resp.status === 403)
    router.push('/');
}

async function salvarCupom() {
  const cupom = {
    id: cupomId.value,
    codigoCupom: codigoCupom.value,
    porcentagemDesconto: desconto.value,
    dataValidade: dataValidade.value
  }
  if (global.util.isNullOrEmpty(cupomId.value)) {
    const res = await createCupom(cupom);
    if (res.status === 200) {
      global.ui.notification.success(toast, 'Cupom criado com sucesso');
      clearFields();
    }
    else if (res.status === 401 || res.status === 403) {
      router.push('/')
    }
    else if (res.status === 400) {
      global.ui.notification.error(toast, res.data);
    }

  }
  else {
    const res = await updateCupom(cupom);
    if (res.status === 200) {
      global.ui.notification.success(toast, 'Cupom atualizado com sucesso');
      clearFields();
    }
    else if (res.status === 401 || res.status === 403) {
      router.push('/')
    }
    else if (res.status === 400)
      global.ui.notification.error(toast, res.data);
  }
}

function editCupom(cupom: any) {
  cupomId.value = cupom.id;
  codigoCupom.value = cupom.codigoCupom;
  dataValidade.value = cupom.dataValidade;
  desconto.value = cupom.porcentagemDesconto;
  visivel.value = true;
}


const removeCupom = async (id: string) => {

  global.ui.confirmation(confirm, 'Deseja realmente deletar este item', async () => {
    const res = await deleteCupom(id);
    if (res.status == 200) {
      global.ui.notification.success(toast, 'Cupom deletado com sucesso');
      visivel.value = false;
      await loadCupons();
    }
    else if (res.status === 401 || res.status === 403) {
      router.push('/')
    }
    else if (res.status === 400) {
      global.ui.notification.error(toast, res.data);
    }
  })

}

function formatDiscount(valor: number) {
  return valor.toFixed(2) + "%"
}

function clearFields() {
  codigoCupom.value = ''
  desconto.value = 0
  dataValidade.value = new Date();
  cupomId.value = null;
}

</script>
