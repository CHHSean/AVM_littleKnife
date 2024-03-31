// const express = require('express');
// const mysql = require('mysql2');
// const multer = require('multer');
// const XLSX = require('xlsx');
// const fs = require('fs');
import express from 'express';
import mysql from 'mysql2';
import multer from 'multer';
import XLSX from 'xlsx';
import fs from 'fs';

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// 配置文件上传
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
    }
});

const upload = multer({ storage });

const router = express.Router();
// router.use(bodyParser.json());

const connection = mysql.createConnection({
    host: '127.0.0.1', // 資料庫主機名稱
    port: 3306,
    user: 'root', // 資料庫使用者名稱
    password: '', // 資料庫密碼
    database: 'avm_little_knife', // 資料庫名稱
    // database:"AVM"
});

router.post('/upload', (req, res) => {
    const data = req.body;

    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    const insertValues = data.map(element => [
        element.三階代碼,
        element.三階中文名,
        element.三階英文名,
        element.四階代碼,
        element.四階中文名,
        element.四階英文名,
        1
    ]);

    const query = 'INSERT INTO account_subjects (third, third_subjects_cn, third_subjects_eng, fourth, fourth_subjects_cn, fourth_subjects_eng, status) VALUES ?';
    connection.query(query, [insertValues], (error, results, fields) => {
        if (error) {
            console.error('寫入資料庫錯誤：', error);
            return res.status(500).json({ error: 'Database error' });
        } else {
            res.send({ message: 'Data inserted successfully' });
        }

    });
});

router.post('/add_purchase', async (req, res) => {
    try {
        const result = await add_product_purchase(req.body);
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');

    }
})
router.get('/sel_transaction', async (req, res) => {
    try {
        const result = await sel_transaction();
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');

    }
});
router.post('/add_material', async (req, res) => {
    try {
        const result = await add_material_purchase(JSON.parse(req.body.ID));
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');

    }
})

router.post('/add_sales', async (req, res) => {
    try {
        const result = await add_sales_record(req.body);
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');

    }
})

router.post('/upload_sales', async (req, res) => {
    try {
        const result = await upload_sales_record(req.body);
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');

    }
})

router.get('/sel_sales', async (req, res) => {
    try {
        const result = await sel_sales();
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');
    }
});

router.post('/add_user', async (req, res) => {
    try {
        const result = await register(JSON.parse(req.body.ID));
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');

    }
});

router.post('/add_bom_first', async (req, res) => {
    try {
        const result = await add_bom_first(JSON.parse(req.body.ID));
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');

    }
});

router.post('/add_bom_seconde', async (req, res) => {
    try {
        const result = await add_bom_seconde(JSON.parse(req.body.ID));
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');
    }
});

router.post('/add_bom_third', async (req, res) => {
    try {
        const result = await add_bom_third(JSON.parse(req.body.ID));
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');
    }
});


router.post('/check_user', async (req, res) => {
    try {
        const task = await login(JSON.parse(req.body.ID));
        let result = [];
        if (task === '成功登入') {
            result = await getUserInfo(JSON.parse(req.body.ID).Account);
            res.json({ result: result, task: task });
        }
        else {
            res.json({ result: result, task: task });
        }
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');

    }
});

router.post('/reset_user', async (req, res) => {
    try {
        const result = await resetUserInfo(JSON.parse(req.body.ID));
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');

    }
});

router.get('/sel_account_subjects:id', async (req, res) => {
    try {
        const result = await sel_account_subjects(req.params.id);
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');
    }
});


router.post('/mod_account_subjects', async (req, res) => {
    await update_account_subjects(JSON.parse(req.body.ID))
    res.send('已成功變更會計科目狀態');
});

router.post('/mod_value_target', async (req, res) => {
    const result = await update_value_target(JSON.parse(req.body.ID));
    res.send(result);
});

router.post('/mod_transaction', async (req, res) => {
    const result = await update_transaction(JSON.parse(req.body.ID));
    res.send(result);
});

router.post('/del_transaction', async (req, res) => {
    const result = await del_transaction(JSON.parse(req.body.ID));
    res.send(result);
});


router.get('/sel_value_target_customer', async (req, res) => {
    try {
        const result = await sel_value_target("顧客");
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');

    }
});
router.get('/sel_value_target_material', async (req, res) => {
    try {
        const result = await sel_value_target("原料");
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');

    }
});
router.get('/sel_value_target_product', async (req, res) => {
    try {
        const result = await sel_value_target("產品");
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');

    }
});

router.get('/sel_value_target_department', async (req, res) => {
    try {
        const result = await sel_value_target("部門");
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');

    }
});
router.post('/add_value_target', async (req, res) => {
    const result = await add_value_target(JSON.parse(req.body.ID));
    res.send(result);
});

router.post('/del_value_target', async (req, res) => {
    await del_value_target(JSON.parse(req.body.ID).target_num);
    res.send('已成功刪除價值標的');
});


router.post('/upload_bom', upload.single('excelFile'), (req, res) => {
    try {
        // 確保上傳的檔案存在並處理檔案
        if (!req.file) {
            return res.status(400).json({ error: '未選擇檔案' });
        }
        const result = upload_bom(req.file.filename);
        res.send({ message: '上傳成功' });
    } catch (error) {
        console.error('上傳失敗', error);
        res.status(500).json({ error: '上傳失敗' });
    }
});

router.post('/upload_account', upload.single('excelFile'), (req, res) => {
    try {
        // 確保上傳的檔案存在並處理檔案
        if (!req.file) {
            return res.status(400).json({ error: '未選擇檔案' });
        }
        const result = upload_account_subject(req.file.filename);
        res.send({ message: '上傳成功' });
    } catch (error) {
        console.error('上傳失敗', error);
        res.status(500).json({ error: '上傳失敗' });
    }
});

router.post('/upload_target', upload.single('excelFile'), (req, res) => {
    try {
        // 確保上傳的檔案存在並處理檔案
        if (!req.file) {
            return res.status(400).json({ error: '未選擇檔案' });
        }
        const result = upload_target(req.file.filename);
        res.send({ message: '上傳成功' });
    } catch (error) {
        console.error('上傳失敗', error);
        res.status(500).json({ error: '上傳失敗' });
    }
});

router.post('/upload_inventory', upload.single('excelFile'), (req, res) => {
    try {
        // 確保上傳的檔案存在並處理檔案
        if (!req.file) {
            return res.status(400).json({ error: '未選擇檔案' });
        }
        const result = upload_inventory(req.file.filename);
        res.send({ message: 'Success' })
        res.status(200).json({ message: '上傳成功' });
    } catch (error) {
        console.error('上傳失敗', error);
        res.status(500).json({ error: '上傳失敗' });
    }
});


router.get('/sel_supplier', async (req, res) => {
    try {
        const result = await sel_supplier();
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');

    }
});
router.post('/del_supplier', async (req, res) => {
    await del_supplier(JSON.parse(req.body.ID).supplier_num)
    res.send('已成功刪除供應商');
})

router.post('/update_supplier', async (req, res) => {
    const result = await update_supplier(JSON.parse(req.body.ID))
    res.send(result);

});
router.post('/add_supplier', async (req, res) => {
    const result = await add_supplier(JSON.parse(req.body.ID))
    res.send(result);
});

router.get('/sel_inventory', async (req, res) => {
    try {
        const result = await sel_inventory();
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');

    }
});

router.post('/add_inventory', async (req, res) => {
    const result = await add_inventory(JSON.parse(req.body.ID))
    res.send(result);
});

router.get('/get_bom:id', async (req, res) => {
    try {
        const result = await calculateProductCost(req.params.id);
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');
    }
});

// // 期初庫存修改
router.post('/update_inventory', async (req, res) => {
    await update_inventory(JSON.parse(req.body.ID))
    res.send('已成功修改期初庫存資料');

});

// 期初庫存刪除
router.post('/del_inventory', async (req, res) => {
    // const condition = req.body; // 假設客戶端以 JSON 格式傳送刪除條件
    // del_inventory(condition);
    await del_inventory(JSON.parse(req.body.ID).mid)
    res.send('已成功刪除庫存資料');
});

router.post('/del_bom_first', async (req, res) => {
    await del_bom_first(req.body)
    res.send('已成功刪除BOM第一階資料');
});

router.post('/del_bom_second', async (req, res) => {
    await del_bom_second(req.body)
    res.send('已成功刪除BOM第二階資料');
});

router.post('/del_bom_third', async (req, res) => {
    await del_bom_third(req.body)
    res.send('已成功刪除BOM第三階資料');
});

router.post('/update_bom_first', async (req, res) => {
    await update_bom_first(req.body)
    res.send('已成功修改BOM第一階資料');
});

router.post('/update_bom_second', async (req, res) => {
    await update_bom_second(req.body)
    res.send('已成功修改BOM第二階資料');
});

router.post('/update_bom_third', async (req, res) => {
    await update_bom_third(req.body)
    res.send('已成功修改BOM第三階資料');
});

// BOM 刪除紀錄
router.get('/get_del_bom', async (req, res) => {
    try {
        const result = await calculateProductDelCost();
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');
    }
});

