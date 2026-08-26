export const REALTIME_COLUMN_IDS = [
  'source',
  'model',
  'settings',
  'recent-status',
  'request-status',
  'success-rate',
  'calls',
  'tps',
  'latency',
  'time',
  'usage',
  'cost',
] as const;

export type RealtimeColumnId = (typeof REALTIME_COLUMN_IDS)[number];

export type RealtimeColumnDefinition = {
  id: RealtimeColumnId;
  width: number;
  hideable: boolean;
  align: 'left' | 'center';
};

export const REALTIME_COLUMN_DEFINITIONS: readonly RealtimeColumnDefinition[] = [
  { id: 'source', width: 220, hideable: false, align: 'left' },
  { id: 'model', width: 112, hideable: false, align: 'center' },
  { id: 'settings', width: 98, hideable: true, align: 'center' },
  { id: 'recent-status', width: 78, hideable: true, align: 'center' },
  { id: 'request-status', width: 86, hideable: false, align: 'center' },
  { id: 'success-rate', width: 82, hideable: true, align: 'center' },
  { id: 'calls', width: 58, hideable: true, align: 'center' },
  { id: 'tps', width: 64, hideable: true, align: 'center' },
  { id: 'latency', width: 112, hideable: true, align: 'center' },
  { id: 'time', width: 114, hideable: false, align: 'center' },
  { id: 'usage', width: 144, hideable: true, align: 'center' },
  { id: 'cost', width: 68, hideable: true, align: 'center' },
] as const;

export const DEFAULT_REALTIME_VISIBLE_COLUMNS: readonly RealtimeColumnId[] = REALTIME_COLUMN_IDS;

const REALTIME_COLUMN_ID_SET = new Set<RealtimeColumnId>(REALTIME_COLUMN_IDS);
const MANDATORY_REALTIME_COLUMN_ID_SET = new Set<RealtimeColumnId>(
  REALTIME_COLUMN_DEFINITIONS.filter((column) => !column.hideable).map((column) => column.id)
);

export const normalizeRealtimeVisibleColumns = (value: unknown): RealtimeColumnId[] => {
  if (!Array.isArray(value)) return [...DEFAULT_REALTIME_VISIBLE_COLUMNS];

  const requested = new Set<RealtimeColumnId>(
    value.filter(
      (columnId): columnId is RealtimeColumnId =>
        typeof columnId === 'string' && REALTIME_COLUMN_ID_SET.has(columnId as RealtimeColumnId)
    )
  );

  return REALTIME_COLUMN_IDS.filter(
    (columnId) => requested.has(columnId) || MANDATORY_REALTIME_COLUMN_ID_SET.has(columnId)
  );
};

export const getRealtimeColumnDefinitions = (visibleColumns: readonly RealtimeColumnId[]) => {
  const visible = new Set(visibleColumns);
  return REALTIME_COLUMN_DEFINITIONS.filter((column) => visible.has(column.id));
};

export const getRealtimeTableWidth = (visibleColumns: readonly RealtimeColumnId[]) =>
  getRealtimeColumnDefinitions(visibleColumns).reduce((total, column) => total + column.width, 0);
