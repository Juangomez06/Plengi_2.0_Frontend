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
import axios from "axios";
import TableMateriales from "@/components/TableMateriales.vue";

import { useMainStore } from '../stores/main';

const backendURL = import.meta.env.VITE_BACKEND_URL;

function formatMoney(amount) {
  return amount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
}

const columns = [
  { title: "Nombre", key: "name" },
  { title: "Unidad de medida", key: "unitMeasurement" },
  { title: "Valor unitario", key: "unitValue" },
  { title: "Tipo de Proveedor", key: "providerType" },
  { title: "Cantidad", key: "quantity" },
  { title: "Acciones", key: "actions" },
];


const store = useMainStore();
const items = store.materials;

const isCreatingModal = ref(false);

onMounted(async () => {
  await store.setMaterialModalCreateisOpen();
  await store.loadMaterials();
});

const router = useRouter();

const click = () => {
  isCreatingModal.value = true;
  store.setMaterialModalCreateisOpen(true);
}

const modalProp = computed(() => isCreatingModal.value);

import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'

const enabled = ref(false)
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="Materiales" main>
        
        <SwitchGroup as="div" class="flex items-center">
          <Switch v-model="enabled" :class="[enabled ? 'bg-indigo-600' : 'bg-gray-200', 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2']">
            <span aria-hidden="true" :class="[enabled ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']" />
          </Switch>
          <SwitchLabel as="span" class="ml-3 text-sm">
            <span class="font-medium text-gray-900">Order</span>
            {{ ' ' }}
            <span class="text-gray-500">(DESC)</span>
          </SwitchLabel>
        </SwitchGroup>
        <BaseButton @click="click" :icon="mdiFolderPlus"
          label="Crear nuevo item" color="contrast" rounded-full small />
      </SectionTitleLineWithButton>

      <template v-if="items">
        <CardBox class="mb-6" has-table>
          <TableMateriales
            :columns="columns"
            :data="items.data"
            modaltitle="Material"
            :modalcreate="isCreatingModal"
            checkable
          >
          </TableMateriales>
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
