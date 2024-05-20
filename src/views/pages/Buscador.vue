<template>
    <CImage align="center" custom-class-name="sidebar-brand-full" :src="logoTC" rounded  width="180" class="mt-1"/>
    <h3 class="text-center font-title">Buscador de Jurisprudencia</h3>
    <div class="d-flex align-items-center">
                <div class="flex-grow-1 mr-5 mt-4">
                    <SearchBarFilter 
                        @search="handleSearch"  
                        placeholder="Buscar por causas"    
                    />
                </div>
                
                <div class="mt-4">
                    <button 
                        class="btn btn-success rounded-search-button" 
                        @click="searchContent"
                        v-bind:class="{'disabled': searchFilter === ''}"
                       
                    >
                        <CIcon :icon="icon.cilSearch" size="lg" class="text-white"/>
                    </button>
                </div>
                
            </div>
   <!--  <CCard class="mt-4">
        <CCardBody>
            
        </CCardBody>
    </CCard> -->
    
    <CCard class="mt-4">
        
        <CCardBody>
            <template v-if="loading">
                        <div class="d-flex justify-content-center mt-5" style="height: 100vh;">
                            <div class="spinner-grow text-success" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    
            </template>
            <template v-else>
                <CRow>
                <!-- Filtros -->
                <CCol class="col-xl-3">
                    <h5>Filtros <CIcon :icon="icon.cilFilter" size="lg"  /></h5>
                    <div>
                        <div class="flex-grow-1 mr-5">
                            <SearchBarFilter 
                                @search="handleSearchParameters"
                                placeholder="Buscar por parámetro"
                            />
                        </div>
                        <div class="mt-3">
                            <div
                                v-for="parameter in filteredParameters" 
                                :key="parameter.id"
                                class="d-flex align-items-center mb-2"
                            >
                                <div>
                                    <CFormCheck 
                                        :id="'flexCheckDefault_' + parameter.id"  
                                        :label="parameter.nombre"
                                        :checked="isChecked(parameter.id)"
                                        @change="updateChecked(parameter.id)"
                                    />
                                </div>
                                <div>
                                    <CBadge color="secondary">{{ parameter.count }}</CBadge>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </CCol>
                <!-- Fin filtros -->
                
                <!-- Contenido de la respuesta -->
                <CCol class="col-xl-9 ml-4">
                    <CRow>
                        <CCol class="col-lg-6"><h5>Resultados</h5></CCol>
                        <CCol></CCol>
                        <CCol></CCol>
                        <CCol><h6 class="">{{ resultsQuantity }} registros</h6></CCol>
                    </CRow>
                    
                    
                    <template v-if="results.length">
                        <CCard class="clickable mt-2" v-for="result in filteredResults" :key="result.id">
                            <CCardBody>
                                <CCardTitle as="h6">Causa N° {{ result.folio }}</CCardTitle>
                                <CCardSubtitle class="mb-2 text-body-secondary">Fecha ingreso: {{ result.fecha_ingreso }}</CCardSubtitle>
                                <template v-for="detail,index in result.detalle" :key="index">
                                   <CCardSubtitle class="mb-2 text-body-secondary text-justify">
                                        <!-- {{ highlightText(detail.parametro.nombre, searchFilter) }}: {{ highlightText(detail.valor, searchFilter) }} -->
                                        <div v-if="detail.valor !== null">
                                            <p class="text-justify">{{ detail.parametro.nombre }}: {{ resumeText(detail.valor) }}</p>
                                        </div>
                                        <div v-else>
                                            <p class="text-justify">{{ detail.parametro.nombre }}: {{ showMultipleDetail(detail.detalle_multiple) }}</p>
                                        </div>
                                        
                                    </CCardSubtitle> 
                                </template>
                                
                                <CCardLink href="#" @click="seeFichaModal(result)">Ver ficha</CCardLink>
                            </CCardBody>
                        </CCard>
                    </template>
                    <!-- <template v-else>
                        <h4 class="text-center mt-4">No se encontraron coincidencias.</h4>
                    </template> -->
                </CCol>
                <!-- Fin contenido -->
                </CRow>
            </template>
            
            
            
            
        </CCardBody>
        
    </CCard>
    <ShowFichaBuscador 
        :showModal="showModalFichaBuscador"
        @closeShowFicha="onCloseShowFicha"
        :ficha="fichaId"
    />
</template>

