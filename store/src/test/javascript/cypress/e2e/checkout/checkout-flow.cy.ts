/// <reference types="cypress" />

describe('Checkout flow', () => {
  it('adds a product to cart and proceeds to checkout', () => {
    cy.visit('/');
    cy.contains('Products').click({ force: true });
    // Click first "Add to cart" button if present
    cy.get('button')
      .contains(/add to cart/i)
      .first()
      .click({ force: true });
    cy.contains(/cart/i).click({ force: true });
    cy.url().should('include', '/cart');
    cy.contains(/checkout/i).click({ force: true });
    cy.url().should('include', '/checkout');
  });
});
