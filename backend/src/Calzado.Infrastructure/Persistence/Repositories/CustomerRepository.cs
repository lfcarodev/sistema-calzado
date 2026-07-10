using Calzado.Application.Interfaces;
using Calzado.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Calzado.Infrastructure.Persistence.Repositories;

public class CustomerRepository : ICustomerRepository
{
    private readonly CalzadoDbContext _context;

    public CustomerRepository(CalzadoDbContext context)
    {
        _context = context;
    }

    public async Task<Customer?> GetByNameAsync(
        string name,
        CancellationToken cancellationToken = default)
    {
        return await _context.Customers
            .FirstOrDefaultAsync(
                c => c.Name == name,
                cancellationToken);
    }

    public async Task AddAsync(
        Customer customer,
        CancellationToken cancellationToken = default)
    {
        await _context.Customers.AddAsync(customer, cancellationToken);
    }
}