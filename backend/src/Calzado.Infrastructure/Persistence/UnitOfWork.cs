using Calzado.Application.Interfaces;

namespace Calzado.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly CalzadoDbContext _context;

    public UnitOfWork(CalzadoDbContext context)
    {
        _context = context;
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }
}