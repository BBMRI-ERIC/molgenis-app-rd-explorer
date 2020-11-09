import api from '@molgenis/molgenis-api-client'
import helpers from './helpers'
import utils from '../utils'
import 'array-flat-polyfill'

import { encodeRsqlValue, transformToRSQL } from '@molgenis/rsql'

/* API PATHS */
const BIOBANK_API_PATH = '/api/v2/eu_bbmri_eric_biobanks'
const COLLECTION_API_PATH = '/api/v2/eu_bbmri_eric_collections'
const NETWORK_API_PATH = '/api/v2/eu_bbmri_eric_networks'
const BIOBANK_QUALITY_API_PATH = '/api/v2/eu_bbmri_eric_assess_level_bio'
const COUNTRY_API_PATH = '/api/v2/eu_bbmri_eric_countries'
const MATERIALS_API_PATH = '/api/v2/eu_bbmri_eric_material_types'
const COLLECTION_TYPES_API_PATH = '/api/v2/eu_bbmri_eric_collection_types'
const ANJA_path_ = '/api/v2/eu_bbmri_eric_age_units'
const DATA_TYPES_API_PATH = '/api/v2/eu_bbmri_eric_data_types'
const DISEASE_API_PATH = '/api/v2/eu_bbmri_eric_disease_types'
const COLLECTION_QUALITY_INFO_API_PATH = '/api/v2/eu_bbmri_eric_col_qual_info'
const BIOBANK_QUALITY_INFO_API_PATH = '/api/v2/eu_bbmri_eric_bio_qual_info'
const COVID_19_API_PATH = '/api/v2/eu_bbmri_eric_COVID_19'
const NEGOTIATOR_API_PATH = '/api/v2/sys_negotiator_NegotiatorConfig'
const NEGOTIATOR_CONFIG_API_PATH = '/api/v2/sys_negotiator_NegotiatorEntityConfig?attrs=*,biobankId(refEntityType)'
    /**/

/* Query Parameters */
const COLLECTION_ATTRIBUTE_SELECTOR = 'collections(id,description,materials,diagnosis_available,name,type,order_of_magnitude(*),size,sub_collections(*),parent_collection,quality(*),data_categories)'
export const COLLECTION_REPORT_ATTRIBUTE_SELECTOR = '*,diagnosis_available(label),biobank(id,name,juridical_person,country,url,contact),contact(title_before_name,first_name,last_name,title_after_name,email,phone),sub_collections(name,id,sub_collections(*),parent_collection,order_of_magnitude,materials,data_categories)'
    /**/

