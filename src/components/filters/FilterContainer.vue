<template>
  <div id="filter-container" v-if="!loading">

    <!-- <FilterCard name="search" label="Search" description="Search by name, id, acronym" :collapsed="!this.$store.state.route.query.search">
      <StringFilter name="Search" v-model="search"></StringFilter>
    </FilterCard> -->

    <FilterCard name="search" label="Search - Adaption" description="Adapted Search" :collapsed="false" :collapsable="false" :canRemove="true" >
      <StringFilter name="Search" v-model="search" placeholder="Input - adaption"></StringFilter>
    </FilterCard>

    <!-- <FilterCard
  name="fruit-card"
  label="Fruit"
  headerClass="bg-info text-white"
  description="Example with checkbox filter"
  v-bind:collapsed="false"
  v-bind:collapsable="false"
  v-bind:canRemove="true">
  <CheckboxFilter
    v-bind:maxVisibleOptions="null"
    v-bind:bulkOperation="true"
    v-bind:options="options"
    v-model="model">
  </CheckboxFilter>
</FilterCard> -->

    <FilterCard
      v-for="filter in filters"
      :key="filter.name"
      :name="filter.name"
      :label="filter.label"
      :headerClass="filter.headerClass"
      :collapsed="filter.initiallyCollapsed"
      :collapsable="filter.collapsable"
    >
      <component
        v-if="bookmarkMappedToState"
        :is="filter.component"
        :value="activeFilters[filter.name]"
        v-bind="filter"
        @input="(value) => filterChange(filter.name, value)"
        :returnTypeAsObject="true"
        :bulkOperation="true"
      />
    </FilterCard>
  </div>
</template>

<script>
/** Components used for filters */
// import { options, model } from './filterOptions'
import CovidFilter from '../filters/CovidFilter'
import CovidNetworkFilter from '../filters/CovidNetworkFilter'
import state from '../../store/state'
// import FilterCard from '../filters/FilterCard_test1'
// import CheckboxFilter from '../filters/CheckboxFilter_test1'
import { StringFilter, MultiFilter, NumberFilter, RangeFilter, DateTimeFilter, CheckboxFilter, FilterCard } from '@molgenis-ui/components-library'
/** */

import { mapGetters, mapMutations } from 'vuex'

export default {
  components: { StringFilter, CheckboxFilter, MultiFilter, FilterCard, CovidFilter, CovidNetworkFilter, NumberFilter, RangeFilter, DateTimeFilter },
  data () {
    return {
      debounce: undefined
    }
  },
  computed: {
    ...mapGetters(['showCountryFacet', 'activeFilters', 'filterDefinitions', 'bookmarkMappedToState', 'foundBiobanks', 'loading', 'filterObjects', 'biobanks']),
    search: {
      get () {
        return this.activeFilters.search
      },
      set (search) {
        if (this.debounce) {
          clearTimeout(this.debounce)
        }

        this.debounce = setTimeout(async () => {
          clearTimeout(this.debounce)
          this.UpdateFilter({ name: 'search', value: search, router: this.$router }) // passing router so we can set bookmark
        }, 500)
      }
    },
    filters () {
      console.log('Filters: ')
      if (this.filterObjects.length === 0) {
        console.log('Filter set zero')
        // state.filterObjects = this.filterDefinitions
        console.log(this.filterDefinitions)

        console.log('--')
        this.SetFilterObjects(state)
      }
      console.log('filterobject:')
      // const filter = this.filterObjects
      // console.log(filter)
      console.log('---')
      console.log(this.filterObjects)
      console.log(this.filterDefinitions)
      return state.filterObjects.filter((facet) => {
        // config option showCountryFacet is used to toggle Country facet
        console.log(facet.name)
        return !(this.showCountryFacet === false && facet.name === 'country')
      }).filter((item) => item.component)
    }
  },
  methods: {
    ...mapMutations(['UpdateFilter', 'SetFilterObjects', 'UpdateCountry']),
    filterChange (name, value) {
      console.log('hier')
      console.log(name, value)
      if (name === 'country') {
        console.log('CountryFilter')
        console.log(name, value)
        this.UpdateCountry({ name, value })
      } else {
        this.UpdateFilter({ name, value, router: this.$router })
      }
    }
  }
}

// export const onRemoveFilter = () => console.log('hhhhhh')

// export const options = () => Promise.resolve(
//   [
//     { text: 'Orange', value: 'orange' },
//     { text: 'Apple', value: 'apple' },
//     { text: 'Pineapple', value: 'pineapple' },
//     { text: 'Grape', value: 'grape' }
//   ]
// )

// export const model = []

// export const selections = {
//   search: 'test',
//   name: 'John',
//   age: [32, 45],
//   fruit: ['orange', 'apple'],
//   color: ['red', 'green'],
//   datetime: [new Date('10/01/1980'), new Date('03/12/2020')]
// }

</script>
