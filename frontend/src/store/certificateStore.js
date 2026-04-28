import { defineStore } from "pinia";
import api from "../api/axios";
export const useCertificateStore = defineStore('certificate', {
    state: () => ({
        releaseOrder: {},
        certificates: [],
        certificateDetails: {},
        isCertificateLoading: false,
        isLoading: false,
        training: {},
        users: [],
        isSigning: false,
        showDeleteConfirm: false,
        params: {
            parameter1: '',
            parameter2: '',
            parameter3: '',
        },
        selectedTemplate: '',
        director: {},
    }),
    actions: {
        async generateReleaseOrder(trainingId) {
            this.isLoading = true;
            try {
                const response = await api.get(`/training/${trainingId}/release-order/generate`)
                console.log('test' + response.data);
                if (response.status === 200 && response.data.status === 200) {
                    this.training = response.data.training
                    this.users = response.data.users
                    return { success: true, data: response.data, message: response.data.message }
                }
                return { success: false, message: response.data.message }
            } catch (ex) {
                return { success: false, message: ex.response.data.message }
            } finally {
                this.isLoading = false;
            }
        },
        async downloadReleaseOrder(trainingId) {
            try {
                const response = await api.get(`/training/${trainingId}/release-order/download`, {
                    responseType: 'blob'
                })
                return response
            } catch (ex) { }
        },
        async saveReleaseOrderToServer(formData, trainingId) {
            this.isLoading = true;
            this.error = null;
            try {
                // Trigger the server-side PDF generation
                const response = await api.post(`/training/${trainingId}/release-order/store`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (response.status === 200 && response.data.status === 201) {
                    return {
                        success: true,
                        message: response.data.message || "Release order saved successfully."
                    };
                }

                return {
                    success: false,
                    message: response.data.message || "Failed to save the release order."
                };

            } catch (ex) {
                const errorMessage = ex.message || "A server error occurred while saving.";
                return {
                    success: false,
                    message: errorMessage
                };
            } finally {
                this.isLoading = false;
            }
        },
        async getReleaseOrder(trainingId) {
            this.isLoading = true;
            try {
                const response = await api.get(`/training/${trainingId}/release-order`)
                console.log(response);
                if (response.status === 200 && response.data.status === 200) {
                    this.releaseOrder = response.data.releaseOrder;
                }
            } catch (ex) {
            } finally {
                this.isLoading = false;
            }
        },
        async deleteReleaseOrder(trainingId) {
            this.isLoading = true;
            try {
                const response = await api.delete(`/training/${trainingId}/release-order`)
                if (response.status === 200 && response.data.status === 200) {
                    return { success: true, message: response.data.message }
                }
                return { success: false, message: response.data.message }
            } catch (ex) {
                return { success: false, message: ex.response.data.message }
            } finally {
                this.isLoading = false;
            }
        },
        async handleSignDocument(trainingId) {
            this.isSigning = true;
            try {
                const response = await api.get(`/training/${trainingId}/release-order/prepare-esign`)
                if (response.status === 200 && response.data.status === 200) {
                    this.params.parameter1 = response.data.parameter1;
                    this.params.parameter2 = response.data.parameter2;
                    this.params.parameter3 = response.data.parameter3;
                    return { success: true, message: response.data.message }
                }
                return { success: false, message: response.data.message }
            } catch (ex) {
                return { success: false, message: ex.response.data.message }
            }
            finally {
                this.isSigning = false
            }
        },
        //CERTIFICATE AREA
        async fetchTraineeCertificate(id, trainingId) {
            this.isCertificateLoading = true;

            try {
                const response = await api.get(`/trainee/${id}/certificate`, {
                    params: {
                        trainingId: trainingId
                    }
                });
                console.log(response.data.data)
                if (response.status === 200 && response.data.status === 200) {
                    this.certificateDetails = response.data.data;
                    this.selectedTemplate = response.data.data.program.t_category.name;
                    this.director = response.data.data.director;
                    return { success: true, message: response.data.message }
                }
                return { success: false, message: response.data.message }
            } catch (e) {
                return { success: false, message: e }
            } finally {
                this.isCertificateLoading = false;
            }
        },
        // async storeCertificate(traineeId, formData) {
        //     this.isLoading = true;
        //     try {
        //         const response = await api.post(`/trainee/${traineeId}/certificate/store`, formData, {
        //             headers: { 'Content-Type': 'multipart/form-data' }
        //         });
        //         if (response.status === 200 && response.data.status === 200) {
        //             return { success: true, message: response.data.message }
        //         }
        //         return { success: false, message: response.data.message }
        //     } catch (ex) {
        //         return { success: false, message: ex.response.data.message }
        //     } finally {
        //         this.isLoading = false;
        //     }
        // },
        async requestCertificateGeneration(payload) {
            this.isLoading = true;
            try {
                const response = await api.post(`/certificate/generate-server`, payload);
                if (response.status === 200 && response.data.status === 200) {
                    return { success: true, message: response.data.message }
                }
                return { success: false, message: response.data.message }
            } catch (ex) {
                return { success: false, message: ex.response.data.message }
            } finally {
                this.isLoading = false;
            }
        },
        async fetchCertificates(trainingId) {
            this.isCertificateLoading = true;
            try {
                const response = await api.get(`/certificates/${trainingId}`);
                console.log(response.data);
                if (response.status === 200 && response.data.status === 200) {
                    this.certificates = response.data.data;
                    return { success: true, message: response.data.message }
                }
                return { success: false, message: response.data.message }
            } catch (ex) { }
            finally {
                this.isCertificateLoading = false;
            }
        },
        async handleCertificateSignature(id) {
            this.isSigning = true;
            try {
                const response = await api.get(`/certificate/${id}/prepare-esign`);
                if (response.status === 200 && response.data.status === 200) {
                    this.params.parameter1 = response.data.parameter1;
                    this.params.parameter2 = response.data.parameter2;
                    this.params.parameter3 = response.data.parameter3;
                    return { success: true, message: response.data.message }
                }
                return { success: false, message: response.data.message }
            } catch (ex) { }
            finally {
                this.isSigning = false;
            }
        }
    },
});