// module.exports = router
export default router;

async function del_bom_first(deleteData) {
    const log_data_third = await sel_bom_log_first_third(deleteData.productFirstId);
    const log_data_sec = await sel_bom_log_first_sec(deleteData.productFirstId);
    const deleteQuery_first = 'UPDATE bom_first SET `status` = 0 WHERE product_id = ?';
    const deleteQuery_second = 'UPDATE bom_second SET `status` = 0 WHERE product_id = ?';
    const deleteQuery_third = 'UPDATE bom_third SET `status` = 0 WHERE product_id = ?';
    const addQuery_bomlog = 'INSERT INTO `del_bom_log`(`product_id`, `product_sec_id`, `material_id`, `del_level`, `del_user`) VALUES (?,?,?,?,?)';

    if (log_data_third.length !== 0 && log_data_sec.length !== 0) {
        connection.query(deleteQuery_first, [deleteData.productFirstId], (error, results, fields) => {
            if (error) {
                console.error('刪除資料庫錯誤：', error);
            } else {
                console.log('已成功一階刪除資料');
            }
        });
        connection.query(deleteQuery_second, [deleteData.productFirstId], (error, results, fields) => {
            if (error) {
                console.error('刪除資料庫錯誤：', error);
            } else {
                console.log('已成功二階刪除資料');
            }
        });
        connection.query(deleteQuery_third, [deleteData.productFirstId], (error, results, fields) => {
            if (error) {
                console.error('刪除資料庫錯誤：', error);
            } else {
                console.log('已成功三階刪除資料');
            }
        });

        let allLogData = [{ product_id: deleteData.productFirstId }, ...log_data_sec, ...log_data_third];
        for (let i = 0; i < allLogData.length; i++) {
            const secId = allLogData[i].product_sec_id === undefined ? null : allLogData[i].product_sec_id;
            const thirdId = allLogData[i].material_id === undefined ? null : allLogData[i].material_id;
            connection.query(addQuery_bomlog, [allLogData[i].product_id, secId, thirdId, 1, deleteData.updateUser], (error, results, fields) => {
                if (error) {
                    console.error('刪除資料庫錯誤：', error);
                } else {
                    if (i === (allLogData.length - 1)) {
                        return ('已成功刪除資料')
                    }
                }
            });
        }
    }
}

//BOM第二階刪除(對應到bom_second table)
async function del_bom_second(deleteData) {
    const log_data = await sel_bom_log_sec(deleteData.productFirstId, deleteData.productSecondId);
    const deleteQuery_second = 'UPDATE bom_second SET `status` = 0 WHERE product_id = ? AND product_sec_id = ?';
    const deleteQuery_third = 'UPDATE bom_third SET `status` = 0 WHERE product_id = ? AND product_sec_id = ?';
    const addQuery_bomlog = 'INSERT INTO `del_bom_log`(`product_id`, `product_sec_id`, `material_id`, `del_level`, `del_user`) VALUES (?,?,?,?,?)';
    if (log_data.length !== 0) {
        let allLogData = [{ product_id: deleteData.productFirstId }, { product_id: deleteData.productFirstId, product_sec_id: deleteData.productSecondId }, ...log_data];
        connection.query(deleteQuery_second, [deleteData.productFirstId, deleteData.productSecondId], (error, results, fields) => {
            if (error) {
                console.error('刪除資料庫錯誤：', error);
            } else {
                console.log('已成功刪除二階資料');
            }
        });

        connection.query(deleteQuery_third, [deleteData.productFirstId, deleteData.productSecondId], (error, results, fields) => {
            if (error) {
                console.error('刪除資料庫錯誤：', error);
            } else {
                console.log('已成功刪除三階資料');
            }
        });

        for (let i = 0; i < allLogData.length; i++) {
            let secId = allLogData[i].product_sec_id === undefined ? null : allLogData[i].product_sec_id;
            let thirdId = allLogData[i].material_id === undefined ? null : allLogData[i].material_id;
            connection.query(addQuery_bomlog, [allLogData[i].product_id, secId, thirdId, 2, deleteData.updateUser], (error, results, fields) => {
                if (error) {
                    console.error('刪除資料庫錯誤：', error);
                } else {
                    if (i === (allLogData.length - 1)) {
                        return ('已成功刪除資料')
                    }
                }
            });
        }
    }

}

//BOM第三階刪除
async function del_bom_third(deleteData) {
    const logData = await sel_bom_log_third(deleteData.productFirstId, deleteData.productSecondId, deleteData.productThirdId);
    const deleteQuery = 'UPDATE bom_third SET `status` = 0 WHERE `product_id` = ? AND `product_sec_id` = ? AND `material_id` = ?';
    const addQuery_bomlog = 'INSERT INTO `del_bom_log`(`product_id`, `product_sec_id`, `material_id`, `del_level`, `del_user`) VALUES (?,?,?,?,?)';
    if (logData.length !== 0) {
        let allLogData = [{ product_id: deleteData.productFirstId }, { product_id: deleteData.productFirstId, product_sec_id: deleteData.productSecondId }, ...logData];
        connection.query(deleteQuery, [deleteData.productFirstId, deleteData.productSecondId, deleteData.productThirdId], (error, results, fields) => {
            if (error) {
                console.error('刪除資料庫錯誤：', error);
            } else {
                console.log('已成功刪除三階資料');
            }
        });

        for (let i = 0; i < allLogData.length; i++) {
            let secId = allLogData[i]['product_sec_id'] === undefined ? null : allLogData[i]['product_sec_id'];
            let thirdId = allLogData[i]['material_id'] === undefined ? null : allLogData[i]['material_id'];
            connection.query(addQuery_bomlog, [allLogData[i]['product_id'], secId, thirdId, 3, deleteData.updateUser], (error, results, fields) => {
                if (error) {
                    console.error('刪除資料庫錯誤：', error);
                } else {
                    if (i === (allLogData.length - 1)) {
                        return ('已成功刪除資料')
                    }
                }
            });
        }
    }
}

//BOM第二階修改(對應到bom_second table)
function update_bom_second(updatedata) {
    const updateQuery = 'UPDATE bom_second SET `use_quantity`= ?, update_user =? WHERE product_id = ? AND product_sec_id = ?';
    connection.query(updateQuery, [updatedata.quantity, updatedata.update_user, updatedata.product_first_id, updatedata.product_second_id], (error, results, fields) => {
        if (error) {
            console.error('修改資料庫錯誤：', error);
        } else {
            console.log('已成功修改資料');
        }
    });
}

//BOM第三階修改(對應到bom_third table)
function update_bom_third(updatedata) {
    const updateQuery = 'UPDATE bom_third  SET `use_quantity`=?, update_user =? WHERE product_id = ? AND product_sec_id = ? AND material_id = ?';
    connection.query(updateQuery, [updatedata.quantity, updatedata.update_user, updatedata.product_id, updatedata.product_sec_id, updatedata.material_id,
    updatedata.product_id, updatedata.product_sec_id, updatedata.material_id], (error, results, fields) => {
        if (error) {
            console.error('修改資料庫錯誤：', error);
        } else {
            console.log('已成功修改資料');
        }
    });
}

//BOM一階刪除資料存取(update 一階抓三階資料)
function sel_bom_log_first_third(id) {
    const query = 'SELECT `product_id`, `product_sec_id`, `material_id` FROM `bom_third` WHERE `product_id` = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, id, (error, results, fields) => {
            if (error) {
                reject(error)
            }
            else {
                resolve(results)
            }
        })
    })
}

//BOM一階刪除資料存取(update 一階抓二階資料)
function sel_bom_log_first_sec(id) {
    const query = 'SELECT `product_id`, `product_sec_id` FROM `bom_second` WHERE `product_id` = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, id, (error, results, fields) => {
            if (error) {
                reject(error)
            }
            else {
                resolve(results)
            }
        })
    })
}

//BOM二階刪除資料存取(取擁有BOTH此一階代碼二階代碼之三階資料)
function sel_bom_log_sec(first_id, sec_id) {
    const query = 'SELECT `product_id`, `product_sec_id`, `material_id` FROM `bom_third` WHERE `product_id` = ? AND `product_sec_id` = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, [first_id, sec_id], (error, results, fields) => {
            if (error) {
                reject(error)
            }
            else {
                resolve(results)
            }
        })
    })
}

//BOM三階刪除資料存取(只取特定BOM三階資料)只會有一筆
function sel_bom_log_third(first_id, sec_id, third_id) {
    const query = 'SELECT `product_id`, `product_sec_id`, `material_id` FROM `bom_third` WHERE `product_id` = ? AND `product_sec_id` = ? AND `material_id` = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, [first_id, sec_id, third_id], (error, results, fields) => {
            if (error) {
                reject(error)
            }
            else {
                resolve(results)
            }
        })
    })
}

