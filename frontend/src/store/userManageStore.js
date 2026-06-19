import { defineStore } from "pinia";
import api from "../api/axios.js";

export const useUserManageStore = defineStore('userManageStore', {
    state: () => ({
        trainers: [],
        isLoading: true,
        trainerPage: 1,
        trainerTotalPages: 1,
        trainersTotal: 0,
        districts: [],
        trainees: [],
        isTraineeLoading: true,
        groups: [],
        traineePage: 1,
        traineeTotalPages: 1,
        traineesTotal: 0,
        employees: [],
        employeePage: 1,
        employeeTotalPages: 1,
        employeesTotal: 0,

    }),
    actions: {
        async fetchTrainers(page = 1, search = '') {
            try {
                this.isLoading = true;
                const response = await api.get('/trainers', {
                    params: {
                        page: page,
                        search: search,
                        limit: 5
                    }
                });
                if (response.data.status === 404 || !response.data.trainers) {
                    this.trainers = [];
                    this.trainerPage = 1;
                    this.trainerTotalPages = 1;
                    this.trainersTotal = 0;
                } else {
                    this.trainers = response.data.trainers;
                    this.trainerPage = response.data.pagination?.page || 1;
                    this.trainerTotalPages = response.data.pagination?.totalPages || 1;
                    this.trainersTotal = response.data.pagination?.total || 0;
                }
                this.isLoading = false;
            } catch (e) {
                this.isLoading = false;
            }
        },
        async fetchDistricts() {
            try {
                const response = await api.get('/districts');
                this.districts = response.data.districts;
            } catch (e) {

            }
        },
        async submitTrainer(trainerData) {
            try {
                const response = await api.post('/trainer', trainerData);
                if (response.status === 200) {
                    if (response.data.status === 400) {
                        return { success: false, message: response.data.message };
                    } else if (response.data.status === 409) {
                        return { success: false, message: response.data.message };
                    } else if (response.data.status === 201) {
                        return { success: true, message: response.data.message };
                    }
                } else {
                    return { success: false, message: "Server Error. Please try again later." };
                }
            } catch (e) {
                return { success: false, message: "Server Error. Please try again later." };
            }
        },
        async fetchTrainer(id) {
            this.isLoading = true;
            try {
                const response = await api.get(`/trainer/${id}`);
                if (response.status === 200 && response.data.status === 200) {
                    return { success: true, data: response.data.trainer };
                }
                return { success: false, message: response.data.message };
            } catch (e) {
                return { success: false, message: "Server Error. Please try again later." };
            } finally {
                this.isLoading = false;
            }
        },
        async toggleTrainerStatus(trainerId) {
            this.isLoading = true;
            try {
                const response = await api.put(`/trainer/${trainerId}/toggle-status`);
                if (response.status === 200 && response.data.status === 200) {
                    return { success: true, message: response.data.message };
                }
                return { success: false, message: response.data.message };
            } catch (e) {
                return { success: false, message: "Server Error. Please try again later." };
            } finally {
                this.isLoading = false;
            }
        },
        async deleteTrainer(trainerId) {
            try {
                const response = await api.delete(`/trainer/${trainerId}`);
                if (response.status === 200) {
                    if (response.data.status === 200) {
                        return { success: true, message: response.data.message };
                    } else {
                        return { success: false, message: response.data.message };
                    }
                } else {
                    return { success: false, message: "Server Error. Please try again later." };
                }
            } catch (e) {
                return { success: false, message: "Server Error. Please try again later." };
            }
        },
        async updateTrainer(trainerData, trainerId) {
            this.isLoading = true;
            try {
                const response = await api.put(`/trainer/${trainerId}`, trainerData);
                if (response.status === 200 && response.data.status === 200) {
                    return { success: true, message: response.data.message };
                }
                return { success: false, message: response.data.message };
            } catch (e) {
                return { success: false, message: "Server Error. Please try again later." };
            } finally {
                this.isLoading = false;
            }
        },
        async fetchTrainee(page = 1, search = '') {
            this.isTraineeLoading = true;
            try {
                const response = await api.get('/trainees', {
                    params: {
                        page: page,
                        search: search,
                        limit: 3
                    }
                });
                console.log(response.data);
                this.trainees = response.data.trainees;
                this.traineePage = response.data.pagination.page;
                this.traineeTotalPages = response.data.pagination.totalPages;
                this.traineesTotal = response.data.pagination.total;
                this.isTraineeLoading = false;
            } catch (e) {
                this.isTraineeLoading = false;
            }
        },
        async submitTrainee(traineeData) {
            try {
                const response = await api.post('/trainee', traineeData);
                if (response.status === 200) {
                    if (response.data.status === 400) {
                        return { success: false, message: response.data.message };
                    } else if (response.data.status === 409) {
                        return { success: false, message: response.data.message };
                    } else if (response.data.status === 201) {
                        return { success: true, message: response.data.message };
                    }
                } else {
                    return { success: false, message: "Server Error. Please try again later." };
                }
            } catch (e) {
                return { success: false, message: "Server Error. Please try again later." };
            }
        },
        async fetchGroups() {
            try {
                const response = await api.get('/get-all-groups');
                this.groups = response.data.groups;
            } catch (e) {

            }
        },
        async deleteTrainee(traineeId) {
            try {
                const response = await api.delete(`/trainee/${traineeId}`);
                if (response.status === 200 && response.data.status === 200) {
                    return { success: true, message: response.data.message };
                }
                return { success: false, message: response.data.message };
            } catch (e) {
                return { success: false, message: "Server Error. Please try again later." };
            }
        },

        async fetchTraineeById(traineeId) {
            try {
                const response = await api.get(`/trainee/${traineeId}`);
                console.log(response.data);
                return response.data.trainee;
            } catch (e) { }
        },
        async blacklistTrainee(traineeId, data) {
            this.isLoading = true;
            try {
                const response = await api.put(`/trainee/${traineeId}/blacklist`, data);
                if (response.status === 200 && response.data.status === 200) {
                    return { success: true, message: response.data.message, data: response.data.trainee };
                }
                return { success: false, message: response.data.message };
            } catch (e) {
                return { success: false, message: "Server Error. Please try again later." };
            }
            finally {
                this.isLoading = false;
            }
        },
        async updateTrainee(traineeId, data) {
            this.isLoading = true;
            try {
                const response = await api.put(`/trainee/${traineeId}`, data);
                if (response.status === 200 && response.data.status === 200) {
                    return { success: true, message: response.data.message, data: response.data.trainee };
                }
                return { success: false, message: response.data.message };
            } catch (e) {
                return { success: false, message: "Server Error. Please try again later." };
            }
            finally {
                this.isLoading = false;
            }
        },

        async submitEmployee(data) {
            console.log(data);
            try {
                const response = await api.post('/employee', data);
                const statusCode = response.status === 200 && response.data.status === 201;
                if (statusCode) {
                    return { success: true, message: response.data.message };
                }
                return { success: false, message: response.data.message };
            } catch (e) {
                return { success: false, message: "Server Error. Please try again later." };
            }
        },
        async fetchEmployees(page = 1, search = '') {
            try {
                this.isLoading = true;
                const response = await api.get('/employees', {
                    params: {
                        page: page,
                        search: search,
                        limit: 5
                    }
                });
                if (response.data.status === 404 || !response.data.employees) {
                    this.employees = [];
                    this.employeePage = 1;
                    this.employeeTotalPages = 1;
                    this.employeesTotal = 0;
                } else {
                    this.employees = response.data.employees;
                    this.employeePage = response.data.pagination?.page || 1;
                    this.employeeTotalPages = response.data.pagination?.totalPages || 1;
                    this.employeesTotal = response.data.pagination?.total || 0;
                }
                this.isLoading = false;
            } catch (e) {
                this.isLoading = false;
            }
        },
        async fetchEmployee(id) {
            this.isLoading = true;
            try {
                const response = await api.get(`/employee/${id}`);
                if (response.status === 200 && response.data.status === 200) {
                    return { success: true, data: response.data.employee };
                }
                return { success: false, message: response.data.message };
            } catch (e) {
                return { success: false, message: "Server Error. Please try again later." };
            } finally {
                this.isLoading = false;
            }
        },
        async updateEmployee(employeeData, employeeId) {
            this.isLoading = true;
            try {
                const response = await api.put(`/employee/${employeeId}`, employeeData);
                if (response.status === 200 && response.data.status === 200) {
                    return { success: true, message: response.data.message };
                }
                return { success: false, message: response.data.message };
            } catch (e) {
                return { success: false, message: "Server Error. Please try again later." };
            } finally {
                this.isLoading = false;
            }
        },
        async toggleEmployeeStatus(employeeId) {
            this.isLoading = true;
            try {
                const response = await api.put(`/employee/${employeeId}/toggle-status`);
                if (response.status === 200 && response.data.status === 200) {
                    return { success: true, message: response.data.message };
                }
                return { success: false, message: response.data.message };
            } catch (e) {
                return { success: false, message: "Server Error. Please try again later." };
            } finally {
                this.isLoading = false;
            }
        },
        async deleteEmployee(employeeId) {
            this.isLoading = true;
            try {
                const response = await api.delete(`/employee/${employeeId}`);
                if (response.status === 200 && response.data.status === 200) {
                    return { success: true, message: response.data.message };
                }
                return { success: false, message: response.data.message };
            } catch (e) {
                return { success: false, message: "Server Error. Please try again later." };
            } finally {
                this.isLoading = false;
            }
        }
    }

});























