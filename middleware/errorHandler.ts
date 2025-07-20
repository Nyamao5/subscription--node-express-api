import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error stack for debugging

  const statusCode = err.statusCode || 500; // Use the error's status code if available, otherwise 500
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    message: message,
    // Optionally, add more details in development mode
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorHandler;