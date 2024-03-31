import React, { useEffect, useState } from 'react';
import Select from 'react-select'
import { Button, Modal, Form, Card } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';

function AddBOMModal({ show, onHide, reload, setReload, firstList, userName }) {
    const instance = axios.create({ baseURL: 'http://127.0.0.1:5000/api/avm' });
    const [formData, setFormData] = useState({
        product_id: '',
        product_name: '',
        product_sec_id: '',
        use_quantity: '',
        update_user: userName,
        update_time: '',
    });

    const handleAddBOM = async (e) => {
        e.preventDefault();
        if (formData.product_id === '') {
            alert('尚未輸入產品代碼');
            return;
        }
        if (formData.product_name === '') {
            alert('尚未輸入產品名稱');
            return;
        }


        formData.update_time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        formData.update_user = userName;
        formData.status = 1;
        instance.post('/add_bom_first', {ID:JSON.stringify(formData)})
            .then((response) => {
                onHide();
                if(response.data === "此產品已有此代碼存在，請重新輸入新的產品代碼"){
                    alert(response.data);
                }else{
                    setReload(!reload);
                }
            })
            .catch((error) => {
                alert('新增失敗，請稍後再試');
                console.error('新增失敗', error);
            });
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>新增 BOM 第一階</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="product_id">
                        <Form.Label>產品代碼與名稱</Form.Label>
                        <Select options={firstList} 
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                'product_id': e.id,
                                'product_name': e.name,
                            });
                        }} />
                        {/* <Form.Control
                            type="text"
                            name="product_id"
                            value={formData.product_id, product_name}
                            onChange={handleInputChange}
                        /> */}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    取消
                </Button>
                <Button variant="primary" onClick={handleAddBOM}>
                    新增
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
export default AddBOMModal;


