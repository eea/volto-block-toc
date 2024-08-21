import React, { useEffect } from 'react';
import { Portal } from 'react-portal';

import { useFirstVisited } from '@eeacms/volto-block-toc/hooks';
import withDeviceSize from '@eeacms/volto-block-toc/hocs/withDeviceSize';
import { BodyClass, useDetectClickOutside } from '@plone/volto/helpers';
import './less/side-nav.less';

function IsomorphicPortal({ children, target }) {
  const [isClient, setIsClient] = React.useState();
  useEffect(() => setIsClient(true), []);

  return isClient ? (
    <Portal node={document.querySelector(target)}>{children}</Portal>
  ) : (
    children
  );
}

const withEEASideMenu = (WrappedComponent) =>
  withDeviceSize((props) => {
    const { mode, device } = props;
    const visible = useFirstVisited('.eea.header');
    const [isMenuOpen, setIsMenuOpen] = React.useState(true);
    const isSmallScreen = device === 'mobile' || device === 'tablet';

    const ClickOutsideListener = () => {
      setIsMenuOpen(false);
      setTimeout(() => setIsMenuOpen(true), 0);
    };

    const ref = useDetectClickOutside({
      onTriggered: ClickOutsideListener,
    });

    useEffect(() => {
      const sideNav = document?.querySelector(
        `.eea.header .eea-side-menu.${device}`,
      );
      if (sideNav) {
        if (!visible) sideNav.classList.add('fixed');
        else sideNav.classList.remove('fixed');
      }
    }, [visible]);

    return (
      <>
        <BodyClass className={'has-side-nav'} />
        {mode === 'edit' ? (
          <WrappedComponent {...props} />
        ) : (
          <IsomorphicPortal target={isSmallScreen ? '.eea.header' : '#view'}>
            <div
              className={`eea-side-menu ${props.device}`}
              ref={isSmallScreen ? ref : null}
            >
              <WrappedComponent
                isMenuOpenOnOutsideClick={isMenuOpen}
                {...props}
              />
            </div>
          </IsomorphicPortal>
        )}
      </>
    );
  });

export default withEEASideMenu;
