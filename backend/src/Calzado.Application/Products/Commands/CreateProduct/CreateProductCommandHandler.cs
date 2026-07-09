using Calzado.Application.Interfaces;
using Calzado.Domain.Entities;
using Calzado.Domain.ValueObjects;
using MediatR;

namespace Calzado.Application.Products.Commands.CreateProduct;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, int>
{
    private readonly IProductRepository _productRepository;
    private readonly ISupplierRepository _supplierRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateProductCommandHandler(
        IProductRepository productRepository,
        ISupplierRepository supplierRepository,
        IUnitOfWork unitOfWork)
    {
        _productRepository = productRepository;
        _supplierRepository = supplierRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<int> Handle(
        CreateProductCommand request,
        CancellationToken cancellationToken)
    {
        var supplier = await _supplierRepository.GetByIdAsync(
            request.SupplierId,
            cancellationToken);

        if (supplier is null)
        {
            throw new Exception("Supplier not found.");
        }

        var existingProduct = await _productRepository.GetByReferenceAsync(
            request.Reference,
            request.Color,
            request.SupplierId,
            cancellationToken);

        if (existingProduct is not null)
        {
            throw new Exception("A product with the same reference, color and supplier already exists.");
        }

        var product = new Product(
            request.Reference,
            request.Color,
            new Curve(request.CurveStart, request.CurveEnd),
            supplier,
            request.SalePrice,
            request.PhotoPath);

        await _productRepository.AddAsync(product, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return product.Id;
    }
}