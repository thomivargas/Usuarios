"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedException = exports.BadRequestException = exports.NotFoundException = exports.HttpException = void 0;
class HttpException extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
    }
}
exports.HttpException = HttpException;
class NotFoundException extends HttpException {
    constructor(message = "Not Found") {
        super(404, message);
    }
}
exports.NotFoundException = NotFoundException;
class BadRequestException extends HttpException {
    constructor(message = "Bad Request") {
        super(400, message);
    }
}
exports.BadRequestException = BadRequestException;
class UnauthorizedException extends HttpException {
    constructor(message = "Unauthorized") {
        super(401, message);
    }
}
exports.UnauthorizedException = UnauthorizedException;
