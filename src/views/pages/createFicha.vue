<script>
    import axios from 'axios';
    import MultiSelectInput from '../../components/MultiSelectInput';
    import ArrayFixedInput from '../../components/ArrayFixedInput'; 
    import TagInput from '../../components/TagInput'; 
    import TextInput from '../../components/TextInput';
    import { SmartTagz } from "smart-tagz";
    import "smart-tagz/dist/smart-tagz.css";
    import ToastNotification from '../../components/ToastNotification.vue';
    import DatePicker from '../../components/DatePicker.vue';
    import FichaCreateFlow from '../../components/FichaCreateFlow.vue';

    export default {
        name: 'Crear Ficha',
        components: {
            MultiSelectInput,
            TagInput,
            TextInput,
            SmartTagz,
            ToastNotification,
            DatePicker,
            ArrayFixedInput,
            FichaCreateFlow

        },
        data() {
            return {
                template: this.$store.state.template,
                multiSelectOptions: {},
                tagsOptions: {},
                isSaving: false,
                fixedArrayValues: {},
                values: {
                    textInputs: [],
                },
                fichaDetalle: [],
                ficha: {},
                datatypeContent: [], 
                datatypeId: 0,
                fecha_ingreso: null,
                fecha_acuerdo: null,
                fecha_sentencia: null,
                estado_id: 1,
                rol: '',
                resultType: '',
                duration: 3000,
                errorMsg: '',
                actionSuccess: false,
                showNotification: false,
                maxDate:new Date(),
                dayNames: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
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
            console.log("template en create ficha: ", this.template);
            
        },

        watch: {
            
        },
        computed: {
            sortedItems() {
                return this.template.parametro.slice().sort((a, b) => {
                    return a.pivot.prioridad - b.pivot.prioridad;
                });
            }
        }, 

        methods: {
            async getDataTypesContent() {
                try {
                    const response = await axios.get(
                        this.$store.state.backendUrl + '/tipodato', 
                        {
                            params: {
                                filter: JSON.stringify({'id': this.datatypeId })
                            },
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + this.$store.state.token,
                            }
                        }                  
                    ); 

                    this.dataTypeContent = response.data[0]; 
                    console.log("datatype: ",this.dataTypeContent); 

                } catch(error) {
                    console.error("Error al consultar api getDataTypeContent", error); 
                }
            }, 

            getResultType() {
                return this.actionSuccess ? 'success' : 'error'; 
            },
            getResultMsg() {
                if (this.actionSuccess) {
                    return 'Ficha guardada exitósamente.';
                } else {
                    return this.errorMsg ? this.errorMsg : 'Error al guardar Ficha.'; 
                }
                return this.actionSuccess ? 'Ficha guardada exitósamente.' : 'Error al guardar Ficha'; 
            }, 
            restoreInitialData() {
                this.actionSuccess = false; 
                this.showNotification = false; 
                
                
            },
            areObjectsEqual(obj1, obj2) {
                const keysObj1 = Object.keys(obj1); 
                const keysObj2 = Object.keys(obj2); 

                if (keysObj1.length !== keysObj2) {
                    return false; 
                }

                return keysObj1.every(key => obj2.hasOwnProperty(key) && obj1[key] === obj2[key]);  
                /* if (obj1 === obj2) {
                    return true;
                }

                if (typeof obj1 !== 'object' || obj1 === null || 
                    typeof obj2 !== 'object' || obj2 === null) {
                    return false;
                }

                const keys1 = Object.keys(obj1);
                const keys2 = Object.keys(obj2);

                if (keys1.length !== keys2.length) {
                    return false;
                }

                return keys1.every(key => obj2.hasOwnProperty(key) && areObjectsEqual(obj1[key], obj2[key])); */
            },
            setSingleInput(textInputs) {
                if (textInputs) {
                    textInputs.forEach((detail, index) => {
                        const parameter = this.template.parametro.find(param => param.id === index); 
                        this.fichaDetalle.push({
                            parametro_id: parameter.id,
                            tipo: parameter.tipoparametro_id,
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
            setFixedArrayInput(preceptosLegales) {
                console.log(preceptosLegales); 
                if (preceptosLegales) {
                    for (let precepto in preceptosLegales) {
                        let preceptoField = preceptosLegales[precepto];
                        for (const row in preceptoField) {
                            let multipleDetail = [];
                            let values = preceptoField[row];

                            for(const item in values) {
                                multipleDetail.push({
                                    valor: values[item],
                                    link: item})
                            }

                            /* validación si este cambio ya existe 
                                si existe no se agregará a ficha final */
                            let newDetailFicha = {
                                parametro_id: precepto,
                                tipo: 4,
                                valor: null,
                                detalleMultiple: multipleDetail
                            }; 
                            this.fichaDetalle.push(newDetailFicha);
                        }
                    
                    }
                    
                     
                }
            }, 

            async getFichaData(id) {
                try {
                    const response = await axios.get(
                        this.$store.state.backendUrl + '/ficha',
                        { 
                            params: {
                                filter: JSON.stringify({'id': id})
                            },
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + this.$store.state.token,
                            }
                        }
                    );
                    console.log("RESPONSE FICHAS: ",response.data);
                    return response.data; 
                    
                } catch (error) {
                    console.error('Error en la solicitud a la API:', error);
                    throw error; 
                }
            },
            async submitForm() {
                /* En el futuro espero poder encontrar una mejor forma
                de validar que no se guarden repetidamente los elementos cuando haya error.
                De momento lo dejo hardcodeado */ 
                
                
                this.fichaDetalle = []; 
                this.setSingleInput(this.values.textInputs); 
                this.setMultipleInput(this.multiSelectOptions);
                this.setMultipleInput(this.tagsOptions);
                this.setFixedArrayInput(this.fixedArrayValues);
                

                this.ficha = {
                        codigo: this.template.codigo,
                        folio: this.rol,
                        estado: this.estado_id,
                        nombre: this.template.nombre,
                        template_id: this.template.id,
                        fecha_ingreso: this.fecha_ingreso,
                        fecha_sentencia: this.fecha_sentencia,
                        fichadetalle: this.fichaDetalle
                };
                
                if (this.fecha_acuerdo) {
                    this.ficha['fecha_acuerdo'] = this.fecha_acuerdo; 
                }
                
                console.log("FICHA FINAL : ",this.ficha);
                if (this.ficha) {
                    try {
                        const response = await axios.post(
                            this.$store.state.backendUrl + '/ficha',
                                this.ficha,
                                {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: 'Bearer ' + this.$store.state.token,
                                    }
                                }
                            )
                        console.log(response.data);
                        
                        this.actionSuccess = true;
                        this.showNotification = true;
                        setTimeout(() => {
                            this.showNotification = false;
                        }, this.duration);
                            
                        

                        const fichaToSend = await this.getFichaData(response.data.data.id); 
                        this.$store.commit("watchFicha", fichaToSend[0]);
                        this.$router.push({
                            name: 'Vista de Ficha',
                            params: {
                                fichaId: fichaToSend[0].id
                            }
                        })  
                         

                    } catch(error) {
                        this.actionSuccess = false;
                        this.showNotification = true; 
                       
                        if (error.response && error.response.data && error.response.data.errors) {
                            const errors = error.response.data.errors; 
                            this.errorMsg = Object.values(errors).join('\n');
                        
                        } else {
                            this.errorMsg = 'Error al guardar Ficha'; 
                        }
                        
                        setTimeout(() => {
                            this.showNotification = false;
                            this.restoreInitialData();
                            //    this.closeModal(); 
                        }, this.duration);
                                               
                    } 
                } 
            },

            handleFixedArray(data) {
                let { parameterId, values } = data; 
                this.fixedArrayValues[parameterId] = values;
                //console.log(this.fixedArrayValues[parameterId]); 
                
            },

            handleMultiSelect(data) {
                let { parameterId, values } = data; 
                this.multiSelectOptions[parameterId] = values; 
                console.log("multiselect: ", this.multiSelectOptions); 
            },
            handleTagInput(data) { 
                let { parameterId, values } = data;
                this.tagsOptions[parameterId] = values; 
                console.log("tag options: ", this.tagsOptions); 
            },
            handleDateFechaIngreso(date) {
                this.fecha_ingreso = date;
                console.log(this.fecha_ingreso); 
            },
            handleDateFechaSentencia(date) {
                this.fecha_sentencia = date;
                console.log(this.fecha_sentencia);  
            },
            handleDateFechaAcuerdo(date) {
                this.fecha_acuerdo = date; 
                console.log(this.fecha_acuerdo); 
            },
            shortDateFormat(date) {
                let originalDate = new Date(date); 
                let formatedDate = originalDate.toLocaleDateString();
                return formatedDate; 
                
            },

            
            
        }
    }
</script>


<template>
    <FichaCreateFlow />

    <CCard>

        <CCardHeader>
            <CRow class="d-flex justify-content-between mb-3">
                <CCol>
                    <b>Ficha - {{ template.nombre }}</b>
                </CCol>
                <CCol class="d-flex justify-content-end align-items-center pr-5">
                    <!-- <div class="mr-3">
                        <label>Estado</label>
                    </div>
                    <div class="ml-4">
                        <v-select
                        v-model="estado_id"
                        placeholder="Seleccione..."
                        :options="states"
                        :reduce="state => state.id"
                        label="nombre"
                        class="ml-5"
                        
                        >
                        </v-select>
                    </div>
                     -->
                   
                </CCol>
                
            </CRow>
            
            <CRow class="justify-content-between">
                <CCol>
                    
                    <label class="mt-3">Rol<span class="text-danger">*</span></label>
                        <CFormInput
                            placeholder="Complete este campo..."
                            class=""
                            v-model="rol"
                            
                    ></CFormInput> 
                </CCol>
                <!-- <CCol>
                    <label class="form-label mt-2">Fecha de ingreso<span class="text-danger">*</span></label>
                    <DatePicker
                        placeholder="Escoja un rango de fechas"
                        model-type="yyyy-MM-dd HH:mm:ss"
                        :max-date="maxDate"
                        v-model="fecha_ingreso"
                        :day-names="dayNames"
                        @update:model-value="handleDateFechaIngreso"
                    />
                </CCol> -->
                <CCol>
                    <label class="form-label mt-2">Fecha de resolución<span class="text-danger">*</span></label>
                    <DatePicker
                        placeholder="Escoja un rango de fechas"
                        model-type="yyyy-MM-dd HH:mm:ss"
                        :max-date="maxDate"
                        v-model="fecha_sentencia"
                        :day-names="dayNames"
                        @update:model-value="handleDateFechaSentencia"
                    />
                </CCol> 
                <!-- <CCol>
                    <label class="form-label mt-2">Fecha de acuerdo</label>
                    <DatePicker
                        placeholder="Escoja un rango de fechas"
                        model-type="yyyy-MM-dd HH:mm:ss"
                        :max-date="maxDate"
                        v-model="fecha_acuerdo"
                        :day-names="dayNames"
                        @update:model-value="handleDateFechaAcuerdo"
                    />
                </CCol> -->
                
            </CRow>
            
        </CCardHeader>
        <CCardBody>
            <CCardTitle>Ingreso de datos de ficha</CCardTitle>
            <!-- <CCardText>With supporting text below as a natural lead-in to additional content.</CCardText> -->
            <CForm class="mt-4">
                <div v-for="parameter in sortedItems" :key="parameter.id" class="mb-3">
                    <div v-if="parameter.tipoparametro_id === 1">
                        <label>{{ parameter.nombre }}</label>
                        <CFormInput
                                placeholder="Complete este campo..."
                                v-model="values.textInputs[parameter.id]"
                        ></CFormInput>
                        <!-- <TextInput 
                            :parameter="parameter"
                            v-model="values.fichadetalle[parameter.id]"
                            @textInput="handleTextInput(parameter, $event)"
                        />  -->
                    </div> 
                    <div v-else-if="parameter.tipo_parametro.id === 3">
                        <label>{{ parameter.nombre }}</label>
                        <CFormTextarea
                                v-model="values.textInputs[parameter.id]"
                                placeholder="Complete este campo"
                                rows="5"
                        ></CFormTextarea>
                    </div>
                       
                    <div v-else-if="parameter.tipoparametro_id === 2 && parameter.tipodato_id === null">
                        <TagInput 
                            :parameter="parameter"
                            @filterTags="handleTagInput"
                        />
                    </div>
                    <div v-else-if="parameter.tipoparametro_id === 2 && parameter.tipodato_id !== null">
                        <input type="hidden" id=""></input>
                        <MultiSelectInput
                            :parameter="parameter"
                            @filterMultiSelect="handleMultiSelect"
                            :isEdit="false"
                            :selectable="() => multiSelectOptions.length < 20"
                            
                        />
                    </div>
                    <div v-else-if="parameter.tipoparametro_id === 4">
                        <ArrayFixedInput
                            @filterFixedArray="handleFixedArray" 
                            :dataTypeId="parameter.tipodato_id"
                            :parameterName="parameter.nombre"
                            :parameterId="parameter.id"  
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