//BOM第一階新增(對應到bom_first table)
async function add_bom_first(data) {
    try {
        const product_id = data.product_id;
        const check = await bom_id_check(product_id);
        if (check != 0) {
            console.log('此產品已有此代碼存在，請重新輸入新的產品代碼')
            return ('此產品已有此代碼存在，請重新輸入新的產品代碼')
        }
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO `bom_first`(`product_id`, `product_name`, `update_user`, `status`) VALUES (?, ?, ?, ?)'
            connection.query(query, [data.product_id, data.product_name, data.update_user, 1], (error, results, fields) => {
                if (error) {
                    reject(error)
                }
                else {
                    resolve(results)
                }
            })
        })
    } catch (error) {
        console.log(error)
    }
}

//BOM第二階新增(對應到bom_second table)
async function add_bom_seconde(data) {
    try {
        const product_id = data.product_first_id;
        const product_sce_id = data.product_sce_id;
        const check = await bom_secid_check(product_id, product_sce_id);
        if (check != 0) {
            console.log('此二階產品已有此代碼存在，請重新輸入新的產品代碼')
            return ('此產品已有此代碼存在，請重新輸入新的產品代碼')
        }
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO `bom_second`(`product_id`, `product_sec_id`, `product_sec_name`, `use_quantity`,  `update_user`,  `update_time`, `status`) VALUES (?, ?, ?, ?, ?, ? ,1)'
            connection.query(query, [data.product_first_id, data.product_seconde_id, data.product_seconde_name, data.product_seconde_quantity, data.update_user, data.update_time], (error, results, fields) => {
                if (error) {
                    reject(error)
                }
                else {
                    resolve(results)
                }
            })
        })
    } catch (error) {
        console.log(error)
    }
}

//BOM第三階新增(對應到bom_third table)
async function add_bom_third(data) {
    const product_id = data['product_id'];
    const product_sec_id = data['product_seconde_id'];
    const material_id = data['product_third_id'];
    const quantity = data['product_third_quantity'];
    const check = await bom_thrid_check(product_id, product_sec_id, material_id);
    if (check != 0) {
        console.log('此產品已有此原料代碼存在，請重新輸入新的原料代碼')
        return ('此產品已有此原料代碼存在，請重新輸入新的原料代碼')
    } else {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO `bom_third`( `product_id`, `product_sec_id`, `material_id`, `use_quantity`, `status`, `update_user`) VALUES  (?,?,?,?,?,?)'
            connection.query(query, [product_id, product_sec_id, material_id, quantity, 1, 'testing'], (error, results, fields) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(results)
                }
            });
        })
    }
}

//BOM一階代碼防呆
function bom_id_check(id) {
    const query = 'SELECT * FROM `bom_first` WHERE `product_id` = ?'
    return new Promise((resolve, reject) => {
        connection.query(query, id, (error, results, fields) => {
            if (error) {
                reject(error)
            }
            else {
                resolve(results)
            }
        })
    })
}

//BOM二階代碼防呆
function bom_secid_check(product_id, product_sce_id) {
    query = 'SELECT * FROM `bom_second` WHERE `product_id` = ? AND `product_sec_id` = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, [product_id, product_sce_id], (error, results, fields) => {
            if (error) {
                reject(error)
            }
            else {
                resolve(results)
            }
        })
    })
}

//BOM三階代碼防呆
function bom_thrid_check(product_id, product_sce_id, material_id) {
    const query = 'SELECT * FROM `bom_third` WHERE `product_id` = ? AND `product_sec_id` = ? AND `material_id` =?';
    return new Promise((resolve, reject) => {
        connection.query(query, [product_id, product_sce_id, material_id], (error, results, fields) => {
            if (error) {
                reject(error)
            }
            else {
                resolve(results)
            }
        })
    })
}


// function add_product_purchase(data) {
//     const query = 'INSERT INTO `p_purchase`(`date`, `account_subjects_num`,`purchase_id`, `purchase_name`,`purchase_quantity`, `purchase_unit`, `purchase_price`, `supplier_num`,`remark`,`create_user`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
//     connection.query(query, [data.date, data.accountSubjectsNum, data.purchaseId, data.purchaseName, data.purchaseQuantity, data.purchaseUnit, data.purchasePrice, data.supplierNum, data.remark, data.createUser], (error, results, fields) => {
//         if (error) {
//             console.error(error);
//         } else {
//             res.send({ message: 'Data inserted successfully' });
//         }
//     });
// }

//***purchase -> add_purchase
async function add_purchase(data) {
    const category = 'purchase'
    // console.log(data.date)
    //取當月第一天
    const dateObj = new Date(data.date);
    const firstday = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
    const formattedDate = `${firstday.getFullYear()}-${(firstday.getMonth() + 1).toString().padStart(2, '0')}-${firstday.getDate().toString().padStart(2, '0')} 00:00:00`;

    //檢查是否為當月第一筆交易紀錄
    const sales = await check_sales(data.purchase_id, formattedDate)
    // console.log("sales:")
    // console.log(sales.length)

    const inventory_info = await sel_inventory_info(data.purchase_id, formattedDate)
    // console.log(data.purchase_id, formattedDate)
    // console.log(inventory_info)
    const name = inventory_info[0].name
    let updated_inventory, total_cost, updated_unit_cost;

    if (sales.length > 0) {//非當月第一筆交易紀錄
        console.log("adding")
        const latest_sales = await get_latest_sales(data.purchase_id)//取前一筆交易紀錄
        // console.log(latest_sales)
        updated_inventory = latest_sales[0].inventory_updated + data.purchase_quantity
        total_cost = data.purchase_quantity * data.purchase_price
        updated_unit_cost = (latest_sales[0].inventory_updated * latest_sales[0].unit_cost_updated + total_cost) / updated_inventory
    } else {//當月第一筆(從inventory_setup拿資料)
        console.log("enter first")
        updated_inventory = inventory_info[0].start_quantity + data.purchase_quantity
        total_cost = data.purchase_quantity * data.purchase_price
        updated_unit_cost = (inventory_info[0].start_cost + total_cost) / updated_inventory
    }



    const purchase_query = 'INSERT INTO `purchase`(`date`, `order_num`, `account_subjects_num`,`purchase_id`,  `purchase_quantity`, `purchase_unit`, `purchase_price`, `supplier_num`, `remark`,`create_user`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'

    const inventory_query = 'INSERT INTO `inventory_log`(`date`, `order_num`, `category`, `num`, `name`, `amount`, `unit`, `unit_cost`, `total_cost`, `inventory_updated`, `unit_cost_updated`) VALUES (?,?,?,?,?,?,?,?,?,?,?)'

    connection.query(purchase_query, [data.date, data.order_num, data.account_subjects_num, data.purchase_id, data.purchase_quantity, data.purchase_unit, data.purchase_price, data.supplier_num, data.remark, data.create_user], (error, results, fields) => {
        if (error) {
            console.error(error);
            return (error);
        } else {
            // let arr = obj_to_dict(results)
            console.log('新增購買成功');
            return ('新增購買成功');

        }
    });
    connection.query(inventory_query, [data.date, data.order_num, category, data.purchase_id, name, data.purchase_quantity, data.purchase_unit, data.purchase_price, total_cost, updated_inventory, updated_unit_cost], (error, results, fields) => {
        if (error) {
            console.error(error);
            return (error);
        } else {
            // let arr = obj_to_dict(results)
            console.log('新增購買成功');
            return ('新增購買成功');

        }
    });
}

//***useage
async function add_usage(data) {
    const category = 'usage'
    // console.log(data.date)

    //取當月第一天
    const dateObj = new Date(data.date);
    const firstday = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
    const formattedDate = `${firstday.getFullYear()}-${(firstday.getMonth() + 1).toString().padStart(2, '0')}-${firstday.getDate().toString().padStart(2, '0')} 00:00:00`;

    //檢查是否為當月第一筆交易紀錄
    const sales = await check_sales(data.usage_id, formattedDate)

    const inventory_info = await sel_inventory_info(data.usage_id, formattedDate)
    // console.log(data.purchase_id, formattedDate)
    // console.log(inventory_info)
    const name = inventory_info[0].name
    let updated_inventory, total_cost, updated_unit_cost;

    if (sales.length > 0) {//非當月第一筆交易紀錄
        console.log("adding")
        const latest_sales = await get_latest_sales(data.usage_id)//取前一筆交易紀錄
        // console.log(latest_sales)
        updated_inventory = latest_sales[0].inventory_updated - data.usage_quantity
        total_cost = data.usage_quantity * latest_sales[0].unit_cost_updated
        updated_unit_cost = (latest_sales[0].inventory_updated * latest_sales[0].unit_cost_updated - total_cost) / updated_inventory
    } else {//當月第一筆(從inventory_setup拿資料)
        console.log("enter first")
        updated_inventory = inventory_info[0].start_quantity - data.usage_quantity
        total_cost = data.usage_quantity * inventory_info[0].start_cost
        updated_unit_cost = (inventory_info[0].start_cost - total_cost) / updated_inventory
    }

    const query = 'INSERT INTO `useage`(`date`, `order_num`, `usage_id`, `usage_quantity`, `usage_unit`, `usage_price`, `remark`, `create_user`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    const inventory_query = 'INSERT INTO `inventory_log`(`date`, `order_num`, `category`, `num`, `name`, `amount`, `unit`, `unit_cost`, `total_cost`, `inventory_updated`, `unit_cost_updated`) VALUES (?,?,?,?,?,?,?,?,?,?,?)'

    connection.query(query, [data.date, data.order_num, data.usage_id, data.usage_quantity, data.usage_unit, data.usage_price, data.remark, data.create_user], (error, results, fields) => {
        if (error) {
            console.error(error);
            return (error);
        } else {
            // let arr = obj_to_dict(results)
            console.log('新增存貨成功');
            return ('新增存貨成功');

        }
    });
    connection.query(inventory_query, [data.date, data.order_num, category, data.usage_id, name, data.usage_quantity, data.usage_unit, data.usage_price, total_cost, updated_inventory, updated_unit_cost], (error, results, fields) => {
        if (error) {
            console.error(error);
            return (error);
        } else {
            // let arr = obj_to_dict(results)
            console.log('新增購買成功');
            return ('新增購買成功');

        }
    });
}

