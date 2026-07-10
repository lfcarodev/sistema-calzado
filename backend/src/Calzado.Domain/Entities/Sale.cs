using Calzado.Domain.Common;

namespace Calzado.Domain.Entities;

public class Sale : AuditableEntity
{
    public string Number { get; private set; } = null!;

    public DateTime Date { get; private set; }

    public int CustomerId { get; private set; }

    public Customer Customer { get; private set; } = null!;

    public decimal Total { get; private set; }

    public string? Observation { get; private set; }

    public List<SaleDetail> Details { get; private set; } = [];

    private Sale()
    {
    }

    public Sale(
        string number,
        Customer customer,
        decimal total,
        string? observation = null)
    {
        Number = number;
        Date = DateTime.Now;

        Customer = customer;
        CustomerId = customer.Id;

        Total = total;

        Observation = observation?.Trim();
    }

    public void AddDetail(SaleDetail detail)
    {
        Details.Add(detail);
    }

    public void UpdateTotal(decimal total)
    {
        Total = total;
        UpdatedAt = DateTime.UtcNow;
    }
}