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
});

router.post('/upload', (req, res) => {
    const data = req.body;
    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    const insertValues = data.map(element => [
        element.一階代碼,
        element.一階中文名,
        element.一階英文名,
        element.二階代碼,
        element.二階中文名,
        element.二階英文名,
        element.三階代碼,
        element.三階中文名,
        element.三階英文名,
        element.四階代碼,
        element.四階中文名,
        element.四階英文名,
        1
    ]);

    const query = 'INSERT INTO account_subjects (first, first_subjects_cn, first_subjects_eng, second, second_subjects_cn, second_subjects_eng,third, third_subjects_cn, third_subjects_eng, fourth, fourth_subjects_cn, fourth_subjects_eng, status) VALUES ?';
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
        const result = await add_purchase(req.body);
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
        const result = await add_purchase(JSON.parse(req.body.ID));
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');

    }
})

router.post('/add_sales', async (req, res) => {
    try {
        const result = await add_sales_record(req.body);
        const result1 = await add_usage(req.body);
        res.send(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');
    }
});

router.post('/upload_sales', async (req, res) => {
    try {
        const result = await upload_sales_record(req.body);
        res.send(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');
    }
});

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
        const result = await register(req.body);
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

router.post('/add_bom_second', async (req, res) => {
    try {
        const result = await add_bom_second(JSON.parse(req.body.ID));
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
        const task = await login(req.body);
        let result = [];
        if (task === '成功登入') {
            result = await getUserInfo(req.body.account);
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
        const result = await resetUserInfo(req.body);
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');

    }
});

router.get('/sel_account_subjects:id', async (req, res) => {
    try {
        const result = await sel_account_subjects(req.params.id);
        let account = Object.values(result.reduce((acc, item) => {
            acc[item.third] = acc[item.third] || {
                third: item.third,
                third_subjects_cn: item.third_subjects_cn,
                third_subjects_eng: item.third_subjects_eng,
                fourthData: []
            };
            acc[item.third].fourthData.push({
                fourth: item.fourth,
                fourth_subjects_cn: item.fourth_subjects_cn,
                fourth_subjects_eng: item.fourth_subjects_eng
            });
            return acc;
        }, {}));
        res.json(account);
        // const result_third = await sel_third_account_subjects(req.params.id);
        // const result_fourth = await sel_fourth_account_subjects(req.params.id);
        // res.json({third: result_third, fourth: result_fourth});
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
    const result = await update_value_target(req.body);
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


router.get('/sel_value_target_customer:id', async (req, res) => {
    try {
        const result = await sel_value_target("顧客", req.params.id);
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');

    }
});

router.get('/sel_value_target_material:id', async (req, res) => {
    try {
        const result = await sel_value_target("原料", req.params.id);
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');

    }
});

router.get('/sel_value_target_product:id', async (req, res) => {
    try {
        const result = await sel_value_target("產品", req.params.id);
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');

    }
});

router.get('/sel_value_target_department:id', async (req, res) => {
    try {
        const result = await sel_value_target("部門", req.params.id);
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
    await del_value_target(req.body.productId);
    res.send('已成功刪除價值標的');
});

router.post('/upload_bom', upload.single('excelFile'), (req, res) => {
    const data = req.body.data;
    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    let firstData = data
        .filter(element => element.一階產品代碼)
        .map(element => [
            0,
            element.一階產品代碼,
            element.一階產品名稱,
            1,
            req.body.userName
        ]);

    let secondData = data
        .filter(element => element.二階產品代碼 && element.一階產品代碼)
        .map(element => [
            element.一階產品代碼,
            element.二階產品代碼,
            element.二階產品名稱,
            element['二階產品使用量(每一單位一階產品)'],
            1,
            req.body.userName
        ]);

    let thirdData = data
        .filter(element => element.三階產品代碼 && element.二階產品代碼 && element.一階產品代碼)
        .map(element => [
            element.一階產品代碼,
            element.二階產品代碼,
            element.三階產品代碼,
            element['三階產品使用量(每一單位二階產品)'],
            1,
            req.body.userName
        ]);

    const first_query = 'INSERT INTO bom_first (`type`, `product_id`, `product_name`, `status`, `update_user`) VALUES ?';
    const second_query = 'INSERT INTO bom_second (`product_id`, `product_sec_id`, `product_sec_name`, `use_quantity`, `status`, `update_user`) VALUES ?';
    const third_query = 'INSERT INTO bom_third (`product_id`, `product_sec_id`, `material_id`, `use_quantity`, `status`, `update_user`) VALUES ?';

    connection.query(first_query, [firstData], (error, results, fields) => {
        if (error) {
            console.error('一階新增錯誤：', error);
            return;
        }
        console.log('一階新增成功');
    });

    connection.query(second_query, [secondData], (error, results, fields) => {
        if (error) {
            console.error('二階新增錯誤：', error);
            return;
        }
        console.log('二階新增成功');
    });

    connection.query(third_query, [thirdData], (error, results, fields) => {
        if (error) {
            console.error('三階新增錯誤：', error);
            return;
        }
        console.log('三階新增成功');
    });

    res.send('成功')
});

router.post('/upload_supplier', (req, res) => {
    const data = req.body.data;
    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    const insertValues = data.map(element => [
        element.供應商代碼,
        element.供應商名稱,
        req.body.userName,
        1
    ]);

    const query = 'INSERT INTO supplier (supplier_num, supplier_name, update_user, status) VALUES ?';
    connection.query(query, [insertValues], (error, results, fields) => {
        if (error) {
            console.error('寫入資料庫錯誤：', error);
            return res.status(500).json({ error: 'Database error' });
        } else {
            res.send({ message: 'Data inserted successfully' });
        }
    });
});

router.post('/upload_target', upload.single('excelFile'), async (req, res) => {
    try {
        // 確保上傳的檔案存在並處理檔案
        if (!req.file) {
            return res.status(400).json({ error: '未選擇檔案' });
        }
        const result = await upload_target(req.file.filename);
        console.log(result)
        if(result !== undefined){
            res.send({ message: '上傳失敗' + result.error });
        }else{
            res.send({ message: '上傳成功' });
        }
        
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
    const result = await add_inventory(req.body)
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

// 期初庫存修改
router.post('/update_inventory', async (req, res) => {
    await update_inventory(req.body)
    res.send('已成功修改期初庫存資料');

});

// 期初庫存刪除
router.post('/del_inventory', async (req, res) => {
    await del_inventory(req.body.produceId);
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

//BOM 第一階選單
router.get('/sel_bomFirstList', async (req, res) => {
    try {
        const result = await sel_bomFirstList();
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');
    }
});

//BOM 第二與三階選單
router.get('/sel_bomSecondList', async (req, res) => {
    try {
        const result = await sel_bomSecondList();
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');
    }
});

router.put('/edit_allStatus', async (req, res) => {
    try {
        const result = await edit_allStatus(req.body.data, req.body.type, req.body.detailType);
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');
    }
});

router.post('/deleteInventory', async (req, res) => {
    try {
        const result = await deleteInventory(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).send('伺服器發生錯誤');
    }
});


router.post('/sel_psi', async (req, res) => {
    try {
        const result = await psi(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).send('伺服器發生錯誤');
    }
});

router.post('/get_psi_product', async (req, res) => {
    try {
        const result = await sel_psi_product(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).send('伺服器發生錯誤');
    }
});

router.get('/get_inventory_date', async (req, res) => {
    try {
        const result = await get_inventory_date();
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');
    }
});

//損益表 Year and Month
router.get('/get_IncomeStatement_Year_Month', async (req, res) => {
    try {
        const result = await getIncomeStatementYM();
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');
    }
});

//損益表 Data
router.get('/get_IncomeStatement:date', async (req, res) => {
    try {
        const result = await getIncomeStatement(req.params.date);
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');
    }
});

//註冊 get 公司名稱
router.get('/get_CompanyName', async (req, res) => {
    try {
        const result = await getCompanyName();
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

    connection.query(deleteQuery_first, [deleteData.productFirstId], (error, results, fields) => {
        if (error) {
            console.error('刪除資料庫錯誤：', error);
        } else {
            console.log('已成功一階刪除資料');
        }
    });

    if (log_data_sec.length !== 0) {
        connection.query(deleteQuery_second, [deleteData.productFirstId], (error, results, fields) => {
            if (error) {
                console.error('刪除資料庫錯誤：', error);
            } else {
                console.log('已成功二階刪除資料');
            }
        });
    }

    if (log_data_third.length !== 0) {
        connection.query(deleteQuery_third, [deleteData.productFirstId], (error, results, fields) => {
            if (error) {
                console.error('刪除資料庫錯誤：', error);
            } else {
                console.log('已成功三階刪除資料');
            }
        });
    }

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
async function add_bom_second(data) {
    try {
        const product_id = data.product_first_id;
        const product_sce_id = data.product_second_id;
        const check = await bom_secid_check(product_id, product_sce_id);
        if (check != 0) {
            console.log('此二階產品已有此代碼存在，請重新輸入新的產品代碼')
            return ('此產品已有此代碼存在，請重新輸入新的產品代碼')
        }
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO `bom_second`(`product_id`, `product_sec_id`, `product_sec_name`, `use_quantity`,  `update_user`,  `update_time`, `status`) VALUES (?, ?, ?, ?, ?, ? ,1)'
            connection.query(query, [data.product_first_id, data.product_second_id, data.product_second_name, data.product_second_quantity, data.update_user, data.update_time], (error, results, fields) => {
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
    const product_sec_id = data['product_second_id'];
    const material_id = data['product_third_id'];
    const quantity = data['product_third_quantity'];
    const check = await bom_thrid_check(product_id, product_sec_id, material_id);
    if (check.length != 0) {
        console.log('此三階產品已有此代碼存在，請重新輸入新的產品代碼')
        return ('此產品已有此代碼存在，請重新輸入新的產品代碼');
    } else {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO `bom_third`( `product_id`, `product_sec_id`, `material_id`, `use_quantity`, `status`, `update_user`) VALUES  (?,?,?,?,?,?)'
            connection.query(query, [product_id, product_sec_id, material_id, quantity, 1, data.update_user], (error, results, fields) => {
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
    const query = 'SELECT * FROM `bom_first` WHERE `product_id` = ? AND status = 1'
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
    const query = 'SELECT * FROM `bom_second` WHERE `product_id` = ? AND `product_sec_id` = ?';
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
//     const query = 'INSERT INTO `purchase`(`date`, `account_subjects_num`,`purchase_num`, `purchase_name`,`purchase_quantity`, `purchase_unit`, `purchase_price`, `supplier_num`,`remark`,`create_user`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
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
    //取當月第一天
    const dateObj = new Date(data.date);
    const firstday = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
    const formattedDate = `${firstday.getFullYear()}-${(firstday.getMonth() + 1).toString().padStart(2, '0')}-${firstday.getDate().toString().padStart(2, '0')} 00:00:00`;

    //檢查是否為當月第一筆交易紀錄
    const sales = await check_sales(data.purchaseId, formattedDate)

    const inventory_info = await sel_inventory_info(data.purchaseId, formattedDate);
    const name = inventory_info.length !== 0 ? inventory_info[0].name : data.purchaseName
    let updated_inventory, total_cost, updated_unit_cost;
    if (sales.length > 0) {//非當月第一筆交易紀錄
        console.log("adding")
        const latest_sales = await get_latest_sales(data.purchaseId)//取前一筆交易紀錄
        // console.log(latest_sales)
        updated_inventory = parseFloat(latest_sales[0].inventory_updated) + parseFloat(data.purchaseQuantity)
        total_cost = parseFloat(data.purchaseQuantity) * parseFloat(data.purchasePrice);
        updated_unit_cost = (latest_sales[0].inventory_updated * latest_sales[0].unit_cost_updated + total_cost) / updated_inventory
    } else {//當月第一筆(從inventory_setup拿資料)
        console.log("enter first")
        const startQuantity = inventory_info.length !== 0 ? inventory_info[0].start_quantity : 0;
        const startCost = inventory_info.length !== 0 ? inventory_info[0].start_cost : 0;
        updated_inventory = parseFloat(startQuantity) + parseFloat(data.purchaseQuantity);
        total_cost = parseFloat(data.purchaseQuantity) * parseFloat(data.purchaseUnitPrice);
        updated_unit_cost = (startCost + total_cost) / updated_inventory;
    }
    const purchase_query = 'INSERT INTO `purchase`(`date`, `order_num`, `account_subjects_num`,`purchase_id`, `purchase_name`,`purchase_quantity`, `purchase_unit`, `purchase_price`, `supplier_num`, `remark`,`create_user`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)'

    const inventory_query = 'INSERT INTO `inventory_log`(`date`, `order_num`, `category`, `num`, `name`, `amount`, `unit`, `unit_cost`, `total_cost`, `inventory_updated`, `unit_cost_updated`) VALUES (?,?,?,?,?,?,?,?,?,?,?)'

    connection.query(purchase_query, [data.date, data.orderNumber, data.accountSubjectsNum, data.purchaseId, data.purchaseName, data.purchaseQuantity, data.purchaseUnit, data.purchasePrice, data.supplierNum, data.remark, data.createUser], (error, results, fields) => {
        if (error) {
            console.error(error);
            return (error);
        } else {
            // let arr = obj_to_dict(results)
            console.log('新增購買成功');
            return ('新增購買成功');

        }
    });
    connection.query(inventory_query, [data.date, data.orderNumber, category, data.purchaseId, name, data.purchaseQuantity, data.purchaseUnit, data.purchaseUnitPrice, data.purchasePrice, updated_inventory, updated_unit_cost], (error, results, fields) => {
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
    const sales = await check_sales(data.targetNum, formattedDate)

    const inventory_info = await sel_inventory_info(data.targetNum, formattedDate)
    // console.log(data.purchase_id, formattedDate)
    // console.log(inventory_info)
    const name = inventory_info.length !== 0 ? inventory_info[0].name : data.targetName;
    let updated_inventory, total_cost, updated_unit_cost;

    if (sales.length > 0) {//非當月第一筆交易紀錄
        console.log("adding")
        const latest_sales = await get_latest_sales(data.targetNum)//取前一筆交易紀錄
        // console.log(latest_sales)
        updated_inventory = latest_sales[0].inventory_updated - data.amount
        total_cost = data.amount * latest_sales[0].unit_cost_updated
        updated_unit_cost = (latest_sales[0].inventory_updated * latest_sales[0].unit_cost_updated - total_cost) / updated_inventory
    } else {//當月第一筆(從inventory_setup拿資料)
        console.log("enter first")
        updated_inventory = inventory_info[0].start_quantity - data.amount
        total_cost = data.amount * inventory_info[0].start_cost
        updated_unit_cost = (inventory_info[0].start_cost - total_cost) / updated_inventory
    }

    const query = 'INSERT INTO `useage`(`date`, `order_num`, `usage_id`, `usage_quantity`, `usage_unit`, `usage_price`, `remark`, `create_user`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    const inventory_query = 'INSERT INTO `inventory_log`(`date`, `order_num`, `category`, `num`, `name`, `amount`, `unit`, `unit_cost`, `total_cost`, `inventory_updated`, `unit_cost_updated`) VALUES (?,?,?,?,?,?,?,?,?,?,?)'

    connection.query(query, [data.date, data.orderNumber, data.targetNum, data.amount, data.unitPrice, data.totalPrice, data.remark, data.createUser], (error, results, fields) => {
        if (error) {
            console.error(error);
            return (error);
        } else {
            // let arr = obj_to_dict(results)
            console.log('新增存貨成功');
            return ('新增存貨成功');

        }
    });
    connection.query(inventory_query, [data.date, data.orderNumber, category, data.targetNum, name, data.amount, data.unitPrice, data.totalPrice, total_cost, updated_inventory, updated_unit_cost], (error, results, fields) => {
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

async function add_sales_record(data) {
    const query = 'INSERT INTO `sales`(`date`, `third_id`, `fourth_id`, `value_target`, `target_num`, `amount`, `unit_price`, `total_price`, `order_number`, `remark`)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    connection.query(query, [data.date, data.thirdId, data.fourthId, data.valueTarget, data.targetNum, data.amount, data.unitPrice, data.totalPrice, data.orderNumber, data.remark], (error, results, fields) => {
        if (error) {
            console.error(error);
            return (error);
        }
        else {
            return ('財會系統紀錄成功');
        }
    })
}

// function add_material_purchase(data) {
//     const query = 'INSERT INTO `m_purchase`(`date`, `account_subjects_num`,`purchase_id`, `purchase_name`, `purchase_quantity`, `purchase_unit`, `purchase_price`, `supplier_num`, `remark`,`create_user`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'

//     connection.query(query, [data.date, data.account_subjects_num, data.material_id, data.material_name, data.purchase_quantity, data.purchase_unit, data.purchase_price, data.supplier_num, data.remark, data.create_user], (error, results, fields) => {
//         if (error) {
//             console.error(error);
//             return(error);
//         } else {
//             // let arr = obj_to_dict(results)
//             console.log('新增存貨成功');
//             return('新增存貨成功');

//         }
//     });
// }

async function upload_sales_record(data) {
    try {
        const account_subjects = await get_account_subjects();
        let validatedData = [];

        for (let element of data) {

            // 確保為整數
            const thirdId = parseInt(element.thirdId, 10);
            const fourthId = parseInt(element.fourthId, 10);

            const subjects_match = account_subjects.find(item => item.third == thirdId && item.fourth == fourthId);
            if (!subjects_match) {
                console.error(`此三階代碼${element.thirdId}或四階代碼${element.fourthId}有錯，無法寫入`);
                return { error: `此三階代碼${element.thirdId}或四階代碼${element.fourthId}有錯，無法寫入` };
            }

            const value_target = await sel_value_target(element.valueTarget, 1);
            const target_match = value_target.find(item => item.target_num == element.targetNum);
            if (!target_match) {
                console.error(`此標的代碼${element.targetNum}有錯，無法寫入`);
                return { error: `此標的代碼${element.targetNum}有錯，無法寫入` };
            }

            validatedData.push([
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
        }

        if (validatedData.length > 0) {
            const message = await insertSalesData(validatedData);
            if (message.affectedRows === validatedData.length) {
                return { message: 'Data inserted successfully' }
            } else if (message.affectedRows === 0 && validatedData.length !== 0) {
                return { error: '上傳失敗，請稍後再試一次' }
            }
        }
    } catch (error) {
        console.error('處理時發生錯誤：', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function insertSalesData(validatedData) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO `sales` (`third_id`, `fourth_id`, `value_target`, `target_num`, `amount`, `unit_price`, `total_price`, `order_number`, `remark`) VALUES ?', [validatedData], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function get_account_subjects() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM account_subjects', (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

async function login(data) {
    try {
        const password = data.password;
        const account = data.account;
        const userinfo = await getUserInfo(account);

        if (userinfo.length > 0) {
            if (password === userinfo[0].password) {
                return ('成功登入');
            } else {
                return ('密碼有誤，請重新輸入');
            }
        } else {
            return ('無此帳號，請重新輸入');
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
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

async function resetUserInfo(data) {
    const check_account = await find_account(data.Account)
    const check_old_password = await find_old_password(data.Account)

    if (data.Password !== data.Password2) {
        return ('新密碼不一致，請重新填寫')
    } else if (check_account.length === 0) {
        return ('無此帳號，請重新填寫')
    } else if (data.Password.length < 6) {
        return ('新密碼長度至少需6位數字，請重新填寫')
    } else if (check_old_password[0].password === data.Password) {
        return ('新密碼不可與舊密碼相同，請重新填寫')
    } else {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE `user` SET `password` = ? WHERE `user`.`account` = ?', [data.Password, data.Account], (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
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
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function find_old_password(data) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM user WHERE `account` = ?', data, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
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
    const deleteQuery = 'UPDATE `purchase` SET `id` = ? WHERE `id` = ?';
    connection.query(deleteQuery, [0, condition.orig], (error, results, fields) => {
        if (error) {
            console.error('刪除資料庫錯誤：', error);
        } else {
            console.log('已成功刪除交易');
        }
    });
}

function update_transaction(condition) {
    let deleteQuery = 'UPDATE `purchase` SET `purchase_id` = ? WHERE `id` = ?';
    connection.query(deleteQuery, [condition.purchase_id, condition], (error, results, fields) => {
        if (error) {
            console.error('刪除資料庫錯誤：', error);
        } else {
            console.log('已成功修改交易代碼');
        }
    });

    deleteQuery = 'UPDATE `purchase` SET `purchase_name` = ? WHERE `id` = ?';
    connection.query(deleteQuery, [condition.purchase_name, condition], (error, results, fields) => {
        if (error) {
            console.error('刪除資料庫錯誤：', error);
        } else {
            console.log('已成功修改交易名稱');
        }
    });
}

async function del_value_target(data) {
    const inventory_log = await sel_inventory_log(data)
    if (inventory_log.length != 0) {
        return (`已有此${data.category}，無法刪除`)
    }
    else {
        const deleteQuery = 'UPDATE `value_target` SET `target_status` = 0 WHERE `target_num` = ?'
        const bom_first = await sel_bom_first(data)
        const bom_second = await sel_bom_second(data)
        const bom_third = await sel_bom_third(data)

        if (bom_first.length != 0) {
            const del_first_query = 'DELETE FROM `bom_first` WHERE `product_name` = ? OR `product_id` = ?';
            connection.query(del_first_query, [data, data], (error, results, fields) => {
                if (error) {
                    console.error('刪除資料庫錯誤：', error);
                } else {
                    console.log('已成功刪除資料');
                    return ('已成功刪除資料')
                }
            });
        }
        else if (bom_second.length != 0) {
            const del_second_query = 'DELETE FROM `bom_second` WHERE `product_sec_name` = ? OR `product_id` = ? OR `product_sec_id` = ?';
            connection.query(del_second_query, [data, data, data], (error, results, fields) => {
                if (error) {
                    console.error('刪除資料庫錯誤：', error);
                } else {
                    console.log('已成功刪除資料');
                    return ('已成功刪除資料')
                }
            });
        }
        else if (bom_third.length != 0) {
            const del_third_query = 'DELETE FROM `bom_third` WHERE `product_id` = ?  OR `product_sec_id` = ?  OR `material_id` = ?';
            connection.query(del_third_query, [data, data, data], (error, results, fields) => {
                if (error) {
                    console.error('刪除資料庫錯誤：', error);
                } else {
                    console.log('已成功刪除資料');
                    return ('已成功刪除資料')
                }
            });
        }

        connection.query(deleteQuery, [data], (error, results, fields) => {
            if (error) {
                console.error('刪除資料庫錯誤：', error);
            } else {
                console.log('已成功刪除資料');
                return ('已成功刪除資料')
            }
        });
    }
}

function sel_account_subjects(status) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT `third`, `third_subjects_cn`, `third_subjects_eng`, `fourth`, `fourth_subjects_cn`, `fourth_subjects_eng` FROM account_subjects WHERE status = ?', [status], (error, results, fields) => {
            if (error) {
                console.error('查詢會科錯誤：', error);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function sel_third_account_subjects(status) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT DISTINCT `third`, `third_subjects_cn`, `third_subjects_eng` FROM account_subjects WHERE status = ?', [status], (error, results, fields) => {
            if (error) {
                console.error('查詢會科錯誤：', error);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function sel_fourth_account_subjects(status) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT DISTINCT `fourth`, `fourth_subjects_cn`, `fourth_subjects_eng` FROM account_subjects WHERE status = ?', [status], (error, results, fields) => {
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
        const companyName = data.CompanyName
        const username = data.Username
        const account = data.Account
        const password = data.Password
        const email = data.Email
        const permission = 1;
        const status = 1;
        const check_account = await register_indtical_account(account)
        const query = 'INSERT INTO `user`(`companyName`, `username`, `account`, `password`, `email`, `permission`, `status`) VALUES  (?, ?, ?, ?, ?, ?, ?)';

        if (check_account.length > 0) {
            return ('帳號已被註冊，請重新填寫')
        }
        else {
            return new Promise((resolve, reject) => {
                connection.query(query, [companyName, username, account, password, email, permission, status], (error, results, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve("註冊成功");
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
                reject(error);
            } else {
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
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function sel_value_target(task, statues) {
    const findingQuery = 'SELECT * FROM value_target WHERE category = ? AND target_status = ?';
    return new Promise((resolve, reject) => {
        connection.query(findingQuery, [task, statues], (error, results, fields) => {
            if (error) {
                console.error('查詢錯誤：', error);
                reject(error);
            } else {
                let arr = obj_to_dict(results);
                resolve(arr);
            }
        });
    });
}

function sel_transaction() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM purchase', (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                let arr = obj_to_dict(results)
                resolve(arr);
            }
        });
    });
}

function sel_supplier() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM supplier', (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                let arr = obj_to_dict(results)
                resolve(arr);
            }
        });
    });
}

async function add_supplier(data) {
    try {
        const id = '0';
        const status = '1';
        const check_supplier_code = await identical_supplier_num(data.supplier_num);
        const check_supplier_name = await identical_supplier_name(data.supplier_name);

        if (check_supplier_code.length > 0) {
            return ('供應商代碼重複，請重新填寫');
        } else if (check_supplier_name.length > 0) {
            return ('供應商名稱重複，請重新填寫');
        } else {
            return new Promise((resolve, reject) => {
                connection.query('INSERT INTO supplier (`id`, `supplier_name`, `supplier_num`, `update_user`, `update_time`, `status`) VALUES (?, ?, ?, ?, ?, ?)', [id, data.supplier_name, data.supplier_num, data.update_user, data.update_time, status], (error, results, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve("供應商新增成功");
                    }
                });
            });
        }
    }
    catch (error) {
        return (error);
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
        const check_valuetarget_code = await identical_valuetarget_num(data.valueTargetCode);
        const check_valuetarget_name = await identical_valuetarget_name(data.name, data.category);
        const check_inventory_num = await identical_material_num(data.valueTargetCode)

        //判斷價值標的原料是否存在於期初庫存
        if (check_inventory_num.length == 0) {
            connection.query('INSERT INTO `inventory_setup`(`num`, `name`, `date`, `supplier_num`, `start_quantity`, `start_unit`, `start_unit_price`, `start_cost`) ' +
                'VALUES (?,?,?,?,?,?,?,?)', [data.valueTargetCode, data.name, data.updateTime, 'supplier1', 0, 0, 0, 0],
                (error, results, fields) => {
                    if (error) {
                        console.error(error);
                    } else {
                        console.log('已成功新增至期初庫存');
                    }
                })
        }
        if (check_valuetarget_code.length > 0) {
            return ('價值標的代碼重複，請重新填寫');
        } else if (check_valuetarget_name.length > 0) {
            return ('價值標的名稱重複，請重新填寫');
        } else {
            return new Promise((resolve, reject) => {
                connection.query('INSERT INTO value_target (`id`, `category`, `target_num`, `target_name`, `target_status`, `update_time`) VALUES (?, ?, ?, ?, ?, ?)', [id, data.category, data.valueTargetCode, data.name, status, data.updateTime], (error, results, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve("價值標的新增成功");
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
        connection.query('SELECT * FROM value_target WHERE `target_num` = ?', [data], (error, results, fields) => {
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
            return ('原物料代碼重複，請重新填寫');
        } else if (check_material_name.length > 0) {
            return ('原物料名稱重複，請重新填寫');
        } else {
            return new Promise((resolve, reject) => {
                connection.query('INSERT INTO inventory_setup ( `num`, `name`, `date`, `supplier_num`, `start_quantity`, `start_unit`, `start_unit_price`, `start_cost`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [data.productCode, data.productName, data.date, '-', data.openingQuantity, data.openingUnit, data.openingUnitPrice, data.openingCost], (error, results, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve("期初原物料新增成功");
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
    const deleteQuery = 'DELETE FROM `inventory_setup` WHERE `num` = ?';
    connection.query(deleteQuery, [condition], (error, results, fields) => {
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
    const check_supplier_code = await identical_supplier_num(updatedata.supplier_num);
    const check_supplier_name = await identical_supplier_name(updatedata.supplier_name);
    let updateQuery = 'UPDATE `supplier` SET status = ? WHERE `supplier_num` = ? AND `status` <> ? ';
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
    } else if (updatedata.task === "modify" && updatedata.orig === updatedata.supplier_num) {
        if (check_supplier_name.length > 0) {
            return ('供應商名稱重複或與原本相同，請重新填寫')
        }
        else {
            updateQuery = 'UPDATE `supplier` SET supplier_name = ? WHERE `supplier_num` = ? AND `status` <> ? ';
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
    } else {
        if (check_supplier_code.length > 0) {
            return ('供應商代碼重複或與原本相同，請重新填寫')
        }
        else {
            updateQuery = 'UPDATE `supplier` SET supplier_num = ? WHERE `supplier`.`supplier_num` = ? AND`supplier`.`status` <> ?';
            connection.query(updateQuery, [updatedata.supplier_num, condition, 2], (error, results, fields) => {
                if (error) {
                    return ('修改資料庫錯誤：', error)
                } else {
                    return ('已成功修改期初庫存資料')
                }
            });
        }
    }
}

async function update_value_target(updatedata) {
    const condition = updatedata.orig
    const check_valuetarget_code = await identical_valuetarget_num(updatedata.target_num);
    const check_valuetarget_name = await identical_valuetarget_name(updatedata.target_name, updatedata.category);
    let updateQuery = 'UPDATE `value_target` SET target_status = ? WHERE `target_num` = ?';
    let state = "1";
    if (updatedata.status === 'false') {
        state = '0';
    }
    if (updatedata.task === "change_state") {
        connection.query(updateQuery, [state, condition, 2], (error, results, fields) => {
            if (error) {
                return ('已成功修改價值標的狀態');
            } else {
                return ('已成功修改價值標的狀態');
            }
        }
        )
    } else if (updatedata.task === "update_item" && updatedata.orig === updatedata.target_num) {
        if (check_valuetarget_name.length > 0) {
            return ('價值標的名稱重複與原本相同，請重新填寫');
        } else {
            updateQuery = 'UPDATE `value_target` SET target_name = ? WHERE `target_num` = ?';
            connection.query(updateQuery, [updatedata.target_name, updatedata.target_num], (error, results, fields) => {
                if (error) {
                    return (error);
                } else {
                    update_name_inventorysetup(updatedata.target_name, updatedata.target_num);
                    return ('已成功修改價值標的名稱');

                }
            });
        }
    } else {
        if (check_valuetarget_code.length > 0) {
            return ('價值標的代碼重複或與原本相同，請重新填寫')
        }
        else {
            updateQuery = 'UPDATE `value_target` SET target_status = ? WHERE `target_num` = ?';
            connection.query(updateQuery, [0, updatedata.target_num], (error, results, fields) => {
                if (error) {
                    return (error);
                } else {
                    return ('已成功修改價值標的代碼')

                }
            });
        }
    }
}

async function update_inventory(updatedata) {
    const start_cost = updatedata.startQ * updatedata.startP;
    const updateQuery = 'UPDATE `inventory_setup` SET num =?, name = ?, start_quantity = ?, start_unit = ?, start_unit_price = ?, start_cost = ? WHERE `id` = ?';
    connection.query(updateQuery, [updatedata.mid, updatedata.mname, updatedata.startQ, updatedata.startU, updatedata.startP, start_cost, updatedata.orig], (error, results, fields) => {
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
                reject(error);
            } else {
                resolve(results);
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
        arr.push(transformedData);
    })
    return (arr);
}

function getBomFirstData() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM bom_first', (error, results, fields) => {
            if (error) {
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
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//取m_invetory_setup
function getInventorySetupData() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM inventory_setup', (error, results, fields) => {
            if (error) {
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
        let productCosts = [];

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

        //去除第一階重複
        const uniqueSet = new Set(productCosts.map(item => JSON.stringify(item)));
        productCosts = Array.from(uniqueSet).map(item => JSON.parse(item));

        //組第二階 Data
        for (let z = 0; z < productCosts.length; z++) {
            let total_second = 0;
            for (let a = 0; a < bomSecondData.length; a++) {
                if (bomSecondData[a]['status'] == status) {
                    let unit_second = 0;
                    if (bomSecondData[a]['product_id'] === productCosts[z]['product_id']) {
                        for (let c = 0; c < mInventorySetupData.length; c++) {
                            if (bomSecondData[a]['product_sec_id'] === mInventorySetupData[c]['num']) {
                                unit_second = bomSecondData[a]['use_quantity'] * mInventorySetupData[c]['start_unit_price'];
                                productCosts[z]['secondData'].push({
                                    level: 2,
                                    product_id: bomSecondData[a]['product_id'],
                                    product_sec_id: bomSecondData[a]['product_sec_id'],
                                    product_sec_name: bomSecondData[a]['product_sec_name'],
                                    useage: bomSecondData[a]['use_quantity'],
                                    unit_price: mInventorySetupData[c]['start_unit_price'],
                                    total_price: bomSecondData[a]['use_quantity'] * mInventorySetupData[c]['start_unit_price'],
                                    status: bomSecondData[a]['status'],
                                    thirdData: []
                                })
                            }
                            // else{
                            //已更改成下拉，故暫時用不到此判斷
                            // productCosts[z]['secondData'].push({
                            //     level:2,
                            //     product_id: bomSecondData[a]['product_id'],
                            //     product_sec_id: bomSecondData[a]['product_sec_id'],
                            //     product_sec_name: bomSecondData[a]['product_sec_name'],
                            //     useage: bomSecondData[a]['use_quantity'],
                            //     unit_price: mInventorySetupData[c]['start_unit_price'],
                            //     total_price: 0,
                            //     status: bomSecondData[a]['status'],
                            //     thirdData: []
                            // })
                            // }
                        }
                        productCosts[z]['total_price'] = unit_second;
                        let uniqueArray = productCosts[z]['secondData'].filter((item, index, self) => {
                            return index === self.findIndex((t) => (
                                t.product_id === item.product_id &&
                                t.product_sec_id === item.product_sec_id &&
                                t.product_sec_name === item.product_sec_name
                            ));
                        });
                        productCosts[z]['secondData'] = uniqueArray;
                        if (total_second === 0) {
                            total_second = unit_second;
                        } else {
                            total_second = total_second + unit_second;
                        }
                    }
                }
                productCosts[z]['total_price'] = total_second;
            }
        }

        //組第三階
        for (let a = 0; a < productCosts.length; a++) {
            let total_third = 0;
            for (let b = 0; b < productCosts[a]['secondData'].length; b++) {
                let unit_third = 0;
                for (let c = 0; c < bomThirdData.length; c++) {
                    if (bomThirdData[c]['status'] == status) {
                        if (bomThirdData[c]['product_id'] === productCosts[a]['secondData'][b]['product_id'] && bomThirdData[c]['product_sec_id'] === productCosts[a]['secondData'][b]['product_sec_id']) {
                            for (let z = 0; z < mInventorySetupData.length; z++) {
                                if (bomThirdData[c]['material_id'] === mInventorySetupData[z]['num']) {
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
                            if (productCosts[a]['secondData'][b]['thirdData'].length !== 0) {
                                productCosts[a]['secondData'][b]['total_price'] = unit_third;
                            }
                        }
                    }
                }
                if (productCosts[a]['secondData'][b]['thirdData'].length !== 0) {
                    if (total_third === 0) {
                        total_third = productCosts[a]['secondData'][b]['total_price'];
                    } else {
                        total_third = total_third + productCosts[a]['secondData'][b]['total_price'];
                    }
                    productCosts[a]['total_price'] = total_third;
                }
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

function read_excel(name) {
    const parseExcel = (filename) => {
        const excelData = XLSX.readFile(filename, { encoding: "big-5" });
        return Object.keys(excelData.Sheets).map(name => ({
            name,
            data: XLSX.utils.sheet_to_json(excelData.Sheets[name]),
        }));
    };

    let tmp = [];
    parseExcel(`./uploads/${name}`).forEach(element => {
        element.data.forEach(item => {
            tmp.push(item);
        });
    });

    let arr = obj_to_dict(tmp);
    return (arr);
};

async function upload_bom(name) {
    let arr = read_excel(name);

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
                if (updatedArr[i]['product_sec_id']) {
                    secInsertArr.push([
                        updatedArr[i]['product_id'],
                        updatedArr[i]['product_sec_id'],
                        updatedArr[i]['product_sec_name'],
                        updatedArr[i]['sec_use_quantity'],
                        1,
                        user,
                    ]);
                    if (updatedArr[i]['product_thr_id']) {
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
            if (updatedArr[i]['product_sec_id']) {
                secInsertArr.push([
                    updatedArr[i]['product_id'],
                    updatedArr[i]['product_sec_id'],
                    updatedArr[i]['product_sec_name'],
                    updatedArr[i]['sec_use_quantity'],
                    1,
                    user,
                ]);
                if (updatedArr[i]['product_thr_id']) {
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
        console.log('一階新增成功');
    });

    connection.query(second_query, [secInsertArr], (error, results, fields) => {
        if (error) {
            console.error('寫入資料庫錯誤：', error);
            return;
        }
        console.log('二階新增成功');
    });

    connection.query(third_query, [thirdInsertArr], (error, results, fields) => {
        if (error) {
            console.error('寫入資料庫錯誤：', error);
            return;
        }
        console.log('三階新增成功');
    });
}

async function upload_target(name) {
    let arr = read_excel(name);

    const updatedArr = arr.map((item) => {
        const updatedItem = {};

        Object.keys(item).forEach((key) => {
            if (key.includes('標的種類')) {
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

    let insertValues = [];
    const state = 1;
    const now = new Date();
    const sqlDatetime = now.toISOString().slice(0, 19).replace('T', ' ');

    for (let element of updatedArr) {
        const target_num = await sel_value_target(element.category, 1)
        const target_exist = target_num.find(item => item.target_num === element.target_num)
        if (target_exist) {
            console.error(`已有此標的代碼${element.target_num}，無法寫入`);
            return { error: `已有此標的代碼${element.target_num}，無法寫入` };
        }

        insertValues.push([element.category, element.target_num, element.target_name, state, sqlDatetime]);
    }

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
    const query = 'INSERT INTO inventory_setup (num, name, start_quantity, start_unit, start_unit_price, start_cost) VALUES ?';
    connection.query(query, [insertArr], (error, results, fields) => {
        if (error) {
            console.error('寫入資料庫錯誤：', error);
            return; //這邊看你們要return什麼給前端
        }
        console.log('已成功將資料寫入資料庫');
    });
}

function sel_bomFirstList() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT target_num, target_name FROM value_target WHERE category = "產品" AND target_status = 1', (error, results, fields) => {
            if (error) {
                console.error('查詢 inventory_setup 錯誤：', error);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function sel_bomSecondList() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT num, name FROM inventory_setup', (error, results, fields) => {
            if (error) {
                console.error('查詢 inventory_setup 錯誤：', error);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//紀錄原料價格(每當原料有購買進貨調整時就呼叫)
function record_material_cost(data) {
    //建立時間
    const now = new Date();
    const time_now = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const status = 1;
    const insert_query = 'INSERT INTO `cost_history` (date, material_id, unit_price, status, update_user) VALUES(?,?,?,?,?)';
    const update_query = 'UPDATE `cost_history` SET `status` = 0 WHERE `material_id` = ?'
    connection.query(insert_query, [time_now, data.material_id, data.unit_price, status], (error, results, fields) => {
        if (error) {
            return (error);
        }
        else {
            return ('原料價格紀錄成功');
        }
    })
    connection.query(update_query, [data.material_id], (error, results, fields) => {
        if (error) {
            return (error);
        }
        else {
            return ('原料價格紀錄成功');
        }
    })
}

function edit_allStatus(data, type, detailType) {
    const newStatus = 0;
    let query = null;

    switch (type) {
        case 'supplier': {
            query = 'UPDATE supplier SET status = ? WHERE supplier_num = ? AND supplier_name = ?';
            break;
        }
        case 'target': {
            query = 'UPDATE value_target SET target_status = ? WHERE target_num = ? AND target_name = ? AND category = ?';
            break;
        }
        default: {
            break;
        }
    }

    for (let i = 0; i < data.length; i++) {
        if (type === 'target') {
            connection.query(query, [newStatus, data[i]['num'], data[i]['name'], detailType], (error, results, fields) => {
                if (error) {
                    console.error('更新失敗:', error);
                }
            });
        } else {
            connection.query(query, [newStatus, data[i]['num'], data[i]['name']], (error, results, fields) => {
                if (error) {
                    console.error('更新失敗:', error);
                }
            });
        }
        if (i === (data.length - 1)) {
            return '更新成功';
        }
    }
}

//批次刪除期初
async function deleteInventory(data) {
    const deletePromises = data.map(async (item) => {
        const salesResults = await checkSalse(item['num'], item['name']);
        const purchaseResults = await checkPurchase(item['num'], item['name']);

        if (salesResults === 0 && purchaseResults === 0) {
            return new Promise((resolve, reject) => {
                connection.query('DELETE FROM `inventory_setup` WHERE num = ? AND name = ?', [item['num'], item['name']], (error, results, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve('刪除成功');
                    }
                });
            });
        }
    });

    try {
        await Promise.all(deletePromises);
        return '批次刪除成功';
    } catch (error) {
        console.error('刪除失敗：', error);
        throw '刪除失敗';
    }
}

async function checkSalse(id, name) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM sales WHERE target_num = ? AND target_name = ?', [id, name], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.length);
            }
        });
    });
}

async function checkMPurchase(id, name) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM inventory_setup WHERE num = ? AND name = ?', [id, name], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.length);
            }
        });
    });
}

async function checkPurchase(id, name) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM purchase WHERE purchase_id = ? AND purchase_name = ?', [id, name], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.length);
            }
        });
    });
}

//取符合日期區間之useage資料
function get_usage_info(start_date, end_date) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM useage WHERE `date` BETWEEN ? AND ?', [start_date, end_date], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
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
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//取符合日期區間之m_inventory_setup資料
function get_msetup_info() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = `${year}-${month.toString().padStart(2, '0')}-01`;

    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM inventory_setup WHERE `date` = ?', [date], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
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

//     return new Promise((resolve, reject) => {
//         connection.query('SELECT * FROM p_inventory_setup WHERE `date` = ?', [date], (error, results, fields) => {
//             if (error) {
//                 reject(error);
//             } else {
//                 resolve(results);
//             }
//         });
//     });
// }

//進銷存
async function psi(date) {
    const inventory_info = await sel_all_inventory_info(date);
    const sales_info = await sel_all_sales(date);
    const data = [];
    let month = date.month
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
            let orderDate = new Date(transaction.date);

            let child = {
                key: `${inventoryItem.num}-${key_counter++}`,
                date: orderDate.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }), // 將日期轉換為台灣時區
                product_order: transaction.order_num,
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

        if (date.month < 10) {
            month = '0' + date.month;
        }

        const parseDate = (dateString) => {
            let parts = dateString.split('/');
            let year = parseInt(parts[0]);
            let month = parseInt(parts[1]) - 1; // 月份从0开始
            let day = parseInt(parts[2]);
            return new Date(year, month, day);
        };

        children.sort((a, b) => {
            let dateA = parseDate(a.date);
            let dateB = parseDate(b.date);
            return dateA - dateB;
        });

        if (!(inventoryItem.start_unit == 0 && itemTransactions.length == 0)) {
            data.push({
                key: key_counter++,
                date: date.year + '-' + month,
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
        }

    });
    return data;
}

// p_inventory_setup 原物料或產品名稱
router.get('/get_psi_Name', async (req, res) => {
    try {
        const result = await getIncomeStatementName();
        res.json(result);
    } catch (error) {
        console.error('發生錯誤：', error);
        res.status(500).send('伺服器發生錯誤');
    }
});

//取當月所有期初庫存
function sel_all_inventory_info(date) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM inventory_setup WHERE MONTH(STR_TO_DATE(`date`, '%Y-%m-%d')) = ? AND YEAR(STR_TO_DATE(`date`,'%Y-%m-%d')) = ?";
        connection.query(query, [parseInt(date.month), parseInt(date.year)], (error, results, fields) => {
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
        const query = "SELECT * FROM inventory_log WHERE MONTH(STR_TO_DATE(`date`, '%Y-%m-%d')) = ? AND YEAR(STR_TO_DATE(`date`,'%Y-%m-%d')) = ?";
        connection.query(query, [date.month, date.year], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//取特定區間的原物料跟產品代碼名稱
function sel_psi_product(date) {
    return new Promise((resolve, reject) => {
        const query = "SELECT DISTINCT  `num`, `name` FROM inventory_setup WHERE MONTH(STR_TO_DATE(`date`, '%Y-%m-%d')) = ? AND YEAR(STR_TO_DATE(`date`,'%Y-%m-%d')) = ?";
        connection.query(query, [date.month, date.year], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//取庫存資料年月
function get_inventory_date() {
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

//更新價值標的名稱
async function update_target_name(data) {
    const bom_first = await sel_bom_first(data.old_name)
    const bom_second = await sel_bom_second(data.old_name)
    const insert_query = 'INSERT INTO `target_log`(`old_name`, `new_name`, `category`, `update_user`, `update_time`) VALUES (?,?,?,?,?)'
    connection.query(insert_query, [data.old_name, data.new_name, data.category, data.update_user, data.update_time], (error, results, fields) => {
        if (error) {
            console.error(error);
            return (error);
        } else {
            console.log('寫入log')
            return ('寫入log');
        }
    })

    const update_bomfirst_query = 'UPDATE `bom_first` SET `product_name`= ? WHERE `product_name` = ? '
    const update_bomsecond_query = 'UPDATE `bom_second` SET `product_sec_name`= ? WHERE `product_sec_name` = ? '
    const update_inventorylog_query = 'UPDATE `inventory_log` SET `name`= ? WHERE `name` = ? '
    const update_inventory_query = 'UPDATE `inventory_setup` SET `name`= ? WHERE `name` = ?'

    if (bom_first.length != 0) {
        connection.query(update_bomfirst_query, [data.new_name, data.old_name], (error, results, fields) => {
            if (error) {
                console.error(error);
                return (error);
            } else {
                console.log('一階名稱更改成功')
                return ('一階名稱更改成功');
            }
        })
    }

    if (bom_second.length != 0) {
        connection.query(update_bomsecond_query, [data.new_name, data.old_name], (error, results, fields) => {
            if (error) {
                console.error(error);
                return (error);
            } else {
                console.log('二階名稱更改成功')
                return ('二階名稱更改成功');
            }
        })
    }

    connection.query(update_inventorylog_query, [data.new_name, data.old_name], (error, results, fields) => {
        if (error) {
            console.error(error);
            return (error);
        } else {
            console.log('交易紀錄名稱更改成功')
            return ('交易紀錄名稱更改成功');
        }
    })

    connection.query(update_inventory_query, [data.new_name, data.old_name], (error, results, fields) => {
        if (error) {
            console.error(error);
            return (error);
        } else {
            console.log('庫存名稱更改成功')
            return ('庫存名稱更改成功');
        }
    })
}

// get 損益表 年月
async function getIncomeStatementYM() {
    const purchaseYM = await getPurchaseYM();
    const salesYM = await getSalesYM();
    const mergedYM = Array.from(new Set([...purchaseYM, ...salesYM].map(item =>
        JSON.stringify({
            year: item.year,
            month: item.month < 10 ? '0' + item.month : '' + item.month
        })
    ))).map(JSON.parse);

    return mergedYM;
}

// get 進貨資料 年月
async function getPurchaseYM() {
    return new Promise((resolve, reject) => {
        const query = "SELECT DISTINCT YEAR(date) AS year, MONTH(date) AS month FROM purchase";
        connection.query(query, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

// get 銷貨資料 年月
async function getSalesYM() {
    return new Promise((resolve, reject) => {
        const query = "SELECT DISTINCT YEAR(date) AS year, MONTH(date) AS month FROM sales";
        connection.query(query, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

// 損益表
async function getIncomeStatement(date) {
    const purchase = await getPurchaseData(date);
    const purchaseData = purchase.map(item => ({
        account_Fourth_Id: item.account_subjects_num,
        price: item.purchase_price
    }));
    const sales = await getSalesData(date);
    const salesData = sales.map(item => ({
        account_Third_Id: item.third_id,
        account_Fourth_Id: item.fourth_id,
        price: item.total_price
    }));
    const beginningInventory = await getBeginningInventory(date);
    const beginningInventoryCost = beginningInventory[0]['start_cost'];
    const finalInventory = await getFinalInventory(date);
    const finalInventoryCost = finalInventory.length !== 0 ? finalInventory[0]['total_cost'] : 0;

    const mergedData = Array.from(new Set([...purchaseData, ...salesData].map(JSON.stringify)), JSON.parse);
    let totalData = [];
    for (let a = 0; a < mergedData.length; a++) {
        const accountIds = await getAccountName(mergedData[a]['account_Fourth_Id']);
        if (accountIds.length !== 0) {
            const newData = {
                id: a,
                account_First_Id: accountIds[0]['first'],
                account_First_Name_Cn: accountIds[0]['first_subjects_cn'],
                account_First_Name_Eng: accountIds[0]['first_subjects_eng'],
                account_Second_Id: accountIds[0]['second'],
                account_Second_Name_Cn: accountIds[0]['second_subjects_cn'],
                account_Second_Name_Eng: accountIds[0]['second_subjects_eng'],
                account_Third_Id: accountIds[0]['third'],
                account_Third_Name_Cn: accountIds[0]['third_subjects_cn'],
                account_Third_Name_Eng: accountIds[0]['third_subjects_eng'],
                account_Fourth_Id: accountIds[0]['fourth'],
                account_Fourth_Name_Cn: accountIds[0]['fourth_subjects_cn'],
                account_Fourth_Name_Eng: accountIds[0]['fourth_subjects_cn'],
                price: mergedData[a]['price']
            }
            totalData.push(newData)
        }
    }
    totalData.push(
        {
            id: mergedData.length + 1,
            account_First_Id: 7,
            account_First_Name_Cn: '營業外收益及費損',
            account_First_Name_Eng: 'non-operating revenue and expenses',
            account_Second_Id: 79,
            account_Second_Name_Cn: '稅前純益（或純損）',
            account_Second_Name_Eng: 'income before tax',
            account_Third_Id: 791,
            account_Third_Name_Cn: '稅前純益（或純損）',
            account_Third_Name_Eng: 'income before tax',
            account_Fourth_Id: 7911,
            account_Fourth_Name_Cn: '稅前純益（或純損）',
            account_Fourth_Name_Eng: 'income before tax',
            price: 0
        },
        {
            id: mergedData.length + 2,
            account_First_Id: 8,
            account_First_Name_Cn: '所得稅費用(或利益)',
            account_First_Name_Eng: 'income tax expense (or benefit)',
            account_Second_Id: 82,
            account_Second_Name_Cn: '稅後純益（或純損）',
            account_Second_Name_Eng: 'income after tax',
            account_Third_Id: 821,
            account_Third_Name_Cn: '稅後純益（或純損）',
            account_Third_Name_Eng: 'income after tax',
            account_Fourth_Id: 8211,
            account_Fourth_Name_Cn: '稅後純益（或純損）',
            account_Fourth_Name_Eng: 'income after tax',
            price: 0
        },
    )


    let grossProfit = 0; //營業毛利
    let netIncome = 0; // 營業淨利
    let account4Cost = 0;
    let account5Cost = 0;
    let account6Cost = 0;
    let account7Cost = 0;
    let account79Cost = 0;

    const layoutData = totalData.reduce((acc, entry) => {
        const {
            account_First_Id,
            account_First_Name_Cn,
            account_First_Name_Eng,
            account_Second_Id,
            account_Second_Name_Cn,
            account_Second_Name_Eng,
            account_Third_Id,
            account_Third_Name_Cn,
            account_Third_Name_Eng,
            account_Fourth_Id,
            account_Fourth_Name_Cn,
            account_Fourth_Name_Eng,
            price
        } = entry;

        const accountFirstId = String(account_First_Id);
        acc[account_First_Id] ||= {
            accountFirstId,
            account_First_Name_Cn,
            account_First_Name_Eng,
            price: 0,
            SecondData: []
        };

        const FirstData = acc[account_First_Id];
        const SecondData = FirstData.SecondData.find(item => (item.accountSecondId == account_Second_Id) || (item.accountSecondId != account_Second_Id && item.account_Second_Name_Cn.trim() === account_Second_Name_Cn.trim())) ||
            (() => {
                let accountSecondId = String(account_Second_Id);
                if (account_Second_Name_Cn.trim() === '營業外收益') {
                    accountSecondId = '71 ~ 74';
                } else if (account_Second_Name_Cn.trim() === '營業外費損') {
                    accountSecondId = '75 ~ 78';
                }
                const newSecondData = {
                    accountSecondId,
                    account_Second_Name_Cn,
                    account_Second_Name_Eng,
                    price: 0,
                    ThirdData: []
                };

                // 以下再次確認該 item 的 SecondData 裡是否已有該 accountSecondId，若沒有再 push 進去
                let existingItemIndex = FirstData.SecondData.findIndex(item => item.accountSecondId == accountSecondId);
                if (existingItemIndex === -1) {
                    FirstData.SecondData.push(newSecondData);
                }

                return newSecondData;
            })();

        const ThirdData = SecondData.ThirdData.find(item => (item.accountThirdId == account_Third_Id) || (item.accountThirdId != account_Third_Id && item.account_Third_Name_Cn.trim() === account_Third_Name_Cn.trim())) ||
            (() => {
                let accountThirdId = String(account_Third_Id);
                if (account_Third_Name_Cn.trim() === '製造費用') {
                    accountThirdId = '515 ~ 518';
                } else if (account_Third_Name_Cn.trim() === '推銷費用') {
                    accountThirdId = '615 ~ 618';
                } else if (account_Third_Name_Cn.trim() === '管理及總務費用') {
                    accountThirdId = '625 ~ 628';
                } else if (account_Third_Name_Cn.trim() === '研究及發展費用') {
                    accountThirdId = '635 ~ 638';
                }

                const newThirdData = {
                    accountThirdId,
                    account_Third_Name_Cn,
                    account_Third_Name_Eng,
                    price: 0,
                    FourthData: []
                };

                // 以下再次確認該 item 的 ThirdData 裡是否已有該 accountThirdId，若沒有再 push 進去
                let existingItemIndex = SecondData.ThirdData.findIndex(item => item.accountThirdId == accountThirdId);
                if (existingItemIndex === -1) {
                    SecondData.ThirdData.push(newThirdData);
                }

                return newThirdData;
            })();
        const existingFourthData = ThirdData.FourthData.find(item => item.accountFourthId == account_Fourth_Id && item.account_Fourth_Name_Cn.trim() === account_Fourth_Name_Cn.trim());
        if (existingFourthData) {
            existingFourthData.price += price;
        } else {
            const accountFourthId = String(account_Fourth_Id);
            const newFourthData = {
                accountFourthId,
                account_Fourth_Name_Cn,
                account_Fourth_Name_Eng,
                price
            };

            // 以下再次確認該 item 的 FourthData 裡是否已有該 accountFourthId，若沒有再 push 進去
            let existingItemIndex = ThirdData.FourthData.findIndex(item => item.accountFourthId == accountFourthId);
            if (existingItemIndex === -1) {
                ThirdData.FourthData.push(newFourthData);
            }
        }

        FirstData.price += price;
        SecondData.price += price;
        ThirdData.price += price;

        const account4 = FirstData.accountFirstId == 4 ?? null; // 找第一階會計代碼有無 4
        const account5 = FirstData.accountFirstId == 5 ?? null; // 找第一階會計代碼有無 5
        const account7 = FirstData.accountFirstId == 7 ?? null; // 找第一階會計代碼有無 7
        const account8 = FirstData.accountFirstId == 8 ?? null; // 找第一階會計代碼有無 8

        if (accountFirstId == 4) {
            const account41 = account4 ? FirstData.SecondData.find(item => item.accountSecondId == 41) : null; // 找第二階會計代碼有無 41
            const account46 = account4 ? FirstData.SecondData.find(item => item.accountSecondId == 46) : null; // 找第二階會計代碼有無 41
            const account47 = account4 ? FirstData.SecondData.find(item => item.accountSecondId == 47) : null; // 找第二階會計代碼有無 41
            const account48 = account4 ? FirstData.SecondData.find(item => item.accountSecondId == 48) : null; // 找第二階會計代碼有無 41
            if (account41) {
                const account411 = account41.ThirdData.find(item => item.accountThirdId == 411) ?? null;
                const account417 = account41.ThirdData.find(item => item.accountThirdId == 417) ?? null;
                const account419 = account41.ThirdData.find(item => item.accountThirdId == 419) ?? null;
                if (account411) {
                    const account4111 = account411.FourthData.find(item => item.accountFourthId == 4111) ?? null;
                    const account4112 = account411.FourthData.find(item => item.accountFourthId == 4112) ?? null;
                    const account4111Cost = account4111 ? account4111.price : 0;
                    const account4112Cost = account4112 ? account4112.price : 0;
                    account411.price = account4111Cost + account4112Cost;
                }
                const account411Cost = account411 ? account411.price : 0;
                const account417Cost = account417 ? account417.price : 0;
                const account419Cost = account419 ? account419.price : 0;

                account41.price = account411Cost - account417Cost - account419Cost;
            }

            const account41Cost = account41 ? account41.price : 0;
            const account46Cost = account46 ? account46.price : 0;
            const account47Cost = account47 ? account47.price : 0;
            const account48Cost = account48 ? account48.price : 0;

            FirstData.price = account41Cost + account46Cost + account47Cost + account48Cost;
            account4Cost = account41Cost + account46Cost + account47Cost + account48Cost;
        } else if (accountFirstId == 5) {
            if (account5) {
                const account51 = account5 ? FirstData.SecondData.find(item => item.accountSecondId == 51) : null;
                const account56 = account5 ? FirstData.SecondData.find(item => item.accountSecondId == 56) : null;
                const account57 = account5 ? FirstData.SecondData.find(item => item.accountSecondId == 57) : null;
                const account58 = account5 ? FirstData.SecondData.find(item => item.accountSecondId == 58) : null;
                const account56Cost = account56 ? account56.price : 0;
                const account57Cost = account57 ? account57.price : 0;
                const account58Cost = account58 ? account58.price : 0;
                if (account51) {
                    const account511 = account51.ThirdData.find(item => item.accountThirdId == 511) ?? null;
                    const account512 = account51.ThirdData.find(item => item.accountThirdId == 512) ?? null;
                    const account513 = account51.ThirdData.find(item => item.accountThirdId == 513) ?? null;
                    const account514 = account51.ThirdData.find(item => item.accountThirdId == 514) ?? null;
                    const account51518 = account51.ThirdData.find(item => item.account_Third_Cn === '製造費用') ?? null;
                    const account512Cost = account512 ? account512.price : 0;
                    const account513Cost = account513 ? account513.price : 0;
                    const account514Cost = account514 ? account514.price : 0;
                    const account51518Cost = account51518 ? account51518.price : 0;

                    if (account511) {
                        const account5111 = account511.FourthData.find(item => item.accountFourthId == 5111) ?? null;
                        account5111.price = (beginningInventoryCost + account512Cost + account513Cost + account514Cost + account51518Cost) - finalInventoryCost;

                        const account5112 = account511.FourthData.find(item => item.accountFourthId == 5112) ?? null;
                        const account5112Cost = account5112 ? account5112.price : 0;
                        account511.price = account5111.price + account5112Cost;
                        account51.price = account511.price;
                    }

                    if (account512) {
                        const account5121 = account512.FourthData.find(item => item.accountFourthId == 5121) ?? null;
                        const account5122 = account512.FourthData.find(item => item.accountFourthId == 5122) ?? null;
                        const account5123 = account512.FourthData.find(item => item.accountFourthId == 5123) ?? null;
                        const account5124 = account512.FourthData.find(item => item.accountFourthId == 5124) ?? null;
                        const account5121Cost = account5121 ? account5121.price : 0;
                        const account5122Cost = account5122 ? account5122.price : 0;
                        const account5123Cost = account5123 ? account5123.price : 0;
                        const account5124Cost = account5124 ? account5124.price : 0;
                        account512.price = account5121Cost + account5122Cost - account5123Cost - account5124Cost;
                    }

                    if (account513) {
                        const account5131 = account513.FourthData.find(item => item.accountFourthId == 5131) ?? null;
                        const account5132 = account513.FourthData.find(item => item.accountFourthId == 5132) ?? null;
                        const account5133 = account513.FourthData.find(item => item.accountFourthId == 5133) ?? null;
                        const account5134 = account513.FourthData.find(item => item.accountFourthId == 5134) ?? null;
                        const account5131Cost = account5131 ? account5131.price : 0;
                        const account5132Cost = account5132 ? account5132.price : 0;
                        const account5133Cost = account5133 ? account5133.price : 0;
                        const account5134Cost = account5134 ? account5134.price : 0;
                        account513.price = account5131Cost + account5132Cost - account5133Cost - account5134Cost;
                    }

                }
                FirstData.price = account51.price + account56Cost + account57Cost + account58Cost;
                account5Cost = account51.price + account56Cost + account57Cost + account58Cost;
            }
        } else if (accountFirstId == 6) {
            account6Cost = FirstData.price;
        } else if (accountFirstId == 7) {
            const account79 = account7 ? FirstData.SecondData.find(item => item.accountSecondId == 79) : null; // 找第二階會計代碼有無 79
            const account7174 = FirstData.SecondData.find(item => item.account_Second_Name_Cn === '營業外收益'); // 找第二階會計名稱有無 營業外收益
            const account7578 = FirstData.SecondData.find(item => item.account_Second_Name_Cn === '營業外費損'); // 找第二階會計名稱有無 營業外費損
            const account7174Cost = account7174 ? account7174.price : 0;
            const account7578Cost = account7578 ? account7578.price : 0;
            FirstData.price = account7174Cost - account7578Cost;
            account7Cost = account7174Cost - account7578Cost;

            if (account79) {
                account79.price = account4Cost - account5Cost - account6Cost + (account7174Cost - account7578Cost);
                account79Cost = account4Cost - account5Cost - account6Cost + (account7174Cost - account7578Cost);

                const account791 = account79.ThirdData.find(item => item.accountThirdId == 791) ?? null;
                account791.price = account79.price;

                if (account791) {
                    const account7911 = account791.FourthData.find(item => item.accountFourthId == 7911) ?? null;
                    account7911.price = account79.price;
                }

            }
        } else if (accountFirstId == 8) {
            const account81 = account8 ? FirstData.SecondData.find(item => item.accountSecondId == 81) : null; // 找第二階會計代碼有無 81
            const account82 = account8 ? FirstData.SecondData.find(item => item.accountSecondId == 82) : null; // 找第二階會計代碼有無 82

            if (account82) {
                if (account81) {
                    const account811 = account81 ? account81.ThirdData.find(item => item.accountThirdId == 811) : null; // 找第三階會計代碼有無 811
                    if (account811) {
                        const account8111 = account811 ? account811.FourthData.find(item => item.accountFourthId == 8111) : null; // 找第四階會計代碼有無 8111
                        if (account8111) {
                            account811.price = account8111.price;
                            account81.price = account811.price;
                            FirstData.price = account81.price;
                        }
                    }
                    account82.price = account81.price - account79Cost;
                } else {
                    account82.price = account79Cost - 0;
                }

                const account821 = account82.ThirdData.find(item => item.accountThirdId == 821) ?? null;
                account821.price = account82.price;

                if (account821) {
                    const account8211 = account821.FourthData.find(item => item.accountFourthId == 8211) ?? null;
                    account8211.price = account82.price;
                }
            }
        }

        grossProfit = account4Cost - account5Cost;
        netIncome = account4Cost - account5Cost - account6Cost + account7Cost;

        return acc;
    }, {});

    // const finalData = {first: Object.values(layoutData)};
    const firstData = Object.values(layoutData);
    const secondData = firstData.flatMap(item => item.SecondData);
    const thirdData = secondData.flatMap(item => item.ThirdData);
    const fourthData = thirdData.flatMap(item => item.FourthData);
    const finalData = {
        First: firstData,
        Second: secondData,
        Third: thirdData,
        Fourth: fourthData
    };
    return finalData;
}

// get 進貨資料
async function getPurchaseData(date) {
    return new Promise((resolve, reject) => {
        const query = "SELECT account_subjects_num, purchase_price FROM purchase WHERE DATE_FORMAT(date, '%Y-%m') = ?";
        connection.query(query, [date], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

// get 銷貨資料
async function getSalesData(date) {
    return new Promise((resolve, reject) => {
        const query = "SELECT third_id, fourth_id, total_price FROM sales WHERE DATE_FORMAT(date, '%Y-%m') = ?";
        connection.query(query, [date], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

// get 指定階層的上幾層會計科目
async function getAccountName(id) {
    return new Promise((resolve, reject) => {
        const query = "SELECT first, first_subjects_cn, first_subjects_eng, second, second_subjects_cn, second_subjects_eng, third, third_subjects_cn, third_subjects_eng, fourth, fourth_subjects_cn, fourth_subjects_eng FROM account_subjects WHERE fourth = ?";
        connection.query(query, [id], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

// get 期初存貨
async function getBeginningInventory(date) {
    return new Promise((resolve, reject) => {
        const query = "SELECT SUM(`start_cost`) AS start_cost FROM inventory_setup WHERE DATE_FORMAT(date, '%Y-%m') = ?";
        connection.query(query, [date], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

// get 期末存貨
async function getFinalInventory(date) {
    return new Promise((resolve, reject) => {
        const query = "SELECT `total_cost` FROM `inventory_log` WHERE DATE_FORMAT(date, '%Y-%m') = ? ORDER BY id DESC LIMIT 1;";
        connection.query(query, [date], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function sel_bom_first(name) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM `bom_first` WHERE `product_name` = ? OR `product_id` = ? ', [name, name], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function sel_bom_second(name) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM `bom_second` WHERE `product_sec_name` = ? OR `product_id` = ? OR `product_sec_id` = ?', [name, name, name], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function sel_bom_third(num) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM `bom_third` WHERE `product_id` = ?  OR `product_sec_id` = ?  OR `material_id` = ?', [num, num, num], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function sel_inventory_log(num) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM `inventory_log` WHERE `num` = ?', [num], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function getCompanyName() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT companyName FROM user LIMIT 1', (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}