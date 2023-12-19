import React, { CSSProperties, useEffect, useMemo, useState } from 'react';
import { chunk } from 'lodash';
import cs from 'classnames';
import moment from 'moment';
import { Calendar } from 'calendar';
import s from './multiDatePicker.module.less';

// 合并日期区间
const mergeDateIntervals = (intervals: string[][]) => {
  if (!intervals || !intervals.length) return intervals;
  intervals.sort((a: string[], b: string[]) => moment(a[0]) as any - (moment(b[0]) as any));
  const result: string[][] = [];
  let i = 0;
  while (i < intervals.length) {
    // 当前区间
    const cur = [intervals[i][0], intervals[i][1]];
    let j = i + 1;
    // 如果下一个区间的开始位置还要小于等于当前区间的结束位置，则有重叠；或者在结束位置的后一位
    while (j < intervals.length && moment(intervals[j][0]).isSameOrBefore(moment(cur[1]).add(1, 'd'))) {
      // 合并后的结束位置应该取两个区间结束位置的最大值
      cur[1] = moment(cur[1]).isBefore(moment(intervals[j][1])) ? intervals[j][1] : cur[1];
      j++;
    }
    result.push(cur);
    i = j;
  }
  return result;
};

const weeks = ['日', '一', '二', '三', '四', '五', '六'];
const allMonths = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]];

interface MultiDatePickerProps { 
  weekStart?: number;
  format?: string;
  themeColor?: string;
  value?: string[][];
  onChange?: (value: string[][]) => void;
  disabledDate?: (current: string) => boolean; 
}

