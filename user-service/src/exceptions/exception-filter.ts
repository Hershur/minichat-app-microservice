import { Catch, HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';

@Catch(HttpException)
export class ExceptionFilter {
  catch(exception: HttpException): Observable<any> {
    return throwError(exception.getResponse());
  }
}
