import * as jwt from "jsonwebtoken";
import { config } from "src/config/config";

export class JwtService {
  static generateToken(apiKey: string): string {
    const data = {
      apiKey,
    };
    return jwt.sign(data, String(config.JWT_SECRET), {
      expiresIn: "1h",
    });
  }

  static verifyToken(token: string): any {
    try {
      const decoded = jwt.verify(token, String(config.JWT_SECRET));
      return decoded;
    } catch (error) {
      throw new Error("Invalid API Key");
    }
  }
}
