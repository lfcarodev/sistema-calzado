namespace Calzado.Application.Sales.Queries.GetSalePdf;

public class SalePdfResult
{
    public byte[] Pdf { get; set; } = [];

    public string Number { get; set; } = string.Empty;
}