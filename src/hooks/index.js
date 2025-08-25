import React from 'react';

function useFirstVisited(query, rootMargin = '0px') {
  const target = __CLIENT__ ? document.querySelector(query) : '';
  const [intersected, setIntersected] = React.useState(false);
  React.useEffect(() => {
    if (intersected) return;
    const observer = new IntersectionObserver( //TODO: pass a callback instead?
      ([entry]) => {
        setIntersected(entry.isIntersecting);
      },
      {
        rootMargin,
        threshold: 0,
        root: null,
      },
    );
    if (target) {
      observer.observe(target);
    }
    return () => {
      if (target) {
        observer.unobserve(target);
      }
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return intersected;
}

// Tracks current in-viewport state of the element matching `query`
function useInViewport(query, rootMargin = '0px') {
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    if (!__CLIENT__) return undefined;
    const target = document.querySelector(query);

    if (!target) {
      setInView(false);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      {
        rootMargin,
        threshold: 0,
        root: null,
      },
    );

    observer.observe(target);

    return () => {
      try {
        observer.unobserve(target);
      } catch (_) {}
      observer.disconnect();
    };
  }, [query, rootMargin]);

  return inView;
}

export { useFirstVisited, useInViewport };
