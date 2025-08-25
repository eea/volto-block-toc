import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import ReactDOM from 'react-dom';

import { useInViewport } from '@eeacms/volto-block-toc/hooks';
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
  const [isPortalReady, setIsPortalReady] = useState(false);
  const wrapperRef = useRef(null);

  useLayoutEffect(() => {
    setIsClient(true);

    const safeTarget = (target || '').trim();
    const safeInsertBefore = (insertBefore || '').trim();
    const safeInsertBeforeOnMobile = (insertBeforeOnMobile || '').trim();

    const ensureWrapperAt = (targetSelector, selector) => {
      if (!targetSelector) return null;
      const targetNode = document.querySelector(targetSelector);
      if (!targetNode) return null;

      const beforeNode = selector ? targetNode.querySelector(selector) : null;

      // Check if wrapper already exists at the correct position
      let existingWrapper = null;
      if (beforeNode) {
        existingWrapper = beforeNode.previousElementSibling;
        if (
          existingWrapper &&
          !existingWrapper.classList.contains(wrapperClassName)
        ) {
          existingWrapper = null;
        }
      } else {
        existingWrapper = targetNode.querySelector(`.${wrapperClassName}`);
      }

      if (existingWrapper) {
        wrapperRef.current = existingWrapper;
        return existingWrapper;
      }

      // Look for any existing wrapper in the document to reuse
      const anyExistingWrapper = document.querySelector(`.${wrapperClassName}`);
      let el;

      if (anyExistingWrapper) {
        // Check if existing wrapper is already in the correct position
        const isInCorrectParent =
          anyExistingWrapper.parentElement === targetNode;
        const isInCorrectPosition = beforeNode
          ? anyExistingWrapper.nextElementSibling === beforeNode
          : Array.from(targetNode.children).indexOf(anyExistingWrapper) ===
            targetNode.children.length - 1;

        if (isInCorrectParent && isInCorrectPosition) {
          wrapperRef.current = anyExistingWrapper;
          return anyExistingWrapper;
        }

        // Reuse existing wrapper by moving it
        el = anyExistingWrapper;
      } else {
        // Create new wrapper only if none exists
        el = document.createElement('div');
        el.classList.add(wrapperClassName);
        el.setAttribute('data-eea-side-menu', 'true');
      }

      // Insert wrapper at correct position
      if (beforeNode) {
        targetNode.insertBefore(el, beforeNode);
      } else {
        targetNode.appendChild(el);
      }

      // Clean up any extra empty wrappers (but not the one we just positioned)
      const allWrappers = document.querySelectorAll(`.${wrapperClassName}`);
      allWrappers.forEach((wrapper) => {
        if (wrapper !== el && wrapper.children.length === 0) {
          wrapper.remove();
        }
      });

      return el;
    };

    // Create or find wrapper based on configuration
    let wrapper = null;
    if (safeInsertBeforeOnMobile) {
      wrapper = ensureWrapperAt(safeTarget, safeInsertBeforeOnMobile);
    } else if (safeInsertBefore) {
      wrapper = ensureWrapperAt(safeTarget, safeInsertBefore);
    } else if (safeTarget) {
      wrapper = ensureWrapperAt(safeTarget, null);
    }

    // Store wrapper in ref to avoid DOM queries on every render
    wrapperRef.current = wrapper;

    // Mark portal as ready after wrapper is positioned
    setIsPortalReady(true);
  }, [target, insertBefore, insertBeforeOnMobile, wrapperClassName]);

  if (!isClient) {
    return children;
  }

  // Prevent initial render until portal is ready to avoid flicker
  if (!isPortalReady) {
    return null;
  }

  // Use the wrapper stored in ref to avoid DOM queries on every render
  const wrapper = wrapperRef.current;

  // Try to find wrapper in DOM if ref is null (during repositioning)
  let actualWrapper = wrapper;
  if (!actualWrapper || !document.contains(actualWrapper)) {
    actualWrapper = document.querySelector(`.${wrapperClassName}`);
  }

  if (actualWrapper && document.contains(actualWrapper)) {
    return ReactDOM.createPortal(children, actualWrapper);
  }

  return children;
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
    const inViewport = useInViewport(
      fixedVisibilitySwitchTarget,
      fixedVisibilitySwitchTargetThreshold,
    );
    const [isMenuOpen, setIsMenuOpen] = React.useState(true);
    // Detect small screen immediately on first client render
    const isSmallScreen =
      device === 'mobile' ||
      device === 'tablet' ||
      (typeof window !== 'undefined' && !device && window.innerWidth < 992);
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
        if (!inViewport) sideNav.classList.add('fixed');
        else sideNav.classList.remove('fixed');
      }
    }, [inViewport, targetParent, device]);

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
                className={`eea-side-menu ${props.device ? props.device : ''} ${
                  isSmallScreen ? 'should-be-portaled' : ''
                }`}
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
