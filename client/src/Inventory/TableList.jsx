import styled from 'styled-components';
import { Table } from 'antd';
import TableRowAccordion from './TableRowAccordion';
import RowExpandIcon from './RowExpandIcon';

const spaceBorderColor = '#F1F3F8';

const TableList = styled(Table)`
  .ant-table{
    overflow: auto;
  }

  .ant-table-container{
    width: 170%;
  }

  &.ant-table-wrapper {
    background: ${spaceBorderColor};
    padding: 5px;

    .ant-table-column-title {
      color: #44444f;
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.8px;
    }

    .ant-table-thead {
      > tr {
        th {
          background: #dde1ef;
          padding: 11px 13px;
          border-top: 5px solid ${spaceBorderColor};
          border-bottom: 5px solid ${spaceBorderColor};
          text-align: center;

          &:first-child {
            border-top-left-radius: 0px;
            border-bottom-left-radius: 0px;
          }
          &:last-child {
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
          }
        }
      }
    }

    .ant-table-tbody {
      tr {
        position: relative;
        background-color: #ffffe0;
        td {
          font-size: 13px;
          background: #ffffff;
          border-bottom: 1px solid #CCCCCC;

          &:first-child {
            border-top-left-radius: 0px;
            border-bottom-left-radius: 0px;
          }
          &:last-child {
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
          }
        }

        .expand-row-icon {
            position: fixed;
            top: 30.6%;
            right: 1.8%;
        }

        &.ant-table-row-level-1 {
          td:first-child {
            border-top-left-radius: 0px;
            border-bottom-left-radius: 0px;
          }
          .ant-table-row-indent,
          .expand-row-icon,
          .ant-table-row-expand-icon {
            display: none;
          }
        }
      }
    }
  }

  /* Tabela de lista dos pacientes */
  &.table-pacientes {
    .ant-table-tbody {
      tr {
        td {
          padding: 16px 8px;
          font-size: 13px;
          font-weight: 400;
          color: rgb(105, 105, 116);
          cursor: pointer;
          text-align: right;
          
          > div > * {
            display: block;
          }
          strong {
            color: rgb(23, 23, 37);
            margin-bottom: 8px;
          }
        }

        &.ant-table-row-level-0 {
          td {
            padding: 0px 8px 0px 8px;
            text-align: right;
            border: none;
            border-radius: unset;
            background: transparent;
            border-bottom: 1px solid #CCCCCC;
            height: 50px;
          }
        }
      }
    }
  }
`;

const TableActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 40px 0 50px;

  .box-sorters,
  .box-filters {
    font-size: 13px;
    color: #44444f;
    cursor: pointer;
  }

  .label-filter {
    color: #92929d;
  }

  .box-filters {
    .anticon {
      font-size: 14px;
      color: #92929e;
      margin-left: 8px;
      vertical-align: -0.285em;
    }
  }

  .box-sorters {
    text-align: right;

    > strong {
      font-size: 11px;
      text-transform: uppercase;
    }

    > span {
      display: inline-block;
      width: 167px;
      font-size: 14px;

      .anticon {
        font-size: 20px;
        margin-right: 8px;
        vertical-align: -0.235em;
      }
    }

    .bts-group-sorters {
      display: inline-block;

      .ant-btn {
        margin: 0 5px;

        &:first-child {
          margin-left: 15px;
        }
      }
    }
  }
`;

const TableContainer = styled.div`
  margin-bottom: 10px;
  padding: 10px 6px 6px;
  border: 1px solid #e2e2ea;
  border-radius: 23px;
`;

const TableHeader = styled.div`
  padding: 6px;

  h4 {
    color: #696974;
    font-family: Poppins;
    font-size: 16px;
  }

  .total {
    height: 26px;
    width: 27px;
    border-radius: 5px;
    background-color: #ffffff;

    span {
      color: #0062ff;
      font-size: 14px;
      line-height: 21px;
    }
  }

  .ant-select-selection {
    height: 38px;
    border-radius: 10px;
    font-size: 14px;

    .ant-select-selection__rendered {
      display: flex;
      height: 38px;
      line-height: 38px;
    }
  }
`;

export {
  TableList,
  TableActions,
  TableContainer,
  TableHeader,
  TableRowAccordion,
  RowExpandIcon,
};
