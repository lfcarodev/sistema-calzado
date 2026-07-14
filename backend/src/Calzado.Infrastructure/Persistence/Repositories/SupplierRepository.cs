using Calzado.Application.Interfaces;
using Calzado.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Calzado.Infrastructure.Persistence.Repositories;

public class SupplierRepository : ISupplierRepository
{
    private readonly CalzadoDbContext _context;

    public SupplierRepository(CalzadoDbContext context)
    {
        _context = context;
    }

    public async Task<Supplier?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        return await _context.Suppliers
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<List<Supplier>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        return await _context.Suppliers
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(
    Supplier supplier,
    CancellationToken cancellationToken = default)
    {
        await _context.Suppliers.AddAsync(supplier, cancellationToken);
    }
}
