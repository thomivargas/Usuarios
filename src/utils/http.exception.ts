export class HttpException extends Error {
    status;
    message;
  
    constructor(status: any, message: any) {
      super(message);
      this.status = status;
      this.message = message;
    }
  }
  
  export class NotFoundException extends HttpException {
    constructor(message = "Not Found") {
      super(404, message);
    }
  }
  
  export class BadRequestException extends HttpException {
    constructor(message = "Bad Request") {
      super(400, message);
    }
  }
  export class UnauthorizedException extends HttpException {
    constructor(message = "Unauthorized") {
      super(401, message);
    }
  }