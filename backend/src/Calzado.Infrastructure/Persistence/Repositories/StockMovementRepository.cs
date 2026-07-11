using Calzado.Application.Interfaces;
using Calzado.Domain.Entities;

namespace Calzado.Infrastructure.Persistence.Repositories;

public class StockMovementRepository : IStockMovementRepository
{
    private readonly CalzadoDbContext _context;

    public StockMovementRepository(CalzadoDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(
        StockMovement movement,
        CancellationToken cancellationToken = default)
    {
        await _context.StockMovements.AddAsync(
            movement,
            cancellationToken);
    }
}