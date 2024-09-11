import { Icon, MaybeWrap } from '@plone/volto/components';
import Slugger from 'github-slugger';
import PropTypes from 'prop-types';
import React from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';

import downIcon from '@plone/volto/icons/down-key.svg';
import upIcon from '@plone/volto/icons/up-key.svg';

import withEEASideMenu from '@eeacms/volto-block-toc/hocs/withEEASideMenu';
import { normalizeString } from './helpers';
import './less/side-menu.less';

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

const RenderTocEntries = ({
  tocEntries,
  title,
  defaultOpen,
  isMenuOpenOnOutsideClick,
}) => {
  const [isNavOpen, setIsNavOpen] = React.useState(!defaultOpen);

  React.useEffect(() => {
    if (isMenuOpenOnOutsideClick === false) setIsNavOpen(false);
  }, [isMenuOpenOnOutsideClick]);

  return (
    <details open={isNavOpen}>
      {/* eslint-disable-next-line */}
      <summary
        onClick={(e) => {
          e.preventDefault();
          setIsNavOpen(!isNavOpen);
        }}
        onKeyDown={(e) => {
          if (e.keyCode === 13 || e.keyCode === 32) {
            e.preventDefault();
            setIsNavOpen(!isNavOpen);
          }
        }}
        className="context-navigation-header accordion-header"
      >
        <MaybeWrap
          condition={defaultOpen}
          className="ui container d-flex flex-items-center"
        >
          <span className="menuTitle">{title || ''}</span>
          <Icon name={isNavOpen ? upIcon : downIcon} size="40px" />
        </MaybeWrap>
      </summary>
      <nav className="toc-menu">
        <MaybeWrap
          condition={defaultOpen}
          className="ui container d-flex flex-items-center"
        >
          <ol className="toc-menu-list context-navigation-list">
            <RenderMenuItems items={tocEntries} />
          </ol>
        </MaybeWrap>
      </nav>
    </details>
  );
};

const View = (props) => {
  const { data, tocEntries, device, isMenuOpenOnOutsideClick } = props;
  return (
    <RenderTocEntries
      defaultOpen={device === 'mobile' || device === 'tablet'}
      tocEntries={tocEntries}
      isMenuOpenOnOutsideClick={isMenuOpenOnOutsideClick}
      title={data?.title}
    />
  );
};

View.propTypes = {
  data: PropTypes.object.isRequired,
  tocEntries: PropTypes.array,
  mode: PropTypes.string,
};

export default withEEASideMenu(View);
