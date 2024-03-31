import React from 'react';
import { TableList, RowExpandIcon } from './TableList';

const renderContent = (value, row) => {
    const formattedValue = typeof value === 'number' ? value.toFixed(2) : value;
  
    const obj = {
      children: formattedValue,
      props: {},
    };
  
    if (row.type === 'categoria') {
      obj.props.colSpan = 0;
    }
  
    return obj;
  };

const columns = [
    {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
        width: '5%',
        align: 'center',
        render: renderContent,
    },
    {
        title: '單號',
        dataIndex: 'product_order',
        key: 'product_order',
        width: '5%',
        align: 'center',
        render: renderContent,
    },
    {
        title: '原物料名稱',
        dataIndex: 'product_name',
        key: 'product_name',
        width: '5%',
        align: 'center',
        render: renderContent,
    },
    {
        title: '單位',
        dataIndex: 'unit',
        key: 'unit',
        width: '5%',
        align: 'center',
        render: renderContent,
    },
    {
        title: '期初數量',
        dataIndex: 'beginningInventory_num',
        key: 'beginningInventory_num',
        width: '5%',
        render: renderContent,
    },
    {
        title: '期初單位成本',
        dataIndex: 'beginningInventory_unit_cost',
        key: 'beginningInventory_unit_cost',
        width: '6%',
        render: renderContent,
    },
    {
        title: '期初總成本',
        dataIndex: 'beginningInventory_total_cost',
        key: 'beginningInventory_total_cost',
        width: '5.5%',
        render: renderContent,
    },
    {
        title: '進貨數量',
        dataIndex: 'purchase_num',
        key: 'purchase_num',
        width: '5%',
        render: renderContent,
    },
    {
        title: '進貨單位成本',
        dataIndex: 'purchase_unit_cost',
        key: 'purchase_unit_cost',
        width: '6.75%',
        render: renderContent,
    },
    {
        title: '進貨總成本',
        dataIndex: 'purchase_total_cost',
        key: 'purchase_total_cost',
        width: '5.5%',
        render: renderContent,
    },
    {
        title: '銷貨數量',
        dataIndex: 'operating_num',
        key: 'operating_num',
        width: '5%',
        render: renderContent,
    },
    {
        title: '銷貨單位成本',
        dataIndex: 'operating_unit_cost',
        key: 'operating_unit_cost',
        width: '6.75%',
        render: renderContent,
    },
    {
        title: '銷貨總成本',
        dataIndex: 'operating_total_cost',
        key: 'operating_total_cost',
        width: '6.75%',
        render: renderContent,
    },
    {
        title: '期末結餘數量',
        dataIndex: 'endingBalance_num',
        key: 'endingBalance_num',
        width: '6.75%',
        render: renderContent,
    },
    {
        title: '期末結餘單位成本',
        dataIndex: 'endingBalance_unit_cost',
        key: 'endingBalance_unit_cost',
        width: '7%',
        render: renderContent,
    },
    {
        title: '期末結餘總成本',
        dataIndex: 'endingBalance_total_cost',
        key: 'endingBalance_total_cost',
        width: '7%',
        render: renderContent,
    },
    {
        title: '盤點盈虧',
        dataIndex: 'inventoryShort',
        key: 'inventoryShort',
        width: '5%',
    },
];

function Table({tableData}) {
  return (
    <TableList
      className="table-pacientes"
      columns={columns}
      dataSource={tableData}
      indentSize={0}
      expandRowByClick
      expandIcon={RowExpandIcon}
    />
  );
}

export default Table;