export function AddBOMModal2({ addModal, setAddModal, product_in, levelNum, reload, setReload, secondSelectData, thirdSelectData, userName}) {
    const instance = axios.create({ baseURL: 'http://127.0.0.1:5000/api/avm' });
    const [formData, setFormData] = useState({});
    const [level, setLevel] = useState(null);
    const [levelInput, setLevelInput] = useState('second');

    useEffect(() => {
        if(levelNum === 2){
            setLevel('二');
            setLevelInput('second');
            setFormData({
                products: [{
                    product_id: product_in.product_id,
                    product_sec_name: product_in.product_name,
                    product_sec_id: '',
                    product_sec_quantity: '',
                    update_user: userName,
                    update_time: '',
                }],
            })
        }else{
            setLevel('三');
            setLevelInput('third');
            setFormData({
                products: [{
                    product_id: product_in.product_id,
                    product_sec_id: product_in.product_name,
                    product_third_id: '',
                    product_third_quantity: '',
                    update_user: userName,
                }],
            })
        }
    },[levelNum])

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const updatedProducts = [...formData.products];
        updatedProducts[index][name] = value;
        setFormData({
            ...formData,
            products: updatedProducts,
        });
    };

    const handleAddProduct = () => {
        if(levelNum === 2){
            setFormData({
                ...formData,
                products: [...formData.products, {
                    product_first_id: product_in.product_id,
                    product_second_name: product_in.product_name,
                    product_second_id: '',
                    product_second_quantity: '',
                    update_user: userName,
                    update_time: '',
                }],
            });
        }else{
            setFormData({
                ...formData,
                products: [...formData.products, {
                    product_first_id: product_in.product_id,
                    product_second_id: product_in.product_second_id,
                    product_third_id: '',
                    product_third_quantity: '',
                    update_user: userName,
                }],
            });
        }
    };

    function CleanForm(){
        if(levelNum === 2){
            setFormData({
                products: [{
                    product_first_id: product_in.product_id,
                    product_second_name: product_in.product_name,
                    product_second_id: '',
                    product_second_quantity: '',
                    update_user: userName,
                    update_time: '',
                }],
            });
        }else{
            setFormData({
                products: [{
                    product_first_id: product_in.product_id,
                    product_second_id: '',
                    product_third_id: '',
                    product_third_quantity: '',
                    update_user: userName,
                }],
            });
        }
        setAddModal(false);
    };

    const handleAddBOM = async (e) => {
        e.preventDefault();
        if(levelNum === 2){
            for (const product of formData.products) {
                if (
                    product.product_second_name === '' ||
                    product.product_second_id === '' ||
                    product.product_second_quantity === '' 
                ) {
                    alert('請填寫完整的產品資訊');
                    return;
                }
                product.update_time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            }
            for (const product of formData.products) {
                product.product_first_id = product_in.product_id;
                product.product_second_name = product_in.product_name;
                instance.post('/add_bom_second', {ID:JSON.stringify(product)})
                .then((response) => {
                    setAddModal(false);
                    if(response.data === '此產品已有此代碼存在，請重新輸入新的產品代碼'){
                        alert(response.data);
                    }else{
                        setReload(!reload);
                    }
                    CleanForm();
                })
                .catch((error) => {
                    alert('新增失敗，請稍後再試');
                    console.error('新增失敗', error);
                });
            }
        }else{
            for (const product of formData.products) {
                if (
                    product.product_third_id === '' ||
                    product.product_third_quantity === '' 
                ) {
                    alert('請填寫完整的產品資訊');
                }
            }
            for (const product of formData.products) {
                product.product_id = product_in.product_id;
                product.product_second_id = product_in.product_sec_id;
                product.update_user = userName;
                instance.post('/add_bom_third', {ID:JSON.stringify(product)})
                .then((response) => {
                    setAddModal(false);
                    CleanForm();
                    if(response.data === "此產品已有此代碼存在，請重新輸入新的產品代碼"){
                        alert(response.data);
                    }else{
                        setReload(!reload);
                    }
                })
                .catch((error) => {
                    alert('新增失敗，請稍後再試');
                    console.error('新增失敗', error);
                });
            }
        }
    };

    return (
        <Modal show={addModal} onHide={() => {setAddModal(false);}}>
            <Modal.Header closeButton>
                <Modal.Title>新增 {product_in.product_name} BOM 第 {levelNum} 階 </Modal.Title>
            </Modal.Header>
            {
                formData.products !== undefined ? 
                (
                    <Modal.Body>
                    {formData.products.map((product, index) => (
                        <Form key={index} style={{zIndex: 99}}>
                            <Card>
                            <div class="container px-4">
                            <label class="col-sm-2 col-form-label col-form-label-lg">產品 {index + 1} </label>
                            {levelNum === 2 ? (
                                <Form.Group controlId={`product_second_name_${index}`} class="col-sm-10 center">
                                    <Form.Label>二階產品代碼與名稱</Form.Label>
                                    <Select options={secondSelectData} 
                                    onChange={(e) => {
                                        const updatedProducts = [...formData.products];
                                        updatedProducts[index]['product_second_name'] = e.name;
                                        updatedProducts[index]['product_second_id'] = e.id;
                                        setFormData({
                                            ...formData,
                                            products: updatedProducts,
                                        });
                                    }} />
                                </Form.Group>
                            ) : (
                                <Form.Group controlId={`product_${levelInput}_id_${index}`} class="col-sm-10 center">
                                    <Form.Label>三階產品代碼</Form.Label>
                                    <Select options={thirdSelectData} 
                                    onChange={(e) => {
                                        const updatedProducts = [...formData.products];
                                        updatedProducts[index]['product_second_id'] = product_in.product_sec_id;
                                        updatedProducts[index]['product_third_id'] = e.id;
                                        setFormData({
                                            ...formData,
                                            products: updatedProducts,
                                        });
                                    }} />
                                </Form.Group>
                            )}
                            
                            <Form.Group controlId={`product_${levelInput}_quantity_${index}`} class="col-sm-10 center">
                                <Form.Label>使用數量</Form.Label>
                                <Form.Control
                                    type="text"
                                    name={`product_${levelInput}_quantity`}
                                    onChange={(e) => handleInputChange(e, index)}
                                />
                            </Form.Group>
                            <br></br>
                            </div>
                            </Card>
                        </Form>
                    ))}
                    <br></br>
                    <Button variant="primary" onClick={handleAddProduct}>
                        新增{level}階產品
                    </Button>
                </Modal.Body>
                ) : null
            }
           
            <Modal.Footer>
                <Button variant="secondary" onClick={() => {CleanForm(); setAddModal(false)}}>
                    取消
                </Button>
                <Button variant="primary" onClick={handleAddBOM}>
                    新增
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

