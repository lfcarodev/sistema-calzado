using MediatR;

namespace Calzado.Application.Sales.Commands.CreateSale;

public record CreateSaleCommand(
    string CustomerName,
    string? Phone,
    string? Observation,
    List<CreateSaleItemDto> Items
) : IRequest<string>;