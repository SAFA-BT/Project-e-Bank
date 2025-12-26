import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Constants
const API_URL = "http://localhost:8080";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            // Decode token to get role/username or just trust it for now
            // In a real app we might fetch user details here
            const role = localStorage.getItem("role");
            setUser({ role, token });
        } else {
            delete axios.defaults.headers.common["Authorization"];
            setUser(null);
        }
    }, [token]);

    const login = async (username, password) => {
        try {
            const res = await axios.post(`${API_URL}/login`, { username, password });
            const { token, role } = res.data;
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
            setToken(token);
            return { success: true };
        } catch (error) {
            console.error("Login failed", error);
            let errorMessage = "Login failed";
            if (error.response) {
                // Server responded with a status code other than 2xx
                errorMessage = error.response.data?.message || `Error: ${error.response.status}`;
            } else if (error.request) {
                // Request made but no response received
                errorMessage = "No response from server (Network Error?)";
            } else {
                // Something else happened
                errorMessage = error.message;
            }
            return { success: false, error: errorMessage };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
