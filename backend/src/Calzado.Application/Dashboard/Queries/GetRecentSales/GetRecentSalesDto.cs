namespace Calzado.Application.Dashboard.Queries.GetRecentSales;

public record GetRecentSalesDto(
    string Number,
    DateOnly Date,
    string Customer,
    decimal Total);