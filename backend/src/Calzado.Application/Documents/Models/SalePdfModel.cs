namespace Calzado.Application.Documents.Models;

public class SalePdfModel
{
    public string Number { get; set; } = string.Empty;

    public DateTime Date { get; set; }

    public string CustomerName { get; set; } = string.Empty;

    public string? Phone { get; set; }

    public string? Observation { get; set; }

    public decimal Total { get; set; }

    public List<SalePdfItemModel> Items { get; set; } = [];
}