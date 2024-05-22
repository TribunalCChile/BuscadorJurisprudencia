<script>
    import axios from 'axios';
    import MultiSelectInput from '../../components/MultiSelectInput';
    import MultiSelectInputEditFicha from '../../components/MultiSelectInputEditFicha.vue';
    import ArrayFixedInputEdit from '../../components/ArrayFixedInputEdit.vue'; 
    import TagInput from '../../components/TagInput'; 
    import TagInputEditFicha from '../../components/TagInputEditFicha.vue';
    import TextInput from '../../components/TextInput';
    import { SmartTagz } from "smart-tagz";
    import "smart-tagz/dist/smart-tagz.css";
    import ToastNotification from '../../components/ToastNotification.vue';
    import DatePicker from '../../components/DatePicker.vue';

    export default {
        name: 'Editar Ficha',
        components: {
            MultiSelectInput,
            MultiSelectInputEditFicha,
            ArrayFixedInputEdit,
            TagInput,
            TagInputEditFicha,
            TextInput,
            SmartTagz,
            ToastNotification,
            DatePicker

        },
        data() {
            return {
                ficha: this.$store.state.ficha,
                onEdit: false, // propiedad que cambiará cuando se active switch de edición
                //data ficha
                isSaving: false, // flag para ver si se guardó la información y no repetirse
                rol: '',
                fecha_ingreso: '',
                fecha_sentencia: '',
                fecha_acuerdo: '',
                estado: '',
                values: {
                    textInputs: []
                },
                fichaDetalle: [],
                
                resultType: '',
                duration: 2000,
                resultMsg: '',
                actionSuccess: false,
                showNotification: false,
                maxDate:new Date(),
                dayNames: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
                selectedOptions: {},
                tagOptions: {},
                fixedArrayValues: {},
                states: [
                    {
                        'id': 1,
                        'nombre': 'Ingresado'
                    },
                    {
                        'id': 2,
                        'nombre': 'Procesado'
                    },
                    {
                        'id': 3,
                        'nombre': 'Anulado'
                    },                    
                ]

            }
        },
        mounted() {
            this.initializeSelectedOptions();
            this.setDataFicha(this.ficha);
            console.log("FICHA: ",this.ficha);
            
        },
        computed: {
            sortedItems() {
                console.log("ficha detalle: ",this.ficha);
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
            initializeSelectedOptions() {
                this.ficha.detalle.forEach(detail => {
                    if (detail.parametro.tipoparametro_id === 2 && detail.parametro.tipodato_id !== null) {    
                        this.selectedOptions[detail.parametro.id] = [];
                    } else if (detail.parametro.tipoparametro_id === 2 && detail.parametro.tipodato_id === null) {    
                        this.tagOptions[detail.parametro.id] = [];
                    } else if (detail.parametro.tipoparametro_id === 4) {
                        this.fixedArrayValues[detail.parametro.id] = []; 
                    }
                    
                });
               
            },
            setDataFicha(ficha) {
                this.rol = ficha.folio;
                this.estado = ficha.estado; 
                this.fecha_ingreso = ficha.fecha_ingreso;
                this.fecha_sentencia = ficha.fecha_sentencia; 
                this.fecha_acuerdo = ficha.fecha_acuerdo; 
                console.log("ficha en setDataFicha: ", ficha)
                ficha.detalle.forEach(detail => {
                    if (detail.tipo === 1 || detail.tipo === 3) {
                        this.values.textInputs[detail.parametro.id] = detail.valor;
                        console.log(this.values); 
                    
                    } else if (detail.parametro.tipoparametro_id === 2 && detail.parametro.tipodato_id !== null) {    
                        detail.detalle_multiple.forEach(option => {
                            this.selectedOptions[detail.parametro.id].push(option.valor); 
                        });
                    
                    }
                });
                
                console.log(this.fixedArrayValues); 
            },
            changeEditMode() {
                //this.tagOptions = []; 
                this.onEdit = !this.onEdit;
                this.ficha.detalle.forEach(detail => {
                    if (detail.parametro.tipoparametro_id === 2 && detail.parametro.tipodato_id === null) {  
                        this.tagOptions[detail.parametro.id] = [];   
                        detail.detalle_multiple.forEach(option => {
                            this.tagOptions[detail.parametro.id].push(option.valor); 
                        });
                    
                    } else if (detail.tipo === 4) {
                        detail.detalle_multiple.forEach(option => {
                            console.log('option: ',option);
                            this.fixedArrayValues[detail.parametro.id].push(option.valor); 
                            console.log(this.fixedArrayValues); 
                            
                        })
                        
                    }
                });

                
              
                
            },
            setSingleInput(textInputs) {
                if (textInputs) {
                    textInputs.forEach((detail, index) => {
                        const parameter = this.ficha.detalle.find(param => param.parametro.id === index); 
                        
                        this.fichaDetalle.push({
                            parametro_id: parameter.parametro_id,
                            tipo: parameter.parametro.tipoparametro_id,
                            valor: detail
                        })
                    })
                    console.log("en single input: ", this.fichaDetalle); 
                } 
                
            },
            setMultipleInput(multipleInput) {
                console.log("multiple input: ", multipleInput)
                if(multipleInput) {
                    for (let key in multipleInput) {
                        let value = multipleInput[key]; 
                        
                        let detalleMultiple = [];
                        for (let i = 0; i < value.length; i++) {
                            detalleMultiple.push({
                                valor: value[i],
                                link: `link${i}`
                            })
                        }

                        this.fichaDetalle.push({
                            parametro_id: key,
                            tipo: 2,
                            valor: null,
                            detalleMultiple: detalleMultiple
                        }); 
                    }
                }
                
            },
            setFixedArrayInput(fixedArray) {
                if (fixedArray) {
                    for (let key in fixedArray) {
                        let value = fixedArray[key];
                        let fixedArrayMultiple = [];

                        for (let item in value){
                            fixedArrayMultiple.push({
                                valor: value[item],
                                link: item
                            })
                        }
                        console.log('fixedarraymultiple: ',fixedArrayMultiple)
                        this.fichaDetalle.push({
                            parametro_id: key,
                            tipo: 4,
                            valor:null,
                            detalleMultiple: fixedArrayMultiple
                        });
                    }
                    
                }
            }, 
            restoreInitialData() {
                this.actionSuccess = false; 
                this.showNotification = false; 
                
                
            },
            async submitForm() {
                if (this.isSaving) {
                    return; 
                }

                this.setSingleInput(this.values.textInputs); 
                this.setMultipleInput(this.selectedOptions);
                this.setMultipleInput(this.tagOptions);
                this.setFixedArrayInput(this.fixedArrayValues);

                this.editedFicha = {
                        codigo: this.ficha.codigo,
                        estado: this.estado,
                        folio: this.rol,
                        nombre: this.ficha.nombre,
                        template_id: this.ficha.template_id,
                        fecha_ingreso: this.fecha_ingreso,
                        fecha_sentencia: this.fecha_sentencia,
                        fichadetalle: this.fichaDetalle
                };
                
                if (this.fecha_acuerdo) {
                    this.ficha['fecha_acuerdo'] = this.fecha_acuerdo; 
                }
                
                //setear como unicos los objetos repetidos en detalle                 
                console.log("Edited ficha: ", this.editedFicha);

                if (this.editedFicha) {
                    try {
                        const response = await axios.put(
                            this.$store.state.backendUrl + '/ficha/' + this.ficha.id,
                                this.editedFicha,
                                {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: 'Bearer ' + this.$store.state.token,
                                    }
                                }
                            )
                        console.log(response.data);
                        //this.closeModal(); // Cerrar el modal primero
                        this.actionSuccess = true;
                        this.showNotification = true;
                        setTimeout(() => {
                            this.showNotification = false;
                        }, this.duration);
                            
                        this.isSaving = true; // se setea flag como true indicando el se guarda form y no se repite
                        this.$router.push({
                            name: 'Listar Fichas'                 
                        });
                         

                    } catch(error) {
                        this.actionSuccess = false;
                        this.showNotification = true; 
                        
                        setTimeout(() => {
                            this.showNotification = false;
                            this.restoreInitialData();
                            //    this.closeModal(); 
                        }, this.duration);
                       
                    } 
                }    
            },
            getResultType() {
                return this.actionSuccess ? 'success' : 'error'; 
            },
            getResultMsg() {
                return this.actionSuccess ? 'Ficha guardada exitósamente.' : 'Error al guardar Ficha'; 
            }, 
            handleDateFechaAcuerdo() {
                this.fecha_ingreso = date;
                console.log(this.fecha_ingreso); 
            },
            handleDateFechaSentencia() {
                this.fecha_sentencia = date;
                console.log(this.fecha_sentencia); 
            },
            handleDateFechaIngreso() {
                this.fecha_acuerdo = date; 
                console.log(this.fecha_acuerdo); 
            },
            handleFixedArray(data) {
                let { parameterId, values } = data; 
                console.log('values: ', values); 
                this.fixedArrayValues[parameterId] = values;
            },

            handleTagInput(data) {
                let { parameterId, values } = data;
                this.tagOptions[parameterId] = values; 
                console.log("tag options: ", this.tagOptions); 
            },
            handleMultiSelect(data) {
                let { parameterId, values } = data; 
                this.selectedOptions[parameterId] = values; 
                console.log("multiselect: ", this.selectedOptions);
            }
        }

    }
