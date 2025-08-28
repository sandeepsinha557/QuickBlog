import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import BlogList from "../BlogList";
import { useAppContext } from "../../context/AppContext";

// Mock the useAppContext hook
jest.mock("../../context/AppContext", () => ({
  useAppContext: jest.fn(),
}));

const mockBlogs = [
  {
    _id: "1",
    title: "Blog 1",
    description: "Description 1",
    category: "Technology",
    image: "image1.jpg",
  },
  {
    _id: "2",
    title: "Blog 2",
    description: "Description 2",
    category: "Startup",
    image: "image2.jpg",
  },
  {
    _id: "3",
    title: "Blog 3",
    description: "Description 3",
    category: "Lifestyle",
    image: "image3.jpg",
  },
];

describe("BlogList", () => {
  beforeEach(() => {
    useAppContext.mockReturnValue({
      blogs: mockBlogs,
      input: "",
    });
  });

  it("renders all blog categories and blog cards initially", () => {
    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>
    );

    // Check for categories
    expect(screen.getByRole("button", { name: /All/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Technology/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Startup/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Lifestyle/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Finance/i })
    ).toBeInTheDocument();

    // Check for all blog cards
    expect(screen.getByText("Blog 1")).toBeInTheDocument();
    expect(screen.getByText("Blog 2")).toBeInTheDocument();
    expect(screen.getByText("Blog 3")).toBeInTheDocument();
  });

  it("filters blogs by category when a category button is clicked", () => {
    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Technology/i }));

    expect(screen.getByText("Blog 1")).toBeInTheDocument();
    expect(screen.queryByText("Blog 2")).not.toBeInTheDocument();
    expect(screen.queryByText("Blog 3")).not.toBeInTheDocument();
  });

  it("filters blogs by input when input changes", () => {
    useAppContext.mockReturnValue({
      blogs: mockBlogs,
      input: "Blog 2",
    });

    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>
    );

    expect(screen.queryByText("Blog 1")).not.toBeInTheDocument();
    expect(screen.getByText("Blog 2")).toBeInTheDocument();
    expect(screen.queryByText("Blog 3")).not.toBeInTheDocument();
  });
});
