import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faDownload, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Form, Button, ButtonGroup,Nav, Tab, Dropdown } from '@themesberg/react-bootstrap';
import axios from "axios";
import moment from "moment";
import accRows from "./data/accountData"
import { useChat } from "../api/context";
import ExcelJs from "exceljs";
var xlsx = require("xlsx")

function Purchase(){
  const {val, setVal, sendValue, signIn, suppliers, userData} = useChat();
  const [formType, setFormType] = useState("text")
  const [selectedFile, setSelectedFile] = useState(null);
  const instance = axios.create({baseURL:'http://127.0.0.1:5000/api/avm'});
  const [supplierResult, setSupplierResult] = useState([]);
  const [supplier, setSupplier] = useState({supNum:"", supName:"選擇供應商"})
  const [material, setMaterial] = useState([])

  const [inventoryData, setInventoryData] = useState({
    supplier: "選擇供應商",
    date: moment(new Date()).format('MM/DD/YYYY'),
    material_id:"",
    material_name:"選擇原料",
    quantity: "",
    price: "",
    comment: "",
    unit:"",
  });

  const handleInventoryChange = (e) => {
    const { name, value } = e.target;
    setInventoryData({
      ...inventoryData,
      [name]: value,
    });
  };

  const handleViewSupplier= async () => {
    const sup = await instance.get('/sel_supplier');
    setSupplierResult(sup.data);
  }
  const SupplierRow = (props) => {
    return (
      <Dropdown.Item onClick={() => setSupplier({supNum : props.supplier_num, supName : props.supplier_name})}>
        <div className = "me-2">{props.supplier_num} {props.supplier_name}</div>
      </Dropdown.Item>
    );
  }

  const handleExcelUploadSubmit = async () => {
    if (selectedFile) {
      const fileReader = new FileReader();
      fileReader.readAsBinaryString(selectedFile);
      fileReader.onload = async (event) => {
        try {
          const { result } = event.target;
          const workbook = xlsx.read(result, { type: "binary" });
          const rows = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
          await instance.post('/upload',rows);
          alert('上傳成功');
        } catch (e) {
          console.log("error", e);
        }
      };
    }
  }

  const handleGetMaterial = async() =>{
    const resM = await instance.get('/sel_value_target_material');
    setMaterial(resM.data);
  }

  const onHandleAccountDownload = async () => {
    const workbook = new ExcelJs.Workbook(); // 創建試算表檔案
    const sheet = workbook.addWorksheet('進貨'); //在檔案中新增工作表 參數放自訂名稱

		sheet.addTable({ // 在工作表裡面指定位置、格式並用columsn與rows屬性填寫內容
	    name: 'table名稱',  // 表格內看不到的，讓你之後想要針對這個table去做額外設定的時候，可以指定到這個table
	    ref: 'A1', // 從A1開始
	    columns: [{ name: '三階代碼' },
        { name: '三階中文名' },
        { name: '三階英文名' },
        { name: '四階代碼' },
        { name: '四階中文名' },
        { name: '四階英文名' }
    ],
	    rows: accRows,
		});

    // 表格裡面的資料都填寫完成之後，訂出下載的callback function
		// 異步的等待他處理完之後，創建url與連結，觸發下載
	  workbook.xlsx.writeBuffer().then((content) => {
		  const link = document.createElement("a");
	    const blobData = new Blob([content], {
	      type: "application/vnd.ms-excel;charset=utf-8;"
	    });
	    link.download = '進貨.xlsx';
	    link.href = URL.createObjectURL(blobData);
	    link.click();
	  });
  }

  const handleInventorySubmit = async()=>{
    inventoryData.supplier = supplier.supNum
    if(inventoryData.supplier ===""){
        alert("尚未選擇供應商");
    }
    else{
      if(inventoryData.material_name ==="" || inventoryData.material_id === ""){
        alert("尚未選擇原料");
      }
      else{
        if(Number(inventoryData.price) < 0 || Number(inventoryData.quantity) < 0){
          alert("數量或單價不可小於零");
        }
        else{
          if(Number(inventoryData.price)% 1 !== 0|| Number(inventoryData.quantity)% 1 !== 0)
          {
            alert("數量或單價不可有小數點");
          }
          else{
            const jsonData = {
              date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
              account_subjects_num: "4111",
              purchaseId: `${inventoryData.material_id}`,
              purchaseName: `${inventoryData.material_name}`,
              purchaseQuantity: `${inventoryData.quantity}`,
              purchase_unit: `${inventoryData.unit}`,
              purchasePrice: `${inventoryData.price}`,
              remark:`${inventoryData.comment}`,
              createUser:userData.Username,
              supplierNum:`${inventoryData.supplier}`,
            };
            await instance.post('/add_purchase', jsonData);
            alert("已新增存貨資料");
            setInventoryData({
              date: moment(new Date()).format('MM/DD/YYYY'),
              quantity: "",
              price: "",
              comment: "",
              unit:"",
              material_num:"",
              supplier: "",
              material_name:"選擇原料",
            });
            setMaterial([]);
            setSupplier({supNum:"", supName:"選擇供應商"});
          }
        }
      }  
    }
  }
  
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-3">
        <h2 className="fw-bold">
          進貨
        </h2>
      </div>
      <Tab.Container className = "overflow-auto" style = {{backGroundColor:"red"}} defaultActiveKey="upload">
        <Row>
          <Col xs={20} xl={10}>
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="upload">上傳</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="add" >單筆新增</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content >
              <Tab.Pane eventKey="add" > 
                <Form >
                  <br></br>
                  <Form.Group controlId="date">
                    <Form.Label>進貨日期</Form.Label>
                    <Form.Control
                      type={formType}
                      name="date"
                      value={inventoryData.date}
                      placeholder={inventoryData.date}
                      onChange={handleInventoryChange}
                      onClick={() => {setFormType("date");}}
                    />
                  </Form.Group>
                  <br></br>
                  <Form.Group controlId="valueTargetName">
                    <Form.Label>供應商</Form.Label> 
                    <br></br>
                    <Dropdown className = "btn-group dropleft"id = "dropdown-button-drop-start" as={ButtonGroup}>
                      <Dropdown.Toggle as={Button} split variant="link"  className="text-dark m-0 p-0" style ={{color :"red"}}>
                        <Button variant="outline-primary" onClick={handleViewSupplier}>{supplier.supNum} {supplier.supName}</Button>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                      {supplierResult.length === 0 ? null : supplierResult.map(t => <SupplierRow  {...t} />)}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Group>
                  <br></br>
                  <Form.Group controlId="valueTargetName">
                    <Form.Label>原料名稱</Form.Label>
                    <br></br>
                    <Dropdown className = "btn-group dropleft"id = "dropdown-button-drop-start" as={ButtonGroup}>
                      <Dropdown.Toggle as={Button} split variant="link"  className="text-dark m-0 p-0" style ={{color :"red"}}>
                        <Button variant="outline-primary" onClick ={handleGetMaterial} >{inventoryData.material_id} {inventoryData.material_name}</Button>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                      {material.length === 0?null:material.map(t =>  
                        <Dropdown.Item onClick={()=> setInventoryData({...inventoryData, material_id : t.target_num, material_name :t.target_name })}>
                            <div className = "me-2">{t.target_num} {t.target_name}</div>
                        </Dropdown.Item>)
                      }
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Group>
                  <br></br>
                  <Form.Group controlId="openingQuantity">
                    <Form.Label>數量</Form.Label>
                    <Form.Control
                      type="number"
                      name="quantity"
                      value={inventoryData.quantity}
                      placeholder={inventoryData.quantity}
                      onChange={handleInventoryChange}
                      required
                    />
                  </Form.Group>
                  <br></br>
                  <Form.Group controlId="openingQuantity">
                    <Form.Label>單價</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={inventoryData.price}
                      placeholder={inventoryData.price}
                      onChange={handleInventoryChange}
                      required
                    />
                  </Form.Group>
                  <br></br>
                  <Form.Group controlId="openingQuantity">
                    <Form.Label>單位</Form.Label>
                    <Form.Control
                      type="text"
                      name="unit"
                      value={inventoryData.unit}
                      placeholder={inventoryData.unit}
                      onChange={handleInventoryChange}
                      required
                    />
                  </Form.Group>
                  <br></br>
                  <Form.Group controlId="openingQuantity">
                    {((Number(inventoryData.price)>0)&&(Number(inventoryData.quantity)>0))?<p style={{fontSize: 18}}><b>總價: {Number(inventoryData.price)*Number(inventoryData.quantity)}</b></p>:<p style={{fontSize: 17}}>總價:</p  >}
                  </Form.Group>
                  <br></br>
                  <Form.Group controlId="comment">
                      <Form.Label>備註</Form.Label>
                      <Form.Control
                        type="text"
                        name="comment"
                        value={inventoryData.comment}
                        placeholder={inventoryData.comment}
                        onChange={handleInventoryChange}
                        required
                      />
                    </Form.Group>
                </Form>
                <row>
                  <br></br>
                  <Button type="submit" variant="primary" onClick={handleInventorySubmit}>
                    儲存
                  </Button>
                </row> 
              </Tab.Pane>
              <Tab.Pane eventKey="upload">
                <br></br>
                <div className="d-flex justify-content-center align-items-center mb-3">
                  <Col xs={0} xl={0}>
                    <Form.Group>
                      <Form.Label>上傳excel</Form.Label>
                      <Form.Control type="file" accept=".xlsx,.xls" onChange={(e) => {setSelectedFile(e.target.files[0]);}} />
                    </Form.Group>
                  </Col>
                </div>
                <div className="d-flex justify-content-center align-items-center mb-3">
                <Col xs={0} xl={0}>
                <Button icon={faFileAlt} id = "download" className="me-2" variant="primary" onClick={onHandleAccountDownload}>
                  <FontAwesomeIcon icon={faDownload} className="me-2" />
                  下載範例
                </Button>
                <Button icon={faFileAlt} className="me-2" variant="primary" onClick={handleExcelUploadSubmit}>
                    <FontAwesomeIcon icon={faUpload} className="me-2" />
                    上傳
                </Button>
                </Col>
                </div>
              </Tab.Pane>
            </Tab.Content >
          </Col>
        </Row>
      </Tab.Container>
    </>
  );
}

export default Purchase;