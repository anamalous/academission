import {createContext, useState, useContext} from 'react';
const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo')) || null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const login = (userData) => {
        setUser(userData);setIsAuthenticated(true);
        localStorage.setItem('userInfo', JSON.stringify(userData));
    };

    const updateSubscriptions = (newSubscriptions) => {
        const updatedUser = { ...user, subscriptions: newSubscriptions };
        setUser(updatedUser);
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    const contextValue = {user,login,logout,updateSubscriptions,isAuthenticated: !!user,};
    return (<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>);
};

export const useAuth = () => useContext(AuthContext);