//選取特定代碼之期初存貨資料
function sel_inventory_info(num, date) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM inventory_setup WHERE `num` = ? AND `date` = ?', [num, date], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function check_sales(num, date) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM inventory_log WHERE `num` = ? AND MONTH(`date`) = MONTH(?) AND YEAR(`date`) = YEAR(?)';
        connection.query(query, [num, date, date], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

// 查詢最新交易紀錄
function get_latest_sales(num) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM inventory_log WHERE `num` = ? ORDER BY `date` DESC LIMIT 1';
        connection.query(query, [num], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}


function add_sales_record(data) {
    const query = 'INSERT INTO `sales`(`date`, `third_id`, `fourth_id`, `value_target`, `target_num`, `amount`, `unit_price`, `total_price`, `order_number`, `remark`)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    connection.query(query, [data.date, data.thirdId, data.fourthId, data.valueTarget, data.targetNum, data.amount, data.unitPrice, data.totalPrice, data.orderNumber, data.remark], (error, results, fields) => {
        if (error) {
            console.error(error);
            return (error);
        }
        else {
            console.log('財會系統紀錄成功');
            return ('財會系統紀錄成功');
        }
    })
}

function upload_sales_record(data) {
    const insertValues = data.map(element => [
        element.thirdId,
        element.fourthId,
        element.valueTarget,
        element.targetNum,
        element.amount,
        element.unitPrice,
        element.totalPrice,
        element.order_number,
        element.remark
    ]);

    const query = 'INSERT INTO `sales` (`third_id`, `fourth_id`, `value_target`, `target_num`, `amount`, `unit_price`, `total_price`, `order_number`, `remark`) VALUES ?';
    connection.query(query, [insertValues], (error, results, fields) => {
        if (error) {
            console.error('寫入資料庫錯誤：', error);
            return res.status(500).json({ error: 'Database error' });
        }
        console.log('已成功將資料寫入資料庫');
        return res.status(200).json({ message: 'Data inserted successfully' });
    });
}

async function login(data) {
    try {
        const password = data.Password
        const account = data.Account
        const userinfo = await getUserInfo(account)

        if (userinfo.length > 0) {
            if (password === userinfo[0].password) {
                console.log('成功登入')
                return ('成功登入')
            }
            else {
                console.log('密碼有誤，請重新輸入')
                return ('密碼有誤，請重新輸入')

            }
        } else {
            console.log('無此帳號，請重新輸入')
            return ('無此帳號，請重新輸入')
        }
    }
    catch (error) {
        console.log(error)
        return (error)
    }
}

function getUserInfo(data) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM user WHERE `account` = ?', data, (error, results, fields) => {
            if (error) {
                // console.error('帳號有誤：', error);
                reject(error);
            } else {
                // console.log(results)
                resolve(results);
            }
        });
    });
}

async function resetUserInfo(data) {
    console.log("reseting")
    const check_account = await find_account(data.Account)
    const check_old_password = await find_old_password(data.Account)

    if (data.Password !== data.Password2) {
        // console.log('密碼不一致，請重新填寫')
        return ('新密碼不一致，請重新填寫')
    } else if (check_account.length === 0) {
        // console.log('帳號已被註冊，請重新填寫')
        return ('無此帳號，請重新填寫')
    } else if (data.Password.length < 6) {
        // console.log('密碼長度至少需6位數字，請重新填寫')
        return ('新密碼長度至少需6位數字，請重新填寫')
    } else if (check_old_password[0].password === data.Password) {
        // console.log('密碼長度至少需6位數字，請重新填寫')
        return ('新密碼不可與舊密碼相同，請重新填寫')
    } else {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE `user` SET `password` = ? WHERE `user`.`account` = ?', [data.Password, data.Account], (error, results, fields) => {
                if (error) {
                    // console.error('帳號有誤：', error);
                    reject(error);
                } else {
                    // console.log(results)
                    resolve("修改成功，請重新登入");
                }
            });
        });
    }
}

function find_account(data) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM user WHERE `account` = ?', data, (error, results, fields) => {
            if (error) {
                // console.error('帳號有誤：', error);
                reject(error);
            } else {
                // console.log(results)
                resolve(results);
            }
        });
    });
}

function find_old_password(data) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM user WHERE `account` = ?', data, (error, results, fields) => {
            if (error) {
                // console.error('帳號有誤：', error);
                reject(error);
            } else {
                // console.log(results)
                resolve(results);
            }
        });
    });
}


function del_supplier(condition) {
    const deleteQuery = 'UPDATE `supplier` SET `status` = ? WHERE `supplier`.`supplier_num` = ?';


    connection.query(deleteQuery, [2, condition], (error, results, fields) => {
        if (error) {
            console.error('刪除資料庫錯誤：', error);
        } else {
            console.log('已成功刪除資料');
        }
    });
}

function del_transaction(condition) {
    const deleteQuery = 'UPDATE `p_purchase` SET `id` = ? WHERE `p_purchase`.`id` = ?';


    connection.query(deleteQuery, [0, condition.orig], (error, results, fields) => {
        if (error) {
            console.error('刪除資料庫錯誤：', error);
        } else {
            console.log('已成功刪除交易');
        }
    });
}
function update_transaction(condition) {
    let deleteQuery = 'UPDATE `p_purchase` SET `purchase_id` = ? WHERE `p_purchase`.`id` = ?';
    connection.query(deleteQuery, [condition.purchase_id, condition], (error, results, fields) => {
        if (error) {
            console.error('刪除資料庫錯誤：', error);
        } else {
            console.log('已成功修改交易代碼');
        }
    });

    deleteQuery = 'UPDATE `p_purchase` SET `purchase_name` = ? WHERE `p_purchase`.`id` = ?';
    connection.query(deleteQuery, [condition.purchase_name, condition], (error, results, fields) => {
        if (error) {
            console.error('刪除資料庫錯誤：', error);
        } else {
            console.log('已成功修改交易名稱');
        }
    });
}

function del_value_target(condition) {
    const deleteQuery = 'UPDATE `value_target` SET `target_status` = ? WHERE`value_target`.`target_num` = ?'
    connection.query(deleteQuery, [2, condition], (error, results, fields) => {
        if (error) {
            console.error('刪除資料庫錯誤：', error);
        } else {
            console.log('已成功刪除資料');
        }
    });
}

function sel_account_subjects(status) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT `id`, `third`, `third_subjects_cn`, `third_subjects_eng`, `fourth`, `fourth_subjects_cn`, `fourth_subjects_eng` FROM account_subjects WHERE status = ?', [status], (error, results, fields) => {
            if (error) {
                console.error('查詢會科錯誤：', error);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function sel_sales() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM sales', (error, results, fields) => {
            if (error) {
                console.error('查詢會科錯誤：', error);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

async function register(data) {
    try {
        const username = data.Username
        const account = data.Account
        const password = data.Password
        const password2 = data.Password2
        const email = data.Email
        const permission = 1;
        const status = 1;
        const check_email = await register_indtical_email(email)
        const check_account = await register_indtical_account(account)
        const query = 'INSERT INTO `user`(`username`, `account`, `password`, `email`, `permission`, `status`) VALUES  (?, ?, ?, ?, ?, ?)';

        if (password !== password2) {
            // console.log('密碼不一致，請重新填寫')
            return ('密碼不一致，請重新填寫')
        } else if (check_account.length > 0) {
            // console.log('帳號已被註冊，請重新填寫')
            return ('帳號已被註冊，請重新填寫')
        } else if (password.length < 6) {
            // console.log('密碼長度至少需6位數字，請重新填寫')
            return ('密碼長度至少需6位數字，請重新填寫')
        } else if (!isValidEmail(email)) {
            return ('信箱格式錯誤，請重新填寫')
        }
        else {
            return new Promise((resolve, reject) => {
                connection.query(query, [username, account, password, email, permission, status], (error, results, fields) => {
                    if (error) {
                        console.error('註冊錯誤：', error);
                        reject(error);
                    } else {
                        resolve("註冊成功")
                    }
                });
            });
        }
    }
    catch (error) {
        return (error)
    }
}
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

//註冊檢查重複使用者名稱
function register_indtical_email(data) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM user WHERE `email` = ?', data, (error, results, fields) => {
            if (error) {
                // console.error('帳號有誤：', error);
                reject(error);
            } else {
                // console.log(results)
                resolve(results);
            }
        });
    });
}

