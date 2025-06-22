/// <reference types="cypress" />

// presale.cy.ts for Cypress

describe('Jeremy Presale Website E2E Tests', () => {
  beforeEach(() => {
    // Visit the base URL of the application before each test
    // Ensure your dev server (e.g., http://localhost:5173) is running
    cy.visit('/'); 
  });

  it('should display the hero section with title and CTA', () => {
    cy.get('section#hero').should('be.visible');
    cy.get('section#hero h1').should('contain.text', 'JEREMY');
    cy.get('section#hero a[href="#buy-panel"]').should('contain.text', 'Buy $JEREMY Now!'); // Using react-scroll, actual href might be different
    // Better to select by role or a data-cy attribute for react-scroll Link
    cy.contains('button, a', 'Buy $JEREMY Now!').should('be.visible');
  });

  it('should display the countdown section', () => {
    cy.get('section#countdown').should('be.visible');
    // More specific checks for countdown values would require mocking time or dynamic checks
  });

  it('should display the progress bar section', () => {
    cy.get('section#progress').should('be.visible');
    cy.get('section#progress .w-full.bg-neutral-700').should('exist'); // The progress bar container
  });

  it('should display the buy panel', () => {
    cy.get('div#buy-panel').should('be.visible');
  });

  it('should navigate to sections using header links (if applicable, adjust for react-scroll)', () => {
    // This test assumes direct anchor links. For react-scroll, interactions are different.
    // Example: Clicking a react-scroll Link
    // cy.contains('nav a', 'Tokenomics').click();
    // cy.get('section#tokenomics').should('be.visible');
    // Need to handle scroll behavior, viewport checks or specific scroll actions for react-scroll.
    // A simple check might be that the section exists:
    cy.get('section#tokenomics').should('exist');
    cy.get('section#roadmap').should('exist');
    cy.get('section#team').should('exist');
    cy.get('section#faq').should('exist');
  });

  // Wallet Connection Tests (More complex, requires mocking or real wallet interaction)
  // describe('Wallet Interaction', () => {
  //   it('should open connect wallet modal when "Connect Wallet" is clicked', () => {
  //     // This depends heavily on RainbowKit's DOM structure
  //     cy.contains('button', 'Connect Wallet').click();
  //     // Add assertions for the modal appearing, specific to RainbowKit's modal structure
  //     // e.g., cy.get('[data-rkmodal-overlay]').should('be.visible');
  //   });
  // });

  // Placeholder for Buy Flow E2E (Very complex, needs wallet interaction)
  // describe('Buy Token Flow', () => {
  //   beforeEach(() => {
  //     // Mock wallet connection or use a test wallet extension like Cypress-Metamask
  //     // cy.connectWallet(); // Custom command if using Cypress-Metamask
  //   });
  //   it('should allow user to input amount and attempt to buy tokens', () => {
  //     cy.get('div#buy-panel input[name="payAmount"]').type('0.1');
  //     // Further steps depend on contract state, approval, etc.
  //   });
  // });
});
