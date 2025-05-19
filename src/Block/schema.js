const TableOfContentsSchema = ({ data }) => {
  const { variation = 'default' } = data;

  return {
    title: 'Table of Contents',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'title',
          'hide_title',
          ...(variation === 'default' ? ['ordered'] : []),
          ...(variation === 'horizontalMenu' ? ['sticky'] : []),
          ...(variation === 'accordionMenu' ? ['sticky'] : []),
          ...(variation === 'accordionMenu' ? ['bulleted_list'] : []),
          'levels',
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
        choices: [
          ['h1', 'h1'],
          ['h2', 'h2'],
          ['h3', 'h3'],
          ['h4', 'h4'],
          ['h5', 'h5'],
          ['h6', 'h6'],
        ],
      },
      ordered: {
        title: 'Ordered',
        type: 'boolean',
      },
      bulleted_list: {
        title: 'Use bullet list',
        type: 'boolean',
        description: 'Bullet point for child items',
      },
    },
    required: [],
  };
};

export default TableOfContentsSchema;
