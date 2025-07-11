import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User } from '../types/api';
import { authAPI, apiUtils } from '../services/api';

// Auth State
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth Actions
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_ERROR'; payload: string };

// Initial State
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

// Auth Context
interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const response = await authAPI.login({ email, password });
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.user,
          token: response.token,
        },
      });
    } catch (error: any) {
      const apiError = apiUtils.handleError(error);
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: apiError.message,
      });
      throw error;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Register function
  const register = async (userData: any): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await authAPI.register(userData);
      
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error: any) {
      const apiError = apiUtils.handleError(error);
      dispatch({ type: 'SET_ERROR', payload: apiError.message });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  // Update user function
  const updateUser = (userData: Partial<User>): void => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      dispatch({ type: 'SET_USER', payload: updatedUser });
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Check authentication function
  const checkAuth = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const token = localStorage.getItem('authToken');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        // Verify token with backend
        try {
          const currentUser = await authAPI.getCurrentUser();
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: currentUser,
              token,
            },
          });
        } catch (error) {
          // Token is invalid, clear local storage
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      dispatch({ type: 'LOGOUT' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const contextValue: AuthContextType = {
    state,
    login,
    logout,
    register,
    updateUser,
    clearError,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// HOC for protected routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const { state } = useAuth();
    
    if (state.isLoading) {
      return <div>Loading...</div>;
    }
    
    if (!state.isAuthenticated) {
      window.location.href = '/sign-in';
      return null;
    }
    
    return <Component {...props} />;
  };
};

// Component to check authentication
export const AuthGuard: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { state } = useAuth();
  
  if (state.isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!state.isAuthenticated) {
    window.location.href = '/sign-in';
    return null;
  }
  
  return <>{children}</>;
};

export default AuthContext;