</script>

<template>
    <CCard>
        <CCardHeader>
            <CRow class="d-flex justify-content-between mb-3">
                <CCol>
                    <b>Ficha - {{ ficha.nombre }}</b>
                </CCol>
                <CCol class="d-flex justify-content-end align-items-center">
                    <CFormSwitch  
                            id="onEditMode"
                            label="Editar"
                            @change="changeEditMode"
                        />
                </CCol>
                
            </CRow>
           
            <CRow class="justify-content-between">
                <CCol>
                    
                    <label class="mt-2">Rol<span class="text-danger">*</span></label>
                        <CFormInput
                            placeholder="Complete este campo..."
                            class="mt-2"
                            v-model="rol"
                            :disabled="!onEdit"
                            
                    ></CFormInput> 
                </CCol>
                
                <CCol>
                    <label class="form-label mt-2">Fecha de sentencia<span class="text-danger">*</span></label>
                    <DatePicker
                        placeholder="Escoja un rango de fechas"
                        model-type="yyyy-MM-dd HH:mm:ss"
                        :max-date="maxDate"
                        v-model="fecha_sentencia"
                        :day-names="dayNames"
                        @update:model-value="handleDateFechaSentencia"
                        :disabled="!onEdit"
                    />
                </CCol> 
                
                
            </CRow>
            
        </CCardHeader>
        <CCardBody>
            <CCardTitle>Ingreso de datos de ficha</CCardTitle>
            <CForm class="mt-4">
                <div v-for="field in ficha.detalle" :key="field.id" class="mb-3">
                    <div v-if="field.tipo === 1">
                        <label>{{ field.parametro.nombre }}</label>
                        <template v-if="field.parametro.tipoparametro_id === 1">
                            <CFormInput
                                placeholder="Complete este campo..."
                                v-model="values.textInputs[field.parametro.id]"
                                :disabled="!onEdit"
                            ></CFormInput>
                        </template>
                    </div>
                    <div v-else-if="field.tipo === 3">
                        <label>{{ field.parametro.nombre }}</label>
                        <CFormTextarea
                            v-model="values.textInputs[field.parametro.id]"
                            placeholder="Complete este campo" 
                            rows="5"
                            :disabled="!onEdit"
                        ></CFormTextarea>
                         
                    </div>
                    <div v-else-if="field.tipo === 2 && field.parametro.tipodato_id === null">
                        <label> {{ field.parametro.nombre }} (Para agregar presione Enter) </label>
                        <TagInputEditFicha
                            :parameterId="field.parametro.id"
                            :selectedTags="tagOptions[field.parametro.id]"
                            :disabled="!onEdit"
                            @filterTags="handleTagInput"
                        /> 
                    </div>
                    <div v-else-if="field.parametro.tipoparametro_id === 2 && field.parametro.tipodato_id !== null">
                        <input type="hidden" id=""></input>
                        <label class="mt-3">{{ field.parametro.nombre }}</label> 
                        <MultiSelectInputEditFicha
                            :selectedOptions="selectedOptions[field.parametro.id]"
                            @filterMultiSelect="handleMultiSelect"
                            :disabled="!onEdit"
                            :dataTypeId="field.parametro.tipodato_id"
                            :parameterId="field.parametro.id"
                        /> 
                       
                    </div>
                    <div v-else-if="field.parametro.tipoparametro_id === 4">
                        <ArrayFixedInputEdit
                            @filterFixedArray="handleFixedArray"
                            :disabled="!onEdit"
                            :dataTypeId="field.parametro.tipodato_id"
                            :parameterName="field.parametro.nombre"
                            :parameterId="field.parametro.id"
                            :selectedInputs="fixedArrayValues[field.parametro.id]"
                        />
                    </div>
                    
                </div>
            </CForm> 
            <CButton color="dark" @click="submitForm">Guardar</CButton>
        </CCardBody>
        </CCard>

        <ToastNotification
            v-if="showNotification"
            :type="getResultType()"
            :duration="duration"
            :message="getResultMsg()" 
        />
</template>