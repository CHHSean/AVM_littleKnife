-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-03-07 10:26:34
-- 伺服器版本： 10.4.32-MariaDB
-- PHP 版本： 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `avm_little_knife`
--

-- --------------------------------------------------------

--
-- 資料表結構 `account_subjects`
--

CREATE TABLE `account_subjects` (
  `id` int(11) NOT NULL COMMENT '編碼',
  `first` int(10) NOT NULL COMMENT '一階代碼',
  `first_subjects_cn` varchar(25) NOT NULL COMMENT '一階代碼中文名稱',
  `first_subjects_eng` varchar(50) NOT NULL COMMENT '一階代碼英文名稱',
  `second` int(10) NOT NULL COMMENT '二階代碼',
  `second_subjects_cn` varchar(25) NOT NULL COMMENT '二階代碼中文名稱',
  `second_subjects_eng` varchar(50) NOT NULL COMMENT '二階代碼英文名稱',
  `third` int(10) NOT NULL COMMENT '三階代碼',
  `third_subjects_cn` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '三階科目中文名稱',
  `third_subjects_eng` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '三階科目英文名稱',
  `fourth` int(10) NOT NULL COMMENT '四階代碼',
  `fourth_subjects_cn` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '四階科目中文名稱',
  `fourth_subjects_eng` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '四階科目英文名稱',
  `status` int(11) NOT NULL COMMENT '(1=true,0=false)',
  `update_user` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '修改者'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `account_subjects`
--

INSERT INTO `account_subjects` (`id`, `first`, `first_subjects_cn`, `first_subjects_eng`, `second`, `second_subjects_cn`, `second_subjects_eng`, `third`, `third_subjects_cn`, `third_subjects_eng`, `fourth`, `fourth_subjects_cn`, `fourth_subjects_eng`, `status`, `update_user`) VALUES
(1, 4, '營業收入', 'operating revenue', 41, '銷貨收入', 'sales revenue', 411, '銷貨收入', 'sales revenue', 4111, '銷貨收入', 'sales revenue', 1, NULL),
(2, 4, '營業收入', 'operating revenue', 41, '銷貨收入', 'sales revenue', 411, '銷貨收入', 'sales revenue', 4112, '分期付款銷貨收入', 'installment sales revenue', 1, NULL),
(3, 4, '營業收入', 'operating revenue', 41, '銷貨收入', 'sales revenue', 417, '銷貨退回', 'sales return', 4171, '銷貨退回', 'sales return', 1, NULL),
(4, 4, '營業收入', 'operating revenue', 41, '銷貨收入', 'sales revenue', 419, '銷貨折讓', 'sales discounts and allowances', 4191, '銷貨折讓', 'sales discounts and allowances', 1, NULL),
(5, 4, '營業收入', 'operating revenue', 46, '勞務收入', 'service revenue', 461, '勞務收入 ', 'service revenue', 4611, '勞務收入 ', 'service revenue', 1, NULL),
(6, 4, '營業收入', 'operating revenue', 47, '業務收入', 'agency revenue', 471, '業務收入 ', 'agency revenue', 4711, '業務收入 ', 'agency revenue', 1, NULL),
(7, 4, '營業收入', 'operating revenue', 48, '其他營業收入－其他', 'other operating revenue', 488, '其他營業收入－其他 ', 'other operating revenue', 4888, '其他營業收入－其他other ', 'operating revenue', 1, NULL),
(8, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 511, '銷貨成本 ', 'cost of goods sold', 5111, '銷貨成本 ', 'cost of goods sold', 1, NULL),
(9, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 511, '銷貨成本 ', 'cost of goods sold', 5112, '分期付款銷貨成本 ', 'installment cost of goods sold', 1, NULL),
(10, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 512, '進貨 ', 'purchases', 5121, '進貨 ', 'purchases', 1, NULL),
(11, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 512, '進貨 ', 'purchases', 5122, '進貨費用 ', 'purchase expenses', 1, NULL),
(12, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 512, '進貨 ', 'purchases', 5123, '進貨退出 ', 'purchase returns', 1, NULL),
(13, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 512, '進貨 ', 'purchases', 5124, '進貨折讓 ', 'purchase discounts and allowances', 1, NULL),
(14, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 513, '進料 ', 'material purchased ', 5131, '進料 ', 'material purchased ', 1, NULL),
(15, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 513, '進料 ', 'material purchased ', 5132, '進料費用 ', 'charges on purchased material', 1, NULL),
(16, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 513, '進料 ', 'material purchased ', 5133, '進料退出 ', 'material purchase returns', 1, NULL),
(17, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 513, '進料 ', 'material purchased ', 5134, '進料折讓 ', 'material purchase discounts and allowances', 1, NULL),
(18, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 514, '直接人工 ', 'direct labor', 5141, '直接人工 ', 'direct labor', 1, NULL),
(19, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 515, '製造費用 ', 'manufacturing overhead', 5151, '間接人工 ', 'indirect labor', 1, NULL),
(20, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 515, '製造費用 ', 'manufacturing overhead', 5152, '租金支出 ', 'rent expense', 1, NULL),
(21, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 515, '製造費用 ', 'manufacturing overhead', 5153, '文具用品 ', 'supplies expense', 1, NULL),
(22, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 515, '製造費用 ', 'manufacturing overhead', 5154, '旅費 ', 'travelling expense', 1, NULL),
(23, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 515, '製造費用 ', 'manufacturing overhead', 5155, '運費 ', 'shipping expenses', 1, NULL),
(24, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 515, '製造費用 ', 'manufacturing overhead', 5156, '郵電費 ', 'postage expenses', 1, NULL),
(25, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 515, '製造費用 ', 'manufacturing overhead', 5157, '修繕費 ', 'repair(s) and maintenance expense', 1, NULL),
(26, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 515, '製造費用 ', 'manufacturing overhead', 5158, '包裝費 ', 'packing expenses', 1, NULL),
(27, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 516, '製造費用 ', 'manufacturing overhead', 5161, '水電瓦斯費 ', 'utilities expense', 1, NULL),
(28, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 516, '製造費用 ', 'manufacturing overhead', 5162, '保險費 ', 'insurance expense', 1, NULL),
(29, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 516, '製造費用 ', 'manufacturing overhead', 5163, '加工費 ', 'manufacturing overhead – outsourced', 1, NULL),
(30, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 516, '製造費用 ', 'manufacturing overhead', 5166, '稅捐 ', 'taxes', 1, NULL),
(31, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 516, '製造費用 ', 'manufacturing overhead', 5168, '折舊 ', 'depreciation expense', 1, NULL),
(32, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 516, '製造費用 ', 'manufacturing overhead', 5169, '各項耗竭及攤提 ', 'various amortization', 1, NULL),
(33, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 517, '製造費用 ', 'manufacturing overhead', 5172, '伙食費 ', 'meal expenses', 1, NULL),
(34, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 517, '製造費用 ', 'manufacturing overhead', 5173, '職工福利 ', 'employee benefits/welfare', 1, NULL),
(35, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 517, '製造費用 ', 'manufacturing overhead', 5176, '訓練費 ', 'training (expense)', 1, NULL),
(36, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 517, '製造費用 ', 'manufacturing overhead', 5177, '間接材料 ', 'indirect materials', 1, NULL),
(37, 5, '營業成本', 'operating costs', 51, '銷貨成本', 'cost of goods sold', 518, '製造費用 ', 'manufacturing overhead', 5188, '其他製造費用 ', 'other manufacturing expenses', 1, NULL),
(38, 5, '營業成本', 'operating costs', 56, '勞務成本', 'service costs', 561, '勞務成本 ', 'service costs', 5611, '勞務成本 ', 'service costs', 1, NULL),
(39, 5, '營業成本', 'operating costs', 57, '業務成本', 'agency costs', 571, '業務成本 ', 'agency costs', 5711, '業務成本 ', 'agency costs', 1, NULL),
(40, 5, '營業成本', 'operating costs', 58, '其他營業成本', 'other operating costs', 588, '其他營業成本—其他 ', 'other operating costs', 5888, '其他營業成本—其他 ', 'other operating costs', 1, NULL),
(41, 6, '營業費用', 'operating expenses', 61, '推銷費用', 'selling expenses', 615, '推銷費用 ', 'selling expenses', 6151, '薪資支出 ', 'payroll expense', 1, NULL),
(42, 6, '營業費用', 'operating expenses', 61, '推銷費用', 'selling expenses', 615, '推銷費用 ', 'selling expenses', 6152, '租金支出 ', 'rent expense', 1, NULL),
(43, 6, '營業費用', 'operating expenses', 61, '推銷費用', 'selling expenses', 615, '推銷費用 ', 'selling expenses', 6153, '文具用品 ', 'supplies expense', 1, NULL),
(44, 6, '營業費用', 'operating expenses', 61, '推銷費用', 'selling expenses', 615, '推銷費用 ', 'selling expenses', 6154, '旅費 ', 'travelling expense', 1, NULL),
(45, 6, '營業費用', 'operating expenses', 61, '推銷費用', 'selling expenses', 615, '推銷費用 ', 'selling expenses', 6155, '運費 ', 'shipping expenses', 1, NULL),
(46, 6, '營業費用', 'operating expenses', 61, '推銷費用', 'selling expenses', 615, '推銷費用 ', 'selling expenses', 6156, '郵電費 ', 'postage expenses', 1, NULL),
(47, 6, '營業費用', 'operating expenses', 61, '推銷費用', 'selling expenses', 615, '推銷費用 ', 'selling expenses', 6157, '修繕費 ', 'repair(s) and maintenance (expense)', 1, NULL),
(48, 6, '營業費用', 'operating expenses', 61, '推銷費用', 'selling expenses', 615, '推銷費用 ', 'selling expenses', 6159, '廣告費 ', 'advertisement expense, advertisement', 1, NULL),
(49, 6, '營業費用', 'operating expenses', 61, '推銷費用', 'selling expenses', 616, '推銷費用 ', 'selling expenses', 6161, '水電瓦斯費 ', 'utilities expense', 1, NULL),
(50, 6, '營業費用', 'operating expenses', 61, '推銷費用', 'selling expenses', 616, '推銷費用 ', 'selling expenses', 6162, '保險費 ', 'insurance expense', 1, NULL),
(51, 6, '營業費用', 'operating expenses', 61, '推銷費用', 'selling expenses', 616, '推銷費用 ', 'selling expenses', 6164, '交際費 ', 'entertainment expense', 1, NULL),
(52, 6, '營業費用', 'operating expenses', 61, '推銷費用', 'selling expenses', 616, '推銷費用 ', 'selling expenses', 6165, '捐贈 ', 'donation expense', 1, NULL),
(53, 6, '營業費用', 'operating expenses', 61, '推銷費用', 'selling expenses', 616, '推銷費用 ', 'selling expenses', 6166, '稅捐 ', 'taxes', 1, NULL),
(54, 6, '營業費用', 'operating expenses', 61, '推銷費用', 'selling expenses', 616, '推銷費用 ', 'selling expenses', 6167, '呆帳損失 ', 'loss on uncollectible accounts', 1, NULL),
(55, 6, '營業費用', 'operating expenses', 61, '推銷費用', 'selling expenses', 616, '推銷費用 ', 'selling expenses', 6168, '折舊 ', 'depreciation expense', 1, NULL),
(56, 6, '營業費用', 'operating expenses', 61, '推銷費用', 'selling expenses', 616, '推銷費用 ', 'selling expenses', 6169, '各項耗竭及攤提 ', 'various amortization', 1, NULL),
(57, 6, '營業費用', 'operating expenses', 61, '推銷費用', 'selling expenses', 617, '推銷費用 ', 'selling expenses', 6172, '伙食費 ', 'meal expenses', 1, NULL),
(58, 6, '營業費用', 'operating expenses', 61, '推銷費用', 'selling expenses', 617, '推銷費用 ', 'selling expenses', 6173, '職工福利 ', 'employee benefits/welfare', 1, NULL),
(59, 6, '營業費用', 'operating expenses', 61, '推銷費用', 'selling expenses', 617, '推銷費用 ', 'selling expenses', 6175, '佣金支出 ', 'commission expense', 1, NULL),
(60, 6, '營業費用', 'operating expenses', 61, '推銷費用', 'selling expenses', 617, '推銷費用 ', 'selling expenses', 6176, '訓練費 ', 'Training expense', 1, NULL),
(61, 6, '營業費用', 'operating expenses', 61, '推銷費用', 'selling expenses', 618, '推銷費用 ', 'selling expenses', 6188, '其他推銷費用 ', 'other selling expenses', 1, NULL),
(62, 6, '營業費用', 'operating expenses', 62, '管理及總務費用', 'general & administrative expenses', 625, '管理及總務費用 ', 'general & administrative expenses', 6251, '薪資支出 ', 'payroll expense', 1, NULL),
(63, 6, '營業費用', 'operating expenses', 62, '管理及總務費用', 'general & administrative expenses', 625, '管理及總務費用 ', 'general & administrative expenses', 6252, '租金支出 ', 'rent expense', 1, NULL),
(64, 6, '營業費用', 'operating expenses', 62, '管理及總務費用', 'general & administrative expenses', 625, '管理及總務費用 ', 'general & administrative expenses', 6253, '文具用品 ', 'supplies expense', 1, NULL),
(65, 6, '營業費用', 'operating expenses', 62, '管理及總務費用', 'general & administrative expenses', 625, '管理及總務費用 ', 'general & administrative expenses', 6254, '旅費 ', 'travelling expense', 1, NULL),
(66, 6, '營業費用', 'operating expenses', 62, '管理及總務費用', 'general & administrative expenses', 625, '管理及總務費用 ', 'general & administrative expenses', 6255, '運費 ', 'shipping expenses', 1, NULL),
(67, 6, '營業費用', 'operating expenses', 62, '管理及總務費用', 'general & administrative expenses', 625, '管理及總務費用 ', 'general & administrative expenses', 6256, '郵電費 ', 'postage expenses', 1, NULL),
(68, 6, '營業費用', 'operating expenses', 62, '管理及總務費用', 'general & administrative expenses', 625, '管理及總務費用 ', 'general & administrative expenses', 6257, '修繕費 ', 'repair(s) and maintenance (expense)', 1, NULL),
(69, 6, '營業費用', 'operating expenses', 62, '管理及總務費用', 'general & administrative expenses', 625, '管理及總務費用 ', 'general & administrative expenses', 6259, '廣告費 ', 'advertisement expense, advertisement', 1, NULL),
(70, 6, '營業費用', 'operating expenses', 62, '管理及總務費用', 'general & administrative expenses', 626, '管理及總務費用 ', 'general & administrative expenses', 6261, '水電瓦斯費 ', 'utilities expense', 1, NULL),
(71, 6, '營業費用', 'operating expenses', 62, '管理及總務費用', 'general & administrative expenses', 626, '管理及總務費用 ', 'general & administrative expenses', 6262, '保險費 ', 'insurance expense', 1, NULL),
(72, 6, '營業費用', 'operating expenses', 62, '管理及總務費用', 'general & administrative expenses', 626, '管理及總務費用 ', 'general & administrative expenses', 6264, '交際費 ', 'entertainment expense', 1, NULL),
(73, 6, '營業費用', 'operating expenses', 62, '管理及總務費用', 'general & administrative expenses', 626, '管理及總務費用 ', 'general & administrative expenses', 6265, '捐贈 ', 'donation expense', 1, NULL),
(74, 6, '營業費用', 'operating expenses', 62, '管理及總務費用', 'general & administrative expenses', 626, '管理及總務費用 ', 'general & administrative expenses', 6266, '稅捐 ', 'taxes', 1, NULL),
(75, 6, '營業費用', 'operating expenses', 62, '管理及總務費用', 'general & administrative expenses', 626, '管理及總務費用 ', 'general & administrative expenses', 6267, '呆帳損失 ', 'loss on uncollectible accounts', 1, NULL),
(76, 6, '營業費用', 'operating expenses', 62, '管理及總務費用', 'general & administrative expenses', 626, '管理及總務費用 ', 'general & administrative expenses', 6268, '折舊 ', 'depreciation expense', 1, NULL),
(77, 6, '營業費用', 'operating expenses', 62, '管理及總務費用', 'general & administrative expenses', 626, '管理及總務費用 ', 'general & administrative expenses', 6269, '各項耗竭及攤提 ', 'various amortization', 1, NULL),
(78, 6, '營業費用', 'operating expenses', 62, '管理及總務費用', 'general & administrative expenses', 627, '管理及總務費用 ', 'general & administrative expenses', 6271, '外銷損失 ', 'loss on export sales', 1, NULL),
(79, 6, '營業費用', 'operating expenses', 62, '管理及總務費用', 'general & administrative expenses', 627, '管理及總務費用 ', 'general & administrative expenses', 6272, '伙食費 ', 'meal expenses', 1, NULL),
(80, 6, '營業費用', 'operating expenses', 62, '管理及總務費用', 'general & administrative expenses', 627, '管理及總務費用 ', 'general & administrative expenses', 6273, '職工福利 ', 'employee benefits/welfare', 1, NULL),
(81, 6, '營業費用', 'operating expenses', 62, '管理及總務費用', 'general & administrative expenses', 627, '管理及總務費用 ', 'general & administrative expenses', 6274, '研究發展費用 ', 'research and development expense', 1, NULL),
(82, 6, '營業費用', 'operating expenses', 62, '管理及總務費用', 'general & administrative expenses', 627, '管理及總務費用 ', 'general & administrative expenses', 6275, '佣金支出 ', 'commission expense', 1, NULL),
(83, 6, '營業費用', 'operating expenses', 62, '管理及總務費用', 'general & administrative expenses', 627, '管理及總務費用 ', 'general & administrative expenses', 6276, '訓練費 ', 'Training expense', 1, NULL),
(84, 6, '營業費用', 'operating expenses', 62, '管理及總務費用', 'general & administrative expenses', 627, '管理及總務費用 ', 'general & administrative expenses', 6278, '勞務費 ', 'professional service fees', 1, NULL),
(85, 6, '營業費用', 'operating expenses', 62, '管理及總務費用', 'general & administrative expenses', 628, '管理及總務費用 ', 'general & administrative expenses', 6288, '其他管理及總務費用 ', 'other general and administrative expenses', 1, NULL),
(86, 6, '營業費用', 'operating expenses', 63, '研究及發展費用', 'research and development expenses', 635, '研究及發展費用 ', 'research and development expenses', 6351, '薪資支出 ', 'payroll expense', 1, NULL),
(87, 6, '營業費用', 'operating expenses', 63, '研究及發展費用', 'research and development expenses', 635, '研究及發展費用 ', 'research and development expenses', 6352, '租金支出 ', 'rent expense', 1, NULL),
(88, 6, '營業費用', 'operating expenses', 63, '研究及發展費用', 'research and development expenses', 635, '研究及發展費用 ', 'research and development expenses', 6353, '文具用品 ', 'supplies expense', 1, NULL),
(89, 6, '營業費用', 'operating expenses', 63, '研究及發展費用', 'research and development expenses', 635, '研究及發展費用 ', 'research and development expenses', 6354, '旅費 ', 'travelling expense', 1, NULL),
(90, 6, '營業費用', 'operating expenses', 63, '研究及發展費用', 'research and development expenses', 635, '研究及發展費用 ', 'research and development expenses', 6355, '運費 ', 'shipping expenses', 1, NULL),
(91, 6, '營業費用', 'operating expenses', 63, '研究及發展費用', 'research and development expenses', 635, '研究及發展費用 ', 'research and development expenses', 6356, '郵電費 ', 'postage expenses', 1, NULL),
(92, 6, '營業費用', 'operating expenses', 63, '研究及發展費用', 'research and development expenses', 635, '研究及發展費用 ', 'research and development expenses', 6357, '修繕費 ', 'repair(s) and maintenance (expense)', 1, NULL),
(93, 6, '營業費用', 'operating expenses', 63, '研究及發展費用', 'research and development expenses', 636, '研究及發展費用 ', 'research and development expenses', 6361, '水電瓦斯費 ', 'utilities expense', 1, NULL),
(94, 6, '營業費用', 'operating expenses', 63, '研究及發展費用', 'research and development expenses', 636, '研究及發展費用 ', 'research and development expenses', 6362, '保險費 ', 'insurance expense', 1, NULL),
(95, 6, '營業費用', 'operating expenses', 63, '研究及發展費用', 'research and development expenses', 636, '研究及發展費用 ', 'research and development expenses', 6364, '交際費 ', 'entertainment expense', 1, NULL),
(96, 6, '營業費用', 'operating expenses', 63, '研究及發展費用', 'research and development expenses', 636, '研究及發展費用 ', 'research and development expenses', 6366, '稅捐 ', 'taxes', 1, NULL),
(97, 6, '營業費用', 'operating expenses', 63, '研究及發展費用', 'research and development expenses', 636, '研究及發展費用 ', 'research and development expenses', 6368, '折舊 ', 'depreciation expense', 1, NULL),
(98, 6, '營業費用', 'operating expenses', 63, '研究及發展費用', 'research and development expenses', 636, '研究及發展費用 ', 'research and development expenses', 6369, '各項耗竭及攤提 ', 'various amortization', 1, NULL),
(99, 6, '營業費用', 'operating expenses', 63, '研究及發展費用', 'research and development expenses', 637, '研究及發展費用 ', 'research and development expenses', 6372, '伙食費 ', 'meal expenses', 1, NULL),
(100, 6, '營業費用', 'operating expenses', 63, '研究及發展費用', 'research and development expenses', 637, '研究及發展費用 ', 'research and development expenses', 6373, '職工福利 ', 'employee benefits/welfare', 1, NULL),
(101, 6, '營業費用', 'operating expenses', 63, '研究及發展費用', 'research and development expenses', 637, '研究及發展費用 ', 'research and development expenses', 6376, '訓練費 ', 'Training expense', 1, NULL),
(102, 6, '營業費用', 'operating expenses', 63, '研究及發展費用', 'research and development expenses', 637, '研究及發展費用 ', 'research and development expenses', 6378, '其他研究發展費用 ', 'other research and development expenses', 1, NULL),
(103, 7, '營業外收益及費損', 'non-operating revenue and expenses', 71, '營業外收益', 'non-operating revenue ', 711, '利息收入 ', 'interest revenue', 7111, '利息收入 ', 'interest revenue/income', 1, NULL),
(104, 7, '營業外收益及費損', 'non-operating revenue and expenses', 71, '營業外收益', 'non-operating revenue ', 715, '兌換利益 ', 'foreign exchange gain', 7151, '兌換利益 ', 'foreign exchange gain', 1, NULL),
(105, 7, '營業外收益及費損', 'non-operating revenue and expenses', 71, '營業外收益', 'non-operating revenue ', 716, '處分投資收益 ', 'gain on disposal of investments', 7161, '處分投資收益 ', 'gain on disposal of investments', 1, NULL),
(106, 7, '營業外收益及費損', 'non-operating revenue and expenses', 71, '營業外收益', 'non-operating revenue ', 717, '處分資產溢價收入 ', 'gain on disposal of assets', 7171, '處分資產溢價收入 ', 'gain on disposal of assets', 1, NULL),
(107, 7, '營業外收益及費損', 'non-operating revenue and expenses', 74, '營業外收益', 'non-operating revenue ', 748, '其他營業外收益 ', 'other non-operating revenue', 7481, '捐贈收入 ', 'donation income', 1, NULL),
(108, 7, '營業外收益及費損', 'non-operating revenue and expenses', 74, '營業外收益', 'non-operating revenue ', 748, '其他營業外收益 ', 'other non-operating revenue', 7482, '租金收入 ', 'rent revenue/income', 1, NULL),
(109, 7, '營業外收益及費損', 'non-operating revenue and expenses', 74, '營業外收益', 'non-operating revenue ', 748, '其他營業外收益 ', 'other non-operating revenue', 7483, '佣金收入 ', 'commission revenue/income', 1, NULL),
(110, 7, '營業外收益及費損', 'non-operating revenue and expenses', 74, '營業外收益', 'non-operating revenue ', 748, '其他營業外收益 ', 'other non-operating revenue', 7484, '出售下腳及廢料收入 ', 'revenue from sale of scraps', 1, NULL),
(111, 7, '營業外收益及費損', 'non-operating revenue and expenses', 74, '營業外收益', 'non-operating revenue ', 748, '其他營業外收益 ', 'other non-operating revenue', 7485, '存貨盤盈 ', 'gain on physical inventory', 1, NULL),
(112, 7, '營業外收益及費損', 'non-operating revenue and expenses', 74, '營業外收益', 'non-operating revenue ', 748, '其他營業外收益 ', 'other non-operating revenue', 7487, '壞帳轉回利益 ', 'gain on reversal of bad debts', 1, NULL),
(113, 7, '營業外收益及費損', 'non-operating revenue and expenses', 74, '營業外收益', 'non-operating revenue ', 748, '其他營業外收益 ', 'other non-operating revenue', 7488, '其他營業外收益－其他 ', 'other non-operating revenue– other items', 1, NULL),
(114, 7, '營業外收益及費損', 'non-operating revenue and expenses', 75, '營業外費損', 'non-operating expenses', 751, '利息費用 ', 'interest expense', 7511, '利息費用 ', 'interest expense', 1, NULL),
(115, 7, '營業外收益及費損', 'non-operating revenue and expenses', 75, '營業外費損', 'non-operating expenses', 753, '投資損失 ', 'investment loss', 7531, '金融資產評價損失 ', 'loss on valuation of financial asset', 1, NULL),
(116, 7, '營業外收益及費損', 'non-operating revenue and expenses', 74, '營業外收益', 'non-operating revenue ', 748, '其他營業外收益 ', 'other non-operating revenue', 7485, '存貨盤盈 ', 'gain on physical inventory', 1, NULL),
(117, 7, '營業外收益及費損', 'non-operating revenue and expenses', 74, '營業外收益', 'non-operating revenue ', 748, '其他營業外收益 ', 'other non-operating revenue', 7487, '壞帳轉回利益 ', 'gain on reversal of bad debts', 1, NULL),
(118, 7, '營業外收益及費損', 'non-operating revenue and expenses', 74, '營業外收益', 'non-operating revenue ', 748, '其他營業外收益 ', 'other non-operating revenue', 7488, '其他營業外收益－其他 ', 'other non-operating revenue– other items', 1, NULL),
(119, 7, '營業外收益及費損', 'non-operating revenue and expenses', 75, '營業外費損', 'non-operating expenses', 751, '利息費用 ', 'interest expense', 7511, '利息費用 ', 'interest expense', 1, NULL),
(120, 7, '營業外收益及費損', 'non-operating revenue and expenses', 75, '營業外費損', 'non-operating expenses', 753, '投資損失 ', 'investment loss', 7531, '金融資產評價損失 ', 'loss on valuation of financial asset', 1, NULL),
(121, 7, '營業外收益及費損', 'non-operating revenue and expenses', 75, '營業外費損', 'non-operating expenses', 753, '投資損失 ', 'investment loss', 7532, '金融負債評價損失 ', 'loss on valuation of financial liability', 1, NULL),
(122, 7, '營業外收益及費損', 'non-operating revenue and expenses', 75, '營業外費損', 'non-operating expenses', 753, '投資損失 ', 'investment loss', 7533, '採權益法認列之投資損失 ', 'investment loss recognized under equity method', 1, NULL),
(123, 7, '營業外收益及費損', 'non-operating revenue and expenses', 75, '營業外費損', 'non-operating expenses', 754, '兌換損失 ', 'foreign exchange loss', 7541, '兌換損失 ', 'foreign exchange loss', 1, NULL),
(124, 7, '營業外收益及費損', 'non-operating revenue and expenses', 75, '營業外費損', 'non-operating expenses', 755, '處分資產損失 ', 'loss on disposal of assets', 7551, '處分資產損失 ', 'loss on disposal of assets', 1, NULL),
(125, 7, '營業外收益及費損', 'non-operating revenue and expenses', 75, '營業外費損', 'non-operating expenses', 756, '處分投資損失 ', 'loss on disposal of investments', 7561, '處分投資損失 ', 'loss on disposal of investments', 1, NULL),
(126, 7, '營業外收益及費損', 'non-operating revenue and expenses', 78, '營業外費損', 'non-operating expenses', 788, '其他營業外費損 ', 'other non-operating expenses', 7881, '停工損失 ', 'loss on work stoppages', 1, NULL),
(127, 7, '營業外收益及費損', 'non-operating revenue and expenses', 78, '營業外費損', 'non-operating expenses', 788, '其他營業外費損 ', 'other non-operating expenses', 7882, '災害損失 ', 'casualty loss', 1, NULL),
(128, 7, '營業外收益及費損', 'non-operating revenue and expenses', 78, '營業外費損', 'non-operating expenses', 788, '其他營業外費損 ', 'other non-operating expenses', 7885, '存貨盤損 ', 'loss on physical inventory', 1, NULL),
(129, 7, '營業外收益及費損', 'non-operating revenue and expenses', 78, '營業外費損', 'non-operating expenses', 788, '其他營業外費損 ', 'other non-operating expenses', 7886, '存貨跌價及呆滯損失 ', 'loss for market price decline and obsolete and slo', 1, NULL),
(130, 7, '營業外收益及費損', 'non-operating revenue and expenses', 78, '營業外費損', 'non-operating expenses', 788, '其他營業外費損 ', 'other non-operating expenses', 7888, '其他營業外費損－其他 ', 'other non-operating expenses– other', 1, NULL),
(131, 7, '營業外收益及費損', 'non-operating revenue and expenses', 79, '稅前純益（或純損）', ' income before tax', 791, '稅前純益（或純損） ', 'income before tax', 7911, '稅前純益（或純損） ', 'income before tax', 1, NULL),
(132, 8, '所得稅費用(或利益)', 'income tax expense (or benefit)', 81, '稅前純益（或純損）', ' income before tax', 811, '所得稅費用(或利益) ', 'income tax expense (or benefit)', 8111, '所得稅費用(或利益) ', 'income tax expense (or benefit)', 1, NULL),
(133, 8, '所得稅費用(或利益)', 'income tax expense (or benefit)', 82, '稅後純益（或純損）', 'income after tax', 821, '稅後純益（或純損） ', 'income after tax', 8211, '稅後純益（或純損） ', 'income after tax', 1, NULL);

-- --------------------------------------------------------

--
-- 資料表結構 `bom_first`
--

CREATE TABLE `bom_first` (
  `id` int(11) NOT NULL COMMENT '編號',
  `type` int(11) NOT NULL COMMENT '0:不存在於價值標的產品\r\n1:已存在於價值標的產品',
  `product_id` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '產品代碼',
  `product_name` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '產品名稱',
  `status` int(11) NOT NULL COMMENT '狀態(1:True,0:False)',
  `update_user` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '更新人員',
  `update_time` datetime NOT NULL DEFAULT current_timestamp() COMMENT '更新時間'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `bom_first`
--

INSERT INTO `bom_first` (`id`, `type`, `product_id`, `product_name`, `status`, `update_user`, `update_time`) VALUES
(1, 0, 'A01', '產品A', 1, 'testing', '2024-01-25 10:55:39'),
(2, 0, 'A02', '產品B', 1, 'testing', '2024-01-25 10:55:39'),
(31, 0, 'A05', '產品E', 1, 'testing', '2024-01-25 17:54:00'),
(32, 0, 'A06', '產品F', 1, 'testing', '2024-01-25 17:54:00');

-- --------------------------------------------------------

--
-- 資料表結構 `bom_first_tmp`
--

CREATE TABLE `bom_first_tmp` (
  `id` int(11) NOT NULL COMMENT '編號',
  `product_id` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '產品代碼',
  `product_name` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '產品名稱',
  `product_sec_id` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '二階產品代碼',
  `use_quantity` int(11) NOT NULL COMMENT '使用量',
  `status` int(11) NOT NULL COMMENT '狀態(1:True,0:False)',
  `update_user` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '更新人員',
  `update_time` datetime DEFAULT current_timestamp() COMMENT '更新時間'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `bom_second`
--

CREATE TABLE `bom_second` (
  `id` int(11) NOT NULL COMMENT '編號',
  `product_id` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '一階產品代碼',
  `product_sec_id` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '二階產品代碼',
  `product_sec_name` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '二階產品名稱',
  `use_quantity` float NOT NULL COMMENT '使用量',
  `status` int(11) NOT NULL COMMENT '狀態(1:True,0:False)',
  `update_user` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '更新人員',
  `update_time` datetime NOT NULL DEFAULT current_timestamp() COMMENT '更新時間'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `bom_second`
--

INSERT INTO `bom_second` (`id`, `product_id`, `product_sec_id`, `product_sec_name`, `use_quantity`, `status`, `update_user`, `update_time`) VALUES
(1, 'A01', 'product_1', 'Product_Name_1', 2.22, 1, 'testing', '2024-01-25 10:55:39'),
(2, 'A02', 'product_2', 'Product_Name_2', 1.05, 1, 'testing', '2024-01-25 10:55:39'),
(31, 'A05', 'product_7', 'Product_Name_7', 2.00105, 1, 'testing', '2024-01-25 17:54:00'),
(32, 'A06', 'product_8', 'Product_Name_8', 1, 1, 'testing', '2024-01-25 17:54:00');

-- --------------------------------------------------------

--
-- 資料表結構 `bom_second_tmp`
--

CREATE TABLE `bom_second_tmp` (
  `id` int(11) NOT NULL COMMENT '編號',
  `product_id` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '一階產品代碼	',
  `product_sec_id` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '二階產品代碼	',
  `product_sec_name` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '二階產品名稱	',
  `material_id` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '原物料代碼',
  `use_quantity` int(11) NOT NULL COMMENT '使用量',
  `update_user` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '更新人員',
  `update_time` datetime DEFAULT current_timestamp() COMMENT '更新時間'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `bom_third`
--

CREATE TABLE `bom_third` (
  `id` int(11) NOT NULL COMMENT '編號',
  `product_id` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '一階產品代碼',
  `product_sec_id` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '二階產品代碼',
  `material_id` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '三階產品代碼',
  `use_quantity` float NOT NULL COMMENT '使用量',
  `status` int(11) NOT NULL COMMENT '狀態(1:True,0:False)',
  `update_user` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '更新人員',
  `update_time` datetime NOT NULL DEFAULT current_timestamp() COMMENT '更新時間'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `bom_third`
--

INSERT INTO `bom_third` (`id`, `product_id`, `product_sec_id`, `material_id`, `use_quantity`, `status`, `update_user`, `update_time`) VALUES
(1, 'A02', 'product_2', 'product_3', 3.00005, 1, 'testing', '2024-01-25 10:55:39'),
(12, 'A06', 'product_8', 'product_9', 3.05524, 1, 'testing', '2024-01-25 17:54:00');

-- --------------------------------------------------------

--
-- 資料表結構 `customer_expense`
--

CREATE TABLE `customer_expense` (
  `id` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp() COMMENT '日期',
  `account_subjects_num` int(11) NOT NULL COMMENT '會科代碼',
  `cust_num` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '顧客代碼',
  `cust_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '顧客名稱',
  `unit_price` int(11) NOT NULL COMMENT '單價',
  `service_time` int(11) NOT NULL COMMENT '服務次數',
  `total_expense` int(11) NOT NULL COMMENT '總花費',
  `remark` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '備註',
  `create_user` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '使用者'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `del_bom_log`
--

CREATE TABLE `del_bom_log` (
  `id` int(11) NOT NULL,
  `product_id` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '一階產品代碼',
  `product_sec_id` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '二階產品代碼',
  `material_id` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '三階產品代碼',
  `del_level` int(3) NOT NULL,
  `del_user` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '刪除人員',
  `del_time` datetime DEFAULT current_timestamp() COMMENT '刪除時間'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `inventory_log`
--

CREATE TABLE `inventory_log` (
  `id` int(11) NOT NULL,
  `date` datetime NOT NULL COMMENT '時間',
  `order_num` varchar(50) NOT NULL COMMENT '產品單號',
  `category` varchar(25) NOT NULL COMMENT '"purchase"為買\r\n"usage"為賣',
  `num` varchar(50) NOT NULL COMMENT '產品/原料代碼',
  `name` varchar(50) NOT NULL COMMENT '產品/原料名稱',
  `amount` int(11) NOT NULL COMMENT '買/賣 數量',
  `unit` varchar(25) NOT NULL COMMENT '單位',
  `unit_cost` float NOT NULL COMMENT '單價',
  `total_cost` float NOT NULL COMMENT '總價',
  `inventory_updated` int(11) NOT NULL COMMENT '更新庫存總量',
  `unit_cost_updated` float NOT NULL COMMENT '更新單價成本'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `inventory_log`
--

INSERT INTO `inventory_log` (`id`, `date`, `order_num`, `category`, `num`, `name`, `amount`, `unit`, `unit_cost`, `total_cost`, `inventory_updated`, `unit_cost_updated`) VALUES
(1, '2024-01-01 00:00:00', 'Order010', 'purchase', 'product_8', 'Product_Name_8', 54, 'pcs', 81.07, 4377.78, 132, 36.7105),
(2, '2024-01-03 00:00:00', 'Order016', 'purchase', 'product_8', 'Product_Name_8', 53, 'pcs', 16.18, 857.54, 185, 30.8288),
(3, '2024-01-04 00:00:00', 'Usage003', 'usage', 'product_8', 'Product_Name_8', 29, 'pcs', 20.9253, 894.035, 156, 30.8288),
(4, '2024-01-11 00:00:00', 'Order021', 'purchase', 'product_8', 'Product_Name_8', 88, 'pcs', 14.19, 1248.72, 244, 24.8279),
(5, '2024-01-12 00:00:00', 'Usage022', 'usage', 'product_8', 'Product_Name_8', 30, 'pcs', 26.669, 744.837, 214, 24.8279),
(6, '2024-01-15 00:00:00', 'Order001', 'purchase', 'product_8', 'Product_Name_8', 66, 'pcs', 14.06, 927.96, 280, 22.2898),
(7, '2024-01-16 00:00:00', 'Usage014', 'usage', 'product_8', 'Product_Name_8', 81, 'pcs', 76.306, 1805.47, 199, 22.2898),
(8, '2024-01-17 00:00:00', 'Usage010', 'usage', 'product_8', 'Product_Name_8', 96, 'pcs', 56.7082, 2139.82, 103, 22.2898),
(9, '2024-01-19 00:00:00', 'Order019', 'purchase', 'product_8', 'Product_Name_8', 87, 'pcs', 99.21, 8631.27, 190, 57.5112),
(10, '2024-01-01 00:00:00', 'Order010', 'purchase', 'product_8', 'Product_Name_8', 54, 'pcs', 81.07, 4377.78, 244, 62.725),
(11, '2024-01-03 00:00:00', 'Order016', 'purchase', 'product_8', 'Product_Name_8', 53, 'pcs', 16.18, 857.54, 243, 48.4966),
(12, '2024-01-04 00:00:00', 'Usage003', 'usage', 'product_8', 'Product_Name_8', 29, 'pcs', 20.9253, 1667.82, 161, 57.5112),
(13, '2024-01-11 00:00:00', 'Order021', 'purchase', 'product_8', 'Product_Name_8', 88, 'pcs', 14.19, 1248.72, 278, 43.798),
(14, '2024-01-12 00:00:00', 'Usage022', 'usage', 'product_8', 'Product_Name_8', 30, 'pcs', 26.669, 1725.34, 160, 57.5112),
(15, '2024-01-15 00:00:00', 'Order001', 'purchase', 'product_8', 'Product_Name_8', 66, 'pcs', 14.06, 927.96, 256, 46.3089),
(16, '2024-01-16 00:00:00', 'Usage014', 'usage', 'product_8', 'Product_Name_8', 81, 'pcs', 76.306, 4658.41, 109, 57.5112),
(17, '2024-01-17 00:00:00', 'Usage010', 'usage', 'product_8', 'Product_Name_8', 96, 'pcs', 56.7082, 5521.08, 94, 57.5112),
(18, '2024-01-19 00:00:00', 'Order019', 'purchase', 'product_8', 'Product_Name_8', 87, 'pcs', 99.21, 8631.27, 277, 70.6079),
(19, '2024-02-16 09:52:00', 'Usage011', 'usage', 'product_8', 'Product_Name_8', 50, 'pcs', 12.5, 625, 327, 60.5112),
(20, '2024-02-16 09:52:00', 'Order020', 'purchase', 'product_8', 'Product_Name_8', 100, 'pcs', 20, 2000, 227, 72.6079);

-- --------------------------------------------------------

--
-- 資料表結構 `inventory_setup`
--

CREATE TABLE `inventory_setup` (
  `id` int(11) NOT NULL,
  `num` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '代碼	',
  `name` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '名稱	',
  `date` datetime NOT NULL DEFAULT current_timestamp() COMMENT '日期',
  `supplier_num` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '供應商代碼',
  `start_quantity` int(11) NOT NULL COMMENT '期初數量',
  `start_unit` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '期初單位	',
  `start_unit_price` float NOT NULL COMMENT '期初單價	',
  `start_cost` float NOT NULL COMMENT '期初成本	'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `inventory_setup`
--

INSERT INTO `inventory_setup` (`id`, `num`, `name`, `date`, `supplier_num`, `start_quantity`, `start_unit`, `start_unit_price`, `start_cost`) VALUES
(1, 'material_1', 'Material_Name_1', '2024-01-01 00:00:00', 'supplier1', 81, 'kg', 46, 3726),
(2, 'material_2', 'Material_Name_2', '2024-01-01 00:00:00', 'supplier1', 92, 'kg', 49, 4508),
(3, 'material_3', 'Material_Name_3', '2024-01-01 00:00:00', 'supplier1', 16, 'kg', 42, 672),
(4, 'material_4', 'Material_Name_4', '2024-01-01 00:00:00', 'supplier1', 47, 'kg', 49, 2303),
(5, 'material_5', 'Material_Name_5', '2024-01-01 00:00:00', 'supplier1', 68, 'kg', 23, 1564),
(6, 'material_6', 'Material_Name_6', '2024-01-01 00:00:00', 'supplier1', 11, 'kg', 14, 154),
(7, 'material_7', 'Material_Name_7', '2024-01-01 00:00:00', 'supplier1', 35, 'kg', 13, 455),
(8, 'material_8', 'Material_Name_8', '2024-01-01 00:00:00', 'supplier1', 58, 'kg', 7, 406),
(9, 'material_9', 'Material_Name_9', '2024-01-01 00:00:00', 'supplier1', 55, 'kg', 37, 2035),
(10, 'material_10', 'Material_Name_10', '2024-01-01 00:00:00', 'supplier1', 6, 'kg', 26, 156),
(11, 'product_1', 'Product_Name_1', '2024-01-01 00:00:00', 'supplier1', 66, 'pcs', 17, 1122),
(12, 'product_2', 'Product_Name_2', '2024-01-01 00:00:00', 'supplier1', 36, 'pcs', 16, 576),
(13, 'product_3', 'Product_Name_3', '2024-01-01 00:00:00', 'supplier1', 36, 'pcs', 28, 1008),
(14, 'product_4', 'Product_Name_4', '2024-01-01 00:00:00', 'supplier1', 8, 'pcs', 8, 64),
(15, 'product_5', 'Product_Name_5', '2024-01-01 00:00:00', 'supplier1', 4, 'pcs', 4, 16),
(16, 'product_6', 'Product_Name_6', '2024-01-01 00:00:00', 'supplier1', 58, 'pcs', 15, 870),
(17, 'product_7', 'Product_Name_7', '2024-01-01 00:00:00', 'supplier1', 33, 'pcs', 50, 1650),
(18, 'product_8', 'Product_Name_8', '2024-01-01 00:00:00', 'supplier1', 78, 'pcs', 6, 468),
(24, 'product_9', 'Product_Name_9', '2024-01-25 00:00:00', '-', 2, 'pcs', 20, 40);

-- --------------------------------------------------------

--
-- 資料表結構 `purchase`
--

CREATE TABLE `purchase` (
  `id` int(11) NOT NULL,
  `date` datetime DEFAULT NULL COMMENT '日期',
  `order_num` varchar(25) NOT NULL COMMENT '訂單號碼',
  `account_subjects_num` int(11) NOT NULL COMMENT '會科代碼',
  `purchase_id` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '採購材料代碼	',
  `purchase_name` varchar(250) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `purchase_quantity` int(11) NOT NULL COMMENT '採購數量',
  `purchase_unit` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '採購單位	',
  `purchase_price` float NOT NULL COMMENT '採購成本',
  `supplier_num` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '供應商代碼',
  `remark` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '備註',
  `create_user` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '建立者'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `purchase`
--

INSERT INTO `purchase` (`id`, `date`, `order_num`, `account_subjects_num`, `purchase_id`, `purchase_name`, `purchase_quantity`, `purchase_unit`, `purchase_price`, `supplier_num`, `remark`, `create_user`) VALUES
(1, '2024-01-01 00:00:00', 'Order010', 4111, 'product_8', '', 54, 'pcs', 81.07, 'supplier', '', 'test'),
(2, '2024-01-03 00:00:00', 'Order016', 4111, 'product_8', '', 53, 'pcs', 16.18, 'supplier', '', 'test'),
(3, '2024-01-11 00:00:00', 'Order021', 4111, 'product_8', '', 88, 'pcs', 14.19, 'supplier', '', 'test'),
(4, '2024-01-15 00:00:00', 'Order001', 4111, 'product_8', '', 66, 'pcs', 14.06, 'supplier', '', 'test'),
(5, '2024-01-19 00:00:00', 'Order019', 4111, 'product_8', '', 87, 'pcs', 99.21, 'supplier', '', 'test'),
(6, '2024-01-01 00:00:00', 'Order010', 4111, 'product_8', '', 54, 'pcs', 81.07, 'supplier', '', 'test'),
(7, '2024-01-03 00:00:00', 'Order016', 4111, 'product_8', '', 53, 'pcs', 16.18, 'supplier', '', 'test'),
(8, '2024-01-11 00:00:00', 'Order021', 4111, 'product_8', '', 88, 'pcs', 14.19, 'supplier', '', 'test'),
(9, '2024-01-15 00:00:00', 'Order001', 4111, 'product_8', '', 66, 'pcs', 14.06, 'supplier', '', 'test'),
(10, '2024-01-19 00:00:00', 'Order019', 4111, 'product_8', '', 87, 'pcs', 99.21, 'supplier', '', 'test'),
(11, '2024-02-16 09:20:00', 'Order2024021601', 4111, 'product_8', '', 50, 'pcs', 625, 'supplier', '', 'test'),
(12, '2024-02-16 09:20:00', 'Order2024021602', 4112, 'product_8', '', 4, 'pcs', 50, 'supplier', '', 'test'),
(13, '2024-02-16 09:20:00', 'Order2024021603', 4171, 'product_8', '', 2, 'pcs', 25, 'supplier', '', 'test'),
(14, '2024-02-16 09:20:00', 'Order2024021604', 4191, 'product_8', '', 1, 'pcs', 12.5, 'supplier', '', 'test'),
(15, '2024-02-16 09:20:00', 'Order2024021605', 4611, 'product_8', '', 10, 'pcs', 130, 'supplier', '', 'test'),
(16, '2024-02-16 09:20:00', 'Order2024021606', 4711, 'product_8', '', 10, 'pcs', 130, 'supplier', '', 'test'),
(17, '2024-02-16 09:20:00', 'Order2024021607', 4888, 'product_8', '', 15, 'pcs', 195, 'supplier', '', 'test');

-- --------------------------------------------------------

--
-- 資料表結構 `sales`
--

CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp() COMMENT '日期',
  `third_id` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '三階科目代碼',
  `fourth_id` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '四階科目代碼',
  `value_target` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '標的種類',
  `target_num` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '標的代碼',
  `target_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '標的名稱',
  `amount` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '數量',
  `unit_price` int(11) NOT NULL COMMENT '單價',
  `total_price` int(11) NOT NULL COMMENT '總價',
  `order_number` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '單號',
  `remark` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '備註'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `sales`
--

INSERT INTO `sales` (`id`, `date`, `third_id`, `fourth_id`, `value_target`, `target_num`, `target_name`, `amount`, `unit_price`, `total_price`, `order_number`, `remark`) VALUES
(1, '2024-01-25 11:09:00', '511', '5111', '產品', 'A01', '', '1', 10, 10, '202401251110', '-'),
(2, '2024-01-25 11:10:00', '512', '5121', '產品', 'A01', '', '10', 2, 20, '20240125111001', NULL),
(3, '2024-02-16 09:46:00', '511', '5111', '產品', 'A01', '', '48', 13, 600, '20240216001', '-'),
(4, '2024-02-16 09:46:00', '511', '5112', '產品', 'A01', '', '2', 13, 25, '20240216002', '-'),
(5, '2024-02-16 09:46:00', '512', '5121', '產品', 'A01', '', '45', 13, 563, '20240216003', '-'),
(6, '2024-02-16 09:46:00', '512', '5122', '產品', 'A01', '', '5', 13, 63, '20240216004', '-'),
(7, '2024-02-16 09:46:00', '512', '5123', '產品', 'A01', '', '3', 13, 38, '20240216005', '-'),
(8, '2024-02-16 09:46:00', '512', '5124', '產品', 'A01', '', '1', 1, 1, '20240216006', '-'),
(9, '2024-02-16 09:46:00', '513', '5131', '產品', 'A01', '', '18', 8, 135, '20240216007', '-'),
(10, '2024-02-16 09:46:00', '513', '5132', '產品', 'A01', '', '2', 8, 15, '20240216008', '-'),
(11, '2024-02-16 09:46:00', '513', '5133', '產品', 'A01', '', '1', 8, 8, '20240216009', '-'),
(12, '2024-02-16 09:46:00', '513', '5134', '產品', 'A01', '', '1', 1, 1, '20240216010', '-'),
(13, '2024-02-16 09:46:00', '514', '5141', '產品', 'A01', '', '10', 14, 135, '20240216011', '-'),
(14, '2024-02-16 09:46:00', '515~518', '5151', '產品', 'A01', '', '5', 14, 68, '20240216012', '-'),
(15, '2024-02-16 09:46:00', '515~518', '5152', '產品', 'A01', '', '1', 3000, 3000, '20240216013', '-'),
(16, '2024-02-16 09:46:00', '515~518', '5155', '產品', 'A01', '', '30', 10, 300, '20240216014', '-'),
(17, '2024-02-16 09:46:00', '515~518', '5156', '產品', 'A01', '', '1', 300, 300, '20240216015', '-'),
(18, '2024-02-16 09:46:00', '515~518', '5158', '產品', 'A01', '', '100', 0, 20, '20240216016', '-'),
(19, '2024-02-16 09:46:00', '515~518', '5161', '產品', 'A01', '', '1', 1200, 1200, '20240216017', '-'),
(20, '2024-02-16 09:46:00', '515~518', '5163', '產品', 'A01', '', '35', 14, 473, '20240216018', '-'),
(21, '2024-02-16 09:46:00', '515~518', '5166', '產品', 'A01', '', '1', 12, 12, '20240216019', '-'),
(22, '2024-02-16 09:46:00', '515~518', '5168', '產品', 'A01', '', '3', 3, 8, '20240216020', '-'),
(23, '2024-02-16 09:46:00', '515~518', '5169', '產品', 'A01', '', '8', 1, 10, '20240216021', '-'),
(24, '2024-02-16 09:46:00', '515~518', '5177', '產品', 'A01', '', '8', 0, 2, '20240216022', '-'),
(25, '2024-02-16 09:46:00', '515~518', '5188', '產品', 'A01', '', '12', 0, 5, '20240216023', '-'),
(26, '2024-02-16 09:46:00', '561', '5611', '產品', 'A01', '', '6', 100, 600, '20240216024', '-'),
(27, '2024-02-16 09:46:00', '571', '5711', '產品', 'A01', '', '3', 80, 240, '20240216025', '-'),
(28, '2024-02-16 09:46:00', '588', '5888', '產品', 'A01', '', '1', 800, 800, '20240216026', '-'),
(29, '2024-02-16 09:46:00', '615~618', '6151', '產品', 'A01', '', '2', 80, 160, '20240216027', '-'),
(30, '2024-02-16 09:46:00', '615~618', '6167', '產品', 'A01', '', '3', 13, 38, '20240216028', '-'),
(31, '2024-02-16 09:46:00', '615~618', '6188', '產品', 'A01', '', '2', 11, 21, '20240216029', '-'),
(32, '2024-02-16 09:46:00', '625~628', '6251', '產品', 'A01', '', '2', 80, 160, '20240216030', '-'),
(33, '2024-02-16 09:46:00', '625~628', '6288', '產品', 'A01', '', '2', 10, 20, '20240216031', '-'),
(34, '2024-02-16 09:46:00', '635~638', '6351', '產品', 'A01', '', '2', 80, 160, '20240216032', '-'),
(35, '2024-02-16 09:46:00', '635~638', '6373', '產品', 'A01', '', '2', 40, 80, '20240216033', '-'),
(36, '2024-02-16 09:46:00', '635~638', '6378', '產品', 'A01', '', '1', 150, 150, '20240216034', '-'),
(37, '2024-02-16 09:46:00', '711', '7111', '產品', 'A01', '', '8', 2, 18, '20240216035', '-'),
(38, '2024-02-16 09:46:00', '716', '7161', '產品', 'A01', '', '2', 20, 40, '20240216036', '-'),
(39, '2024-02-16 09:46:00', '748', '7484', '產品', 'A01', '', '100', 1, 60, '20240216037', '-'),
(40, '2024-02-16 09:46:00', '748', '7488', '產品', 'A01', '', '2', 14, 27, '20240216038', '-'),
(41, '2024-02-16 09:46:00', '788', '7881', '產品', 'A01', '', '1', 200, 200, '20240216039', '-'),
(42, '2024-02-16 09:46:00', '788', '7888', '產品', 'A01', '', '1', 1, 1, '20240216040', '-'),
(44, '2024-02-16 09:46:00', '811', '8111', '產品', 'A01', '', '1', 1800, 1800, '20240216042', '-'),
(52, '2024-02-17 17:50:00', '411', '4111', '產品', 'A02', '', '2', -20, -40, '20240217175001', NULL),
(53, '2024-03-07 16:26:00', '411', '4111', '產品', 'A02', '', '2', 3, 6, '00000', NULL),
(54, '2024-03-07 16:31:00', '411', '4111', '產品', 'A02', '', '2', 5, 10, '0000', NULL);

-- --------------------------------------------------------

--
-- 資料表結構 `supplier`
--

CREATE TABLE `supplier` (
  `id` int(11) NOT NULL COMMENT '編號',
  `supplier_num` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '供應商代碼',
  `supplier_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '供應商名稱',
  `update_user` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '更新人員',
  `update_time` datetime DEFAULT current_timestamp(),
  `status` int(11) NOT NULL COMMENT '狀態(1:true 0:false)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `supplier`
--

INSERT INTO `supplier` (`id`, `supplier_num`, `supplier_name`, `update_user`, `update_time`, `status`) VALUES
(1, 'S001', '供應商1', 'testing', '2024-01-25 17:10:10', 1),
(2, 'S002', '供應商2', 'testing', '2024-01-25 17:10:10', 1),
(3, 'S003', '供應商3', 'testing', '2024-01-25 17:10:10', 1),
(4, 'S004', '供應商4', 'testing', '2024-01-25 17:10:10', 1),
(5, 'S005', '供應商5', 'testing', '2024-01-25 17:10:10', 1);

-- --------------------------------------------------------

--
-- 資料表結構 `useage`
--

CREATE TABLE `useage` (
  `id` int(11) NOT NULL COMMENT '編號',
  `date` datetime NOT NULL DEFAULT current_timestamp() COMMENT '日期',
  `order_num` varchar(25) NOT NULL COMMENT '訂單號碼',
  `usage_id` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '使用材料代碼',
  `usage_quantity` int(11) NOT NULL COMMENT '使用量',
  `usage_unit` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '使用單位',
  `usage_price` float NOT NULL COMMENT '使用成本',
  `remark` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '備註',
  `create_user` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '建立者'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `useage`
--

INSERT INTO `useage` (`id`, `date`, `order_num`, `usage_id`, `usage_quantity`, `usage_unit`, `usage_price`, `remark`, `create_user`) VALUES
(1, '2024-01-04 00:00:00', 'Usage003', 'product_8', 29, 'pcs', 20.9253, '', 'test'),
(2, '2024-01-12 00:00:00', 'Usage022', 'product_8', 30, 'pcs', 26.669, '', 'test'),
(3, '2024-01-16 00:00:00', 'Usage014', 'product_8', 81, 'pcs', 76.306, '', 'test'),
(4, '2024-01-17 00:00:00', 'Usage010', 'product_8', 96, 'pcs', 56.7082, '', 'test'),
(5, '2024-01-04 00:00:00', 'Usage003', 'product_8', 29, 'pcs', 20.9253, '', 'test'),
(6, '2024-01-12 00:00:00', 'Usage022', 'product_8', 30, 'pcs', 26.669, '', 'test'),
(7, '2024-01-16 00:00:00', 'Usage014', 'product_8', 81, 'pcs', 76.306, '', 'test'),
(8, '2024-01-17 00:00:00', 'Usage010', 'product_8', 96, 'pcs', 56.7082, '', 'test');

-- --------------------------------------------------------

--
-- 資料表結構 `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `companyName` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '公司名稱',
  `username` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '使用者名稱',
  `account` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '帳號',
  `password` varchar(300) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '密碼',
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '信箱',
  `permission` int(11) NOT NULL COMMENT '權限',
  `status` int(11) NOT NULL COMMENT '狀態(1:true 0:false)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `user`
--

INSERT INTO `user` (`id`, `companyName`, `username`, `account`, `password`, `email`, `permission`, `status`) VALUES
(1, 'xx公司', 'testing', 'testing', '937e8d5fbb48bd4949536cd65b8d35c426b80d2f830c5c308e2cdec422ae2244', 'testing@gmail.com', 1, 1);

-- --------------------------------------------------------

--
-- 資料表結構 `value_target`
--

CREATE TABLE `value_target` (
  `id` int(11) NOT NULL,
  `category` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '種類',
  `target_num` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '標的代碼',
  `target_name` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '標的名稱',
  `target_status` int(1) NOT NULL COMMENT '狀態(0:false, 1:true)',
  `update_time` datetime DEFAULT current_timestamp() COMMENT '更新時間'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `value_target`
--

INSERT INTO `value_target` (`id`, `category`, `target_num`, `target_name`, `target_status`, `update_time`) VALUES
(1, '產品', 'A01', '產品A', 0, '2024-01-25 03:09:22'),
(2, '產品', 'A02', '產品B', 1, '2024-01-25 03:09:22'),
(3, '產品', 'A03', '產品C', 1, '2024-01-25 13:32:37'),
(4, '產品', 'A04', '產品D', 1, '2024-01-25 15:26:45'),
(5, '產品', 'A05', '產品E', 0, '2024-01-25 15:27:59'),
(6, '顧客', 'A217', '顧客A', 1, '2024-02-17 16:41:40'),
(7, '原料', 'M01', '原料A', 1, '2024-03-07 15:59:40');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `account_subjects`
--
ALTER TABLE `account_subjects`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `bom_first`
--
ALTER TABLE `bom_first`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `bom_first_tmp`
--
ALTER TABLE `bom_first_tmp`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `bom_second`
--
ALTER TABLE `bom_second`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `bom_second_tmp`
--
ALTER TABLE `bom_second_tmp`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `bom_third`
--
ALTER TABLE `bom_third`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `customer_expense`
--
ALTER TABLE `customer_expense`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `del_bom_log`
--
ALTER TABLE `del_bom_log`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `inventory_log`
--
ALTER TABLE `inventory_log`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `inventory_setup`
--
ALTER TABLE `inventory_setup`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `purchase`
--
ALTER TABLE `purchase`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `useage`
--
ALTER TABLE `useage`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `value_target`
--
ALTER TABLE `value_target`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `account_subjects`
--
ALTER TABLE `account_subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '編碼', AUTO_INCREMENT=134;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `bom_first`
--
ALTER TABLE `bom_first`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '編號', AUTO_INCREMENT=33;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `bom_first_tmp`
--
ALTER TABLE `bom_first_tmp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '編號';

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `bom_second`
--
ALTER TABLE `bom_second`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '編號', AUTO_INCREMENT=33;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `bom_second_tmp`
--
ALTER TABLE `bom_second_tmp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '編號';

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `bom_third`
--
ALTER TABLE `bom_third`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '編號', AUTO_INCREMENT=13;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `customer_expense`
--
ALTER TABLE `customer_expense`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `del_bom_log`
--
ALTER TABLE `del_bom_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `inventory_log`
--
ALTER TABLE `inventory_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `inventory_setup`
--
ALTER TABLE `inventory_setup`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `purchase`
--
ALTER TABLE `purchase`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `supplier`
--
ALTER TABLE `supplier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '編號', AUTO_INCREMENT=6;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `useage`
--
ALTER TABLE `useage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '編號', AUTO_INCREMENT=9;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `value_target`
--
ALTER TABLE `value_target`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
