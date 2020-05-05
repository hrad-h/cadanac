import React from 'react';

'use strict';

const PersonStatusSelect = props => {

  const { id, value, onChange } = props;

  const [items] = React.useState([
    { label: "", value: "" },
    { label: "SymptomFree", value: "SymptomFree" },
    { label: "Symptomatic", value: "Symptomatic" },
    { label: "Positive", value: "Positive" },
    { label: "Vaccinated", value: "Vaccinated" },
    { label: "Recovering", value: "Recovering" },
    { label: "Relapse", value: "Relapse" },
    { label: "PiningForTheFjords", value: "PiningForTheFjords" }
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

export default PersonStatusSelect;
