using Calzado.Application.Interfaces;
using Calzado.Domain.Entities;
using Calzado.Domain.ValueObjects;
using MediatR;
using Calzado.Application.Common.Exceptions;

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
            throw new BusinessException("Proveedor no encontrado.");
        }

        var curve = new Curve(
            request.CurveStart,
            request.CurveEnd);

        var duplicate = await _productRepository.FindDuplicateAsync(
            request.Reference,
            request.Color,
            curve,
            request.SupplierId,
            cancellationToken);

        if (duplicate is not null)
        {
            throw new BusinessException(
                "Ya existe un producto con esa referencia, color y curva.");
        }

        var product = new Product(
            request.Reference,
            request.Color,
            curve,
            supplier,
            request.SalePrice,
            request.PhotoPath);

        await _productRepository.AddAsync(product, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return product.Id;
    }
}