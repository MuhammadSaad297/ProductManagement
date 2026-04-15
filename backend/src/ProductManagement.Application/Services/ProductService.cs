using ProductManagement.Application.DTOs;
using ProductManagement.Application.Exceptions;
using ProductManagement.Application.Interfaces;
using ProductManagement.Domain.Entities;

namespace ProductManagement.Application.Services;

public sealed class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;

    public ProductService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<IReadOnlyList<ProductDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var products = await _productRepository.GetAllAsync(cancellationToken);
        return products.Select(MapToDto).ToArray();
    }

    public async Task<ProductDto> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        if (id <= 0)
        {
            throw new AppValidationException(new[] { "Product id must be greater than zero." });
        }

        var product = await _productRepository.GetByIdAsync(id, cancellationToken);
        if (product is null)
        {
            throw new NotFoundException($"Product with id {id} was not found.");
        }

        return MapToDto(product);
    }

    public async Task<int> CreateAsync(CreateProductRequest request, CancellationToken cancellationToken = default)
    {
        ValidateCreateRequest(request);

        var product = new Product
        {
            Name = request.Name.Trim(),
            Description = request.Description.Trim(),
            Price = request.Price,
            StockQuantity = request.StockQuantity,
            IsActive = request.IsActive
        };

        return await _productRepository.CreateAsync(product, cancellationToken);
    }

    public async Task UpdateAsync(int id, UpdateProductRequest request, CancellationToken cancellationToken = default)
    {
        if (id <= 0)
        {
            throw new AppValidationException(new[] { "Product id must be greater than zero." });
        }

        ValidateUpdateRequest(request);

        var updated = await _productRepository.UpdateAsync(new Product
        {
            Id = id,
            Name = request.Name.Trim(),
            Description = request.Description.Trim(),
            Price = request.Price,
            StockQuantity = request.StockQuantity,
            IsActive = request.IsActive
        }, cancellationToken);

        if (!updated)
        {
            throw new NotFoundException($"Product with id {id} was not found.");
        }
    }

    private static void ValidateCreateRequest(CreateProductRequest request)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            errors.Add("Name is required.");
        }

        if (!string.IsNullOrWhiteSpace(request.Name) && request.Name.Trim().Length > 150)
        {
            errors.Add("Name cannot exceed 150 characters.");
        }

        if (!string.IsNullOrWhiteSpace(request.Description) && request.Description.Trim().Length > 500)
        {
            errors.Add("Description cannot exceed 500 characters.");
        }

        if (request.Price < 0)
        {
            errors.Add("Price cannot be negative.");
        }

        if (request.StockQuantity < 0)
        {
            errors.Add("Stock quantity cannot be negative.");
        }

        if (errors.Count > 0)
        {
            throw new AppValidationException(errors);
        }
    }

    private static void ValidateUpdateRequest(UpdateProductRequest request)
    {
        ValidateCreateRequest(new CreateProductRequest
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            StockQuantity = request.StockQuantity,
            IsActive = request.IsActive
        });
    }

    private static ProductDto MapToDto(Product product) => new()
    {
        Id = product.Id,
        Name = product.Name,
        Description = product.Description,
        Price = product.Price,
        StockQuantity = product.StockQuantity,
        IsActive = product.IsActive,
        CreatedOnUtc = product.CreatedOnUtc,
        UpdatedOnUtc = product.UpdatedOnUtc
    };
}
