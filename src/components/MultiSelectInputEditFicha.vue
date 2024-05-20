<script>
    import axios from 'axios';

    export default {
        emits: ['filterMultiSelect'],
        name: 'MultiSelectInput',
        props: {
            parameterId: Number,
            selectedOptions: Array,
            disabled: Boolean,
            dataTypeId: Number
        },
        
        data() {
            return {
                fail: false,
                failMsg: '',
                allOptions: [],
                optionsSelected: [],
                fichaTitle: ''
            }
        },
        created() {
            //this.allOptions = this.parameter.parametro.tipo_dato.tipo_dato_contenido;
            //this.fichaTitle = this.parameter.parametro.nombre;
            
        },
        watch: {
            disabled: {
                handler(newOptions) {
                    this.setOptions(newOptions) 
                },
                deep: true,
                immediate: true
            },
            selectedOptions: {
                handler(newConfig) {
                    this.setDataSelectedOptions(newConfig) 
                },
                deep: true,
                immediate: true 
            },
        },
        methods: {
            setOptions(newOptions) {
                if (!this.disabled) {
                    axios.get(
                        this.$store.state.backendUrl + '/tipodato',
                        {
                            params: {
                                'filter': JSON.stringify({'id': this.dataTypeId})
                            },
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + this.$store.state.token,
                            }
                        }
                    )
                    .then(response => {
                        this.allOptions = response.data[0].tipo_dato_contenido; 
                        console.log(this.allOptions)
                    
                    }) 
                    
                    
                }
            },
            setDataSelectedOptions(newConfig) {
                this.optionsSelected = newConfig; 
                console.log(this.optionsSelected);
            },
            
            filterMultiSelect(value) {
                
                this.$emit('filterMultiSelect', 
                    { 
                        parameterId: this.parameterId,
                        values: this.optionsSelected
                    }
                ); 
            }
        }
    }
</script>

<template>
    <div>
        <!-- <label class="mt-3">{{ fichaTitle }}</label> -->
        <v-select
            v-model="optionsSelected"
            placeholder="Seleccione..."
            :options="allOptions"
            :reduce="dataType => dataType.nombre"
            @option:selected="filterMultiSelect"
            @option:deselected="filterMultiSelect"
            label="nombre"
            multiple
            :disabled="disabled"

        >
        </v-select>
        <CAlert color="danger" :visible="fail" dismissible @close="() => { fail = false }">
                {{ failMsg }}
        </CAlert>
    </div>
</template>