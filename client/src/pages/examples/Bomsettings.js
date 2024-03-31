import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileAlt,  faPlus,  faUpload } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Form , Tab ,Nav } from '@themesberg/react-bootstrap';
import ExcelJs from 'exceljs';
import AddBOMModal from './BomModal';
import { useChat } from "../../api/context";
import axios from 'axios';
import ProductTable from "../../components/BomTable";
import DelBomData from "./DelBomData";
var xlsx = require("xlsx");

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const userData = JSON.parse(localStorage.getItem('data'));
  const userName = userData.Username;
  const [showBomModal, setShowBomModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const instance = axios.create({baseURL:'http://127.0.0.1:5000/api/avm'});
  const [reload, setReload] = useState(false);
  const [status, setStatus] = useState(1);
  const [search, setSearch] = useState('');
  const [firstList, setFirstList] = useState([]);
  const {bom, setBom} = useChat();

  useEffect(() =>{
    async function getLevel1Data(){
      const data = await instance.get(`/sel_bomFirstList`);
      let level1Id = []; 
      if(data.data.length !== 0){
        for(let i=0 ;i <data.data.length; i++){
          level1Id.push({
            label: data.data[i]['target_num'] + '-' + data.data[i]['target_name'], 
            value: data.data[i]['target_num'] + '-' + data.data[i]['target_name'],
            id: data.data[i]['target_num'],
            name: data.data[i]['target_name']});
        }
        setFirstList(level1Id);
      }
    }
    getLevel1Data();
  },[reload])

  const handleExceldownload = async () => {
    const bom = new ExcelJs.Workbook();
    const sheet = bom.addWorksheet('BOM表設定');

    // 列名稱
    const columnNames = ['一階產品代碼', '一階產品名稱', '二階產品代碼', '二階產品名稱', '二階產品使用量(每一單位一階產品)', '三階產品代碼', '三階產品使用量(每一單位二階產品)'];

    const columnsContent = [
      ['A01', '產品A', 'A0101', '產品A-01', 2, 'A010101', 1],
      ['A02', '產品B', 'A0201', '產品B-01', 5, 'A020101', 2],
      ['A03', '產品C', 'A0301', '產品C-01', 8, 'A030101', 5],
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
    link.download = 'BOM.xlsx';
    link.href = URL.createObjectURL(blobData);
    link.click();
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

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
            instance.post('/upload_bom', { 'userName': userName, data: rows })
            .then((res) => {
              alert('上傳成功');
              setReload(!reload);
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

  const handleSingleAdd = () => {
    setShowBomModal(true);
  };

  const handleCloseBomModal = () => {
    setShowBomModal(false);
  };

  useEffect(() => {
    if(bom === 'BOM'){
      setBom(null);
    }
  }, [bom]);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-3">
        <h2 className="fw-bold">
          BOM設定
        </h2>
      </div>
      <Tab.Container defaultActiveKey="upload">
        <Row>
          <Col xs={12} xl={10}>
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="upload">上傳</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="browse" onClick={() => {setReload(!reload);}}>瀏覽</Nav.Link>
              </Nav.Item>
            </Nav>

            {/* Tab Content */}
            <Tab.Content>
              <Tab.Pane eventKey="upload">

                <div className="d-flex justify-content-center align-items-center mb-3">
                  <Col xs={12} xl={5}>
                    <Form.Group>
                      <Form.Label>上傳excel</Form.Label>
                      <Form.Control type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
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
              <div className="d-flex justify-content-between flex-wrap flex-md-nowrap py-2" 
              style={{flexDirection: status !== 1 ? 'row-reverse' : 'row'}}>
                {status === 1 ? 
                (<Button icon={faFileAlt} className="me-2" variant="primary" onClick={handleSingleAdd}>
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  新增一階產品
                </Button>):
                (
                <Form className="d-flex me-2" >
                  <Form.Control
                    type="search"
                    placeholder='搜尋...' 
                    className="me-2"
                    aria-label="Search"
                    onChange={(e) => {setSearch(e.target.value);}}
                    value={search}
                  />
                </Form>
                )}

                <Button className="me-2" variant="primary" onClick={() => {
                  if(status === 1){
                    setStatus(0)
                  }else{
                    setStatus(1)
                  }
                  }}>
                  <FontAwesomeIcon className="me-2" />
                  {status === 1 ? '查看刪除紀錄' : '查看 Bom 表'}
                </Button>
              </div>
              {status === 1 ? 
              <ProductTable reload={reload} setReload={setReload} status={status} /> : 
              <DelBomData search={search} />}
            </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>

      {/* Bom Form Modal */}
      <AddBOMModal
        show={showBomModal}
        onHide={handleCloseBomModal}
        reload={reload} 
        setReload={setReload}
        firstList={firstList}
        userName={userName}
      />
    </>
  );
};

 
