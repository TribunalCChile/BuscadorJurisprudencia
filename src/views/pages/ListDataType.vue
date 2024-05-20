<script>
    import axios from 'axios'; 
    import { CIcon } from '@coreui/icons-vue';
    import * as icon from '@coreui/icons';
    import AddDataTypeModal from '../../components/AddDataTypeModal.vue';
    import EditDataTypeModal from '../../components/EditDataTypeModal.vue';
    import DeleteDataTypeModal from '../../components/DeleteDataTypeModal.vue';
    import DataTypeContent from '../../components/DataTypeContent.vue';

    export default {
        name: 'Listar Tipos de Datos',
        
        components: {
            CIcon,
            AddDataTypeModal,
            EditDataTypeModal,
            DeleteDataTypeModal,
            DataTypeContent
            
        },
        setup() {
            return {
                icon
            } 
        }, 
        data() {
            return {
                dataTypeList: [],
                dataTypeContent: [],
                showAddModal: false,
                showDeleteModal: false,
                showEditModal: false,
                showDetailsTable: false,
                datatypeId: null,
                detailId: null,
                selectedRow: null
            } 
        },
        mounted() {
            this.getDataTypes(); 
        },
        methods: {
            updateDataType() {
                this.getDataTypes(); 
                this.selectedRow = null; 
            },
            async getDataTypeContent() {
                try {
                    const response = await axios.get(
                        this.$store.state.backendUrl + '/tipodatocontenido',
                        { 
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + this.$store.state.token,
                            }
                        }
                    );
                    
                    this.dataTypeContent = response.data;
                    
                    
                } catch (error) {
                    console.error('Error en la solicitud a la API:', error);
                    this.failMsg = 'Error al obtener templates.'; 
                    this.fail = true;
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
                    
                    this.dataTypeList = response.data;
                    console.log(this.dataTypeList);
                    
                } catch (error) {
                    console.error('Error en la solicitud a la API:', error);
                    this.failMsg = 'Error al obtener templates.'; 
                    this.fail = true;
                }
            },

            onCloseAdd() {
                this.showAddModal = false;
                this.getDataTypes(); 
            },
            onCloseEdit() {
                this.showEditModal = false;
                this.getDataTypes(); 
            },
            onCloseDelete() {
                this.showDeleteModal = false;
                this.getDataTypes();            
            },
            addDataType() {
                this.showAddModal = true; 
            },
            editDataType(datatype) {
                this.showEditModal = true;
                this.datatypeId = datatype; 
            },
            deleteDataType(datatype) {
                this.showDeleteModal = true; 
                this.datatypeId = datatype; 
            },
            watchDataTypeContent(datatype, index) {
                this.showDetailsTable = true; 
                this.detailId = datatype;
                console.log(this.detailId); 
                if (this.selectedRow === index) {
                    // Si se hace clic en la misma fila, cierra la tabla
                    this.selectedRow = null;
                } else {
                    // Si se hace clic en una nueva fila, abre la tabla de esa fila
                    this.selectedRow = index;
                }
     
            }
        }



    }
    
</script>

<template>
    <div class="text-center">
        <h3>Tipos de datos</h3>
    </div>
        
    
    <CRow>
        <CCol class="col-xl-6 col-sm-12">
        <CTable class="mt-5">
            <CTableHead color="dark">
                <CTableRow>
                <CTableHeaderCell scope="col">Tabla de tipo de datos</CTableHeaderCell>
                <CTableHeaderCell scope="col"></CTableHeaderCell>
                <CTableHeaderCell scope="col" class="text-center">
                    <CButton @click="addDataType" color="primary" class="mr-4">
                    Agregar
                
                    </CButton>
                </CTableHeaderCell>
                </CTableRow>
                <CTableRow color="dark">
                    <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                    <CTableHeaderCell scope="col" class="text-center">Estado</CTableHeaderCell>
                    <CTableHeaderCell scope="col" class="text-center">Acciones</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
                <CTableRow v-for="(datatype, index) in dataTypeList" :key="datatype.id">
                    <CTableDataCell>{{ datatype.nombre }} </CTableDataCell>
                    <CTableDataCell class="text-center">
                        <CFormCheck class="text-center" :checked="datatype.estado" disabled color="success" />
                    </CTableDataCell>
                    <CTableDataCell class="text-center">
                        <CButton @click="editDataType(datatype)"
                            v-c-tooltip="{
                                content: 'Editar este tipo de dato', 
                                placement: 'top'
                            }"
                        >
                            <CIcon :icon="icon.cilPen" size="xl"/>
                        </CButton>
                        <CButton @click="deleteDataType(datatype)"
                            v-c-tooltip="{
                                content: 'Eliminar este tipo de dato', 
                                placement: 'top'
                            }"
                        >
                            <CIcon :icon="icon.cilTrash" size="xl"/>
                        </CButton>
                        
                        <CButton 
                            @click="watchDataTypeContent(datatype, index)"
                            v-c-tooltip="{
                                content: 'Ver y editar contenido de este este tipo de dato', 
                                placement: 'top'
                            }"
                        >
                            <!-- <CIcon :icon="icon.cilFindInPage" size="xl"/> -->
                            <CIcon :icon="icon.cilChevronDoubleRight" size="xl" />
                        </CButton>
                    </CTableDataCell>
                    
                </CTableRow>
            </CTableBody>
        </CTable>
        
        <AddDataTypeModal
            :showAddModal="showAddModal"
            @closeAddModal="onCloseAdd"
        />
        <EditDataTypeModal
            :showEditModal="showEditModal"
            @closeEditModal="onCloseEdit"
            :datatype="datatypeId"
        />
        <DeleteDataTypeModal
            :showDeleteModal="showDeleteModal"
            @closeDeleteModal="onCloseDelete"
            :datatype="datatypeId"
        /> 
        </CCol>
        <CCol class="col-xl-6 col-sm-12 mt-5"
            v-if="selectedRow !== null"
        >
            <DataTypeContent 
                :detail="detailId"
                @updateDataType="updateDataType"
            />
        </CCol>
    </CRow>
   
    
</template>

<style>
    header-table-color {
        background-color: #323a49; 
    }
</style>