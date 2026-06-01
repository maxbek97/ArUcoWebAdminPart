import React from "react";
import '../Tableblock.css';
import { useState, useEffect } from "react";
import MarkerModal from "./modals/MarkerModal";
import { ADMIN_API } from "../../../apiConfig";
import { authFetch } from "../../../jwt";
type Props = {
  selectedDict: string;
  filterEnabled: boolean;
};

function TableBlock({selectedDict, filterEnabled}: Props) {
  const [rawData, setRawData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<null | {
    dict: string;
    id: number;
  }>(null);

  const sortData = (data: any[]) => {
    return [...data].sort((a, b) => {
      if (a.dict < b.dict) return -1;
      if (a.dict > b.dict) return 1;
      return a.id - b.id;
    });
};

  useEffect(() => {
    const fetchMarkers = async () => {
      setLoading(true);
      try {
        let url = `${ADMIN_API}/markers`;

        if (filterEnabled && selectedDict)
          url += `?dict_name=${encodeURIComponent(selectedDict)}`
        
        const response = await authFetch(url, {
          method: "GET",
        });

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
  }, [selectedDict]);
  
    if (loading) {
      return (
        <div className="table-container empty">
          <div className="empty-text">Загрузка данных...</div>
        </div>
      );
    }

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
    const tableData = sortData(normalized);

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
            <tr
            key={index}
            onClick={() => {
            setSelectedMarker({
              dict: row.dict,
              id: row.id,
              });
            }}>
              <td>{row.dict}</td>
              <td>{row.id}</td>
              <td>{row.load}</td>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedMarker && (
        <MarkerModal
          dictionary={selectedMarker.dict}
          markerId={selectedMarker.id}
          onClose={() => setSelectedMarker(null)}
        />
      )}
    </div>
  );
}

export default TableBlock;