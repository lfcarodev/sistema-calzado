using Calzado.Domain.Entities;

namespace Calzado.Application.Interfaces;

public interface IStockMovementRepository
{
    Task AddAsync(
        StockMovement movement,
        CancellationToken cancellationToken = default);

    Task<List<StockMovement>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<int> CountLowStockProductsAsync(CancellationToken cancellationToken);
}
