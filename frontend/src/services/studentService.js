import API from "./api";

// Dashboard Stats
export const getStudentDashboardStats = async () => {
    const { data } = await API.get("/student/dashboard");
    return data;
};

// Profile
export const getStudentProfile = async () => {
    const { data } = await API.get("/student/profile");
    return data;
};

export const updateStudentProfile = async (profileData) => {
    const { data } = await API.put("/student/profile", profileData);
    return data;
};

// Attendance
export const getStudentAttendance = async () => {
    const { data } = await API.get("/student/attendance");
    return data;
};

// Results
export const getStudentResults = async () => {
    const { data } = await API.get("/student/results");
    return data;
};

// Notifications
export const getStudentNotifications = async () => {
    const { data } = await API.get("/student/notifications");
    return data;
};

// Grievances
export const submitGrievance = async (grievanceData) => {
    const { data } = await API.post("/student/grievance", grievanceData);
    return data;
};

export const getStudentGrievances = async () => {
    const { data } = await API.get("/student/grievances");
    return data;
};

// Gatepass
export const requestGatepass = async (gatepassData) => {
    const { data } = await API.post("/student/gatepass", gatepassData);
    return data;
};

export const getStudentGatepasses = async () => {
    const { data } = await API.get("/student/gatepasses");
    return data;
};

// Fees
export const getStudentFees = async () => {
    const { data } = await API.get("/student/fees");
    return data;
};

// Courses (dept/semester match)
export const getStudentCourses = async () => {
    const { data } = await API.get("/student/courses");
    return data;
};

// Exams
export const getStudentExamSchedule = async () => {
    const { data } = await API.get("/student/exams");
    return data;
};

// Course Registration
export const getAllCourses = async () => {
    const { data } = await API.get("/student/all-courses");
    return data;
};

export const enrollCourse = async (courseId) => {
    const { data } = await API.post("/student/enroll", { courseId });
    return data;
};

export const dropCourse = async (courseId) => {
    const { data } = await API.delete(`/student/enroll/${courseId}`);
    return data;
};

export const getEnrolledCourses = async () => {
    const { data } = await API.get("/student/enrolled");
    return data;
};

// Timetable
export const getStudentTimetable = async (params) => {
    const { data } = await API.get("/timetable", { params });
    return data;
};
