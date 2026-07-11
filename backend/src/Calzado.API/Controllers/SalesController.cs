using Calzado.Application.Sales.Commands.CreateSale;
using Calzado.Application.Sales.Queries.GetSalePdf;
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
    public async Task<IActionResult> GetPdf(int id)
    {
        var pdf = await _mediator.Send(new GetSalePdfQuery(id));

        return File(
            pdf,
            "application/pdf",
            $"Remision-{id}.pdf");
    }
}