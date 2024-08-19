import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import Slugger from 'github-slugger';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import { Accordion, Icon } from 'semantic-ui-react';

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

const RenderTocEntries = ({ tocEntries, title, mobile }) => {
  const [open, setOpen] = useState(!mobile);
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

const View = (props) => {
  const { data, tocEntries, device } = props;

  return (
    <RenderTocEntries
      mobile={device === 'mobile'}
      tocEntries={tocEntries}
      title={data?.title}
    />
  );
};

View.propTypes = {
  data: PropTypes.object.isRequired,
  tocEntries: PropTypes.array,
  mode: PropTypes.string,
};

export default injectIntl(withEEASideMenu(View));
