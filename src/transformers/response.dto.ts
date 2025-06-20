import { jsonResponse } from 'src/common/utils/response.util';

export class ResponseDto<T> {
  success: boolean;
  statusCode: number;
  data: T;
  message: string;

  constructor(statusCode: number, sucess: boolean, message: string, data: T) {
    jsonResponse(statusCode, true, message, data);
  }
}