//註冊檢查重複帳號
function register_indtical_account(data) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM user WHERE `account` = ?', data, (error, results, fields) => {
            if (error) {
                // console.error('帳號有誤：', error);
                reject(error);
            } else {
                // console.log(results)
                resolve(results);
            }
        });
    });
}

function sel_value_target(task) {
    const findingQuery = 'SELECT * FROM `value_target` WHERE `value_target`.`category` = ?';
    return new Promise((resolve, reject) => {
        connection.query(findingQuery, task, (error, results, fields) => {
            if (error) {
                console.error('查詢錯誤：', error);
                reject(error);
            } else {
                let arr = obj_to_dict(results);
                console.log('查詢結果：', arr);
                resolve(arr);
            }
        });
    });
}
function sel_transaction() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM p_purchase', (error, results, fields) => {
            if (error) {
                console.error('查詢錯誤：', error);
                reject(error);
            } else {
                let arr = obj_to_dict(results)
                // console.log('查詢結果：', arr);
                resolve(arr);
            }
        });
    });
}
function sel_supplier() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM supplier', (error, results, fields) => {
            if (error) {
                console.error('查詢錯誤：', error);
                reject(error);
            } else {
                let arr = obj_to_dict(results)
                // console.log('查詢結果：', arr);
                resolve(arr);
            }
        });
    });
}
async function add_supplier(data) {
    try {
        const id = '0';
        const status = '1';

        const check_supplier_code = await identical_supplier_num(data.supplier_num)
        const check_supplier_name = await identical_supplier_name(data.supplier_name)

        if (check_supplier_code.length > 0) {
            console.log('供應商代碼重複，請重新填寫')
            return ('供應商代碼重複，請重新填寫')
        } else if (check_supplier_name.length > 0) {
            console.log('供應商名稱重複，請重新填寫')
            return ('供應商名稱重複，請重新填寫')
        } else {
            return new Promise((resolve, reject) => {
                connection.query('INSERT INTO supplier (`id`, `supplier_name`, `supplier_num`, `update_user`, `update_time`, `status`) VALUES (?, ?, ?, ?, ?, ?)', [id, data.supplier_name, data.supplier_num, data.update_user, data.update_time, status], (error, results, fields) => {
                    if (error) {
                        console.error('新增供應商錯誤：', error);
                        reject(error);
                    } else {
                        console.log("供應商新增成功")
                        resolve("供應商新增成功")
                    }
                });
            });
        }
    }
    catch (error) {
        console.log(error)
        return (error)
    }
}

function identical_supplier_num(data) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM supplier WHERE `supplier_num` = ?', data, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.filter(t => t.status !== 2));
            }
        });
    });
}

function identical_supplier_name(data) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM supplier WHERE `supplier_name` = ?', data, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.filter(t => t.status !== 2));
            }
        });
    });
}


async function add_value_target(data) {

    try {
        const id = '0';
        const status = '1';

        const check_valuetarget_code = await identical_valuetarget_num(data.valueTargetCode)
        const check_valuetarget_name = await identical_valuetarget_name(data.name, data.category)

        if (check_valuetarget_code.length > 0) {
            console.log('價值標的代碼重複，請重新填寫')
            return ('價值標的代碼重複，請重新填寫')
        } else if (check_valuetarget_name.length > 0) {
            console.log('價值標的名稱重複，請重新填寫')
            return ('價值標的名稱重複，請重新填寫')
        } else {
            return new Promise((resolve, reject) => {
                connection.query('INSERT INTO value_target (`id`, `category`, `target_num`, `target_name`, `target_status`, `update_time`) VALUES (?, ?, ?, ?, ?, ?)', [id, data.category, data.valueTargetCode, data.name, status, data.updateTime], (error, results, fields) => {
                    if (error) {
                        console.error('新增價值標的錯誤：', error);
                        reject(error);
                    } else {
                        console.log("價值標的新增成功")
                        resolve("價值標的新增成功")
                    }
                });
            });
        }
    }
    catch (error) {
        console.log(error)
        return (error)
    }
}


function identical_valuetarget_num(data) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM value_target WHERE `target_num` = ?', data, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.filter(val => val.target_status !== 2));
            }
        });
    });
}

function identical_valuetarget_name(name, category) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM value_target WHERE `target_name` = ? AND category = ?', [name, category], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.filter(val => val.target_status !== 2));
            }
        });
    });
}

//期初庫存新增(data由前端傳回來)
async function add_inventory(data) {
    try {
        const id = '0';

        const check_material_code = await identical_material_num(data.productCode)
        const check_material_name = await identical_material_name(data.productName)

        if (check_material_code.length > 0) {
            console.log('原物料代碼重複，請重新填寫')
            return ('原物料代碼重複，請重新填寫')
        } else if (check_material_name.length > 0) {
            console.log('原物料名稱重複，請重新填寫')
            return ('原物料名稱重複，請重新填寫')
        } else {
            return new Promise((resolve, reject) => {
                connection.query('INSERT INTO inventory_setup (`id`, `num`, `name`, `date`, `supplier_num`, `start_quantity`, `start_unit`, `start_unit_price`, `start_cost`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [id, data.productCode, data.productName, data.date, data.supplier_num, data.openingQuantity, data.openingUnit, data.openingUnitPrice, data.openingCost], (error, results, fields) => {
                    if (error) {
                        console.error('新增期初原物料錯誤：', error);
                        reject(error);
                    } else {
                        console.log("期初原物料新增成功")
                        resolve("期初原物料新增成功")
                    }
                });
            });
        }
    }
    catch (error) {
        console.log(error)
        return (error)
    }
}

function identical_material_num(data) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM inventory_setup WHERE `num` = ?', data, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function identical_material_name(name) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM inventory_setup WHERE `name` = ?', name, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}



function del_inventory(condition) {
    const deleteQuery = 'DELETE FROM `inventory_setup` WHERE `inventory_setup`.`num` = ?';
    // const deleteQuery = 'UPDATE `m_inventory_setup` SET `status` = ? WHERE `m_inventory_setup`.`m_id` = ?';

    connection.query(deleteQuery, [2, condition], (error, results, fields) => {
        if (error) {
            console.error('刪除資料庫錯誤：', error);
        } else {
            console.log('已成功刪除資料');
        }
    });
}
function update_account_subjects(updatedata) {
    const condition = updatedata.orig
    let updateQuery = 'UPDATE `account_subjects` SET status = ? WHERE `account_subjects`.`fourth` = ?';
    var status = "1";
    if (updatedata.status === 'false') {
        status = "0";
    }
    connection.query(updateQuery, [status, condition], (error, results, fields) => {
        if (error) {
            console.error('修改資料庫錯誤：', error);
        } else {
            console.log('已成功修改資料');
        }
    });

}

async function update_supplier(updatedata) {
    const condition = updatedata.orig

    const check_supplier_code = await identical_supplier_num(updatedata.supplier_num)
    const check_supplier_name = await identical_supplier_name(updatedata.supplier_name)

    let updateQuery = 'UPDATE `supplier` SET status = ? WHERE `supplier`.`supplier_num` = ? AND`supplier`.`status` <> ? ';
    var stat = "1";
    if (updatedata.status === '1') {
        stat = '0';
    }
    if (updatedata.task === "change_state") {
        connection.query(updateQuery, [stat, condition, 2], (error, results, fields) => {
            if (error) {
                console.error('修改資料庫錯誤：', error);
                return ('修改資料庫錯誤：', error)
            } else {
                console.log('已成功修改期初庫存資料');
                return ('已成功修改期初庫存資料')
            }
        });
    }
    else if (updatedata.task === "modify" && updatedata.orig === updatedata.num) {
        if (check_supplier_name.length > 0) {
            return ('供應商名稱重複或與原本相同，請重新填寫')
        }
        else {
            updateQuery = 'UPDATE `supplier` SET supplier_name = ? WHERE `supplier`.`supplier_num` = ? AND`supplier`.`status` <> ? ';
            connection.query(updateQuery, [updatedata.supplier_name, condition, 2], (error, results, fields) => {
                if (error) {
                    console.error('修改資料庫錯誤：', error);
                    return ('修改資料庫錯誤：', error)
                } else {
                    console.log('已成功修改期初庫存資料');
                    return ('已成功修改期初庫存資料')
                }
            });
        }
    }
    else {
        if (check_supplier_code.length > 0) {
            return ('供應商代碼重複或與原本相同，請重新填寫')
            console.log("nulled")
        }
        else {
            updateQuery = 'UPDATE `supplier` SET supplier_num = ? WHERE `supplier`.`supplier_num` = ? AND`supplier`.`status` <> ?';
            connection.query(updateQuery, [updatedata.supplier_num, condition, 2], (error, results, fields) => {
                if (error) {
                    console.error('修改資料庫錯誤：', error);
                    return ('修改資料庫錯誤：', error)
                } else {
                    console.log('已成功修改期初庫存資料');
                    return ('已成功修改期初庫存資料')
                }
            });
        }
    }
}

