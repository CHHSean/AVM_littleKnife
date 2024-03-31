import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileAlt, faUpload } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Form, Button, ButtonGroup, Nav, Tab, Dropdown } from '@themesberg/react-bootstrap';
import axios from "axios";
import Select from 'react-select';
import { useChat } from "../api/context";
import moment from "moment";
import ExcelJs from "exceljs";
import {TransactionTable} from "../components/TransactionTable";
import '../App.css';
var xlsx = require("xlsx");

function Transactions(){
  const userInformation = JSON.parse(localStorage.getItem('data'));
  const userName = userInformation.Username;
  const valTar = ["原料", "產品", "顧客", "部門"];
  const {val, setVal, sendValue, signIn, userData} = useChat();
  const [valueResult, setValueResult] = useState([]);
  const instance = axios.create({baseURL:'http://127.0.0.1:5000/api/avm'});
  const [type, setType] = useState("選擇價值標的種類");
  const [selectedFile, setSelectedFile] = useState(null);
  const [accountData, setAccountData] = useState([]);
  const [thirdAccountData, setThirdAccountData] = useState([]);
  const [fourthAccountData, setFourthAccountData] = useState([]);
  const [searchInd3, setSearchInd3] = useState("");
  const [searchInd4, setSearchInd4] = useState([]);
  const [searchIndV, setSearchIndV] = useState("");
  const [searchIndS, setSearchIndS] = useState("");
  const [searchInd, setSearchInd] = useState("");
  const [transactionResult, setTransactionResult] = useState([]);
  const [supplierResult, setSupplierResult] = useState([]);
  const [salesData, setSalesData] = useState({
    fourthAccountCode: "",
    fourth:"選擇四階會計科目",
    date: moment(new Date()).format('YYYY-MM-DDTHH:mm'),
    quantity: "",
    price: "",
    unit:"",
    comment: "",
    target_num:"",
    target_name:"選擇價值標的",
    supplier_num:"",
    supplier_name:"選擇供應商",
  });
  const [deleteInd, setDeleteInd] = useState(false);
  const [salesList, setSalesList] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    async function getSalesData(){
      await instance.get('/sel_sales')
      .then((res) => {
        setSalesList(res.data)
      })
      .catch(((e) => {
        console.log(e)
      }))
    }
    getSalesData();
  },[reload]);

  useEffect(() => {
    async function getAccount(){
      await instance.get('/sel_account_subjects1')
      .then((res) => {
        if(res.data !== undefined){
          if(res.data.length !== 0){
            setAccountData(res.data);
            let thirdAccountArr = [];
            for(let a=0; a<res.data.length; a++){
              thirdAccountArr.push({
                label: res.data[a]['third'] + res.data[a]['third_subjects_cn'], 
                value: res.data[a]['third'] + res.data[a]['third_subjects_cn'],
                third:res.data[a]['third'],
                thirdSubjects_C: res.data[a]['third_subjects_cn'],
                thirdSubjects_E: res.data[a]['third_subjects_eng']
              })
            }
            setThirdAccountData(thirdAccountArr);
          }
        }
      })
      .catch(((e) => {
        console.log(e)
      }))
    }
    getAccount();
  },[])

  useEffect(() => {
    let foundData = accountData.find(item => item.third == searchInd3.third);
    if (foundData) {
      let fourthData = foundData.fourthData;
      let fourthAccountArr = [];
      for(let i=0; i < fourthData.length; i++){
        fourthAccountArr.push({
          label: fourthData[i]['fourth'] + fourthData[i]['fourth_subjects_cn'], 
          value: fourthData[i]['fourth'] + fourthData[i]['fourth_subjects_cn'],
          fourth:fourthData[i]['fourth'],
          fourthSubjects_C: fourthData[i]['fourth_subjects_cn'],
          fourthSubjects_E: fourthData[i]['fourth_subjects_eng']
        })
      }
      setFourthAccountData(fourthAccountArr);
    }
  },[searchInd3])

  const handleSalesChange = (e) => {
    const { name, value } = e.target;
    setSalesData({
      ...salesData,
      [name]: value,
    });
  };

  const handleViewSupplier= async () => {
    const sup = await instance.get('/sel_supplier')
    setSupplierResult(sup.data);
  }

  const handleViewValueTarget= async () => {
    if(type === "選擇價值標的種類"){
      alert("尚未選擇價值標的種類")
    }
    else{
      switch(type){
        case "原料":{
          const resM = await instance.get('/sel_value_target_material1')
          setValueResult(resM.data)
          break;
        }
        case "顧客":{
          const resC = await instance.get('/sel_value_target_customer1')
          setValueResult(resC.data)
          break;
        }
        case "產品":{
          const resP = await instance.get('/sel_value_target_product1')
          setValueResult(resP.data)
          break;
        }
        case "部門":{
          const resD = await instance.get('/sel_value_target_department1')
          setValueResult(resD.data)
          break;
        }
        default:
          break;
        }
    }
  }

  const onHandleAccountDownload = async () => {
    const bom = new ExcelJs.Workbook();
    const sheet = bom.addWorksheet('財會系統');

    // 列名稱
    const columnNames = [
      '三階科目代碼',
      '四階科目代碼',
      '標的種類',
      '標的代碼',
      '標的名稱',
      '數量',
      '單價',
      '總價',
      '單號',
      '備註'
    ];

    const columnsContent = [
      ['411', '4111', '產品', 'A01', '產品A', 2, 10, 20, '20240229091901', ''],
      ['461', '4611', '顧客', 'C01', '顧客A', 1, 1000, 1000, '20240229091902', '-'],
      ['512', '5121', '原料', 'P01', '原料A', 8, 12, 96, '20240229091903', '']
    ];

    // 將列名稱添加到工作表
    sheet.addRow(columnNames);

    columnsContent.forEach(row => {
      sheet.addRow(row); 
    });

    // 將 Excel 數據寫入緩衝區
    const content = await bom.xlsx.writeBuffer();

    // 創建下載連結
    const link = document.createElement('a');
    const blobData = new Blob([content], {
      type: 'application/vnd.ms-excel;charset=utf-8;'
    });

    // 設置連結的屬性並觸發點擊事件
    link.download = '財會系統.xlsx';
    link.href = URL.createObjectURL(blobData);
    link.click();
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

          const keyMapping = {
            三階科目代碼: 'thirdId',
            四階科目代碼: 'fourthId',
            標的種類: 'valueTarget',
            標的代碼: 'targetNum',
            標的名稱: 'targetName',
            數量: 'amount',
            單價: 'unitPrice',
            總價: 'totalPrice',
            單號: 'order_number',
            備註: 'remark'
          };

          const updatedArray = rows.map(obj => {
            return Object.fromEntries(
              Object.entries(obj).map(([key, value]) => [keyMapping[key] || key, value])
            );
          });

          await instance.post('/upload_sales', updatedArray)
          .then((res) => {
            console.log(res.data)
            if(res.data.message){
              setReload(!reload);
              alert('上傳成功');
            }else{
              alert(res.data.error);
            }
          })
          .catch((e) => { console.log(e)})
        } catch (e) {
          console.log("error", e);
        }
      };
    }else{
      alert('請選擇檔案');
    }
  }

  const handleSalesSubmit = async()=>{
    if(searchInd3 === "" || searchInd4.length === 0){
      alert("尚未選擇會計科目");
    }
    else{
      if(salesData.target_num ===""){
        alert("尚未選擇價值標的");
      } else{
        if(salesData.price === ""){
          alert("尚未填寫單價");
        } else if(salesData.unit === "" && type === "原料"){
          alert("尚未填寫單位");
        } else if(salesData.supplier_num === "" && type === "原料"){
          alert("尚未選擇供應商");
        } else if(salesData.quantity === ""){
          alert("尚未填寫數量");
        }else if(!Number.isInteger(Number(salesData.quantity))){
          alert("數量欄位須為正整數");
        } else if( Number(salesData.quantity) < 0){
          alert("數量不可小於零");
        } else{
          const currentDate = new Date();
          const tzOffset = +8;
          currentDate.setHours(currentDate.getHours() + tzOffset);
          const isoString = currentDate.toISOString().slice(0, 16);
          const saveDate = salesData.date ? salesData.date : isoString;
          let jsonData = {};
          if(type === '原料'){
            jsonData = {
              date: saveDate,
              accountSubjectsNum: searchInd4.fourth,
              purchaseId: salesData.target_num,
              purchaseName: salesData.target_name,
              purchaseQuantity: salesData.quantity,
              purchaseUnit: salesData.unit,
              purchaseUnitPrice: salesData.price,
              purchasePrice: parseInt(salesData.price) * parseInt(salesData.quantity),
              supplierNum: salesData.supplier_num + salesData.supplier_name,
              orderNumber: salesData.orderNum,
              remark: salesData.comment,
              createUser: userName
            }
            await instance.post('/add_purchase', jsonData)
            .then((res) => {
              console.log(res)
              if(res.status == 200 && res.data.message == 2){
                alert("新增成功");
                setReload(!reload);
                setSalesData({
                  fourthAccountCode: "",
                  fourth:"選擇四階會計科目",
                  date: moment(new Date()).format('YYYY-MM-DDTHH:mm'),
                  quantity: "",
                  price: "",
                  unit:"",
                  comment: "",
                  target_num:"",
                  target_name:"選擇價值標的",
                  supplier_num:"",
                  supplier_name:"選擇供應商",
                  orderNum: '',
                });
                setType("選擇價值標的種類");
                setSearchInd3("");
                setSearchInd4([]);
                setSearchIndV("");
                setSearchIndS("");
              }
              
            })
            .catch((e) => {console.log(e)})
          }else{
            let comment = salesData.comment === '' ? null : salesData.comment;
            jsonData = {
              date: saveDate,
              thirdId: searchInd3.third,
              fourthId: searchInd4.fourth,
              valueTarget: type,
              targetNum: salesData.target_num,
              targetName: salesData.target_name,
              amount: parseInt(salesData.quantity),
              unitPrice: parseInt(salesData.price),
              totalPrice: parseInt(salesData.price) * parseInt(salesData.quantity),
              orderNumber: salesData.orderNum,
              remark: comment,
              createUser: userName
            };
            await instance.post('/add_sales', jsonData)
            .then((res) => {
              if(res.status == 200 && res.data.message == 3){
                alert("新增成功");
                setReload(!reload);
                setSalesData({
                  fourthAccountCode: "",
                  quantity: "",
                  price: "",
                  unit:'',
                  comment: "",
                  target_num:"",
                  target_name:"選擇價值標的",
                  fourth:"選擇四階會計科目代碼",
                  supplier_num:"",
                  supplier_name:"選擇供應商",
                  orderNum: ''
                });
                setType("選擇價值標的種類");
                setSearchInd3("");
                setSearchInd4([]);
                setSearchIndV("");
                setSearchIndS("");
              }
              
            })
            .catch((e) => {console.log(e)})
          }
        }
      }
    }
  }
  
  const handleViewTransaction= async () => {
    setTransactionResult(await instance.get('/sel_transaction'));
  }

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-3">
        <h2 className="fw-bold">
          財會系統
        </h2>
      </div>
      <Tab.Container className = "overflow-auto" style = {{backGroundColor:"red"}} defaultActiveKey="add">
        <Row>
          <Col xs={20} xl={10} style={{width: '120%'}}>
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="add" >單筆新增</Nav.Link>
              </Nav.Item>
              <Nav.Item onClick={handleViewTransaction}>
                <Nav.Link eventKey="browse">瀏覽</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="upload">上傳</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content >
              <Tab.Pane eventKey="add" > 
                <Form >
                    <Form.Group controlId="date">
                      <Form.Label>日期</Form.Label>
                      <Form.Control
                        type='datetime-local'
                        name="date"
                        step="1"
                        value={salesData.date}
                        placeholder={salesData.date}
                        onBlur={handleSalesChange}
                        onChange={handleSalesChange}
                      />
                    </Form.Group>
                    <br></br>
                    <Form.Group controlId="valueTargetName">
                      <Form.Label>會計科目</Form.Label>
                      <br></br>
                        <div className="transactions_select_block">
                          <div className="transactions_select">
                            <Select options={thirdAccountData} value={searchInd3} onChange={(e) => {setSearchInd3(e);setSearchInd4([]);}} />
                          </div>
                        {
                          searchInd3 ? (
                          <div className="transactions_select">
                            <Select options={fourthAccountData} value={searchInd4} onChange={(e) => {setSearchInd4(e);}} />
                          </div>) : null
                        }
                      </div>
                    </Form.Group>
                    <br></br>
                    <Form.Group controlId="openingQuantity">
                      <Form.Label>數量</Form.Label>
                      <Form.Control
                        type="number"
                        name="quantity"
                        value={salesData.quantity}
                        placeholder={salesData.quantity}
                        onChange={handleSalesChange}
                        required
                      />
                    </Form.Group>
                    <br></br>
                    <Form.Group controlId="openingQuantity">
                      <Form.Label>單價（新台幣）</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={salesData.price}
                        placeholder={salesData.price}
                        onChange={handleSalesChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="openingQuantity">
                      {(Number(salesData.quantity)>0)?<p style={{fontSize: 18}}><b>總價: {Number(salesData.price)*Number(salesData.quantity)}</b></p>:<p style={{fontSize: 17}}>總價:</p>}
                    </Form.Group>
                    <Form.Group controlId="valueTargetCode">
                      <Form.Label>價值標的</Form.Label>
                      <br></br>
                      <Dropdown className = "btn-group dropleft"id = "dropdown-button-drop-start" as={ButtonGroup}>
                        <Dropdown.Toggle as={Button} split variant="link"  className="text-dark m-0 p-0" style ={{color :"red"}}>
                          <Button variant="outline-primary" >{type}</Button>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {valTar.map(v => {
                            return (
                              <Dropdown.Item onClick={() => {setType(v)}} >
                              <div className = "me-2">{v} </div>
                            </Dropdown.Item>
                            )
                          })}
                        </Dropdown.Menu>
                      </Dropdown>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      {type ==="選擇價值標的種類"?
                        null
                        :
                        <Dropdown className = "btn-group dropleft"id = "dropdown-button-drop-start" as={ButtonGroup}>
                          <Dropdown.Toggle as={Button} split variant="link"  className="text-dark m-0 p-0" style ={{color :"red"}}>
                            <Button variant="outline-primary" onClick={handleViewValueTarget} >{salesData.target_num} {salesData.target_name}</Button>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {typeof(valueResult) ==="undefined"? null : 
                            <>
                              <Form className="mx-3 my-2 w-auto"  >
                                <Form.Control
                                  type="search"
                                  placeholder="搜尋價值標的"
                                  className="me-2"
                                  aria-label="Search"
                                  onChange={(e) => {setSearchIndV(e.target.value);}}
                                  value={searchIndV}
                                />
                              </Form>
                              {valueResult.filter(value => (value.category===type)&&(value.target_status === 1)&&((String(value.target_num).includes(searchIndV))||(String(value.target_name).includes(searchIndV)))).map(value=> (
                                <Dropdown.Item onClick={()=> setSalesData({...salesData, target_num: value.target_num, target_name:value.target_name})}>
                                    <div className = "me-2">{value.target_num} {value.target_name}</div>
                                </Dropdown.Item>
                              ))}
                            </>
                            }
                          </Dropdown.Menu>
                        </Dropdown>
                      }
                    </Form.Group>
                    <br></br>
                    {type === "原料"? 
                    <>
                      <Form.Group controlId="openingQuantity">
                        <Form.Label>單位</Form.Label>
                        <Form.Control
                          type="text"
                          name="unit"
                          value={salesData.unit}
                          placeholder={salesData.unit}
                          onChange={handleSalesChange}
                          required
                        />
                      </Form.Group>
                      <br></br>
                      <Form.Group controlId="valueTargetName">
                        <Form.Label>供應商</Form.Label> 
                        <br></br>
                        <Dropdown className = "btn-group dropleft"id = "dropdown-button-drop-start" as={ButtonGroup}>
                          <Dropdown.Toggle as={Button} split variant="link"  className="text-dark m-0 p-0" style ={{color :"red"}}>
                            <Button variant="outline-primary" onClick={handleViewSupplier}>{salesData.supplier_num} {salesData.supplier_name}</Button>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                          {supplierResult.length === 0? null:
                          <>
                           <Form className="mx-3 my-2 w-auto"  >
                              <Form.Control
                                type="search"
                                placeholder="搜尋供應商"
                                className="me-2"
                                aria-label="Search"
                                onChange={(e) => {setSearchIndS(e.target.value);}}
                                value={searchIndS}
                              />
                            </Form>
                            {supplierResult.filter(sup => sup.status === 1 && (String(sup.supplier_num).includes(searchIndS)||String(sup.supplier_name).includes(searchIndS))).map(t => 
                              <Dropdown.Item onClick={() => setSalesData({...salesData, supplier_num : t.supplier_num, supplier_name : t.supplier_name})}>
                                  <div className = "me-2">{t.supplier_num} {t.supplier_name}</div>
                              </Dropdown.Item>)}
                          </>
                          }
                          </Dropdown.Menu>
                        </Dropdown>
                      </Form.Group>
                    </>
                      :
                      null}
                    <br></br>
                    <Form.Group controlId="orderNum">
                      <Form.Label>單號</Form.Label>
                      <Form.Control
                        type="text"
                        name="orderNum"
                        value={salesData.orderNum}
                        onChange={handleSalesChange}
                      />
                    </Form.Group>
                    <br></br>
                    <Form.Group controlId="comment">
                      <Form.Label>備註</Form.Label>
                      <Form.Control
                        type="text"
                        name="comment"
                        value={salesData.comment}
                        placeholder={salesData.comment}
                        onChange={handleSalesChange}
                        required
                      />
                    </Form.Group>
                  </Form>
                  <row>
                    <br></br>
                    <Button type="submit" variant="primary" onClick={handleSalesSubmit}>
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
              <Tab.Pane eventKey="browse">
              <div className="d-flex flex-wrap flex-md-nowrap justify-content-between align-items-center py-3">
                <Form className="d-flex me-2"  >
                  <Form.Control
                    type="search"
                    placeholder="搜尋"
                    className="me-2"
                    aria-label="Search"
                    onChange={(e) => {setSearchInd(e.target.value);}}
                    value={searchInd}
                  />
                </Form>
                {/* <Button icon={faFileAlt} className="me-2" variant="primary" onClick={() => {setDeleteInd(!deleteInd);}}>
                  <FontAwesomeIcon className="me-2" />瀏覽未顯示交易
                </Button> */}
              </div>
              <TransactionTable transaction={salesList} account={accountData} supplie ={supplierResult} searchInd={searchInd} deleteInd ={deleteInd}/>
            </Tab.Pane>
            </Tab.Content >
          </Col>
        </Row>
      </Tab.Container>
    </>
  );
}
export default Transactions;
