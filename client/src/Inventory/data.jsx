const data = [
  {
    key: 1,
    date: '-',
    product_order: '202401041614', //產品號碼
    product_name: '產品A',
    unit: '個',
    beginningInventory_num: 5, //期初數量
    beginningInventory_unit_cost: 10, //期初單位成本
    beginningInventory_total_cost: 50, //期初總成本
    purchase_num: 24, //進貨總數量
    purchase_unit_cost: 5, //進貨單位成本
    purchase_total_cost: 120, //進貨總成本
    operating_num: 12, // 銷貨總數量
    operating_unit_cost: '-', // 銷貨單位成本
    operating_total_cost: 80, // 銷貨總成本
    endingBalance_num: 17, //期末結餘總數量
    endingBalance_unit_cost: 5.29, //期末單位成本
    endingBalance_total_cost: 90, //期末結餘總成本
    inventoryShort: 0, // 盤點盈虧
    type: 'more', // 只有沒有明細
    children: [
      {
        key: 11, //流水號
        date: '2024-01-02 15:10:29', // 發生時間
        product_order: '202401041614', // 產品單號
        product_name: '產品A', // 產品名稱
        unit: '個', // 產品單位
        operating_num: 2, // 銷貨數量
        operating_unit_cost: 10, // 銷貨單位成本
        operating_total_cost: 20, // 銷貨總成本
      },
      {
        key: 12, //流水號
        date: '2024-01-03 14:56:37', // 發生時間
        product_order: '202401041614', // 單號
        product_name: '產品A', // 產品名稱
        unit: '個', // 產品單位
        purchase_num: 12,// 進貨數量
        purchase_unit_cost: 5, // 進貨單位成本
        purchase_total_cost: 60, // 進貨總成本
      },
      {
        key: 13,
        date: '2024-01-03 18:48:01',
        product_order: '202401041614',
        product_name: '產品A',
        unit: '個',
        operating_num: 10,
        operating_unit_cost: 6,
        operating_total_cost: 60,
      },
      {
          key: 14,
          date: '2024-01-05 10:29:04',
          product_order: '202401041614',
          product_name: '產品A',
          unit: '個',
          purchase_num: 12,// 進貨數量
          purchase_unit_cost: 5,// 進貨單位成本
          purchase_total_cost: 60,// 進貨總成本
          endingBalance_num: 17, //期末結餘總數量
          endingBalance_unit_cost: 5.29, //期末結餘單位成本
          endingBalance_total_cost: 90, //期末結餘總成本
          inventoryShort: 0, //盤點盈虧
      },
    ],
  },
  {
    key: 2,
    date: '-',
    product_order: '202401161649',
    product_name: '產品B',
    unit: '個',
    beginningInventory_num: 5, //期初數量
    beginningInventory_unit_cost: 10, //期初單位成本
    beginningInventory_total_cost: 50, //期初總成本
    purchase_num: 24, //進貨總數量
    purchase_unit_cost: 5, //進貨單位成本
    purchase_total_cost: 120, //進貨總成本
    operating_num: 12, // 銷貨總數量
    operating_unit_cost: '-', // 銷貨單位成本
    operating_total_cost: 80, // 銷貨總成本
    endingBalance_num: 17, //期末結餘總數量
    endingBalance_unit_cost: 5.29, //期末單位成本
    endingBalance_total_cost: 90, //期末結餘總成本
    inventoryShort: 0, // 盤點盈虧
    type: 'more', // 只有沒有明細
    children: [
      {
        key: 21, //流水號
        date: '2024-01-12 15:10:29', // 發生時間
        product_order: '20240116164901', // 產品單號
        product_name: '產品B', // 產品名稱
        unit: '個', // 產品單位
        operating_num: 2, // 銷貨數量
        operating_unit_cost: 10, // 銷貨單位成本
        operating_total_cost: 20, // 銷貨總成本
      },
      {
        key: 22, //流水號
        date: '2024-01-13 14:56:37', // 發生時間
        product_order: '20240116164902', // 產品單號
        product_name: '產品B', // 產品名稱
        unit: '個', // 產品單位
        purchase_num: 12,// 進貨數量
        purchase_unit_cost: 5, // 進貨單位成本
        purchase_total_cost: 60, // 進貨總成本
      },
      {
        key: 23,
        date: '2024-01-13 18:48:01',
        product_order: '20240116164903',
        product_name: '產品B',
        unit: '個',
        operating_num: 10,
        operating_unit_cost: 6,
        operating_total_cost: 60,
      },
      {
          key: 24,
          date: '2024-01-15 10:29:04',
          product_order: '20240116164904',
          product_name: '產品B',
          unit: '個',
          purchase_num: 12,// 進貨數量
          purchase_unit_cost: 5,// 進貨單位成本
          purchase_total_cost: 60,// 進貨總成本
          endingBalance_num: 17, //期末結餘總數量
          endingBalance_unit_cost: 5.29, //期末結餘單位成本
          endingBalance_total_cost: 90, //期末結餘總成本
          inventoryShort: 0, //盤點盈虧
      },
    ],
  },
];
  
export default data;
  