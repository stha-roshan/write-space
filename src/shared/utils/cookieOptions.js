export const accessTokenCookieOption = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== "development",
  maxAge: 60 * 60 * 1000,
  path: "/",
  sameSite: "strict",
};

export const refreshTokenCookieOption = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== "development",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/users/refresh",
  sameSite: "strict",
};
