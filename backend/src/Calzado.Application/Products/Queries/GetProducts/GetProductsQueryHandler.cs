using Calzado.Application.Interfaces;
using MediatR;

namespace Calzado.Application.Products.Queries.GetProducts;

public class GetProductsQueryHandler
    : IRequestHandler<GetProductsQuery, List<ProductDto>>
{
    private readonly IProductRepository _productRepository;

    public GetProductsQueryHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<List<ProductDto>> Handle(
        GetProductsQuery request,
        CancellationToken cancellationToken)
    {
        var products = await _productRepository.GetAllAsync(cancellationToken);

        return products.Select(product => new ProductDto
        {
            Id = product.Id,
            Reference = product.Reference,
            Color = product.Color,
            Curve = product.Curve.ToString(),
            CurrentStock = product.CurrentStock,
            SalePrice = product.SalePrice,
            Supplier = product.Supplier.Name
        }).ToList();
    }
}