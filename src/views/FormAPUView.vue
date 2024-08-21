<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { mdiBallotOutline } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import { useRouter, useRoute } from "vue-router";
import { notify } from "@kyvg/vue3-notification";
import axios from "axios";
//tailwindui components

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
  UsersIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/vue/20/solid";

const recursos = [
  { id: 1, name: "Material" },
  { id: 2, name: "Equipo" },
  { id: 3, name: "Mano de obra" },
];


const medidas = [
  { id: 1, name: "Metro(lineal)", shortName: "m" },
  { id: 2, name: "Metro cuadrado", shortName: "m2" },
  { id: 3, name: "Metro cubico", shortName: "m3" },
  { id: 4, name: "Milimetro", shortName: "mm" },
  { id: 5, name: "Centimetro", shortName: "cm" },
];
const selected = ref(recursos[0]);

const medidadSelected = ref(medidas[1]);
const typedValue = ref('');

const dynamicTable = ref([])
const dynamicInvoice = ref([])


const apu = ref({
  name: "",
  measurement: "",
  typeConstruction: "ck",
  transport: 2,
});

const apuBody = ref({
  teams:[],
  materials:[],
  labours:[],
});


const backendURL = import.meta.env.VITE_BACKEND_URL;

const selectOptionsTypeConstruction = [{ id: 1, label: "ck" }];

const selectOptionsMeasurement = [{ id: 1, label: "cm" }];

const form = reactive({
  name: "",
  email: "",
  phone: "",
  typeConstruction: selectOptionsTypeConstruction[0],
  measurement: selectOptionsMeasurement[0],
});


const submit = () => {
  //
};


const router = useRouter();
const route = useRoute();

// Url id
const getAPU = route.params?.id;

const pushDataToDynamicInvoice = (row) => {

  console.log(row);

  switch(selected.value.name) {
       case 'Material':
         row = {
          ...row,
          type: 'material',
         }
         break;
        case 'Equipo':
          row = {
          ...row,
          type: 'team',
          }
          break;
        case 'Mano de obra':
          row = {
          ...row,
          type: 'labour',
          }
          break;
        default:
          row = {
          ...row,
          type: 'material',
         }
          break;
    }

  // switch(selected.value.name) {
  //      case 'Material':
  //        apuBody.materials.push({
  //         id: row.id,
  //         amount: row.amount,
  //         waste: row.waste,
  //        });
  //        break;
  //       case 'Equipo':
  //         apuBody.teams.push({
  //         id: row.id,
  //         amount: row.amount,
  //         performance: row.performance,
  //        });
  //         break;
  //       case 'Mano de obra':
  //         apuBody.labours.push({
  //         id: row.id,
  //         amount: row.amount,
  //         performance: row.performance,
  //        });
  //         break;
  //       default:
  //         apuBody.materials.push({
  //         id: row.id,
  //         amount: row.amount,
  //         waste: row.waste,
  //        });
  //         break;
   // }

  
  //if row.name is already on the table, just increase the counter
  const index = dynamicInvoice.value.findIndex((item) => item.name === row.name);

  //every object in the dynamicInvoice array will contain all the row data plus the quantity and % of waste/performance
//   console.log('selected', selected.value.name);
//  if(selected.value.name === 'Material') {

//     console.log('1')
//     dynamicInvoice.value.push({
//       ...row,
//       quantity: 1,
//       waste: 0.1,
//       performance:null
//     });

//  } else {
//   console.log('2')
//     dynamicInvoice.value.push({
//       ...row,
//       quantity: 1,
//       performance: 0.1,
//       waste: null
//     });
//  }

 dynamicInvoice.value.push({
      ...row,
      quantity: 1,
      waste: 0.1,
      performance:null
    });
  

 

}

const saveApu = () => {
  //1. First save the apu to this endpoint
  //https://plengi-backend.up.railway.app/api/apus
  transformToApuBody();

  //apu.value.measurement = medidadSelected.value.shortName; TODO backend add all other types
  apu.value.measurement = "cm"

  try {
    axios.post(`${backendURL}/apus`, apu.value).then((response) => {
      console.log(response);
     saveApuBody(response.data?.data?.id);
    });
  } catch (error) {
    console.error('Error saving APU:', error)
  }

  //2. If the APU is saved successfully, take the id and save the apuBody to this endpoint
  //https://plengi-backend.up.railway.app/api/apus/{apuId}/resources
}

