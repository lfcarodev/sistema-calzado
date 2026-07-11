using Calzado.Application.Documents.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Calzado.Infrastructure.Documents.Templates;

public class SalePdfDocument : IDocument
{
    private readonly SalePdfModel _model;

    public SalePdfDocument(SalePdfModel model)
    {
        _model = model;
    }

    public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

    public void Compose(IDocumentContainer container)
    {
        container.Page(page =>
        {
            page.Size(PageSizes.A4);

            page.Margin(30);

            page.Content().Column(column =>
            {
                Header(column);

                CustomerSection(column);

                ProductsTable(column);

                Totals(column);

                Footer(column);
            });
        });
    }

    private void Header(ColumnDescriptor column)
    {
        var logoPath = Path.Combine(
            AppContext.BaseDirectory,
            "Assets",
            "Logo.png");

        column.Item().Row(row =>
        {
            row.ConstantItem(90).Element(container =>
            {
                container
                    .Height(90)
                    .Image(logoPath)
                    .FitWidth();
            });

            row.RelativeItem().Column(info =>
            {
                info.Item()
                    .AlignCenter()
                    .Text("DISTRIBUIDORA EVELIO")
                    .FontSize(22)
                    .Bold();

                info.Item()
                    .AlignCenter()
                    .Text("Barranquilla - Colombia");

                info.Item()
                    .AlignCenter()
                    .Text("NIT: 900.000.000-0");

                info.Item()
                    .AlignCenter()
                    .Text("Tel: 300 123 4567");
            });
        });

        column.Item().PaddingTop(15);

        column.Item().LineHorizontal(1);

        column.Item().PaddingTop(10);

        column.Item()
            .AlignCenter()
            .Text("REMISIÓN")
            .FontSize(18)
            .Bold();

        column.Item()
            .AlignCenter()
            .Text($"N.º {_model.Number}")
            .FontSize(14)
            .SemiBold();

        column.Item().PaddingBottom(20);
    }

    private void CustomerSection(ColumnDescriptor column)
    {
        column.Item().Text($"Cliente: {_model.CustomerName}");

        column.Item().Text($"Teléfono: {_model.Phone}");

        column.Item().Text($"Fecha: {_model.Date:dd/MM/yyyy}");

        column.Item().PaddingBottom(20);
    }

    private void ProductsTable(ColumnDescriptor column)
    {
        column.Item().Table(table =>
        {
            table.ColumnsDefinition(columns =>
            {
                columns.RelativeColumn(2); // Referencia
                columns.RelativeColumn();  // Color
                columns.RelativeColumn();  // Curva
                columns.RelativeColumn();  // Cantidad
                columns.RelativeColumn(2); // Precio
                columns.RelativeColumn(2); // Total
            });


            table.Header(header =>
            {
                header.Cell().Text("Referencia").Bold();
                header.Cell().Text("Color").Bold();
                header.Cell().Text("Curva").Bold();
                header.Cell().Text("Cant.").Bold();
                header.Cell().AlignRight().Text("Precio").Bold();
                header.Cell().AlignRight().Text("Total").Bold();
            });

            foreach (var item in _model.Items)
            {
                table.Cell().Text(item.Reference);
                table.Cell().Text(item.Color);
                table.Cell().Text(item.Curve);
                table.Cell().Text(item.Quantity.ToString());
                table.Cell().AlignRight().Text(item.UnitPrice.ToString("C0"));
                table.Cell().AlignRight().Text(item.Total.ToString("C0"));
            }
        });

        column.Item().PaddingBottom(20);
    }

    private void Totals(ColumnDescriptor column)
    {
        column.Item()
            .AlignRight()
            .Text(text =>
            {
                text.Span("TOTAL: ").Bold();
                text.Span(_model.Total.ToString("C0"));
            });

        column.Item().PaddingBottom(20);
    }

    private void Footer(ColumnDescriptor column)
    {
        column.Item().Text("Observaciones:");

        column.Item()
            .Border(1)
            .Padding(8)
            .MinHeight(50)
            .Text(_model.Observation ?? string.Empty);

        column.Item().PaddingTop(20);

        column.Item()
            .AlignCenter()
            .Text("Gracias por su compra.")
            .Italic();
    }
}

