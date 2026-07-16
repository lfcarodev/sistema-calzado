using Calzado.Domain.Entities;

namespace Calzado.Application.Interfaces;

public interface ISupplierRepository
{
    Task<Supplier?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<List<Supplier>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task AddAsync(
        Supplier supplier,
        CancellationToken cancellationToken = default);

    Task<int> CountAsync(CancellationToken cancellationToken);
}
