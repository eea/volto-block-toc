export const TableOfContentsSchema = ({ data }) => {
  const { block_extension = 'default' } = data;

  return {
    title: 'Table of Contents',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'title',
          'hide_title',
          ...(block_extension === 'default' ? ['ordered'] : []),
          ...(block_extension === 'horizontalMenu' ? ['sticky'] : []),
          'levels',
          'block_extension',
        ],
      },
    ],
    properties: {
      title: {
        title: 'Block title',
      },
      hide_title: {
        title: 'Hide title',
        type: 'boolean',
      },
      sticky: {
        title: 'Sticky on top',
        type: 'boolean',
      },
      levels: {
        title: 'Entries',
        isMulti: true,
        widget: 'toc_multi_select_widget',
        choices: [
          ['h1', 'h1'],
          ['h2', 'h2'],
          ['h3', 'h3'],
          ['h4', 'h4'],
          ['h5', 'h5'],
          ['h6', 'h6'],
        ],
      },
      block_extension: {
        title: 'Extension',
        widget: 'block_extension',
        defaultValue: 'default',
      },
      ordered: {
        title: 'Ordered',
        type: 'boolean',
      },
    },
    required: [],
  };
};
