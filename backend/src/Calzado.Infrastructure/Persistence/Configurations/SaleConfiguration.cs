using Calzado.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Calzado.Infrastructure.Persistence.Configurations;

public class SaleConfiguration : IEntityTypeConfiguration<Sale>
{
    public void Configure(EntityTypeBuilder<Sale> builder)
    {
        builder.Property(s => s.Number)
            .IsRequired()
            .HasMaxLength(20);

        builder.HasIndex(s => s.Number)
            .IsUnique();

        builder.Property(s => s.Total)
            .HasPrecision(18, 2);

        builder.Property(s => s.Observation)
            .HasMaxLength(500);

        builder.HasOne(s => s.Customer)
            .WithMany()
            .HasForeignKey(s => s.CustomerId);
    }
}