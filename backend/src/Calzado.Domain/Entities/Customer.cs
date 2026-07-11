using Calzado.Domain.Common;

namespace Calzado.Domain.Entities;

public class Customer : AuditableEntity
{
    public string Name { get; private set; } = null!;

    public string? Phone { get; private set; }

    private Customer()
    {
    }

    public Customer(string name, string? phone = null)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Customer name is required.");

        Name = name.Trim();
        Phone = phone?.Trim();
    }
}