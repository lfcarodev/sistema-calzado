using Calzado.Domain.Entities;

namespace Calzado.Application.Interfaces;

public interface IProductRepository
{
    Task AddAsync(Product product, CancellationToken cancellationToken = default);

    Task<Product?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<Product?> GetByReferenceAsync(
        string reference,
        string color,
        int supplierId,
        CancellationToken cancellationToken = default);

}