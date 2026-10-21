import { slateBeforeEach, slateAfterEach } from '../support/e2e';

const SELECTED_SLATE_SELECTOR = '.slate-editor.selected [contenteditable=true]';
const SELECTED_SLATE_EDITOR = '.slate-editor.selected';
const SLATE_BLOCK_SELECTOR = '.content-area .slate-editor';
const MAX_TYPE_ATTEMPTS = 4;

function slateValueIsEmpty(editor) {
  const value = editor.attr('data-slate-value');
  if (!value || value === 'null') return true;
  // The block value was committed but contains no non-empty text node.
  return !/"text"\s*:\s*"[^"]+"/.test(value);
}

function typeIntoSelectedSlate(text, attempt = 1) {
  // The selected editor must be the freshly created (last) slate block. If it
  // isn't, typing would silently corrupt the previous heading.
  cy.get(SLATE_BLOCK_SELECTOR).last().should('have.class', 'selected');

  cy.get(SELECTED_SLATE_SELECTOR)
    .should('be.focused')
    .click()
    .type(text);

  // A pending block insert/split update can land right after typing and reset
  // the freshly created block to an empty one. Give the delayed focus/selection
  // timers (100-200ms) time to arrive before checking whether the text
  // survived.
  cy.wait(500);

  cy.get(SELECTED_SLATE_EDITOR).then(($editor) => {
    // Use the rendered text first: it updates immediately, while the committed
    // block value can lag behind a fast keystroke sequence.
    if ($editor.text().includes(text)) return;

    // Only retry the known "fresh block reset to empty" race. Anything else
    // is a genuine problem and shouldn't be hidden by a retry.
    expect(
      slateValueIsEmpty($editor),
      `Slate block to be empty after typing "${text}" (value: ${$editor.attr(
        'data-slate-value',
      )})`,
    ).to.be.true;
    expect(
      attempt,
      `"${text}" to stay in the Slate block after ${attempt} attempt(s)`,
    ).to.be.lessThan(MAX_TYPE_ATTEMPTS);

    typeIntoSelectedSlate(text, attempt + 1);
  });
}

function addHeading(text) {
  // Reuse the block created by the previous {enter} (or create the first one
  // when the page has no slate block yet).
  cy.getSlate({ createNewSlate: true }).then(() => {
    typeIntoSelectedSlate(text);
  });

  // Make sure the text is still in the editor before computing the selection
  // offsets.
  cy.get(SELECTED_SLATE_SELECTOR).should('contain.text', text).setSelection(text);
  cy.clickSlateButton('Title');

  // Wait for the heading formatting to be committed to the block value before
  // creating the next block.
  cy.get(SELECTED_SLATE_EDITOR).should(($editor) => {
    expect($editor.attr('data-slate-value')).to.contain('"h2"');
  });

  // {enter} splits the heading into its own block and creates the empty block
  // that the next heading is typed into. Wait for it, otherwise the next
  // heading would be appended to this one.
  cy.get(SLATE_BLOCK_SELECTOR).then(($editors) => {
    const blockCount = $editors.length;
    cy.get(SELECTED_SLATE_SELECTOR).click().type('{enter}');
    cy.get(SLATE_BLOCK_SELECTOR, { timeout: 10000 }).should(
      'have.length',
      blockCount + 1,
    );
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
