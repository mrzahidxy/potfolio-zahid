"use client";

import React, {
  createContext,
  useEffect,
  useReducer,
  ReactNode,
} from "react";

interface AuthUser {
  accessToken: string;
  email?: string;
  isAdmin?: boolean;
}

// Define the type for the initial state
interface State {
  currentUser: AuthUser | null;
}

// Define the action types
type Action =
  | { type: "LOGIN"; payload: AuthUser }
  | { type: "LOGOUT" };

// Define the context type
interface AuthContextType {
  currentUser: State["currentUser"];
  dispatch: React.Dispatch<Action>;
}

// AuthProvider component with children prop type
interface AuthProviderProps {
  children: ReactNode;
}

// Safely get initial user from localStorage
const getInitialUser = (): State["currentUser"] => {
  if (typeof window === "undefined") return null;
  const storedUser = localStorage.getItem("currentUser");
  try {
    const parsed = storedUser ? JSON.parse(storedUser) : null;
    return parsed && typeof parsed.accessToken === "string" ? parsed : null;
  } catch {
    localStorage.removeItem("currentUser");
    return null;
  }
};

// Initial state
const initialState: State = {
  currentUser: getInitialUser(),
}; 

// Reducer function
const authReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "LOGIN":
      return {
        currentUser: action.payload,
      };
    case "LOGOUT":
      return {
        currentUser: null,
      };
    default:
      return state;
  }
};

// Create context
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  dispatch: () => {},
});

// AuthProvider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (state.currentUser) {
        localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
      } else {
        localStorage.removeItem("currentUser");
      }
    }
  }, [state.currentUser]);

  return (
    <AuthContext.Provider
      value={{ currentUser: state.currentUser, dispatch }}
    >
      {children}
    </AuthContext.Provider>
  );
};
