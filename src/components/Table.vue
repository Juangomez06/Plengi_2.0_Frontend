<script setup>
import { computed, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { mdiEye, mdiTrashCan, mdiPencil } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import { useRouter } from "vue-router";
import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const { data } = defineProps({
  checkable: Boolean,
  columns: Array,
  data: Array,
  modaltitle: String,
});

const mainStore = useMainStore();

const items = computed(() => data);

const isModalActive = ref(false);
const showDeleteIcon = ref(false);

const isModalDangerActive = ref(false);

let recordToDelete = -1;

async function openDeleteModal(idRecord) {
  // Save id apu
  recordToDelete = idRecord;
  isModalDangerActive.value = true;
  showDeleteIcon.value = true;
};

const perPage = ref(4);

const currentPage = ref(0);

const checkedRows = ref([]);

const itemsPaginated = computed(() =>
  items.value.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
);

const selectedItem = ref({})
const isEditing = ref(false)

const handleOpenModal =  (item, type) => {
  isModalActive.value = true;
  selectedItem.value = item;
  if(type === "isEditing") {
    isEditing.value = true
  } else {
    isEditing.value = false
  }

  showDeleteIcon.value = false;
  
}

const closeModal = () => {
  isModalActive.value = false;
  selectedItem.value = null;
}

const numPages = computed(() => Math.ceil(items.value.length / perPage.value));

const currentPageHuman = computed(() => currentPage.value + 1);

const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }

  return pagesList;
});

const remove = (arr, cb) => {
  const newArr = [];

  arr.forEach((item) => {
    if (!cb(item)) {
      newArr.push(item);
    }
  });

  return newArr;
};

const checked = (isChecked, client) => {
  if (isChecked) {
    checkedRows.value.push(client);
  } else {
    checkedRows.value = remove(
      checkedRows.value,
      (row) => row.id === client.id
    );
  }
};

const action = ref();

async function checkAction(emitValue) {
  console.log("table", emitValue);
  action.value = emitValue;

  // data.splice(recordToDelete, 1);
  await axios.delete(`${backendURL}/apu/${recordToDelete}`)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

const router = useRouter();

const editAPU = (idAPU) => {
  router.push(`/edit-apu/${idAPU}`);
}
</script>

<template>
  <CardBoxModal v-model="isModalActive" :title="modaltitle">
   
   <div class="grid grid-cols-1 gap-x-8 gap-y-4 pt-5 ">
  

      <form class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div class="px-4 py-6 sm:p-8">
          <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

            <div class="sm:col-span-3">
              <label for="first-name" class="block text-sm font-medium leading-6 text-gray-900">Actividad</label>
              <div class="mt-2">
                <input type="text"  v-if="isEditing" v-model="selectedItem.name" name="first-name" id="first-name" autocomplete="given-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"  />

                <input type="text" v-if="isEditing==false" v-model="selectedItem.name" disabled="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6" />
              </div>
            </div>

            <div class="sm:col-span-3">
              <label for="last-name" class="block text-sm font-medium leading-6 text-gray-900">Medida </label>
              <div class="mt-2">
                <input type="text"  v-if="isEditing" v-model="selectedItem.measurement" name="first-name" id="first-name" autocomplete="given-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"  />

                <input type="text" v-if="isEditing==false" v-model="selectedItem.measurement" disabled="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6" />
              </div>
            </div>

            <div class="sm:col-span-3">
              <label for="first-name"  class="block text-sm font-medium leading-6 text-gray-900">Tipo de Construccion</label>
              <div class="mt-2">
                  <input type="text"  v-if="isEditing" v-model="selectedItem.typeConstruction" name="first-name" id="first-name" autocomplete="given-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"  />

                <input type="text" v-if="isEditing==false" v-model="selectedItem.typeConstruction" disabled="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6" />
              </div>
            </div>

            <div class="sm:col-span-3">
              <label for="last-name" class="block text-sm font-medium leading-6 text-gray-900">Transporte </label>
              <div class="mt-2">
                <input type="text"  v-if="isEditing" v-model="selectedItem.transport" name="first-name" id="first-name" autocomplete="given-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"  />

                <input type="text" v-if="isEditing==false" v-model="selectedItem.transport" disabled="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6" />
              </div>
            </div>

         


          </div>
        </div>
        <div  class="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <button type="button" class="text-sm font-semibold leading-6 text-gray-900" @click="closeModal()">Cancelar</button>
          <button type="submit" v-if="isEditing" class="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Actualizar</button>
        </div>
      </form>
    </div>

  </CardBoxModal>

  <CardBoxModal
    v-model="isModalDangerActive"
    title="Confirmación de eliminación"
    button="danger"
    buttonLabel="Eliminar"
    @confirm="checkAction"
    showDeleteIcon="showDeleteIcon.value"
    has-cancel
  >
    <p>¿Realmente desea <b>eliminar</b> el registro?</p>
  </CardBoxModal>

  <div v-if="checkedRows.length" class="p-3 bg-gray-100/50 dark:bg-slate-800">
    <span
      v-for="checkedRow in checkedRows"
      :key="checkedRow.id"
      class="inline-block px-2 py-1 rounded-sm mr-2 text-sm bg-gray-100 dark:bg-slate-700"
    >
      {{ checkedRow.name }}
    </span>
  </div>

  <table>
    <thead>
      <tr>
        <!-- <th v-if="checkable" />
        <th /> -->
        <th v-for="column in columns">
          {{ column.title }}
        </th>
        <!-- <th>Name</th>
        <th>Company</th>
        <th>City</th>
        <th>Progress</th>
        <th>Created</th> -->
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in itemsPaginated" :key="item.id">
        <td data-label="Activity" class="text-capitalize">
          {{ item.name }}
        </td>
        <td data-label="Measurement" class="text-lowercase">
          {{ item.measurement }}
        </td>
        <td data-label="TypeConstruction" class="text-lowercase">
          {{ item.typeConstruction }}
        </td>
        <td data-label="Transport">
          {{ item.transport }}
        </td>

        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiEye"
              small
              @click='handleOpenModal(item, "")'
            />
            <BaseButton
              color="success"
              :icon="mdiPencil"
              small
              @click='handleOpenModal(item, "isEditing")'
            />
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="openDeleteModal(item.id)"
            />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
    <BaseLevel>
      <BaseButtons>
        <BaseButton
          v-for="page in pagesList"
          :key="page"
          :active="page === currentPage"
          :label="page + 1"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'"
          small
          @click="currentPage = page"
        />
      </BaseButtons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </BaseLevel>
  </div>
</template>

<style scoped>
.text-capitalize {
  text-transform: capitalize;
}

.text-uppercase {
  text-transform: uppercase;
}

.text-lowercase {
  text-transform: lowercase;
}
</style>
