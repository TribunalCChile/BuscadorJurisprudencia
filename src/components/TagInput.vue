<script>
    import { SmartTagz } from "smart-tagz";
    import "smart-tagz/dist/smart-tagz.css";
    import Vue3TagsInput from 'vue3-tags-input';

    export default {
        emits: ['filterTags'],
        name: 'TagInputDataType', 
        components: {
            SmartTagz,
            Vue3TagsInput
        },
        props: {
            parameter: Object,
            readOnly: Boolean
        },
        data(){
            return {
                tagsInputs: []
            }
        },

        mounted() {
        },

        methods: {
            filterTags(value) {
                console.log(value); 
                this.$emit('filterTags', { parameterId: this.parameter.id, values: value });
            }
        }
    }
    
</script>

<template>
    <div>
        <label> {{ parameter.nombre }} (Para agregar presione Enter) </label>
        <vue3-tags-input 
            :tags="tagsInputs"
            placeholder="Ingresar tags"
            @on-tags-changed="filterTags"
        />
        <!-- <smart-tagz
            autosuggest
            editable
            v-model="tagsInputs"
            inputPlaceholder="Ingrese coincidencias..."
            :allowPaste="{delimiter: ','}"
            :allowDuplicates="false"
            :maxTags="20"
            :readOnly="readOnly"
            :theme="{
                primary: '#41abe8',
                background: '#ffffff',
                tagTextColor: '#fff',
            }"
            :on-changed="filterTags"
        /> -->

    </div>
</template>