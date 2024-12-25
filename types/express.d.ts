import { userDocument } from "../src/models/userModel";

declare global {
  namespace Express {
   export  interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}
