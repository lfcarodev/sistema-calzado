using Calzado.Application.Documents.Models;

namespace Calzado.Application.Interfaces;

public interface IPdfGenerator
{
    byte[] GenerateSalePdf(SalePdfModel model);
}