import React, { useState } from "react";

type AppState = {
    user: object | null;
    token: string | null;
};

type AppContextProps = {
    state: AppState;
    setState: React.Dispatch<React.SetStateAction<AppState>>;
};

export const AuthContext = React.createContext<AppContextProps | undefined>(undefined);

export function useAuth() {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

type AuthProviderProps = {
    children: React.ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, setState] = useState<AppState>({
        user: null,
        token: null,
    });


    return (
        <AuthContext.Provider value={{ state,setState }}>
            {children}
        </AuthContext.Provider>
    );
}
