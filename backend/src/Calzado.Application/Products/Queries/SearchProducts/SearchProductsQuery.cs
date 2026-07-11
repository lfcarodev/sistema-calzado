using Calzado.Application.Products.Queries.GetProducts;
using MediatR;

namespace Calzado.Application.Products.Queries.SearchProducts;

public record SearchProductsQuery(
    string Reference
) : IRequest<List<ProductDto>>;