export interface EnterpriseSolution {
  _id?: string;
  name: string;
  description: string;
  targetInstitutions: string[];
  features: string[];
  isWhiteLabel: boolean;
  hasAnalyticsDashboards: boolean;
  hasCohortTracking: boolean;
  hasBulkUserManagement: boolean;
  minUsers?: number;
  contactSalesRequired: boolean;
}
