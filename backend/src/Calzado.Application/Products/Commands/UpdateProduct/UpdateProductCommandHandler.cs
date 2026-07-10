using Calzado.Application.Interfaces;
using Calzado.Domain.ValueObjects;
using MediatR;

namespace Calzado.Application.Products.Commands.UpdateProduct;

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand>
{
    private readonly IProductRepository _productRepository;
    private readonly ISupplierRepository _supplierRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateProductCommandHandler(
        IProductRepository productRepository,
        ISupplierRepository supplierRepository,
        IUnitOfWork unitOfWork)
    {
        _productRepository = productRepository;
        _supplierRepository = supplierRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(
        UpdateProductCommand request,
        CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (product is null)
        {
            throw new Exception("Product not found.");
        }

        var supplier = await _supplierRepository.GetByIdAsync(
            request.SupplierId,
            cancellationToken);

        if (supplier is null)
        {
            throw new Exception("Supplier not found.");
        }

        var curve = new Curve(
            request.CurveStart,
            request.CurveEnd);

        product.Update(
            request.Color,
            curve,
            supplier,
            request.SalePrice,
            request.PhotoPath);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}