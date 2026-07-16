using Calzado.Application.Interfaces;
using MediatR;

namespace Calzado.Application.Dashboard.Queries.GetDashboard;

public class GetDashboardQueryHandler
    : IRequestHandler<GetDashboardQuery, GetDashboardDto>
{
    private readonly IProductRepository _productRepository;
    private readonly ISupplierRepository _supplierRepository;
    private readonly ICustomerRepository _customerRepository;
    private readonly ISaleRepository _saleRepository;
    private readonly IStockMovementRepository _stockMovementRepository;

    public GetDashboardQueryHandler(
        IProductRepository productRepository,
        ISupplierRepository supplierRepository,
        ICustomerRepository customerRepository,
        ISaleRepository saleRepository,
        IStockMovementRepository stockMovementRepository)
    {
        _productRepository = productRepository;
        _supplierRepository = supplierRepository;
        _customerRepository = customerRepository;
        _saleRepository = saleRepository;
        _stockMovementRepository = stockMovementRepository;
    }

    public async Task<GetDashboardDto> Handle(
    GetDashboardQuery request,
    CancellationToken cancellationToken)
    {
        return new GetDashboardDto
        {
            TotalProducts = await _productRepository.CountAsync(cancellationToken),
            TotalSuppliers = await _supplierRepository.CountAsync(cancellationToken),
            TotalCustomers = await _customerRepository.CountAsync(cancellationToken),
            SalesToday = await _saleRepository.CountTodayAsync(cancellationToken),
            LowStockProducts = await _stockMovementRepository.CountLowStockProductsAsync(cancellationToken)
        };
    }
}