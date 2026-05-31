import React, { useEffect, useState } from "react";
import "./GlobalMarkerModal.css"
import "./CRUDMarkerModal.css"
import Toast from "../Toast";
import { ADMIN_API } from "../../../../apiConfig";

type Props = {
  dictionary: string;
  markerId: number;
  onClose: () => void;
};

const MarkerModal: React.FC<Props> = ({ dictionary, markerId, onClose }) => {
    const [marker, setMarker] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toast, setToast] = useState<any>(null);
    const [type, setType] = useState<"text" | "model">("text");

    const [value, setValue] = useState("");
    const [source, setSource] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [x, setX] = useState("");
    const [y, setY] = useState("");
    const [z, setZ] = useState("");

    const numberRegex = /^-?\d*\.?\d*$/;

    const handleTypeChange = (newType: "text" | "model") => {
      setType(newType);

      if (newType === "text") {
        setSource("");
        setX(""); setY(""); setZ("");
      } else {
        setValue("");
      }
    };


  useEffect(() => {
    const fetchMarker = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const res = await fetch(
          `${ADMIN_API}/markers/${dictionary}/${markerId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = await res.json();

        setMarker(data);
        setType(data.payload_type);

        if (data.payload_type === "text") {
          setValue(data.payload.value);
        } else {
          setSource(data.payload.src);
          setX(String(data.payload.start_position[0]));
          setY(String(data.payload.start_position[1]));
          setZ(String(data.payload.start_position[2]));
        }

      } catch (e) {
        setToast({ message: "Ошибка загрузки", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchMarker();
  }, [dictionary, markerId]);

  // UPDATE
  const handleUpdate = async () => {
    const formData = new FormData();

    formData.append("dictionary_name", dictionary);
    formData.append("marker_id", String(markerId));
    formData.append("payload_type", type);

    let payloadData = {};

    if (type === "text") {
      payloadData = { value };
    } else {
      payloadData = {
        start_position: [Number(x), Number(y), Number(z)],
      };

      if (!file) {
        setToast({ message: "Необходимо выбрать файл модели", type: "error" });
        return;
      }
      formData.append("file", file);
    }

    formData.append("payload", JSON.stringify(payloadData));

    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await fetch(
        `${ADMIN_API}/markers/?dictionary_name=${encodeURIComponent(dictionary)}&marker_id=${markerId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const err = await res.json();
        setToast({ message: err.detail, type: "error" });
        return;
      }

      setToast({ message: "Обновлено", type: "success" });
      setIsEdit(false);
            setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1000);

    } catch {
      setToast({ message: "Ошибка обновления", type: "error" });
    }
  };

  // DELETE
  const handleDelete = async () => {

    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await fetch(
        `${ADMIN_API}/markers/?dictionary_name=${encodeURIComponent(dictionary)}&marker_id=${markerId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        setToast({ message: err.detail, type: "error" });
        return;
      }

      setToast({ message: "Удалено", type: "success" });

      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1000);

    } catch {
      setToast({ message: "Ошибка удаления", type: "error" });
    }
  };

  if (loading) return <div className="modal-overlay">Загрузка...</div>;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="form-group-row">
          <label>Словарь:</label>
          <div>{dictionary}</div>
        </div>

        <div className="form-group-row">
          <label>Идентификатор:</label>
          <div>{markerId}</div>
        </div>

        <div className="form-group">
            <label>Тип:</label>
            <select
                disabled={!isEdit}
                value={type}
                onChange={(e) => handleTypeChange(e.target.value as any)}
            > 
                <option value="text">text</option>
            <   option value="model">model</option>
            </select>
        </div>

        {/* TEXT */}
        {type === "text" && (
          <div className="form-group">
            <label>Значение:</label>
            <textarea
                required
                disabled={!isEdit}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
          </div>
        )}

        {/* MODEL */}
        {type === "model" && (
          <>
            <div className="form-group">
              <label>Файл модели {isEdit && "(загрузите новый)"}:</label>
              {!isEdit ? (
                <div className="static-value">{source}</div>
              ) : (
                <input
                  type="file"
                  accept=".glb"
                  onChange={(e) => e.target.files && setFile(e.target.files[0])}
                />
              )}
            </div>

            <div className="form-group">
              <label>Координаты:</label>
              <div className="coord-row">
                <div className="coord-tile">
                    <input
                    disabled={!isEdit}
                    value={x}
                    onChange={(e) =>
                        numberRegex.test(e.target.value) && setX(e.target.value)
                    }
                    />
                </div>
                <div className="coord-tile">
                    <input
                    disabled={!isEdit}
                    value={y}
                    onChange={(e) =>
                        numberRegex.test(e.target.value) && setY(e.target.value)
                    }
                    />
                </div>
                <div className="coord-tile">
                    <input
                    disabled={!isEdit}
                    value={z}
                    onChange={(e) =>
                        numberRegex.test(e.target.value) && setZ(e.target.value)
                    }
                    />
                </div>
              </div>
            </div>
          </>
        )}

        <div className="modal-actions">
          <button className="modal-btn-secondary" onClick={onClose}>
            Закрыть
          </button>

          {!isEdit ? (
            <button className="modal-btn-primary" onClick={() => setIsEdit(true)}>
              Изменить
            </button>
          ) : (
            <button className="modal-btn-primary" onClick={handleUpdate}>
              Сохранить
            </button>
          )}

          <button className="modal-btn-delete"
            onClick={() => setConfirmOpen(true)}
          >
            Удалить
          </button>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {confirmOpen && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>Удаление маркера</h2>
      <p>Вы уверены, что хотите удалить этот маркер?</p>

      <div className="modal-actions">
        <button
          className="modal-btn-secondary"
          onClick={() => setConfirmOpen(false)}
        >
          Отмена
        </button>

        <button
            className="modal-btn-delete"    
            onClick={handleDelete}
        >
          Удалить
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default MarkerModal;