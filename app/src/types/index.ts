export interface UserProfile {
  id?: string;
  name: string;
  mobileNumber: string;
  address: string;
  societyBuilding?: string | null;
  flatUnit?: string | null;
  businessName?: string | null;
}

export interface User {
  id: string;
  email: string;
  isVerified: boolean;
  hasCompletedProfile: boolean;
  profile?: UserProfile | null;
}

export interface Task {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  iconName: string;
  categoryName?: string;
}

export interface TaskCategory {
  id: string;
  name: string;
  description: string;
  iconName: string;
  displayOrder: number;
  tasks: Task[];
}

export interface SelectedTask extends Task {
  selectedAt?: string;
}
