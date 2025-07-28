import React, { useEffect, useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';

import { useFirstVisited } from '@eeacms/volto-block-toc/hooks';
import withDeviceSize from '@eeacms/volto-block-toc/hocs/withDeviceSize';
import { BodyClass, useDetectClickOutside } from '@plone/volto/helpers';
import './less/side-nav.less';

function IsomorphicPortal({
  children,
  target,
  insertBefore,
  insertBeforeOnMobile,
  wrapperClassName = 'eea-side-menu-wrapper',
}) {
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef(null);
  const containerMobileRef = useRef(null);

  useEffect(() => {
    setIsClient(true);

    const createContainer = (selector, containerRef) => {
      const targetNode = document.querySelector(target);
      const beforeNode = targetNode?.querySelector(selector);

      if (targetNode && beforeNode && !containerRef.current) {
        const div = document.createElement('div');
        div.classList.add(wrapperClassName);
        targetNode.insertBefore(div, beforeNode);
        containerRef.current = div;
      }
    };

    const cleanupContainer = (containerRef) => {
      if (containerRef.current) {
        containerRef.current.remove();
        containerRef.current = null;
      }
    };

    if (insertBefore) {
      createContainer(insertBefore, containerRef);
    }
    if (insertBeforeOnMobile) {
      createContainer(insertBeforeOnMobile, containerMobileRef);
    }

    return () => {
      cleanupContainer(containerRef);
      cleanupContainer(containerMobileRef);
    };
  }, [target, insertBefore, insertBeforeOnMobile, wrapperClassName]);

  if (!isClient) {
    return children;
  }

  if (insertBefore && containerRef.current) {
    return ReactDOM.createPortal(children, containerRef.current);
  }
  if (insertBeforeOnMobile && containerMobileRef.current) {
    return ReactDOM.createPortal(children, containerMobileRef.current);
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
      insertBefore = null,
      insertBeforeOnMobile = null,
      wrapperClassName = 'eea-side-menu-wrapper',
      shouldRender = true,
      targetParentThreshold = '0px',
      fixedVisibilitySwitchTargetThreshold = targetParentThreshold,
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
          <BodyClass
            className={`${
              insertBefore ? 'has-full-page-document' : 'has-side-nav'
            }`}
          />
          {mode === 'edit' ? (
            <WrappedComponent {...props} />
          ) : (
            <IsomorphicPortal
              target={isSmallScreen ? targetParent : '#view'}
              insertBeforeOnMobile={isSmallScreen ? insertBeforeOnMobile : null}
              insertBefore={insertBefore}
              wrapperClassName={wrapperClassName}
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
    targetParentThreshold: '100px', // the threshold at which the menu will be visible when targetParent is not visible
    insertBefore: '#page-document', // add if you need the WrappedContent to be added before a certain element inside the targetParent
    wrapperClassName: 'custom-wrapper-class', // custom class for the wrapper div (default: 'eea-side-menu-wrapper')
    insertBeforeOnMobile: '.banner', // where to insert the side menu on mobile devices
    fixedVisibilitySwitchTarget: '.main.bar', // add if you need the menu to be fixed on certain element
    going out of view
    fixedVisibilitySwitchTargetThreshold: '100px' // overrides targetParentThreshold })
)(Component);
*/

export default withEEASideMenu;
