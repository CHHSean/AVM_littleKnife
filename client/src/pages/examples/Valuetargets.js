import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileAlt, faPlus, faUpload } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Form, Tab ,Nav } from '@themesberg/react-bootstrap';
import ValuetargetsTable from "../../components/ValueTargetTable";
import ExcelJs from "exceljs";
import axios from "axios";
import ValueTargetFormModal from './ValueTargetAddModal';
import DeleteModal from "../../components/deleteModal";

function Valuetargets(){
  const valueTarg = ['原料', "顧客", "產品", "部門"];
  const instance = axios.create({baseURL:'http://127.0.0.1:5000/api/avm'});
  const [detailType, setDetailType] = useState(null);
  const [showValueTargetModal, setShowValueTargetModal] = useState(false);
  const [searchInd, setSearchInd] = useState("");
  const [valResult, setValResult] = useState([]);
  const [type, setType] = useState("");
  const [statues, setStates] = useState(1);
  const [searchPH, setSearchPH] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [deleteInd, setDeleteInd] = useState(false);
  const [reload, setReload] = useState(false);
  const [deleteModalBlock, setDeleteModalBlock] = useState(false);
  const [deleteList, setDeleteList] = useState([]);

  const handleExceldownload = async () => {
    const bom = new ExcelJs.Workbook();
    const sheet = bom.addWorksheet('價值標的');

    // 列名稱
    const columnNames = ['標的種類(只可填「顧客」、「原料」、「產品」或「部門」)', '標的代碼', '標的名稱'];

    const columnsContent = [
      ['顧客', 'C01', '顧客A'],
      ['原料', 'P01', '原料A'],
      ['產品', 'A01', '產品A'],
      ['部門', 'D01', '部門A'],
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
    link.download = '價值標的.xlsx';
    link.href = URL.createObjectURL(blobData);
    link.click();
  }

  const handleUpload = () => {
    if (!selectedFile) {
      alert('請選擇一個Excel檔案');
      return;
    }

    const formData = new FormData();
    formData.append('excelFile', selectedFile);
    
    instance.post('/upload_target', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((res) => {
      if(res.data.message === '上傳成功'){
        alert('上傳成功');
        setReload(!reload);
      }else{
        alert(res.data.message);
      }
    })
    .catch(function (error) {
        alert('上傳失敗，請重新上傳');
        console.error('上傳失敗', error);
    });
  };

  useEffect(() => {
    if(valResult.length !== 0){
      let list = [];
      for(let i=0; i<valResult.data.length; i++){
        if(valResult.data[i]['target_status'] !== 0){
          list.push({num: valResult.data[i]['target_num'], name: valResult.data[i]['target_name']});
        }
      }
      setDeleteList(list);
    }
  },[valResult]);

  useEffect(() => {
    async function getData(){
      switch(detailType){
        case "原料":{
          const result = await instance.get(`/sel_value_target_material${statues}`);
          setValResult(result);
          setType("原料")
          setSearchPH("搜尋原料");
          break;
        }
        case "顧客":{
          const result = await instance.get(`/sel_value_target_customer${statues}`);
          setValResult(result);
          setType("顧客");
          setSearchPH("搜尋顧客");
          break;
        }
        case "產品":{
          const result = await instance.get(`/sel_value_target_product${statues}`);
          setValResult(result);
          setSearchPH("搜尋產品");
          setType("產品");
          break;
        }
        case "部門":{
          const result = await instance.get(`/sel_value_target_department${statues}`);
          setValResult(result);
          setType("部門");
          setSearchPH("搜尋部門");
          break;
        }
        default:{
          break;
        }
      }
    }
    getData();
  },[detailType, statues, reload])

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-3">
        <h2 className="fw-bold">
          價值標的設定
        </h2>
      </div>
      <Tab.Container defaultActiveKey="upload">
        <Row>
          <Col xs={12} xl={10} style ={{width:"120%"}}>
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="upload">上傳</Nav.Link>
              </Nav.Item>
              {valueTarg.map((val)=>( 
                <Nav.Item onClick={() => {setDetailType(val);}}>
                  <Nav.Link eventKey={val}>{val}</Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="upload">
                <div className="d-flex justify-content-center align-items-center mb-3">
                  <Col xs={12} xl={5}>
                    <Form.Group>
                      <Form.Label>上傳excel</Form.Label>
                      <Form.Control type="file" accept=".xlsx,.xls" onChange={(e) => {setSelectedFile(e.target.files[0]);}} />
                    </Form.Group>
                  </Col>
                </div>
                <div className="d-flex justify-content-center align-items-center mb-3">
                <Col xs={12} xl={5}>
                <Button icon={faFileAlt} className="me-2" variant="primary" onClick={handleExceldownload}>
                  <FontAwesomeIcon icon={faDownload} className="me-2" />
                  下載範例
                </Button>
                <Button icon={faFileAlt} className="me-2" variant="primary" onClick={handleUpload}>
                    <FontAwesomeIcon icon={faUpload} className="me-2" />
                    上傳
                </Button>
                </Col>
                </div>
              </Tab.Pane>

              {valueTarg.map((val) =>(
                <Tab.Pane eventKey={val}>
                  <div className="d-flex flex-wrap flex-md-nowrap justify-content-between align-items-center py-3">
                    <Form className="d-flex me-2">
                      <Form.Control
                        type="search"
                        placeholder={searchPH} 
                        className="me-2"
                        aria-label="Search"
                        onChange={(e) => {setSearchInd(e.target.value)}}
                        value={searchInd}
                      />
                    </Form>
                    <div className="d-flex flex-wrap flex-md-nowrap justify-content-end align-items-center">
                      <Button icon={faFileAlt} className="me-2" variant="primary" 
                      onClick={() => {
                        setType(val);
                        setShowValueTargetModal(true);
                      }}>
                        <FontAwesomeIcon icon={faPlus} className="me-2" />單筆新增
                      </Button>
                      <Button icon={faFileAlt} className="me-2" variant="primary" 
                      onClick={() => {
                        setDeleteInd(!deleteInd);
                        if(deleteInd){
                          setStates(1);
                        }else{
                          setStates(0);
                        }
                      }}>
                        <FontAwesomeIcon  className="me-2" />
                        {deleteInd ? `查看顯示${type}` : `查看未顯示${type}`}
                      </Button>
                      <Button className="me-2" variant="primary" onClick={() => {setDeleteModalBlock(true);}}>
                        批次刪除
                      </Button>
                    </div>
                  </div>
                  <ValuetargetsTable valResult={valResult} type ={val} search={searchInd} deleteInd ={deleteInd} reload={reload} setReload={setReload} />
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
      <ValueTargetFormModal
        show={showValueTargetModal}
        setShow={setShowValueTargetModal}
        type={type}
        reload={reload}
        setReload={setReload}
      />
      <DeleteModal
      deleteModalBlock={deleteModalBlock}
      setDeleteModalBlock={setDeleteModalBlock}
      data={deleteList}
      type='價值標的'
      detailType={detailType}
      reload={reload}
      setReload={setReload} />
    </>
  );
}
export default Valuetargets;
