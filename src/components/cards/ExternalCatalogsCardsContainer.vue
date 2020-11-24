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
      <external-resource-card
        v-for="(resource, name) in externalCatalogsResources"
        :key="name"
        :externalResource="resource">
      </external-resource-card>
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
        If you want to query external resources you should check at least one external sources and a diagnosis available in the menu
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
import ExternalResourceCard from './ExternalResourceCard'
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
      console.log(this.externalCatalogsResources)
      // console.log('external_sources' in this.externalCatalogsResourcesFilters &&
      //   'diagnosis_available' in this.externalCatalogsResourcesFilters &&
      //   this.externalCatalogsResourcesFilters.external_sources.length > 0 &&
      //   this.externalCatalogsResourcesFilters.diagnosis_available.length > 0)
      return 'external_sources' in this.externalCatalogsResourcesFilters &&
        'diagnosis_available' in this.externalCatalogsResourcesFilters &&
        this.externalCatalogsResourcesFilters.external_sources.length > 0 &&
        this.externalCatalogsResourcesFilters.diagnosis_available.length > 0
    }
  },
  components: {
    ExternalResourceCard
  },
  mounted () {

  }
}
</script>
