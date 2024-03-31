
import React from "react";
import axios from 'axios';
import {useState, useEffect} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Card, Button, Table } from '@themesberg/react-bootstrap';
import RemoveModal from "../pages/examples/ValueTargetEditModal"
import moment from "moment";
import { useChat } from "../api/context";

function ValuetargetsTable({valResult, type, search, deleteInd, reload, setReload}){
  const value = valResult.data;
  const instance = axios.create({baseURL:'http://127.0.0.1:5000/api/avm'});
  const [orig, setOrig] = useState("");
  const {val, setVal, valType, setValType} = useChat()
  const [states, setStates] = useState("");
  const [removeModal, setRemoveModal] = useState(false)
  const [valueTarget, setValueTarget] = useState({
    target_status:"",
    target_num: "",
    target_name:"",
    category:"",
  })

  const handleRowEditDelete = (states, target_num, target_name, target_status, category) => {
    setStates(states);
    setRemoveModal(true);
    setValueTarget({ target_num: target_num, target_name:target_name, target_status:target_status, category:category});
    setOrig(target_num);
  }

  const handleChangeState = (orig, status,  target_name, category) =>{
    setValueTarget({ target_num: orig, target_name:target_name, target_status:status, category:category});
    setOrig(orig)
    if(status === 1){
      setVal(false)
    }
    else{
      setVal(true)
    }
  }

  useEffect(()=>{
    if(orig !== '' && val !== null){
      handleEditValueTarget(val)
    }
    setOrig("")    
  },[val])

  const handleEditValueTarget = async(stat)=>{
    const jsonData = {
      orig: `${orig}`,
      status:`${stat}`,
      target_num: `${valueTarget.target_num}`,
      target_name: `${valueTarget.target_name}`,
      target_status: `${valueTarget.target_status}`,
      category:`${type}`,
      task:"change_state"
    };
    const response = await instance.post('/mod_value_target', jsonData);
    if(response.status == 200){
      setReload(!reload);
      alert('變更成功');
      setValType(type);
      setVal(null);
    }else{
      alert('變更失敗');
    }
  }

  const TableRow = (props) => {
    const { id, target_num, target_name, target_status, update_time, category } = props;

    return (
      <tr>
        <td>
          <span className="fw-normal">
            {target_num}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {target_name}
          </span>
        </td>
       
        <td>
          <span className="fw-normal">
            {target_status === 1?"顯示":target_status === 0?"未顯示":"未顯示"}
          </span>
        </td>
        <td>
          <Button variant="outline-primary" onClick={() => {handleChangeState(target_num, target_status, target_name, category)}}>變更</Button>
        </td>
        <td>
          <span className="fw-normal">
            {update_time === null?"---":moment(update_time).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        </td>
        <td>
          {!deleteInd ? (
          <Button variant = "link"onClick={() => {handleRowEditDelete("editing", target_num, target_name, target_status, category)}}>
            <FontAwesomeIcon icon={faEdit} className="me-0.5" /> 
          </Button>) : null}
          <Button  variant = "link" className="text-danger" onClick={() => {handleRowEditDelete("deleting", target_num, target_name, target_status, category)}}>
            <FontAwesomeIcon icon={faTrashAlt} className="me-0.5" /> 
          </Button>
        </td>
      </tr>
    );
  };
  const NulledTableRow = (props) => {
    const { id, target_num, target_name, target_status, update_time, category } = props;
    return (
      <tr>
        <td>
          <span className="fw-normal">
            {target_num}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {target_name}
          </span>
        </td>
       
        <td>
          <span className="fw-normal">
            {target_status === 1?"顯示":target_status === 0?"未顯示":"未顯示"}
          </span>
        </td>
        <td>
          無法變更
        </td>
        <td>
          <span className="fw-normal">
            {update_time === null?"---":moment(update_time).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        </td>
        <td>
          ---
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm">
      <Card.Body className="pt-0">
        <Table hover className="user-table align-items-center table-striped">
          <thead>
            <tr>
              <th className="border-bottom">{type === "原料"?"原料":type === "產品"?"產品":type === "顧客"?"顧客":"部門"}代碼</th>
              <th className="border-bottom">{type === "原料"?"原料":type === "產品"?"產品":type === "顧客"?"顧客":"部門"}名稱</th>
              <th className="border-bottom">{type === "原料"?"原料":type === "產品"?"產品":type === "顧客"?"顧客":"部門"}狀態</th>
              <th className="border-bottom">變更{type === "原料"?"原料":type === "產品"?"產品":type === "顧客"?"顧客":"部門"}狀態</th>
              <th className="border-bottom">更新時間</th>
              <th className="border-bottom">選項</th>
            </tr>
          </thead>
          <tbody>
            {typeof(value) === "undefined"? null:
              deleteInd?
              value.filter((acc) => 
              (acc.target_status === 0 || acc.target_status > 1)&&(
                acc.target_num.includes(search) ||
                acc.target_name.includes(search)))
              .map(t => t.target_status === 0?<TableRow  {...t}/> : <NulledTableRow  {...t}/>)
              :
              value.filter((acc) => 
              acc.target_status === 1 &&(
                acc.target_num.includes(search) ||
                acc.target_name.includes(search)))
              .map(t => <TableRow  {...t} />)
            }
          </tbody>
        </Table>
      </Card.Body>
      {removeModal?
        <RemoveModal /** 編輯視窗 */
          show={removeModal}
          onHide={() => setRemoveModal(false)}
          onSave={(num, name) => setValueTarget({target_num : num, target_name:name})}
          states ={states}
          valueTarget ={valueTarget}
          orig={orig}
          reload={reload}
          setReload={setReload}
      />:<div></div>}
    </Card>
  );
}
export default ValuetargetsTable