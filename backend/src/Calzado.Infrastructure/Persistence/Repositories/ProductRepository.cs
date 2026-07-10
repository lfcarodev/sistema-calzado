using Calzado.Application.Interfaces;
using Calzado.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Calzado.Infrastructure.Persistence.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly CalzadoDbContext _context;

    public ProductRepository(CalzadoDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Product product, CancellationToken cancellationToken = default)
    {
        await _context.Products.AddAsync(product, cancellationToken);
    }

    public async Task<Product?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        return await _context.Products
            .Include(p => p.Supplier)
            .Include(p => p.StockMovements)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public async Task<Product?> GetByReferenceAsync(
        string reference,
        string color,
        int supplierId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Products
            .FirstOrDefaultAsync(p =>
                p.Reference == reference &&
                p.Color == color &&
                p.SupplierId == supplierId,
                cancellationToken);
    }

    public async Task<List<Product>> GetAllAsync(
    CancellationToken cancellationToken = default)
    {
        return await _context.Products
            .Include(p => p.Supplier)
            .OrderBy(p => p.Reference)
            .ThenBy(p => p.Color)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Product>> SearchByReferenceAsync(
    string reference,
    CancellationToken cancellationToken = default)
    {
        reference = reference.Trim().ToUpper();

        return await _context.Products
            .Include(p => p.Supplier)
            .Where(p => p.Reference.Contains(reference))
            .OrderBy(p => p.Reference)
            .ThenBy(p => p.Color)
            .ToListAsync(cancellationToken);
    }
}