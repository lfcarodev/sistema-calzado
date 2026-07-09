using MediatR;

namespace Calzado.Application.Suppliers.Commands.CreateSupplier;

public record CreateSupplierCommand(
    string Name,
    string? Phone,
    string? Address
) : IRequest<int>;