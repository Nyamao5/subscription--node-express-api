import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: any; // Or a more specific user type if you have one
}

const authorize = (requiredRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user; // Assuming req.user is populated by your authentication middleware

    if (!user) {
      // This case should ideally not happen if authMiddleware is used before
      return res.status(401).json({ message: 'Unauthorized: No user information' });
    }

    // Assuming user.customClaims contains the roles or permissions
    const userRoles = user.customClaims?.roles || []; // Adjust based on your custom claims structure

    const hasPermission = requiredRoles.some(role => userRoles.includes(role));

    if (hasPermission) {
      next(); // User has the required role, proceed
    } else {
      res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
  };
};

export default authorize;