async function update_value_target(updatedata) {
    const condition = updatedata.orig
    const check_valuetarget_code = await identical_valuetarget_num(updatedata.target_num)
    const check_valuetarget_name = await identical_valuetarget_name(updatedata.target_name, updatedata.category)

    let updateQuery = 'UPDATE `value_target` SET target_status = ? WHERE `value_target`.`target_num` = ? AND`value_target`.`target_status` <> ? ';
    var stat = "1";
    if (updatedata.status === 'false') {
        stat = '0';
    }
    if (updatedata.task === "change_state") {

        connection.query(updateQuery, [stat, condition, 2], (error, results, fields) => {
            if (error) {
                console.error('修改資料庫錯誤：', error);
                return ('已成功修改價值標的狀態')
            } else {
                console.log('已成功修改資料');
                return ('已成功修改價值標的狀態')
            }
        }
        )
    }
    else if (updatedata.task === "update_item" && updatedata.orig === updatedata.target_num) {
        if (check_valuetarget_name.length > 0) {
            return ('價值標的名稱重複與原本相同，請重新填寫')
        }
        else {
            updateQuery = 'UPDATE `value_target` SET target_name = ? WHERE `value_target`.`target_num` = ?  AND`value_target`.`target_status` <> ?';
            connection.query(updateQuery, [updatedata.target_name, condition, 2], (error, results, fields) => {
                if (error) {
                    console.error('修改資料庫錯誤：', error);
                    return (error)
                } else {
                    console.log('已成功價值標的名稱');
                    return ('已成功修改價值標的名稱')

                }
            });
        }

    }
    else {
        if (check_valuetarget_code.length > 0) {
            return ('價值標的代碼重複或與原本相同，請重新填寫')
        }
        else {
            updateQuery = 'UPDATE `value_target` SET target_num = ? WHERE `value_target`.`target_num` = ? AND`value_target`.`target_status` <> ?';
            connection.query(updateQuery, [updatedata.target_num, condition, 2], (error, results, fields) => {
                if (error) {
                    console.error('修改資料庫錯誤：', error);
                    return (error)

                } else {
                    console.log('已成功修改價值標的代碼');
                    return ('已成功修改價值標的代碼')

                }
            });
        }
    }
}




function update_inventory(updatedata) {
    const condition = updatedata.orig
    let updateQuery = 'UPDATE `inventory_setup` SET id = ? WHERE `inventory_setup`.`id` = ?';
    connection.query(updateQuery, [updatedata.id, condition], (error, results, fields) => {
        if (error) {
            console.error('修改資料庫錯誤：', error);
        } else {
            console.log('已成功修改資料');
        }
    });
    updateQuery = 'UPDATE `inventory_setup` SET m_id = ? WHERE `inventory_setup`.`id` = ?';
    connection.query(updateQuery, [updatedata.mid, condition], (error, results, fields) => {
        if (error) {
            console.error('修改資料庫錯誤：', error);
        } else {
            console.log('已成功修改資料');
        }
    });
    updateQuery = 'UPDATE `inventory_setup` SET date = ? WHERE `inventory_setup`.`id` = ?';
    connection.query(updateQuery, [updatedata.date, condition], (error, results, fields) => {
        if (error) {
            console.error('修改資料庫錯誤：', error);
        } else {
            console.log('已成功修改資料');
        }
    });
    updateQuery = 'UPDATE `inventory_setup` SET m_name = ? WHERE `inventory_setup`.`id` = ?';
    connection.query(updateQuery, [updatedata.mname, condition], (error, results, fields) => {
        if (error) {
            console.error('修改資料庫錯誤：', error);
        } else {
            console.log('已成功修改資料');
        }
    });
    updateQuery = 'UPDATE `inventory_setup` SET start_quantity = ? WHERE `inventory_setup`.`id` = ?';
    connection.query(updateQuery, [updatedata.startQ, condition], (error, results, fields) => {
        if (error) {
            console.error('修改資料庫錯誤：', error);
        } else {
            console.log('已成功修改資料');
        }
    });
    updateQuery = 'UPDATE `inventory_setup` SET start_unit = ? WHERE `inventory_setup`.`id` = ?';
    connection.query(updateQuery, [updatedata.startU, condition], (error, results, fields) => {
        if (error) {
            console.error('修改資料庫錯誤：', error);
        } else {
            console.log('已成功修改資料');
        }
    });
    updateQuery = 'UPDATE `inventory_setup` SET start_unit_price = ? WHERE `inventory_setup`.`id` = ?';
    connection.query(updateQuery, [updatedata.startP, condition], (error, results, fields) => {
        if (error) {
            console.error('修改資料庫錯誤：', error);
        } else {
            console.log('已成功修改資料');
        }
    });
    updateQuery = 'UPDATE `inventory_setup` SET start_cost = ? WHERE `inventory_setup`.`id` = ?';
    connection.query(updateQuery, [updatedata.startC, condition], (error, results, fields) => {
        if (error) {
            console.error('修改資料庫錯誤：', error);
        } else {
            console.log('已成功修改資料');
        }
    });
}
function sel_inventory() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM inventory_setup', (error, results, fields) => {
            if (error) {
                console.error('查詢錯誤：', error);
                reject(error);
            } else {
                let arr = obj_to_dict(results)
                // console.log('查詢結果：', arr);
                resolve(arr);
            }
        });
    })
}

function obj_to_dict(data) {
    let arr = []
    data.forEach(element => {
        let transformedData = {};
        Object.entries(element).forEach(([key, value]) => {
            transformedData[key.trim()] = typeof value === 'string' ? value.trim() : value;
        });
        arr.push(transformedData)
    })

    return (arr)
}

