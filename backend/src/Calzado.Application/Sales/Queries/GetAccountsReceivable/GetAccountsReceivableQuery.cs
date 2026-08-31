using MediatR;

namespace Calzado.Application.Sales.Queries.GetAccountsReceivable;

public record GetAccountsReceivableQuery
    : IRequest<List<AccountReceivableDto>>;