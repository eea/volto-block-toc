import React, { useEffect, useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';

import { useFirstVisited } from '@eeacms/volto-block-toc/hooks';
import withDeviceSize from '@eeacms/volto-block-toc/hocs/withDeviceSize';
import { BodyClass, useDetectClickOutside } from '@plone/volto/helpers';
import './less/side-nav.less';

function IsomorphicPortal({ children, target, insertBeforeOnMobile }) {
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setIsClient(true);

    if (insertBeforeOnMobile) {
      const targetNode = document.querySelector(target);
      const beforeNode = targetNode?.querySelector(insertBeforeOnMobile);

      if (targetNode && beforeNode && !containerRef.current) {
        const div = document.createElement('div');
        div.classList.add('eea-side-menu-mobile-wrapper');
        targetNode.insertBefore(div, beforeNode);
        containerRef.current = div;
      }
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.remove();
        containerRef.current = null;
      }
    };
  }, [target, insertBeforeOnMobile]);

  if (!isClient) {
    return children;
  }

  if (insertBeforeOnMobile && containerRef.current) {
    return ReactDOM.createPortal(children, containerRef.current);
  }

  return ReactDOM.createPortal(children, document.querySelector(target));
}

const withEEASideMenu = (WrappedComponent) =>
  withDeviceSize((props) => {
    const {
      mode,
      device,
      targetParent = '.eea.header',
      fixedVisibilitySwitchTarget = targetParent,
      insertBeforeOnMobile = null,
      shouldRender = true,
      fixedVisibilitySwitchTargetThreshold = '0px',
    } = props;
    const visible = useFirstVisited(
      fixedVisibilitySwitchTarget,
      fixedVisibilitySwitchTargetThreshold,
    );
    const [isMenuOpen, setIsMenuOpen] = React.useState(true);
    const isSmallScreen = device === 'mobile' || device === 'tablet';

    const ClickOutsideListener = useCallback(() => {
      setIsMenuOpen(false);
      setTimeout(() => setIsMenuOpen(true), 0);
    }, []);

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
      shouldRender && (
        <>
          {' '}
          <BodyClass className={'has-side-nav'} />
          {mode === 'edit' ? (
            <WrappedComponent {...props} />
          ) : (
            <IsomorphicPortal
              target={isSmallScreen ? targetParent : '#view'}
              insertBeforeOnMobile={isSmallScreen ? insertBeforeOnMobile : null}
            >
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
      )
    );
  });

/* can be used to override the default targetParent 
export default compose(
  (WrappedComponent) => (props) => 
    withEEASideMenu(WrappedComponent)({ ...props, 
    targetParent: '.your-custom-target',
    insertBeforeOnMobile: '.banner', // add if you need the WrappedContent to be added before a certain
    element inside the targetParent 
    fixedVisibilitySwitchTargetThreshold: '100px' })
)(Component);
*/

export default withEEASideMenu;
