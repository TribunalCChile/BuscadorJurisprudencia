<script>
    import axios from 'axios';
    import { CIcon } from '@coreui/icons-vue';
    import * as icon from '@coreui/icons';
    import DeleteTemplateModal from '../../components/DeleteTemplateModal.vue';
    import SearchBarFilter from '../../components/SearchBarFilter.vue';

    export default {
        name: 'Listar Templates',
        
        setup() {
            return {
                icon
            }
            
        },
        components: {
            CIcon,
            DeleteTemplateModal,
            SearchBarFilter
        },
        data() {
            return {
                templates: [],
                showDeleteModal: false,
                templateId: null,
                searchFilter: '',
            }
        },

        mounted() {
            this.getTemplates(); 
        },
        
        computed: {
            filteredTemplates() {
                let filterTemplates = this.templates; 

                if (this.searchFilter !== '') {
                    filterTemplates = filterTemplates.filter(template => 
                        template.nombre.toLowerCase().includes(this.searchFilter.toLowerCase())
                    );
                }

                return filterTemplates; 
            }
        },

        methods: {
            handleSearch(search) {
                this.searchFilter = search; 
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
            useTemplate(template) {
                this.$store.commit("createTemplate", template);
                this.$router.push({
                    name: 'Crear Ficha', 
                    params: { 
                        idTemplate: template.id 
                    }}
                );
            },

            editTemplate(template) {
                this.$store.commit("createTemplate", template);
                this.$router.push({ 
                    name: 'Editar Template', 
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
                this.getTemplates(); 
            },

            async getTemplates() {
                try {
                    const response = await axios.get(
                        this.$store.state.backendUrl + '/template',
                        { 
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + this.$store.state.token,
                            }
                        }
                    );
                    
                    this.templates = response.data;
                    console.log(this.templates);
                    
                } catch (error) {
                    console.error('Error en la solicitud a la API:', error);
                    this.failMsg = 'Error al obtener templates.'; 
                    this.fail = true;
                }
            }
        }
    }
    
</script>

<template>
    
    <div class="mt-2 mb-4">
        <SearchBarFilter @search="handleSearch" placeholder="Buscar template..." />
    
    </div>
    <CRow>
        <CCol sm="4"  v-for="template in filteredTemplates" :key="template.id" class="mt-3">
        <CContainer>
            <CCard class="text-center">
                <CCardHeader> <b>{{ template.nombre }}</b></CCardHeader>
                <CCardBody>
                    <CListGroup flush class="mb-3">
                        <CListGroupItem>Estado: {{  getStateStr(template.estado) }}</CListGroupItem>
                    </CListGroup>
                    <CButton color="primary"  class="mx-1" @click="useTemplate(template)">Usar</CButton>
                    <CButton color="info" variant="outline" class="mx-1"  @click="editTemplate(template)" >
                        <!-- <CIcon :icon="icon.cilColorBorder" size="md"/>  -->
                        Editar
                    </CButton>
                    <CButton color="danger" class="mx-1" @click="deleteTemplate(template)">
                        <CIcon :icon="icon.cilTrash" size="lg" class="text-white" />
                    </CButton>
                    
                    
                </CCardBody>
                <CCardFooter class="text-body-secondary">Fecha de ingreso: <span class="badge bg-secondary">{{ shortDateFormat(template.fecha_ingreso) }}</span></CCardFooter>
            </CCard>
        </CContainer>
        </CCol>
    </CRow>
    <DeleteTemplateModal
            :showDeleteModal="showDeleteModal"
            @closeDeleteTemplateModal="onCloseDelete"
            :template="templateId"
    />
    
    
</template>