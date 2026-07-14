namespace Calzado.Application.Products.Queries.GetProducts;

public class ProductDto
{
    public int Id { get; set; }

    public string Reference { get; set; } = null!;

    public string Color { get; set; } = null!;

    public string Curve { get; set; } = null!;

    public int CurrentStock { get; set; }

    public decimal? SalePrice { get; set; }

    public string? PhotoPath { get; set; }

    public int SupplierId { get; set; }

    public string Supplier { get; set; } = null!;
}
