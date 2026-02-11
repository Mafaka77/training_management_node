

<template>
 
  <Breadcrumbs :items="breadcrumbs" />
  <form @submit.prevent="submitForm" class="space-y-2 max-w-">

    <div class="bg-white/5 rounded-xl p-6 space-y-4">
      <BaseInput v-model="form.question"
                 label="Question"
                 placeholder="e.g. How to book a room?...."
                 type="text"/>
      <BaseTextArea v-model="form.answer"
                    label="Answer"
                    placeholder="e.g. To book a room......."/>

      <button
          type="submit"
          class="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium">
        Save FAQ
      </button>
    </div>
  </form>
</template>
<script setup>

import BaseInput from "../../../components/ui/BaseInput.vue";
import {reactive} from "vue";
import {useMasterStore} from "../../../store/masterStore.js";
import {useAlertStore} from "../../../store/alertStore.js";
import BaseTextArea from "../../../components/ui/BaseTextArea.vue";
import Breadcrumbs from "../../../components/ui/Breadcrumbs.vue";
const alert=useAlertStore()
const store = useMasterStore();
const form=reactive({
  question:'',
  answer:'',
})
const breadcrumbs=[
  {label:"FAQs",to:"/admin/master/faq"},
  {label:"Create FAQ",to:"/admin/master/faq/create"}
]
const submitForm = async () => {
  const response = await store.submitFAQ(form);
  if(response.success===false){
    alert.error(response.message)
  }else{
    alert.success(response.message)
    // Reset form
    form.question=''
    form.answer=''

  }
}
</script>
<style scoped>

</style>