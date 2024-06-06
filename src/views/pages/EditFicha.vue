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
                updatedFicha: null,
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
                template: null

            }
        },
        created() {
            this.validateFichaStructure();     
        },
        mounted() {
            this.initializeSelectedOptions();
            this.setDataFicha(this.ficha);
            this.getTemplates(); 
        },
        computed: {
            groupedItems() {
                const groups = {};
                this.updatedFicha.forEach(detail => {
                    if (!groups[detail.parametro.id]) {
                        groups[detail.parametro.id] = [];
                    }
                    groups[detail.parametro.id].push(detail);
                });
                console.log("groups: ", groups);
                return groups;
            },

            sortedItems() {
                console.log(this.updatedFicha);
                const sortedDetail = this.updatedFicha.slice().sort((a, b) => {   
                    const actTemplateA = this.getActualTemplate(a.parametro.template);  
                    const actTemplateB = this.getActualTemplate(b.parametro.template);  

                    return actTemplateA.pivot.prioridad - actTemplateB.pivot.prioridad; 
                });

                return sortedDetail; 
            },
        },
        methods: {
            validateFichaStructure() {
                this.updatedFicha = this.ficha.detalle.filter(
                    detail => this.getActualTemplate(detail.parametro.template) !== undefined
                )
                console.log("validate: ", this.updatedFicha); 
            },
            async getTemplates() {
                try {
                    const response = await axios.get(
                        this.$store.state.backendUrl + '/template',
                        { 
                            params: {
                                filter: JSON.stringify({'id': this.ficha.template_id})
                            },
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + this.$store.state.token,
                            }
                        }
                    );
                    
                    this.template = response.data[0];
                    
                    
                } catch (error) {
                    console.error('Error en la solicitud a la API:', error);
                    this.failMsg = 'Error al obtener templates.'; 
                    this.fail = true;
                }
            },
            getActualTemplate(template) {
                const templateId = this.ficha.template_id; 
                return template.find(elem => elem.id === templateId); 
                
            },      
            initializeSelectedOptions() {
                this.ficha.detalle.forEach(detail => {
                    //console.log("detail: ", detail);
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
                let groups = this.groupedItems; 
                console.log("groups: ", groups);
                this.onEdit = !this.onEdit;
                
                for(const group in groups) {
                    if (groups[group].length > 1) {
                        console.log(groups[group]); 
                        this.fixedArrayValues[groups[group][0].parametro_id] = groups[group]; 
                        console.log('group: ',this.fixedArrayValues);
                    
                    } else {
                        
                        groups[group].forEach(detail => {
                            if (detail.parametro.tipoparametro_id === 2 && detail.parametro.tipodato_id === null) {  
                                this.tagOptions[detail.parametro.id] = [];   
                                detail.detalle_multiple.forEach(option => {
                                    this.tagOptions[detail.parametro.id].push(option.valor);  
                                })
                            }    
                        }) 
                
                    }
                
                    
                  /*   } else if (detail.tipo === 4) {
                        if (!this.fixedArrayValues[detail.parametro.id]) {
                            this.fixedArrayValues[detail.parametro.id] = {}; // Asegurarse de que el objeto esté inicializado    
                        } */

                        //console.log('DETALLE MULTIPLE: ', detail); 
                        /* detail.detalle_multiple.forEach(option => {
                            console.log('option: ', option);
                            this.fixedArrayValues[detail.parametro.id]  
                            console.log('precepto: ', this.fixedArrayValues);
                        }); */

                        
                        
               /*      }
                }); */

                }
            
              
                
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
                    
                } 
                
            },
            setMultipleInput(multipleInput) {
                
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
                        let preceptosByParameter = fixedArray[key];
                        for (let precepto in preceptosByParameter) {
                            let actualPrecepto = preceptosByParameter[precepto]
                            let fixedArrayMultiple = [];
                            console.log("actul precepto: ", actualPrecepto)
                            for (let item in actualPrecepto){
                                console.log("item: ", item); 
                                fixedArrayMultiple.push({
                                    valor: actualPrecepto[item],
                                    link: item
                                })
                            }
                            this.fichaDetalle.push({
                                parametro_id: key,
                                tipo: 4,
                                valor:null,
                                detalleMultiple: fixedArrayMultiple
                            });
                        }
                    
                        /* this.fichaDetalle.push({
                            parametro_id: key,
                            tipo: 4,
                            valor:null,
                            detalleMultiple: fixedArrayMultiple
                        }); */
                    }
                    
                }
            }, 
            restoreInitialData() {
                this.actionSuccess = false; 
                this.showNotification = false; 
                
                
            },
            async submitForm() {
                this.fichaDetalle = []; 
               

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
                <div v-for="(fields, parametroId) in groupedItems" :key="parametroId" class="mb-3">
                    <div v-if="fields.length > 1 || fields[0].tipo === 4">
                        <label>{{ fields[0].parametro.nombre }}</label>
                        <ArrayFixedInputEdit
                            @filterFixedArray="handleFixedArray"
                            :disabled="!onEdit"
                            :dataTypeId="fields[0].parametro.tipodato_id"
                            :parameterName="fields[0].parametro.nombre"
                            :parameterId="fields[0].parametro.id"
                            :selectedInputs="fields"
                        />
                    </div>
                    <!-- Other field types -->
                    <div v-else-if="fields[0].tipo === 1">
                            <label>{{ fields[0].parametro.nombre }}</label>
                            <template v-if="fields[0].parametro.tipoparametro_id === 1">
                                <CFormInput
                                    placeholder="Complete este campo..."
                                    v-model="values.textInputs[fields[0].parametro.id]"
                                    :disabled="!onEdit"
                                ></CFormInput> 
                            </template>
                        
                    </div>
                    <div v-else-if="fields[0].tipo === 3">
                        <label>{{ fields[0].parametro.nombre }}</label>
                        <CFormTextarea
                            v-model="values.textInputs[fields[0].parametro.id]"
                            placeholder="Complete este campo" 
                            rows="5"
                            :disabled="!onEdit"
                        ></CFormTextarea>
                         
                    </div>
                    <div v-else-if="fields[0].tipo === 2 && fields[0].parametro.tipodato_id === null">
                        <label> {{ fields[0].parametro.nombre }} (Para agregar presione Enter) </label>
                        <TagInputEditFicha
                            :parameterId="fields[0].parametro.id"
                            :selectedTags="tagOptions[fields[0].parametro.id]"
                            :disabled="!onEdit"
                            @filterTags="handleTagInput"
                        /> 
                    </div>
                    <div v-else-if="fields[0].parametro.tipoparametro_id === 2 && fields[0].parametro.tipodato_id !== null">
                        <input type="hidden" id=""></input>
                        <label class="mt-3">{{ fields[0].parametro.nombre }}</label> 
                        <MultiSelectInputEditFicha
                            :selectedOptions="selectedOptions[fields[0].parametro.id]"
                            @filterMultiSelect="handleMultiSelect"
                            :disabled="!onEdit"
                            :dataTypeId="fields[0].parametro.tipodato_id"
                            :parameterId="fields[0].parametro.id"
                        /> 
                       
                    </div>
                    <!-- Add other cases for field.tipo === 2, field.tipo === 3, etc. -->
                </div>
            </CForm>

            <!-- <CForm class="mt-4">
                <div v-for="field in updatedFicha" :key="field.id" class="mb-3">
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
            </CForm>  -->
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