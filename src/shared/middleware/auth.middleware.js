import jwt from "jsonwebtoken";

const verifyUser = async (req, res, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");
    let decodedAccessToken;


    try {
      decodedAccessToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
      );
    } catch (error) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message:
          error.name === "TokenExpiredError"
            ? "Token expired"
            : "Invalid token",
        error: error.name,
      });
    }


    const userId = decodedAccessToken.id
  } catch (error) {}
};
