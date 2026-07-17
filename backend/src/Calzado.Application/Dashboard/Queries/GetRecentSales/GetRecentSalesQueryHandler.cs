using Calzado.Application.Interfaces;
using MediatR;

namespace Calzado.Application.Dashboard.Queries.GetRecentSales;

public class GetRecentSalesQueryHandler
    : IRequestHandler<GetRecentSalesQuery, List<GetRecentSalesDto>>
{
    private readonly ISaleRepository _saleRepository;

    public GetRecentSalesQueryHandler(ISaleRepository saleRepository)
    {
        _saleRepository = saleRepository;
    }

    public async Task<List<GetRecentSalesDto>> Handle(
    GetRecentSalesQuery request,
    CancellationToken cancellationToken)
    {
        var sales = await _saleRepository.GetRecentAsync(5, cancellationToken);

        return sales
            .Select(s => new GetRecentSalesDto(
                s.Number,
                DateOnly.FromDateTime(s.Date),
                s.Customer.Name,
                s.Total))
            .ToList();
    }
}