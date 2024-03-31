import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileAlt, faPlus, faUpload } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Form, Tab ,Nav } from '@themesberg/react-bootstrap';
import BeginningInventoryTable from "./BeginningInventoryTable";
import BeginningInventoryAddForm from "./BeginningInventoryAddForm";
import DeleteModal from "../components/deleteModal";
import ExcelJs from "exceljs";
import axios from "axios";

function BeginningInventory(){
  const [excelFile, setExcelFile] = useState(null);
  const instance = axios.create({baseURL:'http://127.0.0.1:5000/api/avm'});
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState([]);
  const [searchInd, setSearchInd] = useState("");
  const [reload, setReload] = useState(false);
  const [deleteModalBlock, setDeleteModalBlock] = useState(false);
  const [deleteList, setDeleteList] = useState([]);

  const handleExcelUploadSubmit = async () => {
    if (!excelFile) {
      alert('請選擇一個Excel檔案');
      return;
    }

    const formData = new FormData();
    formData.append('excelFile', excelFile);

    instance.post('/upload_inventory', formData, {
        headers: {
        'Content-Type': 'multipart/form-data'
        }
    })
    .then((res) => {
      if(res.data.message === 'Success'){
        alert('上傳成功');
        setReload(!reload);
      }
    })
    .catch(function (error) {
        alert('上傳失敗，請重新上傳');
        console.error('上傳失敗', error);
    });

  };

  const handleExceldownload = async () => {
    const bom = new ExcelJs.Workbook();
    const sheet = bom.addWorksheet('期初庫存');

    // 列名稱
    const columnNames = ['材料代碼', '材料名稱', '期初數量', '期初單位', '期初單價'];
    const columnsContent = [
      ['material_1', 'Material_Name_1', '10', 'pcs', '10'],
      ['material_2', 'Material_Name_2', '5', 'pcs', '30'],
      ['material_3', 'Material_Name_3', '8', 'pcs', '20'],
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
    link.download = '期初庫存.xlsx';
    link.href = URL.createObjectURL(blobData);
    link.click();
  }

  useEffect(()=>{
    async function getData(){
      const results = await instance.get('/sel_inventory');
      let list = [];
      for(let i=0; i<results.data.length; i++){
        list.push({num: results.data[i]['num'], name: results.data[i]['name']});
      }
      setDeleteList(list);
      console.log('reloaddddd',results)
      setResult(results);
    }
    getData();
  },[reload])

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-3">
        <h2 className="fw-bold">
          原物料期初庫存設定
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
                      <Form.Control type="file" accept=".xlsx,.xls" onChange={(e) => {setExcelFile(e.target.files[0]);}} />
                    </Form.Group>
                  </Col>
                </div>
                <div className="d-flex justify-content-center align-items-center mb-3">
                <Col xs={12} xl={5}>
                <Button icon={faFileAlt} className="me-2" variant="primary" onClick={handleExceldownload}>
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
              <div className="d-flex  flex-wrap flex-md-nowrap justify-content-between align-items-center py-4">
                <Form className="d-flex">
                  <Form.Control
                    type="search"
                    placeholder="搜尋原物料"
                    className="me-2"
                    aria-label="Search"
                    onChange={(e) => {setSearchInd(e.target.value);}}
                    value={searchInd}
                  />
                </Form>
                <div className="d-flex justify-content-end align-items-center">
                  <Button icon={faFileAlt} className="me-2" variant="primary" onClick={() => {setShowModal(true);}}>
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    單筆新增
                  </Button>
                  <Button icon={faFileAlt} className="me-2" variant="primary" onClick={() => {setDeleteModalBlock(true);}}>
                    批次刪除
                  </Button>
                </div>
              </div>
              {result.data !== undefined ? (
                <BeginningInventoryTable rawMaterials={result} search={searchInd} reload={reload} setReload={setReload} />
              ):null}
            </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
      <BeginningInventoryAddForm
        show={showModal}
        setShow={setShowModal}
        reload={reload}
        setReload={setReload}
      />
      <DeleteModal
        deleteModalBlock={deleteModalBlock}
        setDeleteModalBlock={setDeleteModalBlock}
        data={deleteList}
        type='期初庫存'
        detailType=''
        reload={reload}
        setReload={setReload}
      />
    </>
  );

}

export default BeginningInventory;
