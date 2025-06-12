class ApiError {
    constructor(statusCode = 400, message = "Something went wrong", error = null, status = false) {
        this.statusCode = statusCode;
        this.message = message;
        this.error = error;
        this.status = status;
        this.data = null;
    }
}

export { ApiError };