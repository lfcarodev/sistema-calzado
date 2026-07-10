using Calzado.Domain.Common;
using Calzado.Domain.Enums;

namespace Calzado.Domain.Entities;

public class StockMovement : AuditableEntity
{
    public int ProductId { get; private set; }

    public Product Product { get; private set; } = null!;

    public int Quantity { get; private set; }

    public MovementType Type { get; private set; }

    public string? Observation { get; private set; }

    private StockMovement()
    {
    }

    public StockMovement(
    Product product,
    int quantity,
    MovementType type,
    string? observation = null)
    {
        Product = product ?? throw new ArgumentNullException(nameof(product));
        ProductId = product.Id;

        if (quantity <= 0)
        {
            throw new ArgumentException("Quantity must be greater than zero.");
        }

        Quantity = quantity;

        Type = type;

        Observation = observation?.Trim();
    }
}