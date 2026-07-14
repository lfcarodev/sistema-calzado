const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5051/api";

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${apiUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError(
      "No se pudo conectar con la API. Verifica que el backend esté iniciado en http://localhost:5051.",
    );
  }

  if (!response.ok) {
    throw new ApiError(`La solicitud no pudo completarse (${response.status}).`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function apiBlob(path: string): Promise<Blob> {
  const response = await fetch(`${apiUrl}${path}`);
  if (!response.ok) throw new ApiError(`La solicitud no pudo completarse (${response.status}).`);
  return response.blob();
}
