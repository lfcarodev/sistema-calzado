namespace Calzado.Application.Documents.Models;

public class SalePdfItemModel
{
    public string Reference { get; set; } = string.Empty;

    public string Color { get; set; } = string.Empty;

    public string Curve { get; set; } = string.Empty;

    public int Quantity { get; set; }

    public decimal UnitPrice { get; set; }

    public decimal Total { get; set; }
}