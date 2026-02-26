// Mock Data for Static Demo Mode
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const getAdminStats = async () => {
    await delay();
    return {
        students: 320,
        faculty: 28,
        notices: 5,
    };
};