const MultiDatePicker: React.FC<MultiDatePickerProps> = ({
  weekStart = 1,
  format = 'YYYY-MM-DD',
  themeColor = '#1890ff',
  value,
  onChange,
  disabledDate,
}) => {
  const [panelType, setPanelType] = useState('DAY'); // 面板类型 DAY, MONTH, YEAR
  const [selectedDate, setSelectedDate] = useState<string[][]>([]);
  const [currSelectedDate, setCurrSelectedDate] = useState<string[]>([]);
  const [year, setYear] = useState(moment().year());
  const [month, setMonth] = useState(moment().month());
  const [yearPage, setYearPage] = useState(moment().year());

  const [dateNum, date] = useMemo(() => {
    const dateNum = new Calendar(weekStart).monthDays(year, month);
    const date = new Calendar(weekStart).monthDates(year, month, d => moment(d).format(format));
    return [dateNum, date];
  }, [weekStart, format, year, month]);

  const weks = useMemo(() => {
    const weeksCopy = [...weeks];
    return weeksCopy.concat(weeksCopy.splice(0, weekStart));
  }, [weekStart]);

  useEffect(() => {
    if (!value) return;
    setSelectedDate(value);
  }, [value])

  const isDayPanel = panelType === 'DAY';
  const isMonthPanel = panelType === 'MONTH';
  const isYearPanel = panelType === 'YEAR';

  const handleYearPrev = () => {
    if (panelType === 'YEAR') {
      setYearPage(yearPage - 10);
    } else {
      setYear(year - 1);
    }
  }

  const handleYearNext = () => {
    if (panelType === 'YEAR') {
      setYearPage(yearPage + 10);
    } else {
      setYear(year + 1);
    }
  }

  const handleMonthPrev = () => {
    if (month === 0) { 
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  }

  const handleMonthNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  }

  // 获取 YEAR 面板的年份
  const getCurrentYearPage = (y: number) => {
    const startYear = Math.floor(y / 10) * 10 - 1;
    const res = [];
    for (let i = startYear; i < startYear + 12; i++) {
      res.push(i);
    }
    return res;
  };

  const handleSelectDate = (date: string, isDisabled: boolean) => {
    if (isDisabled) return;
    let currDate: string[] = [];
    if (!currSelectedDate.length) {
      currDate = [date];
    } else {
      if (moment(date).isBefore(moment(currSelectedDate[0]))) {
        currDate = [date, currSelectedDate[0]];
      } else {
        currDate = [currSelectedDate[0], date];
      }
      const mergedDate = mergeDateIntervals([...selectedDate, currDate])
      setSelectedDate(mergedDate);
      onChange?.(mergedDate);
      currDate = [];
    }
    setCurrSelectedDate(currDate);
    
  }

  const handleDeleteDate = (idx: number) => {
    const selectedDateCopy = [...selectedDate];
    selectedDateCopy.splice(idx, 1); // 删除当前选中
    setSelectedDate(selectedDateCopy);
    onChange?.(selectedDateCopy);
  }

  const handleDeleteAllDate = () => {
    setSelectedDate([]);
    onChange?.([]);
  }
  
  return (
    <div className={s['multi-datepicker']} style={{ '--mdp-theme-color': themeColor } as CSSProperties}>
      <div className={s['multi-datepicker-left']}>
        <div className={s['multi-datepicker-panel']}>
          <div className={s['multi-datepicker-panel-header']}>
            <button 
              type="button" 
              className={s['multi-datepicker-header-super-prev-btn']}
              onClick={handleYearPrev}
            >
              <span className={s['multi-datepicker-super-prev-icon']}></span>
            </button>
            {isDayPanel && (
              <button 
                type="button" 
                className={s['multi-datepicker-header-prev-btn']}
                onClick={handleMonthPrev}
              >
                <span className={s['multi-datepicker-prev-icon']}></span>
              </button>
            )}
            <div className={s['multi-datepicker-header-view']}>
              <span
                className={s['multi-datepicker-year-btn']}
                role="button"
                onClick={() => {
                  setPanelType('YEAR');
                }}
              >
                {
                  (() => {
                    const years = getCurrentYearPage(yearPage);
                    if (isYearPanel) return `${years[0]}-${years[years.length - 1]}`;
                    return year;
                  })()
                }年
              </span>
              {isDayPanel && (
                <span
                  className={s['multi-datepicker-month-btn']}
                  role="button" 
                  onClick={() => {
                    setPanelType('MONTH');
                  }}
                >
                  {month + 1}月
                </span>
              )}
            </div>
            {isDayPanel && (
              <button 
                type="button" 
                className={s['multi-datepicker-header-next-btn']}
                onClick={handleMonthNext}
              >
                <span className={s['multi-datepicker-next-icon']}></span>
              </button>
            )}
            <button 
              type="button" 
              className={s['multi-datepicker-header-super-next-btn']}
              onClick={handleYearNext}
            >
              <span className={s['multi-datepicker-super-next-icon']}></span>
            </button>
          </div>
          <div className={s['multi-datepicker-panel-body']}>
            {/* 日期面板 */}
            {isDayPanel && (
              <table className={s['multi-datepicker-day-panel-table']}>
                <thead>
                  <tr role="row">
                    {weks.map(w => (
                      <th key={w} role="columnheader" title={`周${w}`} className={s['multi-datepicker-column-header']}>
                        <span className={s['multi-datepicker-column-header-inner']}>{w}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={s['multi-datepicker-tbody']}>
                  {dateNum.map((days, i) => (
                    <tr role="row" key={i} className="">
                      {days.map((day, j) => {
                        if (day) {
                          const dateStr = date[i][j];
                          const isDisabled = !!disabledDate?.(dateStr);
                          const isSelected = selectedDate.toString().includes(dateStr) || currSelectedDate[0] === dateStr;
                          const isInRange = !!selectedDate.find(interval => moment(dateStr).isAfter(moment(interval[0])) && moment(dateStr).isBefore(moment(interval[1]))); 
                          return (
                            <td 
                              role="gridcell" 
                              key={j} 
                              title={dateStr} 
                              className={cs(
                                s['multi-datepicker-cell'], 
                                { 
                                  [s['multi-datepicker-today']]: moment().format(format) === dateStr,
                                  [s['multi-datepicker-in-range-cell']]: isInRange,
                                  [s['multi-datepicker-selected-cell']]: isSelected,
                                  [s['multi-datepicker-disabled-cell']]: isDisabled,
                                }
                              )}
                              onClick={handleSelectDate.bind(null, dateStr, isDisabled)}
                            >
                              <div className={s['multi-datepicker-cell-inner']} aria-selected={isSelected} aria-disabled={isDisabled}>{day}</div>
                            </td>
                          )
                        }
                        return (
                          <td role="gridcell" key={j} className="ant-calendar-cell">
                            <div className="ant-calendar-date" aria-selected="false" aria-disabled="true"></div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {/* 月份面板 */}
            {isMonthPanel && (
              <table className={s['multi-datepicker-month-panel-table']}>
                <tbody className={s['multi-datepicker-tbody']}>
                  {allMonths.map(item => (
                    <tr role="row" key={item.toString()}>
                      {item.map(m => (
                        <td
                          key={m}
                          role="gridcell" 
                          title={`${year}年${m}月`} 
                          className={s['multi-datepicker-cell']}
                          onClick={() => {
                            setPanelType('DAY');
                            setMonth(m - 1);
                          }}
                        >
                          <div className={s['multi-datepicker-cell-inner']}>{m}</div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {/* 年份面板 */}
            {isYearPanel && (
              <table className={s['multi-datepicker-year-panel-table']}>
                <tbody className={s['multi-datepicker-tbody']}>
                  {chunk(getCurrentYearPage(yearPage), 3).map(item => (
                    <tr key={item.toString()} role="row">
                      {item.map(y => (
                        <td
                          key={y}
                          role="gridcell"
                          title={`${y}年`}
                          className={s['multi-datepicker-cell']}
                          onClick={() => {
                            setPanelType('MONTH');
                            setYear(y);
                          }}
                        >
                          <div className={s['multi-datepicker-cell-inner']}>{y}</div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <div className={s['multi-datepicker-right']}>
        <div className={s['multi-datepicker-right-header']}>
          <span>已选择时间段</span>
          <span onClick={handleDeleteAllDate}>清空已选</span>
        </div>
        <div className={s['multi-datepicker-right-body']}>
          {selectedDate.map((interval, idx) => (
            <div
              key={interval.toString()}
              className={s['multi-datepicker-right-body-tag']}
            >
              <span>{interval[0]} ~ {interval[1]}</span>
              <span className={s['multi-datepicker-right-body-close']} onClick={handleDeleteDate.bind(null, idx)} >
                <svg fillRule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"></path>
                </svg>
              </span>
            </div>
          ))}
        </div>                      
      </div>
    </div>
  );
}

export default MultiDatePicker;
