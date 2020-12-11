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
        <b><span class="text-white" id="catalog-name">{{ externalCatalog.name }}</span></b>
      </h5>
    </div>
    <b-collapse id="collapse-4" v-model="visible" class="mt-2">
      <external-resource-card
        v-for="(resource, name) in externalCatalog.resources"
        :key="name"
        :resource="resource"
      >
      </external-resource-card>
    </b-collapse>
  </div>
  <!-- <div class="card external-resource-card">
    <div
      class="card-header external-resource-card-header"
      @click.prevent="collapsed = !collapsed"
    >
      <div class="row">
        <div class="col-md-5">
          <h5>
            <span><b>Catalog: </b></span>
            <span id="catalog-name">{{ externalCatalog.name }}</span>
          </h5>
        </div>
        <div class="col-md-7">
          <p>
            <b>Homepage:</b>
            {{ externalCatalog.url }}
          </p>
        </div>
      </div>
    </div>
    <div class="card-body table-card" v-if="!collapsed">
      <external-resource-card
        v-for="(resource, name) in externalCatalog.resources"
        :key="name"
        :resource="resource"
      >
      </external-resource-card>
    </div>
  </div> -->
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
      visible: !this.initCollapsed
    }
  },
  computed: {
    iconStyle () {
      return {
        transform: `rotate(${this.visible ? 90 : 0}deg)`,
        transition: 'transform 0.2s'
      }
    }
  },
  components: {
    ExternalResourceCard
  }
}
</script>
