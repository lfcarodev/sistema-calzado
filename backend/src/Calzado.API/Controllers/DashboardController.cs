using Calzado.Application.Dashboard.Queries.GetDashboard;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Calzado.Application.Dashboard.Queries.GetRecentSales;

namespace Calzado.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IMediator _mediator;

    public DashboardController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<GetDashboardDto>> Get()
    {
        return Ok(await _mediator.Send(new GetDashboardQuery()));
    }

    [HttpGet("recent-sales")]
    public async Task<ActionResult<List<GetRecentSalesDto>>> GetRecentSales(
    CancellationToken cancellationToken)
    {
        var sales = await _mediator.Send(
            new GetRecentSalesQuery(),
            cancellationToken);

        return Ok(sales);
    }
}