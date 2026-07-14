using MediatR;

namespace Calzado.Application.Sales.Queries.GetSales;

public record GetSalesQuery : IRequest<List<SaleDto>>;

public record SaleDto(int Id, string Number, DateTime Date, string Customer, decimal Total);
