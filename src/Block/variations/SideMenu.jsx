import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import { Accordion, Icon } from 'semantic-ui-react';
import Slugger from 'github-slugger';
import { normalizeString } from './helpers';
import './less/side-menu.less';

import { BodyClass } from '@plone/volto/helpers';
import { usePrevious } from '@plone/volto/helpers';

const RenderMenuItems = ({ items }) => (
  <Accordion fluid styled>
    {items.map((item, index) => {
      const { title, override_toc, plaintext, items: subItems } = item;
      const slug = override_toc
        ? Slugger.slug(normalizeString(plaintext))
        : Slugger.slug(normalizeString(title));
      return (
        <React.Fragment key={index}>
          <div className="title">
            <AnchorLink href={`#${slug}`}>{title}</AnchorLink>
          </div>
          {subItems && subItems.length > 0 && (
            <RenderMenuItems items={subItems} />
          )}
        </React.Fragment>
      );
    })}
  </Accordion>
);

const renderTocEntries = (tocEntries, title) => {
  const [open, setOpen] = useState(true);
  return (
    <Accordion fluid styled>
      <Accordion.Title active={open} onClick={() => setOpen(!open)}>
        <Icon name={open ? 'angle up' : 'angle right'} className="menuTitle" />
        <p className="menuTitle">{title || ''}</p>
      </Accordion.Title>
      <Accordion.Content active={open}>
        <RenderMenuItems items={tocEntries} />
      </Accordion.Content>
    </Accordion>
  );
};

const View = (props) => {
  const { data, tocEntries, mode } = props;
  const prevDevice = usePrevious(props.device);

  useEffect(() => {
    if (!props.device) {
      return;
    }

    const tocSideMenu = document.querySelector('.tocSideMenu');
    const view = document.querySelector('#view');
    if (prevDevice && prevDevice !== 'mobile' && props.device === 'mobile') {
      // add tocSideMenu to .eea.header
      const header = document.querySelector('.eea.header');
      if (header) {
        header.appendChild(tocSideMenu);
      }
    }
    if (tocSideMenu && view) {
      view.appendChild(tocSideMenu);
    }
  }, [props.device]);

  return (
    <>
      <BodyClass className={'has-side-toc'} />
      {renderTocEntries(tocEntries, data?.title)}
    </>
  );
};

View.propTypes = {
  data: PropTypes.object.isRequired,
  tocEntries: PropTypes.array,
  mode: PropTypes.string,
};

export default injectIntl(View);
