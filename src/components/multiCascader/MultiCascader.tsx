import React, { CSSProperties, useMemo, useState } from 'react';
import cs from 'classnames';
import EmptyTable from '../emptyTable/EmptyTable';
import s from './multiCascader.module.less';

// 获取自身以及祖先节点的value
const getParentValue = (node: optionType | undefined, nodeMap: Map<valueType, optionType>) => {
  const res: valueType[] = [];
  if (!node) return res;
  const recursion = (n: optionType) => {
    res.push(n.value);
    const parentNode = n.parent && nodeMap.get(n.parent);
    parentNode && recursion(parentNode);
  };
  recursion(node);
  return res;
};

// 获取子孙节点的value
const getChildrenValue = (node: optionType) => {
  const res: valueType[] = [];
  const dfs = (n: optionType) => {
    n.children &&
      n.children.forEach(item => {
        res.push(item.value);
        dfs(item);
      });
  };
  dfs(node);
  return res;
};

type valueType = string | number;

interface optionType {
  label: string;
  value: valueType;
  children?: optionType[];
  disable?: boolean;
  depth?: number; // 节点深度
  parent?: valueType | null; // 父节点
}

interface MultiCascaderProps {
  options: optionType[];
  value?: valueType[];
  onChange?: (value: valueType[]) => void;
  searchable?: boolean;
  themeColor?: string;
  disabled?: boolean;
  searchPlaceholder?: string;
}

