class ApiResponse {
    constructor(statusCode, message, data = [], status = true) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.status = status < 300;
    }
}

export { ApiResponse };
