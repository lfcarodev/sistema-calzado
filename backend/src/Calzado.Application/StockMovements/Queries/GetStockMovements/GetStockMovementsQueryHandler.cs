using Calzado.Application.Interfaces;
using MediatR;

namespace Calzado.Application.StockMovements.Queries.GetStockMovements;

public class GetStockMovementsQueryHandler : IRequestHandler<GetStockMovementsQuery, List<StockMovementDto>>
{
    private readonly IStockMovementRepository _movementRepository;
    public GetStockMovementsQueryHandler(IStockMovementRepository movementRepository) => _movementRepository = movementRepository;

    public async Task<List<StockMovementDto>> Handle(GetStockMovementsQuery request, CancellationToken cancellationToken)
    {
        var movements = await _movementRepository.GetAllAsync(cancellationToken);
        return movements.Select(m => new StockMovementDto(m.Id, m.CreatedAt, m.Type.ToString(), m.Quantity, m.Product.Reference, m.Product.Color, m.Observation)).ToList();
    }
}
