import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileAlt,  faPlus,  faUpload } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Form , Tab ,Nav } from '@themesberg/react-bootstrap';
import { SupplierTable } from "../../components/SupplierTable";
import ExcelJs from "exceljs";
import SupplierFormModal from './SupplierAddFormModal';
import { useChat } from "../../api/context";
import DeleteModal from "../../components/deleteModal";
var xlsx = require("xlsx");

function SupplierSettings(){
  const userData = JSON.parse(localStorage.getItem('data'));
  const userName = userData.Username;
  const [selectedFile, setSelectedFile] = useState(null);
  const {sup, setSup} = useChat();
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [result, setResult] = useState("");
  const instance = axios.create({baseURL:'http://127.0.0.1:5000/api/avm'});
  const [searchInd, setSearchInd] = useState("");
  const [deleteInd, setDeleteInd] = useState(false);
  const [reload, setReload] = useState(false);
  const [deleteModalBlock, setDeleteModalBlock] = useState(false);
  const [deleteList, setDeleteList] = useState([]);

  const handleUpload = () => {
    if (!selectedFile) {
      alert('請選擇一個Excel檔案');
      return;
    }else{
      const fileReader = new FileReader();
      fileReader.readAsBinaryString(selectedFile);
      fileReader.onload = async (event) => {
        try {
          const { result } = event.target;
          const workbook = xlsx.read(result, { type: "binary" });
          const rows = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            instance.post('/upload_supplier', { 'userName': userName, data: rows })
            .then((res) => {
                if(res.status == 200){
                  alert('上傳成功');
                  setReload(!reload);
                }
            })
            .catch(function (error) {
              alert('上傳失敗，請重新上傳');
              console.error('上傳失敗', error);
            });
        } catch (e) {
          console.log("error", e);
        }
      };
    }
  };

  const handleExceldownload = async () => {
    const bom = new ExcelJs.Workbook();
    const sheet = bom.addWorksheet('供應商');
    const columnNames = ['供應商代碼', '供應商名稱'];

    const columnsContent = [
      ['S001', '供應商1'],
      ['S002', '供應商2'],
      ['S003', '供應商3'],
    ];

    sheet.addRow(columnNames);

    columnsContent.forEach(row => {
      sheet.addRow(row); 
    });

    const content = await bom.xlsx.writeBuffer();
    const link = document.createElement('a');
    const blobData = new Blob([content], {
      type: 'application/vnd.ms-excel;charset=utf-8;'
    });
    link.download = '供應商.xlsx';
    link.href = URL.createObjectURL(blobData);
    link.click();
  }

  useEffect(()=>{
    async function getSupplier(){
      const result = await instance.get('/sel_supplier');
      let list = [];
      for(let i=0; i<result.data.length; i++){
        if(result.data[i]['status'] !== 0){
          list.push({num: result.data[i]['supplier_num'], name: result.data[i]['supplier_name']});
        }
      }
      setDeleteList(list);
      setResult(result);
      setSup(null);
    }
    getSupplier();
  },[sup, reload]);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-3">
        <h2 className="fw-bold">
          供應商基本資料設定
        </h2>
      </div>
      <Tab.Container defaultActiveKey="upload">
        <Row>
          <Col xs={12} xl={10} style ={{width:"120%"}}>
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="upload">上傳</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="browse">瀏覽</Nav.Link>
              </Nav.Item>
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
              <Tab.Pane eventKey="browse">
              <div className="d-flex flex-wrap flex-md-nowrap justify-content-between align-items-center py-3">
                <Form className="d-flex me-2">
                  <Form.Control
                    type="search"
                    placeholder="搜尋供應商"
                    className="me-2"
                    aria-label="Search"
                    onChange={(e) => {setSearchInd(e.target.value);}}
                    value={searchInd}
                  />
                </Form>
                <div className="d-flex flex-wrap flex-md-nowrap justify-content-end align-items-center">
                  <Button icon={faFileAlt} className="me-2" variant="primary" onClick={() => {setShowSupplierModal(true);}}>
                    <FontAwesomeIcon icon={faPlus} className="me-2" />單筆新增
                  </Button>
                  <Button icon={faFileAlt} className="me-2" variant="primary" onClick={() => {setDeleteInd(!deleteInd);}}>
                    <FontAwesomeIcon className="me-2" />{deleteInd?"查看顯示資料":"查看未顯示資料"}
                  </Button>
                  <Button className="me-2" variant="primary" onClick={() => {setDeleteModalBlock(true);}}>
                    批次刪除
                  </Button>
                </div>
              </div>
              <SupplierTable supplier={result.data} searchInd={searchInd} deleteInd={deleteInd} />
            </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
      <SupplierFormModal
        show={showSupplierModal}
        onClose={() => {setShowSupplierModal(false);}}
      />
      <DeleteModal
      deleteModalBlock={deleteModalBlock}
      setDeleteModalBlock={setDeleteModalBlock}
      data={deleteList}
      type='供應商'
      detailType=''
      reload={reload}
      setReload={setReload} />
    </>
  );
}

export default SupplierSettings;