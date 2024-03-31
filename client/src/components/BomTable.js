import React, { useEffect, useState } from 'react';
import { Table , Card } from '@themesberg/react-bootstrap';
import axios from 'axios';
import BomList from './BomList';

function ProductTable({reload, setReload, status }) {
  const instance = axios.create({baseURL:'http://127.0.0.1:5000/api/avm'});
  const [addModal, setAddModal] = useState(false);
  const [editBlock, setEditBlock] = useState(false);
  const [editData, setEditData] = useState([]);
  const [getBomData, setGetBomData] = useState([]);

  useEffect(() =>{
    async function getBomData(){
      const data = await instance.get(`/get_bom${status}`);
      setGetBomData(data.data);
    }
    getBomData();
  },[reload, status]);
  
  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm">
    <Table className="user-table align-items-center table-striped">
      <thead>
        <tr>
          <div className='bomTitle'>
            <th className="border-bottom">產品代碼</th>
            <th className="border-bottom">產品名稱</th>
            <th className="border-bottom">產品成本</th>
          </div>
          <th className="border-bottom">選項</th>
        </tr>
      </thead>
      <BomList 
      data={getBomData}
      dataStatus={status}
      addModal={addModal}
      setAddModal={setAddModal} 
      editBlock={editBlock}
      setEditBlock={setEditBlock}
      editData={editData}
      setEditData={setEditData}
      reload={reload}
      setReload={setReload} />
    </Table>
  </Card>
  );
}

export default ProductTable;
