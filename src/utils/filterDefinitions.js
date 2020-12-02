/* istanbul ignore file */
import { genericFilterOptions, diagnosisAvailableFilterOptions } from './filterOptions'


const filterDefinitions = (state) => [{
        name: 'search',
        label: 'Search',
        type: 'string-filter',
        humanReadableString: 'Text search is'
    },
    {
        component: 'MultiFilter',
        name: 'diagnosis_available',
        label: 'Diagnosis available',
        type: 'multi-filter',
        initialDisplayItems: 10,
        maxVisibleOptions: 10,
        table: 'eu_bbmri_eric_disease_types',
        options: diagnosisAvailableFilterOptions('eu_bbmri_eric_disease_types'),
        initiallyCollapsed: !state.route.query.diagnosis_available,
        humanReadableString: 'Disease type(s):'
        
    },
    {
        component: 'CheckboxFilter',
        name: 'materials',
        label: 'Materials',
        type: 'checkbox-filter',
        table: 'eu_bbmri_eric_material_types',
        options: genericFilterOptions('eu_bbmri_eric_material_types'),
        initiallyCollapsed: !state.route.query.materials,
        filters: state.filters.selections.materials,
        maxVisibleOptions: 25,
        humanReadableString: 'Material type(s):'
    },
    {
        component: 'CheckboxFilter',
        name: 'country',
        label: 'Countries',
        type: 'checkbox-filter',
        table: 'eu_bbmri_eric_countries',
        options: genericFilterOptions('eu_bbmri_eric_countries'),
        initiallyCollapsed: !state.route.query.country,
        filters: state.filters.selections.country,
        maxVisibleOptions: 25,
        humanReadableString: 'Countries:'
    },
    {
        component: 'CheckboxFilter',
        name: 'ressource_types',
        label: 'Ressource Types',
        type: 'checkbox-filter',
        table: 'eu_bbmri_eric_ressource_types',
        options: genericFilterOptions('eu_bbmri_eric_ressource_types'),
        initiallyCollapsed: !state.route.query.ressource_types,
        filters: state.filters.selections.ressource_types,
        maxVisibleOptions: 25,
        humanReadableString: 'Ressource type(s):'
    }
]

export default filterDefinitions