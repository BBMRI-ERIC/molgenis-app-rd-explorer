/* istanbul ignore file */
import api from '@molgenis/molgenis-api-client'
import { encodeRsqlValue, transformToRSQL } from '@molgenis/rsql'
import { isCodeRegex } from '../../src/store/helpers'
import state from '../../src/store/state'

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
      const filterOptions = response.items.map((obj) => { return { text: `[ ${obj.label} ]`, value: obj.id } })
      resolve(filterOptions)
    })
  })
}

export const newFilterFunc = (testVar) => {
  return () => new Promise((resolve) => {
    const ressourceTypes = testVar
    resolve({ text: `[ ${ressourceTypes} ]` || 'DNA', value: 'DNA' })
  })
}

export const newCountryFilterOption = () => {
  return () => new Promise((resolve) => {
    const countries = []
    console.log('Biobanks')
    for (var key in state.biobanks) {
      countries.push(state.biobanks[key])
    }
    console.log('Country!')
    console.log(countries[0].country.name)
    resolve(countries.map((obj) => { return { text: `${obj.country.name}`, value: obj.country.id } })
    )
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
