import { createContext, useState, useEffect, useContext } from "react";
import { setToken, getToken, removeToken } from "../utils/tokenHandler";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On app load: if token exists, verify it by calling /auth/me
    useEffect(() => {
        const loadUser = async () => {
            const token = getToken();
            if (token) {
                try {
                    const response = await API.get("/auth/me");
                    setUser(response.data);
                } catch (err) {
                    // Token is invalid or expired
                    console.error("Token verification failed:", err);
                    removeToken();
                    localStorage.removeItem("active_user");
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    
    // Login function — calls real API
    const login = async (credentials) => {
        try {
            const response = await API.post("/auth/login", {
                email: credentials.email,
                password: credentials.password,
                role: credentials.role,
            });

            const { token, user: userData } = response.data;

            setToken(token);
            localStorage.setItem("active_user", JSON.stringify(userData));
            setUser(userData);

            // Redirect based on role
            const role = userData.role;
            if (role === "student") {
                navigate("/student/dashboard");
            } else if (role === "faculty") {
                navigate("/faculty/dashboard");
            } else if (role === "admin") {
                navigate("/admin/dashboard");
            } else if (role === "parent") {
                navigate("/parent/dashboard");
            } else if (role === "warden") {
                navigate("/warden/dashboard");
            } else {
                navigate("/login");
            }

            return { success: true };
        } catch (error) {
            const message =
                error.response?.data?.message || "Login failed. Please try again.";
            return { success: false, message };
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
