using Calzado.Domain.Entities;

namespace Calzado.Application.Interfaces;

public interface ISaleRepository
{
    Task AddAsync(
        Sale sale,
        CancellationToken cancellationToken = default);

    Task<string?> GetLastNumberAsync(
        int year,
        CancellationToken cancellationToken = default);
}