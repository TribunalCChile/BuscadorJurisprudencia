<script>
    import axios from 'axios'; 
    import { useStore } from 'vuex'
    import { computed, onMounted, ref, watch, watchEffect } from 'vue';
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
            parameterId: Number,
            disabled: Boolean,
            selectedInputs: Object,
        },
        setup(props, context) {
            const store = useStore(); 
            const dataTypeContent = ref([]);
            const cuerpoLegalContent = ref([]);
            const rowsPreceptoLegal = ref([]);
            const isHoverAdd = ref(false); 
            const inputs = ref({});
            //propiedades 
            const dataTypeId = props.dataTypeId; 
            const parameterName = props.parameterName;
            const parameterId = props.parameterId;
            const selectedInputs = props.selectedInputs; 
            const disabled = props.disabled;
             
            
            console.log(selectedInputs);
            
            watchEffect(() => {
                console.log('selected inputS: ',props.selectedInputs);
                if (props.selectedInputs) {
                    rowsPreceptoLegal.value = { ...props.selectedInputs };
                     
                }
            }); 
            onMounted(async () => {
                /* async y await para que primero se llamen las api y luego llenar los rows */ 
                await getDataTypeContent();
                await getCuerpoLegal();
                initializeRows(); 
                
            })

            /* watch(inputs, (newInputs, oldInputs) => {
                filterFixedArray(newInputs);
            }, { deep: true });  */
            const initializeRows = () => {
                addRowPreceptoLegal(); 
                
            } 
            const addRowPreceptoLegal = () => {
                const newRow = {
                    'Cuerpo Legal': '',
                    ...Object.fromEntries(dataTypeContent.value.tipo_dato_contenido.map(datatype => [datatype.nombre, '']))
                }
                rowsPreceptoLegal.value.push(newRow); 
                console.log(rowsPreceptoLegal.value);
            }

            const removeRowPreceptoLegal = (indexElem) => { 
                rowsPreceptoLegal.value = rowsPreceptoLegal.value.filter((row, index) => index !== indexElem);
                console.log(rowsPreceptoLegal.value);
            }  

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
                    values: rowsPreceptoLegal.value,
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
                icon,
                isHoverAdd,
                rowsPreceptoLegal,
                addRowPreceptoLegal,
                removeRowPreceptoLegal,
            }
        }
    }
</script>

<template>
    <CCard>
        <CCardHeader class="d-flex justify-content-between align-items-center">
            <span>{{ parameterName }}</span>
            <CButton 
                variant="outline"
                @click="addRowPreceptoLegal"
                ><CIcon 
                    :icon="icon.cilPlus" 
                    size="lg"
                    :class="{'text-success': isHoverAdd}"
                    @mouseover="isHoverAdd = true"
                    @mouseleave="isHoverAdd = false"       
                />
            </CButton>
            
        </CCardHeader>
        <CCardBody>
            
            <CRow v-for="(row, index) in rowsPreceptoLegal" :key="index" class="mt-2">
                <CCol>
                    <label class="">{{ cuerpoLegalContent.nombre }}</label>
                    <v-select
                        v-model="row['Cuerpo Legal']"
                        placeholder="Seleccione..."
                        :options="cuerpoLegalContent.tipo_dato_contenido"
                        :reduce="dataType => dataType.nombre"
                        label="nombre"
                        class="mt-2"
                        :disabled="disabled"
                        searchable
                        
                    >
        
                    </v-select>
                </CCol>
                
                <CCol v-for="dataType in dataTypeContent.tipo_dato_contenido" :key="dataType.id">
                     
                    <CFormInput
                        v-model="row[dataType.nombre]"
                        type="text"
                        :label="dataType.nombre"
                        :disabled="disabled"
                    />
                </CCol>
                <CCol>
                    <CButton 
                    variant="outline"
                    color="danger"
                    class="mt-4"
                    size="sm"
                    @click="removeRowPreceptoLegal(index)"
                    ><CIcon 
                        :icon="icon.cilTrash" 
                        size="lg"
                        class="mt-1"      
                    />
            </CButton>
                </CCol>
            </CRow>
                    
        </CCardBody>
    </CCard>
        
</template>

