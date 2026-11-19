import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IntlProvider } from 'react-intl';
import DefaultTocRenderer from './DefaultTocRenderer';

const makeProps = (overrides = {}) => ({
  data: { title: 'My ToC' },
  properties: {},
  tocEntries: [],
  ...overrides,
});

const renderView = (props) =>
  render(
    <IntlProvider locale="en">
      <DefaultTocRenderer {...props} />
    </IntlProvider>,
  );

describe('DefaultTocRenderer title', () => {
  it('does not render the block title when there are no entries', () => {
    renderView(makeProps());

    expect(screen.queryByText('My ToC')).not.toBeInTheDocument();
  });

  it('renders the block title when there are entries', () => {
    renderView(
      makeProps({
        tocEntries: [{ id: 'b1-0', level: 2, title: 'A heading', items: [] }],
      }),
    );

    expect(screen.getByText('My ToC')).toBeInTheDocument();
  });

  it('does not render the block title when hide_title is set', () => {
    renderView(
      makeProps({
        data: { title: 'My ToC', hide_title: true },
        tocEntries: [{ id: 'b1-0', level: 2, title: 'A heading', items: [] }],
      }),
    );

    expect(screen.queryByText('My ToC')).not.toBeInTheDocument();
  });
});
