/* eslint-disable  no-plusplus */
import { useState, useRef, useMemo, useEffect } from 'react';
import cs from 'classnames';
import { SelectableGroup } from 'react-selectable-fast';
import MutiCell from './MutiCell';
import s from './MutipleSelector.module.less';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SelectableGroupDom = SelectableGroup as any


interface MutipleSelectorProps {
  /**
   * Components name
   */
  componentsName?: string;
  /**
   * value
   */
  value?: number[];
  /**
   * Function for value change
   */
  onChange?: (value: number[]) => void;
  /**
   * Can be edit or not
   */
  isEditMode?: boolean;
  /**
   * Disable items
   */
  disableItems?: (current: number) => boolean;
  /**
   * Title for selected area
   */
  selectedTitle?: string
  /**
   * Container width
   */
  containerWidth?: number
  /**
   * Container height
   */
  containerHeight?: number
  /**
   * Options for component
   */
  defaultOptions: (number)[]
}

const MutipleSelector = ({
  componentsName = '多重选择器',
  value = [],
  isEditMode = false,
  onChange,
  disableItems = () => false,
  selectedTitle = '选择的值',
  containerWidth = 682,
  containerHeight = 312,
  defaultOptions = [],
}: MutipleSelectorProps) => {
  const [selectedAges, setSelectedAges] = useState<number[]>(value as number[]); // 选中的年龄区间

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectableGroupRef = useRef<any>();

  // 看是选中列表否包含当前年份的明年
  const nextYearAge = (v: number) => {
    const tarAge = v + 1;
    return selectedAges.includes(tarAge);
  };

  // 看是选中列表否包含当前年份的去年
  const lastYearAge = (v: number) => {
    const tarAge = v - 1;
    return selectedAges.includes(tarAge);
  };

  // 看选中列表是否包含当前年份
  const currentyearAge = (v: number) => selectedAges.includes(v);

  // 合并同类，然后放到右边显示选中的年龄区域
  const selectedAgesShow = useMemo(() => {
    const res: number[][] = [];
    let temp: number[] = [];
    // 年龄能连上就合并成一个年龄范围，连不上就是新的年龄范围
    for (let i = 0; i < selectedAges.length; i++) {
      if (selectedAges[i] + 1 === selectedAges[i + 1]) {
        temp.push(selectedAges[i]);
      } else {
        temp.push(selectedAges[i]);
        res.push(temp);
        temp = [];
      }
    }
    return res;
  }, [selectedAges]);

  useEffect(() => {
    onChange?.(selectedAges);
  }, [selectedAges]);

  // 选择结束
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectionFinish = (selectedItems: Record<string, Record<string, any>>[]) => {
    const res = selectedItems.map(item => item.props.cellValue); // 选中的格子
    const newDate = res.filter(item => !selectedAges.includes(item)); // 再过滤已选择年龄，剩下的就是新增
    if (newDate.length) {
      setSelectedAges(selectedAges.concat(newDate).sort((a, b) => a - b));
    }
    if (res.length && selectableGroupRef.current) {
      selectableGroupRef.current.clearSelection();
    }
  };

  // 关闭弹窗
  const handleClose = (val: number[]) => {
    const temp = [...selectedAges];
    const index = selectedAges.indexOf(val[0]);
    temp.splice(index, val.length);
    setSelectedAges(temp);
  };

  // 情空空所选年龄值
  const handleDeleteAll = () => {
    setSelectedAges([]);
  };

  return (
    <div className={s['ds-panel-container']} style={{width: containerWidth}}>
      <div className={s['ds-outer-container']}>
        <div className={s['ds-container']} style={{height: containerHeight}}>
          <div className={s['ds-header']}>{componentsName}</div>

          <div className={s['ds-body']} style={{ pointerEvents: isEditMode ? 'none' : 'auto' }}>
            <SelectableGroupDom
              ref={selectableGroupRef}
              tolerance={0}
              deselectOnEsc={false}
              allowClickWithoutSelected
              onSelectionFinish={handleSelectionFinish}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {defaultOptions.map((v: number, i: number) => (
                  <MutiCell
                    key={i}
                    cellValue={v}
                    disableItems={disableItems as (current: number) => boolean}
                    selectedAges={selectedAges}
                    oneAge={currentyearAge(v) && !nextYearAge(v) && !lastYearAge(v)}
                    startAge={currentyearAge(v) && nextYearAge(v) && !lastYearAge(v)}
                    endAge={currentyearAge(v) && !nextYearAge(v) && lastYearAge(v)}
                    showMinorColor={currentyearAge(v) && nextYearAge(v) && lastYearAge(v)}
                  >
                    {v}
                  </MutiCell>
                ))}
              </div>
            </SelectableGroupDom>
          </div>
        </div>
        <div className={cs(s['ds-selectedDate'], 'ant-picker-date-panel')}>
          <div className={s['ds-selectedDate-header']}>
            <span>{selectedTitle}</span>
            <span
              onClick={handleDeleteAll}
              className={cs({
                [s['ds-selectedDate-notAllow-clear']]: isEditMode,
              })}
            >
              清空已选
            </span>
          </div>
          <div className={s['ds-selectedDate-body']} style={{maxHeight: containerHeight > 72 ? containerHeight - 72 : 72}}>
            {selectedAgesShow.map((item, idx) => (
              <span
                key={idx}
                className={s['ds-selectedDate-tag']}
              >
                {item[0]} ~ {item[item.length - 1]}
                <span
                    style={{cursor: 'pointer'}}
                    onClick={e => {
                      if (isEditMode) return
                      e.preventDefault()
                      handleClose(item);
                    }}
                >{' x'}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MutipleSelector;
