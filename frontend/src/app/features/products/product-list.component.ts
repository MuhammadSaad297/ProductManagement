import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductApiService } from '../../core/services/product-api.service';
import { Product } from '../../models/product.model';
import { mapApiError } from '../../core/interceptors/api-error.interceptor';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit, OnDestroy {
  private readonly productApiService = inject(ProductApiService);
  private readonly formBuilder = inject(FormBuilder);
  private subscriptions = new Subscription();

  readonly products = signal<Product[]>([]);
  readonly isLoading = signal(false);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly selectedProductId = signal<number | null>(null);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    description: ['', [Validators.maxLength(500)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    isActive: [true]
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const subscription = this.productApiService.getProducts()
      .subscribe({
        next: (products) => {
          this.products.set(products);
          this.isLoading.set(false);
        },
        error: (error: unknown) => {
          this.errorMessage.set(mapApiError(error).message);
          this.isLoading.set(false);
        }
      });
    
    this.subscriptions.add(subscription);
  }

  editProduct(product: Product): void {
    this.selectedProductId.set(product.id);
    this.form.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      isActive: product.isActive
    });
  }

  resetForm(): void {
    this.selectedProductId.set(null);
    this.errorMessage.set('');
    this.form.reset({
      name: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      isActive: true
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const payload = this.form.getRawValue();
    const selectedId = this.selectedProductId();
    
    if (selectedId) {
      const subscription = this.productApiService.updateProduct(selectedId, payload)
        .subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.resetForm();
            this.loadProducts();
          },
          error: (error: unknown) => {
            this.isSubmitting.set(false);
            this.errorMessage.set(mapApiError(error).message);
          }
        });
      this.subscriptions.add(subscription);
    } else {
      const subscription = this.productApiService.createProduct(payload)
        .subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.resetForm();
            this.loadProducts();
          },
          error: (error: unknown) => {
            this.isSubmitting.set(false);
            this.errorMessage.set(mapApiError(error).message);
          }
        });
      this.subscriptions.add(subscription);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
