import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileAlt, faUpload } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Form, Tab, Nav } from '@themesberg/react-bootstrap';
import ExcelJs from "exceljs";
import accRows from "../data/accountData";
import axios from 'axios';
import AccountData from "../../components/AccountData";
import * as XLSX from 'xlsx';

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const instance = axios.create({baseURL:'http://127.0.0.1:5000/api/avm'});
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchInd, setSearchInd] = useState("");
  const [accountDataDefault, setAccountDataDefault] = useState([]);
  const [accountData, setAccountData] = useState([]);
  const [status, setStatus] = useState(1);
  const [reload, setReload] = useState(false);

  const onHandleAccountDownload = async () => {
    const bom = new ExcelJs.Workbook();
    const sheet = bom.addWorksheet('會計科目');

    // 列名稱
    const columnNames = ['一階代碼', '一階中文名', '一階英文名', '二階代碼', '二階中文名', '二階英文名', '三階代碼', '三階中文名', '三階英文名', '四階代碼', '四階中文名', '四階英文名'];
    const columnsContent = [
      ['4', '營業收入', 'operating revenue', '41', '銷貨收入', 'sales revenue', '411', '銷貨收入', 'sales revenue', '4111', '銷貨收入', 'sales revenue'],
      ['4', '營業收入', 'operating revenue', '41', '銷貨收入', 'sales revenue', '417', '銷貨退回', 'sales return', '4171', '銷貨退回', 'sales return'],
      ['5', '營業成本', 'operating costs', '51', '銷貨成本', 'cost of goods sold', '512', '進貨', 'purchases', '5121', '進貨', 'purchases'],
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
    link.download = '會計科目.xlsx';
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
      const file = selectedFile;
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;

        const workbook = XLSX.read(fileContent, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const headers = excelData[0];
        const transformedData = excelData.slice(1).map(row => {
          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = row[index];
          });
          return rowData;
        });

        instance.post('/upload', transformedData)
        .then((res) => {
          if(res.data.message === "Data inserted successfully"){
            alert('上傳成功');
            setReload(!reload);
          }
        })
        .catch(function (error) {
            alert('上傳失敗，請重新上傳');
            console.error('上傳失敗', error);
        });
        };

      reader.readAsBinaryString(file);
    }
};

  useEffect(() => {
    async function getAccountData(){
        const data = await instance.get(`/sel_account_subjects${status}`);
        if(data.data !== undefined){
          let account = data.data.flatMap(item => 
            item.fourthData.map(fourthItem => ({
                third: item.third,
                third_subjects_cn: item.third_subjects_cn,
                third_subjects_eng: item.third_subjects_eng,
                fourth: fourthItem.fourth,
                fourth_subjects_cn: fourthItem.fourth_subjects_cn,
                fourth_subjects_eng: fourthItem.fourth_subjects_eng
            }))
          );
          setAccountDataDefault(account);
          setAccountData(account);
        }
      }
      getAccountData();
  },[status, reload])

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-3">
        <h2 className="fw-bold">
          會計科目設定
        </h2>
      </div>
      <Tab.Container className = "overflow-auto" style = {{backGroundColor:"red"}} defaultActiveKey="browse">
        <Row>
          <Col xs={20} xl={10} style={{width: '120%'}}>
            {/* Nav for Tabs */}
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="browse" onClick={() => {setStatus(1);}}>瀏覽</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="upload">上傳</Nav.Link>
              </Nav.Item>
            </Nav>

            {/* Tab Content */}
            <Tab.Content >
              <Tab.Pane eventKey="browse" >
                <div className="d-flex flex-wrap flex-md-nowrap justify-content-between align-items-center py-3">
                  <Form className="d-flex me-2">
                    <Form.Control
                      type="search"
                      placeholder="搜尋會計科目"
                      className="me-2"
                      aria-label="Search"
                      onChange={(e) => {setSearchInd(e.target.value);}}
                      value={searchInd}
                    />
                  </Form>
                  <Button icon={faFileAlt} className="me-2" variant="primary" onClick={() =>{ if(status === 1){ setStatus(0); }else{ setStatus(1); }}}>
                    <FontAwesomeIcon  className="me-2" />{status === 1 ? "查看顯示會科":"查看未顯示會科"}
                  </Button>
                </div>
                <AccountData data={accountData} search={searchInd} />
              </Tab.Pane>
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
                <Button icon={faFileAlt} id = "download" className="me-2" variant="primary" onClick={onHandleAccountDownload}>
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
            </Tab.Content >
          </Col>
        </Row>
      </Tab.Container>
    </>
  );
};