<script>
    import axios from 'axios'; 
    import { CIcon } from '@coreui/icons-vue';
    import * as icon from '@coreui/icons';
    import EditParameterModal from '../../components/EditParameterModal.vue';
    import DeleteParameterModal from '../../components/DeleteParameterModal.vue';
    import AddParameterModal from '../../components/AddParameterModal.vue';
    import SearchBarFilter from '../../components/SearchBarFilter.vue';

    export default {
        name: 'Listar Parametros',
        components: {
            CIcon,
            AddParameterModal,
            EditParameterModal,
            DeleteParameterModal,
            SearchBarFilter
        },
        setup() {
            return {
                icon
            }
            
        }, 
        data() {
            return {
                parameters: [],
                dataTypes: [],
                showDeleteModal: false,
                showAddModal: false,
                showEditModal: false,
                parameterId: null,
                searchFilter: '',
            }
        },
        mounted() {
            this.getParameters(); 
            this.getDataTypes(); 
        },

        computed: {
            setNameParameterType() {
                return function(parameterType) {
                    switch(parameterType) {
                        case 1:
                            return 'Single';
                        case 2:
                            return 'Multiple';
                        case 3:
                            return 'TextArea';
                    }
                }
            },
            filteredParameters() {
                let filterParameters = this.parameters; 

                if (this.searchFilter !== '') {
                    filterParameters = filterParameters.filter(parameter => 
                        parameter.nombre.toLowerCase().includes(this.searchFilter.toLowerCase())
                    );
                }

                return filterParameters; 
            }

            
        },
        methods: {
            handleSearch(search) {
                this.searchFilter = search; 
            },
            setNameDataType(dataType) {
                console.log(dataType)
                if (dataType === null) {
                    return 'Single'
                
                } else {
                    console.log(this.dataTypes); 
                    const dataTypeName = this.dataTypes.filter((dtype) => dtype.id === dataType);
                    if (dataTypeName.length > 0) {
                        return dataTypeName[0].nombre;
                    } else {
                        return ''
                    }
                     
                }
            },

            async getDataTypes() {
                try {
                    const response = await axios.get(
                        this.$store.state.backendUrl + '/tipodato',
                        { 
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + this.$store.state.token,
                            }
                        }
                    );
                    
                    this.dataTypes = response.data;
                    console.log(this.dataTypes);
                    
                } catch (error) {
                    console.error('Error en la solicitud a la API:', error);
                    this.failMsg = 'Error al obtener templates.'; 
                    this.fail = true;
                }
            },

            
            async getParameters() {
                try {
                    const response = await axios.get(
                        this.$store.state.backendUrl + '/parametro',
                        { 
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + this.$store.state.token,
                            }
                        }
                    );
                    
                    this.parameters = response.data;

                    /* // se realiza un relleno de false para validar que los botones se utilizaron
                    // un botón (true = > inhabilitado) por cada parámetro 
                    this.parameters.forEach(parameter => {
                        this.addButtons[parameter.id] = false;
                    }); */
                    
                } catch (error) {
                    console.error('Error en la solicitud a la API:', error);
                    this.failMsg = 'Error al obtener parámetros.'; 
                    this.fail = true;
                }
            },
            addParameter() {
                this.showAddModal = true; 
            },
            editParameter(parameter) {
                this.showEditModal = true;
                this.parameterId = parameter; 
            },
            deleteParameter(parameter) {
                this.showDeleteModal = true; 
                this.parameterId = parameter; 
            },
            onCloseAdd() {
                this.showAddModal = false;
                this.getParameters(); 
            },
            onCloseEdit() {
                this.showEditModal = false;
                this.getParameters(); 
            },
            onCloseDelete() {
                this.showDeleteModal = false;
                this.getParameters();            
            },
        }
    }
</script>

<template>
    
    <CRow>
        <CCol class="col-xl-3">
        </CCol>
        <CCol class="col-xl-6">
            <div class="text-center">
                <h3 class="mt-2">Parámetros</h3>
            </div>
    
        </CCol>
        <CCol class="col-xl-3">
            <CButton color="success"  class="mt-2 text-white" @click="addParameter">
                Nuevo
                Parámetro
            </CButton>
        </CCol>
    </CRow>
    <div class="mt-5">
        <SearchBarFilter @search="handleSearch" placeholder="Buscar parámetro..." />
    
    </div>
    <div>
        <CTable class="mt-4">
            <CTableHead>
                <CTableRow color="dark">
                    <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                    <CTableHeaderCell class="text-center" scope="col">Código</CTableHeaderCell>
                    <CTableHeaderCell class="text-center" scope="col">Tipo de Parámetro</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Tipo de Dato</CTableHeaderCell>
                    <CTableHeaderCell class="text-center" scope="col">Estado</CTableHeaderCell>
                    <CTableHeaderCell class="text-center" scope="col">Editar</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
                <CTableRow v-for="(parameter, index) in filteredParameters" :key="parameter.id">
                    <CTableDataCell>{{ parameter.nombre }} </CTableDataCell>
                    <CTableDataCell class="text-center">{{ parameter.codigo }} </CTableDataCell>
                    <CTableDataCell class="text-center">{{ setNameParameterType(parameter.tipoparametro_id) }} </CTableDataCell>
                    <CTableDataCell>{{ setNameDataType(parameter.tipodato_id) }} </CTableDataCell>
                    <CTableDataCell class="text-center">
                        <CFormCheck :checked="true" disabled color="success" />
                    </CTableDataCell>
                    <CTableDataCell class="text-center">
                        <CButton @click="editParameter(parameter)">
                            <CIcon :icon="icon.cilPen" size="xl"/>
                        </CButton>
                        <CButton @click="deleteParameter(parameter)">
                            <CIcon :icon="icon.cilTrash" size="xl"/>
                        </CButton>
                    </CTableDataCell>
                    
                </CTableRow>
            </CTableBody>
        </CTable>
        <AddParameterModal 
            :showModal="showAddModal"
            @closeAddParameterModal="onCloseAdd"
        />

        <EditParameterModal
            :showEditModal="showEditModal"
            @closeEditParameterModal="onCloseEdit"
            :parameter="parameterId"
        />
        <DeleteParameterModal
            :showDeleteModal="showDeleteModal"
            @closeDeleteParameterModal="onCloseDelete"
            :parameter="parameterId"
        />
    </div>
</template>