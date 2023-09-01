import React from 'react';
import renderer from 'react-test-renderer';
import DefaultTocRenderer from './DefaultTocRenderer';

jest.mock('react-intl', () => ({
  injectIntl: jest.fn((Component) => Component),
}));

describe('DefaultTocRenderer', () => {
  it('renders correctly', () => {
    const component = renderer.create(
      <DefaultTocRenderer properties={{}} data={{ title: 'Heading title' }} />,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
    expect(component).toMatchSnapshot();
  });
});
