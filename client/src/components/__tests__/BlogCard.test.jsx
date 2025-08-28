import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import BlogCard from "../BlogCard";

describe("BlogCard", () => {
  const blog = {
    _id: "123",
    title: "Test Blog Post",
    description: "This is a test description.",
    category: "Testing",
    image: "test-image.jpg",
  };

  it("renders blog card with correct content", () => {
    render(
      <BrowserRouter>
        <BlogCard blog={blog} />
      </BrowserRouter>
    );

    expect(screen.getByText(/Test Blog Post/i)).toBeInTheDocument();
    expect(screen.getByText(/Testing/i)).toBeInTheDocument();
    expect(
      screen.getByText(/This is a test description./i)
    ).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "test-image.jpg");
  });
});
