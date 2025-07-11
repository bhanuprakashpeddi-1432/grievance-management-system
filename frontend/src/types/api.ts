// Type definitions for the Grievance Management System API

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'user' | 'staff';
  phone?: string;
  department?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GrievanceCategory {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Grievance {
  id: number;
  title: string;
  description: string;
  category_id?: number;
  category?: GrievanceCategory;
  user_id: number;
  user?: User;
  assigned_to?: number;
  assignee?: User;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'resolved' | 'closed' | 'rejected';
  submission_date: string;
  due_date?: string;
  resolution_date?: string;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface GrievanceComment {
  id: number;
  grievance_id: number;
  user_id: number;
  user?: User;
  comment: string;
  is_internal: boolean;
  created_at: string;
  updated_at: string;
}

export interface GrievanceAttachment {
  id: number;
  grievance_id: number;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_by: number;
  uploader?: User;
  uploaded_at: string;
}

export interface GrievanceStatusHistory {
  id: number;
  grievance_id: number;
  old_status: string;
  new_status: string;
  changed_by: number;
  changer?: User;
  change_reason?: string;
  changed_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  grievance_id?: number;
  grievance?: Grievance;
  is_read: boolean;
  created_at: string;
}

export interface DashboardStats {
  total_grievances: number;
  pending_grievances: number;
  in_progress_grievances: number;
  resolved_grievances: number;
  closed_grievances: number;
  urgent_grievances: number;
  high_priority_grievances: number;
  active_users: number;
  today_grievances: number;
  this_week_grievances: number;
  this_month_grievances: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}

export interface Activity {
  id: number;
  type: 'grievance_created' | 'grievance_updated' | 'comment_added' | 'status_changed';
  title: string;
  description: string;
  user_id: number;
  user?: User;
  grievance_id?: number;
  grievance?: Grievance;
  created_at: string;
}

export interface Trend {
  period: string;
  value: number;
  change: number;
  change_percentage: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
  data?: any;
}

export interface LoginResponse {
  token: string;
  user: User;
  expires_at: string;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// Form Data Types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  department?: string;
}

export interface GrievanceFormData {
  title: string;
  description: string;
  category_id?: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
}

export interface GrievanceUpdateData {
  title?: string;
  description?: string;
  category_id?: number;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  assigned_to?: number;
  status?: 'pending' | 'in_progress' | 'resolved' | 'closed' | 'rejected';
  resolution_notes?: string;
}

export interface CommentData {
  comment: string;
  is_internal?: boolean;
}

export interface StatusUpdateData {
  status: 'pending' | 'in_progress' | 'resolved' | 'closed' | 'rejected';
  reason?: string;
}

export interface UserUpdateData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  department?: string;
}

export interface PasswordChangeData {
  current_password: string;
  new_password: string;
}

export interface CategoryData {
  name: string;
  description?: string;
  is_active?: boolean;
}

// Query Parameters
export interface GrievanceQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  category_id?: number;
  assigned_to?: number;
  user_id?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  date_from?: string;
  date_to?: string;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  role?: string;
  is_active?: boolean;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  is_read?: boolean;
  type?: string;
}

// Chart Types
export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins?: {
    legend?: {
      display: boolean;
      position?: 'top' | 'bottom' | 'left' | 'right';
    };
    tooltip?: {
      enabled: boolean;
    };
  };
  scales?: {
    x?: {
      display: boolean;
      title?: {
        display: boolean;
        text: string;
      };
    };
    y?: {
      display: boolean;
      title?: {
        display: boolean;
        text: string;
      };
    };
  };
}

// Status and Priority Labels
export const STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
  rejected: 'Rejected',
} as const;

export const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
} as const;

export const ROLE_LABELS = {
  admin: 'Administrator',
  staff: 'Staff',
  user: 'User',
} as const;

// Status Colors
export const STATUS_COLORS = {
  pending: '#ffc107',
  in_progress: '#007bff',
  resolved: '#28a745',
  closed: '#6c757d',
  rejected: '#dc3545',
} as const;

export const PRIORITY_COLORS = {
  low: '#28a745',
  medium: '#ffc107',
  high: '#fd7e14',
  urgent: '#dc3545',
} as const;
