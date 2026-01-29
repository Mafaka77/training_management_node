<template>
  <q-card flat class="q-mb-md bg-blue-1">
    <q-card-section>
      <div class="text-h6 text-weight-bold">Rate This Training</div>

      <!-- Already Rated -->
      <div v-if="existingRating" class="q-mt-sm">
        <div class="text-body1">Your Rating:</div>
        <div class="row items-center q-gutter-sm q-mt-xs">
          <q-rating :model-value="existingRating.rating" size="2em" color="orange" readonly />
          <span class="text-body2">({{ existingRating.rating }}/5)</span>
        </div>
        <div class="text-body2 q-mt-sm"><strong>Your Review:</strong> {{ existingRating.review }}</div>
        <div class="text-caption text-grey q-mt-xs">Rated on {{ formatDate(existingRating.createdAt) }}</div>
        <q-btn label="Edit Rating" color="primary" outline class="q-mt-md" @click="showDialog = true" />
      </div>

      <!-- Not rated yet -->
      <div v-else class="q-mt-sm">
        <div class="text-body2 q-mb-md">
          Share your experience with this training program to help others.
        </div>
        <q-btn label="Add Rating & Review" color="primary" icon="star" @click="showDialog = true" />
      </div>

      <!-- Rating Dialog -->
      <q-dialog v-model="showDialog" persistent>
        <q-card style="min-width: 400px">
          <q-card-section>
            <div class="text-h6">Rate Training Program</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="column items-center q-gutter-y-md">
              <div class="text-body1">How would you rate this training?</div>
              <q-rating
                v-model="ratingForm.rating"
                size="3em"
                color="orange"
                icon="star_border"
                icon-selected="star"
              />
              <div class="text-body2">{{ ratingForm.rating }}/5</div>
              <q-input
                v-model="ratingForm.review"
                label="Your Review (Optional)"
                type="textarea"
                rows="3"
                outlined
                placeholder="Share your experience..."
                class="full-width"
              />
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              label="Submit Rating"
              color="primary"
              :disable="ratingForm.rating === 0"
              @click="submitRating"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from "vue"
import { api } from "boot/axios"
import { useQuasar } from "quasar"

const $q = useQuasar()

const props = defineProps({
  existingRating: Object,
  trainingId: String,
  showDialog: Boolean
})
const emit = defineEmits(["update:showDialog", "submitted"])

const showDialog = ref(props.showDialog)
watch(() => props.showDialog, (val) => (showDialog.value = val))
watch(showDialog, (val) => emit("update:showDialog", val))

const ratingForm = ref({ rating: 0, review: "" })

const submitRating = async () => {
  try {
    const payload = {
      rating: ratingForm.value.rating,
      review: ratingForm.value.review || ""
    }
    await api.post(`/api/training/${props.trainingId}/ratings`, payload)
    $q.notify({ type: "positive", message: "Rating submitted successfully!" })
    showDialog.value = false
    ratingForm.value = { rating: 0, review: "" }
    emit("submitted")
  } catch (err) {
    $q.notify({ type: "negative", message: "Failed to submit rating",err   })

  }
}

const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "N/A")
</script>
