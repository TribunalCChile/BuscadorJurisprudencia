<template>
    <CButton color="dark" type="submit" class="">
        <div v-if="isSendingForm" class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
        </div> 
            {{title}}
    </CButton>
</template>
    
<script>
    export default{
        name: "SubmitButton",
        props: ['title','isSendingForm'],
    }
    
</script>