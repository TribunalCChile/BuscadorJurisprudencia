<script>
    import axios from 'axios'; 
    import { useStore } from 'vuex'
    import { computed, onMounted, ref, watch } from 'vue'
    import { CIcon } from '@coreui/icons-vue';
    import * as icon from '@coreui/icons';

    export default {
        name: 'Array Fixed Input',
        emits: ['filterFixedArray'],
        components: {
            CIcon,
        },
        props: {
            dataTypeId: Number,
            parameterName: String,
            parameterId: Number
        },
        setup(props, context) {
            const store = useStore(); 
            const dataTypeContent = ref([]);
            const cuerpoLegalContent = ref([]); 
            //propiedades 
            const dataTypeId = props.dataTypeId; 
            const parameterName = props.parameterName;
            const parameterId = props.parameterId;
            
            const inputs = ref({});
            onMounted(() => {
                getDataTypeContent();
                getCuerpoLegal(); 
            })

            watch(inputs, (newInputs, oldInputs) => {
                filterFixedArray(newInputs);
            }, { deep: true }); 

            async function getDataTypeContent() {
                try {
                    const response = await axios.get(
                        store.state.backendUrl + '/tipodato', 
                        {
                            params: {
                                filter: JSON.stringify({'id': dataTypeId })
                            },
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + store.state.token,
                            }
                        }                  
                    ); 

                    dataTypeContent.value = response.data[0]; 
                    console.log(dataTypeContent.value); 

                } catch(error) {
                    console.error("Error al consultar api getDataTypeContent", error); 
                }
                 
            }

            async function getCuerpoLegal() {
                try {
                    const response = await axios.get(
                        store.state.backendUrl + '/tipodato', 
                        {
                            params: {
                                filter: JSON.stringify({'nombre': 'Cuerpo Legal' })
                            },
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + store.state.token,
                            }
                        }                  
                    ); 

                    cuerpoLegalContent.value = response.data[0]; 

                } catch(error) {
                    console.error("Error al consultar api getDataTypeContent", error); 
                }
                 
            }

            function filterFixedArray(value) {
                context.emit('filterFixedArray', {
                    parameterId: parameterId,
                    values: inputs.value,
                })     
            }
            
            return {
                dataTypeContent,
                parameterName,
                cuerpoLegalContent,
                inputs,
                icon
            }
        }
    }
</script>

<template>
    <CCard>
        <CCardHeader class="d-flex justify-content-between align-items-center">
            <span>{{ parameterName }}</span>
            <CButton color="primary"><CIcon :icon="icon.cilPlus" size="sm" class="text-white" /></CButton>
        </CCardHeader>
        <CCardBody>
            <CRow>
                <CCol>
                    <label class="">{{ cuerpoLegalContent.nombre }}</label>
                    <v-select
                        placeholder="Seleccione..."
                        :options="cuerpoLegalContent.tipo_dato_contenido"
                        :reduce="dataType => dataType.nombre"
                        label="nombre"
                        class="mt-2"
                        searchable
                        
                    >
        
                    </v-select>
                </CCol>
                
                <CCol v-for="dataType in dataTypeContent.tipo_dato_contenido" :key="dataType.id">
                     
                    <CFormInput
                        v-model="inputs[dataType.nombre]"
                        type="text"
                        :label="dataType.nombre"
                    />
                </CCol>
                
            </CRow>
                    
        </CCardBody>
    </CCard>
        
</template>

