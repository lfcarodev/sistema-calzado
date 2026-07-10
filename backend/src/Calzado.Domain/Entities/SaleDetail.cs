using Calzado.Domain.Common;

namespace Calzado.Domain.Entities;

public class SaleDetail : AuditableEntity
{
    public int SaleId { get; private set; }

    public Sale Sale { get; private set; } = null!;

    public int ProductId { get; private set; }

    public Product Product { get; private set; } = null!;

    public int Quantity { get; private set; }

    public decimal UnitPrice { get; private set; }

    public decimal Total => Quantity * UnitPrice;

    private SaleDetail()
    {
    }

    public SaleDetail(
        Product product,
        int quantity,
        decimal unitPrice)
    {
        Product = product;
        ProductId = product.Id;

        Quantity = quantity;

        UnitPrice = unitPrice;
    }
}