using MediatR;

namespace Calzado.Application.Sales.Commands.AddSalePayment;

public record AddSalePaymentCommand(
    int SaleId,
    decimal Amount
) : IRequest;