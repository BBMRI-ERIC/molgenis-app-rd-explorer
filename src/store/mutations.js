import Vue from 'vue'
import { createBookmark } from '../utils/bookmarkMapper'
import { fixCollectionTree } from './helpers'
import filterDefinitions from '../utils/filterDefinitions'
// import api from '@molgenis/molgenis-api-client'

const negotiatorConfigIds = ['directory', 'bbmri-eric-model']

export default {
  SetCovidNetworkFilter (state, { name, value, router }) {
    if (state.filters.selections[name]) {
      Vue.set(state.filters.selections, name, [...new Set([...state.filters.selections[name], value.value])])
      Vue.set(state.filters.labels, name, [...new Set([...state.filters.labels[name], value.text])])
    } else {
      Vue.set(state.filters.selections, name, [value.value])
      Vue.set(state.filters.labels, name, [value.text])
    }
    createBookmark(router, state.filters.selections, state.selectedCollections)
  },
  UnsetCovidNetworkFilter (state, { name, value, router }) {
    if (state.filters.selections[name]) {
      Vue.set(state.filters.selections, name, [...state.filters.selections[name].filter(item => item !== value.value)])
      Vue.set(state.filters.labels, name, [...state.filters.labels[name].filter(item => item !== value.text)])
    }
    createBookmark(router, state.filters.selections, state.selectedCollections)
  },
  /**
   * Register the filters for country, materials, standards, and diagnosis_available in the state
   * so they can be used for 1) the URL and 2) retrieving biobanks based on IDs
   *
   * @param state
   * @param name name of the state entry e.g. country, materials, standards, or diagnosis_available
   * @param filters an array of values
   */
  UpdateFilter (state, { name, value, router }) {
    if (name === 'search') {
      Vue.set(state.filters.selections, name, value)
      createBookmark(router, state.filters.selections, state.selectedCollections)
      return
    }
    console.log(state.filterObjects)

    const filterValues = []
    const filterTexts = []
    console.log('update filter')
    console.log(value)
    console.log(value.length)
    console.log(name)

    for (const item of value) {
      filterValues.push(item.value)
      filterTexts.push(item.text)
    }

    Vue.set(state.filters.selections, name, [...new Set(filterValues)])
    Vue.set(state.filters.labels, name, [...new Set(filterTexts)])
    createBookmark(router, state.filters.selections, state.selectedCollections)

    // if (name === 'materials') {
    //   console.log('if material')
    //   console.log(name, value)
    //   // state.filterObjects[4].optionsFilter = state.filters.labels
    // }
    state.filterObjects[4].optionsFilter = state.filters.labels
    console.log(state.filterObjects[4].optionsFilter)

    console.log(state.filters.selections)
    console.log(state.filters.labels)
  },
  UpdateAllFilters (state, selections) {
    state.filters.selections = {}
    for (const [key, value] of Object.entries(selections)) {
      if (key === 'search') {
        Vue.set(state.filters.selections, key, value)
        continue
      }

      Vue.set(state.filters.selections, key, value)
      const leftoverLabels = [...new Set(state.filterLabelCache.filter(flc => value.includes(flc.value)).map(flc => flc.text))]
      Vue.set(state.filters.labels, key, leftoverLabels)
    }
  },
  // UpdateCountry (state, { name, value }) {
  //   // console.log('Hello')
  //   // // console.log(state.biobanks)
  //   // console.log(name)
  //   // console.log(value)
  //   const filterValues = []
  //   const filterTexts = []

  //   for (const item of value) {
  //     filterValues.push(item.value)
  //     filterTexts.push(item.text)
  //     // console.log('update country')
  //     // console.log(filterValues)
  //   }

  //   Vue.set(state.filters.selections, name, [...new Set(filterValues)])
  //   Vue.set(state.filters.labels, name, [...new Set(filterTexts)])
  // },
  /**
   * Reset all filters in the state
   */
  ResetFilters (state) {
    state.filters.selections = {}
  },
  SetBiobanks (state, biobanks) {
    biobanks.forEach(biobank => {
      Vue.set(state.biobanks, biobank.id, fixCollectionTree(biobank))
    })
  },
  SetFilterObjects (state) {
    state.filterObjects = filterDefinitions(state)
    console.log('setfilter')
    console.log(state.filterObjects)// .map(fd => fd) // .map(fd => fd.name)
    // Vue.set(state.filterObjects, filterDefinitions)
  },

  // SetFilterObjects (state) {
  //   filterDefinitions(state).forEach(filterdef => {
  //     state.filterObjects = filterdef
  //   })
  // },
  SetBiobankIds (state, biobankIds) {
    state.biobankIds = biobankIds
  },
  SetDictionaries (state, response) {
    const collections = response.items.map(item => (
      {
        id: item.data.id,
        label: item.data.label || item.data.name,
        biobankName: item.data.biobank.data.label || item.data.biobank.data.name
      }))

    collections.forEach(function (collection) {
      state.collectionBiobankDictionary[collection.id] = collection.biobankName
      state.collectionDictionary[collection.id] = collection.label
    })
  },
  SetCollectionInfo (state, response) {
    if (response === undefined) {
      state.collectionInfo = response
      return
    }
    // if (response === undefined) {
    //   state.biobankCountries = response
    //   return
    // }

    console.log('setcolectioninfo')
    // if (flag === 'GetCollectionInfo') {
    const collectionInfo = response.items.map(item => ({
      collectionId: item.data.id,
      collectionName: item.data.label || item.data.name,
      biobankId: item.data.biobank.data.id,
      isSubcollection: item.data.parent_collection !== undefined
    }))
    // }

    // api.get('item[0].data.country.links.self').then(response => {
    //     response.items.map((obj) => { return { text: obj, value: obj } })
    //     })
    //   })
    // }

    // const CountryList = []
    // state.countryDictionary = []
    // // const countries = []

    // for (var key in response.items) {
    //   CountryList.push(response.items[key].data.country.links.self)
    // }
    // // console.log(Array.from(new Set(CountryList)))
    // state.countrylist = Array.from(new Set(CountryList))
    // for (var country in state.countrylist) {
    //   // api.get(state.countrylist[country]).then(response => (state.countryDictionary[response.data.id] = response.data.name))
    //   api.get(state.countrylist[country]).then(response => (state.countryDictionary[response.data.id] = response.data.name))
    // }
    state.collectionInfo = collectionInfo
  },

  // SetCountryList (state, response) {
  //   console.log('setycoutnrylist')

  //   if (response === undefined) {
  //     state.countrylist = response
  //     return
  //   }
  //   const CountryList = []
  //   state.countryDictionary = []
  //   // const countries = []

  //   for (var key in response.items) {
  //     CountryList.push(response.items[key].data.country.links.self)
  //   }
  //   // console.log(Array.from(new Set(CountryList)))
  //   const countrylist = Array.from(new Set(CountryList))
  //   // console.log(countrylist.length)
  //   // console.log(CountryList.length)
  //   for (var country in countrylist) {
  //     // api.get(state.countrylist[country]).then(response => (state.countryDictionary[response.data.id] = response.data.name))
  //     api.get(countrylist[country]).then(response => (state.countryDictionary[response.data.id] = response.data.name))
  //   }
  // },
  // SetMaterialList (state, response) {
  //   console.log('setymateriallist')

  //   if (response === undefined) {
  //     state.materiallist = response
  //     return
  //   }
  //   const MaterialList = []
  //   state.materialDictionary = []

  //   for (var key in response.items) {
  //     MaterialList.push(response.items[key].data.materials.links.self)
  //   }
  //   // console.log(MaterialList)
  //   const materiallist = Array.from(new Set(MaterialList))
  //   // console.log(materiallist.length)
  //   // console.log(MaterialList.length)

  //   for (var material in materiallist) {
  //     api.get(materiallist[material]).then(response => {
  //       // const materialsresolve = response.items.map((obj) => [obj.data.id, obj.data.label])
  //       for (var item in response.items) {
  //         state.materialDictionary[response.items[item].data.id] = response.items[item].data.label
  //       }
  //     })
  //   }
  //   // console.log(state.materialDictionary)
  // },
  /**
   * Store a single biobank in the state for showing a biobank report
   * @param state
   * @param biobank response object from the server containing meta and items for a single biobank
   */
  SetBiobankReport (state, biobank) {
    state.biobankReport = biobank
  },
  SetCollectionReport (state, collection) {
    state.collectionReport = collection
  },
  SetNetworkReport (state, network) {
    state.networkReport.network = network
  },
  SetNetworkCollections (state, collections) {
    state.networkReport.collections = collections
  },
  SetNetworkBiobanks (state, biobanks) {
    state.networkReport.biobanks = biobanks
  },
  // methods for rehydrating bookmark
  SetCollectionIdsWithSelectedQuality (state, response) {
    if (response.items && response.items.length > 0) {
      state.collectionIdsWithSelectedQuality = []
      state.collectionIdsWithSelectedQuality = [...new Set(response.items.map(ri => ri.collection.id))]
    } else {
      const collectionQualityFilter = state.filters.selections.collection_quality
      const isCollectionQualityFilterActive = (collectionQualityFilter && collectionQualityFilter.length > 0) || state.route.query.collection_quality

      state.collectionIdsWithSelectedQuality = isCollectionQualityFilterActive ? ['no-collection-found'] : []
    }
  },
  SetBiobankIdsWithSelectedQuality (state, response) {
    if (response.items && response.items.length > 0) {
      state.biobankIdsWithSelectedQuality = []
      state.biobankIdsWithSelectedQuality = [...new Set(response.items.map(ri => ri.biobank.id))]
    } else {
      const biobankQualityFilter = state.filters.selections.biobank_quality
      const isBiobankQualityFilterActive = (biobankQualityFilter && biobankQualityFilter.length > 0) || state.route.query.biobank_quality

      state.biobankIdsWithSelectedQuality = isBiobankQualityFilterActive ? ['no-biobank-found'] : []
    }
  },
  AddCollectionToSelection (state, { collection, router }) {
    if (Array.isArray(collection)) {
      const currentIds = state.selectedCollections.map(sc => sc.value)
      const newCollections = collection.filter(cf => !currentIds.includes(cf.value))
      state.selectedCollections = [...new Set(state.selectedCollections.concat(newCollections))]
    } else {
      state.selectedCollections.push(collection)
    }
    if (router) {
      createBookmark(router, state.filters.selections, state.selectedCollections)
    }
  },
  RemoveCollectionFromSelection (state, { collection, router }) {
    const collectionsToRemove = Array.isArray(collection) ? collection.map(c => c.value) : [collection.value]
    state.selectedCollections = [...new Set(state.selectedCollections.filter(sc => !collectionsToRemove.includes(sc.value)))]

    if (router) {
      createBookmark(router, state.filters.selections, state.selectedCollections)
    }
  },
  /**
   *
   * @param state
   * @param params
   */
  MapQueryToState (state, ie11Query) {
    const query = ie11Query || state.route.query
    const keysInQuery = Object.keys(query)
    // we load the filterdefinitions, grab the names, so we can loop over it to map the selections
    const filters = filterDefinitions(state).map(fd => fd.name)
      .filter(name => keysInQuery.includes(name))
      .filter(fr => !['search', 'nToken'].includes(fr)) // remove specific filters, else we are doing them again.

    if (query.search) {
      Vue.set(state.filters.selections, 'search', query.search)
    }

    if (query.nToken) {
      state.nToken = query.nToken
    }

    if (query.cart) {
      const decoded = decodeURIComponent(query.cart)
      const cartIdString = atob(decoded)
      const cartIds = cartIdString.split(',')
      state.selectedCollections = cartIds.map(id => ({ label: state.collectionDictionary[id], value: id }))
    }

    for (const filterName of filters) {
      if (query[filterName]) {
        Vue.set(state.filters.selections, filterName, decodeURIComponent(query[filterName]).split(','))
      }
    }
    state.bookmarkMappedToState = true
  },
  SetError (state, error) {
    state.error = error
  },
  SetLoading (state, loading) {
    state.isLoading = loading
  },
  SetPodium (state, response) {
    state.isPodium = response.items.map(item => item.id.toLowerCase()).some(id => id.includes('podium'))
  },
  SetPodiumCollections (state, response) {
    state.podiumCollectionIds = response.items.map(pc => pc.data.id)
  },
  SetNegotiatorEntities (state, negotiatorConfig) {
    const negotiatorEntities = negotiatorConfig.items.map(nci => {
      return { id: nci.id, collectionEntityId: nci.entity.id, biobankEntityId: nci.biobankId.refEntityType.id } // We need to have the table
    }).filter(ne => negotiatorConfigIds.includes(ne.id))[0]

    if (negotiatorEntities) {
      state.negotiatorCollectionEntityId = negotiatorEntities.collectionEntityId
      state.negotiatorBiobankEntityId = negotiatorEntities.biobankEntityId
    }
  },
  SetExternalCatalogResources (state, externalCatalogsResources) {
    state.externalCatalogsResources = externalCatalogsResources
  },
  AddExternalCatalogResources (state, { catalog, resources }) {
    Vue.set(state.externalCatalogsResources, catalog, resources)
  },
  RemoveExternalCatalogResources (state, catalog) {
    Vue.delete(state.externalCatalogsResources, catalog)
  }
}
