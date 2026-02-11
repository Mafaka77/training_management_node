import {defineStore} from "pinia";
import api from "../api/axios.js";

export const useMasterStore = defineStore('master', {
    state: () => ({
        rooms: [],
        loading: false,
        categories:[],
        isCatLoading:false,
        documents: [],
        isDocLoading: false,
        faqs: [],
        isFAQLoading: false,
    }),
    actions: {
        async submitRoom(data) {
            try {
                const response = await api.post('/submit-training-room', data);
                console.log(response.data);
                if (response.status === 200) {
                    if (response.data.status === 400) {
                        return {success: false, message: response.data.message}
                    } else if (response.data.status === 409) {
                        return {success: false, message: response.data.message}
                    } else if (response.data.status === 201) {
                        return {success: true, message: response.data.message}
                    } else {
                        console.log(response.data)
                        return {success: false, message: "Unexpected response from server"}
                    }
                }
            } catch (err) {
                return {success: false, message: err.message}
            }
        },
        async fetchRooms() {
            this.loading = true;
            try {
                const response = await api.get('/get-training-room',);
                this.rooms = response.data.rooms;
                this.loading = false;
            } catch (error) {
                console.error("Error fetching masters:", error);
            } finally {
                this.loading = false;
            }
        },
        // In masterStore.js actions:

        async getRoomById(id) {
            try {
                const response = await api.get(`/room/${id}`);
                console.log(response.data);
                // Adjust based on your API response structure
                return response.data.room;
            } catch (err) {
                throw err;
            }
        },

        async updateRoom(id, data) {
            try {
                const response = await api.put(`/room/${id}`, data);
                return {success: true, message: response.data.message};
            } catch (err) {
                return {success: false, message: err.response?.data?.message || "Update failed"};
            }
        },
        async deleteRoom(id) {

            try {
                const response = await api.delete(`/room/${id}`);
                console.log(response)
                return {success: true, message: response.data.message};
            } catch (err) {
                return {success: false, message: err.response?.data?.message || "Deletion failed"};
            }
        },
        async fetchCategories() {
            this.isCatLoading = true;
            try {
                const response = await api.get('/get-training-category');
                this.categories = response.data.categories;
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                this.isCatLoading = false;
            }
        },
        async submitCategory(data) {
            try {
                const response = await api.post('/submit-training-category', data);
                if (response.status === 200) {
                    if (response.data.status === 400) {
                        return {success: false, message: response.data.message}
                    } else if (response.data.status === 409) {
                        return {success: false, message: response.data.message}
                    } else if (response.data.status === 201) {
                        return {success: true, message: response.data.message}
                    } else {
                        console.log(response.data)
                        return {success: false, message: "Unexpected response from server"}
                    }
                }
            } catch (err) {
                return {success: false, message: err.message}
            }
        },
        async deleteCategory(id) {
            try {
                const response = await api.delete(`/training-category/${id}`);
                console.log(response)
                return {success: true, message: response.data.message};
            } catch (err) {
                return {success: false, message: err.response?.data?.message || "Deletion failed"};
            }
        },
        async fetchDocuments() {
            this.isCatLoading = true;
            try {
                const response = await api.get('/documents');
                this.documents = response.data.documents;
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                this.isCatLoading = false;
            }
        },
        async submitDocument(data) {
            try {
                const response=await api.post('/documents',data);
                if (response.status === 200) {
                    if (response.data.status === 400) {
                        return {success: false, message: response.data.message}
                    } else if (response.data.status === 409) {
                        return {success: false, message: response.data.message}
                    } else if (response.data.status === 201) {
                        return {success: true, message: response.data.message}
                    } else {
                        console.log(response.data)
                        return {success: false, message: "Unexpected response from server"}
                    }
                }
            }catch (err) {
                    return {success: false, message: err.message}
            }
        },
        async deleteDocument(id) {
            try {
                const response = await api.delete(`/document/${id}`);
                return {success: true, message: response.data.message};
            } catch (err) {
                return {success: false, message: err.response?.data?.message || "Deletion failed"};
            }
        },
        async fetchFAQs() {
            this.isFAQLoading = true;
            try {
                const response = await api.get('/faqs');
                this.faqs = response.data.faqs;
            } catch (error) {
                console.error("Error fetching FAQs:", error);
            } finally {
                this.isFAQLoading = false;
            }
        },
        async submitFAQ(data) {
            try {
                const response=await api.post('/faqs',data);
                if (response.status === 200) {
                    if (response.data.status === 400) {
                        return {success: false, message: response.data.message}
                    } else if (response.data.status === 409) {
                        return {success: false, message: response.data.message}
                    } else if (response.data.status === 201) {
                        return {success: true, message: response.data.message}
                    } else {
                        console.log(response.data)
                        return {success: false, message: "Unexpected response from server"}
                    }
                }
            }catch (err) {
                    return {success: false, message: err.message}
            }
        },
        async deleteFAQ(id) {
            try {
                const response = await api.delete(`/faqs/${id}`);
                return {success: true, message: response.data.message};
            } catch (err) {
                return {success: false, message: err.response?.data?.message || "Deletion failed"};
            }
        },
    },
});