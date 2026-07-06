using Calzado.Domain.Common;
using Calzado.Domain.ValueObjects;

namespace Calzado.Domain.Entities;

public class Product : AuditableEntity
{
    public string Reference { get; private set; } = null!;
    public string Color { get; private set; } = null!;
    public Curve Curve { get; private set; } = null!;
    public decimal? SalePrice { get; private set; }
    public int CurrentStock { get; private set; }
    public string? PhotoPath { get; private set; }
    public int SupplierId { get; private set; }
    public Supplier Supplier { get; private set; } = null!;

    private Product()
    {
    }

    public Product(
        string reference,
        string color,
        Curve curve,
        Supplier supplier,
        decimal? salePrice = null,
        string? photoPath = null)
    {
        SetReference(reference);
        SetColor(color);

        Curve = curve ?? throw new ArgumentNullException(nameof(curve));
        Supplier = supplier ?? throw new ArgumentNullException(nameof(supplier));
        SupplierId = supplier.Id;

        SalePrice = salePrice;
        PhotoPath = photoPath?.Trim();

        CurrentStock = 0;
    }

    public void SetReference(string reference)
    {
        if (string.IsNullOrWhiteSpace(reference))
        {
            throw new ArgumentException("Reference is required.");
        }

        Reference = reference.Trim().ToUpperInvariant();
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetColor(string color)
    {
        if (string.IsNullOrWhiteSpace(color))
        {
            throw new ArgumentException("Color is required.");
        }

        Color = color.Trim().ToUpperInvariant();
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateSalePrice(decimal? salePrice)
    {
        if (salePrice < 0)
        {
            throw new ArgumentException("Sale price cannot be negative");
        }

        SalePrice = salePrice;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdatePhoto(string? photoPath)
    {
        PhotoPath = photoPath?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void ChangeSupplier(Supplier supplier)
    {
        Supplier = supplier ?? throw new ArgumentNullException(nameof(supplier));
        SupplierId = supplier.Id;
        UpdatedAt = DateTime.UtcNow;
    }

    internal void UpdateStock(int quantity)
    {
        var newStock = CurrentStock + quantity;

        if (newStock < 0)
        {
            throw new InvalidOperationException("Stock cannot be negative.");
        }

        CurrentStock = newStock;
        UpdatedAt = DateTime.UtcNow;
    }

    public void ChangeCurve(Curve curve)
    {
        Curve = curve ?? throw new ArgumentNullException(nameof(curve));

        UpdatedAt = DateTime.UtcNow;
    }
}