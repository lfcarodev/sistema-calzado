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

    Task<Sale?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<List<Sale>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<int> CountTodayAsync(CancellationToken cancellationToken);

    Task<List<Sale>> GetRecentAsync(
    int count,
    CancellationToken cancellationToken = default);
}
