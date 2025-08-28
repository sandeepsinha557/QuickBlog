import { addBlog } from "../blogController.js";
import fs from "fs";
import { imagekit } from "../../configs/imageKit.js"; // Named import
import Blog from "../../models/Blog.js";
import Comment from "../../models/Comment.js";
import main from "../../configs/gemini.js";

// Mock dependencies
jest.mock("fs");

jest.mock("../../configs/imageKit.js", () => ({
  __esModule: true,
  imagekit: {
    upload: jest.fn(),
    url: jest.fn(),
  },
}));

jest.mock("../../models/Blog.js");
jest.mock("../../models/Comment.js");
jest.mock("../../configs/gemini.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("addBlog", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock request and response objects
    req = {
      body: {},
      file: null,
    };
    res = {
      json: jest.fn(),
    };

    // Mock fs.readFileSync
    fs.readFileSync.mockReturnValue("mock-file-buffer");

    // Reset and mock imagekit methods before each test
    imagekit.upload.mockResolvedValue({
      filePath: "/mock/path/image.jpg",
    });
    imagekit.url.mockReturnValue(
      "http://mock.imagekit.io/optimized-image.webp"
    );

    // Mock Blog.create
    Blog.create.mockResolvedValue({});
  });

  it("should add a blog successfully with all required fields", async () => {
    req.body = {
      blog: JSON.stringify({
        title: "Test Blog",
        subTitle: "Test Subtitle",
        description: "Test Description",
        category: "Technology",
        isPublished: true,
      }),
    };
    req.file = { path: "uploads/test.jpg", originalname: "test.jpg" };

    await addBlog(req, res);

    expect(fs.readFileSync).toHaveBeenCalledWith("uploads/test.jpg");
    expect(imagekit.upload).toHaveBeenCalledWith({
      file: "mock-file-buffer",
      fileName: "test.jpg",
      folder: "/blogs",
    });
    expect(imagekit.url).toHaveBeenCalledWith({
      path: "/mock/path/image.jpg",
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "1280" },
      ],
    });
    expect(Blog.create).toHaveBeenCalledWith({
      title: "Test Blog",
      subTitle: "Test Subtitle",
      description: "Test Description",
      category: "Technology",
      image: "http://mock.imagekit.io/optimized-image.webp",
      isPublished: true,
    });
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Blog added successfully",
    });
  });

  it("should return an error if required fields are missing", async () => {
    req.body = {
      blog: JSON.stringify({
        title: "Test Blog",
        description: "Test Description",
        category: "Technology",
      }),
    };
    req.file = null;

    await addBlog(req, res);

    expect(fs.readFileSync).not.toHaveBeenCalled();
    expect(imagekit.upload).not.toHaveBeenCalled();
    expect(Blog.create).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Missing required fields",
    });
  });

  it("should handle errors during image upload", async () => {
    req.body = {
      blog: JSON.stringify({
        title: "Test Blog",
        subTitle: "Test Subtitle",
        description: "Test Description",
        category: "Technology",
        isPublished: true,
      }),
    };
    req.file = { path: "uploads/test.jpg", originalname: "test.jpg" };
    imagekit.upload.mockRejectedValue(new Error("Upload failed"));

    await addBlog(req, res);

    expect(fs.readFileSync).toHaveBeenCalled();
    expect(imagekit.upload).toHaveBeenCalled();
    expect(Blog.create).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Upload failed",
    });
  });

  it("should handle errors during blog creation", async () => {
    req.body = {
      blog: JSON.stringify({
        title: "Test Blog",
        subTitle: "Test Subtitle",
        description: "Test Description",
        category: "Technology",
        isPublished: true,
      }),
    };
    req.file = { path: "uploads/test.jpg", originalname: "test.jpg" };
    Blog.create.mockRejectedValue(new Error("Database error"));

    await addBlog(req, res);

    expect(fs.readFileSync).toHaveBeenCalled();
    expect(imagekit.upload).toHaveBeenCalled();
    expect(Blog.create).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Database error",
    });
  });
});
