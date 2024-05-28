<script>
    import axios from 'axios'; 
    import { useStore } from 'vuex'
    import { computed, onMounted, ref, watch, watchEffect } from 'vue'
    export default {
        name: 'Array Fixed Input',
        emits: ['filterFixedArray'],
        props: {
            dataTypeId: Number,
            parameterName: String,
            parameterId: Number,
            disabled: Boolean,
            selectedInputs: Object,
        },
        setup(props, context) {
            const store = useStore(); 
            const dataTypeContent = ref([]);
            const inputs = ref({});
            //propiedades 
            const dataTypeId = props.dataTypeId; 
            const parameterName = props.parameterName;
            const parameterId = props.parameterId;
            const selectedInputs = props.selectedInputs; 
            const disabled = props.disabled; 
            
            console.log(selectedInputs);
            /* watchEffect(() => {
                if (props.selectedInputs) {
                    inputs.value = { ...props.selectedInputs }; 
                }
            }); */
            onMounted(() => {
                getDataTypeContent();
                
            })

            /* watch(inputs, (newInputs, oldInputs) => {
                filterFixedArray(newInputs);
            }, { deep: true });  */

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

            function filterFixedArray(value) {
                context.emit('filterFixedArray', {
                    parameterId: parameterId,
                    values: inputs.value,
                })      

                
            }
           /*  watchEffect(() => {
                // Esto ejecutará filterFixedArray cada vez que inputs cambie
                filterFixedArray();
            }); */
            
            return {
                dataTypeContent,
                parameterName,
                inputs,
            }
        }
    }
</script>

<template>
    <CCard>
        <CCardHeader>{{ parameterName }}</CCardHeader>
        <CCardBody>
            <CRow>
                <CCol v-for="dataType in dataTypeContent.tipo_dato_contenido" :key="dataType.id"> 
                    <CFormInput
                        v-model="inputs[dataType.nombre]"
                        type="text"
                        :label="dataType.nombre"
                        :disabled="disabled"
                    />
                </CCol>
                
            </CRow>
                    
        </CCardBody>
    </CCard>
        
</template>

