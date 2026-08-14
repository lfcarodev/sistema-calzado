namespace Calzado.API.Middleware;

public static class ExceptionMiddlewareExtensions
{
    public static IApplicationBuilder UseMiddleware(this IApplicationBuilder app)
    {
        return app.UseMiddleware<ExceptionMiddleware>();
    }
}