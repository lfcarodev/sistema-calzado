using Calzado.Application.Interfaces;
using Calzado.Application.Documents.Models;
using Microsoft.AspNetCore.Mvc;

namespace Calzado.API.Controllers;

[ApiController]
[Route("api/pdf")]
public class PdfController : ControllerBase
{
    private readonly IPdfGenerator _pdfGenerator;

    public PdfController(IPdfGenerator pdfGenerator)
    {
        _pdfGenerator = pdfGenerator;
    }

    [HttpGet("test")]
    public IActionResult Test()
    {
        var model = new SalePdfModel
        {
            Number = "2026-000001",
            CustomerName = "Zapatería El Centro",
            Phone = "3001234567",
            Date = DateTime.Now,
            Observation = "Entrega inmediata",
            Total = 330000,
            Items =
            [
                new SalePdfItemModel
            {
                Reference = "V7-1JK",
                Color = "NE",
                Curve = "35-40",
                Quantity = 2,
                UnitPrice = 120000,
                Total = 240000
            },
            new SalePdfItemModel
            {
                Reference = "A2-33",
                Color = "CL",
                Curve = "36-41",
                Quantity = 1,
                UnitPrice = 90000,
                Total = 90000
            }
            ]
        };

        var pdf = _pdfGenerator.GenerateSalePdf(model);

        return File(
            pdf,
            "application/pdf",
            "test.pdf");
    }
}