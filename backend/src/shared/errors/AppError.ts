/** Domain error carrying an HTTP status. Thrown by services, caught by middleware. */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const badRequest = (m: string, d?: unknown) => new AppError(m, 400, d);
export const unauthorized = (m = "Não autenticado") => new AppError(m, 401);
export const forbidden = (m = "Acesso negado") => new AppError(m, 403);
export const notFound = (m = "Não encontrado") => new AppError(m, 404);
export const conflict = (m: string) => new AppError(m, 409);
