
import React from "react";
import { Card, Table } from '@themesberg/react-bootstrap';

export const TransactionTable = (props) => {
  const transaction = props.transaction;
  const Search = props.searchInd;

  const TableRow = (props) => {
    return (
      <tr>
        <td>
          <span className="fw-normal">{props.third_id}</span>
        </td>
        <td>
          <span className="fw-normal">{props.fourth_id}</span>
        </td>
        <td>
          <span className="fw-normal">{props.value_target}</span>
        </td>
        <td>
          <span className="fw-normal">{props.target_num}</span>
        </td>
        <td>
          <span className="fw-normal">{props.amount}</span>
        </td>
        <td>
          <span className="fw-normal">{props.unit_price}</span>
        </td>
        <td>
          <span className="fw-normal">{props.total_price}</span>
        </td>
        <td>
          <span className="fw-normal">{props.order_number}</span>
        </td>
        <td>
          <span className="fw-normal">{props.remark}</span>
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm">
      <Card.Body className="pt-0">
        <Table hover className="user-table align-items-center table-striped">
          <thead>
            <tr>
              <th className="border-bottom">三階科目代碼</th>
              <th className="border-bottom">四階科目代碼</th>
              <th className="border-bottom">標的種類</th>
              <th className="border-bottom">標的代碼</th>
              <th className="border-bottom">數量</th>
              <th className="border-bottom">單價</th>
              <th className="border-bottom">總價</th>
              <th className="border-bottom">單號</th>
              <th className="border-bottom">備註</th>
            </tr>
          </thead>
          <tbody>
          {typeof(transaction) === "undefined"? null:
            Search?
            transaction.filter((acc) => 
              acc.third_id.includes(Search) || 
              acc.fourth_id.includes(Search) ||
              acc.target_num.includes(Search) ||
              acc.order_number.includes(Search)
              )
            .map(t => <TableRow  {...t}/> )
            :
            transaction.filter((acc) => 
            acc !== undefined )
            .map(t => <TableRow  {...t} />)
          }
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
  };