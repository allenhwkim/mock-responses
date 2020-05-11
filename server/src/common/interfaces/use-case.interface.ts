export interface UseCase {
  id?: string;
  name?: string;
  description?: string;
  useCaseIds?: Array<number>;
  mockResponseIds?: Array<number>;
};
