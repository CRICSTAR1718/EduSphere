const testLogin = async () => {
    try {
        const response = await fetch("http://localhost:5001/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "admin@edusphere.com", password: "password123" })
        });
        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Response:", data);
    } catch (error) {
        console.error("Fetch error:", error);
    }
};
testLogin();
