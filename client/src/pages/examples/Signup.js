
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUnlockAlt, faLock } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, Card, Button, Container, InputGroup } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';
import { Routes } from "../../routes";
import axios from "axios";
import {useHistory} from "react-router-dom";
var sha256 = require('js-sha256');

function SignUp(){
  const instance = axios.create({baseURL:'http://127.0.0.1:5000/api/avm'});
  const[companyName, setCompanyName] = useState(null);
  let history = useHistory();
  const [memberData, setMemberData] = useState({
    Username: "",
    Account: "",
    Email: "",
    Password: "",
    Password2:"",
    Permission: "1",
    Status: "1"
  });

  useEffect(() => {
    async function getCompanyName(){
      const res = await instance.get('/get_CompanyName');
      setCompanyName(res.data[0]['companyName']);
    }
    getCompanyName();
  },[])  

  const handleChange = (event) => {
    setMemberData({
      ...memberData,
      [event.target.name]: event.target.value
    })
  };

  async function submit(){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(memberData.Email)){
      alert('信箱格式錯誤，請重新填寫')
    }else{
      if(memberData.Password.length < 6){
        alert('密碼長度至少需6位數字，請重新填寫')
      }else{
        if(memberData.Password === memberData.Password2){
          const sha256Pwd = sha256(memberData.Password);
          const submitData = {
            CompanyName: companyName,
            Username: memberData.Username,
            Account: memberData.Account,
            Email: memberData.Email,
            Password: sha256Pwd,
            Permission: "1",
            Status: "1"
          }
          const res = await instance.post('/add_user', submitData);
          if(res.data === '註冊成功'){
            alert('註冊成功')
            history.push("/dashboard/DashboardOverview")
          }else{
            alert("註冊失敗 : "+ res.data)
          }
        }else{
          alert('密碼不一致，請重新填寫')
        }
      }
    }
    setMemberData({
      CompanyName: companyName,
      Username: "",
      Account: "",
      Email: "",
      Password: "",
      Password2:"",
      Permission: "1",
      Status: "1"
    });
  }

  return (
    <main>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <Row className="justify-content-center form-bg-image" >
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="mb-4 mb-lg-0 bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">註冊新帳號</h3>
                </div>
                <Form className="mt-4" >
                  <Form.Group id="companyName" className="mb-4">
                    <Form.Label>公司名稱</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faLock} />
                      </InputGroup.Text>
                      <Form.Control disabled type="text" name="companyName" value={companyName} />
                    </InputGroup>
                  </Form.Group>                   
                  <Form.Group id="email" className="mb-4">
                    <Form.Label>帳號名稱</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEnvelope}  />
                      </InputGroup.Text>
                      <Form.Control required type="email" placeholder="" name="Account" value={memberData.Account} onChange={handleChange}/>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="confirmPassword" className="mb-4">
                    <Form.Label>密碼 ( 需大於六位元 )
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUnlockAlt} />
                      </InputGroup.Text>
                      <Form.Control required type="password" placeholder="" name = "Password" value={memberData.Password} onChange={handleChange}/>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="confirmPassword" className="mb-4">
                    <Form.Label>確認密碼</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUnlockAlt} />
                      </InputGroup.Text>
                      <Form.Control required type="password" placeholder=""  name = "Password2" value={memberData.Password2} onChange={handleChange}/>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="email" className="mb-4">
                      <Form.Label>姓名</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faEnvelope} />
                        </InputGroup.Text>
                        <Form.Control autoFocus required type="email" placeholder="" name="Username" value={memberData.Username} onChange={handleChange} />
                      </InputGroup>
                    </Form.Group>
                  <Form.Group id="email" className="mb-4">
                    <Form.Label>Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUnlockAlt} />
                      </InputGroup.Text>
                      <Form.Control  autoFocus required type="email" placeholder="" name="Email" value={memberData.Email} onChange={handleChange}/>
                    </InputGroup>
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100" onClick={() => {submit();}}>
                    註冊
                  </Button>
                </Form>
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <span className="fw-normal">
                    您已經有帳號?
                    <Card.Link as={Link} to={Routes.Signin.path} className="fw-bold">
                      {` 按此登入 `}
                    </Card.Link>
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}

export default SignUp;
