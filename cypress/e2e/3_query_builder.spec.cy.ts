
describe('search query builder', () => {
  it('should go to search page and test query builder', () => {
    cy.visit('http://localhost:8080/');
    cy.contains('button', 'Search').click();
    cy.contains('button', 'Query Builder').click();
    // result array should be empty/not exist
    cy.get('.css-1ofqig9 > .chakra-heading').should('not.exist');
    cy.contains('button', '+Rule').click();
    cy.get('[data-testid="operators"]').select('contains');
    cy.get('[data-testid="value-editor"]').type('box');
    // press search button
    cy.get(':nth-child(1) > .css-1lt0o92 > .chakra-button').click();
    // result array should exist
    cy.get('.css-1ofqig9 > .chakra-heading').should('contain.text', 'search results');
  });
});