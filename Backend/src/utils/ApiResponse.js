class ApiResponse {
  constructor(statusCode, message, data = null, meta = null) {
    this.success = statusCode < 400;
    this.message = message;
    if (data !== null) this.data = data;
    if (meta !== null) this.meta = meta;
  }

  static success(message, data = null, meta = null) {
    return new ApiResponse(200, message, data, meta);
  }

  static created(message, data = null) {
    return new ApiResponse(201, message, data);
  }

  static noContent(message = 'Deleted successfully') {
    return new ApiResponse(204, message);
  }
}

export default ApiResponse;
