import { slateBeforeEach, slateAfterEach } from '../support/e2e';

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
    cy.get('.ui.drag.block.inner.slate').click().type('Title 1').click();
    cy.get('.ui.drag.block.inner.slate span span span').setSelection('Title 1');
    cy.get('.slate-inline-toolbar .button-wrapper a[title="Title"]').click({
      force: true,
    });
    cy.get('.ui.drag.block.inner.slate').click().type('{enter}');

    cy.get('.ui.drag.block.inner.slate').eq(1).click().type('Title 2').click();
    cy.get('.ui.drag.block.inner.slate span span span')
      .eq(1)
      .setSelection('Title 2');
    cy.get('.slate-inline-toolbar .button-wrapper a[title="Title"]').click({
      force: true,
    });
    cy.get('.ui.drag.block.inner.slate').eq(1).click().type('{enter}');

    // Save page
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // Check if the page contains the TOC and the headings
    cy.contains('Volto Toc');
    cy.contains('Title 1');
    cy.contains('Title 2');
    cy.get('a[href*="#title-1"]').click();
    cy.get('a[href*="#title-2"]').click();
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
    cy.get('.ui.drag.block.inner.slate')
      .click()
      .type('Lorem ipsum dolor sit amet')
      .click();
    cy.get('.ui.drag.block.inner.slate span span span').setSelection(
      'Lorem ipsum dolor sit amet',
    );
    cy.get('.slate-inline-toolbar .button-wrapper a[title="Title"]').click({
      force: true,
    });
    cy.get('.ui.drag.block.inner.slate').click().type('{enter}');

    cy.get('.ui.drag.block.inner.slate')
      .eq(1)
      .click()
      .type('Lorem ipsum dolor sit amet')
      .click();
    cy.get('.ui.drag.block.inner.slate span span span')
      .eq(1)
      .setSelection('Lorem ipsum dolor sit amet');
    cy.get('.slate-inline-toolbar .button-wrapper a[title="Title"]').click({
      force: true,
    });
    cy.get('.ui.drag.block.inner.slate').eq(1).click().type('{enter}');

    cy.get('.ui.drag.block.inner.slate')
      .eq(2)
      .click()
      .type('Lorem ipsum dolor sit amet')
      .click();
    cy.get('.ui.drag.block.inner.slate span span span')
      .eq(2)
      .setSelection('Lorem ipsum dolor sit amet');
    cy.get('.slate-inline-toolbar .button-wrapper a[title="Title"]').click({
      force: true,
    });
    cy.get('.ui.drag.block.inner.slate').eq(2).click().type('{enter}');

    cy.get('.ui.drag.block.inner.slate')
      .eq(3)
      .click()
      .type('Lorem ipsum dolor sit amet')
      .click();
    cy.get('.ui.drag.block.inner.slate span span span')
      .eq(3)
      .setSelection('Lorem ipsum dolor sit amet');
    cy.get('.slate-inline-toolbar .button-wrapper a[title="Title"]').click({
      force: true,
    });
    cy.get('.ui.drag.block.inner.slate').eq(3).click().type('{enter}');

    cy.get('.ui.drag.block.inner.slate')
      .eq(4)
      .click()
      .type('Lorem ipsum dolor sit amet')
      .click();
    cy.get('.ui.drag.block.inner.slate span span span')
      .eq(4)
      .setSelection('Lorem ipsum dolor sit amet');
    cy.get('.slate-inline-toolbar .button-wrapper a[title="Title"]').click({
      force: true,
    });
    cy.get('.ui.drag.block.inner.slate').eq(4).click().type('{enter}');

    cy.get('.ui.drag.block.inner.slate')
      .eq(5)
      .click()
      .type('Lorem ipsum dolor sit amet')
      .click();
    cy.get('.ui.drag.block.inner.slate span span span')
      .eq(5)
      .setSelection('Lorem ipsum dolor sit amet');
    cy.get('.slate-inline-toolbar .button-wrapper a[title="Title"]').click({
      force: true,
    });
    cy.get('.ui.drag.block.inner.slate').eq(5).click().type('{enter}');

    cy.get('.ui.drag.block.inner.slate')
      .eq(6)
      .click()
      .type('Lorem ipsum dolor sit amet')
      .click();
    cy.get('.ui.drag.block.inner.slate span span span')
      .eq(6)
      .setSelection('Lorem ipsum dolor sit amet');
    cy.get('.slate-inline-toolbar .button-wrapper a[title="Title"]').click({
      force: true,
    });
    cy.get('.ui.drag.block.inner.slate').eq(6).click().type('{enter}');

    cy.get('.ui.drag.block.inner.slate')
      .eq(7)
      .click()
      .type('Lorem ipsum dolor sit amet')
      .click();
    cy.get('.ui.drag.block.inner.slate span span span')
      .eq(7)
      .setSelection('Lorem ipsum dolor sit amet');
    cy.get('.slate-inline-toolbar .button-wrapper a[title="Title"]').click({
      force: true,
    });
    cy.get('.ui.drag.block.inner.slate').eq(7).click().type('{enter}');

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
    cy.get('.ui.drag.block.inner.slate').click().type('Title 1').click();
    cy.get('.ui.drag.block.inner.slate span span span').setSelection('Title 1');
    cy.get('.slate-inline-toolbar .button-wrapper a[title="Title"]').click({
      force: true,
    });
    cy.get('.ui.drag.block.inner.slate').click().type('{enter}');

    cy.get('.ui.drag.block.inner.slate').eq(1).click().type('Title 2').click();
    cy.get('.ui.drag.block.inner.slate span span span')
      .eq(1)
      .setSelection('Title 2');
    cy.get('.slate-inline-toolbar .button-wrapper a[title="Title"]').click({
      force: true,
    });
    cy.get('.ui.drag.block.inner.slate').eq(1).click().type('{enter}');

    // Save page
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // Check if the page contains the TOC and the headings
    cy.contains('Volto Toc');
    cy.contains('Title 1');
    cy.contains('Title 2');
    cy.get('a[href*="#title-1"]').click();
    cy.get('a[href*="#title-2"]').click();
    cy.get('h2[id="title-1"]').contains('Title 1');
    cy.get('h2[id="title-2"]').contains('Title 2');
    cy.get('.eea-side-menu').get('summary').click();
    cy.get('.eea-side-menu');
    cy.get('.eea-side-menu details').should('not.have.attr', 'open');
  });
});
