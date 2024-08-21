<script setup>
import { computed, ref, watch } from "vue";
import { useMainStore } from "@/stores/main";
import { mdiEye, mdiTrashCan, mdiPencil } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { notify } from "@kyvg/vue3-notification";
import FormField from "@/components/FormField.vue";

import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";

import {
  CheckIcon,
  ChevronUpDownIcon,
  BarsArrowUpIcon,
} from "@heroicons/vue/20/solid";


const unidadesMedida = [
  { id: 1, name: "ml" },
  { id: 2, name: "cm" },
  { id: 3, name: "m" },
  { id: 4, name: "pulgada" },
  { id: 5, name: "pie" },
];

const tiposProveedor = [
  { id: 1, name: "Proveedor 1" },
  { id: 2, name: "Proveedor 2" },
  { id: 3, name: "Proveedor 3" },
  { id: 4, name: "Proveedor 4" },
  { id: 5, name: "Proveedor 5" },
];


const medidas = [
  { id: 1, name: "Metro(lineal)" },
  { id: 2, name: "Metro cuadrado" },
  { id: 3, name: "Metro cubico" },
  { id: 4, name: "Milimetro" },
  { id: 5, name: "Centimetro" },
];
const selected = ref(unidadesMedida[0]);
const provedorSelected = ref(tiposProveedor[0]);

const backendURL = import.meta.env.VITE_BACKEND_URL;

const { data, modalcreate } = defineProps({
  checkable: Boolean,
  columns: Array,
  data: Array,
  modaltitle: String,
  modalcreate: Boolean,
});

const mainStore = useMainStore();

const items = computed(() => mainStore.materials);

const isModalActive = ref(false);
const showDeleteIcon = ref(false);

const isModalDangerActive = ref(false);
const createModalOpen = computed(() => mainStore.materialModalCreateisOpen);

let recordToDelete = -1;

async function openDeleteModal(idRecord) {
  // Save id apu
  recordToDelete = idRecord;
  isModalDangerActive.value = true;
  showDeleteIcon.value = true;
  itemIdToDelete.value = idRecord;
};

const perPage = ref(4);

const currentPage = ref(0);

const checkedRows = ref([]);

const itemsPaginated = computed(() =>
items.value.data?.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
);

const selectedItem = ref({})
const isEditing = ref(false)

const handleOpenModal =  (item, type) => {
  isModalActive.value = true;
  selectedItem.value = item;

  //if the find method doesnt find the item, it returns default value
  selected.value = unidadesMedida.find((unidad) => unidad.name === item.unitMeasurement) || unidadesMedida[0];
  provedorSelected.value = tiposProveedor.find((proveedor) => proveedor.name === item.providerType) || tiposProveedor[0];


  if(type === "isEditing") {
    isEditing.value = true
  } else {
    isEditing.value = false
  }



  showDeleteIcon.value = false;
  
}

const newMaterial = ref({
  name: '',
  unitMeasurement: '',
  unitValue: 1,
  providerType: '',
  quantity: 0,
});

const handleOpenCreateModal = () => {
  isModalCreatingActive.value = true;
}

const closeModal = () => {
  isModalActive.value = false;
  selectedItem.value = null;
  mainStore.setMaterialModalCreateisOpen(false);
}

const numPages = computed(() => Math.ceil(items.value.data?.length / perPage.value));

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
  

  //data.splice(recordToDelete, 1);
  await axios.delete(`${backendURL}/materials/${itemIdToDelete.value}`)
    .then(async function (response) {
      console.log(response);
       await mainStore.loadMaterials();
       itemIdToDelete.value = -1;
       notify({
        type: "success",
        title: "Material eliminado con exito!",
      });
    })
    .catch(function (error) {
      console.log(error);
      notify({
        type: "error",
        title: "Error durante la eliminación del material",
      });
    });
}

const router = useRouter();

const itemIdToDelete = ref(-1);
const sortOrder = ref("desc");


const saveMaterial = async () => {
  //prevent default reload
  event.preventDefault();
  try {
    await axios.post(`${backendURL}/materials?sort=${sortOrder.value}`, {
        // ...newMaterial.value,
        unitMeasurement: selected.value.name,
        providerType: provedorSelected.value.name,
        name: newMaterial.value.name.toLowerCase(),
        unitValue: parseInt(newMaterial.value.unitValue),
      }
    );
      closeModal();
      await mainStore.loadMaterials();
      notify({
        type: "success",
        title: "Material guardado con exito!",
      });
  } catch (error) {
    console.log(error)
  }
 
}


