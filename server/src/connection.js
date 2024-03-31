// const mysql = require('mysql2');
import mysql from 'mysql2';

export default {
  connect: () => {
    const connection = mysql.createConnection({
      host: '127.0.0.1', // 資料庫主機名稱12
      port: 3306,
      user: 'root', // 資料庫使用者名稱
      password: '', // 資料庫密碼
      database: 'avm_little_knife', // 資料庫名稱
      // database:"AVM"
    });

    // 測試連線
    connection.connect((error) => {
      if (error) {
        console.error('Cannot connet to MySQL', error);
      } else {
        console.log('Connected to MySQL');
      }
    });

  }
}
