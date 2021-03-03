import api from '@molgenis/molgenis-api-client'
import helpers from './helpers'
import utils from '../utils'
import 'array-flat-polyfill'

import {
  encodeRsqlValue,
  transformToRSQL
} from '@molgenis/rsql'

/* API PATHS */
const BIOBANK_API_PATH = '/api/v2/eu_bbmri_eric_biobanks'
const COLLECTION_API_PATH = '/api/v2/eu_bbmri_eric_collections'

export const COLLECTION_QUALITY_INFO_API_PATH =
  '/api/v2/eu_bbmri_eric_col_qual_info'
export const BIOBANK_QUALITY_INFO_API_PATH =
  '/api/v2/eu_bbmri_eric_bio_qual_info'

const NETWORK_API_PATH = '/api/v2/eu_bbmri_eric_networks'
const NEGOTIATOR_API_PATH = '/api/v2/sys_negotiator_NegotiatorConfig'
const NEGOTIATOR_CONFIG_API_PATH =
  '/api/v2/sys_negotiator_NegotiatorEntityConfig?attrs=*,biobankId(refEntityType)'

// const EXTERNAL_SOURCES_API_PATH = '/api/v2/eu_bbmri_eric_external_sources'
const EXTERNAL_RESOURCES_API_PATH = '/api/ejprd/external_sources'
/**/

/* Query Parameters */
export const COLLECTION_ATTRIBUTE_SELECTOR =
  'collections(id,country,materials,description,materials,diagnosis_available,name,type,order_of_magnitude(*),size,sub_collections(*),parent_collection,quality(*),data_categories,order_of_magnitude_donors(*),number_of_donors,timestamp)'
// export const COLLECTION_REPORT_ATTRIBUTE_SELECTOR = '*,diagnosis_available(label),data_use(label),biobank(id,name,juridical_person,country,url,contact),contact(title_before_name,first_name,last_name,title_after_name,email,phone),sub_collections(name,id,sub_collections(*),parent_collection,order_of_magnitude,materials,data_categories)'
export const COLLECTION_REPORT_ATTRIBUTE_SELECTOR =
  '*,diagnosis_available(label),country,materials,biobank(id,name,juridical_person,country,url,contact,description,ressource_types),contact(title_before_name,first_name,last_name,title_after_name,email,phone),sub_collections(name,id,sub_collections(*),parent_collection,order_of_magnitude,materials,data_categories,number_of_donors,order_of_magnitude_donors,timestamp)'

/**/

