<template>
  <div class="card external-resource-card">
    <div class="card-header external-resource-card-header" @click.prevent="collapsed = !collapsed">
      <div class="row">
        <div class="col-md-5">
          <h5>
            <!-- <router-link :to="'/biobank/' + externalResource.id">
              <i class="fa fa-table" aria-hidden="true" aria-labelledby="externalResource-name"></i>
            </router-link> -->
            <span><b>Catalog: </b></span>
            <span id="biobank-name">{{ externalResource.name }}</span>
          </h5>
        </div>
        <div class="col-md-7">
          <p>
              <b>URL:</b>
            {{ externalResource.url }}
          </p>
        </div>
        <!-- <div v-else class="col-md-12 text-center">
          <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>
        </div> -->
      </div>
    </div>
    <div class="card-body table-card" v-if="!collapsed">
      <external-resource-table v-if="externalResource.resources.length > 0" :resources="externalResource.resources"></external-resource-table>
    </div>
  </div>
</template>

<style>
.table-card {
  padding: 0.1rem;
}

.external-resource-card {
  margin-bottom: 1em;
}

.external-resource-card-header {
  background-color: #f5f5f5;
}

.external-resource-card-header:hover {
  cursor: pointer;
  background-color: #e4e4e4;
}
.biobank-icon:hover {
  cursor: pointer;
}

.covid-icon {
  height: 1.5rem;
  width: auto;
}
</style>

<script>
import 'array-flat-polyfill'
import ExternalResourceTable from '../tables/ExternalResourceTable'

export default {
  name: 'external-resource-card',
  props: {
    externalResource: {
      type: [Object, String]
    },
    initCollapsed: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data () {
    return {
      collapsed: this.initCollapsed
    }
  },
  components: {
    ExternalResourceTable
  },
  mounted () {
  }
}
</script>
