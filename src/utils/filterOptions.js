/* istanbul ignore file */
import api from '@molgenis/molgenis-api-client'
import { encodeRsqlValue, transformToRSQL } from '@molgenis/rsql'
import { isCodeRegex } from '../../src/store/helpers'
import state from '../../src/store/state'
// import { mapGetters } from 'vuex'

// import { foundBiobanks } from '../../src/store/getters.js'

// const found = mapGetters(['foundBiobanks'])

export const genericFilterOptions = (tableName) => {
  return () => new Promise((resolve) => {
    api.get(`/api/v2/${tableName}`).then(response => {
      const filterOptions = response.items.map((obj) => { return { text: obj.label || obj.name, value: obj.id } })
      resolve(filterOptions)
    })
  })
}

/** Specific logic for diagnosis available filter */
const createDiagnosisLabelQuery = (query) => transformToRSQL({ selector: 'label', comparison: '=like=', arguments: query })
const createDiagnosisCodeQuery = (query) => transformToRSQL({ selector: 'code', comparison: '=like=', arguments: query.toUpperCase() })
/** */

const createRessourceTypeLabelQuery = (query) => transformToRSQL({ selector: 'label', comparison: '=like=', arguments: query })
const createRessourceTypeCodeQuery = (query) => transformToRSQL({ selector: 'id', comparison: '=like=', arguments: query.toUpperCase() })

export const diagnosisAvailableFilterOptions = (tableName) => {
  // destructure the query part from the multi-filter
  return ({ query, queryType }) => new Promise((resolve) => {
    let url = `/api/v2/${tableName}`

    if (query) {
      // initial load, values are ids
      if (queryType === 'in') {
        url = `${url}?q=${encodeRsqlValue(`id=in=(${query})`)}`
      } else if (isCodeRegex.test(query)) {
        url = `${url}?q=${encodeRsqlValue(createDiagnosisCodeQuery(query))}&sort=code`
      } else {
        url = `${url}?q=${encodeRsqlValue(createDiagnosisLabelQuery(query))}`
      }
    }
    api.get(url).then(response => {
      const filterOptions = response.items.map((obj) => { return { text: `[ ${obj.code} ] -  ${tableName} - ${obj.label || obj.name}`, value: obj.id } })
      resolve(filterOptions)
    })
  })
}

export const onRemoveFilter = () => alert('remove me please')

export const newFilterFunc = (testVar) => {
  return () => new Promise((resolve) => {
    const ressourceTypes = testVar
    resolve({ text: `[ ${ressourceTypes} ]` || 'DNA', value: 'DNA' })
  })
}

export const newCountryFilterOption = () => {
  return () => new Promise((resolve) => {
    // const countriess = new Set()
    const countries = []
    const countryNAME = new Set()
    const countryID = new Set()
    var dict = []
    console.log('Biobanks')
    console.log(state.biobanks)
    for (var key in state.biobanks) {
      countries.push(state.biobanks[key].country)
    }
    // console.log('Country!')
    console.log('Bioids')
    console.log(state.biobankIds.length)

    // const countriess = new Set(countries)
    countries.forEach(country => {
      countryNAME.add(country.name)
      countryID.add(country.id)
    })
    const names = [...countryNAME]
    const ids = [...countryID]

    for (var count in names) {
      dict.push({ name: names[count], id: ids[count] })
    }

    console.log('countrylist')
    console.log(state.countrylist)

    const countryresolve = dict.map((obj) => { return { text: obj.name || obj.id, value: obj.id } })
    resolve(countryresolve)
  })
}

// export const resscourceTypesAvailableFilterOptions = (tableName) => Promise.resolve(
//   [
//     { text: 'Orange', value: 'orange' },
//     { text: 'Apple', value: 'apple' },
//     { text: 'Pineapple', value: 'pineapple' },
//     { text: 'Grape', value: 'grape' }
//   ]
// )
export const options = () => {
  console.log('options')
  console.log(state.biobankIds)
  return () => new Promise((resolve) => {
    resolve([
      { text: `[ ${state.biobankIds} ]` || 'DNA', value: 'orange' },
      { text: `[ ${state} ]` || 'DNA', value: 'apple' }
      // { text: `[ ${state} ]` || 'DNA', value: 'pineapple' },
      // { text: `[ ${state} ]`, value: 'grape' }
    ])
  })
}

// export const genericFilterOptions = (tableName) => {
//   return () => new Promise((resolve) => {
//     api.get(`/api/v2/${tableName}`).then(response => {
//       const filterOptions = response.items.map((obj) => { return { text: obj.label || obj.name, value: obj.id } })
//       resolve(filterOptions)
//     })
//   })
// }

// export default {
//   components: { state },
//   data () {
//     return {
//       debounce: undefined
//     }
//   },
//   computed: {
//     ...mapGetters(['foundBiobanks'])
//   }
// }

export const model = []

export const resscourceTypesAvailableFilterOptions = (tableName) => {
  // destructure the query part from the multi-filter
  return ({ query, queryType }) => new Promise((resolve) => {
    let url = `/api/v2/${tableName}`

    if (query) {
      // initial load, values are ids
      if (queryType === 'in') {
        url = `${url}?q=${encodeRsqlValue(`id=in=(${query})`)}`
      } else if (isCodeRegex.test(query)) {
        url = `${url}?q=${encodeRsqlValue(createRessourceTypeCodeQuery(query))}&sort=label`
      } else {
        url = `${url}?q=${encodeRsqlValue(createRessourceTypeLabelQuery(query))}`
      }
    }
    api.get(url).then(response => {
      const filterOptions = response.items.map((obj) => { return { text: `[ ${obj.label} ] - ${obj.id} - -  ${tableName}`, value: obj.id } })
      resolve(filterOptions)
    })
  })
}