function getBomFirstData() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM bom_first', (error, results, fields) => {
            if (error) {
                console.error('查詢 bom_first 錯誤：', error);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//取bom_second_id
function getBomSecondData() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM bom_second', (error, results, fields) => {
            if (error) {
                console.error('查詢 bom_second 錯誤：', error);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//bom_third_id
function getBomThirdData() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM bom_third', (error, results, fields) => {
            if (error) {
                console.error('查詢 bom_third 錯誤：', error);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function getBomDelData() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM del_bom_log', (error, results, fields) => {
            if (error) {
                console.error('查詢 del_bom_log 錯誤：', error);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//取invetory_setup
function getInventorySetupData() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM inventory_setup', (error, results, fields) => {
            if (error) {
                console.error('查詢 inventory_setup 錯誤：', error);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//取價值標的
function getValueTarget(category) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM value_target WHERE category = ?', category, (error, results, fields) => {
            if (error) {
                console.error('查詢 value_target 錯誤：', error);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}


// 計算BOM成本&呈現
async function calculateProductCost(status) {
    try {
        const bomFirstData = await getBomFirstData();
        const bomSecondData = await getBomSecondData();
        const bomThirdData = await getBomThirdData();
        const mInventorySetupData = await getInventorySetupData();
        const productCosts = [];

        for (let i = 0; i < bomFirstData.length; i++) {
            if (bomFirstData[i]['status'] == status) {
                productCosts.push({
                    level: 1,
                    product_id: bomFirstData[i]['product_id'],
                    product_name: bomFirstData[i]['product_name'],
                    status: bomFirstData[i]['status'],
                    total_price: 0,
                    secondData: []
                });
            }
        }

        for (let z = 0; z < productCosts.length; z++) {
            for (let a = 0; a < bomSecondData.length; a++) {
                if (bomSecondData[a]['status'] == status) {
                    let unit_second = 0;
                    if (bomSecondData[a]['product_id'] === productCosts[z]['product_id']) {
                        for (let c = 0; c < mInventorySetupData.length; c++) {
                            if (bomSecondData[a]['product_sec_id'] === mInventorySetupData[c]['m_id']) {
                                unit_second = bomSecondData[a]['use_quantity'] * mInventorySetupData[c]['start_unit_price'];
                                productCosts[z]['secondData'].push({
                                    level: 2,
                                    product_id: bomSecondData[a]['product_id'],
                                    product_sec_id: bomSecondData[a]['product_sec_id'],
                                    product_sec_name: bomSecondData[a]['product_sec_name'],
                                    useage: bomSecondData[a]['use_quantity'],
                                    unit_price: bomSecondData[a]['use_quantity'] * mInventorySetupData[c]['start_unit_price'],
                                    total_price: bomSecondData[a]['use_quantity'] * mInventorySetupData[c]['start_unit_price'],
                                    status: bomSecondData[a]['status'],
                                    thirdData: []
                                })
                            } else {
                                productCosts[z]['secondData'].push({
                                    level: 2,
                                    product_id: bomSecondData[a]['product_id'],
                                    product_sec_id: bomSecondData[a]['product_sec_id'],
                                    product_sec_name: bomSecondData[a]['product_sec_name'],
                                    useage: bomSecondData[a]['use_quantity'],
                                    unit_price: bomSecondData[a]['use_quantity'],
                                    total_price: bomSecondData[a]['use_quantity'],
                                    status: bomSecondData[a]['status'],
                                    thirdData: []
                                })
                            }
                        }
                        productCosts[z]['total_price'] = unit_second;
                        let uniqueArray = productCosts[z]['secondData'].filter((item, index, self) => {
                            return index === self.findIndex((t) => (
                                t.product_id === item.product_id &&
                                t.product_sec_id === item.product_sec_id &&
                                t.product_sec_name === item.product_sec_name &&
                                t.useage === item.useage &&
                                t.unit_price === item.unit_price &&
                                t.total_price === item.total_price &&
                                t.status === item.status
                            ));
                        });
                        productCosts[z]['secondData'] = uniqueArray;
                    }
                }
            }
        }


        for (let a = 0; a < productCosts.length; a++) {
            let total_third = 0;
            for (let b = 0; b < productCosts[a]['secondData'].length; b++) {
                let unit_third = 0;
                for (let c = 0; c < bomThirdData.length; c++) {
                    if (bomThirdData[c]['status'] == status) {
                        if (bomThirdData[c]['product_id'] === productCosts[a]['secondData'][b]['product_id'] && bomThirdData[c]['product_sec_id'] === productCosts[a]['secondData'][b]['product_sec_id']) {
                            for (let z = 0; z < mInventorySetupData.length; z++) {
                                if (bomThirdData[c]['material_id'] === mInventorySetupData[z]['m_id']) {
                                    if (productCosts[a]['secondData'][b]['thirdData'].length === 0) {
                                        unit_third = mInventorySetupData[z]['start_unit_price'] * bomThirdData[c]['use_quantity'];
                                    } else {
                                        unit_third = unit_third + (mInventorySetupData[z]['start_unit_price'] * bomThirdData[c]['use_quantity']);
                                    }
                                    productCosts[a]['secondData'][b]['thirdData'].push({
                                        level: 3,
                                        product_id: bomThirdData[c]['product_id'],
                                        product_sec_id: bomThirdData[c]['product_sec_id'],
                                        product_thr_id: bomThirdData[c]['material_id'],
                                        useage: bomThirdData[c]['use_quantity'],
                                        unit_price: bomThirdData[c]['use_quantity'] * mInventorySetupData[z]['start_unit_price'],
                                        total_price: bomThirdData[c]['use_quantity'] * mInventorySetupData[z]['start_unit_price'],
                                        status: bomThirdData[c]['status']
                                    })
                                }
                            }
                            productCosts[a]['secondData'][b]['total_price'] = unit_third;
                        }
                    }
                }
                if (total_third === 0) {
                    total_third = productCosts[a]['secondData'][b]['total_price'];
                } else {
                    total_third = total_third + productCosts[a]['secondData'][b]['total_price'];
                }
                productCosts[a]['total_price'] = total_third;
            }
        }
        return productCosts;

    } catch (error) {
        console.error(error);
    }
}

// BOM Delete Data Display
async function calculateProductDelCost() {
    try {
        const delData = await getBomDelData();
        return delData;

    } catch (error) {
        console.error(error);
    }
}

function upload_account_subject(name) {
    let arr = read_excel(name)

    //將column name改成英文
    const updatedArr = arr.map((item) => {
        const updatedItem = {};

        Object.keys(item).forEach((key) => {
            if (key === '一階代碼') {
                updatedItem['first'] = item[key];
            } else if (key === '一階中文名') {
                updatedItem['first_subjects_cn'] = item[key];
            } else if (key === '一階英文名') {
                updatedItem['first_subjects_eng'] = item[key];
            } else if (key === '二階代碼') {
                updatedItem['second'] = item[key];
            } else if (key === '二階中文名') {
                updatedItem['second_subjects_cn'] = item[key];
            } else if (key === '二階英文名') {
                updatedItem['second_subjects_eng'] = item[key];
            } else if (key === '三階代碼') {
                updatedItem['third'] = item[key];
            } else if (key === '三階中文名') {
                updatedItem['third_subjects_cn'] = item[key];
            } else if (key === '三階英文名') {
                updatedItem['third_subjects_eng'] = item[key];
            } else if (key === '四階代碼') {
                updatedItem['fourth'] = item[key];
            } else if (key === '四階中文名') {
                updatedItem['fourth_subjects_cn'] = item[key];
            } else if (key === '四階英文名') {
                updatedItem['fourth_subjects_eng'] = item[key];
            } else {
                updatedItem[key] = item[key];
            }
        });
        return updatedItem;
    })

    const status = 1;
    const user = "testing";
    let insertArr = [];
    for (let i = 0; i < updatedArr.length; i++) {
        insertArr.push([updatedArr[i]['供應商代碼'], updatedArr[i]['供應商名稱'], user, status]);
    }
    const query = 'INSERT INTO supplier (supplier_num, supplier_name, update_user, status) VALUES ?';
    connection.query(query, [insertArr], (error, results, fields) => {
        if (error) {
            console.error('寫入資料庫錯誤：', error);
            return;
        } else {
            console.log(results);
            console.log('已成功將資料寫入資料庫');
        }
    });

}

function read_excel(name) {
    const parseExcel = (filename) => {
        console.log(`Reading file: ${filename}`);

        const excelData = XLSX.readFile(filename, { encoding: "big-5" });

        return Object.keys(excelData.Sheets).map(name => ({
            name,
            data: XLSX.utils.sheet_to_json(excelData.Sheets[name]),
        }));
    };

    let tmp = []
    parseExcel(`./uploads/${name}`).forEach(element => {
        element.data.forEach(item => {
            tmp.push(item);
        });
    });

    let arr = obj_to_dict(tmp)
    // console.log(arr)
    // console.log(arr[0]['third'])
    return (arr)
};


async function upload_bom(name) {
    //************一二三階皆要判斷是否在價值標的裡以及價值標的狀態是否為1，同張BOM不同階層不能有重複代碼
    let arr = read_excel(name)

    //取價值標的之產品資料
    const product_target = await getValueTarget("產品")

    //將column name改成英文
    const updatedArr = arr.map((item) => {
        const updatedItem = {};

        Object.keys(item).forEach((key) => {
            if (key === '一階產品代碼') {
                updatedItem['product_id'] = item[key];
            } else if (key === '一階產品名稱') {
                updatedItem['product_name'] = item[key];
            } else if (key === '二階產品代碼') {
                updatedItem['product_sec_id'] = item[key];
            } else if (key === '二階產品名稱') {
                updatedItem['product_sec_name'] = item[key];
            } else if (key === '二階產品使用量(每一單位一階產品)') {
                updatedItem['sec_use_quantity'] = item[key];
            } else if (key === '三階產品代碼') {
                updatedItem['product_thr_id'] = item[key];
            } else if (key === '三階產品使用量(每一單位二階產品)') {
                updatedItem['thr_use_quantity'] = item[key];
            } else {
                updatedItem[key] = item[key];
            }
        });
        return updatedItem;
    })

    const user = "testing";
    let firstInsertArr = [];
    let secInsertArr = [];
    let thirdInsertArr = [];
    let type = 0

    for (let i = 0; i < updatedArr.length; i++) {
        const targetMatch = product_target.find(item => item.target_num === updatedArr[i]['product_id']);
        if (targetMatch) {
            const targetName = targetMatch.target_name;
            if (targetName === updatedArr[i]['product_name']) {
                type = 1;
                firstInsertArr.push([
                    type,
                    updatedArr[i]['product_id'],
                    updatedArr[i]['product_name'],
                    1,
                    user
                ]);
                secInsertArr.push([
                    updatedArr[i]['product_id'],
                    updatedArr[i]['product_sec_id'],
                    updatedArr[i]['product_sec_name'],
                    updatedArr[i]['sec_use_quantity'],
                    1,
                    user,
                ]);
                thirdInsertArr.push([
                    updatedArr[i]['product_id'],
                    updatedArr[i]['product_sec_id'],
                    updatedArr[i]['product_thr_id'],
                    updatedArr[i]['thr_use_quantity'],
                    1,
                    user,
                ]);
            } else {
                res.send(`該產品代碼 ${updatedArr[i]['product_id']} 與名稱 ${updatedArr[i]['product_name']} 不一致`);
                break;
            }
        } else {
            type = 0;
            firstInsertArr.push([
                type,
                updatedArr[i]['product_id'],
                updatedArr[i]['product_name'],
                1,
                user
            ]);
            secInsertArr.push([
                updatedArr[i]['product_id'],
                updatedArr[i]['product_sec_id'],
                updatedArr[i]['product_sec_name'],
                updatedArr[i]['sec_use_quantity'],
                1,
                user,
            ]);
            thirdInsertArr.push([
                updatedArr[i]['product_id'],
                updatedArr[i]['product_sec_id'],
                updatedArr[i]['product_thr_id'],
                updatedArr[i]['thr_use_quantity'],
                1,
                user,
            ]);
        }
    }

    const first_query = 'INSERT INTO bom_first (`type`, `product_id`, `product_name`, `status`, `update_user`) VALUES ?';
    const second_query = 'INSERT INTO bom_second (`product_id`, `product_sec_id`, `product_sec_name`, `use_quantity`, `status`, `update_user`) VALUES ?';
    const third_query = 'INSERT INTO bom_third (`product_id`, `product_sec_id`, `material_id`, `use_quantity`, `status`, `update_user`) VALUES ?';

    connection.query(first_query, [firstInsertArr], (error, results, fields) => {
        if (error) {
            console.error('寫入資料庫錯誤：', error);
            return;
        }
        console.log('已成功將資料寫入資料庫');
        res.send('一階新增成功');
    });

    connection.query(second_query, [secInsertArr], (error, results, fields) => {
        if (error) {
            console.error('寫入資料庫錯誤：', error);
            return;
        }
        console.log('已成功將資料寫入資料庫');
        res.send('二階新增成功');
    });

    connection.query(third_query, [thirdInsertArr], (error, results, fields) => {
        if (error) {
            console.error('寫入資料庫錯誤：', error);
            return;
        }
        console.log('已成功將資料寫入資料庫');
        res.send('三階新增成功');
    });
}

function upload_target(name) {
    let arr = read_excel(name)

    const updatedArr = arr.map((item) => {
        const updatedItem = {};

        Object.keys(item).forEach((key) => {
            if (key === '標的種類(只可填"顧客"、"原料"或"產品")') {
                updatedItem['category'] = item[key];
            } else if (key === '標的代碼') {
                updatedItem['target_num'] = item[key];
            } else if (key === '標的名稱') {
                updatedItem['target_name'] = item[key];
            }
            else {
                updatedItem[key] = item[key];
            }
        });
        return updatedItem;
    })
    // console.log(updatedArr)

    const stat = 1;

    const now = new Date();
    const sqlDatetime = now.toISOString().slice(0, 19).replace('T', ' ');

    const insertValues = updatedArr.map(element => [
        element.category,
        element.target_num,
        element.target_name,
        stat,
        sqlDatetime]);

    const query = 'INSERT INTO value_target (category, target_num, target_name, target_status, update_time) VALUES ?';
    connection.query(query, [insertValues], (error, results, fields) => {
        if (error) {
            console.error('寫入資料庫錯誤：', error);
            return; //這邊看你們要return什麼給前端
        }
        console.log('已成功將資料寫入資料庫');
    });
}

function upload_inventory(name) {
    let arr = read_excel(name)
    let insertArr = [];
    for (let i = 0; i < arr.length; i++) {
        let cost = parseInt(arr[i]['期初數量']) * parseInt(arr[i]['期初單價']);
        insertArr.push([arr[i]['材料代碼'], arr[i]['材料名稱'], arr[i]['期初數量'], arr[i]['期初單位'], arr[i]['期初單價'], cost]);
    }
    const query = 'INSERT INTO inventory_setup (num, name, start_quantity, supplier_num, start_unit, start_unit_price, start_cost) VALUES ?';
    connection.query(query, [insertArr], (error, results, fields) => {
        if (error) {
            console.error('寫入資料庫錯誤：', error);
            return; //這邊看你們要return什麼給前端
        }
        console.log('已成功將資料寫入資料庫');
    });
}

//紀錄原料價格(每當原料有購買進貨調整時就呼叫)
function record_material_cost(data) {
    //建立時間
    const now = new Date();
    const time_now = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const status = 1
    const insert_query = 'INSERT INTO `cost_history` (date, material_id, unit_price, status, update_user) VALUES(?,?,?,?,?)';
    const update_query = 'UPDATE `cost_history` SET `status` = 0 WHERE `material_id` = ?'
    connection.query(insert_query, [time_now, data.material_id, data.unit_price, status], (error, results, fields) => {
        if (error) {
            console.error(error);
            return (error);
        }
        else {
            console.log('原料價格紀錄成功');
            return ('原料價格紀錄成功');
        }
    })
    connection.query(update_query, [data.material_id], (error, results, fields) => {
        if (error) {
            console.error(error);
            return (error);
        }
        else {
            console.log('原料價格紀錄成功');
            return ('原料價格紀錄成功');
        }
    })
}

//取符合日期區間之useage資料
function get_usage_info(start_date, end_date) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM useage WHERE `date` BETWEEN ? AND ?', [start_date, end_date], (error, results, fields) => {
            if (error) {
                // console.error('帳號有誤：', error);
                reject(error);
            } else {
                // console.log(results)
                resolve(results);
            }
        });
    });
}

