<script>
    import { SmartTagz } from "smart-tagz";
    import Vue3TagsInput from 'vue3-tags-input';
    import "smart-tagz/dist/smart-tagz.css";
    export default {
        emits: ['filterTags'],
        name: 'TagInputDataType', 
        components: {
            SmartTagz,
            Vue3TagsInput
        },
        props: {
            parameterId: Number,
            selectedTags: Array,
            disabled: Boolean,
        },
        data(){
            return {
                tags: []
            }
        },

        mounted() {
            
           
        },
        watch: {
            selectedTags: {
                handler(newConfig) {
                    this.setDataSelectedTags(newConfig)
                    
                      
                },
                immediate: true 
            },
        },
        
        

        methods: {
            setDataSelectedTags(newConfig) { 
                this.tags = newConfig; 
                console.log(this.tags);
            },
            filterTags(value) {
                console.log(value); 
                this.$emit('filterTags', { parameterId: this.parameterId, values: value });
            }
        }
    }
    
</script>

<template>
    <div>
        <vue3-tags-input
            :tags="tags"
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
            :defaultTags="selectedTags"
            :maxTags="20"
            :theme="{
                primary: '#41abe8',
                background: '#ffffff',
                tagTextColor: '#fff',
            }"
            :on-changed="filterTags"
        /> -->

    </div>
</template>