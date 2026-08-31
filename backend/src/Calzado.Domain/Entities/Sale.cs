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

    public List<SalePayment> Payments { get; private set; } = [];

    public decimal TotalPaid =>
        Payments.Sum(p => p.Amount);

    public decimal PendingAmount =>
        Math.Max(0, Total - TotalPaid);

    public bool IsPaid =>
        PendingAmount == 0;

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

    public void AddPayment(decimal amount)
    {
        if (amount <= 0)
        {
            throw new ArgumentException(
                "Payment amount must be greater than zero.",
                nameof(amount));
        }

        if (amount > PendingAmount)
        {
            throw new InvalidOperationException(
                "Payment amount cannot exceed the pending amount.");
        }

        var payment = new SalePayment(this, amount);

        Payments.Add(payment);

        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateTotal(decimal total)
    {
        Total = total;
        UpdatedAt = DateTime.UtcNow;
    }
}