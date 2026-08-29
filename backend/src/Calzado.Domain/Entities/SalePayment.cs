using Calzado.Domain.Common;

namespace Calzado.Domain.Entities;

public class SalePayment : AuditableEntity
{
    public int SaleId { get; private set; }
    public Sale Sale { get; private set; } = null!;

    public decimal Amount { get; private set; }
    public DateTime PaymentDate { get; private set; }

    private SalePayment()
    {
    }

    public SalePayment(
        Sale sale,
        decimal amount)
    {
        Sale = sale;
        SaleId = sale.Id;
        Amount = amount;
        PaymentDate = DateTime.Now;
    }
}