using Calzado.Application.Interfaces;
using Calzado.Application.Products.Queries.GetProducts;
using MediatR;

namespace Calzado.Application.Products.Queries.GetProductById;

public class GetProductByIdQueryHandler
    : IRequestHandler<GetProductByIdQuery, ProductDto?>
{
    private readonly IProductRepository _productRepository;

    public GetProductByIdQueryHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<ProductDto?> Handle(
        GetProductByIdQuery request,
        CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (product is null)
        {
            return null;
        }

        return new ProductDto
        {
            Id = product.Id,
            Reference = product.Reference,
            Color = product.Color,
            Curve = product.Curve.ToString(),
            CurrentStock = product.CurrentStock,
            SalePrice = product.SalePrice,
            Supplier = product.Supplier.Name
        };
    }
}