import React from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

export default function RowExpandIcon(props) {
  const IconComponent = props.expanded ? UpOutlined : DownOutlined;

  return (
    <div className="expand-row-icon">
      {/* <IconComponent /> */}
    </div>
  );
}
