import React from "react";
import '../Tableblock.css';
import { useState, useEffect } from "react";
type Props = {
  currentDict: string;
  filterEnabled: boolean;
};

function TableBlock({currentDict, filterEnabled}: Props) {
  const [rawData, setRawData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const sortData = (data: any[]) => {
  return [...data].sort((a, b) => {
    if (a.dict < b.dict) return -1;
    if (a.dict > b.dict) return 1;
    return a.id - b.id;
  });
};

  const filterData = (data: any[]) => {
    if (!filterEnabled) return data;
    if (!currentDict) return data;
    return data.filter(item => item.dict?.trim() === currentDict?.trim());
  };


  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await fetch('/api/admin/markers');
        const data = await response.json();

        setRawData(data || []);
      } catch (error) {
        console.error("Ошибка загрузки маркеров:", error);
        setRawData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkers();
  }, []);
  
    if (rawData.length === 0) {
      return (
        <div className="table-container empty">
          <div className="empty-text">
            База данных пустует 👀
          </div>
        </div>
      );
    }

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
        load: item.payload_type,
        value: displayValue
      };
    });
  };

    const normalized = normalizeData(rawData);
    const filtered = filterData(normalized);
    const tableData = sortData(filtered);

    if (tableData.length === 0) {
      return (
        <div className="table-container empty">
          <div className="empty-text">
            У данного словаря нет маркеров 👀
          </div>
        </div>
      );
    }

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