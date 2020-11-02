import { expect } from 'chai'
import FilterContainer from '@/components/filters/FilterContainer'
import Vuex from 'vuex'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import { mockState } from '../../mockState'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('FilterContainer', () => {
  let wrapper
  let store

  describe('filters', () => {
    it('should include the country filters if showCountryFacet is set to true', () => {
      store = new Vuex.Store({
        state: mockState,
        actions: {
          __GET_COUNTRY_OPTIONS__: () => '',
          __GET_MATERIALS_OPTIONS__: () => '',
          __GET_COLLECTION_QUALITY_OPTIONS__: () => '',
          __GET_BIOBANK_QUALITY_OPTIONS__: () => '',
          __GET_TYPES_OPTIONS__: () => '',
          __GET_DATA_TYPE_OPTIONS__: () => '',
          __GET_COVID_19_OPTIONS__: () => '',
          __GET_BIOBANK_NETWORK_OPTIONS__: () => '',
          __GET_BIOBANK_QUALITY_BIOBANKS__: () => ''
        },
        mutations: {},
        getters: {
          getMaterialOptions: () => [],
          getCountryOptions: () => [],
          getBiobankQualityOptions: () => [],
          getCollectionQualityOptions: () => [],
          getTypesOptions: () => [],
          getDataTypeOptions: () => [],
          showCountryFacet: () => true,
          getCovid19Options: () => [],
          getCollectionNetworkOptions: () => [],
          getCovid19NetworkOptions: () => [],
          getBiobankNetworkOptions: () => []
        }
      })
      wrapper = shallowMount(FilterContainer, { store, localVue })
      expect(wrapper.vm.filters.find((filter) => filter.name === 'country').name).eq('country')
    })

    it('should exclude the country filters if showCountryFacet is set to false', () => {
      store = new Vuex.Store({
        state: mockState,
        actions: {
          __GET_COUNTRY_OPTIONS__: () => '',
          __GET_MATERIALS_OPTIONS__: () => '',
          __GET_COLLECTION_QUALITY_OPTIONS__: () => '',
          __GET_BIOBANK_QUALITY_OPTIONS__: () => '',
          __GET_TYPES_OPTIONS__: () => '',
          __GET_DATA_TYPE_OPTIONS__: () => '',
          __GET_COVID_19_OPTIONS__: () => '',
          __GET_BIOBANK_NETWORK_OPTIONS__: () => '',
          __GET_BIOBANK_QUALITY_BIOBANKS__: () => ''
        },
        mutations: {},
        getters: {
          getMaterialOptions: () => [],
          getCountryOptions: () => [],
          getBiobankQualityOptions: () => [],
          getCollectionQualityOptions: () => [],
          getTypesOptions: () => [],
          getDataTypeOptions: () => [],
          showCountryFacet: () => false,
          getCovid19Options: () => [],
          getCollectionNetworkOptions: () => [],
          getCovid19NetworkOptions: () => [],
          getBiobankNetworkOptions: () => []
        }
      })
      wrapper = shallowMount(FilterContainer, { store, localVue })
      expect(wrapper.vm.filters.find((filter) => filter.name === 'country')).eq(undefined)
    })
  })
})
