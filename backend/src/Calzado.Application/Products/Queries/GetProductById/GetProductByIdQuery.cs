using Calzado.Application.Products.Queries.GetProducts;
using MediatR;

namespace Calzado.Application.Products.Queries.GetProductById;

public record GetProductByIdQuery(
    int Id
) : IRequest<ProductDto?>;