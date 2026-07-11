using MediatR;

namespace Calzado.Application.Sales.Queries.GetSalePdf;

public record GetSalePdfQuery(
    int SaleId
) : IRequest<byte[]>;