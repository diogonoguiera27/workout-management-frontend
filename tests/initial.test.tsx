import { render, screen } from "@testing-library/react";

describe("Teste inicial frontend", () => {
  it("deve renderizar texto na tela", () => {
    render(<h1>Teste funcionando</h1>);

    expect(screen.getByText("Teste funcionando")).toBeInTheDocument();
  });
});