<script>
    import axios from 'axios'; 
    import { CIcon } from '@coreui/icons-vue';
    import * as icon from '@coreui/icons';
    import SearchBarFilter from '../../components/SearchBarFilter.vue';
    import ShowFichaBuscador from '../../components/ShowFichaBuscador.vue'
    import  logoTC  from '@/assets/brand/logoverde.jpg'

    import { toValue } from 'vue';
    export default {
        name: 'Buscador',
        setup() {
            return {
                icon,
                logoTC
            }
        },
        components: {
            CIcon,
            SearchBarFilter,
            ShowFichaBuscador
        },
        data() {
            return {
                parameters: [],
                searchFilter: '',
                searchParameterFilter: '',
                results: [],
                loading: false,
                parameterList: [], // Lista de parametros obtenidos de cada ficha, sin repetir. 
                checkedValues: [],
                showModalFichaBuscador: false,
                fichaId: null,
                resultsQuantity: 0
            }
        },
        computed: {
            filteredParameters() {
                let filterParameters = this.parameterList; 

                if (this.searchParameterFilter !== '') {
                    filterParameters = filterParameters.filter(parameter => 
                        parameter.nombre.toLowerCase().includes(this.searchParameterFilter.toLowerCase())
                    );
                }

                return filterParameters; 
            },

            filteredResults() {
                let filterResults = this.results; 
                
                if (this.checkedValues.length) {
                    filterResults = filterResults.filter(result => 
                        result.detalle.some(elem => this.checkedValues.includes(elem.parametro.id))
                    )
                }
                console.log(filterResults); 
                this.resultsQuantity = filterResults.length; 
                return filterResults;
            }
        },
        methods: {
            /* highlightText(text) {
                let keyword = this.searchFilter; 
                console.log("TEXT: ", text); 
                console.log("Keyword: ", this.searchFilter); 
                if(!keyword) return text; 
                const regex = new RegExp(keyword, 'gi'); 
                return text.replace(regex, match => `<span style="background-color: yellow">${match}</span>`); 
            }, */
            seeFichaModal(ficha) {
                this.showModalFichaBuscador = true;
                this.fichaId = ficha; 
            },
            onCloseShowFicha() {
                this.showModalFichaBuscador = false; 
            },
            showMultipleDetail(details) {
                let joinedDetails = []; 
                details.forEach((detail, index) => {
                    joinedDetails.push(detail.valor);                     
                })
                
                joinedDetails = joinedDetails.join(', '); 
                return joinedDetails; 
            },
            resumeText(text) {
                let maxLength = 500;
                if (!text) return; 

                let paragraphs = text.split('.');
                let truncatedText = ""; 
                for (const paragraph of paragraphs) {
                    if ((truncatedText.length + paragraph.length + 2) > maxLength) { 
                        break;
                    } 
                    truncatedText += paragraph + '.\n'; 
                }     

                return truncatedText.trim(); 
            },
            isChecked(id) {
                return this.checkedValues.includes(id); 
            },

            updateChecked(id) {
                const index = this.checkedValues.indexOf(id);
                if (index === -1) {
                    this.checkedValues.push(id);
                } else {
                    this.checkedValues.splice(index, 1);
                }
                
            
            },
            handleSearch(search) {
                this.searchFilter = search; 
            },
            handleSearchParameters(search) {
                this.searchParameterFilter = search; 
            },

            async searchContent() {
                this.results = [];
                this.parameterList = []; 
                this.loading = true;
                setTimeout(() => {
                    this.loading = false; 
                }, 1000); 
                const response = await axios.get(
                    this.$store.state.backendUrl + '/ficha', 
                    {
                        params: {
                            'filter': JSON.stringify({ "search": this.searchFilter }) 
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + this.$store.state.token,
                        }
                    }
                );
                this.results = response.data; 
                
                console.log(this.results); 
                this.getParameters(); 
            },

            avoidDuplicates() {
                const mapFromParameters = new Map(
                    this.parameterList.map(p => [p.id, p])
                );
                return [...mapFromParameters.values()]; 
            }, 

            countRepeatedParameters(parameters) {
                    const counter = {};

                    parameters.forEach(parameter => {
                        const id = parameter.id;
                        counter[id] = (counter[id] || 0) + 1;
                    });

                    return counter;
            },
            async getParameters() {
                /* 
                    Se obtienen los parámetros obtenidos de 
                    cada ficha y se almacenan en el arreglo
                    parameterList 
                */
                              
                /* const counter = {}; 
                
                 */
                this.results.forEach(result => {
                    result.detalle.forEach(parameter => {
                        this.parameterList.push(
                            parameter.parametro
                        ); 
                    })
                    
                })

                const parameterCounter = this.countRepeatedParameters(this.parameterList);
                console.log(this.parameterList)
                
                this.parameterList.forEach(parameter => {
                    parameter['count'] = parameterCounter[parameter.id]; 
                })
                
                this.parameterList = this.avoidDuplicates(this.parameterList);

            }
        }


    }
</script>

<style>
    .clickable {
        cursor: pointer;
        
    }
    .font-title {
        font-family: "Montserrat", sans-serif;
        font-optical-sizing: auto;
        font-weight: 600; 
        font-style: normal;
    }
    .rounded-search-button {
        border-radius: 50px; /* Borde redondeado */
        padding: 10px 20px; /* Ajusta el padding */
        border: none; /* Quita el borde predeterminado */
        box-shadow: 0 1px 4px rgba(32, 33, 36, 0.28); /* Sombra similar a la barra de búsqueda */
        transition: box-shadow 0.3s ease-in-out; /* Suaviza el cambio de sombra */
        }

        .rounded-search-button:focus {
        box-shadow: 0 1px 6px rgba(32, 33, 36, 0.48); /* Sombra más intensa al enfocar */
        }

        .rounded-search-button.disabled {
        background-color: #cccccc; /* Color de fondo para estado deshabilitado */
        cursor: not-allowed; /* Cambia el cursor para indicar que está deshabilitado */
    }
</style>