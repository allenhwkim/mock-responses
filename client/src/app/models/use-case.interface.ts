export interface UseCase {
  id?: string;
  name?: string;
  description?: string;
  mockResponses?: Array<any>;
  useCases?: Array<any>;
};
