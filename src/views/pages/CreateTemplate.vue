<template>
    <!-- <FichaCreateFlow /> -->
    <div class="mt-3 mb-3">
        <SearchBarFilter @search="handleSearch" placeholder="Buscar parámetro..." />
    
    </div>
    <!-- <CCard class="mt-4">
        <CCardBody>
           
        </CCardBody>
    </CCard> -->
    <CRow>
        <CCol>
            <CCard class="mt-3">
                <CCardHeader>
                    <CCardTitle class="d-flex justify-content-between align-items-center">
                        Lista de parámetros
                        <CButton 
                            color="success"
                            class="text-white"
                            @click="createParameter"
                        >
                        <CIcon :icon="icon.cilPlus" size="lg"/>
                            Crear parámetro
                        </CButton>
                    </CCardTitle>
                </CCardHeader>
                <CCardBody>
                    
                    <CListGroup flush class="">
                        <CListGroupItem 
                            v-for="parameter, index in filteredParameters" 
                            :key="parameter.id" 
                            class="d-flex justify-content-between align-items-center"
                        >
                            {{ parameter.nombre }}

                            <div>
                                <CButton 
                                    @click="editParameter(parameter, index)"
                                >
                                    <CIcon 
                                        :icon="icon.cilPen" 
                                        size="lg" 
                                        :class="{'text-success': isHoverEditIndex === index}"
                                        @mouseover="isHoverEditIndex = index"
                                        @mouseleave="isHoverEditIndex = null"
                                    />
                                </CButton>
                                <CButton 
                                    @click="addParameter(parameter, index)"
                                    v-model="addButtons[index]"
                                    v-bind:class="{ 'disabled': addButtons[parameter.id] }"
                                    class="pl-3"
                                    
                                >
                                    <CIcon 
                                        :icon="icon.cilPlus" 
                                        size="lg" 
                                        :class="{'text-success': isHoverAddIndex === index}"
                                        @mouseover="isHoverAddIndex = index"
                                        @mouseleave="isHoverAddIndex = null"
                                    />
                                </CButton>
                            </div>
                        </CListGroupItem>
                    </CListGroup>
                </CCardBody>
                
            </CCard>
        </CCol>
        <CCol >
            
            <CCard class="mt-3">
                <CAlert color="danger" :visible="fail" dismissible @close="() => { fail = false }">
                    {{ failMsg }}
                </CAlert>
                <CCardHeader >
                    <CCardTitle class="d-flex justify-content-between align-items-center">
                        Parámetros seleccionados
                        <CButton 
                            color="success"
                            class="text-white"
                            @click="createFicha"
                        >
                            <CIcon :icon="icon.cilSave" size="lg"/>
                            Crear Template
                        </CButton>
                    </CCardTitle>
                    <!-- <div class="d-flex justify-content-end">
                        <CButton 
                            color="dark"
                            class="custom-button"
                        >
                            Crear Ficha
                        </CButton>
                    </div> -->
                </CCardHeader>
                <CCardBody>
                    <CListGroup flush>
                    <VueDraggable 
                        v-model="selectedParameters"
                        animation="150"
                        ghostClass="ghost"
                        
                    >
                        
                            <CListGroupItem 
                                v-for="parameter, index in selectedParameters" 
                                :key="parameter.id"
                                class="d-flex justify-content-between align-items-center"
                            >
                                {{ parameter.nombre }}

                                <div class="d-flex">
                                    
                                    <CButton 
                                    @click="removeParameter(parameter)"
                                     
                                    variant="outline"

                                
                                ><CIcon 
                                    :icon="icon.cilTrash" 
                                    size="lg"
                                    :class="{'text-danger': isHoverDeleteIndex === index}"
                                    @mouseover="isHoverDeleteIndex = index"
                                    @mouseleave="isHoverDeleteIndex = null"
                                    
                                    />
                                    </CButton>
                                </div>
                                
                            </CListGroupItem>
                        </VueDraggable>
                        </CListGroup>
                    
                    
                    
                    
                </CCardBody>
               
                
            </CCard>
        </CCol>
        
    </CRow>
    
    <AddParameterModal 
        :showModal="showAddParameterModal"
        @closeAddParameterModal="onCloseAdd"
    />

    <EditParameterModal
        :showEditModal="showEditParameterModal"
        @closeEditParameterModal="onCloseEdit"
        :parameter="parameterId"
    />
    
    <AddTemplateModal 
        :showModal="showAddTemplateModal"
        :selectedParameters="selectedParameters"
        @closeAddTemplateModal="onCloseAddTemplate"
        :crudOperation=1
        
    />    
