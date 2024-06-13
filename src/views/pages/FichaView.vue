<script>
    import { CIcon } from '@coreui/icons-vue';
    import * as icon from '@coreui/icons';
    import * as XLSX from 'xlsx';
    import { jsPDF } from "jspdf";
    import FichaCreateFlow from '../../components/FichaCreateFlow.vue';
    
    //import pdfMake from 'pdfmake/build/pdfmake';
    //import pdfFonts from 'pdfmake/build/vfs_fonts';
    //pdfMake.vfs = pdfFonts.pdfMake.vfs;

    export default {
        nombre: 'Vista de Ficha',
        components: {
            CIcon,
            FichaCreateFlow 
        },
        setup() {
            return {
                icon
            }
            
        }, 
        /* En el proceso de modificar un template y eliminar campos 
        que existen en fichas con el template no actualizado se producen
        errores de renderización. Se renderiza la vista de la ficha con la variable 
        updatedFicha, que obtendrá la data de los campos actualizados prescindiendo 
        de los campos eliminados que existían en la ficha antigua. */ 
        data() {
            return {
                fichas: this.$store.state.ficha,
                updatedFicha: null
            }
        },
        created() {
            this.validateFichaStructure(); 
        },
        mounted() {
            console.log(this.fichas);
            console.log("ruta: ", this.$route.path.split('/')[1])
            //this.sortedItems();  
        },
        computed: {
             
            sortedItems() {
                const sortedDetail = this.updatedFicha.slice().sort((a, b) => {   
                    const actTemplateA = this.getActualTemplate(a.parametro.template);  
                    const actTemplateB = this.getActualTemplate(b.parametro.template);  

                    return actTemplateA.pivot.prioridad - actTemplateB.pivot.prioridad; 
                });
                /* const sortedDetail = this.fichas.detalle.slice().sort((a, b) => {   
                    const actTemplateA = this.getActualTemplate(a.parametro.template);  
                    const actTemplateB = this.getActualTemplate(b.parametro.template);  

                    return actTemplateA.pivot.prioridad - actTemplateB.pivot.prioridad; 
                }); */

                return sortedDetail; 
            },
        },  
        methods: {
            validateFichaStructure() { 
                this.updatedFicha = this.fichas.detalle.filter(
                    detail => this.getActualTemplate(detail.parametro.template) !== undefined
                )
            },
            getActualTemplate(template) {
                const templateId = this.fichas.template_id; 
                return template.find(elem => elem.id === templateId); 
                
            },
           
            shortDateFormat(date) {
                let originalDate = new Date(date); 
                let formatedDate = originalDate.toLocaleDateString();
                return formatedDate; 
                
            },
            exportToPDF(ficha) {
                console.log("en export: ", ficha);
                const detailFicha = ficha.detalle;
                const requirente = detailFicha

                var docDefinition = {
                    content: [
                        {text: 'Causa de ejemplo', style: 'subheader'},
                        `Causa Rol N° ${ficha.folio}`,
                        {
                            style: 'tableExample',
                            color: '#444',
                            table: {
                                widths: [200, 'auto', 'auto','auto'],
                                headerRows: 2,
                                // keepWithHeaderRows: 1,
                                body: [
                                    [{text: `Sentencia causa rol N° ${ficha.folio}`, style: 'tableHeader', colSpan: 4}, {}, {}, {}],
                                    [
                                            { text: 'Requirente', style: 'tableHeader', alignment: 'center', colSpan: 1 },
                                            { text: 'Valor 1', style: 'tableHeader', alignment: 'center', colSpan: 1 },
                                            { text: 'Fecha de ingreso', style: 'tableHeader', alignment: 'center', colSpan: 1 },
                                            {text: `${ficha.fecha_ingreso}`, style: 'tableHeader', alignment: 'center', colSpan: 1}
                                    ],
                                    [
                                            { text: 'Cabecera 1', style: 'tableHeader', alignment: 'center', colSpan: 2 },
                                            {},
                                            { text: 'Valor 1', colSpan: 2 },
                                            {},
                                    ],
                                    /* ['Sample value 1', 'Sample value 2', '',''],
                                    [{rowSpan: 3, text: 'rowSpan set to 3\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor'}, 'Sample value 2', 'Sample value 3', ''],
                                    ['', 'Sample value 2', 'Sample value 3', ''],
                                    ['Sample value 1', 'Sample value 2', 'Sample value 3', ''],
                                    ['Sample value 1', {colSpan: 2, rowSpan: 2, text: 'Both:\nrowSpan and colSpan\ncan be defined at the same time'}, ''],
                                    ['Sample value 1', '', ''],  */
                                ]
                            }
		                },
                    ]
                };

                detailFicha.forEach(detail => {
                    if (detail.tipo === 1) {
                        const row = [
                            { text: `${detail.parametro.nombre}`, style: 'tableHeader', alignment: 'center', colSpan: 2 },
                            {},
                            { text: `${detail.valor}`, colSpan: 2 },
                            {},
                        ]
                    } else if (detail.tipo === 3) {
                        const row = [
                            { text: `${detail.parametro.nombre}`, style: 'tableHeader', alignment: 'center', colSpan: 2 },
                            {},
                            { text: `${detail.valor}`, colSpan: 2 },
                            {},
                        ]
                    }
                    
                })
                // Generar el documento PDF
                var pdfDocGenerator = pdfMake.createPdf(docDefinition);

                // Descargar el documento PDF
                pdfDocGenerator.download('mi_documento.pdf'); 
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

            backToFichas() {
                this.$router.push({ 
                    name: 'Listar Fichas', 
                });
            }
        },
        

    }
</script>

<template>
    <FichaCreateFlow />
    <CCard>

        <CCardHeader class="d-flex">
            <div>
                <CButton
                    @click="backToFichas"
                    color="link"
                    v-c-tooltip="{content: 'Volver a fichas', placement: 'top'}"
                >
                    <CIcon :icon="icon.cilArrowLeft" size="lg" class=""/>
                    
                    
                </CButton>
            </div>
            <div class="mt-1">Ficha: <b>{{ fichas.nombre }}</b></div>
            
            
            
            <CBadge 
                v-bind:class="setBadgeColor(fichas.estado)"
                style="margin-left: 0.7rem;"
                >{{ setStateName(fichas.estado) }}
            </CBadge>
        </CCardHeader>
        <CCardBody>
            <CRow class="align-items-center">
                <CCol>
                    <CCardTitle>
                        {{ fichas.nombre }}
                        <!-- <CButton 
                            color="primary" 
                            class="mx-3" 
                            @click="exportToPDF(fichas)"
                            v-c-tooltip="{
                                content: 'Descargar ficha en formato PDF', 
                                placement: 'top'
                            }"
                        > 
                            <CIcon  :icon="icon.cilDataTransferDown" size="md"/>
                        </CButton>-->
                    </CCardTitle>
                </CCol>
                
                
            </CRow>
            
            <CTable class="mt-4" ref="table">
                <CTableHead color="dark">
                    <CTableRow>
                        <CTableHeaderCell scope="col">Parámetro</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Valor</CTableHeaderCell>
                        
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    <CTableRow>
                        <CTableDataCell>Rol</CTableDataCell>
                        <CTableDataCell>{{ fichas.folio }}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                        <CTableDataCell>Fecha Ingreso</CTableDataCell>
                        <CTableDataCell>{{ shortDateFormat(fichas.fecha_ingreso) }}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                        <CTableDataCell>Fecha Sentencia</CTableDataCell>
                        <CTableDataCell>{{ shortDateFormat(fichas.fecha_sentencia) }}</CTableDataCell>
                    </CTableRow>
                    
                    <CTableRow v-for="detail in sortedItems" :key="detail.id">
                        <CTableDataCell>{{ detail.parametro.nombre }}</CTableDataCell>
                        <template v-if="detail.parametro.tipoparametro_id === 1 || detail.parametro.tipoparametro_id === 3">
                            <CTableDataCell>{{ detail.valor }}</CTableDataCell>
                        </template>

                        <template v-else-if="detail.parametro.tipoparametro_id === 4">
                            <CTableDataCell>
                                <p v-for="(elem, index) in detail.detalle_multiple" :key="index">
                                    <div v-if="elem.valor">
                                        {{ elem.link }}: {{ elem.valor }}
                                    </div>
                                    
                                </p>
                            </CTableDataCell>
                            
                        </template>
                        
                        <template v-else>
                            <CTableDataCell>
                                <p v-for="(elem, index) in detail.detalle_multiple" :key="index">
                                    {{ elem.valor }}{{ index < detail.detalle_multiple.length - 1 ? ',' : '' }}
                                </p>
                            </CTableDataCell>
                        </template>
                        
                        
                        
                    </CTableRow>
                    
                </CTableBody>
                </CTable>
        </CCardBody>
    </CCard>
</template>

<style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    border: 1px solid black;
    padding: 8px;
    text-align: left;
  }


</style>