export default {
    GetNegotiatorEntities({ commit }) {
        api.get(NEGOTIATOR_CONFIG_API_PATH).then(response => {
            commit('SetNegotiatorEntities', response)
        })
    },
    /**
     * Filter actions, used to retrieve country, standards, and materials data on the beforeCreate phase of the Vue component
     * diagnosis_available is queried asynchronously when an option is being searched for.
     */
    GetDataTypeOptions({ commit }) {
        api.get(DATA_TYPES_API_PATH).then(response => {
            commit('SetDataTypes', response.items)
        }, error => {
            commit('SetError', error)
        })
    },
    GetTypesOptions({ commit }) {
        api.get(COLLECTION_TYPES_API_PATH).then(response => {
            commit('SetCollectionTypes', response.items)
        }, error => {
            commit('SetError', error)
        })
    },
    GetCountryOptions({ commit }) {
        api.get(COUNTRY_API_PATH).then(response => {
            commit('SetCountries', response.items)
        }, error => {
            commit('SetError', error)
        })
    },
    GetMaterialsOptions({ commit }) {
        api.get(MATERIALS_API_PATH).then(response => {
            commit('SetMaterials', response.items)
        }, error => {
            commit('SetError', error)
        })
    },
    GetAnjaOptions({ commit }) {
        api.get(ANJA_path_).then(response => {
            commit('SetDataTypes', response.items)
        }, error => {
            commit('SetError', error)
        })
    },
    GetBiobankQualityOptions({ commit }) {
        api.get(BIOBANK_QUALITY_API_PATH).then(response => {
            commit('SetBiobankQuality', response.items)
        }, error => {
            commit('SetError', error)
        })
    },
    GetCovid19Options({ commit }) {
        api.get(COVID_19_API_PATH).then(response => {
            commit('SetCovid19', response.items)
        }, error => {
            commit('SetError', error)
        })
    },
    GetNetworkOptions({ commit }) {
        api.get(NETWORK_API_PATH).then(response => {
            commit('SetNetworkOptions', response.items)
        }, error => {
            commit('SetError', error)
        })
    },
    QueryDiagnosisAvailableOptions({ commit }, query) {
        if (query) {
            const isCodeQuery = helpers.CODE_REGEX.test(query)
            const url = isCodeQuery ?
                `${DISEASE_API_PATH}?q=${encodeRsqlValue(helpers.createDiagnosisCodeQuery(query))}&sort=code` :
                `${DISEASE_API_PATH}?q=${encodeRsqlValue(helpers.createDiagnosisLabelQuery(query))}`

            api.get(url).then(response => {
                commit('SetDiagnosisAvailable', response.items)
            }, error => {
                commit('SetError', error)
            })
        } else {
            commit('SetDiagnosisAvailable', [])
        }
    },
    GetCollectionQualityCollections({ state, commit }) {
        if (state.route.query.collection_quality) {
            const collectionQualityIds = state.route.query.collection_quality.split(',')
            api.get(`${COLLECTION_QUALITY_INFO_API_PATH}?q=assess_level_col=in=(${collectionQualityIds})`).then(response => {
                commit('SetCollectionQualityCollections', response.items)
            })
        } else {
            commit('SetCollectionQualityCollections', [])
        }
    },

    GetBiobankQualityBiobanks({ state, commit }) {
        if (state.route.query.biobank_quality) {
            const biobankQualityIds = state.route.query.biobank_quality.split(',')
            api.get(`${BIOBANK_QUALITY_INFO_API_PATH}?q=assess_level_bio=in=(${biobankQualityIds})`).then(response => {
                commit('SetBiobankQualityBiobanks', response.items)
            })
        } else {
            commit('SetBiobankQualityBiobanks', [])
        }
    },

    GetQuery({ state, dispatch, commit }) {
        if (Object.keys(state.route.query).length > 0) {
            if (state.route.query.diagnosis_available) {
                const diseaseTypeIds = state.route.query.diagnosis_available.split(',')

                api.get(`${DISEASE_API_PATH}?q=code=in=(${diseaseTypeIds})`).then(response => {
                    commit('MapQueryToState', { diagnoses: response.items })
                })
            } else {
                commit('MapQueryToState')
            }
            if (state.route.query.collection_quality) {
                dispatch('GetCollectionQualityCollections')
                commit('MapQueryToState')
            } else {
                commit('MapQueryToState')
            }
        }
    },
    /*
     * Retrieves biobanks and stores them in the cache
     */
    GetBiobanks({ commit }, biobankIds) {
        const q = encodeRsqlValue(transformToRSQL({ selector: 'id', comparison: '=in=', arguments: biobankIds }))
        api.get(`${BIOBANK_API_PATH}?num=10000&attrs=${COLLECTION_ATTRIBUTE_SELECTOR},*&q=${q}`)
            .then(response => {
                commit('SetBiobanks', response.items)
            }, error => {
                commit('SetError', error)
            })
    },
    /*
     * Retrieves all collection identifiers matching the collection filters, and their biobanks
     */
    GetCollectionInfo({ commit, dispatch, getters }) {
        commit('SetCollectionInfo', undefined)
        let url = '/api/data/eu_bbmri_eric_collections?filter=id,biobank,name,label&size=10000&sort=biobank_label'
        if (getters.rsql) {
            url = `${url}&q=${encodeRsqlValue(getters.rsql)}`
        }
        api.get(url)
            .then(response => {
                const collectionInfo = response.items.map(item => ({
                    collectionId: item.data.id,
                    collectionName: item.data.label || item.data.name,
                    biobankId: helpers.getBiobankId(item.data.biobank.links.self)
                }))
                commit('SetCollectionInfo', collectionInfo)
                dispatch('GetQuery')
            }, error => {
                commit('SetError', error)
            })
    },
    GetBiobankIds({ commit, getters }) {
        commit('SetBiobankIds', undefined)
        let url = '/api/data/eu_bbmri_eric_biobanks?filter=id&size=10000&sort=name'
        if (getters.biobankRsql) {
            url = `${url}&q=${encodeRsqlValue(getters.biobankRsql)}`
        }
        api.get(url)
            .then(response => {
                commit('SetBiobankIds', response.items.map(item => item.data.id))
            }, error => {
                commit('SetError', error)
            })
    },
    GetBiobankReport({ commit, state }, biobankId) {
        if (state.allBiobanks) {
            commit('SetBiobankReport', state.allBiobanks.find(it => it.id === biobankId))
            return
        }
        commit('SetLoading', true)
        api.get(`${BIOBANK_API_PATH}/${biobankId}?attrs=${COLLECTION_ATTRIBUTE_SELECTOR},${utils.qualityAttributeSelector('bio')},contact(*),*`).then(response => {
            commit('SetBiobankReport', response)
            commit('SetLoading', false)
        }, error => {
            commit('SetError', error)
            commit('SetLoading', false)
        })
    },
    GetCollectionReport({ commit }, collectionId) {
        commit('SetLoading', true)
        api.get(`${COLLECTION_API_PATH}/${collectionId}?attrs=${COLLECTION_REPORT_ATTRIBUTE_SELECTOR}`).then(response => {
            commit('SetCollectionReport', response)
            commit('SetLoading', false)
        }, error => {
            commit('SetError', error)
            commit('SetLoading', false)
        })
    },
    GetNegotiatorType({ commit }) {
        api.get(`${NEGOTIATOR_API_PATH}`).then(response => {
            commit('SetPodium', response)
        }, error => {
            commit('SetError', error)
        })
    },
    GetNetworkReport({ commit }, networkId) {
        commit('SetNetworkBiobanks', undefined)
        commit('SetNetworkCollections', undefined)
        commit('SetNetworkReport', undefined)
        commit('SetLoading', true)
        const networks = api.get(`${NETWORK_API_PATH}/${networkId}`)
            .then(response => commit('SetNetworkReport', response))
            .finally(() => commit('SetLoading', false))
        const collections = api.get(`${COLLECTION_API_PATH}?q=network==${networkId}&num=10000&attrs=${COLLECTION_REPORT_ATTRIBUTE_SELECTOR}`)
            .then(response => commit('SetNetworkCollections', response.items))
        const biobanks = api.get(`${BIOBANK_API_PATH}?q=network==${networkId}&num=10000`)
            .then(response => commit('SetNetworkBiobanks', response.items))
        Promise.all([collections, biobanks, networks])
            .catch((error) => commit('SetError', error))
    },
    GetPodiumCollections({ state, commit }) {
        if (state.podiumCollectionIds.length === 0) { // only fetch once.
            api.get("/api/data/eu_bbmri_eric_collections?num=10000&filter=id&q=podium!=''").then(response => {
                commit('SetPodiumCollections', response)
            })
        }
    },
    /**
     * Transform the state into a NegotiatorQuery object.
     * Calls the DirectoryController method '/export' which answers with a URL
     * that redirects to a Negotiator server specified in the Directory settings
     */
    SendToNegotiator({ state, getters, commit }) {
        const options = {
            body: JSON.stringify(helpers.createNegotiatorQueryBody(state, getters, helpers.getLocationHref()))
        }
        return api.post('/plugin/directory/export', options)
            .then(helpers.setLocationHref, error => commit('SetError', error))
    }
}