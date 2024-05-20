<template>
    <CModal :visible="showModal" @close="closeModal" size="xl">
        <CModalHeader>
            <CModalTitle>
                Ficha Causa N° {{ ficha.folio }}
                <CBadge 
                    v-bind:class="setBadgeColor(ficha.estado_id)"
                    style="margin-left: 0.7rem;"
                    >{{ setStateName(ficha.estado_id) }}
                </CBadge>
            </CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CRow class="align-items-center">
                <CCol>
                    <CCardTitle>
                        {{ ficha.nombre }}
                        <CButton 
                            color="primary" 
                            class="mx-3" 
                            @click="exportToPDF(ficha)"
                            v-c-tooltip="{
                                content: 'Descargar ficha en formato PDF', 
                                placement: 'top'
                            }"
                        >
                            <CIcon  :icon="icon.cilDataTransferDown" size="md"/>
                        </CButton>
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
                        <CTableDataCell>{{ ficha.folio }}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                        <CTableDataCell>Fecha Ingreso</CTableDataCell>
                        <CTableDataCell>{{ shortDateFormat(ficha.fecha_ingreso) }}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                        <CTableDataCell>Fecha Sentencia</CTableDataCell>
                        <CTableDataCell>{{ shortDateFormat(ficha.fecha_sentencia) }}</CTableDataCell>
                    </CTableRow>
                    
                    <CTableRow v-for="detail in sortedItems" :key="detail.id">
                        <CTableDataCell>{{ detail.parametro.nombre }}</CTableDataCell>
                        <template v-if="detail.parametro.tipoparametro_id === 1 || detail.parametro.tipoparametro_id === 3">
                            <CTableDataCell>{{ detail.valor }}</CTableDataCell>
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
        </CModalBody>
        <CModalFooter>
            
            
            <CButton color="secondary" @click="closeModal">Cerrar</CButton>
            
        </CModalFooter>
    </CModal>
</template>

<script>
    import { CIcon } from '@coreui/icons-vue';
    import * as icon from '@coreui/icons';
    import * as XLSX from 'xlsx';
    import { jsPDF } from "jspdf";

    export default {
        name: 'Mostrar Ficha Buscador',
        components: {
            CIcon
        },
        props: {
            showModal: Boolean,
            ficha: Object
        },
        setup() {
            return {
                icon
            }
        },
        emits: ['closeShowFicha'],
        computed: {
            sortedItems() {
                const sortedDetail = this.ficha.detalle.slice().sort((a, b) => {   
                    const actTemplateA = this.getActualTemplate(a.parametro.template);  
                    const actTemplateB = this.getActualTemplate(b.parametro.template);  

                    return actTemplateA.pivot.prioridad - actTemplateB.pivot.prioridad; 
                });

                return sortedDetail; 
            },
        },  
        methods: {
            getActualTemplate(template) {
                const templateId = this.ficha.template_id; 
                return template.find(elem => elem.id === templateId); 
                
            },
            restoreInitialData() {
                return; 
            },
            closeModal() {
                this.restoreInitialData(); 
                this.$emit('closeShowFicha'); 
                
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
            

        }
    }

</script>

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