<template>
  <table class="table table-condensed table-responsive">
    <thead>
      <tr>
        <th scope="col">Collection</th>
        <th scope="col">Type</th>
        <th scope="col">Materials</th>
        <th scope="col">#Donors</th>
        <th scope="col">Order Mag. Donors</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(collection, index) in topLevelElements">
        <tr :key="index">
          <td
            :class="{'table-text-content-columns-has-sub': hasSubCollections(collection), 'table-text-content-columns': !hasSubCollections(collection)}"
            v-for="(column, index) in columns"
            :key="index"
          >
            <span v-if="column === 'name'">
              <router-link :to="'/collection/' + collection['id']">
                <button class="btn btn-link collection-link text-left pt-0 border-0">{{collection[column]}}</button>
              </router-link>
            </span>
            <span v-else-if="column === 'quality'">
              <quality-column :qualities="collection[column]" :spacing="0"></quality-column>
            </span>

            <span v-else-if="column === 'type'">{{ getCollectionType(collection) }}</span>
            <span v-else-if="column === 'materials'">{{ getCollectionMaterials(collection) }}</span>
            <span v-else-if="column === 'number_of_donors'">{{ getCollectionNumberDonors(collection) }}</span>
            <span v-else-if="column === 'order_mag_donors'">{{ getCollectionOrderMagDonors(collection) }}</span>
          </td>
        </tr>
        <tr v-if="hasSubCollections(collection)" :key="collection.id">
          <td colspan="5" class="sub-table-cell">
            <b-link v-b-toggle="'collapse-'+collection.id" class="text-muted">
              <span class="when-hidden">
                Show {{collection.sub_collections.length}} subcollections
                <i class="fa fa-caret-down"></i>
              </span>
              <span class="when-visible">
                Hide subcollections
                <i class="fa fa-caret-up"></i>
              </span>
            </b-link>
            <b-collapse :id="'collapse-'+collection.id">
              <sub-collections-table :subCollections="collection.sub_collections"></sub-collections-table>
            </b-collapse>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script>
import utils from '../../utils'
import SubCollectionsTable from './SubCollectionsTable'
import QualityColumn from './QualityColumn'

export default {
  name: 'CollectionsTable',
  props: {
    collections: {
      type: Array,
      required: true
    },
    isSubCollectionsTableVisible: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    topLevelElements () {
      return this.collections.filter(
        collection => !collection.parent_collection
      )
    }
  },
  data () {
    return {
      columns: ['name', 'type', 'materials', 'number_of_donors', 'order_mag_donors'],
      quality_logo: { height: 4, width: 9 }
    }
  },
  methods: {
    getCollectionMaterials (collection) {
      return utils
        .getUniqueIdArray(collection.materials.map(material => material.label))
        .join(', ')
    },
    getCollectionType (collection) {
      return utils
        .getUniqueIdArray(collection.type.map(type => type.label))
        .join(', ')
    },
    hasSubCollections (collection) {
      return (
        collection &&
        collection.sub_collections &&
        collection.sub_collections.length > 0
      )
    },
    getCollectionSize (collection) {
      return collection.size || collection.order_of_magnitude.size
    },
    getCollectionNumberDonors (collection) {
      return collection.number_of_donors
    },
    getCollectionRessourceTypes (collection) {
      return collection.ressource_types.label
    },
    getCollectionOrderMagDonors (collection) {
      return collection.order_of_magnitude_donors.size
    }
  },
  components: {
    SubCollectionsTable,
    QualityColumn
  }
}
</script>

<style>
  .collapsed > .when-visible {
    display: none;
  }
  :not(.collapsed) > .when-hidden {
    display: none;
  }

  .table-text-content-columns {
    font-size: 13px;
    font-weight: bold;
  }

  .table-text-content-columns-has-sub {
    font-size: 13px;
    font-weight: bold;
    border-style: hidden;
    border-width: 0px;
  }

  .sub-table-cell {
    padding-top: 0px;
  }

  .collection-link{
    white-space: normal !important;
    line-height: normal;
  }
</style>
