<script setup>
import {
  mdiTableBorder,
  mdiFolderPlus,
} from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/SectionMain.vue";
import Table from "@/components/Table.vue";
import CardBox from "@/components/CardBox.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";
import { useRouter } from "vue-router";
import { onMounted, ref, computed } from 'vue';
import TableMateriales from "@/components/TableMateriales.vue";
import { useMainStore } from '../stores/main';
import TableLabours from "@/components/TableLabours.vue";


const columns = [
  { title: "Nombre", key: "name" },
  { title: "Unidad de medida", key: "unitMeasurement" },
  { title: "Valor unitario", key: "unitValue" },
  { title: "Tipo de Trabajo", key: "workType" },
  { title: "Cantidad", key: "quantity" },
  { title: "Acciones", key: "actions" },
];


const store = useMainStore();
const items = store.labours;

const isCreatingModal = ref(false);

onMounted(async () => {
  await store.setLaboursModalCreateisOpen();
  await store.loadLabours();
});

const router = useRouter();

const click = () => {
  isCreatingModal.value = true;
  store.setLaboursModalCreateisOpen(true);
}

const modalProp = computed(() => isCreatingModal.value);
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="Mano de obra" main>
        <BaseButton @click="click" :icon="mdiFolderPlus"
          label="Crear nuevo item" color="contrast" rounded-full small />
      </SectionTitleLineWithButton>

      <template v-if="items">
        <CardBox class="mb-6" has-table>
          <TableLabours
            :columns="columns"
            :data="items.data"
            modaltitle="Mano de obra"
            :modalcreate="isCreatingModal"
            checkable
          >
          </TableLabours>
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
