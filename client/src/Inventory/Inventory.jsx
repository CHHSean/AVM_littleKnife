import React,{ useState, useEffect } from "react";
import axios from "axios";
import Select from 'react-select';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFile, faReply } from '@fortawesome/free-solid-svg-icons';
import Table from "./Table";
import '../App.css';
import ExcelJs from "exceljs";

function Inventory(){
    const instance = axios.create({baseURL:'http://127.0.0.1:5000/api/avm'});
    const[contentBlock, setContentBlock] = useState(false);
    const[defaultTableData, setDefaultTableData] = useState([]);
    const[tableData, setTableData] = useState([]);
    const[yearOptions, setYearOptions] = useState([]);
    const[monthOptions, setMonthOptions] = useState([]);
    const[year, setYear] = useState(null);
    const[month, setMonth] = useState(null);
    const[dateStart, setDateStart] = useState(null);
    const[dateEnd, setDateEnd] = useState(null);
    const[selectProduct, setSelectProduct] = useState(null);
    const[options, setOptions] = useState([]);

    useEffect(() => {
        async function getInventoryDate(){
            const data = await instance.get(`/get_inventory_date`);
            if(data.data !== undefined){
                if(data.data.length !== 0){
                    let yearArr = [];
                    let monthArr = [];
                    for(let i=0; i<data.data.length; i++){
                        yearArr.push({label: data.data[i]['year'], value: data.data[i]['year']});
                        monthArr.push({label: data.data[i]['month'], value: data.data[i]['month']})
                    }
                    let uniqueYearsArray = Array.from(new Set(yearArr.map(JSON.stringify)), JSON.parse);
                    let uniqueMonthArray = Array.from(new Set(monthArr.map(JSON.stringify)), JSON.parse);
                    setYearOptions(uniqueYearsArray);
                    setMonthOptions(uniqueMonthArray);
                }
            }
        }
        getInventoryDate()
    },[])

    useEffect(() => {
        async function getData(){
            if(year !== null && month !== null){
                try {
                    const data = await instance.post('/sel_psi', {'year': year, 'month': month});
                    const productName = await instance.post('/get_psi_product', {'year': year, 'month': month});
                    if(productName.data.length !== 0){
                        let allOptions = [];
                        for(let i=0; i<productName.data.length; i++){
                            allOptions.push({label: productName['data'][i]['name'], value: productName['data'][i]['name']});
                        }
                        setOptions(allOptions);
                    }
                    setDefaultTableData(data.data);
                    setTableData(data.data);
                    const lastDayOfMonth = new Date(year, month, 0).getDate();
                    setDateStart(year + '-' + month + '-01');
                    setDateEnd(year + '-' + month + '-' + lastDayOfMonth);
                }catch (error) {
                    console.log(error)
                }
            }
        }


        getData();
    },[contentBlock]);

    useEffect(() => {
        let filterArr = JSON.parse(JSON.stringify(defaultTableData));
        const lastDayOfMonth = new Date(year, month, 0).getDate();

        if(selectProduct !== null){
            if(selectProduct.length === 0){
                setTableData(filterArr);
            }else{
                filterArr = filterArr.filter(item => {
                    return selectProduct.some(v => v.value === item.product_name);
                });
            }
        }

        if(dateStart !== null && dateEnd !== null && dateStart !== `${year}-${month}-01` && dateEnd !== `${year}-${month}-${lastDayOfMonth}`){
            filterArr = filterArr.filter(parent => {
                const filteredChildren = parent.children.filter(child => {
                    const formattedDate = child.date.replace(/\//g, '-');
                    const datePart = formattedDate.split(' ')[0];
                    const date = new Date(datePart);
                    const childDate = date.toISOString().split('T')[0];
                    const currentDate = new Date(childDate).getTime();
                    const startDate = new Date(dateStart).getTime();
                    const endDate = new Date(dateEnd).getTime();
                    return currentDate >= startDate && currentDate <= endDate;
                });
                if (filteredChildren.length > 0) {
                  return { ...parent, children: filteredChildren };
                }
                return null;
            }).filter(Boolean);
        }
        setTableData(filterArr);
    },[selectProduct, dateStart, dateEnd])

    async function dowloadExcel(type){
        let totalData = [];
        let rowData = [];
        let sheetName = '';
        let fileName = '';

        if(type === 'total'){
            sheetName = '進銷貨明細總表';
            fileName = '進銷貨明細總表.xlsx';
            for(let i=0; i<tableData.length; i++){
                rowData = [
                    tableData[i]['date'],
                    tableData[i]['product_order'],
                    tableData[i]['product_name'],
                    tableData[i]['unit'],
                    tableData[i]['beginningInventory_num'],
                    tableData[i]['beginningInventory_unit_cost'],
                    tableData[i]['beginningInventory_total_cost'],
                    tableData[i]['purchase_num'],
                    tableData[i]['purchase_unit_cost'],
                    tableData[i]['purchase_total_cost'],
                    tableData[i]['operating_num'],
                    tableData[i]['operating_unit_cost'],
                    tableData[i]['operating_total_cost'],
                    tableData[i]['endingBalance_num'],
                    tableData[i]['endingBalance_unit_cost'],
                    tableData[i]['endingBalance_total_cost'],
                    tableData[i]['inventoryShort']
                ];
                totalData.push(rowData);
            }
        }else{
            sheetName = '進銷貨明細表';
            fileName = '進銷貨明細表.xlsx';
            for(let i=0; i<tableData.length; i++){
                rowData = [
                    tableData[i]['date'],
                    tableData[i]['product_order'],
                    tableData[i]['product_name'],
                    tableData[i]['unit'],
                    tableData[i]['beginningInventory_num'],
                    tableData[i]['beginningInventory_unit_cost'],
                    tableData[i]['beginningInventory_total_cost'],
                    tableData[i]['purchase_num'],
                    tableData[i]['purchase_unit_cost'],
                    tableData[i]['purchase_total_cost'],
                    tableData[i]['operating_num'],
                    tableData[i]['operating_unit_cost'],
                    tableData[i]['operating_total_cost'],
                    tableData[i]['endingBalance_num'],
                    tableData[i]['endingBalance_unit_cost'],
                    tableData[i]['endingBalance_total_cost'],
                    tableData[i]['inventoryShort']
                ];
                totalData.push(rowData);

                if(tableData[i]['children'].length !== 0){
                    for(let a=0; a<tableData[i]['children'].length; a++){
                        rowData = [
                            tableData[i]['children'][a]['date'],
                            tableData[i]['children'][a]['product_order'],
                            tableData[i]['children'][a]['product_name'],
                            tableData[i]['children'][a]['unit'],
                            tableData[i]['children'][a]['beginningInventory_num'],
                            tableData[i]['children'][a]['beginningInventory_unit_cost'],
                            tableData[i]['children'][a]['beginningInventory_total_cost'],
                            tableData[i]['children'][a]['purchase_num'],
                            tableData[i]['children'][a]['purchase_unit_cost'],
                            tableData[i]['children'][a]['purchase_total_cost'],
                            tableData[i]['children'][a]['operating_num'],
                            tableData[i]['children'][a]['operating_unit_cost'],
                            tableData[i]['children'][a]['operating_total_cost'],
                            tableData[i]['children'][a]['endingBalance_num'],
                            tableData[i]['children'][a]['endingBalance_unit_cost'],
                            tableData[i]['children'][a]['endingBalance_total_cost'],
                            tableData[i]['children'][a]['inventoryShort']
                        ];
                        totalData.push(rowData);
                    }
                }
            }
        }
        const bom = new ExcelJs.Workbook();
        const sheet = bom.addWorksheet(sheetName);
        const columnNames = ['日期', '單號', '產品名稱', '單位', '期初數量', '期初單位成本', '期初總成本', '進貨數量', '進貨單位成本', '進貨總成本', '銷貨數量', '銷貨單位成本', '銷貨總成本', '期末結餘數量', '期末結餘單位成本', '期末結餘總成本', '盤點盈虧'];
    
        sheet.addRow(columnNames);
        sheet.addRows(totalData);

        const content = await bom.xlsx.writeBuffer();
        const link = document.createElement('a');
        const blobData = new Blob([content], {
        type: 'application/vnd.ms-excel;charset=utf-8;'
        });

        link.download = fileName;
        link.href = URL.createObjectURL(blobData);
        link.click();
    }

    return(
        <div>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-3">
                <h2 className="fw-bold">
                    進銷存明細報表
                </h2>
            </div>
            <div className="inventory_all">
                <div className="inventory_all_search">
                    <div className="inventory_select">
                        <Select options={yearOptions} isDisabled={contentBlock} onChange={(e) => {setYear(e.value);}} />
                    </div>
                    <div className="inventory_select">
                        <Select options={monthOptions} isDisabled={contentBlock} onChange={(e) => {setMonth(e.value);}} />
                    </div>
                </div>
                <button className="inventory_select_button_block" disabled={contentBlock} onClick={()=> { setContentBlock(true); }}>
                    <FontAwesomeIcon icon={faSearch} />
                    <p className="inventory_button_text">搜尋</p>
                </button>
                {contentBlock ? (
                    <button className="inventory_button_block" onClick={()=> { setContentBlock(false); }}>
                        <FontAwesomeIcon icon={faReply} />
                        <p className="inventory_button_text">重新搜尋</p>
                    </button>
                    ): null}
            </div>
            {contentBlock ? (
                <>
                    <div className="inventory_search_block">
                        <div className="inventory_data_select_block">
                            <div className="inventory_data_block">
                                <input type="date" className="inventory_data_input" value={dateStart} onChange={(e) => {setDateStart(e.target.value)}} />
                                <p className="inventory_data_text">~</p>
                                <input type="date" className="inventory_data_input" value={dateEnd} onChange={(e) => {setDateEnd(e.target.value)}} />
                            </div>
                            <div className="inventory_select_block">
                                <Select options={options} isMulti onChange={(e) => {setSelectProduct(e);}} />
                            </div>
                        </div>
                        <div className="inventory_excelButton_block">
                            <button className="inventory_button_block" onClick={() => {dowloadExcel('total');}}>
                                <FontAwesomeIcon icon={faFile} />
                                <p className="inventory_button_text">當期總表下載</p>
                            </button>
                            <button className="inventory_button_block" onClick={() => {dowloadExcel('detail');}}>
                                <FontAwesomeIcon icon={faFile} />
                                <p className="inventory_button_text">當期明細表下載</p>
                            </button>
                        </div>
                    </div>
                    <Table tableData={tableData} />
                </>
            ) : null}
        </div>
    )
}

export default Inventory;