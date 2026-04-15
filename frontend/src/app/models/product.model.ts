export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  createdOnUtc: string;
  updatedOnUtc?: string | null;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
}

export interface UpdateProductRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  errors?: string[];
  traceId?: string;
}
