import { useState, useEffect, useCallback } from 'react';
import { grievancesAPI, apiUtils } from '../services/api';
import { 
  Grievance, 
  GrievanceFormData, 
  GrievanceUpdateData, 
  GrievanceQueryParams,
  PaginatedResponse 
} from '../types/api';

interface UseGrievancesState {
  grievances: Grievance[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  } | null;
}

interface UseGrievancesReturn extends UseGrievancesState {
  fetchGrievances: (params?: GrievanceQueryParams) => Promise<void>;
  createGrievance: (data: GrievanceFormData) => Promise<Grievance>;
  updateGrievance: (id: number, data: GrievanceUpdateData) => Promise<Grievance>;
  deleteGrievance: (id: number) => Promise<void>;
  updateGrievanceStatus: (id: number, status: string, reason?: string) => Promise<void>;
  refreshGrievances: () => Promise<void>;
  clearError: () => void;
}

export const useGrievances = (initialParams?: GrievanceQueryParams): UseGrievancesReturn => {
  const [state, setState] = useState<UseGrievancesState>({
    grievances: [],
    loading: false,
    error: null,
    pagination: null,
  });

  const [currentParams, setCurrentParams] = useState<GrievanceQueryParams>(
    initialParams || {}
  );

  // Fetch grievances
  const fetchGrievances = useCallback(async (params?: GrievanceQueryParams) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const queryParams = params || currentParams;
      setCurrentParams(queryParams);
      
      const response: PaginatedResponse<Grievance> = await grievancesAPI.getAll(queryParams);
      
      setState(prev => ({
        ...prev,
        grievances: response.data,
        pagination: response.pagination,
        loading: false,
      }));
    } catch (error: any) {
      const apiError = apiUtils.handleError(error);
      setState(prev => ({
        ...prev,
        error: apiError.message,
        loading: false,
      }));
    }
  }, [currentParams]);

  // Create grievance
  const createGrievance = useCallback(async (data: GrievanceFormData): Promise<Grievance> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await grievancesAPI.create(data);
      
      // Refresh grievances list
      await fetchGrievances();
      
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      const apiError = apiUtils.handleError(error);
      setState(prev => ({
        ...prev,
        error: apiError.message,
        loading: false,
      }));
      throw error;
    }
  }, [fetchGrievances]);

  // Update grievance
  const updateGrievance = useCallback(async (id: number, data: GrievanceUpdateData): Promise<Grievance> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await grievancesAPI.update(id, data);
      
      // Update local state
      setState(prev => ({
        ...prev,
        grievances: prev.grievances.map(g => 
          g.id === id ? { ...g, ...response } : g
        ),
        loading: false,
      }));
      
      return response;
    } catch (error: any) {
      const apiError = apiUtils.handleError(error);
      setState(prev => ({
        ...prev,
        error: apiError.message,
        loading: false,
      }));
      throw error;
    }
  }, []);

  // Delete grievance
  const deleteGrievance = useCallback(async (id: number): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      await grievancesAPI.delete(id);
      
      // Remove from local state
      setState(prev => ({
        ...prev,
        grievances: prev.grievances.filter(g => g.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      const apiError = apiUtils.handleError(error);
      setState(prev => ({
        ...prev,
        error: apiError.message,
        loading: false,
      }));
      throw error;
    }
  }, []);

  // Update grievance status
  const updateGrievanceStatus = useCallback(async (
    id: number, 
    status: string, 
    reason?: string
  ): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await grievancesAPI.updateStatus(id, status, reason);
      
      // Update local state
      setState(prev => ({
        ...prev,
        grievances: prev.grievances.map(g => 
          g.id === id ? { ...g, status: status as any, ...response } : g
        ),
        loading: false,
      }));
    } catch (error: any) {
      const apiError = apiUtils.handleError(error);
      setState(prev => ({
        ...prev,
        error: apiError.message,
        loading: false,
      }));
      throw error;
    }
  }, []);

  // Refresh grievances
  const refreshGrievances = useCallback(async (): Promise<void> => {
    await fetchGrievances(currentParams);
  }, [fetchGrievances, currentParams]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchGrievances();
  }, [fetchGrievances]);

  return {
    ...state,
    fetchGrievances,
    createGrievance,
    updateGrievance,
    deleteGrievance,
    updateGrievanceStatus,
    refreshGrievances,
    clearError,
  };
};

// Hook for single grievance
interface UseGrievanceState {
  grievance: Grievance | null;
  loading: boolean;
  error: string | null;
}

interface UseGrievanceReturn extends UseGrievanceState {
  fetchGrievance: (id: number) => Promise<void>;
  updateGrievance: (data: GrievanceUpdateData) => Promise<Grievance>;
  deleteGrievance: () => Promise<void>;
  clearError: () => void;
}

export const useGrievance = (id?: number): UseGrievanceReturn => {
  const [state, setState] = useState<UseGrievanceState>({
    grievance: null,
    loading: false,
    error: null,
  });

  // Fetch single grievance
  const fetchGrievance = useCallback(async (grievanceId: number) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await grievancesAPI.getById(grievanceId);
      
      setState(prev => ({
        ...prev,
        grievance: response,
        loading: false,
      }));
    } catch (error: any) {
      const apiError = apiUtils.handleError(error);
      setState(prev => ({
        ...prev,
        error: apiError.message,
        loading: false,
      }));
    }
  }, []);

  // Update grievance
  const updateGrievance = useCallback(async (data: GrievanceUpdateData): Promise<Grievance> => {
    if (!state.grievance) throw new Error('No grievance loaded');
    
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await grievancesAPI.update(state.grievance.id, data);
      
      setState(prev => ({
        ...prev,
        grievance: prev.grievance ? { ...prev.grievance, ...response } : response,
        loading: false,
      }));
      
      return response;
    } catch (error: any) {
      const apiError = apiUtils.handleError(error);
      setState(prev => ({
        ...prev,
        error: apiError.message,
        loading: false,
      }));
      throw error;
    }
  }, [state.grievance]);

  // Delete grievance
  const deleteGrievance = useCallback(async (): Promise<void> => {
    if (!state.grievance) throw new Error('No grievance loaded');
    
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      await grievancesAPI.delete(state.grievance.id);
      
      setState(prev => ({
        ...prev,
        grievance: null,
        loading: false,
      }));
    } catch (error: any) {
      const apiError = apiUtils.handleError(error);
      setState(prev => ({
        ...prev,
        error: apiError.message,
        loading: false,
      }));
      throw error;
    }
  }, [state.grievance]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Initial fetch
  useEffect(() => {
    if (id) {
      fetchGrievance(id);
    }
  }, [id, fetchGrievance]);

  return {
    ...state,
    fetchGrievance,
    updateGrievance,
    deleteGrievance,
    clearError,
  };
};