//取符合日期區間之purchase資料
function get_purchase_info(start_date, end_date) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM purchase WHERE `date` BETWEEN ? AND ?', [start_date, end_date], (error, results, fields) => {
            if (error) {
                // console.error('帳號有誤：', error);
                reject(error);
            } else {
                // console.log(results)
                resolve(results);
            }
        });
    });
}

//取符合日期區間之inventory_setup資料
function get_setup_info() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = `${year}-${month.toString().padStart(2, '0')}-01`;
    // console.log(date)

    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM inventory_setup WHERE `date` = ?', [date], (error, results, fields) => {
            if (error) {
                // console.error('帳號有誤：', error);
                reject(error);
            } else {
                // console.log(results)
                resolve(results);
            }
        });
    });
}

//取符合日期區間之p_inventory_setup資料
// function get_psetup_info() {
//     const now = new Date();
//     const year = now.getFullYear();
//     const month = now.getMonth() + 1;
//     const date = `${year}-${month.toString().padStart(2, '0')}-01`;
//     // console.log(date)

//     return new Promise((resolve, reject) => {
//         connection.query('SELECT * FROM p_inventory_setup WHERE `date` = ?', [date], (error, results, fields) => {
//             if (error) {
//                 // console.error('帳號有誤：', error);
//                 reject(error);
//             } else {
//                 // console.log(results)
//                 resolve(results);
//             }
//         });
//     });
// }

//進銷存
async function psi(date) {

    const inventory_info = await sel_all_inventory_info(date)
    const sales_info = await sel_all_sales(date)

    const data = [];
    let key_counter = 1; // 流水號

    // 格式化(001)
    // const formatkey = (key) => key.toString().padStart(3, '0');

    inventory_info.forEach(inventoryItem => {
        const itemTransactions = sales_info.filter(transaction => transaction.num === inventoryItem.num);
        let total_purchase = 0;
        let total_usage = 0;
        let total_purchase_cost = 0;
        let total_usage_cost = 0;
        let purchase_unit_cost = 0;

        //若沒交易紀錄則為空
        const children = itemTransactions.length > 0 ? itemTransactions.map(transaction => {
            let child = {
                key: `${inventoryItem.num}-${key_counter++}`,
                date: transaction.date,
                product_order: transaction.order_num,
                product_name: transaction.name,
                unit: transaction.unit,
            };

            if (transaction.category === 'purchase') {
                child = {
                    ...child,
                    purchase_num: transaction.amount,
                    purchase_unit_cost: transaction.unit_cost,
                    purchase_total_cost: transaction.total_cost,
                };
                total_purchase += transaction.amount
                total_purchase_cost += transaction.total_cost

            } else if (transaction.category === 'usage') {
                child = {
                    ...child,
                    operating_num: transaction.amount,
                    operating_unit_cost: transaction.unit_cost,
                    operating_total_cost: transaction.total_cost,
                };
                total_usage += transaction.amount
                total_usage_cost += transaction.total_cost
            }

            return child;
        }) : [];


        if (total_purchase != 0) {
            purchase_unit_cost = total_purchase_cost / total_purchase
        }


        data.push({
            key: key_counter++,
            date: '-',
            product_num: inventoryItem.num,
            product_name: inventoryItem.name,
            unit: inventoryItem.start_unit,
            beginningInventory_num: inventoryItem.start_quantity, //期初數量
            beginningInventory_unit_cost: inventoryItem.start_unit_price, //期初單位成本
            beginningInventory_total_cost: inventoryItem.start_cost, //期初總成本
            purchase_num: total_purchase, //進貨總數量
            purchase_unit_cost: purchase_unit_cost, //進貨單位成本
            purchase_total_cost: total_purchase_cost, //進貨總成本
            operating_num: total_usage, // 銷貨總數量
            operating_unit_cost: '-', // 銷貨單位成本
            operating_total_cost: total_usage_cost, // 銷貨總成本
            endingBalance_num: inventoryItem.start_quantity + total_purchase - total_usage, //期末結餘總數量
            endingBalance_unit_cost: 5.29, //期末單位成本
            endingBalance_total_cost: inventoryItem.start_cost + total_purchase_cost - total_usage_cost, //期末結餘總成本
            inventoryShort: 0, // 盤點盈虧
            type: 'more', // 只有沒有明細
            children: children
        });
    });

    console.log(JSON.stringify(data, null, 2));

    return data;

}

//取當月所有期初庫存
function sel_all_inventory_info(date) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM inventory_setup WHERE MONTH(`date`) = MONTH(?) AND YEAR(`date`) = YEAR(?)';
        connection.query(query, [date, date], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//取當月所有交易資料
function sel_all_sales(date) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM inventory_log WHERE MONTH(`date`) = MONTH(?) AND YEAR(`date`) = YEAR(?)';
        connection.query(query, [date, date], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//取庫存資料年月
function get_sales_date(){
    return new Promise((resolve, reject) => {
        const query = 'SELECT DISTINCT YEAR(date) AS year, MONTH(date) AS month FROM inventory_setup ORDER BY year, month;'
        connection.query(query, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

