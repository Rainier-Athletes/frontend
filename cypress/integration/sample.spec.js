const isStubbed = true;

const backEndApiUrl = 'http://localhost:3000/login';

describe('First test', function() {
  it('Visits the Rainier Athletes portal', function() {
    cy.visit('http://localhost:3000/login')
    cy.request(failOnStatusCode(false))
  })
})
