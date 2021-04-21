import React, { Component } from 'react';

import { SidebarPortal } from '@plone/volto/components';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';

import { TableOfContentsSchema } from './schema';
import TocView from './TocView';

class Edit extends Component {
  render() {
    const schema = TableOfContentsSchema();
    schema.properties.block_extension.blockProps = this.props;
    return (
      <>
        <TocView {...this.props} />

        <SidebarPortal selected={this.props.selected}>
          <InlineForm
            schema={schema}
            title={schema.title}
            onChangeField={(id, value) => {
              this.props.onChangeBlock(this.props.block, {
                ...this.props.data,
                [id]: value,
              });
            }}
            formData={this.props.data}
          />
        </SidebarPortal>
      </>
    );
  }
}

export default Edit;
