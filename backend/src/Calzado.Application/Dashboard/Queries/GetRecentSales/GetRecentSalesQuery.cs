using MediatR;

namespace Calzado.Application.Dashboard.Queries.GetRecentSales;

public record GetRecentSalesQuery()
    : IRequest<List<GetRecentSalesDto>>;