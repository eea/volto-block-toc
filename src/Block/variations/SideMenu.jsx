import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import { Accordion, Icon } from 'semantic-ui-react';
import Slugger from 'github-slugger';
import { normalizeString } from './helpers';
import './less/side-menu.less';
import { useFirstVisited } from '@eeacms/volto-block-toc/hooks';
import { BodyClass } from '@plone/volto/helpers';
import { Portal } from 'react-portal';

const RenderMenuItems = ({ items }) => (
  <>
    {items.map((item, index) => {
      const { title, override_toc, plaintext, items: subItems } = item;
      const slug = override_toc
        ? Slugger.slug(normalizeString(plaintext))
        : Slugger.slug(normalizeString(title));
      return (
        <React.Fragment key={index}>
          <li className="toc-menu-list-item">
            <AnchorLink href={`#${slug}`} className="toc-menu-list-title">
              {title}
            </AnchorLink>
          </li>
          {subItems && subItems.length > 0 && (
            <RenderMenuItems items={subItems} />
          )}
        </React.Fragment>
      );
    })}
  </>
);

const RenderTocEntries = ({ tocEntries, title }) => {
  const [open, setOpen] = useState(true);
  return (
    <Accordion fluid styled>
      <Accordion.Title active={open} onClick={() => setOpen(!open)}>
        <p className="menuTitle">{title || ''}</p>
        <Icon name={open ? 'angle up' : 'angle right'} className="menuTitle" />
      </Accordion.Title>
      <Accordion.Content active={open}>
        <nav className="toc-menu">
          <ol className="toc-menu-list">
            <RenderMenuItems items={tocEntries} />
          </ol>
        </nav>
      </Accordion.Content>
    </Accordion>
  );
};

function IsomorphicPortal({ children, target }) {
  const [isClient, setIsClient] = React.useState();
  React.useEffect(() => setIsClient(true), []);

  return isClient ? (
    <Portal node={document.querySelector(target)}>{children}</Portal>
  ) : (
    children
  );
}

const View = (props) => {
  const visible = useFirstVisited('.eea.header');
  const { data, tocEntries, mode } = props;

  React.useEffect(() => {
    const sideNav = document?.querySelector(
      '.eea.header .table-of-contents.tocSideMenu.mobile',
    );
    if (sideNav) {
      if (!visible) sideNav.classList.add('fixed');
      else sideNav.classList.remove('fixed');
    }
  }, [visible]);

  // React.useEffect(() => {
  //   if (!props.mode) {
  //     const element = document.querySelector(
  //       '#page-document .table-of-contents.tocSideMenu',
  //     );
  //     element?.remove();
  //   }
  // }, []);
  return (
    <>
      <BodyClass className={'has-side-toc'} />
      {mode === 'edit' ? (
        <RenderTocEntries tocEntries={tocEntries} title={data?.title} />
      ) : (
        <IsomorphicPortal
          target={props.device === 'mobile' ? '.eea.header' : '#view'}
        >
          <div className={`table-of-contents tocSideMenu ${props.device}`}>
            <RenderTocEntries tocEntries={tocEntries} title={data?.title} />
          </div>
        </IsomorphicPortal>
      )}
    </>
  );
};

View.propTypes = {
  data: PropTypes.object.isRequired,
  tocEntries: PropTypes.array,
  mode: PropTypes.string,
};

export default injectIntl(View);
