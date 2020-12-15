<template>
  <div class=external-catalog-card>
    <div
      class="card-header external-catalog-card-header"
      @click.prevent="visible = !visible"
    >
      <h5>
        <font-awesome-icon
          icon="caret-right"
          :style="iconStyle"
          class="mr-2 text-white"
        />
        <b><span class="text-white" id="catalog-name">{{ externalCatalog.label || catalogData.name }}</span></b>
      </h5>
    </div>
    <b-collapse
      v-if="dataLoaded"
      id="collapse-4"
      v-model="visible"
      class="mt-2">
        <b-pagination
          size="md"
          align="center"
          v-model="currentPage"
          v-on:input="changePage"
          :total-rows="catalogData.page.totalElements"
          :per-page="catalogData.page.size"
        ></b-pagination>
        <external-resource-card
          v-for="(resource, name) in catalogData.resources"
          :key="name"
          :resource="resource"
        ></external-resource-card>
    </b-collapse>
    <div v-else class="status-text">
      <h4>
        Loading data...
        <i class="fa fa-spinner fa-pulse" aria-hidden="true"></i>
      </h4>
    </div>
  </div>
</template>

<style>
.table-card {
  padding: 0.1rem;
}

.external-catalog-card {
  margin-bottom: 2em;
}

.external-catalog-card-header {
  background-color: #004275
}

.external-catalog-card-header:hover {
  cursor: pointer;
  background-color: #004275;
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
import ExternalResourceCard from './ExternalResourceCard'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'external-catalog-card',
  props: {
    externalCatalog: {
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
      visible: !this.initCollapsed,
      currentPage: 1
    }
  },
  computed: {
    ...mapGetters([
      'externalResources'
    ]),
    iconStyle () {
      return {
        transform: `rotate(${this.visible ? 90 : 0}deg)`,
        transition: 'transform 0.2s'
      }
    },
    catalogData () {
      if (this.externalResources) {
        return this.externalResources[this.externalCatalog.id] || []
      } else {
        return {}
      }
    },
    dataLoaded () {
      return Object.keys(this.catalogData).length > 0
    }
  },
  methods: {
    ...mapActions(['GetExternalCatalogsResources']),
    changePage (page) {
      this.GetExternalCatalogsResources({ catalog: this.externalCatalog.id, skip: page - 1 })
    }
  },
  components: {
    ExternalResourceCard
  }
}
</script>
