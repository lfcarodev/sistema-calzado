namespace Calzado.API.Services;

public class FileStorageService
{
    private readonly IWebHostEnvironment _environment;

    public FileStorageService(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task<string?> SaveProductPhotoAsync(
        IFormFile? photo,
        string reference,
        string color,
        int curveStart,
        int curveEnd,
        string? previousPhotoPath = null)
    {
        if (photo is null || photo.Length == 0)
        {
            return null;
        }

        var uploadsFolder = Path.Combine(
            _environment.ContentRootPath,
            "uploads",
            "products");

        Directory.CreateDirectory(uploadsFolder);

        if (!string.IsNullOrWhiteSpace(previousPhotoPath))
        {
            var previousFile = Path.Combine(
                _environment.ContentRootPath,
                previousPhotoPath.Replace("/", Path.DirectorySeparatorChar.ToString()));

            if (File.Exists(previousFile))
            {
                File.Delete(previousFile);
            }
        }

        var extension = Path.GetExtension(photo.FileName);

        var uniqueId = Guid.NewGuid().ToString("N")[..8];

        var fileName =
            $"{reference.Trim().ToUpperInvariant()}_" +
            $"{color.Trim().ToUpperInvariant()}_" +
            $"{curveStart}-{curveEnd}_" +
            $"{uniqueId}" +
            $"{extension}";

        var filePath = Path.Combine(uploadsFolder, fileName);

        using var stream = new FileStream(
            filePath,
            FileMode.Create);

        await photo.CopyToAsync(stream);

        return Path.Combine("uploads", "products", fileName)
            .Replace("\\", "/");
    }
}