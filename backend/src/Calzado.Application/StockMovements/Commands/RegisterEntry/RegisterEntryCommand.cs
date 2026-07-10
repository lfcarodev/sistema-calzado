using MediatR;

namespace Calzado.Application.StockMovements.Commands.RegisterEntry;

public record RegisterEntryCommand(
    int ProductId,
    int Quantity,
    string? Observation
) : IRequest;