export default {
  GetNegotiatorEntities ({ commit }) {
    api.get(NEGOTIATOR_CONFIG_API_PATH).then(response => {
      commit('SetNegotiatorEntities', response)
    })
  },
  /*
   * Retrieves biobanks and stores them in the cache
   */
  GetBiobanks ({
    commit
  }, biobankIds) {
    const q = encodeRsqlValue(
      transformToRSQL({
        selector: 'id',
        comparison: '=in=',
        arguments: biobankIds
      })
    )
    api
      .get(
        `${BIOBANK_API_PATH}?num=10000&attrs=${COLLECTION_ATTRIBUTE_SELECTOR},*&q=${q}`
      )
      .then(
        response => {
          commit('SetBiobanks', response.items)
        },
        error => {
          commit('SetError', error)
        }
      )
  },
  // We need to get id's to use in RSQL later, because we can't do a join on this table
  GetCollectionIdsForQuality ({
    state,
    commit
  }) {
    const collectionQuality = state.route.query.collection_quality
      ? state.route.query.collection_quality
      : null
    const qualityIds =
      state.filters.selections.collection_quality ?? collectionQuality

    if (qualityIds && qualityIds.length > 0) {
      api
        .get(
          `${COLLECTION_QUALITY_INFO_API_PATH}?attrs=collection(id)&q=assess_level_col=in=(${qualityIds})`
        )
        .then(response => {
          commit('SetCollectionIdsWithSelectedQuality', response)
        })
    } else {
      commit('SetCollectionIdsWithSelectedQuality', [])
    }
  },
  // Same as collections above
  GetBiobankIdsForQuality ({
    state,
    commit
  }) {
    const biobankQuality = state.route.query.biobank_quality
      ? state.route.query.biobank_quality
      : null
    const qualityIds =
      state.filters.selections.biobank_quality ?? biobankQuality

    if (qualityIds && qualityIds.length > 0) {
      api
        .get(
          `${BIOBANK_QUALITY_INFO_API_PATH}?attrs=biobank(id)&q=assess_level_bio=in=(${qualityIds})`
        )
        .then(response => {
          commit('SetBiobankIdsWithSelectedQuality', response)
        })
    } else {
      commit('SetBiobankIdsWithSelectedQuality', [])
    }
  },
  /*
   * Retrieves all collection identifiers matching the collection filters, and their biobanks
   */
  GetCollectionInfo ({
    commit,
    getters
  }) {
    console.log('GetCollectionInfo')
    commit('SetCollectionInfo', undefined)
    // commit('SetCountryList', undefined)
    let url = '/api/data/eu_bbmri_eric_collections?filter=id,biobank(id,name,label),name,country,materials,label,parent_collection&expand=biobank&size=10000&sort=biobank_label'
    // let urlFake = '/api/data/eu_bbmri_eric_biobanks?filter=id,country&size=10000&sort=name'
    // if (getters.biobankRsql) {
    //   urlFake = `${urlFake}&q=${encodeRsqlValue(getters.biobankRsql)}`
    // }
    if (getters.rsql) {
      url = `${url}&q=${encodeRsqlValue(getters.rsql)}`
    }
    api.get(url)
      .then(response => {
        commit('SetCollectionInfo', response)
        commit('SetDictionaries', response)
        commit('MapQueryToState')
        commit('SetCountryList', response)
        commit('SetMaterialList', response)
      },
      error => {
        commit('SetError', error)
      }
      )
    // url = urlFake
  },
  // getCountryList ({
  //   commit,
  //   getters
  // }) {
  //   let url = '/api/data/eu_bbmri_eric_biobanks?filter=country(name)&size=10000&sort=id'
  //   if (getters.rsql) {
  //     url = `${url}&q=${encodeRsqlValue(getters.rsql)}`
  //   }
  //   api.get(url)
  //     .then(response => {
  //       commit('SetCountryList', response)
  //     },
  //     error => {
  //       commit('SetError', error)
  //     }
  //     )
  // },
  GetBiobankIds ({
    commit,
    getters
  }) {
    console.log('GetBiobankIds')
    commit('SetBiobankIds', undefined)
    // commit('SetCountryList', undefined)
    // commit('SetCollectionInfo', undefined)
    let url = '/api/data/eu_bbmri_eric_biobanks?filter=id,country&size=10000&sort=name'
    if (getters.biobankRsql) {
      url = `${url}&q=${encodeRsqlValue(getters.biobankRsql)}`
    }
    api.get(url).then(
      response => {
        // console.log(response)
        // commit('SetCollectionInfo', response)
        commit(
          'SetBiobankIds',
          response.items.map(item => item.data.id)
        )
        // commit('SetCountryList', response)
      },
      error => {
        commit('SetError', error)
      }
    )
  },
  GetBiobankReport ({
    commit,
    state
  }, biobankId) {
    if (state.allBiobanks) {
      commit(
        'SetBiobankReport',
        state.allBiobanks.find(it => it.id === biobankId)
      )
      return
    }
    commit('SetLoading', true)
    api
      .get(
        `${BIOBANK_API_PATH}/${biobankId}?attrs=${COLLECTION_ATTRIBUTE_SELECTOR},${utils.qualityAttributeSelector(
          'bio'
        )},contact(*),*`
      )
      .then(
        response => {
          commit('SetBiobankReport', response)
          commit('SetLoading', false)
        },
        error => {
          commit('SetError', error)
          commit('SetLoading', false)
        }
      )
  },
  GetCollectionReport ({
    commit
  }, collectionId) {
    commit('SetLoading', true)
    api
      .get(
        `${COLLECTION_API_PATH}/${collectionId}?attrs=${COLLECTION_REPORT_ATTRIBUTE_SELECTOR}`
      )
      .then(
        response => {
          commit('SetCollectionReport', response)
          commit('SetLoading', false)
        },
        error => {
          commit('SetError', error)
          commit('SetLoading', false)
        }
      )
  },
  GetNegotiatorType ({
    commit
  }) {
    api.get(`${NEGOTIATOR_API_PATH}`).then(
      response => {
        commit('SetPodium', response)
      },
      error => {
        commit('SetError', error)
      }
    )
  },
  GetNetworkReport ({
    commit
  }, networkId) {
    commit('SetNetworkBiobanks', undefined)
    commit('SetNetworkCollections', undefined)
    commit('SetNetworkReport', undefined)
    commit('SetLoading', true)
    const networks = api
      .get(`${NETWORK_API_PATH}/${networkId}`)
      .then(response => commit('SetNetworkReport', response))
      .finally(() => commit('SetLoading', false))
    const collections = api
      .get(
        `${COLLECTION_API_PATH}?q=network==${networkId}&num=10000&attrs=${COLLECTION_REPORT_ATTRIBUTE_SELECTOR}`
      )
      .then(response => commit('SetNetworkCollections', response.items))
    const biobanks = api
      .get(`${BIOBANK_API_PATH}?q=network==${networkId}&num=10000`)
      .then(response => commit('SetNetworkBiobanks', response.items))
    Promise.all([collections, biobanks, networks]).catch(error =>
      commit('SetError', error)
    )
  },
  GetPodiumCollections ({
    state,
    commit
  }) {
    if (state.isPodium && state.podiumCollectionIds.length === 0) {
      // only fetch once.
      api
        .get(
          "/api/data/eu_bbmri_eric_collections?num=10000&filter=id&q=podium!=''"
        )
        .then(response => {
          commit('SetPodiumCollections', response)
        })
    }
  },
  /**
   * Transform the state into a NegotiatorQuery object.
   * Calls the DirectoryController method '/export' which answers with a URL
   * that redirects to a Negotiator server specified in the Directory settings
   */
  async SendToNegotiator ({
    state,
    getters,
    commit
  }) {
    const options = {
      body: JSON.stringify(
        await helpers.createNegotiatorQueryBody(
          state,
          getters,
          helpers.getLocationHref()
        )
      )
    }
    return api
      .post('/plugin/directory/export', options)
      .then(helpers.setLocationHref, error => commit('SetError', error))
  },
  GetExternalCatalogsResources ({
    commit,
    getters
  }) {
    const externalSourcesFilter =
      getters.externalCatalogsResourcesFilters.externalSources
    const diagnosisAvailableFilter =
      getters.externalCatalogsResourcesFilters.diagnosisAvailable
    const currentExternalCatalogResources = getters.externalCatalogsResources
    commit('SetExternalCatalogResources', {})
    if (externalSourcesFilter && diagnosisAvailableFilter) {
      externalSourcesFilter.forEach(source => {
        if (source in currentExternalCatalogResources) {
          commit('AddExternalCatalogResources', {
            catalog: source,
            resources: currentExternalCatalogResources[source]
          })
        } else {
          const diagnosisAvailableParam = diagnosisAvailableFilter.join(',')
          const url = `${EXTERNAL_RESOURCES_API_PATH}/${source}?diagnosisAvailable=${diagnosisAvailableParam}`
          api.get(url).then(
            response => {
              commit('AddExternalCatalogResources', {
                catalog: source,
                resources: response.catalogs[0]
              })
            },
            error => {
              commit('SetError', error)
            }
          )
        }
      })
    }
  }
}
