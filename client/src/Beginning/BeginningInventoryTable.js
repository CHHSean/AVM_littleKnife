
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit,faTrashAlt  } from '@fortawesome/free-solid-svg-icons';
import {Card, Button, Table } from '@themesberg/react-bootstrap';
import RemoveModal from "./BeginningInventoryEditForm";
import '../App.css';
import { PaginationControl } from 'react-bootstrap-pagination-control';

function BeginningInventoryTable({rawMaterials, search, reload, setReload}){
  const [currentPage, setCurrentPage] = useState(0);
  const [removeModal, setRemoveModal] = useState(false);
  const [origs, setOrigs] = useState("");
  const [states, setStates] = useState("");
  const [allData, setAllData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [filterAllData, setFilterAllData] = useState([]);
  const [inventory, setInventory] = useState({ id: "", mid: "", mname:"", date: "", startC: "", startU:"", startP: "", startQ: ""});
  const defaultData = rawMaterials.data;

  useEffect(() => {
    setAllData(defaultData);
    setCurrentPage(1);
  },[defaultData]);

  useEffect(() => {
      if(search.trim() !== ''){
          let count = 0;
          let filterArr = [];
          for (const acc of defaultData) {
            const shouldInclude = 
              acc.date.includes(search) ||
              acc.name.trim().includes(search) ||
              acc.num.trim().includes(search) ||
              acc.start_cost.toString().includes(search) ||
              acc.start_quantity.toString().includes(search) ||
              acc.start_unit.trim().includes(search) ||
              acc.start_unit_price.toString().includes(search);
            if (shouldInclude) {
              count = count + 1;
              filterArr.push({
                id: acc.id,
                date: acc.date,
                name: acc.name,
                num: acc.num,
                start_cost: acc.start_cost,
                start_quantity: acc.start_quantity,
                start_unit: acc.start_unit,
                start_unit_price: acc.start_unit_price,
                supplier_num: acc.supplier_num,
              });
            }
          }
          setFilterAllData(filterArr);
          setAllData([]);
          setCurrentPage(1);
      }else{
        setFilterData([]);
        setAllData(defaultData);
        setCurrentPage(1);
      }
  },[search])

  useEffect(() => {
    if(currentPage !== 0){
      if(currentPage === 1){
        if(search.trim() !== ''){
            setFilterData(filterAllData.slice(0, 10));
        }else{
          setAllData(defaultData.slice(0, 10));
        }
      }else{
        if(search.trim() !== ''){
            setFilterData(filterAllData.slice((currentPage-1)*10, parseInt(String(currentPage)+'0')));
        }else{
          setAllData(defaultData.slice((currentPage-1)*10, parseInt(String(currentPage)+'0')));
        }
      }
    }
  },[currentPage, defaultData.length, filterAllData.length]);

  function handleRowEditDelete(state, id, m_id, m_name, date, start_quantity,start_unit, start_unit_price, start_cost){
    setStates(state);
    setRemoveModal(true);
    setInventory({ id: id, mid: m_id, mname:m_name, date: date, startC: start_cost, startU : start_unit, startP: start_unit_price, startQ: start_quantity,});
    setOrigs(id);
  }

  function TableRow(){
    let data = search.trim() !== '' ? filterData : allData;
    if(data.length !== 0){
      return data.map((item, index) => {
        return(
          <tr>
            <td>{item.num}</td>
            <td>{item.name}</td>
            <td>{item.start_quantity}</td>
            <td>{item.start_unit}</td>
            <td>{item.start_unit_price}</td>
            <td>{item.start_cost}</td>
            <td>{item.date.substring(0, 10)}</td>
            <td>
              <Button variant = "link" onClick={() => {handleRowEditDelete("editing", item.id, item.num, item.name, item.date, item.start_quantity, item.start_unit, item.start_unit_price, item.start_cost)}}>
                <FontAwesomeIcon icon={faEdit} className="me-0.5" /> 
              </Button>
              <Button  variant = "link" className="text-danger" onClick={() => {handleRowEditDelete("deleting", item.id, item.num, item.name, item.date, item.start_quantity, item.start_unit, item.start_unit_price, item.start_cost)}}>
                <FontAwesomeIcon icon={faTrashAlt} className="me-0.5" /> 
              </Button>
            </td>
          </tr>
        )
      })
    }
  }

  return (
    <>
      <Card border="light" className="table-wrapper table-responsive shadow-sm">
        <Card.Body className="pt-0">
          <Table hover className="user-table align-items-center table-striped">
            <thead>
              <tr>
                <th className="border-bottom">原物料代碼</th>
                <th className="border-bottom">原物料名稱</th>
                <th className="border-bottom">期初數量</th>
                <th className="border-bottom">期初單位</th>
                <th className="border-bottom">期初單價</th>
                <th className="border-bottom">期初成本</th>
                <th className="border-bottom">建立日期</th>
                <th className="border-bottom">  選項</th>
              </tr>
            </thead>
            <tbody>
              {TableRow()}
              {/* {search ? 
                defaultData.filter((acc) => acc.num.includes(search) ||
                acc.name.includes(search)).map((t) => (<TableRow {...t} />))
              : defaultData.map((accountData) => (<TableRow {...accountData} />)) } */}
            </tbody>
          </Table>
        </Card.Body>
        {removeModal?
          <RemoveModal /** 編輯視窗 */
          show={removeModal}
          onHide={() => setRemoveModal(false)}
          states={states}
          inventory={inventory}
          origs={origs}
          reload={reload}
          setReload={setReload}
            />
        :
        <div></div>}
      </Card>
      <div className="paginationBlock">
        <PaginationControl
          page={currentPage}
          between={4}
          total={search.trim() !== '' ? filterAllData.length : defaultData.length}
          limit={10}
          changePage={(page) => {setCurrentPage(page);}}
          ellipsis={1}
        />
      </div>
    </>
  );
}
export default BeginningInventoryTable