const MultiCascader: React.FC<MultiCascaderProps> = ({
  options,
  value,
  onChange,
  searchable = true,
  themeColor = '#1890ff',
  disabled,
  searchPlaceholder,
}) => {
  const [selectedItem, setSelectedItem] = useState<valueType[]>([]);
  const [activeList, setActiveList] = useState<valueType[]>([]);
  const [keyword, setKeyword] = useState<string[]>([]);

  const flatOptionsMap = useMemo(() => {
    const map: Map<valueType, optionType> = new Map();
    const dfs = (arr: optionType[], depth: number, parentId: valueType | null) => {
      depth += 1;
      arr.forEach(item => {
        item.depth = depth;
        item.parent = parentId;
        map.set(item.value, item);
        item.children?.length && dfs(item.children, depth, item.value);
      });
    };
    dfs(options, 0, null);
    return map;
  }, [options]);

  const handleChecked = (item: optionType, checked: boolean) => {
    let copySelectedItem = [...selectedItem];

    // 递归判断祖先节点状态
    const recursiveJudge = (node: optionType) => {
      const parentNode = node.parent && flatOptionsMap.get(node.parent);
      if (parentNode && parentNode.children) {
        const parentChildrenValue = parentNode.children.map(it => it.value);
        const allSelected = parentChildrenValue.every(it => copySelectedItem.includes(it));
        // 子节点都选中时，将父节点加入，清空该父节点的所有子节点
        if (allSelected) {
          copySelectedItem = copySelectedItem.filter(it => !parentChildrenValue.includes(it));
          copySelectedItem.push(parentNode.value);
          recursiveJudge(parentNode);
        }
      }
    };

    if (checked) {  //  勾选时
      // 加上该节点，清空其所有的子孙节点
      const childrenValue = getChildrenValue(item);
      copySelectedItem = copySelectedItem.filter(it => !childrenValue.includes(it));
      copySelectedItem.push(item.value);
      // 递归判断该节点的祖先节点状态
      recursiveJudge(item);
    } else {  // 取消勾选时
      const idx = copySelectedItem.indexOf(item.value);
      if (idx !== -1) {
        // 有该节点，直接删除
        copySelectedItem.splice(idx, 1);
      } else {
        // 没有该节点，添加该节点的祖先节点的所有子节点, 再删除该节点及其祖先节点，
        const parentNode = getParentValue(item, flatOptionsMap);
        const selectedNodeIdx = parentNode.findIndex(it => copySelectedItem.includes(it));
        if (selectedNodeIdx !== -1) {
          parentNode.slice(1, selectedNodeIdx + 1).forEach(it => {
            flatOptionsMap.get(it)?.children?.forEach(it2 => {
              copySelectedItem.push(it2.value);
            });
          });
          copySelectedItem = copySelectedItem.filter(
            it => !parentNode.slice(0, selectedNodeIdx + 1).includes(it)
          );
        }
      }
    }

    setSelectedItem(copySelectedItem);
    onChange?.(copySelectedItem);
  }

  const handleDelete = (item: valueType) => {
    const copySelectedItem = [...selectedItem];
    const idx = copySelectedItem.indexOf(item);
    if (idx !== -1) {
      copySelectedItem.splice(idx, 1);
      setSelectedItem(copySelectedItem);
      onChange?.(copySelectedItem);
    }
  }

  const getMenuItem = (item: optionType) => {
    const parentValue = getParentValue(item, flatOptionsMap);
    const isChecked = selectedItem.some(it => parentValue.includes(it));
    let isIndeterminate = false;
    if (!isChecked) {
      const childrenValue = getChildrenValue(item);
      isIndeterminate = selectedItem.some(it => childrenValue.includes(it));
    }
    return (
      <li 
        key={item.value}
        title={item.label}
        className={cs({
          [s['multi-cascader-menu-item']]: true,
          [s['multi-cascader-menu-item-expand']]: !!item.children?.length,
          [s['multi-cascader-menu-item-active']]: activeList.includes(item.value),
          [s['multi-cascader-menu-item-disabled']]: disabled || item.disable,
        })}
        onClick={() => {
          if (disabled) return;
          const copyActiveList = [...activeList];
          item.depth && copyActiveList.splice(item.depth - 1, copyActiveList.length, item.value);
          setActiveList(copyActiveList);
        }}
      >
        <span
          className={cs({
            [s['multi-cascader-checkbox']]: true,
            [s['multi-cascader-checkbox-indeterminate']]: isIndeterminate,
            [s['multi-cascader-checkbox-checked']]: isChecked,
            [s['multi-cascader-checkbox-disabled']]: disabled || item.disable,
          })}
          onClick={() => {
            if (disabled || item.disable) return;
            handleChecked(item, !isChecked);
          }}
        >
          <span className={s['multi-cascader-checkbox-inner']} />
        </span>
        <div className={s['multi-cascader-menu-item-content']}>{item.label}</div>
        <div className={s['multi-cascader-menu-item-expand-icon']}>
          <span role="img">
            <svg
              viewBox="64 64 896 896"
              focusable="false"
              width="1em"
              height="1em"
              fill="currentColor"
            >
              <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z" />
            </svg>
          </span>
        </div>
      </li>
    )
  }

  return (
    <div className={s['multi-cascader']} style={{ '--mca-theme-color': themeColor } as CSSProperties}>
      {searchable && (
        <div className={s['search-bar']}>
          <textarea className={s['search-input']} placeholder={searchPlaceholder ?? '支持多项搜索，不同搜索词之间用中英文逗号隔开，按回车键搜索'} />
        </div>
      )}
      <div className={s['multi-cascader-body']}>
        <div className={s['multi-cascader-menus']}>
          <ul className={s['multi-cascader-menu']}>
            {options.map(item => getMenuItem(item))}
          </ul>
          {activeList.map(item => {
            const temp = flatOptionsMap.get(item);
            if (!temp?.children?.length) return null;
            return (
              <ul key={item} className={s['multi-cascader-menu']}>
                {temp.children.map((it: optionType) => getMenuItem(it))}
              </ul>
            );
          })}
        </div>
        <div className={s['multi-cascader-result']}>
          <div className={s['multi-cascader-result-header']}>
            <span>已选 {selectedItem.length} 项</span>
            <span className={s['multi-cascader-result-clear']} onClick={() => setSelectedItem([])}>清空</span>
          </div>
          <div className={s['multi-cascader-result-body']}>
            {selectedItem.length ? selectedItem.map(item => (
              <div key={item} className={s['multi-cascader-result-item']}>
                {getParentValue(flatOptionsMap.get(item), flatOptionsMap)
                  .map(it => flatOptionsMap.get(it)?.label)
                  .reverse()
                  .join(' / ')}
                <span className={s['multi-cascader-result-item-close']} onClick={() => handleDelete(item)}>+</span>
              </div>
            )) : (
              <EmptyTable emptyText="暂未选择" style={{ marginTop: 60 }}/>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MultiCascader;