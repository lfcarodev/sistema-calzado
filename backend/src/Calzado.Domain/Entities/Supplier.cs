using Calzado.Domain.Common;

namespace Calzado.Domain.Entities;

public class Supplier : AuditableEntity
{
    public string Name { get; private set; } = null!;
    public string? Phone { get; private set; }
    public string? Address { get; private set; }

    private Supplier()
    {
    }

    public Supplier(string name, string? phone = null, string? address = null)
    {
        SetName(name);

        Phone = phone?.Trim();

        Address = address?.Trim();
    }

    public void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Supplier name is required");
        }

        Name = name.Trim();
    }

    public void UpdateContactInfo(string? phone, string? address)
    {
        Phone = phone?.Trim();
        Address = address?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }
}