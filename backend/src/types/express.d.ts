import type { Role } from "../shared/auth/roles.js";

declare global {
  namespace Express {
    interface Request {
      /** Populated by the authenticate middleware. */
      user?: {
        id: string;
        role: Role;
        email: string;
      };
    }
  }
}

export {};
