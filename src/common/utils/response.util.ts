import { HttpStatus } from '@nestjs/common';

export function jsonResponse<T>(
  code: HttpStatus,
  success: boolean,
  message: string,
  data?: T,
) {
  return {
    code,
    success,
    message,
    data,
  };
}
