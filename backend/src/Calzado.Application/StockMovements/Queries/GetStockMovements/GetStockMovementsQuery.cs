using MediatR;

namespace Calzado.Application.StockMovements.Queries.GetStockMovements;

public record GetStockMovementsQuery : IRequest<List<StockMovementDto>>;

public record StockMovementDto(int Id, DateTime Date, string Type, int Quantity, string Reference, string Color, string? Observation);
