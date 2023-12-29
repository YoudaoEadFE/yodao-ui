import * as React from 'react';
import cs from 'classnames';
import { createSelectable } from 'react-selectable-fast';

interface DateCellProps {
  cellValue: number;
  selectableRef?: never;
  // 是否正在圈选
  isSelecting?: boolean;
  children?: React.ReactChild;
  selectedColor?: string;
  selectedAges: number[];
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
  startAge,
  endAge,
  oneAge,
  disableItems,
}: DateCellProps) => (
  <div
    ref={selectableRef}
    title={String(cellValue)}
    className={cs(
      'multi-selector-cell',
      {
        'multi-selector-cell-today': isSelecting && !disableItems?.(cellValue),
        'multi-selector-cell-selected': selectedAges.includes(cellValue),
        'multi-selector-cell-disabled': disableItems?.(cellValue),
        'multi-selector-cell-in-range': selectedAges.includes(cellValue) && !oneAge,
        'multi-selector-cell-start': startAge,
        'multi-selector-cell-end': endAge,
      },
    )}
  >
    <div className="multi-selector-cell-inner">
      {children}
    </div>
  </div>
);

export default createSelectable(AgeCell);
