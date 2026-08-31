using Calzado.Application.Interfaces;
using MediatR;

namespace Calzado.Application.Sales.Queries.GetAccountsReceivable;

public class GetAccountsReceivableHandler
    : IRequestHandler<GetAccountsReceivableQuery, List<AccountReceivableDto>>
{
    private readonly ISaleRepository _saleRepository;

    public GetAccountsReceivableHandler(
        ISaleRepository saleRepository)
    {
        _saleRepository = saleRepository;
    }

    public async Task<List<AccountReceivableDto>> Handle(
        GetAccountsReceivableQuery request,
        CancellationToken cancellationToken)
    {
        var sales = await _saleRepository.GetAllAsync(cancellationToken);

        return sales
            .Select(s => new AccountReceivableDto
            {
                SaleId = s.Id,
                SaleNumber = s.Number,
                Date = s.Date,
                CustomerName = s.Customer.Name,
                Total = s.Total,
                TotalPaid = s.Payments.Sum(p => p.Amount)
            })
            .ToList();
    }
}