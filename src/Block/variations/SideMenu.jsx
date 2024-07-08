import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import { Accordion, Icon } from 'semantic-ui-react';
import Slugger from 'github-slugger';
import { normalizeString } from './helpers';
import { debounce } from 'lodash';
import './less/side-menu.less';

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

const View = (props) => {
  const { data, tocEntries, mode } = props;
  const [open, setOpen] = useState(true);
  const [rendered, setRendered] = useState(false);
  const [isSideBarFixed, setIsSideBarFixed] = useState(false);

  const offset = 50; // minimum distance from footer

  useEffect(() => {
    if (!rendered) {
      setRendered(true);
      return;
    }

    const sideMenu = document.querySelector('.tocSideMenu');

    if (props.device === 'mobile') {
      return;
    }
    if (mode === 'edit') return;

    const footer = document.querySelector('footer');
    const pageDocument = document.getElementById('page-document');

    function adjustSideMenuPosition() {
      if (sideMenu && footer && pageDocument) {
        const footerRect = footer.getBoundingClientRect();
        const sideMenuRect = sideMenu.getBoundingClientRect();

        const distanceToFooter =
          footerRect.top - (window.scrollY + sideMenuRect.height);
        console.log(distanceToFooter, isSideBarFixed);
        if (distanceToFooter <= offset && isSideBarFixed == false) {
          const newTop =
            window.scrollY + footerRect.top - sideMenuRect.height - offset;
          sideMenu.style.position = 'absolute';
          sideMenu.style.top = `${newTop}px`;
          setIsSideBarFixed(true);
        } else if (distanceToFooter > offset && isSideBarFixed === true) {
          console.log('intru iar');
          sideMenu.style.position = 'fixed';
          sideMenu.style.top = 'unset';
          setIsSideBarFixed(false);
        }
      }
    }

    window.addEventListener('scroll', debounce(adjustSideMenuPosition, 100));
    adjustSideMenuPosition();

    return () => {
      window.removeEventListener(
        'scroll',
        debounce(adjustSideMenuPosition, 250),
      );
    };
  }, [rendered, mode, open, data.variation, props.device, isSideBarFixed]);

  if (!tocEntries?.length) return null;

  return (
    <Accordion fluid styled>
      <Accordion.Title active={open} onClick={() => setOpen(!open)}>
        <Icon name={open ? 'angle up' : 'angle right'} className="menuTitle" />
        <p className="menuTitle">{data?.title || ''}</p>
      </Accordion.Title>
      <Accordion.Content active={open}>
        <RenderMenuItems items={tocEntries} />
      </Accordion.Content>
    </Accordion>
  );
};

View.propTypes = {
  data: PropTypes.object.isRequired,
  tocEntries: PropTypes.array,
  mode: PropTypes.string,
};

export default injectIntl(View);
