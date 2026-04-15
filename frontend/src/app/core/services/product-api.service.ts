import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateProductRequest, Product, UpdateProductRequest } from '../../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/products`;

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  createProduct(payload: CreateProductRequest): Observable<{ id: number; message: string }> {
    return this.http.post<{ id: number; message: string }>(this.baseUrl, payload);
  }

  updateProduct(id: number, payload: UpdateProductRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  }
}
