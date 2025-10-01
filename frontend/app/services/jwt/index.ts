import jwt from "jsonwebtoken";

export class JwtService {
  static verifyToken(token: string): any {
    try {
      const decoded = jwt.verify(token, String(process.env.JWT_SECRET));
      if(decoded) return true
    } catch (error) {
      throw new Error("Invalid API Key");
    }
  }
}
