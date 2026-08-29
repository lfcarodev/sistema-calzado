using Calzado.Application.Sales.Commands.CreateSale;
using Calzado.Application.Sales.Queries.GetSalePdf;
using Calzado.Application.Sales.Queries.GetSales;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Calzado.Application.Documents.Models;

namespace Calzado.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesController : ControllerBase
{
    private readonly IMediator _mediator;

    public SalesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<SaleDto>>> GetSales()
    {
        return Ok(await _mediator.Send(new GetSalesQuery()));
    }

    [HttpPost]
    public async Task<ActionResult<string>> Create(
        CreateSaleCommand command)
    {
        var saleNumber = await _mediator.Send(command);

        return Ok(new
        {
            Number = saleNumber
        });
    }

    [HttpGet("{id}/pdf")]
    public async Task<IActionResult> GetPdf(
    int id,
    [FromQuery] SaleDocumentType documentType)
    {
        var result = await _mediator.Send(
            new GetSalePdfQuery(id, documentType));

        var fileName = documentType == SaleDocumentType.Invoice
            ? $"Factura-{result.Number}.pdf"
            : $"Remision-{result.Number}.pdf";

        return File(
            result.Pdf,
            "application/pdf",
            fileName);
    }
}
