// import React from 'react';
import style from './emptyDataList.module.less';
// import { Empty } from 'antd';

const EmptyDataList = (props: {
  onReset?: VoidFunction;
  onSearch?: boolean;
  emptyText?: string;
  searchText?: string;
}) => {
  const {
    onReset,
    onSearch,
    // emptyText,
    searchText
  } = props;
  return (
    <div className={style.noResult}>
      {onSearch && onReset ? (
        <span>
          暂未找到符合条件的数据，
          <a className={style._a} onClick={() => onReset?.()}>
            重置筛选条件
          </a>
        </span>
      ) : onSearch && searchText ? (
          <div>1111</div>
        // <Empty
        //   className={style.noResultImg}
        //   image={Empty.PRESENTED_IMAGE_SIMPLE}
        //   description={searchText || '暂无数据'}
        // />
      ) : (
          <div>222</div>
        // <Empty
        //   className={style.noResultImg}
        //   image={Empty.PRESENTED_IMAGE_SIMPLE}
        //   description={emptyText || '暂无数据'}
        // />
      )}
    </div>
  );
};

export default EmptyDataList;
