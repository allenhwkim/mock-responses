export interface UseCase {
  id?: string;
  name?: string;
  description?: string;
  mockResponses?: Array<any>;
  useCases?: Array<any>;
  created_at?: number | Date;
  created_by?: string;
  updated_at?: number | Date;
  updated_by?: string
};
