using Calzado.Application.Interfaces;
using MediatR;

namespace Calzado.Application.Suppliers.Queries.GetSuppliers;

public class GetSuppliersQueryHandler
    : IRequestHandler<GetSuppliersQuery, List<SupplierDto>>
{
    private readonly ISupplierRepository _supplierRepository;

    public GetSuppliersQueryHandler(ISupplierRepository supplierRepository)
    {
        _supplierRepository = supplierRepository;
    }

    public async Task<List<SupplierDto>> Handle(
        GetSuppliersQuery request,
        CancellationToken cancellationToken)
    {
        var suppliers = await _supplierRepository.GetAllAsync(cancellationToken);

        return suppliers.Select(supplier => new SupplierDto
        {
            Id = supplier.Id,
            Name = supplier.Name
        }).ToList();
    }
}
