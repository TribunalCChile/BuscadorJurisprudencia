<script>
    import axios from 'axios';
    import { CIcon } from '@coreui/icons-vue';
    import * as icon from '@coreui/icons';
    import DeleteFichaModal from '../../components/DeleteFichaModal.vue';
    import EditFichaStateModal from '../../components/EditFichaState.vue'; 

    import eyeIcon from '@/assets/icons/eye1.png';
    import EditFichaState from '../../components/EditFichaState.vue';
    import AddFichaModal from '../../components/AddFichaModal.vue'; 
    

    export default {
        name: 'Listar Fichas',
        components: {
            CIcon,
            DeleteFichaModal,
            EditFichaStateModal,
            AddFichaModal,
        },
        setup() {
            return {
                icon,
                eyeIcon
            }
            
        },
        
        data() {
            return {
                fichas: [],
                showDeleteModal: false,
                showChangeStateModal: false,
                showAddFichaModal: false,
                templateId: null,
                fichaId: null,
                currentPage: 1,
                totalPages: 1,
                sortBy: 'id',
                descending: false,
                rowsPerPage: 10,
                dataTypes: [],
                filteredStates: [],
                states: [
                    {
                        'id': 1,
                        'nombre': 'Ingresar'
                    },
                    {
                        'id': 2,
                        'nombre': 'Procesar'
                    },
                    {
                        'id': 3,
                        'nombre': 'Anular'
                    }
                ]
            }
        },

        mounted() {
            this.getFichas(); 
            this.getDataTypes(); 
        },
        computed: {
            sortedItems() {
                return this.fichas.data.slice().sort((a, b) => {
                    
                    return a.folio - b.folio;
                });
            }
        }, 
        

        methods: {
            getStates(ficha) {
                const fichaStateId = ficha.estado_id;
                
                if (fichaStateId === 2) {
                    return [this.states[2]]; 
                }
                return this.states.filter((state) => state.id !== fichaStateId);
                
                
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

                    /* this.dataTypes.forEach(dataType => {
                        this.dataTypeProps[dataType.id] = { tipo_dato: dataType };
                    });
                    console.log(this.dataTypeProps);  */
                    
                     

                } catch(error) {
                    console.log(error); 
                }
            }, 
           
            deleteFicha(ficha) {
                this.showDeleteModal = true; 
                this.fichaId = ficha; 
            },
            onCloseDelete() {
                this.showDeleteModal = false; 
                this.getFichas(); 
            },
            changeState(ficha) {
                this.showChangeStateModal = true;
                this.fichaId = ficha; 
                this.filteredStates = this.getStates(ficha); 
            },
            onCloseChangeState() {
                this.showChangeStateModal = false; 
                this.getFichas();
            },

            addFicha() {
                this.showAddFichaModal = true;
            },
            onCloseAddFicha() {
                this.showAddFichaModal = false; 
            },  
            getStateStr(state) {
                let stateStr = state == 1 ? 'Activo' : 'Inactivo'; 
                return stateStr; 
            },

            shortDateFormat(date) {
                let originalDate = new Date(date); 
                let formatedDate = originalDate.toLocaleDateString();
                return formatedDate; 
                
            },
            useFicha(ficha) {
                this.$store.commit("watchFicha", ficha); 
                this.$router.push({ 
                    name: 'Vista de Ficha', 
                    params: { 
                        fichaId: ficha.id 
                    }}
                );
            },

            editFicha(ficha) {
                console.log("en edit ficha:", ficha); 
                this.$store.commit("editFicha", ficha);
                this.$router.push({
                    name: 'Editar Ficha', 
                    params: { 
                        fichaId: ficha.id
                    }}
                );
                 
            },

            editTemplate(template) {
                this.$store.commit("createTemplate", template);
                this.$router.push({ 
                    name: 'EditTemplate', 
                    params: {
                        id: template.id
                    }
                });
            },
            deleteTemplate(template) {
                this.showDeleteModal = true; 
                this.templateId = template; 
            }, 
            onCloseDelete() {
                this.showDeleteModal = false; 
                this.getFichas(); 
            },

            async getFichas(page = 1) {
                try {
                    const response = await axios.get(
                        this.$store.state.backendUrl + '/ficha',
                        { 
                            params: {
                                page: page, // envía el número de página actual
                                rowsPerPage: this.rowsPerPage, 
                            },
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + this.$store.state.token,
                            }
                        }
                    );
                    console.log("RESPONSE FICHAS: ",response.data);
                    this.fichas = response.data; // actualiza los datos con los resultados paginados
                    console.log(this.fichas);
                    
                    this.currentPage = response.data.current_page;
                    this.totalPages = response.data.last_page;// Otros manejadores de datos si es necesario

                } catch (error) {
                    console.error('Error en la solicitud a la API:', error);
                }
            },
            prevPage() {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.getFichas(this.currentPage);
                }
            },
            nextPage() {
                if (this.currentPage < this.totalPages) {
                    this.currentPage++;
                    this.getFichas(this.currentPage);
                }
            },
            setBadgeColor(state) {
                switch(state) {
                    case 1:
                        return 'bg-secondary';
                    
                    case 2: 
                        return 'bg-success';
                    
                    case 3:
                        return 'bg-danger'; 
                }
              
            },
            setStateName(state) {
                switch(state) {
                    case 1:
                        return 'Ingresado';
                    
                    case 2: 
                        return 'Procesado';
                    
                    case 3:
                        return 'Anulado'; 
                }
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
                <h3 class="mt-2">Fichas</h3>
            </div>
    
        </CCol>
        <CCol class="col-xl-3">
            <CButton color="success"  class="mt-2 text-white" @click="addFicha">
                <CIcon :icon="icon.cilPlus" size="lg"/>
                Ficha
            </CButton>
        </CCol>
    </CRow>
    
    <CTable class="mt-5">
        <CTableHead color="dark">
            <CTableRow>
                <CTableHeaderCell scope="col" class="text-center">Rol</CTableHeaderCell>
                <CTableHeaderCell scope="col" class="text-center">Nombre Template</CTableHeaderCell>
                
                <CTableHeaderCell scope="col" class="text-center">Fecha de resolución</CTableHeaderCell>
                <CTableHeaderCell scope="col" class="text-center">Estado</CTableHeaderCell>
                <CTableHeaderCell scope="col" class="text-center">Acciones</CTableHeaderCell>
            </CTableRow>
        </CTableHead>
        <CTableBody>
            <CTableRow v-for="ficha in fichas.data" :key="ficha.id">
                <CTableDataCell class="text-center">{{ ficha.folio }}</CTableDataCell>
                <CTableDataCell class="text-center">{{ ficha.nombre }}</CTableDataCell>
                <CTableDataCell class="text-center">{{ shortDateFormat(ficha.fecha_sentencia) }}</CTableDataCell>
               
                <CTableDataCell class="text-center">
                    <CBadge v-bind:class="setBadgeColor(ficha.estado_id)">{{ setStateName(ficha.estado_id) }}</CBadge>
                </CTableDataCell> 
                <CTableDataCell class="text-center">
                    <CButton @click="useFicha(ficha)"
                        v-c-tooltip="{
                            content: 'Ver contenido de ficha', 
                            placement: 'top'
                        }"
                    >
                        <CIcon :icon="icon.cilFindInPage" size="xl"/>
                    </CButton>
                    <CButton @click="editFicha(ficha)"
                        v-c-tooltip="{
                            content: 'Editar contenido de ficha', 
                            placement: 'top'
                        }"
                    >
                        <CIcon :icon="icon.cilPencil" size="xl"/>
                    </CButton>
                    <CButton @click="deleteFicha(ficha)"
                        v-c-tooltip="{
                            content: 'Eliminar ficha', 
                            placement: 'top'
                        }"
                    >
                        <CIcon :icon="icon.cilTrash" size="xl"/>
                    </CButton>
                    <CButton @click="changeState(ficha)"
                        v-c-tooltip="{
                            content: 'Cambiar estado de ficha', 
                            placement: 'top'
                        }"
                    >
                        <CIcon :icon="icon.cilToggleOn" size="xl"/>
                    </CButton>
                </CTableDataCell>
            </CTableRow>
        </CTableBody>
    </CTable>

    <DeleteFichaModal
        :showDeleteModal="showDeleteModal"
        @closeDeleteFichaModal="onCloseDelete"
        :ficha="fichaId"
    />
    <EditFichaStateModal 
        :showModal="showChangeStateModal"
        @closeChangeStateFicha="onCloseChangeState"
        :ficha="fichaId"
        :states="filteredStates"
    />

    <AddFichaModal 
        :showModal="showAddFichaModal"
        @closeAddFicha="onCloseAddFicha"
    />
    
    <!-- <DeleteTemplateModal
            :showDeleteModal="showDeleteModal"
            @closeDeleteTemplateModal="onCloseDelete"
            :template="templateId"
    /> -->
    <!-- Paginación (Convertirla en componente luego) -->
    <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
            <li class="page-item" v-bind:class="{'disabled': currentPage === 1}" @click="prevPage">
                <a class="page-link" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li class="page-item" v-for="page in fichas.last_page" :key="page" @click="getFichas(page)">
                <a class="page-link" >{{ page }}</a>
            </li>
            <li class="page-item" @click="nextPage" v-bind:class="{'disabled': currentPage === totalPages}">
                <a class="page-link" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav> 
    

    
</template>