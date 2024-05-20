<script>
    export default {
        name: 'TextInput', 
        props: {
            parameter: Object
        },
        data() {
            return {
                inputValue: ''
            }
        },
        methods: {
            updateValue(value) {
                this.inputValue = value;
                this.$emit('textInput', value); 
            }
        }
    }
    
</script>

<template>
    <div>
        <label>{{ parameter.nombre }}</label>
        <CFormInput
            placeholder="Complete este campo..."
            :value="inputValue"
            @input="updateValue($event.target.value)"
        ></CFormInput>    
    </div>
</template>