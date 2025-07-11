// Shared grievance data for the application
export interface GrievanceData {
  id: string;
  registerId?: string;
  Name: string;
  name?: string; // alias for Name
  gender: string;
  branch: string;
  email: string;
  problem: string;
  type: string;
  status: string;
  priority: string;
  date: string;
  mobileNumber?: string;
}

export const grievancesData: GrievanceData[] = [
  {
    id: 'GRV001',
    registerId: '2200030939',
    Name: 'Bhanu Prakash',
    name: 'Bhanu Prakash',
    gender: 'Male',
    branch: 'CSE-Honors',
    email: '2200030939@kluniversity.in',
    problem: 'WiFi connectivity issues in hostel rooms causing disruption to online classes',
    type: 'Administrative',
    status: 'Pending',
    priority: 'High',
    date: '2025-06-28',
    mobileNumber: '9876543210'
  },
  {
    id: 'GRV002',
    registerId: '2200033156',
    Name: 'GN Rohit',
    name: 'GN Rohit',
    gender: 'Male',
    branch: 'CSE-Honors',
    email: '2200030156@kluniversity.in',
    problem: 'Incorrect attendance marking in Mathematics course affecting overall grades',
    type: 'Academic',
    status: 'In Progress',
    priority: 'Medium',
    date: '2025-06-27',
    mobileNumber: '9876543211'
  },
  {
    id: 'GRV003',
    registerId: '2200031469',
    Name: 'Adari Dinesh Srisanth',
    name: 'Adari Dinesh Srisanth',
    gender: 'Male',
    branch: 'CSE-Honors',
    email: '2200031469@kluniversity.in',
    problem: 'Need medical certificate verification for semester examination',
    type: 'Personal',
    status: 'Resolved',
    priority: 'Low',
    date: '2025-06-26',
    mobileNumber: '9876543212'
  },
  {
    id: 'GRV004',
    registerId: '2200032955',
    Name: 'Manish Raj',
    name: 'Manish Raj',
    gender: 'Male',
    branch: 'CSE-Honors',
    email: '2200032955@kluniversity.in',
    problem: 'Broken classroom furniture in block-15, room 301 affecting learning environment',
    type: 'Administrative',
    status: 'Pending',
    priority: 'High',
    date: '2025-06-25',
    mobileNumber: '9876543213'
  },
  {
    id: 'GRV005',
    registerId: '2200033158',
    Name: 'Shreyas Raj',
    name: 'Shreyas Raj',
    gender: 'Male',
    branch: 'CSE-Honors',
    email: '2200033158@kluniversity.in',
    problem: 'Drinking water filter not working properly in academic block causing health concerns',
    type: 'Administrative',
    status: 'Resolved',
    priority: 'Medium',
    date: '2025-06-24',
    mobileNumber: '9876543214'
  },
  {
    id: 'GRV006',
    registerId: '2200033180',
    Name: 'Ashish Ranjan',
    name: 'Ashish Ranjan',
    gender: 'Male',
    branch: 'CSE-Honors',
    email: '2200033180@kluniversity.in',
    problem: 'Defective computer equipment in programming lab affecting practical sessions',
    type: 'Academic',
    status: 'In Progress',
    priority: 'High',
    date: '2025-06-23',
    mobileNumber: '9876543215'
  },
  {
    id: 'GRV007',
    registerId: '2200030845',
    Name: 'Priya Sharma',
    name: 'Priya Sharma',
    gender: 'Female',
    branch: 'ECE',
    email: '2200030845@kluniversity.in',
    problem: 'Library books not available for electronics course reference material',
    type: 'Academic',
    status: 'Pending',
    priority: 'Medium',
    date: '2025-06-22',
    mobileNumber: '9876543216'
  },
  {
    id: 'GRV008',
    registerId: '2200031278',
    Name: 'Rajesh Kumar',
    name: 'Rajesh Kumar',
    gender: 'Male',
    branch: 'MECH',
    email: '2200031278@kluniversity.in',
    problem: 'Workshop equipment maintenance required for mechanical engineering lab',
    type: 'Academic',
    status: 'Resolved',
    priority: 'High',
    date: '2025-06-21',
    mobileNumber: '9876543217'
  },
  {
    id: 'GRV009',
    registerId: '2200032156',
    Name: 'Anita Reddy',
    name: 'Anita Reddy',
    gender: 'Female',
    branch: 'CIVIL',
    email: '2200032156@kluniversity.in',
    problem: 'Hostel room air conditioning not working during summer season',
    type: 'Administrative',
    status: 'In Progress',
    priority: 'High',
    date: '2025-06-20',
    mobileNumber: '9876543218'
  },
  {
    id: 'GRV010',
    registerId: '2200033945',
    Name: 'Vikram Singh',
    name: 'Vikram Singh',
    gender: 'Male',
    branch: 'IT',
    email: '2200033945@kluniversity.in',
    problem: 'Fee payment portal showing incorrect balance after scholarship application',
    type: 'Administrative',
    status: 'Pending',
    priority: 'Medium',
    date: '2025-06-19',
    mobileNumber: '9876543219'
  }
];

// Helper functions to get filtered data
export const getRecentGrievances = (limit = 5) => {
  return grievancesData
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

export const getAllGrievances = () => {
  return grievancesData;
};

export const getGrievancesByStatus = (status: string) => {
  return grievancesData.filter(grievance => grievance.status === status);
};

export const getGrievancesByType = (type: string) => {
  return grievancesData.filter(grievance => grievance.type === type);
};

export const getGrievancesByPriority = (priority: string) => {
  return grievancesData.filter(grievance => grievance.priority === priority);
};
