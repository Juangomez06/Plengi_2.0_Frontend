<script setup>
import {
  mdiTableBorder,
  mdiFolderPlus,
} from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import Table from "@/components/Table.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";
import { useRouter } from "vue-router";
import { onMounted, ref } from 'vue';
import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL;

function formatMoney(amount) {
  return amount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
}

const columns = [
  { title: "Actividad", key: "activity" },
  { title: "Medida", key: "measurement" },
  { title: "Tipo construcción", key: "price" },
  { title: "Transport", key: "transport" },
  { title: "Acciones", key: "actions" },
];

const items = ref();

async function getData() {
  await axios.get(`${backendURL}/apus`)
    .then((response) => {
      items.value = response.data;
    });
};

onMounted(() => {
  getData();
});

const router = useRouter();

const click = () => {
  router.push("/new-apu");
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="Listado de Análisis de Precios Unitarios" main>
        <BaseButton @click="click" target="_blank" :icon="mdiFolderPlus"
          label="Crear nuevo APU" color="contrast" rounded-full small />
      </SectionTitleLineWithButton>

      <template v-if="items">
        <CardBox class="mb-6" has-table>
          <Table
            :columns="columns"
            :data="items.data"
            modaltitle="APU"
            checkable
          >
          </Table>
        </CardBox>
      </template>

      <template v-else>
        <CardBox>
          <CardBoxComponentEmpty />
        </CardBox>
      </template>
    </SectionMain>
  </LayoutAuthenticated>
</template>
