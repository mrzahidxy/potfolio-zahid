import React, { createContext, useEffect, useReducer, ReactNode } from "react";

// Define the type for the initial state
interface State {
  currentUser: {
    accessToken: string;
  } | null;
}

// Define the action types
type Action =
  | { type: "LOGIN"; payload: { accessToken: string } }
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

// Define the initial state
const initialState: State = {
  currentUser: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem("currentUser")!)
    : null,
};

// Reducer function with state and action types
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

// Create context with the initial state type
export const AuthContext = createContext<AuthContextType>({
  currentUser: initialState.currentUser,
  dispatch: () => null,
});

// AuthProvider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
  }, [state]);

  return (
    <AuthContext.Provider value={{ currentUser: state.currentUser, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
