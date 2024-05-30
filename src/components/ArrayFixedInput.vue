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
            const isHoverAdd = ref(false); 
            const isHoverRemove = ref(false);
            const rowsPreceptoLegal = ref([])
            const inputs = ref({});

            onMounted(async () => {
                /* async y await para que primero se llamen las api y luego llenar los rows */ 
                await getDataTypeContent();
                await getCuerpoLegal();
                initializeRows();
            });

            watch(rowsPreceptoLegal, (newInputs, oldInputs) => {
                filterFixedArray(newInputs);
            }, { deep: true }); 
            
            const initializeRows = () => {
                addRowPreceptoLegal(); 
                console.log("rows initial: ", rowsPreceptoLegal.value); 
            }  
            const addRowPreceptoLegal = () => {
                const newRow = {
                    'Cuerpo Legal': '',
                    ...Object.fromEntries(dataTypeContent.value.tipo_dato_contenido.map(datatype => [datatype.nombre, '']))
                }
                rowsPreceptoLegal.value.push(newRow); 
                console.log(rowsPreceptoLegal.value);
            }

            const removeRowPreceptoLegal = (index) => {
                console.log(index); 
                rowsPreceptoLegal.value = rowsPreceptoLegal.value.filter((row, i) => i !== index);
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

            const filterFixedArray = (value) => {
                context.emit('filterFixedArray', {
                    parameterId: parameterId,
                    values: rowsPreceptoLegal.value,
                })     
            }
            
            return {
                dataTypeContent,
                parameterName,
                cuerpoLegalContent,
                rowsPreceptoLegal,
                addRowPreceptoLegal,
                removeRowPreceptoLegal,
                isHoverAdd,
                isHoverRemove,
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
                        searchable
                        
                    >
        
                    </v-select>
                </CCol>
                
                <CCol v-for="dataType in dataTypeContent.tipo_dato_contenido" :key="dataType.id">
                     
                    <CFormInput
                        v-model="row[dataType.nombre]"
                        type="text"
                        :label="dataType.nombre"
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

