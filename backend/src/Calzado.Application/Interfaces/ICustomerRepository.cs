using Calzado.Domain.Entities;

namespace Calzado.Application.Interfaces;

public interface ICustomerRepository
{
    Task<Customer?> GetByNameAsync(
        string name,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        Customer customer,
        CancellationToken cancellationToken = default);

    Task<int> CountAsync(CancellationToken cancellationToken);
}