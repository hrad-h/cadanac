import React from 'react';

'use strict';

const VirusTypeSelect = props => {

  const { id, value, onChange } = props;

  const [items] = React.useState([
    { label: "", value: "" },
    { label: "Covid19", value: "Covid19" },
    { label: "SARS", value: "SARS" },
    { label: "Influenza", value: "Influenza" }
  ]);
  return (
    <select id={id} name={id} value={value} onChange={onChange}>
      {items.map(item => (
        <option
          key={item.value}
          value={item.value}
        >
          {item.label}
        </option>
      ))}
    </select>
  );
}

export default VirusTypeSelect;
