import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class TcpExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const error = exception.getError();

    console.log(error);
    console.log(typeof error === 'string');

    return throwError(() =>
      typeof error === 'string'
        ? { statusCode: 400, message: error }
        : { statusCode: 400, ...error },
    );
  }
}
