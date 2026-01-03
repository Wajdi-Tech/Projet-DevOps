import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ToastrService } from 'ngx-toastr';

interface Product {
  id?: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  imageURL?: string;
}

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  newProduct: Product = {
    name: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    imageURL: ''
  };

  isModalOpen = false;
  productToDelete: Product | null = null;
  selectedProduct: Product | null = null;
  selectedFileForUpdate: File | null = null;
  selectedFile: File | null = null;

  isSubmitting = false;
  showForm: boolean = false;
  searchTerm: string = '';

  constructor(
    private productService: ProductService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.fetchProducts();
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onFileSelectedUpdate(event: any): void {
    this.selectedFileForUpdate = event.target.files[0];
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data.map(product => ({
          id: product.ID,
          name: product.Name?.replace(/\"/g, '') ?? product.Name,
          description: product.Description?.replace(/\"/g, '') ?? product.Description,
          category: product.Category?.replace(/\"/g, '') ?? product.Category,
          price: product.Price,
          stock: product.Stock,
          imageURL: product.ImageURL
        }));
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.toastr.error('Failed to load products');
      }
    });
  }

  createProduct(): void {
    const token = localStorage.getItem('tokenAdmin');
    if (!token) {
      this.toastr.warning('Not authenticated!');
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();
    formData.append('name', this.newProduct.name);
    formData.append('description', this.newProduct.description);
    formData.append('category', this.newProduct.category);
    formData.append('price', this.newProduct.price.toString());
    formData.append('stock', this.newProduct.stock.toString());

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.productService.createProduct(formData, token).subscribe({
      next: () => {
        this.toastr.success('Product created successfully!');
        this.isSubmitting = false;
        this.fetchProducts();
        this.newProduct = { name: '', description: '', category: '', price: 0, stock: 0, imageURL: '' };
        this.selectedFile = null;
        this.showForm = false;
      },
      error: (error) => {
        this.isSubmitting = false;
        if (error.status === 401) {
          this.handleAuthError();
        } else {
          this.toastr.error('Failed to create product.');
        }
      }
    });
  }

  selectProduct(product: Product): void {
    this.selectedProduct = { ...product };
  }

  cancelEdit(): void {
    this.selectedProduct = null;
    this.selectedFileForUpdate = null;
  }

  updateProduct(): void {
    if (!this.selectedProduct?.id) return;

    const token = localStorage.getItem('tokenAdmin');
    if (!token) {
      this.handleAuthError();
      return;
    }

    const formData = new FormData();
    formData.append('name', this.selectedProduct.name);
    formData.append('description', this.selectedProduct.description);
    formData.append('category', this.selectedProduct.category);
    formData.append('price', this.selectedProduct.price.toString());
    formData.append('stock', this.selectedProduct.stock.toString());

    if (this.selectedFileForUpdate) {
      formData.append('image', this.selectedFileForUpdate);
    }

    this.productService.updateProduct(this.selectedProduct.id, this.selectedFileForUpdate ? formData : this.selectedProduct, token).subscribe({
      next: () => {
        this.toastr.success('Product updated successfully!');
        this.selectedProduct = null;
        this.selectedFileForUpdate = null;
        this.fetchProducts();
      },
      error: (error) => {
        if (error.status === 401) {
          this.handleAuthError();
        } else {
          this.toastr.error('Failed to update product.');
        }
      }
    });
  }

  deleteProduct(product: Product): void {
    if (product.id === undefined) return;
    this.productToDelete = product;
    this.isModalOpen = true;
  }

  confirmDelete(): void {
    if (!this.productToDelete?.id) return;

    const token = localStorage.getItem('tokenAdmin');
    if (!token) {
      this.handleAuthError();
      return;
    }

    this.productService.deleteProduct(this.productToDelete.id, token).subscribe({
      next: () => {
        this.toastr.success('Product deleted successfully!');
        this.isModalOpen = false;
        this.productToDelete = null;
        this.fetchProducts();
      },
      error: (error) => {
        if (error.status === 401) {
          this.handleAuthError();
        } else {
          this.toastr.error('Failed to delete product.');
        }
      }
    });
  }

  cancelDelete(): void {
    this.isModalOpen = false;
    this.productToDelete = null;
  }

  private handleAuthError() {
    this.toastr.warning('Session expired! Please log in again.');
    localStorage.removeItem('tokenAdmin');
    window.location.href = '/login';
  }

  get filteredProducts(): Product[] {
    if (!this.searchTerm) return this.products;
    const term = this.searchTerm.toLowerCase();
    return this.products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    );
  }
}

