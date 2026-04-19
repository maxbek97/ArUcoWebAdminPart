import React from "react";
import '../Tableblock.css';

function TableBlock() {

  const rawData = [
    {
      dictionary_name: "DICT_4X4_100",
      marker_id: 7,
      payload_type: "model",
      payload: { src: "robot.glb", start_position: [0, 0, 0] }
    },
    {
      dictionary_name: "DICT_4X4_100",
      marker_id: 8,
      payload_type: "text",
      payload: { value: "Hello world" }
    },
    {
      dictionary_name: "DICT_5X5_50",
      marker_id: 15,
      payload_type: "model",
      payload: { src: "car.glb", start_position: [1, 2, 3] }
    },
    {
      dictionary_name: "DICT_5X5_50",
      marker_id: 16,
      payload_type: "text",
      payload: { value: "Car marker" }
    },
    {
      dictionary_name: "DICT_6X6_250",
      marker_id: 22,
      payload_type: "text",
      payload: { value: "Test label" }
    },
    {
      dictionary_name: "DICT_4X4_100",
      marker_id: 8,
      payload_type: "text",
      payload: { value: "Hello world" }
    },
    {
      dictionary_name: "DICT_5X5_50",
      marker_id: 15,
      payload_type: "model",
      payload: { src: "car.glb", start_position: [1, 2, 3] }
    },
    {
      dictionary_name: "DICT_5X5_50",
      marker_id: 16,
      payload_type: "text",
      payload: { value: "Car marker" }
    },
    {
      dictionary_name: "DICT_6X6_250",
      marker_id: 22,
      payload_type: "text",
      payload: { value: "Test label" }
    },
    {
      dictionary_name: "DICT_4X4_100",
      marker_id: 8,
      payload_type: "text",
      payload: { value: "Hello world" }
    },
    {
      dictionary_name: "DICT_5X5_50",
      marker_id: 15,
      payload_type: "model",
      payload: { src: "car.glb", start_position: [1, 2, 3] }
    },
    {
      dictionary_name: "DICT_5X5_50",
      marker_id: 16,
      payload_type: "text",
      payload: { value: "Car marker" }
    },
    {
      dictionary_name: "DICT_6X6_250",
      marker_id: 22,
      payload_type: "text",
      payload: { value: "Test label" }
    },
    {
      dictionary_name: "DICT_4X4_100",
      marker_id: 8,
      payload_type: "text",
      payload: { value: "Hello world" }
    },
    {
      dictionary_name: "DICT_5X5_50",
      marker_id: 15,
      payload_type: "model",
      payload: { src: "car.glb", start_position: [1, 2, 3] }
    },
    {
      dictionary_name: "DICT_5X5_50",
      marker_id: 16,
      payload_type: "text",
      payload: { value: "Car marker" }
    },
    {
      dictionary_name: "DICT_6X6_250",
      marker_id: 22,
      payload_type: "text",
      payload: { value: "Test label" }
    }
  ];

  const normalizeData = (data: any[]) => {
    return data.map(item => {
      let displayValue = "";

      if (item.payload_type === "model") {
        displayValue = item.payload.src;
      } else if (item.payload_type === "text") {
        displayValue = item.payload.value;
      }

      return {
        dict: item.dictionary_name,
        id: item.marker_id,
        load: item.payload_type, // потом подставишь
        value: displayValue
      };
    });
  };

  const tableData = normalizeData(rawData);

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Словарь</th>
            <th>Идентификатор</th>
            <th>Текст / Модель</th>
            <th>Содержимое</th>
          </tr>
        </thead>

        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td>{row.dict}</td>
              <td>{row.id}</td>
              <td>{row.load}</td>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableBlock;