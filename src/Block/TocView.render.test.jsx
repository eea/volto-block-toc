import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IntlProvider } from 'react-intl';
import config from '@plone/volto/registry';
import View from './TocView';

jest.mock('@eeacms/volto-block-toc/hocs/withDeviceSize', () => ({
  __esModule: true,
  default: (WrappedComponent) => WrappedComponent,
}));

jest.mock('@plone/volto/helpers//Extensions', () => ({
  withBlockExtensions: (WrappedComponent) => WrappedComponent,
}));

jest.mock('react-redux', () => ({
  useSelector: () => ({}),
  shallowEqual: () => true,
}));

const Renderer = () => <div data-testid="renderer" />;

const makeProps = (overrides = {}) => ({
  mode: 'edit',
  data: {},
  properties: { UID: 'uid-1', blocks: {}, blocks_layout: { items: [] } },
  variation: { id: 'default', view: Renderer },
  ...overrides,
});

describe('TocView placeholder', () => {
  beforeEach(() => {
    config.settings = { ...config.settings, toc: undefined };
    config.blocks = { blocksConfig: {} };
  });

  it('shows a placeholder in edit mode when there are no entries', () => {
    render(
      <IntlProvider locale="en">
        <View {...makeProps()} />
      </IntlProvider>,
    );

    expect(
      screen.getByText(/The table of contents is empty/i),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('renderer')).not.toBeInTheDocument();
  });

  it('still shows the placeholder when a title is configured', () => {
    render(
      <IntlProvider locale="en">
        <View {...makeProps({ data: { title: 'My ToC' } })} />
      </IntlProvider>,
    );

    expect(screen.getByText('My ToC')).toBeInTheDocument();
    expect(
      screen.getByText(/The table of contents is empty/i),
    ).toBeInTheDocument();
  });

  it('renders the variation when entries are available', () => {
    config.blocks = {
      blocksConfig: {
        slate: { tocEntry: () => [2, 'A heading'] },
      },
    };
    const properties = {
      UID: 'uid-1',
      blocks: { b1: { '@type': 'slate' } },
      blocks_layout: { items: ['b1'] },
    };

    render(
      <IntlProvider locale="en">
        <View {...makeProps({ properties })} />
      </IntlProvider>,
    );

    expect(screen.getByTestId('renderer')).toBeInTheDocument();
    expect(
      screen.queryByText(/The table of contents is empty/i),
    ).not.toBeInTheDocument();
  });

  it('does not show the placeholder outside edit mode', () => {
    render(
      <IntlProvider locale="en">
        <View {...makeProps({ mode: 'view' })} />
      </IntlProvider>,
    );

    expect(screen.getByTestId('renderer')).toBeInTheDocument();
    expect(
      screen.queryByText(/The table of contents is empty/i),
    ).not.toBeInTheDocument();
  });
});
