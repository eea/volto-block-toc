import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import ReactDOM from 'react-dom';

import { useFirstVisited } from '@eeacms/volto-block-toc/hooks';
import withDeviceSize from '@eeacms/volto-block-toc/hocs/withDeviceSize';
import { BodyClass, useDetectClickOutside } from '@plone/volto/helpers';
import './less/side-nav.less';
import useHasContent from '@eeacms/volto-block-toc/hooks/useHasContent';

function IsomorphicPortal({
  children,
  target,
  insertBefore,
  insertBeforeOnMobile,
  wrapperClassName = 'eea-side-menu-wrapper',
}) {
  const [isClient, setIsClient] = useState(false);
  const wrapperRef = useRef(null);

  useLayoutEffect(() => {
    setIsClient(true);

    const safeTarget = (target || '').trim();
    const safeInsertBefore = (insertBefore || '').trim();
    const safeInsertBeforeOnMobile = (insertBeforeOnMobile || '').trim();

    const ensureWrapperAt = (targetSelector, selector) => {
      if (!targetSelector) return;
      const targetNode = document.querySelector(targetSelector);
      if (!targetNode) return;

      const beforeNode = selector ? targetNode.querySelector(selector) : null;

      let el = wrapperRef.current;
      if (!el || !document.contains(el)) {
        el = document.createElement('div');
        el.classList.add(wrapperClassName);
        el.setAttribute('data-eea-side-menu', 'true');
        wrapperRef.current = el;
      }

      const needsMove =
        el.parentNode !== targetNode ||
        (beforeNode ? el.nextSibling !== beforeNode : false);
      if (needsMove) {
        targetNode.insertBefore(el, beforeNode || targetNode.firstChild);
      }

      // Cleanup any extra empty wrappers left behind
      const all = document.querySelectorAll(`.${wrapperClassName}`);
      all.forEach((w) => {
        if (w !== wrapperRef.current && w.children.length === 0) {
          w.remove();
        }
      });
    };

    if (safeInsertBeforeOnMobile) {
      ensureWrapperAt(safeTarget, safeInsertBeforeOnMobile);
    } else if (safeInsertBefore) {
      ensureWrapperAt(safeTarget, safeInsertBefore);
    } else if (safeTarget) {
      const targetNode = document.querySelector(safeTarget);
      if (targetNode) {
        let el = wrapperRef.current;
        if (!el || !document.contains(el)) {
          el = document.createElement('div');
          el.classList.add(wrapperClassName);
          el.setAttribute('data-eea-side-menu', 'true');
          wrapperRef.current = el;
        }
        if (el.parentNode !== targetNode) {
          targetNode.insertBefore(el, targetNode.firstChild);
        }
      }
    }

    // Persist wrapper across re-renders; no cleanup here
  }, [target, insertBefore, insertBeforeOnMobile, wrapperClassName]);

  if (!isClient) {
    return children;
  }

  if (wrapperRef.current && document.contains(wrapperRef.current)) {
    return ReactDOM.createPortal(children, wrapperRef.current);
  }

  const host = document.querySelector((target || '').trim());
  return host ? ReactDOM.createPortal(children, host) : children;
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
    const computedHasWideContent = props.hasWideContent ?? useHasContent();
    const visible = useFirstVisited(
      fixedVisibilitySwitchTarget,
      fixedVisibilitySwitchTargetThreshold,
    );
    const [isMenuOpen, setIsMenuOpen] = React.useState(true);
    const isSmallScreen = device === 'mobile' || device === 'tablet';
    const effectiveInsertBefore =
      !isSmallScreen && computedHasWideContent
        ? '#page-document'
        : insertBefore;

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
          {!computedHasWideContent && <BodyClass className="has-side-nav" />}
          {mode === 'edit' ? (
            <WrappedComponent
              {...props}
              hasWideContent={computedHasWideContent}
            />
          ) : (
            <IsomorphicPortal
              target={isSmallScreen ? targetParent : '#view'}
              insertBeforeOnMobile={isSmallScreen ? insertBeforeOnMobile : null}
              insertBefore={effectiveInsertBefore}
              wrapperClassName={wrapperClassName}
            >
              <div
                className={`eea-side-menu ${props.device}`}
                ref={isSmallScreen ? ref : null}
              >
                <WrappedComponent
                  isMenuOpenOnOutsideClick={isMenuOpen}
                  {...props}
                  hasWideContent={computedHasWideContent}
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
    hasWideContent: false, // controls if the side menu goes over the content area or not
    insertBeforeOnMobile: '.banner', // where to insert the side menu on mobile devices
    fixedVisibilitySwitchTarget: '.main.bar', // add if you need the menu to be fixed on certain element
    going out of view
    fixedVisibilitySwitchTargetThreshold: '100px' // overrides targetParentThreshold })
)(Component);
*/

export default withEEASideMenu;
