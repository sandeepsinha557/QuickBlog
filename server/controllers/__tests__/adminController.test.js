import jwt from "jsonwebtoken";
import { adminLogin } from "../adminController.js";

// Mock jwt.sign
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mockToken"),
}));

describe("adminLogin", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {},
    };
    res = {
      json: jest.fn(),
    };
  });

  it("should return success: true and a token for valid credentials", async () => {
    req.body = {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    };

    await adminLogin(req, res);

    expect(jwt.sign).toHaveBeenCalledWith(
      { email: process.env.ADMIN_EMAIL },
      process.env.JWT_SECRET
    );
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      token: "mockToken",
    });
  });

  it("should return success: false and an error message for invalid credentials", async () => {
    req.body = {
      email: "wrong@example.com",
      password: "wrongpassword",
    };

    await adminLogin(req, res);

    expect(jwt.sign).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid Credentials",
    });
  });

  it("should return success: false and an error message for missing email", async () => {
    req.body = {
      password: process.env.ADMIN_PASSWORD,
    };

    await adminLogin(req, res);

    expect(jwt.sign).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid Credentials",
    });
  });

  it("should return success: false and an error message for missing password", async () => {
    req.body = {
      email: process.env.ADMIN_EMAIL,
    };

    await adminLogin(req, res);

    expect(jwt.sign).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid Credentials",
    });
  });

  it("should handle unexpected errors during login", async () => {
    const errorMessage = "Something went wrong";
    jwt.sign.mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });

    req.body = {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    };

    await adminLogin(req, res);

    expect(jwt.sign).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: errorMessage,
    });
  });
});
