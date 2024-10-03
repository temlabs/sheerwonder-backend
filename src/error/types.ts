export interface ErrorResponse<T = string> {
  code: number;
  field?: T;
  message: string;
  internalCode: string;
}
