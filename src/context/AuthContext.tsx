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

// Safely get initial user from localStorage
const getInitialUser = (): State["currentUser"] => {
  if (typeof window === "undefined") return null;
  const storedUser = localStorage.getItem("currentUser");
  try {
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
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
      localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
    }
  }, [state.currentUser]);

  const value = useMemo(
    () => ({ currentUser: state.currentUser, dispatch }),
    [state.currentUser, dispatch]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
