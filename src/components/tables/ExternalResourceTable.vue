<template>
  <table class="table table-condensed table-responsive">
    <thead>
      <tr>
        <th scope="col">Type</th>
        <th scope="col">ID</th>
        <th scope="col">Name</th>
        <th scope="col">URL</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="resource in resources" :key="resource.name">
        <td
          class="table-text-content-columns"
          v-for="column in columns"
          :key="column.uuid"
        >
          <a v-if="column == 'homepage'" :href=resource[column]>{{ resource[column] }}</a>
          <span v-else-if="column == 'type' && resource[column] == 'PatientRegistryDataset'">Registry</span>
          <span v-else-if="column == 'type' && resource[column] == 'BiobankDataset'">Biobank</span>
          <span v-else>{{ resource[column] }}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style>
.collapsed > .when-visible {
  display: none;
}
:not(.collapsed) > .when-hidden {
  display: none;
}

.table-text-content-columns {
  font-size: 13px;
  font-weight: bold;
}

.table-text-content-columns-has-sub {
  font-size: 13px;
  font-weight: bold;
  border-style: hidden;
  border-width: 0px;
}

.sub-table-cell {
  padding-top: 0px;
}
</style>

<script>
export default {
  name: 'external-resource-table',
  props: {
    resources: {
      type: Array,
      required: true
    }
  },
  computed: {},
  data () {
    return {
      columns: ['type', 'id', 'name', 'homepage']
    }
  }
}
</script>
