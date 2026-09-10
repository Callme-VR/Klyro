import jwt from "jsonwebtoken";

const getJwtSecret = (): string => process.env.JWT_SECRET || "default-secret";
const JWT_EXPIRES_IN = "4d";

export interface JwtPayload {
  userId: string;
  email: string;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, getJwtSecret()) as JwtPayload;
};

export const decodeToken = (token: string): JwtPayload => {
  return jwt.decode(token) as JwtPayload;
};

