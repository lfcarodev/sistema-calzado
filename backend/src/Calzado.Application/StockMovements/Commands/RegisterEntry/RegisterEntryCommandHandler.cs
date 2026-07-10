using Calzado.Application.Interfaces;
using Calzado.Domain.Enums;
using MediatR;

namespace Calzado.Application.StockMovements.Commands.RegisterEntry;

public class RegisterEntryCommandHandler : IRequestHandler<RegisterEntryCommand>
{
    private readonly IProductRepository _productRepository;
    private readonly IStockMovementRepository _stockMovementRepository;
    private readonly IUnitOfWork _unitOfWork;

    public RegisterEntryCommandHandler(
        IProductRepository productRepository,
        IStockMovementRepository stockMovementRepository,
        IUnitOfWork unitOfWork)
    {
        _productRepository = productRepository;
        _stockMovementRepository = stockMovementRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(
        RegisterEntryCommand request,
        CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(
            request.ProductId,
            cancellationToken);

        if (product is null)
        {
            throw new Exception("Product not found.");
        }

        var movement = product.RegisterMovement(
            MovementType.Entry,
            request.Quantity,
            request.Observation);

        await _stockMovementRepository.AddAsync(
            movement,
            cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}