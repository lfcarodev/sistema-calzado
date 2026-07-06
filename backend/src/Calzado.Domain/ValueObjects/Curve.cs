namespace Calzado.Domain.ValueObjects;

public class Curve
{
    public int StartSize { get; }
    public int EndSize { get; }
    public Curve(int startSize, int endSize)
    {
        if (startSize <= 0)
        {
            throw new ArgumentException("Start size must be greater than zero.");
        }

        if (endSize <= 0)
        {
            throw new ArgumentException("End size must be greater than zero.");
        }

        if (startSize > endSize)
        {
            throw new ArgumentException("Start size cannot be greater than end size.");
        }

        StartSize = startSize;
        EndSize = endSize;
    }
    public override string ToString()
    {
        return $"{StartSize}-{EndSize}";
    }
}