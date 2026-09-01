import { defineStore } from "pinia";
import api from "../api/axios";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: [],
    isLoading: false,
    isSending: false,
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
    search: "",
    typeFilter: "All",
    targetFilter: "All",
    stats: {
      totalNotifications: 0,
      totalTokens: 0,
      androidTokens: 0,
      iosTokens: 0,
      webTokens: 0,
      broadcastCount: 0,
    },
    isStatsLoading: false,
    enrolleesSummary: null,
    isEnrolleesSummaryLoading: false,
  }),

  actions: {
    async fetchNotifications(targetPage = null) {
      this.isLoading = true;
      try {
        if (targetPage !== null) {
          this.page = targetPage;
        }
        const response = await api.get("/notifications/all", {
          params: {
            page: this.page,
            limit: this.limit,
            search: this.search,
            type: this.typeFilter,
            target_type: this.targetFilter,
          },
        });

        if (response.data.status === 200) {
          this.notifications = response.data.notifications || [];
          this.page = response.data.page || 1;
          this.total = response.data.total || 0;
          this.totalPages = response.data.totalPages || 1;
        }
      } catch (error) {
        console.error("Error fetching notifications list:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchStats() {
      this.isStatsLoading = true;
      try {
        const response = await api.get("/notifications/stats");
        if (response.data.status === 200) {
          this.stats = response.data.stats;
        }
      } catch (error) {
        console.error("Error fetching notification stats:", error);
      } finally {
        this.isStatsLoading = false;
      }
    },

    async fetchProgramEnrolleesSummary(programId, status = "Approved") {
      if (!programId) {
        this.enrolleesSummary = null;
        return;
      }
      this.isEnrolleesSummaryLoading = true;
      try {
        const response = await api.get(`/notifications/program/${programId}/enrollees-summary`, {
          params: { status },
        });
        if (response.data.status === 200) {
          this.enrolleesSummary = response.data.data;
          return response.data.data;
        }
      } catch (error) {
        console.error("Error fetching program enrollees summary:", error);
        this.enrolleesSummary = null;
      } finally {
        this.isEnrolleesSummaryLoading = false;
      }
    },

    async sendToProgram(payload) {
      this.isSending = true;
      try {
        const response = await api.post("/fcm/send-program-notification", payload);
        const statusCode = response.data.status || response.status;
        if (statusCode === 200) {
          return {
            success: true,
            message: response.data.message || "Push notification dispatched successfully",
            data: response.data,
          };
        } else {
          return {
            success: false,
            message: response.data.message || response.data.error || "Failed to send notification",
          };
        }
      } catch (error) {
        console.error("Error sending program notification:", error);
        return {
          success: false,
          message: error.response?.data?.message || error.message || "Failed to send notification",
        };
      } finally {
        this.isSending = false;
      }
    },

    async sendToUser(payload) {
      this.isSending = true;
      try {
        const response = await api.post("/fcm/send-notification", payload);
        const statusCode = response.data.status || response.status;
        if (statusCode === 200) {
          return {
            success: true,
            message: response.data.message || "Notification sent to user",
            data: response.data,
          };
        } else {
          return {
            success: false,
            message: response.data.message || response.data.error || "Failed to send notification",
          };
        }
      } catch (error) {
        console.error("Error sending user notification:", error);
        return {
          success: false,
          message: error.response?.data?.message || error.message || "Failed to send notification",
        };
      } finally {
        this.isSending = false;
      }
    },

    async sendToAllUsers(payload) {
      this.isSending = true;
      try {
        const response = await api.post("/fcm/notify/all-users", payload);
        const statusCode = response.data.status || response.status;
        if (statusCode === 200) {
          return {
            success: true,
            message: response.data.message || "Broadcast notification sent to all users",
            data: response.data,
          };
        } else {
          return {
            success: false,
            message: response.data.message || response.data.error || "Failed to send broadcast",
          };
        }
      } catch (error) {
        console.error("Error broadcasting notification:", error);
        return {
          success: false,
          message: error.response?.data?.message || error.message || "Failed to send broadcast",
        };
      } finally {
        this.isSending = false;
      }
    },

    async deleteNotification(id) {
      try {
        const response = await api.delete(`/notification/${id}`);
        const statusCode = response.data.status || response.status;
        if (statusCode === 200) {
          return {
            success: true,
            message: response.data.message || "Notification deleted",
          };
        }
        return {
          success: false,
          message: response.data.message || "Failed to delete notification",
        };
      } catch (error) {
        console.error("Error deleting notification:", error);
        return {
          success: false,
          message: error.response?.data?.message || error.message || "Error deleting notification",
        };
      }
    },
  },
});