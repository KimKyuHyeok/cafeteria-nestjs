import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = 500;
    let message = '서버 내부 오류가 발생했습니다.';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const errorResponse = exception.getResponse();

      if (typeof errorResponse === 'string') {
        message = errorResponse;
      } else if (typeof errorResponse === 'object' && errorResponse !== null) {
        message = errorResponse['message'] || JSON.stringify(errorResponse);
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      statusCode = 400;
      switch (exception.code) {
        case 'P2002':
          message = '이미 존재하는 데이터입니다.';
          break;
        case 'P2025':
          message = '해당 데이터를 찾을 수 없습니다.';
          break;
        default:
          message = '잘못된 요청입니다.';
      }
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      statusCode = 400;
      message = '데이터 유효성 검사에 실패했습니다.';
    }

    // Express에 맞춰 상태 코드를 설정
    if (response.status) {
      response.status(statusCode).json({
        success: false,
        message,
      });
    }
  }
}
