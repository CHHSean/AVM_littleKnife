import React,{ useEffect, useState } from 'react';
import axios from "axios";
import { Table, Button, Modal } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus , faEdit , faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import BomEditModal from './BomEditModal';
import { AddBOMModal2 } from '../pages/examples/BomModal';
import '../App.css'

function BomList({ data, dataStatus, addModal, setAddModal, editBlock, setEditBlock, editData, setEditData, reload, setReload }){
    const userData = JSON.parse(localStorage.getItem('data'));
    const userName = userData.Username;
    const instance = axios.create({baseURL:'http://127.0.0.1:5000/api/avm'});
    const [deleteCheckFrom, setDeleteCheckFrom] = useState(false);
    const [secondBlock, setSecondBlock] = useState([]);
    const [thirdBlock, setThirdBlock] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [deleteData, setDeleteData] = useState({});
    const [secondSelectData, setSecondSelectData] = useState([]);
    const [thirdSelectData, setThirdSelectData] = useState([]);
    const [product, setProduct] = useState({
        status:"",
        product_id: "",
        product_name:"",
        update_time: "",
        update_user:"",
    });

    useEffect(() =>{
        async function getSelectData(){
          const data = await instance.get(`/sel_bomSecondList`);
          let secondList = [];
          let thirdList = [];
          if(data.data.length !== 0){
            for(let i=0 ;i <data.data.length; i++){
                secondList.push({
                    label: data.data[i]['num'] + '-' + data.data[i]['name'], 
                    value: data.data[i]['num'] + '-' + data.data[i]['name'],
                    id: data.data[i]['num'],
                    name: data.data[i]['name']
                });

                thirdList.push({
                    label: data.data[i]['num'], 
                    value: data.data[i]['num'],
                    id: data.data[i]['num'],
                });
            }
            setSecondSelectData(secondList);
            setThirdSelectData(thirdList);
          }
        }
        getSelectData();
      },[reload]);

    async function deleteBomData(deleteData, level){
        let deleteApiUri = null;
        if(level === 1){
            deleteApiUri = '/del_bom_first';
        }else if(level === 2){
            deleteApiUri = '/del_bom_second';
        }else{
            deleteApiUri = '/del_bom_third';
        }

        if(deleteApiUri !== null){
            try {
                const status = await instance.post(deleteApiUri, deleteData);
                if(status.status === 200){
                    setCurrentLevel(1);
                    setDeleteData({});
                    setReload(!reload);
                }
            }catch (error) {
                console.log(error);
            }
        }
    }

    function levelBomList(data, productId, level){
        let display = false;
        if(level ===2) {
            display = secondBlock.includes(productId);
        }else if(level === 3){
            display = thirdBlock.includes(productId);
        }
        if(data !== undefined){
            return data.map((item, index) => {
                if(display){
                    return(
                        <>
                            <Table className="user-table table-striped">
                            <thead> 
                                {item.level === 2 ?(
                                    <tr>
                                        <div className='bomTitle'>
                                            <th className="border-bottom">二階產品代碼</th>
                                            <th className="border-bottom">二階產品名稱</th>
                                            <th className="border-bottom">用量（至多小數三位）</th>
                                            <th className="border-bottom">單價</th>
                                            <th className="border-bottom">總價</th>
                                        </div>
                                        <th className="border-bottom">選項</th>
                                    </tr>
                                ) : (
                                    <tr>
                                        <div className='bomContent'>
                                            <th className="border-bottom">三階產品代碼</th>
                                            <th className="border-bottom">用量（至多小數三位）</th>
                                            <th className="border-bottom">單價</th>
                                            <th className="border-bottom">總價</th>
                                        </div>
                                        <th className="border-bottom">選項</th>
                                    </tr>
                                )}
                            </thead>
                            <tbody>
                                <React.Fragment key={item.product_id}>
                                    <tr>
                                        <div className='bomContent' onClick={() =>{
                                            let displayArr = [...thirdBlock];
                                            let rmIndex = displayArr.indexOf(item.product_id);
                                                if(rmIndex !== -1){
                                                    displayArr.splice(rmIndex, 1);
                                                }else{
                                                    displayArr.push(item.product_id);
                                                }
                                            setThirdBlock(displayArr);
                                        }}>
                                            {item.level === 2 ? (
                                                <>
                                                <td>{item.product_sec_id}</td>
                                                <td>{item.product_sec_name}</td>
                                                </>
                                            ) : (<td>{item.product_thr_id}</td>) }
                                            
                                            <td>{item.useage.toFixed(3)}</td>
                                            <td>{item.unit_price.toFixed(2)}</td>
                                            <td>{item.total_price.toFixed(2)}</td>
                                        </div>
                                    <td>
                                        <Button variant="link" style={{zIndex:20}} onClick={() => {
                                            setCurrentLevel(item.level);
                                            setEditBlock(true); 
                                            if(item.level === 2){
                                                setEditData({
                                                    productFirstId: item.product_id,
                                                    productSecondId: item.product_sec_id,
                                                    productSecondName: item.product_sec_name,
                                                    updateUser: userName,
                                                    Num: item.useage,
                                                })
                                            }else{
                                                setEditData({
                                                    productFirstId: item.product_id,
                                                    productSecondId: item.product_sec_id,
                                                    productThirdId: item.product_thr_id,
                                                    updateUser: userName,
                                                    Num: item.useage,
                                                })
                                            }
                                        }}>
                                        <FontAwesomeIcon icon={faEdit} className="me-0.5" /> 
                                        </Button>
                                        <Button  variant="link" className="text-danger" 
                                        onClick={() => {
                                            setDeleteCheckFrom(true);
                                            if(item.level === 2){
                                                setCurrentLevel(item.level);
                                                setDeleteData({
                                                    productFirstId: item.product_id,
                                                    productSecondId: item.product_sec_id,
                                                    updateUser: userName,
                                                });
                                            }else{
                                                setCurrentLevel(item.level);
                                                setDeleteData({
                                                    productFirstId: item.product_id,
                                                    productSecondId: item.product_sec_id,
                                                    productThirdId: item.product_thr_id,
                                                    updateUser: userName,
                                                });
                                            }
                                        }}>
                                        <FontAwesomeIcon icon={faTrashAlt} className="me-0.5" /> 
                                        </Button>
                                        <Button variant="link" onClick={() => {
                                            setCurrentLevel(3);
                                            setProduct({
                                                product_id: item.product_id, 
                                                product_sec_id: item.product_sec_id,
                                                product_name: item.product_name});
                                            setAddModal(true);
                                        }}>
                                        <FontAwesomeIcon icon={faPlus} className="me-0.5" />
                                        </Button>
                                    </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="6">{thirdBlock.length !== 0 ? levelBomList(item.thirdData, item.product_id, 3) : null}</td>
                                    </tr>
                                </React.Fragment>
                            </tbody>
                            </Table>
                            <BomEditModal 
                            data={editData} 
                            editBlock={editBlock} 
                            setEditBlock={setEditBlock} 
                            level={currentLevel}
                            reload={reload}
                            setReload={setReload}
                            userName={userName} />
                        </>
                    )
                }
            })
        }
    }

    function bomDataLayout(data){
        console.log(secondSelectData)
        return data.map((item, index) => {
            return(
                <>
                <tbody key={item.product_id}>
                    <React.Fragment key={item.product_id}>
                            <tr className='bomTr'>
                                <div className='bomContent' onClick={() => {
                                    let displayArr = [...secondBlock];
                                    let rmIndex = displayArr.indexOf(item.product_id);
                                        if(rmIndex !== -1){
                                            displayArr.splice(rmIndex, 1);
                                        }else{
                                            displayArr.push(item.product_id);
                                        }
                                        setSecondBlock(displayArr);
                                    }
                                }>
                                    <td>{item.product_id}</td>
                                    <td>{item.product_name}</td>
                                    <td>{item.total_price.toFixed(2)}</td>
                                </div>
                                <td>
                                    <Button  variant = "link" className="text-danger" 
                                    onClick={() => {
                                        setCurrentLevel(1);
                                        setDeleteData({
                                            productFirstId: item.product_id
                                        });
                                        setDeleteCheckFrom(true);
                                    }}>
                                        <FontAwesomeIcon icon={faTrashAlt} className="me-0.5" /> 
                                    </Button>
                                    <Button variant="link" 
                                        onClick={() => {
                                            setCurrentLevel(2);
                                            setProduct({product_id: item.product_id, product_name: item.product_name});
                                            setAddModal(true);
                                            }}>
                                            <FontAwesomeIcon icon={faPlus} className="me-1" />
                                            新增下一階產品
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="4">{levelBomList(item.secondData, item.product_id, 2)}</td>
                            </tr>
                        </React.Fragment>
                </tbody>
                <AddBOMModal2
                    addModal={addModal}
                    setAddModal={setAddModal}
                    product_in ={product}
                    levelNum={currentLevel}
                    reload={reload}
                    setReload={setReload}
                    secondSelectData={secondSelectData}
                    thirdSelectData={thirdSelectData}
                    userName={userName}
                />
                </>
            )
        })
    }

    if(data.length === 0){
        if(dataStatus === 0){
            return (
            <div>
                <p className='bomNoData'>無刪除紀錄</p>
            </div>
            )
        }else{
            return <p className='bomNoData'>無 BOM 表資料</p>
        }
    }else{
        return(
            <>  
                <Modal show={deleteCheckFrom} onHide={() => setDeleteCheckFrom(false)}>
                    <Modal.Body>確認刪除此筆資料嗎？</Modal.Body>
                    <Modal.Footer>
                    <Button variant="danger" 
                    onClick={() => {
                        setCurrentLevel(1);
                        setDeleteData({});
                        setDeleteCheckFrom(false);
                    }}>
                        取消
                    </Button>
                    <Button variant="primary" 
                    onClick={() => {
                        deleteBomData(deleteData, currentLevel);
                        setDeleteCheckFrom(false);
                    }}>
                        確認
                    </Button>
                    </Modal.Footer>
                </Modal>
                {bomDataLayout(data)}
            </>
        )
    }
}

export default BomList;