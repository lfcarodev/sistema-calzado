using Calzado.Application.Interfaces;
using MediatR;

namespace Calzado.Application.Sales.Commands.RegisterSalePayment;

public class RegisterSalePaymentCommandHandler
    : IRequestHandler<RegisterSalePaymentCommand>
{
    private readonly ISaleRepository _saleRepository;
    private readonly IUnitOfWork _unitOfWork;

    public RegisterSalePaymentCommandHandler(
        ISaleRepository saleRepository,
        IUnitOfWork unitOfWork)
    {
        _saleRepository = saleRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(
        RegisterSalePaymentCommand request,
        CancellationToken cancellationToken)
    {
        var sale = await _saleRepository.GetByIdAsync(
            request.SaleId,
            cancellationToken);

        if (sale is null)
        {
            throw new Exception("Sale not found.");
        }

        sale.AddPayment(request.Amount);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}