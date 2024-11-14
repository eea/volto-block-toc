import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Add this import for toBeInTheDocument matcher
import withEEASideMenu from './withEEASideMenu';
import { useFirstVisited } from '@eeacms/volto-block-toc/hooks';

// Mock the dependencies
jest.mock('@eeacms/volto-block-toc/hooks', () => ({
  useFirstVisited: jest.fn(),
}));

jest.mock('@eeacms/volto-block-toc/hocs/withDeviceSize', () => {
  return (Component) => (props) => <Component {...props} device="desktop" />;
});

jest.mock('@plone/volto/helpers', () => ({
  BodyClass: ({ className }) => <div data-testid="body-class">{className}</div>,
  useDetectClickOutside: () => ({ current: null }),
}));

// Mock ReactDOM.createPortal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (element) => element,
}));

describe('withEEASideMenu', () => {
  const MockComponent = () => <div data-testid="wrapped-component">Test</div>;
  const WrappedComponent = withEEASideMenu(MockComponent);

  beforeEach(() => {
    // Setup document structure
    document.body.innerHTML = `
      <div class="eea header"></div>
      <div id="view"></div>
    `;

    // Reset mocks
    useFirstVisited.mockReset();
    useFirstVisited.mockReturnValue(true);
  });

  it('renders the wrapped component', () => {
    render(<WrappedComponent />);
    expect(screen.getByTestId('wrapped-component')).toBeInTheDocument();
  });

  it('adds body class', () => {
    render(<WrappedComponent />);
    expect(screen.getByTestId('body-class')).toHaveTextContent('has-side-nav');
  });

  it('renders directly in edit mode', () => {
    render(<WrappedComponent mode="edit" />);
    expect(screen.getByTestId('wrapped-component')).toBeInTheDocument();
  });

  it('does not render when shouldRender is false', () => {
    render(<WrappedComponent shouldRender={false} />);
    expect(screen.queryByTestId('wrapped-component')).toBeNull();
  });

  it('handles mobile device', () => {
    const MobileWrappedComponent = withEEASideMenu(MockComponent);
    render(
      <MobileWrappedComponent
        device="mobile"
        targetParent=".eea.header"
        insertBeforeOnMobile=".some-element"
      />,
    );
    expect(screen.getByTestId('wrapped-component')).toBeInTheDocument();
  });

  it('adds fixed class when not visible', () => {
    useFirstVisited.mockReturnValue(false);

    const div = document.createElement('div');
    div.classList.add('eea-side-menu');
    div.classList.add('desktop');
    document.querySelector('.eea.header').appendChild(div);

    render(<WrappedComponent targetParent=".eea.header" />);

    expect(
      document
        .querySelector('.eea-side-menu.desktop')
        .classList.contains('fixed'),
    ).toBe(true);
  });

  it('removes fixed class when visible', () => {
    useFirstVisited.mockReturnValue(true);

    const div = document.createElement('div');
    div.classList.add('eea-side-menu');
    div.classList.add('desktop');
    document.querySelector('.eea.header').appendChild(div);

    render(<WrappedComponent targetParent=".eea.header" />);

    expect(
      document
        .querySelector('.eea-side-menu.desktop')
        .classList.contains('fixed'),
    ).toBe(false);
  });

  it('handles custom targetParent', () => {
    const customTarget = document.createElement('div');
    customTarget.classList.add('custom-target');
    document.body.appendChild(customTarget);

    render(<WrappedComponent targetParent=".custom-target" />);
    expect(screen.getByTestId('wrapped-component')).toBeInTheDocument();
  });

  it('uses custom fixedVisibilitySwitchTarget', () => {
    useFirstVisited.mockImplementation((target) => {
      // Return different values based on target
      return target === '.custom-switch-target' ? false : true;
    });

    const div = document.createElement('div');
    div.classList.add('eea-side-menu');
    div.classList.add('desktop');
    document.querySelector('.eea.header').appendChild(div);

    render(
      <WrappedComponent
        targetParent=".eea.header"
        fixedVisibilitySwitchTarget=".custom-switch-target"
      />,
    );

    // Verify useFirstVisited was called with custom target
    expect(useFirstVisited).toHaveBeenCalledWith(
      '.custom-switch-target',
      '0px',
    );

    // Verify fixed class is added because custom target is not visible
    expect(
      document
        .querySelector('.eea-side-menu.desktop')
        .classList.contains('fixed'),
    ).toBe(true);
  });

  it('uses custom fixedVisibilitySwitchTargetThreshold', () => {
    useFirstVisited.mockImplementation((target, threshold) => {
      // Return different values based on threshold
      return threshold === '100px' ? false : true;
    });

    const div = document.createElement('div');
    div.classList.add('eea-side-menu');
    div.classList.add('desktop');
    document.querySelector('.eea.header').appendChild(div);

    render(
      <WrappedComponent
        targetParent=".eea.header"
        fixedVisibilitySwitchTarget=".custom-switch-target"
        fixedVisibilitySwitchTargetThreshold="100px"
      />,
    );

    // Verify useFirstVisited was called with custom threshold
    expect(useFirstVisited).toHaveBeenCalledWith(
      '.custom-switch-target',
      '100px',
    );

    // Verify fixed class is added because threshold condition is met
    expect(
      document
        .querySelector('.eea-side-menu.desktop')
        .classList.contains('fixed'),
    ).toBe(true);
  });

  it('uses targetParentThreshold as default for fixedVisibilitySwitchTargetThreshold', () => {
    useFirstVisited.mockImplementation((target, threshold) => {
      // Return different values based on threshold
      return threshold === '50px' ? false : true;
    });

    const div = document.createElement('div');
    div.classList.add('eea-side-menu');
    div.classList.add('desktop');
    document.querySelector('.eea.header').appendChild(div);

    render(
      <WrappedComponent
        targetParent=".eea.header"
        targetParentThreshold="50px"
      />,
    );

    // Verify useFirstVisited was called with targetParentThreshold as default
    expect(useFirstVisited).toHaveBeenCalledWith('.eea.header', '50px');

    // Verify fixed class is added
    expect(
      document
        .querySelector('.eea-side-menu.desktop')
        .classList.contains('fixed'),
    ).toBe(true);
  });

  it('handles different combinations of visibility switch targets and thresholds', () => {
    const testCases = [
      {
        props: {
          targetParent: '.eea.header',
          fixedVisibilitySwitchTarget: '.custom-switch-target',
          fixedVisibilitySwitchTargetThreshold: '75px',
        },
        expectedTarget: '.custom-switch-target',
        expectedThreshold: '75px',
      },
      {
        props: {
          targetParent: '.eea.header',
          targetParentThreshold: '25px',
        },
        expectedTarget: '.eea.header',
        expectedThreshold: '25px',
      },
      {
        props: {
          targetParent: '.eea.header',
          fixedVisibilitySwitchTarget: '.custom-switch-target',
          targetParentThreshold: '30px',
        },
        expectedTarget: '.custom-switch-target',
        expectedThreshold: '30px',
      },
    ];

    testCases.forEach((testCase) => {
      useFirstVisited.mockClear();

      const div = document.createElement('div');
      div.classList.add('eea-side-menu');
      div.classList.add('desktop');
      document.querySelector('.eea.header').appendChild(div);

      render(<WrappedComponent {...testCase.props} />);

      expect(useFirstVisited).toHaveBeenCalledWith(
        testCase.expectedTarget,
        testCase.expectedThreshold,
      );
    });
  });

  it('handles component unmounting', () => {
    const { unmount } = render(
      <WrappedComponent
        device="mobile"
        targetParent=".eea.header"
        insertBeforeOnMobile=".some-element"
      />,
    );

    unmount();
    // Verify cleanup occurred successfully
    expect(document.querySelector('.eea-side-menu-mobile-wrapper')).toBeNull();
  });
});
