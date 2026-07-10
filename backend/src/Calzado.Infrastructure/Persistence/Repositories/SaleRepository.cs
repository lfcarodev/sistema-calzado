using Calzado.Application.Interfaces;
using Calzado.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Calzado.Infrastructure.Persistence.Repositories;

public class SaleRepository : ISaleRepository
{
    private readonly CalzadoDbContext _context;

    public SaleRepository(CalzadoDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(
        Sale sale,
        CancellationToken cancellationToken = default)
    {
        await _context.Sales.AddAsync(sale, cancellationToken);
    }

    public async Task<string?> GetLastNumberAsync(
        int year,
        CancellationToken cancellationToken = default)
    {
        return await _context.Sales
            .Where(s => s.Number.StartsWith($"{year}-"))
            .OrderByDescending(s => s.Number)
            .Select(s => s.Number)
            .FirstOrDefaultAsync(cancellationToken);
    }
}