const saveApuBody = (apuId) => {
  console.log("apuId",apuId);
  console.log(apuBody.value);
  try {
    axios.post(`${backendURL}/apus/${apuId}/resources`, apuBody.value).then((response) => {
      console.log(response);
      //show success message if response is 201

      notify({
        type: "success",
        title: "Material guardado con exito!",
      });

      router.push("/apu");

    });
  } catch (error) {
    console.error('Error saving APU Body:', error)
  }
}

const transformToApuBody = () => {

  dynamicInvoice?.value?.forEach((item) => {
    switch(item.type) {
       case 'material':
         apuBody.value.materials.push({
          id: item.id,
          amount: item.quantity,
          waste: item.waste,
         });
         break;
        case 'team':
          apuBody.value.teams.push({
          id: item.id,
          amount: item.quantity,
          performance: item.waste,
         });
          break;
        case 'labour':
          apuBody.value.labours.push({
          id: item.id,
          amount: item.quantity,
          performance: item.waste,
         });
          break;
        default:
          apuBody.value.materials.push({
          id: item.id,
          amount: item.quantity,
          waste: item.waste,
         });
          break;
    }
  });
  
}

const removeDataToDynamicInvoice = (row) => {
  const index = dynamicInvoice.value.findIndex((item) => item.name === row.name);
  console.log(index);

  if (index > -1) {
    dynamicInvoice.value.splice(index, 1);
  }
}

const fetchMaterialsData = async () => {
  try {
    const response = await axios.get('https://plengi-backend.up.railway.app/api/materials');

    dynamicTable.value = response.data.data;
  } catch (error) {
    console.error('Error fetching materials:', error)
  }
}

const fetchRecurso = async () => {
  let URL = 'https://plengi-backend.up.railway.app/api/';
  console.log(selected);
   try {
    switch(selected.value.name) {
       case 'Material':
         URL+= 'materials';
         break;
        case 'Equipo':
          URL+= 'teams';
          break;
        case 'Mano de obra':
          URL+= 'labours';
          break;
        default:
          URL+= 'materials';
          break;
    }
    const response = await axios.get(URL, {
      params: {
        name: typedValue.value,
      }
    });
    dynamicTable.value = response.data.data;
  } catch (error) {
    console.error(`Error fetching data for ${selected}:`, error)
  }

}

const checkIfSelectedIsMaterial = () => {
  return selected.value.name === 'Material';
}



onMounted(async () => {
  if (getAPU) {
    await axios.get(`${backendURL}/apu/${getAPU}`).then((response) => {
      form.name = response.data.name;
      form.measurement.label = response.data.measurement;
      form.typeConstruction.label = response.data.type_construction;
      form.transport = parseFloat(response.data.transport);
    });
  }

  await fetchMaterialsData();

});

const title = computed(() => {
  return getAPU ? "Actualizar APU" : "Crear Nuevo APU";
});

