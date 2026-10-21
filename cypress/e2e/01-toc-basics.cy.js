import { slateBeforeEach, slateAfterEach } from '../support/e2e';

const SELECTED_SLATE_SELECTOR = '.slate-editor.selected [contenteditable=true]';
const SELECTED_SLATE_EDITOR = '.slate-editor.selected';

function addTextBlock() {
  // Insert a dedicated Text block after the currently selected block instead
  // of relying on the empty block that Slate splits off on {enter}.
  cy.get('.ui.basic.icon.button.block-add-button').first().click();
  cy.get(".blocks-chooser .ui.form .field.searchbox input[type='text']").type(
    'text',
  );
  cy.get('.blocks-chooser .button.slate').click();
}

function addHeading(text) {
  // Every heading gets its own Text block. The previous implementation reused
  // the block created by {enter}, but that split issues separate, asynchronous
  // `blocks`/`blocks_layout` updates which can land after the next heading was
  // typed and reset it to an empty block.
  addTextBlock();

  // Slate focuses a freshly inserted block in a deferred effect. Wait for it
  // before typing, otherwise keystrokes can land in the previous editor.
  cy.get(SELECTED_SLATE_SELECTOR)
    .should('be.focused')
    .click()
    .type(text)
    .click();

  // Make sure the text is still in the editor before computing the selection
  // offsets.
  cy.get(SELECTED_SLATE_SELECTOR).should('contain.text', text).setSelection(text);
  cy.clickSlateButton('Title');

  // Wait for the heading formatting to be committed to the block value before
  // creating the next block.
  cy.get(SELECTED_SLATE_EDITOR).should(($editor) => {
    expect($editor.attr('data-slate-value')).to.contain('"h2"');
  });
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
