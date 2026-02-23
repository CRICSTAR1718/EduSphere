import { createContext, useState, useEffect } from "react";
import { setToken, getToken, removeToken } from "../utils/tokenHandler";
import { useNavigate } from "react-router-dom";
import { login as loginApi, getMe } from "../services/authService";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sessionExpiry, setSessionExpiry] = useState(null);

    // Load user from token on refresh
    useEffect(() => {
        const loadUser = async () => {
            const token = getToken();

            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    if (decoded.exp * 1000 < Date.now()) {
                        logout();
                    } else {
                        setSessionExpiry(decoded.exp * 1000);
                        try {
                            const userData = await getMe();
                            setUser(userData);
                        } catch (error) {
                            console.error("Failed to fetch user data, using decoded token");
                            setUser(decoded);
                        }
                    }
                } catch (error) {
                    console.error("Session expired or invalid token");
                    logout();
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    // Session Expiry Checker
    useEffect(() => {
        if (!user || !sessionExpiry) return;

        const interval = setInterval(() => {
            if (Date.now() > sessionExpiry) {
                alert("Session expired. Please login again.");
                logout();
            }
        }, 60000); // check every 1 min

        return () => clearInterval(interval);
    }, [user, sessionExpiry]);

    // Login function
    const login = async (credentials) => {
        try {
            const data = await loginApi(credentials);
            setToken(data.token);
            setUser(data.user);
            
            // Set session expiry
            try {
                const decoded = jwtDecode(data.token);
                setSessionExpiry(decoded.exp * 1000);
            } catch (e) {
                if (data.user.role === "faculty") {
                    setSessionExpiry(Date.now() + 24 * 60 * 60 * 1000);
                }
            }

            // Redirect based on role
            const role = data.user.role;
            switch (role) {
                case "student":
                    navigate("/student/dashboard");
                    break;
                case "faculty":
                    navigate("/faculty/dashboard");
                    break;
                case "admin":
                    navigate("/admin/dashboard");
                    break;
                case "parent":
                    navigate("/parent/dashboard");
                    break;
                case "warden":
                    navigate("/warden/dashboard");
                    break;
                default:
                    navigate("/login");
            }
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
            throw error;
        }
    };

    const logout = () => {
        removeToken();
        setUser(null);
        setSessionExpiry(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
