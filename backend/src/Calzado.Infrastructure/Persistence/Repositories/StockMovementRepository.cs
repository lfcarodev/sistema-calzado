using Calzado.Application.Interfaces;
using Calzado.Domain.Entities;
using Microsoft.EntityFrameworkCore;

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

    public async Task<List<StockMovement>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.StockMovements.Include(m => m.Product)
            .OrderByDescending(m => m.CreatedAt).ToListAsync(cancellationToken);
    }

    public async Task<int> CountLowStockProductsAsync(
    CancellationToken cancellationToken)
    {
        return await _context.Products
            .CountAsync(
                x => x.CurrentStock <= 5,
                cancellationToken);
    }
}
