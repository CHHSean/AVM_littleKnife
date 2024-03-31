import React,{ useState, useEffect} from "react";
import { Modal, Button } from '@themesberg/react-bootstrap';
import axios from "axios";
import '../App.css';

function DeleteModal({ deleteModalBlock, setDeleteModalBlock, data, type, detailType, reload, setReload }){
    const instance = axios.create({baseURL:'http://127.0.0.1:5000/api/avm'});
    const [deleteArr, setDeleteArr] = useState([]);
    const [page, setPage] = useState(1);
    const [filterData, setFilterData] = useState(data);

    function editSuccess(){
        setReload(!reload);
        setDeleteModalBlock(false);
        setDeleteArr([]);
        setPage(1);
        alert('刪除成功');
    }

    async function editStatus(){
        switch (type) {
            case "供應商":{
                await instance.put('/edit_allStatus', {'data': deleteArr, 'type': 'supplier', 'detailType': null})
                .then((res) => {
                    if(res.data === '更新成功'){
                        editSuccess();
                    }
                })
                .catch(function (error) {
                    alert('上傳失敗，請重新上傳');
                    console.error('上傳失敗', error);
                });
              break;
            }
            case '價值標的':{
                await instance.put('/edit_allStatus', {'data': deleteArr, 'type': 'target', 'detailType': detailType})
                .then((res) => {
                    if(res.data === '更新成功'){
                        editSuccess();
                    }
                })
                .catch(function (error) {
                    alert('上傳失敗，請重新上傳');
                    console.error('上傳失敗', error);
                });
                break;
            }
            case '期初庫存':{
                await instance.post('/deleteInventory', deleteArr)
                .then((res) => {
                    if(res.data === '批次刪除成功'){
                        editSuccess();
                    }
                })
                .catch(function (error) {
                    alert('上傳失敗，請重新上傳');
                    console.error('上傳失敗', error);
                });
                break;
            }

            default: {
              break;
            }
              
        }
       
    }

    function listLayout(){
        return filterData.map((item, index) => {
            const indexToRemove = deleteArr.findIndex(deleteItem => deleteItem.num === item.num && deleteItem.name === item.name);
            return(
                <div key={index} className="d-flex justify-content-center align-items-center supplierBlock">
                    <input type="checkbox" checked={indexToRemove !== -1 ? true : false} className="supplierInput" 
                    onChange={(e) => {
                        let arr = [...deleteArr];
                        if(e.target.checked){
                            arr.push({num: item.num, name: item.name});
                            if(arr.length === data.length){
                                arr.push({num: 'A-1', name: 'All'});
                            }
                        }else{
                            arr.splice(indexToRemove, 1);
                            const indexToAllRemove = arr.findIndex(deleteItem => deleteItem.name === 'All');
                            if(indexToAllRemove !== -1){
                                arr.splice(indexToAllRemove, 1);
                            }
                        }
                        const uniqueSet = new Set(arr.map(item => JSON.stringify(item)));
                        arr = Array.from(uniqueSet).map(item => JSON.parse(item));
                        setDeleteArr(arr);
                    }} />
                    <p className="supplierText">{item.num} - {item.name}</p>
                </div>
            )
        })
    };

    function checkLayout(){
        return(
            <div>
                <p>確認刪除{deleteArr.length}筆資料嗎？</p>
                <p>⚠️刪除後，無法復原資料。</p>
            </div>
        )
    }
    
    return(
        <Modal size="lg" show={deleteModalBlock} onHide={() => {setDeleteModalBlock(false); setDeleteArr([])}}>
        <Modal.Header closeButton>
          <Modal.Title>{ type === '價值標的' ? (<>{type}-{detailType}批次刪除</>) : (<>{type}批次刪除</>)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {page === 1 ? (
            <div>
                <div className="deleteModal_search_block">
                    <input 
                    className="deleteModal_search" 
                    placeholder="Search..."
                    onChange={(e) => {
                        if(e.target.value !== undefined){
                            if(e.target.value.trim() !== ''){
                                let result = data.filter(item => {
                                    return item.num.includes(e.target.value) || item.name.includes(e.target.value);
                                });
                                setFilterData(result);
                            }else{
                                setFilterData(data);
                            }
                        }
                        
                    }} />
                </div>
                <div className="d-flex justify-content-center align-items-center supplierBlock">
                    <input type="checkbox" checked={deleteArr.findIndex(deleteItem => deleteItem.name === 'All') !== -1 ? true : false} className="supplierInput" 
                    onChange={(e) => {
                        let arr = [...deleteArr];
                        if(e.target.checked){
                            for(let i=0; i<data.length; i++){
                                arr.push({num: data[i]['num'], name: data[i]['name']});
                            }
                            arr.push({num: 'A-1', name: 'All'});
                        }else{
                            arr = [];
                        }

                        const uniqueSet = new Set(arr.map(item => JSON.stringify(item)));
                        arr = Array.from(uniqueSet).map(item => JSON.parse(item));
                        setDeleteArr(arr);
                    }} />
                    <p className="supplierText">全選</p>
                </div>
                {listLayout()}
            </div>) : (
            <div>
                {checkLayout()}
            </div>)}
        </Modal.Body>
        <Modal.Footer>
            {page === 2 ? (
                <Button variant="secondary" onClick={() => {setPage(1);}}>
                    上一頁
                </Button>
            ) : null}
          <Button variant="secondary" onClick={() => {
            setPage(1);
            setDeleteModalBlock(false); 
            setDeleteArr([]);}}>
            取消
          </Button>
          <Button variant="primary" 
          onClick={() => {
            if(page === 1){
                setPage(2);
            }else{
                editStatus();
            }
          }}>
            確定
          </Button>
        </Modal.Footer>
      </Modal>
    )
}

export default DeleteModal;