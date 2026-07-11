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

        column.Item().Table(table =>
        {
            table.ColumnsDefinition(columns =>
            {
                columns.ConstantColumn(100);
                columns.RelativeColumn();
            });

            table.Cell()
                .AlignCenter()
                .AlignMiddle()
                .Image(logoPath);

            table.Cell()
                .PaddingLeft(15)
                .Column(info =>
                {
                    info.Spacing(3);

                    info.Item()
                        .Text("CALZADO LOS SOCIOS")
                        .FontSize(24)
                        .Bold();

                    info.Item()
                        .Text("Barranquilla - Colombia")
                        .FontSize(11);

                    info.Item()
                        .Text("NIT: 900.000.000-0")
                        .FontSize(11);

                    info.Item()
                        .Text("Tel: 300 123 4567")
                        .FontSize(11);
                });
        });

        column.Item().PaddingVertical(10);

        column.Item().LineHorizontal(1);

        column.Item().PaddingTop(15);

        column.Item()
            .AlignCenter()
            .Text("REMISIÓN")
            .FontSize(20)
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
        column.Item().Table(table =>
        {
            table.ColumnsDefinition(columns =>
            {
                columns.RelativeColumn();
                columns.RelativeColumn();
            });

            // Primera fila
            table.Cell()
                .Border(1)
                .Padding(8)
                .Column(x =>
                {
                    x.Item().Text("Cliente").Bold().FontSize(11);
                    x.Item().Text(_model.CustomerName);
                });

            table.Cell()
                .Border(1)
                .Padding(8)
                .Column(x =>
                {
                    x.Item().Text("Fecha").Bold().FontSize(11);
                    x.Item().Text(_model.Date.ToString("dd/MM/yyyy"));
                });

            // Segunda fila
            table.Cell()
                .Border(1)
                .Padding(8)
                .Column(x =>
                {
                    x.Item().Text("Teléfono").Bold().FontSize(11);
                    x.Item().Text(_model.Phone ?? "No registrado");
                });

            table.Cell()
                .Border(1)
                .Padding(8)
                .Column(x =>
                {
                    x.Item().Text("Remisión").Bold().FontSize(11);
                    x.Item().Text(_model.Number);
                });
        });

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
                static IContainer HeaderCell(IContainer container)
                {
                    return container
                        .Background("#E5E7EB")
                        .Border(1)
                        .BorderColor("#BDBDBD")
                        .PaddingVertical(6)
                        .PaddingHorizontal(4);
                }

                HeaderCell(header.Cell()).Text("Referencia").Bold();
                HeaderCell(header.Cell()).AlignCenter().Text("Color").Bold();
                HeaderCell(header.Cell()).AlignCenter().Text("Curva").Bold();
                HeaderCell(header.Cell()).AlignCenter().Text("Cant.").Bold();
                HeaderCell(header.Cell()).AlignRight().Text("Precio").Bold();
                HeaderCell(header.Cell()).AlignRight().Text("Total").Bold();
            });

            foreach (var item in _model.Items)
            {
                table.Cell().BorderBottom(1).BorderColor("#DDDDDD").PaddingVertical(5).Text(item.Reference);

                table.Cell().BorderBottom(1).BorderColor("#DDDDDD").PaddingVertical(5)
                    .AlignCenter().Text(item.Color);

                table.Cell().BorderBottom(1).BorderColor("#DDDDDD").PaddingVertical(5)
                    .AlignCenter().Text(item.Curve);

                table.Cell().BorderBottom(1).BorderColor("#DDDDDD").PaddingVertical(5)
                    .AlignCenter().Text(item.Quantity.ToString());

                table.Cell().BorderBottom(1).BorderColor("#DDDDDD").PaddingVertical(5)
                    .AlignRight().Text(item.UnitPrice.ToString("C0"));

                table.Cell().BorderBottom(1).BorderColor("#DDDDDD").PaddingVertical(5)
                    .AlignRight().Text(item.Total.ToString("C0"));
            }
        });

        column.Item().PaddingBottom(20);
    }

    private void Totals(ColumnDescriptor column)
    {
        column.Item()
            .AlignRight()
            .Width(220)
            .Border(1)
            .BorderColor("#BDBDBD")
            .Background("#F5F5F5")
            .Padding(10)
            .Column(total =>
            {
                total.Item()
                    .AlignCenter()
                    .Text("TOTAL")
                    .Bold()
                    .FontSize(14);

                total.Item()
                    .AlignCenter()
                    .Text(_model.Total.ToString("C0"))
                    .FontSize(18)
                    .Bold();
            });

        column.Item().PaddingBottom(20);
    }

    private void Footer(ColumnDescriptor column)
    {
        column.Item()
            .Text("Observaciones")
            .Bold()
            .FontSize(11);

        column.Item()
            .Border(1)
            .BorderColor("#BDBDBD")
            .Padding(10)
            .MinHeight(70)
            .Text(string.IsNullOrWhiteSpace(_model.Observation)
                ? "Sin observaciones."
                : _model.Observation);

        column.Item().PaddingTop(20);

        column.Item()
            .AlignCenter()
            .Text("Gracias por su compra.")
            .Italic()
            .FontSize(11);
    }
}