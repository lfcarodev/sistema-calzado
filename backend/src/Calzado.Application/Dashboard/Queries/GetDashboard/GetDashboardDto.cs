namespace Calzado.Application.Dashboard.Queries.GetDashboard;

public class GetDashboardDto
{
    public int TotalProducts { get; set; }

    public int TotalSuppliers { get; set; }

    public int TotalCustomers { get; set; }

    public int SalesToday { get; set; }

    public int LowStockProducts { get; set; }
}