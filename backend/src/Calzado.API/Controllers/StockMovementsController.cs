using Calzado.Application.StockMovements.Commands.RegisterEntry;
using Calzado.Application.StockMovements.Commands.RegisterExit;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Calzado.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StockMovementsController : ControllerBase
{
    private readonly IMediator _mediator;

    public StockMovementsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("entry")]
    public async Task<IActionResult> RegisterEntry(RegisterEntryCommand command)
    {
        await _mediator.Send(command);

        return NoContent();
    }

    [HttpPost("exit")]
    public async Task<IActionResult> RegisterExit(RegisterExitCommand command)
    {
        await _mediator.Send(command);

        return NoContent();
    }
}