using MediatR;

namespace Calzado.Application.Products.Commands.CreateProduct;

public record CreateProductCommand(
    string Reference,
    string Color,
    int CurveStart,
    int CurveEnd,
    decimal? SalePrice,
    string? PhotoPath,
    int SupplierId
) : IRequest<int>;