</template>

<script>
    import axios from 'axios';
    import { CIcon } from '@coreui/icons-vue';
    import * as icon from '@coreui/icons';
    import SearchBarFilter from '../../components/SearchBarFilter.vue';
    import CounterPreceptoLegal from '../../components/CounterPreceptoLegal.vue';
    import AddParameterModal from '../../components/AddParameterModal.vue';
    import AddTemplateModal from '../../components/AddTemplateModal.vue';
    import EditParameterModal from '../../components/EditParameterModal.vue';
    import FichaCreateFlow from '../../components/FichaCreateFlow.vue'; 
    import { reactive } from 'vue';
    import { VueDraggable } from 'vue-draggable-plus';


    export default {
        name: 'Crear Template',
        components: {
            CIcon,
            SearchBarFilter,
            AddParameterModal,
            AddTemplateModal,
            VueDraggable,
            EditParameterModal,
            FichaCreateFlow,
            CounterPreceptoLegal
        },
        data() {
            return {
                param: null,
                parameters: [],
                selectedParameters: [], // objeto de parametros seleccionados completo (para mostrar info?)
                addButtons: reactive({}),
                fail: false,
                failMsg: '',
                searchFilter: '',
                showAddTemplateModal: false,
                showAddParameterModal: false,
                showEditParameterModal: false,
                parameterId: null, // Objeto del parametro a editar para enviarlo como prop
                isHoverEditIndex: false,
                isHoverAddIndex: false, 
                isHoverDeleteIndex: false,
                parameterCounters: {},
                
            }
        },
        setup() {
            return {
                icon,
            }
        },
        mounted() {
            this.getParameters();
            
        },
        computed: {
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
            handleCounterPrecepto(counterData) {
                const { counter, parameterId } = counterData;
                this.parameterCounters[parameterId] = counter;
                console.log(this.parameterCounters); 
                
            },
            editParameter(parameter, index) {
                this.showEditParameterModal = true; 
                this.parameterId = parameter; 
            },
            setPriorityParameters(parameters) {
                parameters.forEach((parameter, index) => {
                    parameter['prioridad'] = index + 1; 
                })

                return parameters; 
                
            },
            createFicha() {
                this.selectedParameters = this.setPriorityParameters(this.selectedParameters);  
                this.showAddTemplateModal = true; 
                
                //this.$store.commit("createTemplate", this.selectedParameters); 
                //this.$router.push({ path: '/crear-ficha' }); 
            },
            
            createParameter() {
                this.showAddParameterModal = true; 
            },
            handleSearch(search) {
                this.searchFilter = search; 
            },
            addParameter(parameter, index) {
                this.selectedParameters.push(parameter);
                this.addButtons[parameter.id] = true; 
            },
            removeParameter(parameter) {
                this.isHoverDeleteIndex = null; 
                this.selectedParameters =  this.selectedParameters.filter(param => param.id !== parameter.id);
                
                this.addButtons[parameter.id] = false; 
                
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

                    // se realiza un relleno de false para validar que los botones se utilizaron
                    // un botón (true = > inhabilitado) por cada parámetro 
                    this.parameters.forEach(parameter => {
                        this.addButtons[parameter.id] = false;
                    });
                    
                } catch (error) {
                    console.error('Error en la solicitud a la API:', error);
                    this.failMsg = 'Error al obtener parámetros.'; 
                    this.fail = true;
                        
                        // this.errorMsg = "Ha ocurrido un error: " + error;
                }
            },
            onCloseAdd() {
                this.showAddParameterModal = false; 
                this.getParameters();
            },
            onCloseAddTemplate() {
                this.showAddTemplateModal = false; 
                
            },
            onCloseEdit() {
                this.showEditParameterModal = false; 
                this.getParameters(); 
            }
        }

        
    }
</script>