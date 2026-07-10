using Calzado.Application.Interfaces;
using MediatR;
using Calzado.Domain.Entities;
using Calzado.Domain.Enums;

namespace Calzado.Application.Sales.Commands.CreateSale;

public class CreateSaleCommandHandler
    : IRequestHandler<CreateSaleCommand, string>
{
    private readonly ICustomerRepository _customerRepository;
    private readonly IProductRepository _productRepository;
    private readonly ISaleRepository _saleRepository;
    private readonly IStockMovementRepository _stockMovementRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateSaleCommandHandler(
        ICustomerRepository customerRepository,
        IProductRepository productRepository,
        ISaleRepository saleRepository,
        IStockMovementRepository stockMovementRepository,
        IUnitOfWork unitOfWork)
    {
        _customerRepository = customerRepository;
        _productRepository = productRepository;
        _saleRepository = saleRepository;
        _stockMovementRepository = stockMovementRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<string> Handle(
        CreateSaleCommand request,
        CancellationToken cancellationToken)
    {
        var customer = await _customerRepository.GetByNameAsync(
            request.CustomerName,
            cancellationToken);

        if (customer is null)
        {
            customer = new Customer(
                request.CustomerName,
                request.Phone);

            await _customerRepository.AddAsync(
                customer,
                cancellationToken);
        }

        var year = DateTime.Now.Year;

        var lastNumber = await _saleRepository.GetLastNumberAsync(
            year,
            cancellationToken);

        int sequence = 1;

        if (!string.IsNullOrWhiteSpace(lastNumber))
        {
            sequence = int.Parse(lastNumber.Split('-')[1]) + 1;
        }

        var saleNumber = $"{year}-{sequence:D6}";

        var sale = new Sale(
            saleNumber,
            customer,
            0,
            request.Observation);

        decimal total = 0;

        foreach (var item in request.Items)
        {
            var product = await _productRepository.GetByIdAsync(
                item.ProductId,
                cancellationToken);

            if (product is null)
            {
                throw new Exception($"Product {item.ProductId} not found.");
            }

            if (product.CurrentStock < item.Quantity)
            {
                throw new Exception(
                    $"Insufficient stock for product {product.Reference}.");
            }

            if (product.SalePrice is null)
            {
                throw new Exception("Product has no sale price.");
            }

            total += product.SalePrice.Value * item.Quantity;

            var detail = new SaleDetail(
                product,
                item.Quantity,
                product.SalePrice.Value);

            sale.AddDetail(detail);

            var movement = product.RegisterMovement(
                MovementType.Exit,
                item.Quantity,
                $"Sale {saleNumber}");

            await _stockMovementRepository.AddAsync(
                movement,
                cancellationToken);
        }

        sale.UpdateTotal(total);

        await _saleRepository.AddAsync(
            sale,
            cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return saleNumber;
    }
}