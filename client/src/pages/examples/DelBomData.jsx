
import React,{ useState, useEffect} from "react";
import axios from 'axios';
import { Card, Table } from '@themesberg/react-bootstrap';
import moment from "moment";

function DelBomData({search}){
    const instance = axios.create({baseURL:'http://127.0.0.1:5000/api/avm'});
    const [delDataDefault, setDelDataDefault] = useState([]);
    const [delData, setDelData] = useState([]);

    useEffect(() => {
        async function getBomDelData(){
            const data = await instance.get(`/get_del_bom`);
            setDelDataDefault(data.data);
            setDelData(data.data);
          }
          getBomDelData();
    },[])

    useEffect(() => {
        if(search.trim() !== ''){
            let filterArr = [];
            for (const acc of delDataDefault) {
                const shouldInclude = 
                    (acc.product_id !== null && acc.product_sec_id === null && acc.material_id === null && (
                        // 一階
                        acc.product_id.includes(search) ||
                        acc.del_level.toString().includes(search) ||
                        acc.del_user.includes(search)
                    )) || (acc.product_id !== null && acc.product_sec_id !== null && acc.material_id === null && (
                        // 二階
                        acc.product_id.includes(search) ||
                        acc.product_sec_id.includes(search) ||
                        acc.del_level.toString().includes(search) ||
                        acc.del_user.includes(search)
                    )) || (acc.product_id !== null && acc.product_sec_id !== null && acc.material_id !== null && (
                        // 三階
                        acc.product_id.includes(search) ||
                        acc.product_sec_id.includes(search) ||
                        acc.material_id.includes(search) ||
                        acc.del_level.toString().includes(search) ||
                        acc.del_user.includes(search)
                    ));
        
                if (shouldInclude) {
                    filterArr.push({
                        product_id: acc.product_id, 
                        product_sec_id: acc.product_sec_id, 
                        material_id: acc.material_id, 
                        del_level: acc.del_level, 
                        del_user: acc.del_user, 
                        del_time: acc.del_time
                    });
                }
            }
            setDelData(filterArr);
        }else{
            setDelData(delDataDefault);
        }
    },[search])
  
    function TableRow(){
        let data = search.trim() !== '' ? delData : delDataDefault;
        if(data.length !== 0){
            return data.map((item, index) => {
                return(
                    <tr>
                    <td>
                      <span className="fw-normal">
                        {item.product_id}
                      </span>
                    </td>
                    <td>
                      <span className="fw-normal">
                        {item.product_sec_id}
                      </span>
                    </td>
                   
                    <td>
                      <span className="fw-normal">
                        {item.material_id}
                      </span>
                    </td>
                    <td>
                      <span className="fw-normal">
                        {item.del_level}
                      </span>
                    </td>
                    <td>
                      <span className="fw-normal">
                        {item.del_user}
                      </span>
                    </td>
                    <td>
                      <span className="fw-normal">
                        {moment(item.del_time).format('YYYY-MM-DD HH:mm:ss')}
                      </span>
                    </td>
                  </tr>
                )
            })
        }
    }
  
    return (
      <Card border="light" className="table-wrapper table-responsive shadow-sm" style ={{width:"120%"}}>
        <Card.Body className="pt-0">
          <Table hover className="user-table align-items-center table-striped">
            <thead>
              <tr>
                <th className="border-bottom">第一階層之產品代碼</th>
                <th className="border-bottom">第二階層之產品代碼</th>
                <th className="border-bottom">第三階層之產品代碼</th>
                <th className="border-bottom">刪除階層</th>
                <th className="border-bottom">異動人員</th>
                <th className="border-bottom">異動時間</th>
              </tr>
            </thead>
            <tbody>
                {TableRow()}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
};

export default DelBomData;