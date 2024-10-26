import React, {
  createContext,
  useEffect,
  useReducer,
  ReactNode,
  useMemo,
} from "react";

// Define the type for the initial state
interface State {
  currentUser: {
    accessToken: string;
  } | null;
}

// Define the action types
type Action = { type: "LOGIN"; payload: { accessToken: string } } | { type: "LOGOUT" };

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
  currentUser: { accessToken: "" }, 
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
        currentUser: { accessToken: "" }, 
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

  const contextValue = useMemo(
    () => ({ currentUser: state.currentUser, dispatch }),
    [state.currentUser, dispatch]
  );

  useEffect(() => {
    // Load user data only on the client side
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      dispatch({ type: "LOGIN", payload: userData });
    }
  }, []); // Only runs once on mount

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
  }, [state.currentUser]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
