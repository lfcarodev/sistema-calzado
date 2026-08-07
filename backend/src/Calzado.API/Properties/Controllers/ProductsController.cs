using Calzado.Application.Products.Commands.CreateProduct;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Calzado.Application.Products.Queries.GetProducts;
using Calzado.Application.Products.Commands.UpdateProduct;
using Calzado.Application.Products.Queries.SearchProducts;
using Calzado.Application.Products.Queries.GetProductById;
using Calzado.API.Models;
using Calzado.API.Services;

namespace Calzado.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly FileStorageService _fileStorageService;

    public ProductsController(
    IMediator mediator,
    FileStorageService fileStorageService)
    {
        _mediator = mediator;
        _fileStorageService = fileStorageService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] CreateProductRequest request)
    {
        var photoPath = await _fileStorageService.SaveProductPhotoAsync(
            request.Photo,
            request.Reference,
            request.Color,
            request.CurveStart,
            request.CurveEnd);

        var command = new CreateProductCommand(
            request.Reference,
            request.Color,
            request.CurveStart,
            request.CurveEnd,
            request.SalePrice,
            photoPath,
            request.SupplierId);

        var id = await _mediator.Send(command);

        return CreatedAtAction(nameof(Create), new { id }, new { id });
    }

    [HttpGet]
    public async Task<ActionResult<List<ProductDto>>> GetProducts()
    {
        var products = await _mediator.Send(new GetProductsQuery());

        return Ok(products);
    }

    [HttpGet("search")]
    public async Task<ActionResult<List<ProductDto>>> SearchProducts(
    [FromQuery] string reference)
    {
        var products = await _mediator.Send(
            new SearchProductsQuery(reference));

        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetProductById(int id)
    {
        var product = await _mediator.Send(
            new GetProductByIdQuery(id));

        if (product is null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(
    int id,
    [FromForm] UpdateProductRequest request)
    {
        if (id != request.Id)
        {
            return BadRequest();
        }

        var existingProduct = await _mediator.Send(
            new GetProductByIdQuery(id));

        if (existingProduct is null)
        {
            return NotFound();
        }

        var photoPath = existingProduct.PhotoPath;

        if (request.Photo is not null)
        {
            photoPath = await _fileStorageService.SaveProductPhotoAsync(
                request.Photo,
                existingProduct.Reference,
                request.Color,
                request.CurveStart,
                request.CurveEnd,
                existingProduct.PhotoPath);
        }

        var command = new UpdateProductCommand(
            request.Id,
            request.Color,
            request.CurveStart,
            request.CurveEnd,
            request.SalePrice,
            photoPath,
            request.SupplierId);

        await _mediator.Send(command);

        return NoContent();
    }
}