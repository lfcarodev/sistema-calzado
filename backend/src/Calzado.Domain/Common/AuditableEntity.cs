namespace Calzado.Domain.Common;

public abstract class AuditableEntity : BaseEntity
{
    public DateTime CreateAt { get; protected set; }

    public DateTime? UpdatedAt { get; protected set; }
}