import { slateBeforeEach, slateAfterEach } from '../support/e2e';

const SELECTED_SLATE_SELECTOR = '.slate-editor.selected [contenteditable=true]';

function addHeading(text) {
  cy.getSlate({ createNewSlate: true }).click().type(text).click();
  cy.get(SELECTED_SLATE_SELECTOR).setSelection(text);
  cy.clickSlateButton('Title');
  cy.get(SELECTED_SLATE_SELECTOR).click().type('{enter}');
}

describe('Block Tests: Toc', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Add Block: Links', () => {
    // Change page title
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Volto Toc');
    cy.getSlate().click();

    // Add TOC block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get(".blocks-chooser .ui.form .field.searchbox input[type='text']").type(
      'table of contents',
    );
    cy.get('.button.toc').click();

    // Save page
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');
  });

  it('Add Block: add content to TOC', () => {
    // Change page title
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Volto Toc');
    cy.getSlate().click();

    // Add TOC block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get(".blocks-chooser .ui.form .field.searchbox input[type='text']").type(
      'table of contents',
    );
    cy.get('.button.toc').click();

    // Add headings
    addHeading('Title 1');
    addHeading('Title 2');

    // Save page
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // Check if the page contains the TOC and the headings
    cy.contains('Volto Toc');
    cy.contains('Title 1');
    cy.contains('Title 2');
    // cy.get('a[href="#title-1"]').click();
    // cy.get('a[href="#title-2"]').click();
    cy.get('h2[id="title-1"]').contains('Title 1');
    cy.get('h2[id="title-2"]').contains('Title 2');
  });

  it('Add Block: add horizontal TOC', () => {
    // Change page title
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Volto Toc');
    cy.getSlate().click();

    // Add TOC block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get(".blocks-chooser .ui.form .field.searchbox input[type='text']").type(
      'table of contents',
    );
    cy.get('.button.toc').click();
    cy.get('#sidebar-properties .form .react-select-container').first().click();
    cy.contains('Horizontal Menu').click();
    cy.contains('Sticky').click();

    // Add headings
    Cypress._.times(8, () => addHeading('Lorem ipsum dolor sit amet'));

    // Save page
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // Check if the page contains the TOC and the dropdown button
    cy.contains('Volto Toc');
    cy.get('.table-of-contents  .dropdown').contains('More').click();
  });

  it('Add Block: add side menu TOC', () => {
    // Change page title
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Volto Toc');
    cy.getSlate().click();

    // Add TOC block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get(".blocks-chooser .ui.form .field.searchbox input[type='text']").type(
      'table of contents',
    );
    cy.get('.button.toc').click();

    cy.get('#sidebar-properties .form .react-select-container').first().click();
    cy.contains('Side Menu').click();

    // Add headings
    addHeading('Title 1');
    addHeading('Title 2');

    // Save page
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // Check if the page contains the TOC and the headings
    cy.contains('Volto Toc');
    cy.contains('Title 1');
    cy.contains('Title 2');
    // cy.get('a[href="#title-1"]').click();
    // cy.get('a[href="#title-2"]').click();
    cy.get('h2[id="title-1"]').contains('Title 1');
    cy.get('h2[id="title-2"]').contains('Title 2');
    cy.get('.eea-side-menu').get('summary').click();
    cy.get('.eea-side-menu');
    cy.get('.eea-side-menu details').should('not.have.attr', 'open');
  });
});
