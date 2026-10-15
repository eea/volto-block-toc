import { getBlocksTocEntries } from './TocView';
import config from '@plone/volto/registry';

jest.mock('@plone/volto/registry', () => ({
  __esModule: true,
  default: {
    settings: {},
    blocks: { blocksConfig: {} },
  },
}));

describe('getBlocksTocEntries toc context', () => {
  beforeEach(() => {
    config.blocks.blocksConfig = {
      custom: {
        tocEntries: (block, tocData, context = {}) => [
          [
            2,
            `${context.id}|${context.contentUid}|${context.blockTocVisibility?.k}`,
          ],
        ],
      },
    };
  });

  it('forwards the runtime context and block id to tocEntries', () => {
    const properties = {
      blocks: { b1: { '@type': 'custom' } },
      blocks_layout: { items: ['b1'] },
    };

    const result = getBlocksTocEntries(
      properties,
      { levels: ['h1', 'h2'] },
      { contentUid: 'uid-1', blockTocVisibility: { k: false } },
    );

    expect(result.tocEntries['b1-0'].title).toBe('b1|uid-1|false');
  });

  it('forwards the context to tocEntry as well', () => {
    const spy = jest.fn(() => [2, 'entry']);
    config.blocks.blocksConfig = {
      custom: {
        tocEntry: spy,
      },
    };
    const properties = {
      blocks: { b1: { '@type': 'custom' } },
      blocks_layout: { items: ['b1'] },
    };

    const context = { contentUid: 'uid-1' };
    getBlocksTocEntries(properties, { levels: ['h1', 'h2'] }, context);

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ '@type': 'custom' }),
      { levels: ['h1', 'h2'] },
      { contentUid: 'uid-1', id: 'b1' },
    );
  });
});
