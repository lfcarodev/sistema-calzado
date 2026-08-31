namespace Calzado.Application.Sales.Queries.GetAccountsReceivable;

public class AccountReceivableDto
{
    public int SaleId { get; set; }

    public string SaleNumber { get; set; } = null!;

    public DateTime Date { get; set; }

    public string CustomerName { get; set; } = null!;

    public decimal Total { get; set; }

    public decimal TotalPaid { get; set; }

    public decimal Balance => Total - TotalPaid;

    public bool IsPaid => Balance <= 0;
}