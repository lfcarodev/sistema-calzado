using Calzado.Application.Interfaces;
using Calzado.Application.Documents.Models;
using MediatR;

namespace Calzado.Application.Sales.Queries.GetSalePdf;

public class GetSalePdfQueryHandler
    : IRequestHandler<GetSalePdfQuery, byte[]>
{
    private readonly ISaleRepository _saleRepository;
    private readonly IPdfGenerator _pdfGenerator;

    public GetSalePdfQueryHandler(
        ISaleRepository saleRepository,
        IPdfGenerator pdfGenerator)
    {
        _saleRepository = saleRepository;
        _pdfGenerator = pdfGenerator;
    }

    public async Task<byte[]> Handle(
    GetSalePdfQuery request,
    CancellationToken cancellationToken)
    {
        var sale = await _saleRepository.GetByIdAsync(
            request.SaleId,
            cancellationToken);

        if (sale is null)
        {
            throw new Exception("Sale not found.");
        }

        var model = new SalePdfModel
        {
            Number = sale.Number,
            Date = sale.Date,
            CustomerName = sale.Customer.Name,
            Phone = sale.Customer.Phone,
            Observation = sale.Observation,
            Total = sale.Total
        };

        foreach (var detail in sale.Details)
        {
            model.Items.Add(new SalePdfItemModel
            {
                Reference = detail.Product.Reference,
                Color = detail.Product.Color,
                Curve = detail.Product.Curve.ToString(),
                Quantity = detail.Quantity,
                UnitPrice = detail.UnitPrice,
                Total = detail.Total
            });
        }
        return _pdfGenerator.GenerateSalePdf(model);
    }
}