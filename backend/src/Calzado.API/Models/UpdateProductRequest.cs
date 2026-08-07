using Microsoft.AspNetCore.Http;

namespace Calzado.API.Models;

public class UpdateProductRequest
{
    public int Id { get; set; }

    public string Color { get; set; } = string.Empty;

    public int CurveStart { get; set; }

    public int CurveEnd { get; set; }

    public decimal? SalePrice { get; set; }

    public int SupplierId { get; set; }

    public IFormFile? Photo { get; set; }
}