using Calzado.Application.Interfaces;
using Calzado.Application.Documents.Models;
using Calzado.Infrastructure.Documents.Templates;
using QuestPDF.Fluent;

namespace Calzado.Infrastructure.Documents;

public class PdfGenerator : IPdfGenerator
{
    public byte[] GenerateSalePdf(SalePdfModel model)
    {
        var document = new SalePdfDocument(model);

        return document.GeneratePdf();
    }
}