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
    const {
      mode,
      device,
      targetParent = '.eea.header',
      targetParentThreshold = '-100px',
    } = props;
    const visible = useFirstVisited(targetParent, targetParentThreshold);
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
        `${targetParent} .eea-side-menu.${device}`,
      );
      if (sideNav) {
        if (!visible) sideNav.classList.add('fixed');
        else sideNav.classList.remove('fixed');
      }
    }, [visible, targetParent, device]);

    return (
      <>
        <BodyClass className={'has-side-nav'} />
        {mode === 'edit' ? (
          <WrappedComponent {...props} />
        ) : (
          <IsomorphicPortal target={isSmallScreen ? targetParent : '#view'}>
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

/* can be used to override the default targetParent 
export default compose(
  (WrappedComponent) => (props) => 
    withEEASideMenu(WrappedComponent)({ ...props, targetParent: '.your-custom-target', targetParentThreshold: '100px' })
)(Component);
*/

export default withEEASideMenu;
