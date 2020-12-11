<template>
  <div class="external-resource-cards-container">
    <div v-if="isAnyFilterActive">
    <!-- <div v-if="!loading && foundBiobanks > 0"> -->
      <!-- <b-pagination
        v-if="foundBiobanks > pageSize"
        size="md"
        align="center"
        :total-rows="foundBiobanks"
        v-model="currentPage"
        :per-page="pageSize"
      ></b-pagination> -->
      <external-catalog-card
        v-for="catalog in externalCatalogsResources"
        :key="catalog.name"
        :externalCatalog="catalog">
      </external-catalog-card>
      <!-- <biobank-card
        v-for="biobank in biobanksShown"
        :key="biobank.id || biobank"
        :biobank="biobank"
        :initCollapsed="!isAnyFilterActive">
      </biobank-card> -->

      <!-- <b-pagination
        v-if="foundBiobanks > pageSize"
        size="md"
        align="center"
        :total-rows="foundBiobanks"
        v-model="currentPage"
        :per-page="pageSize"
      ></b-pagination> -->
    <!-- </div> -->

    <!-- <div v-else-if="!loading && foundBiobanks === 0" class="status-text">
      <h4>No biobanks were found</h4>
    </div>

    <div v-else class="status-text">
      <h4>
        Loading Biobanks...
        <i class="fa fa-spinner fa-pulse" aria-hidden="true"></i>
      </h4>
    </div> -->
    </div>
    <div v-else class="status-text">
      <span>
        Select the external catalogs in the menù and search for a specific disease to query external catalogs
      </span>
    </div>
  </div>
</template>

<style>
.status-text {
  text-align: center;
  justify-content: center;
  padding: 1rem;
}

.external-resource-cards-container {
  width: 100%;
}
</style>

<script>
import ExternalCatalogCard from './ExternalCatalogCard'
import { mapGetters } from 'vuex'

export default {
  name: 'external-catalogs-cards-container',
  data () {
    return {}
  },
  computed: {
    ...mapGetters([
      'externalCatalogsResourcesFilters',
      'externalCatalogsResources'
    ]),
    isAnyFilterActive () {
      return 'externalSources' in this.externalCatalogsResourcesFilters &&
        'diagnosisAvailable' in this.externalCatalogsResourcesFilters &&
        this.externalCatalogsResourcesFilters.externalSources.length > 0 &&
        this.externalCatalogsResourcesFilters.diagnosisAvailable.length > 0
    }
  },
  components: {
    ExternalCatalogCard
  },
  mounted () {
  }
}
</script>
