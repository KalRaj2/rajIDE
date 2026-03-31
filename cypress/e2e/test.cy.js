describe("Raj IDE Test", () => {
  it("loads app", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Code Editor");
  });
});