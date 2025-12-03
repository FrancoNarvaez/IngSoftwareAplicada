/// <reference types="cypress" />
describe('Products list', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should show products list page', () => {
    cy.contains('Products').click({ force: true });
    cy.url().should('include', '/product');
    cy.get('table').should('exist');
  });
});
