using MediatR;

namespace Calzado.Application.Suppliers.Queries.GetSuppliers;

public record GetSuppliersQuery : IRequest<List<SupplierDto>>;
