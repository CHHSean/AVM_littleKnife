
import React,{ useState, useEffect} from "react";
import { Card, Table } from '@themesberg/react-bootstrap';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import '../App.css';

function AccountData({data, search}){
    const [allData, setAllData] = useState(data);
    const [dataDefault, setDataDefault] = useState([]);
    const [filterAllData, setFilterAllData] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        setAllData(data);
        setCurrentPage(1);
    },[data.length])

    useEffect(() => {
        if(search.trim() !== ''){
            let count = 0;
            let filterArr = [];
            for (const acc of data) {
                const shouldInclude = 
                    acc.third.toString().includes(search) ||
                    acc.third_subjects_cn.trim().includes(search) ||
                    acc.third_subjects_eng.trim().includes(search) ||
                    acc.fourth.toString().includes(search) ||
                    acc.fourth_subjects_cn.trim().includes(search) ||
                    acc.fourth_subjects_eng.trim().includes(search);
                if (shouldInclude) {
                    count = count + 1;
                    filterArr.push({
                        id: count, 
                        third: acc.third, 
                        third_subjects_cn: acc.third_subjects_cn, 
                        third_subjects_eng: acc.third_subjects_eng, 
                        fourth: acc.fourth, 
                        fourth_subjects_cn: acc.fourth_subjects_cn, 
                        fourth_subjects_eng: acc.fourth_subjects_eng
                    });
                }
            }
            setFilterAllData(filterArr);
            setAllData([]);
            setCurrentPage(1);
        }else{
            setFilterAllData([]);
            setAllData(data);
            setCurrentPage(1);
        }
    },[search])

    useEffect(() => {
        if(currentPage !== 0){
            if(currentPage === 1){
                if(search.trim() !== ''){
                    setFilterData(filterAllData.slice(0, 10));
                }else{
                    setDataDefault(data.slice(0, 10));
                }
            }else{
                if(search.trim() !== ''){
                    setFilterData(filterAllData.slice((currentPage-1)*10, parseInt(String(currentPage)+'0')));
                }else{
                    setDataDefault(data.slice((currentPage-1)*10, parseInt(String(currentPage)+'0')));
                }
            }
        }
    },[currentPage, data.length, filterAllData.length]);
  
    function TableRow(){
        let data = search.trim() !== '' ? filterData : dataDefault;
        if(data.length !== 0){
            return data.map((item, index) => {
                return(
                    <tr>
                    <td>
                      <span className="fw-normal">
                        {item.third}
                      </span>
                    </td>
                    <td>
                      <span className="fw-normal">
                        {item.third_subjects_cn}
                      </span>
                    </td>
                   
                    <td>
                      <span className="fw-normal">
                        {item.third_subjects_eng}
                      </span>
                    </td>
                    <td>
                      <span className="fw-normal">
                        {item.fourth}
                      </span>
                    </td>
                    <td>
                      <span className="fw-normal">
                        {item.fourth_subjects_cn}
                      </span>
                    </td>
                    <td>
                      <span className="fw-normal">
                        {item.fourth_subjects_eng}
                      </span>
                    </td>
                  </tr>
                )
            })
        }
    }
  
    if(data.length === 0){
        return(
            <div>
                No more data
            </div>
        )
    }else{
        return (
            <>
            <Card border="light" className="table-wrapper table-responsive shadow-sm">
                <Card.Body className="pt-0">
                <Table hover className="user-table align-items-center table-striped">
                    <thead>
                    <tr>
                        <th className="border-bottom">三階科目代碼</th>
                        <th className="border-bottom">三階科目中文名稱</th>
                        <th className="border-bottom">三階科目英文名稱</th>
                        <th className="border-bottom">四階科目代碼</th>
                        <th className="border-bottom">四階科目中文名稱</th>
                        <th className="border-bottom">四階科目英文名稱</th>
                    </tr>
                    </thead>
                    <tbody>
                        {TableRow()}
                    </tbody>
                </Table>
                </Card.Body>
            </Card>
            <div className="paginationBlock">
                <PaginationControl
                    page={currentPage}
                    between={4}
                    total={search.trim() !== '' ? filterAllData.length : allData.length}
                    limit={10}
                    changePage={(page) => {setCurrentPage(page);}}
                    ellipsis={1}
                />
            </div>
            </>
        );
    }
};

export default AccountData;