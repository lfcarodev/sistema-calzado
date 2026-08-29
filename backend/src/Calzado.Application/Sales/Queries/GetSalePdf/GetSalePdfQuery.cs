using Calzado.Application.Documents.Models;
using MediatR;

namespace Calzado.Application.Sales.Queries.GetSalePdf;

public record GetSalePdfQuery(
    int SaleId,
    SaleDocumentType DocumentType
) : IRequest<SalePdfResult>;