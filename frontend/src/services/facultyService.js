// Mock Data for Static Demo Mode
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const getFacultyDashboardStats = async () => {
    await delay();
    return {
        totalClasses: 24,
        students: 180,
        grievances: 3,
    };
};