async function save() {
  const data = {
    name: form.name,
    measurement: form.measurement.label,
    type_construction: form.typeConstruction.label,
    transport: parseFloat(form.transport),
  };

  if (getAPU) {
    // Update APU
    await axios
      .put(`${backendURL}/apu/${getAPU}`, data)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    // Create APU
    await axios
      .post(`${backendURL}/apu`, data)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  router.push("/apu");
}

const cancel = () => {
  router.push("/apu");
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" :title="title" main>
      </SectionTitleLineWithButton>

      <CardBox form @submit.prevent="submit">
        <h3 class="text-gray-800 font-bold text-xl">
          Analisis de precios unitario
        </h3>
        <br />
        <div class="mb-4">
          <div class="col-span-3 mb-4">
            <!-- Your content for the 30% width column -->
            <h4 class="text-black-700 font-medium">Informacion Basica</h4>
          </div>

          <div class="grid grid-cols-2 mb-4">
            <div class="col-span-1 mr-4">
              <FormField>
                <div>
                  <label
                    for="email"
                    class="block text-sm font-medium leading-6 text-gray-900"
                    >Nombre *</label
                  >
                  <div class="mt-2">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      v-model="apu.name"
                      class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Ej: Piso porcelanato gris..."
                    />
                  </div>
                </div>
              </FormField>
            </div>

            <div class="col-span-1 mr-4 mt-2">
              <FormField>
                <Listbox as="div" v-model="medidadSelected">
                  <ListboxLabel
                    class="block text-sm font-medium leading-4 text-gray-600"
                    >Medida *</ListboxLabel
                  >
                  <div class="relative mt-2">
                    <ListboxButton
                      class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      <span class="block truncate">{{ medidadSelected.name }}</span>
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
                          v-for="medida in medidas"
                          :key="medida.id"
                          :value="medida"
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
                              >{{ medida.name }}</span
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

        </div>

        <div class="grid grid-cols-3 mr-4 pt-4">
          <div class="col-span-1">
            <!-- Your content for the 30% width column -->
            <h4 class="text-black-700 font-medium">Detalles</h4>
          </div>
          <div class="col-span-2">
            <!-- Your content for the 70% width column -->
            <FormField>
              <Listbox as="div" v-model="selected">
                <ListboxLabel
                  class="block text-sm font-medium leading-4 text-gray-600"
                  >1. Seleccione el tipo de recurso</ListboxLabel
                >
                <div class="relative mt-2">
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
                        v-for="recurso in recursos"
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

        <div class="grid grid-cols-3 mr-4">
          <div class="col-span-1">
            <!-- Your content for the 30% width column -->
            <h4 class="text-black-700 font-medium"></h4>
            <br />
          </div>
          <div class="col-span-2 mt-4">
            <!-- Your content for the 70% width column -->
            <FormField>
              <div>
                <label
                  for="email"
                  class="block text-sm font-medium leading-4 text-gray-600"
                  >2. Ingresa el nombre del recurso</label
                >
                <div class="mt-2 flex rounded-md shadow-sm">
                  <div
                    class="relative flex flex-grow items-stretch focus-within:z-10"
                  >
                    <div
                      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="h-5 w-5 text-gray-400"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M11.622 1.602a.75.75 0 01.756 0l2.25 1.313a.75.75 0 01-.756 1.295L12 3.118 10.128 4.21a.75.75 0 11-.756-1.295l2.25-1.313zM5.898 5.81a.75.75 0 01-.27 1.025l-1.14.665 1.14.665a.75.75 0 11-.756 1.295L3.75 8.806v.944a.75.75 0 01-1.5 0V7.5a.75.75 0 01.372-.648l2.25-1.312a.75.75 0 011.026.27zm12.204 0a.75.75 0 011.026-.27l2.25 1.312a.75.75 0 01.372.648v2.25a.75.75 0 01-1.5 0v-.944l-1.122.654a.75.75 0 11-.756-1.295l1.14-.665-1.14-.665a.75.75 0 01-.27-1.025zm-9 5.25a.75.75 0 011.026-.27L12 11.882l1.872-1.092a.75.75 0 11.756 1.295l-1.878 1.096V15a.75.75 0 01-1.5 0v-1.82l-1.878-1.095a.75.75 0 01-.27-1.025zM3 13.5a.75.75 0 01.75.75v1.82l1.878 1.095a.75.75 0 11-.756 1.295l-2.25-1.312a.75.75 0 01-.372-.648v-2.25A.75.75 0 013 13.5zm18 0a.75.75 0 01.75.75v2.25a.75.75 0 01-.372.648l-2.25 1.312a.75.75 0 11-.756-1.295l1.878-1.096V14.25a.75.75 0 01.75-.75zm-9 5.25a.75.75 0 01.75.75v.944l1.122-.654a.75.75 0 11.756 1.295l-2.25 1.313a.75.75 0 01-.756 0l-2.25-1.313a.75.75 0 11.756-1.295l1.122.654V19.5a.75.75 0 01.75-.75z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      v-model="typedValue"
                      id="email"
                      class="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="ej: porcelanato"
                    />
                  </div>
                  <button
                    @click="fetchRecurso()"
                    type="button"
                    class="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="w-4 h-4 text-gray-400"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </FormField>
          </div>
        </div>

        <div v-if="dynamicTable && dynamicTable.length < 1" class="mt-10 bg-gray-300 p-5 rounded-md">
          No se han encontrado resultados de la busqueda.
        </div>
        <br>

        <div v-for="dynamicRow in dynamicTable" class="grid grid-cols-12 gap-  border p-2">
          <!-- First Column (Icon Image) -->
          <div class="col-span-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-6 h-6 text-gray-600 ml-4 mt-1"
            >
              <path
                fill-rule="evenodd"
                d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 005.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 00-2.122-.879H5.25zM6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z"
                clip-rule="evenodd"
              />
            </svg>
          </div>

          <!-- Second Column (Product Name) -->
          <div class="col-span-6 mt-1">
            <p class="text-medium">{{dynamicRow.name}}</p>
          </div>

          <!-- Third Column (Product Price) -->
          <div class="col-span-2">
            <p class="text-medium mt-1 ml-6">${{ dynamicRow.unitValue }}</p>
          </div>

          <!-- Fourth Column (Add Button) -->
          <div class="col-span-2 flex items-center justify-center">
            <button
              type="button"
              @click="pushDataToDynamicInvoice(dynamicRow)"
              class="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-400 px-2.5 py-1.5 text-sm text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusIcon class="-ml-0.5 h-5 w-5" aria-hidden="true" />
              Agregar
            </button>
          </div>
        </div>


        <div class="grid grid-cols-9 mt-12">
          <!-- First Column -->
          <div class="px-8 py-2 text-sm">Tipo</div>

          <!-- Second Column -->
          <div class="px-8 py-2 text-sm">Item</div>

          <!-- Third Column -->
          <div class="px-6 py-2 text-sm">Cantidad</div>

          <!-- Fourth Column -->
          <div class="px-10 py-2 text-sm">Unidad</div>

          <div class="px-8 py-2 text-sm">Desperdicio/ Rendimiento</div>


          <!-- Sixth Column -->
          <div class="py-2 text-sm">Costo Item</div>

          <!-- Seventh Column -->
          <div class="px-0 py-2 text-sm">Costo Total</div>

          <!-- Eighth Column -->
          <div class="py-2"></div>
        </div>

         <div v-for="invoice in dynamicInvoice" class="grid grid-cols-9   border-y  mt-">
            <!-- First Column -->
            <div class="px-4 py-3 text-sm w-1/2 ">
              <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-6 h-6 text-gray-600 ml-4 mt-1"
            >
              <path
                fill-rule="evenodd"
                d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 005.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 00-2.122-.879H5.25zM6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z"
                clip-rule="evenodd"
              />
            </svg>
            </div>

            <!-- Second Column -->
            <div class="px-1 py-3 text-xs  w-1/2">{{invoice.name}}</div>

            <!-- Third Column -->
            <div class="px-2 py-2 ml-4 py-1 text-xs  ">
              <div>
                <label for="email" class="sr-only">Email</label>
                <input type="number" name="email" id="email" v-model="invoice.quantity" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="" v-on:change="updateInvoiceModel" />
              </div>
            </div>

            <!-- Fourth Column -->
            <div class="py-4 ml-10 text-xs w-1/2 px-4">
              {{invoice.unitMeasurement}}
            </div>

            <!-- Sixth Column -->
            <div class="px-2 py-2 ml-4 py-1 text-xs  ">
              <div>
                <label for="email" class="sr-only">Waste</label>
                <input  type="number" name="email" id="email" v-model=" invoice.waste" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="" />

        
                
              </div>
            </div>

            <!-- Seventh Column -->
            <div class="py-4 text-xs  ml-4 w-1/2">${{invoice.unitValue}}</div>

            <!-- Eighth Column -->
            <div class="py-4 text-xs  w-1/2">${{((invoice.unitValue + (invoice.waste || 0))*(invoice.quantity || 1)).toFixed(2)}}</div>

            
            <!-- Nineth Column -->
            <div class=" py-3 flex items-center justify-center">
              <div class="flex align-middle">
                <button
                  type="button"
                  @click="removeDataToDynamicInvoice(invoice)"
                  class=" inline-flex items-center gap-x-1.5  rounded-md bg-red-400 px-2.5 py-1.5 text-xs text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                >
                  <MinusIcon class="-ml-0.5 h-5 w-5" aria-hidden="true" />
                  Quitar
                </button>
              </div>
            </div>


          </div>

        

        <template #footer>
          <button
            type="button"
            class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mr-4"
            @click="saveApu()"
          >
            Guardar
          </button>

          <button
            type="button"
            class="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Cancelar
          </button>
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
