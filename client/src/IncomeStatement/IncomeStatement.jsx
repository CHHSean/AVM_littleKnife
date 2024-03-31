import React, { useState, useEffect } from "react";
import Select from 'react-select';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faReply } from '@fortawesome/free-solid-svg-icons';
import { Button, Table } from '@themesberg/react-bootstrap';
import ExcelJs from "exceljs";
import '../App.css';

function IncomeStatement(){
    const instance = axios.create({baseURL:'http://127.0.0.1:5000/api/avm'});
    const [data, setData] = useState([]);
    const [contentBlock, setContentBlock] = useState(false);
    const [yearOption, setYearOption] = useState([]);
    const [monthOption, setMonthOption] = useState([]);
    const [year, setYear] = useState(null);
    const [month, setMonth] = useState(null);
    const [tableData, setTableData] = useState(data['First']);
    const [chooseLevel, setChooseLevel] = useState({ label: '一', value: 'First'});
    const userData = JSON.parse(localStorage.getItem('data'));

    const buttonList = [
        { label: '一', value: 'First'},
        { label: '二', value: 'Second'},
        { label: '三', value: 'Third'},
        { label: '四', value: 'Fourth'},
    ];

    useEffect(() => {
        async function getDate(){
            const results = await instance.get('/get_IncomeStatement_Year_Month');
            if(results.data !== undefined){
                if(results.data.length !== 0){
                    let yearArr =[];
                    let monthArr = [];
                    for(let i=0; i<results.data.length; i++){
                        yearArr.push({value: results.data[i]['year'], label: results.data[i]['year']});
                        monthArr.push({value: results.data[i]['month'], label: results.data[i]['month']});
                    }
                    const uniqueYearArr = [...new Set(yearArr.map(item => JSON.stringify(item)))].map(item => JSON.parse(item));
                    const uniqueMonthArr = [...new Set(monthArr.map(item => JSON.stringify(item)))].map(item => JSON.parse(item));
                    setYearOption(uniqueYearArr);
                    setMonthOption(uniqueMonthArr);
                }
            }
          }
        getDate();
    },[]);

    useEffect(() => {
        if(contentBlock && year !== null && month !== null){
            async function getData(){
                const results = await instance.get(`/get_IncomeStatement${year}-${month}`);
                console.log(results.error)
                setData(results.data);
                setTableData(results.data['First']);
                }
            getData();
        }
    },[contentBlock])

    useEffect(() => {
        setTableData(data['First']);
    },[data])

    useEffect(() => {
        setTableData(data[chooseLevel['value']]);
    },[chooseLevel]);

    async function dowloadExcel(){
        let totalData = [];
        let rowData = [];

        for(let i=0; i<tableData.length; i++){
            rowData = [tableData[i][`account${chooseLevel['value']}Id`], tableData[i][`account_${chooseLevel['value']}_Name_Cn`], tableData[i]['price']];
            totalData.push(rowData);
        }

        const bom = new ExcelJs.Workbook();
        const sheet = bom.addWorksheet(`第${chooseLevel.label}階損益表`);
        const headerContent = [userData.Companyname, '損益表', `民國${year}年${month}月`];
        const columnNames = ['會計科目', '會計科目名稱', '金額'];

        for (let i = 0; i < 3; i++) {
            sheet.mergeCells(i + 1, 1, i + 1, columnNames.length);
            sheet.getCell(i + 1, 1).value = headerContent[i];
            sheet.getCell(i + 1, 1).alignment = { horizontal: 'center' };
        };

        sheet.addRow(columnNames);
        sheet.addRows(totalData);

        const content = await bom.xlsx.writeBuffer();
        const link = document.createElement('a');
        const blobData = new Blob([content], {
        type: 'application/vnd.ms-excel;charset=utf-8;'
        });

        link.download = `第${chooseLevel.label}階損益表.xlsx`;
        link.href = URL.createObjectURL(blobData);
        link.click();
    }
    
    function levelButton(){
        return buttonList.map((item, index) => {
            return(
                <Button variant="primary" className="incomeStatement_button" onClick={() => {setChooseLevel(item);}}>
                    第{item.label}階
                </Button>
            )
        })
    };

    function tableContent(){
        if(tableData !== undefined){
            return tableData.map((item, index) => {
                return(
                    <tr key={index}>
                        <td>{item[`account${chooseLevel['value']}Id`]}</td>
                        <td>{item[`account_${chooseLevel['value']}_Name_Cn`]}</td>
                        <td>{item.price.toFixed(2)}</td>
                    </tr>
                )
            })
        }
    };

    return(
        <div>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-3">
                <h2 className="fw-bold">
                    損益表
                </h2>
            </div>
            <div className="inventory_all">
                <div className="inventory_all_search">
                    <div className="inventory_select">
                        <Select options={yearOption} isDisabled={contentBlock} onChange={(e) => {setYear(e.value);}} />
                    </div>
                    <div className="inventory_select">
                        <Select options={monthOption} isDisabled={contentBlock} onChange={(e) => {setMonth(e.value);}} />
                    </div>
                </div>
                <button className="inventory_select_button_block" disabled={contentBlock} onClick={()=> { setContentBlock(true); }}>
                    <FontAwesomeIcon icon={faSearch} />
                    <p className="inventory_button_text">搜尋</p>
                </button>
                {contentBlock ? (
                    <button className="inventory_button_block" onClick={()=> { 
                        setContentBlock(false); 
                        setTableData(data['First']);
                        setChooseLevel({ label: '一', value: 'First'});
                    }}>
                        <FontAwesomeIcon icon={faReply} />
                        <p className="inventory_button_text">重新搜尋</p>
                    </button>
                    ): null}
            </div>
            {contentBlock ? 
            (<>
                <div className="incomeStatement_list_block">
                    <div>
                        {levelButton()}
                    </div>
                    <Button variant="success" onClick={() => {dowloadExcel()}}>
                        Excel 下載
                    </Button>
                </div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>會計科目</th>
                            <th>會計科目名稱</th>
                            <th>金額</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableContent()}
                    </tbody>
                </Table>
            </>) : null }
        </div>
        
    )

}

export default IncomeStatement;