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
  }, [target]);
  return intersected;
}

export { useFirstVisited };
