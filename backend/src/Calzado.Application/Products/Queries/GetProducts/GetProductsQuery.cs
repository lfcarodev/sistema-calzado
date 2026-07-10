using MediatR;

namespace Calzado.Application.Products.Queries.GetProducts;

public record GetProductsQuery()
    : IRequest<List<ProductDto>>;