import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export const verifyToken = async (
  req: NextRequest,
  res: NextResponse,
  next: () => void
): Promise<NextResponse | void> => {
  const Authorization = req.headers.get("authorization");

  // Check if authorization header exists
  if (!Authorization) {
    return NextResponse.json(
      { success: false, message: "Authorization header not found" },
      { status: 401 }
    );
  }

  const token = Authorization.split(" ")[1];

  try {
    // Verify the token using the secret key
    const user = jwt.verify(token, process.env.JWT_SEC as string);

    // Attach user to the request object
    (req as any).user = user;
    
    next();
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 403 }
    );
  }
};

export const verifyTokenAndAdmin = async (
  req: NextRequest,
  res: NextResponse,
  next: () => void
): Promise<NextResponse | void> => {
  try {
    // Await the token verification first
    await verifyToken(req, res, () => {});

    // Check if the user is an admin
    const user = (req as any).user;

    if (user?.isAdmin) {
      return next();
    } else {
      return NextResponse.json(
        { success: false, message: "You are not an admin" },
        { status: 403 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 403 }
    );
  }
};
