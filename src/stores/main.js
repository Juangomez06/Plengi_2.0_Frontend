import { defineStore } from "pinia";
import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL;

export const useMainStore = defineStore("main", {
  state: () => ({
    /* User */
    userName: null,
    userEmail: null,
    userAvatar: null,

    /* Field focus with ctrl+k (to register only once) */
    isFieldFocusRegistered: false,

    /* Sample data (commonly used) */
    clients: [],
    history: [],

    materialModalCreateisOpen : false,
    laboursModalCreateisOpen : false,
    teamsModalCreateisOpen : false,
    materials: [],
    labours: [],
    teams: [],
  }),
  actions: {
    setUser(payload) {
      if (payload.name) {
        this.userName = payload.name;
      }
      if (payload.email) {
        this.userEmail = payload.email;
      }
      if (payload.avatar) {
        this.userAvatar = payload.avatar;
      }
    },
    setMaterialModalCreateisOpen(value) {
      this.materialModalCreateisOpen = value;
    },

    setLaboursModalCreateisOpen(value) {
      this.laboursModalCreateisOpen = value;
    },

    setTeamsModalCreateisOpen(value) {
      this.teamsModalCreateisOpen = value;
    },

    async loadMaterials() {
      try {
        const response = await axios.get(`${backendURL}/materials?take=100`);
        this.materials = response.data;
      } catch (error) {
        alert(error.message);
      }
    },

    async loadLabours() {
      try {
        const response = await axios.get(`${backendURL}/labours?take=100`);
        this.labours = response.data;
      } catch (error) {
        alert(error.message);
      }
    },

    async loadTeams() {
      try {
        const response = await axios.get(`${backendURL}/teams?take=100`);
        this.teams = response.data;
      } catch (error) {
        alert(error.message);
      }
    },

    fetch(sampleDataKey) {
      axios
        .get(`data-sources/${sampleDataKey}.json`)
        .then((r) => {
          if (r.data && r.data.data) {
            this[sampleDataKey] = r.data.data;
          }
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  },
});
