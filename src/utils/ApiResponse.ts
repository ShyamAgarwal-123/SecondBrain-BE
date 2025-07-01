export interface ApiResponseOptions {
  statusCode: number;
  data?: any;
  message?: string;
  [key: string]: any;
}

export default class ApiResponse {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;
  path?: any;
  constructor({
    statusCode,
    data = [],
    message = "success",
    ...props
  }: ApiResponseOptions) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    this.path =
      props && typeof props === "object" && "path" in props
        ? props.path
        : undefined;
  }
}
