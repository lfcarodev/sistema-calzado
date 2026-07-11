using Calzado.Application.Interfaces;
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

    public Task<byte[]> Handle(
        GetSalePdfQuery request,
        CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}