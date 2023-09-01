import React from 'react';
import renderer from 'react-test-renderer';
import HorizontalMenu from './HorizontalMenu';

jest.mock('react-intl', () => ({
  injectIntl: jest.fn((Component) => Component),
}));

describe('HorizontalMenu', () => {
  it('renders correctly', () => {
    const component = renderer.create(
      <HorizontalMenu properties={{}} data={{ title: 'Heading title' }} />,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
    expect(component).toMatchSnapshot();
  });
});
