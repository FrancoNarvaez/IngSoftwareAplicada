/// <reference types="cypress" />
describe('Login flow', () => {
  it('should load homepage and login as admin', () => {
    cy.visit('/');
    cy.contains('Sign in').click({ force: true });
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin');
    cy.get('button[type="submit"]').click();
    cy.contains('Signed in as').should('exist');
  });
});
