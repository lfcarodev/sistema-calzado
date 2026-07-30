using Calzado.Domain.Entities;
using Calzado.Domain.ValueObjects;

namespace Calzado.Application.Interfaces;

public interface IProductRepository
{
    Task AddAsync(Product product, CancellationToken cancellationToken = default);

    Task<Product?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<Product?> FindDuplicateAsync(
    string reference,
    string color,
    Curve curve,
    int supplierId,
    CancellationToken cancellationToken);

    Task<List<Product>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<List<Product>> SearchByReferenceAsync(
    string reference,
    CancellationToken cancellationToken = default);

    Task<int> CountAsync(CancellationToken cancellationToken);
}