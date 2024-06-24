<template>
    <div>
        <v-select
            class="mt-3"
            v-model="selectedValues"
            :options="resolutionTypes"
            :reduce="res => res.shortName"
            placeholder="Filtrar por tipo de resolución"
            label="name"
            
            >
        </v-select>
    </div>
</template>

<script setup>
    import { defineProps, defineEmits, ref, watch } from 'vue';

    const props = defineProps({
        placeholder: String
    });
    const selectedValues = ref('')
    const resolutionTypes = [
        {
            name: 'Inadmisibilidad',
            shortName: 'INA'
        },
        {
            name: 'Sentencia',
            shortName: 'STC'
        }
    ]
    const emit = defineEmits(['filterByResolution']); 
     
    const filterByResolution = () => {
        
        emit('filterByResolution', selectedValues.value);
    }

    watch(selectedValues, (newSelectedValue) => {
        filterByResolution(); 
    });


</script>