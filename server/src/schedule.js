import { connect } from './connection.js';//這邊不確定是不是這樣寫
import cron from 'node-cron';

//排程
const processRecords = async () => {
    const connection = await connect();

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const year = lastMonth.getFullYear();
    const month = lastMonth.getMonth() + 1; // JavaScript中月份是從0開始的
    const firstDayLastMonth = `${year}-${month.toString().padStart(2, '0')}-01 00:00:00`;
    const lastDayLastMonth = new Date(year, month, 0);
    const lastDateLastMonth = `${year}-${month.toString().padStart(2, '0')}-${lastDayLastMonth.getDate()} 23:59:59`;

    try {
        connection.query(
            //抓取前個月inventory_setup的資料
            'SELECT * FROM inventory_setup WHERE date >= ? AND date <= ?',
            [firstDayLastMonth, lastDateLastMonth],
            (error, setupRecords) => {
                if (error) throw error;

                setupRecords.forEach(record => {
                    connection.query(
                        //去inventory_log中判斷上個月有沒有這個代碼的交易紀錄
                        'SELECT * FROM inventory_log WHERE num = ? AND date >= ? AND date <= ? ORDER BY date DESC LIMIT 1',
                        [record.num, firstDayLastMonth, lastDateLastMonth],
                        (logError, logRecords) => {
                            if (logError) throw logError;

                            //若有交易紀錄，則把inventory_log中的最後一筆資訊寫入inventory_setup
                            if (logRecords.length > 0) {
                                const logRecord = logRecords[0];
                                connection.query(
                                    'INSERT INTO inventory_setup (num, name, date, supplier_num, start_quantity, start_unit, start_unit_price, start_cost) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?)',
                                    [logRecord.num, record.name, record.supplier_num, logRecord.inventory_updated, logRecord.unit, logRecord.unit_cost_updated, logRecord.total_cost]
                                );
                            }
                            //若沒有交易紀錄，則直接複製前個月的inventory_setup資料並寫入
                            else {
                                connection.query(
                                    'INSERT INTO inventory_setup (num, name, date, supplier_num, start_quantity, start_unit, start_unit_price, start_cost) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?)',
                                    [record.num, record.name, record.supplier_num, record.start_quantity, record.start_unit, record.start_unit_price, record.start_cost]
                                );
                            }
                        }
                    );
                });
            }
        );
    } catch (error) {
        console.error('排程時發生錯誤：', error);
    } finally {
        connection.end();
    }
};


cron.schedule('0 0 0 1 * *', () => {
    console.log('排程開始');
    processRecords();
});
