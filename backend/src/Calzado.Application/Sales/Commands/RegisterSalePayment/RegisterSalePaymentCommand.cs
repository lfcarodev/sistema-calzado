using MediatR;

namespace Calzado.Application.Sales.Commands.RegisterSalePayment;

public record RegisterSalePaymentCommand(
    int SaleId,
    decimal Amount
) : IRequest;