const updateMaterial = async () => {
  event.preventDefault();
  try {
     await axios.put(`${backendURL}/materials/${selectedItem.value.id}`, {
        name: selectedItem.value.name.toLowerCase(),
        providerType: provedorSelected.value.name, 
        unitValue: parseInt(selectedItem.value.unitValue), 
        unitMeasurement: selected.value.name
      }
    );
      closeModal();
      await mainStore.loadMaterials();
      notify({
        type: "success",
        title: "Material actualizado con exito!",
      });
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>

  <!-- View/Edit modal -->
  <CardBoxModal v-model="isModalActive" :title="modaltitle">
   
   <div class="grid grid-cols-1 gap-x-8 gap-y-4 pt-5 ">
  

      <form class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div class="px-4 py-6 sm:p-8">
          <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

            <div class="sm:col-span-3">
              <label for="first-name" class="block text-sm font-medium leading-6 text-gray-900">Nombre</label>
              <div class="mt-2">
                <input type="text"  v-if="isEditing" v-model="selectedItem.name" name="first-name" id="first-name" autocomplete="given-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"  />

                <input type="text" v-if="isEditing==false" v-model="selectedItem.name" disabled="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6" />
              </div>
            </div>

            <FormField class="sm:col-span-3 pt-2">
              <Listbox as="div" v-model="selected" :disabled="!isEditing">
                <ListboxLabel
                  class="block text-sm font-medium leading-4 text-gray-600"
                  >Unidad de Medida</ListboxLabel
                >
                <div class="relative pt-2">
                  <ListboxButton
                    class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <span class="block truncate">{{ selected.name }}</span>
                    <span
                      class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                    >
                      <ChevronUpDownIcon
                        class="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </ListboxButton>

                  <transition
                    leave-active-class="transition ease-in duration-100"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                  >
                    <ListboxOptions
                      class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    >
                      <ListboxOption
                        as="template"
                        v-for="recurso in unidadesMedida"
                        :key="recurso.id"
                        :value="recurso"
                        v-slot="{ active, selected }"
                      >
                        <li
                          :class="[
                            active
                              ? 'bg-indigo-600 text-white'
                              : 'text-gray-900',
                            'relative cursor-default select-none py-2 pl-3 pr-9',
                          ]"
                        >
                          <span
                            :class="[
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate',
                            ]"
                            >{{ recurso.name }}</span
                          >

                          <span
                            v-if="selected"
                            :class="[
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4',
                            ]"
                          >
                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </FormField>

            <div class="sm:col-span-3">
              <label for="first-name"  class="block text-sm font-medium leading-6 text-gray-900">Valor unitario</label>
              <div class="mt-2">
                  <input type="text"  v-if="isEditing" v-model="selectedItem.unitValue" name="first-name" id="first-name" autocomplete="given-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"  />

                <input type="text" v-if="isEditing==false" v-model="selectedItem.unitValue" disabled="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6" />
              </div>
            </div>

            <FormField class="sm:col-span-3 pt-2">
              <Listbox as="div" v-model="provedorSelected" :disabled="!isEditing">
                <ListboxLabel
                  class="block text-sm font-medium leading-4 text-gray-600"
                  >Tipo de proveedor</ListboxLabel
                >
                <div class="relative mt-2">
                  <ListboxButton
                    class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <span class="block truncate">{{ provedorSelected.name }}</span>
                    <span
                      class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                    >
                      <ChevronUpDownIcon
                        class="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </ListboxButton>

                  <transition
                    leave-active-class="transition ease-in duration-100"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                  >
                    <ListboxOptions
                      class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    >
                      <ListboxOption
                        as="template"
                        v-for="recurso in tiposProveedor"
                        :key="recurso.id"
                        :value="recurso"
                        v-slot="{ active, selected }"
                      >
                        <li
                          :class="[
                            active
                              ? 'bg-indigo-600 text-white'
                              : 'text-gray-900',
                            'relative cursor-default select-none py-2 pl-3 pr-9',
                          ]"
                        >
                          <span
                            :class="[
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate',
                            ]"
                            >{{ recurso.name }}</span
                          >

                          <span
                            v-if="selected"
                            :class="[
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4',
                            ]"
                          >
                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </FormField>
            

         


          </div>
        </div>
        <div  class="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <button type="button" class="text-sm font-semibold leading-6 text-gray-900" @click="closeModal()">Cancelar</button>
          <button type="submit" v-if="isEditing" @click="updateMaterial();" class="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Actualizar</button>
        </div>
      </form>
    </div>

  </CardBoxModal>

  <!-- Create modal -->
  <CardBoxModal v-model="createModalOpen" title="Crear material">
   
   <div class="grid grid-cols-1 gap-x-8 gap-y-4 pt-5 ">
  
      <form class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div class="px-4 py-6 sm:p-8">
          <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

            <div class="sm:col-span-3">
              <label for="first-name" class="block text-sm font-medium leading-6 text-gray-900">Nombre</label>
              <div class="mt-2">
                <input type="text"   v-model="newMaterial.name" name="first-name" id="first-name" autocomplete="given-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"  />
              </div>
            </div>

            <FormField class="sm:col-span-3 pt-2">
              <Listbox as="div" v-model="selected" >
                <ListboxLabel
                  class="block text-sm font-medium leading-4 text-gray-600"
                  >Unidad de Medida</ListboxLabel
                >
                <div class="relative pt-2">
                  <ListboxButton
                    class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <span class="block truncate">{{ selected.name }}</span>
                    <span
                      class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                    >
                      <ChevronUpDownIcon
                        class="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </ListboxButton>

                  <transition
                    leave-active-class="transition ease-in duration-100"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                  >
                    <ListboxOptions
                      class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    >
                      <ListboxOption
                        as="template"
                        v-for="recurso in unidadesMedida"
                        :key="recurso.id"
                        :value="recurso"
                        v-slot="{ active, selected }"
                      >
                        <li
                          :class="[
                            active
                              ? 'bg-indigo-600 text-white'
                              : 'text-gray-900',
                            'relative cursor-default select-none py-2 pl-3 pr-9',
                          ]"
                        >
                          <span
                            :class="[
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate',
                            ]"
                            >{{ recurso.name }}</span
                          >

                          <span
                            v-if="selected"
                            :class="[
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4',
                            ]"
                          >
                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </FormField>

            <div class="sm:col-span-3">
              <label for="first-name"  class="block text-sm font-medium leading-6 text-gray-900">Valor unitario</label>
              <div class="mt-2">
                  <input type="number"  v-model="newMaterial.unitValue" name="first-name" id="first-name" autocomplete="given-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"  />

              
              </div>
            </div>

            <FormField class="sm:col-span-3 pt-2">
              <Listbox as="div" v-model="provedorSelected">
                <ListboxLabel
                  class="block text-sm font-medium leading-4 text-gray-600"
                  >Tipo de proveedor</ListboxLabel
                >
                <div class="relative mt-2">
                  <ListboxButton
                    class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <span class="block truncate">{{ provedorSelected.name }}</span>
                    <span
                      class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                    >
                      <ChevronUpDownIcon
                        class="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </ListboxButton>

                  <transition
                    leave-active-class="transition ease-in duration-100"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                  >
                    <ListboxOptions
                      class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    >
                      <ListboxOption
                        as="template"
                        v-for="recurso in tiposProveedor"
                        :key="recurso.id"
                        :value="recurso"
                        v-slot="{ active, selected }"
                      >
                        <li
                          :class="[
                            active
                              ? 'bg-indigo-600 text-white'
                              : 'text-gray-900',
                            'relative cursor-default select-none py-2 pl-3 pr-9',
                          ]"
                        >
                          <span
                            :class="[
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate',
                            ]"
                            >{{ recurso.name }}</span
                          >

                          <span
                            v-if="selected"
                            :class="[
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4',
                            ]"
                          >
                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </FormField>

            <div class="sm:col-span-3">
              <label for="first-name"  class="block text-sm font-medium leading-6 text-gray-900">Cantidad</label>
              <div class="mt-2">
                  <input type="number"  v-model="newMaterial.quantity" name="first-name" id="first-name" autocomplete="given-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"  />

              
              </div>
            </div>


         


          </div>
        </div>
        <div  class="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <button type="button" class="text-sm font-semibold leading-6 text-gray-900" @click="closeModal()">Cancelar</button>
          <button type="submit" @click="saveMaterial() " class="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Guardar</button>
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
          {{ item.unitMeasurement }}
        </td>
        <td data-label="TypeConstruction" class="text-lowercase">
          {{ item.unitValue }}
        </td>
        <td data-label="Transport">
          {{ item.providerType }}
        </td>

        <td data-label="Transport">
          0
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
    <button type="button"></button>
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
