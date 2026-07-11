using MediatR;

namespace Calzado.Application.Products.Commands.UpdateProduct;

public record UpdateProductCommand(
    int Id,
    string Color,
    int CurveStart,
    int CurveEnd,
    decimal? SalePrice,
    string? PhotoPath,
    int SupplierId
) : IRequest;