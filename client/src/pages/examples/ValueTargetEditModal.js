
import React, { useState } from "react";
import axios from "axios";
import { useChat } from "../../api/context";
import { Modal, Button } from '@themesberg/react-bootstrap';
import '../../App.css';

const RemoveModal = ({ onHide,onSave, show, states, valueTarget, orig, reload, setReload }) =>{
  const instance = axios.create({baseURL:'http://127.0.0.1:5000/api/avm'});
  const [modalPage, setModalPage] = useState(0);
  const {val, setVal, valType, setValType} = useChat();
  const [newValueTarget, setNewValueTarget] = useState({
    target_status: valueTarget.target_status,
    target_old_name: valueTarget.target_name,
    target_name: valueTarget.target_name,
    target_num:valueTarget.target_num,
    category : valueTarget.category,
  });

  async function handleDeleteValueTarget(){
    setValType(null);
    const response = await instance.post('/del_value_target', {productId: newValueTarget.target_num});
    setReload(!reload);
    alert(response.data);
    onHide();
    setValType(newValueTarget.category);
    setModalPage(0);
  }
  
  async function handleEditValueTarget(){
    const jsonData = {
      orig: `${orig}`,
      target_num: `${newValueTarget.target_num}`,
      target_name: `${newValueTarget.target_name}`,
      target_status: `${newValueTarget.target_status}`,
      category: `${newValueTarget.category}`,
      task:"update_item"
    };
    setValType(null);

  const response = await instance.post('/mod_value_target', jsonData);
    if(response.status == 200){
      onSave(newValueTarget.target_num, newValueTarget.target_name);
      setReload(!reload);
      setValType(newValueTarget.category);
      alert('修改成功');
      onHide();
      setModalPage(0);
    }
  }

  function modalContent(){
    if(states === "deleting"){
      if(modalPage === 0){
        return(
          <>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">刪除價值標的</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <p>確定刪除：{newValueTarget.target_num} - {newValueTarget.target_name}嗎？</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => {setModalPage(1);}}>確認</Button>
            <Button variant="outline-primary" onClick={() => {onHide();setModalPage(0);}}>取消</Button>
          </Modal.Footer>
          </>
        )
      }else{
        return(
          <>
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">刪除價值標的</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="d-grid justify-content-center align-items-center">
                <p>若確認刪除{newValueTarget.target_num} - {newValueTarget.target_name}，則：</p>
                <div className="d-grid">
                  <p className="d-flex">⚠️若已有發生過交易，則<p className="valueTarget_warning_text">無法</p>刪除。</p>
                  {newValueTarget.category === '產品' ? (<p className="d-flex">⚠️會連動 BOM <p className="valueTarget_warning_text">一併</p>刪除。</p>) : null}
                  <p className="d-flex">⚠️刪除後，資料<p className="valueTarget_warning_text">無法</p>恢復。</p>
                </div>
                <p>確定要刪除嗎？</p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={() => {handleDeleteValueTarget()}}>確認</Button>
              <Button variant="outline-primary" onClick={() => {onHide()}}>取消</Button>
            </Modal.Footer>
          </>
        )
      }
    }else{
      if(modalPage === 0){
        return(
          <>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">編輯價值標的</Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex flex-wrap flex-md-nowrap align-items-center py-4">
            <div className="valueTarget_editBlock">
              <p className="valueTarget_text">價值標的名稱</p>
              <input className="valueTarget_input" defaultValue={newValueTarget.target_name} onChange={(e) => {newValueTarget.target_name = e.target.value}}/>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => {setModalPage(1);}}>修改</Button>
            <Button variant="outline-primary" onClick={() => {onHide();}}>取消</Button>
          </Modal.Footer>
          </>
        )
      }else{
        return(
        <>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">編輯價值標的</Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-grid justify-content-center align-items-center py-4">
            <p>確定將{newValueTarget.target_old_name} 變更成 {newValueTarget.target_name} 嗎？</p>
            <div>
              <p className="d-flex justify-content-center align-items-center">若確定變更，以下報表<p className="valueTarget_warning_text">皆會一併變更</p>：</p>
              <ul>
                <li>BOM 表</li>
                <li>交易明細</li>
                <li>期初庫存</li>
              </ul>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => {handleEditValueTarget();}}>確定</Button>
            <Button variant="outline-primary" onClick={() => {onHide();setModalPage(0);}}>取消</Button>
          </Modal.Footer>
        </>
        )
      }
    }
  }

  return(
  <Modal
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    {...{ onHide, show }}
  >
    {modalContent()}
</Modal>
  )
};

export default RemoveModal;
