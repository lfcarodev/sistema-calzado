using MediatR;

namespace Calzado.Application.StockMovements.Commands.RegisterExit;

public record RegisterExitCommand(
    int ProductId,
    int Quantity,
    string? Observation
) : IRequest;