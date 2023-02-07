<template>
  <div id="app">
    <div class="container">
      <!--UPLOAD-->
      <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
        <h1>Upload images</h1>
        <div class="dropbox">
          <input type="file" multiple :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files);"
                 accept="image/*" class="input-file">
          <p v-if="isInitial">
            Drag your file(s) here to begin<br> or click to browse
          </p>
          <p v-if="isSaving">
            Uploading {{ fileCount }} files...
          </p>
        </div>
      </form>

      <div v-if="data" class="pie">
        <div>
          <img v-if="url" :src="url" style="max-width:700px;max-height:800px;"/>
        </div>
        <Pie :data="data" :options="options"/>
      </div>
    </div>
  </div>
</template>

<script>
import {upload} from "@/file-upload.service";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)


const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;

export default {
  name: 'app',
  components:{
    Pie
  },
  data() {
    return {
      url: null,
      image: null,
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: 'photos',
      fileCount: 0,
      probabilities: null,
      viewClasses: {'0': 'Гнев', '1': 'Отвращение', '2': 'Печаль', '3': 'Презрение', '4': 'Радость', '5': 'Страх', '6': 'Удивление'},
      data: null,
      options:{
        plugins: {
          tooltip: {
            callbacks: {
              label: function (item) {
                return item.label + ' ' + item.formattedValue + ' %';
              }
            }
          }
        }
      }

    }
  },
  computed: {
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED;
    }
  },
  methods: {
    reset() {
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL;
      this.uploadedFiles = [];
      this.uploadError = null;
    },
    save(formData) {
      // upload data to the server
      this.currentStatus = STATUS_SAVING;

      upload(formData)
          .then(x => {
            this.probabilities = {}
            Object.entries(x).forEach(([key, value]) => {
              this.probabilities[this.viewClasses[key]] = parseFloat(value) * 100;
            })
          }).then(() => {

            const labels = Object.keys(this.probabilities);
            const dataset = [{data: [], backgroundColor: ['#fc0303', '#fc8403', '#03065c', '#4ed40b', '#0bd49e', '#7658b8', '#b058b8'],}];
            labels.forEach(label => {
              const value = this.probabilities[label]
              dataset[0].data.push(value)
            });
            this.data = {
              labels: labels,
              datasets: dataset
            }
          })
          .then(() => {
            this.url = URL.createObjectURL(this.image);
            this.currentStatus = STATUS_INITIAL
          })
          .catch(err => {
            this.uploadError = err.response;
            this.currentStatus = STATUS_FAILED;
          });
    },
    filesChange(fieldName, fileList) {
      // handle file changes
      const formData = new FormData();
      if (!fileList.length) return;
      this.image = fileList[0];
      formData.append('img', fileList[0], fileList[0].name)
      this.fileCount = fileList.length;
      this.save(formData);
    }
  },
  mounted() {
    this.reset();
  },
}
</script>

<style>
.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: lightcyan;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: lightblue; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}

.pie{
  max-height: 700px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>