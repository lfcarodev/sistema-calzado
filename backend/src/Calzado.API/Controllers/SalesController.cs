using Calzado.Application.Sales.Commands.CreateSale;
using Calzado.Application.Sales.Queries.GetSalePdf;
using Calzado.Application.Sales.Queries.GetSales;
using Calzado.Application.Sales.Queries.GetAccountsReceivable;
using Calzado.Application.Documents.Models;
using Calzado.Application.Sales.Commands.AddSalePayment;

using MediatR;
using Microsoft.AspNetCore.Mvc;

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

    [HttpGet("accounts-receivable")]
    public async Task<ActionResult<List<AccountReceivableDto>>> GetAccountsReceivable()
    {
        return Ok(
            await _mediator.Send(
                new GetAccountsReceivableQuery()));
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

    [HttpPost("{id}/payments")]
    public async Task<IActionResult> AddPayment(
    int id,
    [FromBody] AddSalePaymentCommand command)
    {
        if (id != command.SaleId)
        {
            return BadRequest("Sale ID does not match.");
        }

        await _mediator.Send(command);

        return NoContent();
    }
}
