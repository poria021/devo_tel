import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
// import { RequestService } from '../request.service';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthenticationMiddleware.name);

  // constructor(private readonly requestService: RequestService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Authenticate the request
    this.logger.debug('we are in Middleware...');
    const userId = '123';
    // this.requestService.setUserId(userId);

    next();
  }
}
