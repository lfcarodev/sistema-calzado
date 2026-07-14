using Calzado.Application.Interfaces;
using MediatR;

namespace Calzado.Application.Sales.Queries.GetSales;

public class GetSalesQueryHandler : IRequestHandler<GetSalesQuery, List<SaleDto>>
{
    private readonly ISaleRepository _saleRepository;
    public GetSalesQueryHandler(ISaleRepository saleRepository) => _saleRepository = saleRepository;

    public async Task<List<SaleDto>> Handle(GetSalesQuery request, CancellationToken cancellationToken)
    {
        var sales = await _saleRepository.GetAllAsync(cancellationToken);
        return sales.Select(s => new SaleDto(s.Id, s.Number, s.Date, s.Customer.Name, s.Total)).ToList();
    }
}
