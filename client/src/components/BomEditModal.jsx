import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal } from '@themesberg/react-bootstrap';
import '../App.css'

function BomEditModal({data, editBlock, setEditBlock, level, reload, setReload, userName }){
    const instance = axios.create({baseURL:'http://127.0.0.1:5000/api/avm'});
    const [num, setNum] = useState(data.Num);

    async function editBomData(){
        let getApiUri = null;
        let updateData ={};

        if(level === 2){
            getApiUri = '/update_bom_second';
            updateData ={
                product_first_id: data.productFirstId,
                product_second_id: data.productSecondId,
                quantity: num,
                update_user: userName,
                task :"modify"
            }
        }else{
            getApiUri = '/update_bom_third';
            updateData ={
                product_id: data.productFirstId,
                product_sec_id: data.productSecondId,
                material_id: data.productThirdId,
                quantity: num,
                update_user: userName,
                task :"modify"
            }
        }

        if(getApiUri !== null){
            try {
                const status = await instance.post(getApiUri, updateData);
                if(status.status === 200){
                  setNum(data.Num);
                  setEditBlock(false);
                  setReload(!reload)
                }
            }catch (error) {
                console.log(error)
            }
        }
    }

    return(
        <div
        className="modal show"
        style={{ display: 'block', position: 'initial' }}
        >
        <Modal show={editBlock} onHide={() =>{ setEditBlock(false); }}>
            <Modal.Header closeButton>
            <Modal.Title>修改第{level}階用量</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="bomEditInputBlock">
                    <p className="bomEditTitle">用量：</p>
                    <input type="number" className="bomEditInput" value={num} onChange={(e) => { setNum(e.target.value);}} />
                </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" 
            onClick={() => { editBomData(); }}> 修改 </Button>
            <Button variant="primary" 
            onClick={() => {
                setNum(data.Num);
                setEditBlock(false);
            }}> 取消 </Button>
            </Modal.Footer>
        </Modal>
    </div>
    )
}

export default BomEditModal;