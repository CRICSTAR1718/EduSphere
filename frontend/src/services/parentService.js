import API from "./api";

// Dashboard
export const getParentDashboardStats = async (wardId) => {
    const { data } = await API.get("/parent/dashboard", { params: { wardId } });
    return data;
};

// Ward Data
export const getWardAttendance = async (wardId) => {
    const { data } = await API.get("/parent/attendance", { params: { wardId } });
    return data;
};

export const getWardResults = async (wardId) => {
    const { data } = await API.get("/parent/results", { params: { wardId } });
    return data;
};

export const getWardFees = async (wardId) => {
    const { data } = await API.get("/parent/fees", { params: { wardId } });
    return data;
};

export const getWardGatepasses = async (wardId) => {
    const { data } = await API.get("/parent/gatepasses", { params: { wardId } });
    return data;
};

export const updateWardGatepassStatus = async (id, updateData) => {
    const { data } = await API.put(`/parent/gatepasses/${id}`, updateData);
    return data;
};

// Notifications
export const getNotifications = async () => {
    const { data } = await API.get("/parent/notifications");
    return data;
};
