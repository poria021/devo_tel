import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { log } from 'console';
import { Request, Response } from 'express';
import {
  CannotCreateEntityIdMapError,
  MustBeEntityError,
  QueryFailedError,
} from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger();

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let message = (exception as any).message.message;
    let code = 'HttpException';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    try {
      this.logger.error(
        message,
        (exception as any).stack,
        `${request.method} ${request.url}`,
      );
      let errors: any;

      // switch (exception.constructor) {
      //    case HttpException:
      if (exception instanceof HttpException) {
        status = (exception as HttpException).getStatus();
        errors = (exception as any).getResponse();
        message = errors.message;
      }
      // case QueryFailedError: // this is a TypeOrm error
      else if (exception instanceof QueryFailedError) {
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as QueryFailedError).message;
        message = 'invalid input provided.Please review and try again.';
        code = (exception as any).code;
      }

      // case EntityNotFoundError: // this is another TypeOrm error
      else if (exception instanceof EntityNotFoundError) {
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as EntityNotFoundError).message;
        message = 'invalid input provided.Please review and try again.';
        code = (exception as any).code;
      }

      // case CannotCreateEntityIdMapError: // and another
      else if (
        exception instanceof CannotCreateEntityIdMapError ||
        exception instanceof MustBeEntityError
      ) {
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as CannotCreateEntityIdMapError).message;
        code = (exception as any).code;
        message = 'invalid input provided.Please review and try again.';
      } else {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'server error.Please try later.';
      }
      response.status(status).json({
        msg: message,
      });
    } catch (error) {
      this.logger.error('-----in logger catch------');
      this.logger.error(error);
      response.status(status).json({
        msg: 'اررور بک اند',
      });
    }
  }
}
