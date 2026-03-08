import { createContext, useState, useEffect } from "react";
import { setToken, getToken, removeToken } from "../utils/tokenHandler";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from local storage on refresh (Bypass Mode)
    useEffect(() => {
        const token = getToken();
        if (token === "dummy_token") {
            const savedUser = JSON.parse(localStorage.getItem("active_user"));
            if (savedUser) {
                setUser(savedUser);
            }
        } else {
            // Clear any old real tokens
            removeToken();
        }
        setLoading(false);
    }, []);

    // Login function (Bypass Mode)
    const login = async (credentials) => {
        // Create a dummy user object based on the login input
        const dummyUser = {
            id: "dummy_" + Math.random().toString(36).substr(2, 9),
            name: credentials.email.split("@")[0].charAt(0).toUpperCase() + credentials.email.split("@")[0].slice(1),
            email: credentials.email,
            role: credentials.role || "student", 
            department: "Computer Science",
            semester: 6,
            enrollmentNo: "DEMO-" + Math.floor(100000 + Math.random() * 900000),
            isActive: true
        };

        setToken("dummy_token");
        localStorage.setItem("active_user", JSON.stringify(dummyUser));
        setUser(dummyUser);

        // Redirect based on role
        if (dummyUser.role === "student") {
            navigate("/student/dashboard");
        } else if (dummyUser.role === "faculty") {
            navigate("/faculty/dashboard");
        } else if (dummyUser.role === "admin") {
            navigate("/admin/dashboard");
        } else if (dummyUser.role === "parent") {
            navigate("/parent/dashboard");
        } else if (dummyUser.role === "warden") {
            navigate("/warden/dashboard");
        } else {
            navigate("/login");
        }
    };

    const logout = () => {
        removeToken();
        localStorage.removeItem("active_user");
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
