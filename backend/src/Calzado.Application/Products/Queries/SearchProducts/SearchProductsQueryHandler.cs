using Calzado.Application.Interfaces;
using Calzado.Application.Products.Queries.GetProducts;
using MediatR;

namespace Calzado.Application.Products.Queries.SearchProducts;

public class SearchProductsQueryHandler
    : IRequestHandler<SearchProductsQuery, List<ProductDto>>
{
    private readonly IProductRepository _productRepository;

    public SearchProductsQueryHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<List<ProductDto>> Handle(
        SearchProductsQuery request,
        CancellationToken cancellationToken)
    {
        var products = await _productRepository.SearchByReferenceAsync(
            request.Reference,
            cancellationToken);

        return products.Select(product => new ProductDto
        {
            Id = product.Id,
            Reference = product.Reference,
            Color = product.Color,
            Curve = product.Curve.ToString(),
            CurrentStock = product.CurrentStock,
            SalePrice = product.SalePrice,
            PhotoPath = product.PhotoPath,
            SupplierId = product.SupplierId,
            Supplier = product.Supplier.Name
        }).ToList();
    }
}
