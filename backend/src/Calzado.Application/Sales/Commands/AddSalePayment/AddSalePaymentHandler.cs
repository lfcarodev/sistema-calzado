using Calzado.Application.Interfaces;
using MediatR;

namespace Calzado.Application.Sales.Commands.AddSalePayment;

public class AddSalePaymentHandler
    : IRequestHandler<AddSalePaymentCommand>
{
    private readonly ISaleRepository _saleRepository;
    private readonly IUnitOfWork _unitOfWork;

    public AddSalePaymentHandler(
        ISaleRepository saleRepository,
        IUnitOfWork unitOfWork)
    {
        _saleRepository = saleRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(
        AddSalePaymentCommand request,
        CancellationToken cancellationToken)
    {
        var sale = await _saleRepository.GetByIdAsync(
            request.SaleId,
            cancellationToken);

        if (sale is null)
        {
            throw new Exception("Sale not found.");
        }

        if (request.Amount <= 0)
        {
            throw new Exception(
                "Payment amount must be greater than zero.");
        }

        var totalPaid = sale.Payments.Sum(p => p.Amount);
        var balance = sale.Total - totalPaid;

        if (balance <= 0)
        {
            throw new Exception(
                "This sale is already fully paid.");
        }

        if (request.Amount > balance)
        {
            throw new Exception(
                $"Payment cannot be greater than the pending balance of {balance:C0}.");
        }

        sale.AddPayment(request.Amount);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}