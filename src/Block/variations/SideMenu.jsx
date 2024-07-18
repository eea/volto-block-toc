import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import { Accordion, Icon } from 'semantic-ui-react';
import Slugger from 'github-slugger';
import { normalizeString } from './helpers';
import './less/side-menu.less';

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
        <Icon name={open ? 'angle up' : 'angle right'} className="menuTitle" />
        <p className="menuTitle">{title || ''}</p>
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

const View = (props) => {
  const { data, tocEntries, mode } = props;
  let parentSelector = '#view';
  // if (props.device === 'mobile') {
  //   parentSelector = '.eea.header';
  // }
  const cloneToc = props.device === 'large' || props.device === 'mobile';

  return (
    <>
      <BodyClass className={'has-side-toc'} />
      <RenderTocEntries tocEntries={tocEntries} title={data?.title} />

      {tocEntries && !mode && cloneToc && (
        <Portal node={__CLIENT__ && document.querySelector(parentSelector)}>
          <div className={`table-of-contents tocSideMenu ${props.device}`}>
            <RenderTocEntries tocEntries={tocEntries} title={data?.title} />
          </div>
        </Portal>
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
