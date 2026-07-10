using Calzado.Application.Products.Commands.CreateProduct;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Calzado.Application.Products.Queries.GetProducts;

namespace Calzado.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateProductCommand command)
    {
        var id = await _mediator.Send(command);

        return CreatedAtAction(nameof(Create), new { id }, new { id });
    }

    [HttpGet]
    public async Task<ActionResult<List<ProductDto>>> GetProducts()
    {
        var products = await _mediator.Send(new GetProductsQuery());

        return Ok(products);
    }
}