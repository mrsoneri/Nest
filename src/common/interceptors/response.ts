import {
  CallHandler,
  ExecutionContext,
  HttpCode,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: any;
}

type ReturnType = [typeof HttpCode | null, boolean | null, string | null, any];

@Injectable()
export class ResponseTransformInterceptor
  implements NestInterceptor<ReturnType, ApiResponse>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<ReturnType>,
  ): Observable<ApiResponse> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const transformedData = this.transformData(data[3]);
        return {
          statusCode: data[0] ?? response.statusCode,
          success: data[1] ?? true,
          message: data[2] ?? 'successful',
          data: transformedData,
        };
      }),
    );
  }
  private transformData<T extends object | object[]>(data: T): T {
    if (Array.isArray(data)) {
      return data.map((item) => this.processItem(item)) as T;
    } else {
      return this.processItem(data);
    }
  }

  private processItem<T extends object>(item: T): T {
    if (!item || typeof item !== 'object') {
      return item;
    }

    return { ...item };
  }
}
