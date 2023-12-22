import * as React from 'react';
import cs from 'classnames';
import { createSelectable } from 'react-selectable-fast';
import s from './multipleSelector.module.less';

interface DateCellProps {
  cellValue: number;
  selectableRef?: never;
  // 是否正在圈选
  isSelecting?: boolean;
  children?: React.ReactChild;
  selectedColor?: string;
  selectedAges: number[];
  showMinorColor?: boolean;
  startAge: boolean;
  endAge: boolean;
  oneAge: boolean;
  disableItems?: (current: number) => boolean;
}
const AgeCell = ({
  cellValue,
  selectableRef,
  isSelecting,
  children,
  selectedAges,
  showMinorColor = false,
  startAge,
  endAge,
  oneAge,
  disableItems,
}: DateCellProps) => (
  <div
    ref={selectableRef}
    title={String(cellValue)}
    className={cs(
      s['ds-picker-cell'],
      {
        [s['ds-picker-cell-today']]: isSelecting && !disableItems?.(cellValue),
      },
      { [s['cell-picker-cell-selected']]: selectedAges.includes(cellValue) },
      { [s['cell-disabled']]: disableItems?.(cellValue) },
      { [s.minorColor]: selectedAges.includes(cellValue) && !oneAge },
      { [s.startDate]: startAge },
      { [s.endDate]: endAge }
    )}
    style={{ margin: '4px 0', padding: '3px 6px', width: '36px' }}
  >
    <div
      className={cs(s['ds-picker-cell-inner'], {
        [s.minorColor]: showMinorColor,
      })}
    >
      {children}
    </div>
  </div>
);

export default createSelectable(AgeCell);
