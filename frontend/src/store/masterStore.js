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
        isBannerLoading:false,
        banners:[],
    }),
    actions: {
        async submitRoom(data) {
            try {
                const response = await api.post('/submit-training-room', data);
                const statusCode=response.status===200 && response.data.status===201;
                if (!statusCode) {
                    return {success: false, message: response.data.message}
                }
                return {success: true, message: response.data.message}
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

        async getRoomById(id) {
            try {
                const response = await api.get(`/room/${id}`);
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
                const statusCode=response.status===200 && response.data.status===201;
                if(!statusCode){
                    return {success: false, message: response.data.message}
                }
                return {success: true, message: response.data.message}
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
                const statusCode=response.status===200 && response.data.status===201;
                if(!statusCode){
                    return {success: false, message: response.data.message}
                }
                return {success: true, message: response.data.message}
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
                const statusCode=response.status===200 && response.data.status===201;
                if(!statusCode){
                    return {success: false, message: response.data.message}
                }
                    return {success: true, message: response.data.message}
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
        async fetchBanners(){
            try{
                const response=await api.get('/banners');
                console.log(response.data.banners)
                this.banners = response.data.banners;
            }catch(err){

            }
        },
        async submitBanner(data) {
            try {
                const response = await api.post('/banner', data);
                const statusCode=response.status===200 && response.data.status===201;
                if (statusCode) {
                    return {success: true, message: response.data.message}
                }
                return {success: false, message: "Unexpected response from server"}
            } catch (err) {
                return {success: false, message: err.message}
            }
        },
        async deleteBanner(id) {
            try {
                const response = await api.delete(`/banner/${id}`);
                return {success: true, message: response.data.message};
            } catch (err) {
                return {success: false, message: err.response?.data?.message || "Deletion failed"};
            }
        },
    },
});