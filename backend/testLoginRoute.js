const axios = require("axios");

const testApiLogin = async () => {
    try {
        const response = await axios.post("http://localhost:5001/api/auth/login", {
            email: "admin@edusphere.com",
            password: "password123",
            role: "admin" // Testing with role even though authService omits it
        });
        console.log("Login Success:", response.data);
    } catch (error) {
        console.error("Login Failed:", error.response?.status, error.response?.data || error.message);
    }
};

testApiLogin();
