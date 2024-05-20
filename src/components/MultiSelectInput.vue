<script>
    import axios from 'axios';

    export default {
        emits: ['filterMultiSelect'],
        name: 'MultiSelectInput',
        props: {
            parameter: Object,
            disabled: Boolean,
            isEdit: Boolean,
        },
        
        data() {
            return {
                fail: false,
                failMsg: '',
                selectedOptions: [],
                options: null,
                fichaTitle: ''
            }
        },
        mounted() {
            if (this.isEdit) {
                this.fichaTitle = this.parameter.parametro.nombre; 
                this.selectedOptions = this.parameter.parametro.tipo_dato.tipo_dato_contenido; 
            
            } else {
                this.fichaTitle = this.parameter.nombre; 
                this.selectedOptions = this.parameter.tipo_dato.tipo_dato_contenido; 
            }
            console.log(this.parameter);
        },
        methods: {
            filterMultiSelect(value) {
                console.log(this.options);
                this.$emit('filterMultiSelect', 
                    { 
                        parameterId: this.parameter.id,
                        values: this.options 
                    }
                ); 
            }
        }
    }
</script>

<template>
    <div>
        <label class="mt-3">{{ fichaTitle }}</label>
        <v-select
            v-model="options"
            placeholder="Seleccione..."
            :options="selectedOptions"
            :reduce="dataType => dataType.nombre"
            @option:selected="filterMultiSelect"
            @option:deselected="filterMultiSelect"
            label="nombre"
            multiple
        >
        
        </v-select>
        <CAlert color="danger" :visible="fail" dismissible @close="() => { fail = false }">
                {{ failMsg }}
        </CAlert>
    </div>
</template>