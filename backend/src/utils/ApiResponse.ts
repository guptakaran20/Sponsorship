export class ApiResponse<T = unknown> {
  public readonly success: boolean;
  public readonly message: string;
  public readonly data: T | null;

  constructor(success: boolean, message: string, data: T | null = null) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static ok<T>(message: string, data: T | null = null): ApiResponse<T> {
    return new ApiResponse<T>(true, message, data);
  }

  static error(message: string): ApiResponse<null> {
    return new ApiResponse<null>(false, message, null);
  }
}
