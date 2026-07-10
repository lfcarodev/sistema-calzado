using Calzado.Domain.Entities;

namespace Calzado.Application.Interfaces;

public interface IStockMovementRepository
{
    Task AddAsync(
        StockMovement movement,
        CancellationToken cancellationToken = default);
}