using Calzado.Application.Interfaces;
using Calzado.Domain.Entities;
using MediatR;

namespace Calzado.Application.Suppliers.Commands.CreateSupplier;

public class CreateSupplierCommandHandler
    : IRequestHandler<CreateSupplierCommand, int>
{
    private readonly ISupplierRepository _supplierRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateSupplierCommandHandler(
        ISupplierRepository supplierRepository,
        IUnitOfWork unitOfWork)
    {
        _supplierRepository = supplierRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<int> Handle(
        CreateSupplierCommand request,
        CancellationToken cancellationToken)
    {
        var supplier = new Supplier(
            request.Name,
            request.Phone,
            request.Address);

        await _supplierRepository.AddAsync(supplier, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return supplier.Id;
    }
}