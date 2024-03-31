
import React, {useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, Card, Button, Container, InputGroup } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';
import { Routes } from "../../routes";
import {useHistory} from "react-router-dom"
import axios from 'axios'
import { useChat } from "../../api/context";
var sha256 = require('js-sha256');

function SignIn(){
  const instance = axios.create({baseURL:'http://127.0.0.1:5000/api/avm'});
  const {userData, setUserData} = useChat();
  const history = useHistory();
  const [memberData, setMemberData] = useState({
    Account: "",
    Password: "",
  });

const handleSubmit = async(event, onSave) => {
  event.preventDefault();

  if(memberData.Account === "" || memberData.Password === ""){
    if(memberData.Account === ""){
      alert("帳號不可為空格");
    }else{
      alert("密碼不可為空格");
    }
  }
  else{ 
    const sha256Pwd = sha256(memberData.Password);
    const userData = {account: memberData.Account, password: sha256Pwd}
    const response = await instance.post('/check_user', userData)
    if(response.data.task === '成功登入'){
      alert(response.data.task);
      let userDataObj = {
        Companyname: response.data.result[0].companyName,
        Username: response.data.result[0].username,
        Account: response.data.result[0].account,
        Permission: response.data.result[0].permission,
        Status: response.data.result[0].status,
      };
      localStorage.setItem('data', JSON.stringify(userDataObj));
      setUserData(userDataObj);
      history.push("/dashboard/DashboardOverview")
    }
    else if(response.data.task === '密碼有誤，請重新輸入'){
      alert("登入失敗 : "+ response.data.task)
      setMemberData({
        Account: memberData.Account,
        Password: "",
      });
    }
    else{
      alert("登入失敗 : "+ response.data.task)
      setMemberData({
        Account: "",
        Password: "",
      });
    }
  }
  
};


  return (
    <main>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <Row className="justify-content-center form-bg-image" >
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">登入智慧小刀財會系統</h3>
                </div>
                <Form className="mt-4">
                  <Form.Group id="email" className="mb-4">
                    <Form.Label>帳號</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputGroup.Text>
                      <Form.Control 
                      autoFocus 
                      required 
                      type="email" 
                      placeholder="" 
                      name="Account" 
                      value={memberData.Account} 
                      onChange={(e) => {
                        setMemberData({
                          ...memberData,
                          'Account': e.target.value
                        })
                      }} />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Group id="confirmPassword" className="mb-4">
                      <Form.Label>密碼</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faUnlockAlt} />
                        </InputGroup.Text>
                        <Form.Control 
                        required 
                        type="password" 
                        placeholder="" 
                        name="Password" 
                        value={memberData.Password} 
                        onChange={(e) => {
                          setMemberData({
                            ...memberData,
                            'Password': e.target.value
                          })
                        }}/>
                      </InputGroup>
                    </Form.Group>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Card.Link className="small fw-bold" as={Link} to={Routes.ResetPassword.path}>忘記密碼?</Card.Link>
                    </div>
                  </Form.Group>
                  <Button as={Link} variant="primary" type="submit" className="w-100" onClick ={handleSubmit}>
                    登入
                  </Button>
                </Form>
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <span className="small fw-normal">
                    尚未註冊？
                    <Card.Link as={Link} to={Routes.Signup.path} className="fw-bold">
                      {` 註冊帳號 `}
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

export default SignIn;