<template>
  <LayoutAuthenticated>
  <SectionMain>
    <div class="flex justify-center">
      <div class="w-3/6 rounded overflow-hidden p-5">
        

        <button class="btn bg-indigo-500 text-white hover:bg-indigo-700 ml-1 mb-4" @click="createNewActivity">Crear nueva</button>

        <button class="btn bg-gray-200 text-gray-700 hover:bg-gray-700 hover:text-white ml-1 mb-4" @click="sort">Resetear orden</button>
        <draggable
          class="list-group"
          tag="ul"
          :list="list"
          v-bind="dragOptions"
          @start="isDragging = true"
          @end="isDragging = false"
        >
          <transition-group type="transition" name="flip-list">
            <li
              class="list-group-item p-3 bg-gray-200 m-1 rounded-md mb-2"
              v-for="element in list"
              :key="element.order"
            >
              <i
                :class="
                  element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
                "
                @click="element.fixed = !element.fixed"
                aria-hidden="true"
              ></i>
              {{ element.name }}
            </li>
          </transition-group>
        </draggable>
      </div>
    </div>
  </SectionMain>
</LayoutAuthenticated>
</template>

<script>
  import { VueDraggableNext } from 'vue-draggable-next'
import rawDisplayer from '../components/rawDisplay.vue'
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/SectionMain.vue";
const message = [
  'Actividad 1',
  'Actividad 2',
  'Actividad 3',
  'Actividad 4',
  'Actividad 5',
  'Actividad 6',
  'Actividad 7',
  'Actividad 8',
]
export default {
  name: 'transition-example',
  display: 'Transition',
  order: 6,
  components: {
    draggable: VueDraggableNext,
    LayoutAuthenticated,
    SectionMain,
    rawDisplayer,
  },
  data() {
    return {
      list: message.map((name, index) => {
        return { name, order: index + 1 }
      }),
    }
  },
  mounted() {
    console.log(this.list)
  },
  methods: {
    sort() {
      this.list = this.list.sort((a, b) => a.order - b.order)
    },

    createNewActivity() {
      this.list.push({
        name: 'Actividad ' + (this.list.length + 1),
        order: this.list.length + 1,
      })
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 10,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      }
    },
  },
}
</script>

<style>
.button {
  margin-top: 35px;
}
.flip-list-move {
  transition: transform 1s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}

.btn {
  @apply font-bold py-2 px-4 rounded;
}
.btn-blue {
  @apply bg-blue-500 text-white;
}
.btn-blue:hover {
  @apply bg-blue-700;
}
</style>