import React, { useState, useEffect } from "react";
import './AddMarkerModal.css'
import './GlobalMarkerModal.css'
import Toast from "../Toast";

type Props = {
  dictionaries: string[];
  onClose: () => void;
};

const AddMarkerModal: React.FC<Props> = ({ dictionaries, onClose }) => {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [dict, setDict] = useState("");
  useEffect(() => {
  if (dictionaries.length > 0 && dict === "") {
    setDict(dictionaries[0]);
  }
}, [dictionaries]);
  const [identifier, setIdentifier] = useState("");
  const [type, setType] = useState<"text" | "model" | "">("text");

  // text mode
  const [value, setValue] = useState("");

  // model mode
  const [file, setFile] = useState<File | null>(null); // Состояние для файла
  const numberRegex = /^-?\d*\.?\d*$/;
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [z, setZ] = useState("");

const handleSubmit = async () => {
  const formData = new FormData();
  formData.append("dictionary_name", dict);
  formData.append("marker_id", identifier);
  formData.append("payload_type", type);
  let payloadData = {};
    if (type === "text") {
      payloadData = { value };
    }
    else {
      payloadData = {
        start_position: [Number(x), Number(y), Number(z)],
      };
      if (file) {
        formData.append("file", file);
      }
    }

    // Сериализуем payload в строку, как ожидает бэкенд
    formData.append("payload", JSON.stringify(payloadData));

  try {
    console.log("SENDING FORMDATA:");
    const res = await fetch("/api/admin/markers", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      setToast({ message: err.detail || "Ошибка сервера", type: "error" });
      return;
    }

    setToast({ message: "Marker created", type: "success" });
    setTimeout(() => {
    onClose();
  window.location.reload();
}, 2000); // 2 секунды

  } catch (e: any) {
    setToast({ message: e.message || "Ошибка сервера", type: "error" });
  }
};

  return (
    <div className="modal-overlay">
        <div className="modal">
            <h2>Добавить маркер</h2>

            {/* СЛОВАРЬ */}
            <div className="form-group">
                <label>Словарь:</label>
                <select value={dict} onChange={(e) => setDict(e.target.value)}>
                {dictionaries.map((d) => (
                    <option key={d} value={d}>
                    {d}
                    </option>
                ))}
                </select>
            </div>

            {/* ИДЕНТИФИКАТОР */}
            <div className="form-group">
                <label>Идентификатор:</label>
                <input
                required
                value={identifier}
                onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val)) {
                    setIdentifier(val);
                    }
                }}
                />
            </div>

            {/* Тип */}
            <div className="form-group">
                <label>Тип:</label>
                <select value={type} onChange={(e) => setType(e.target.value as any)}>
                    <option value="text">Текст</option>
                    <option value="model">Модель</option>
                </select>
            </div>

            {/* TEXT MODE (по умолчанию) */}
            {type === "text" && (
            <div className="form-group">
                <label>Значение:</label>
                <textarea
                value={value}
                maxLength={255}
                onChange={(e) => setValue(e.target.value)}
                />
            </div>
            )}


            {/* MODEL MODE (если понадобится потом) */}
            {type === "model" && (
                <>
            <div className="form-group">
                <label>Файл модели:</label>
                <input
                  type="file"
                  accept=".glb"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                      }
                  }}
                />
            </div>

            <div className="form-group">
                <label>Координаты модели:</label>
                <div className="coord-row">
                    <div className="coord-tile">
                        <input
                        required
                        placeholder="X"
                        value={x}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (numberRegex.test(val)) setX(val);
                        }} />
                    </div>
                    <div className="coord-tile">
                        <input
                        required
                        placeholder="Y"
                        value={y}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (numberRegex.test(val)) setY(val);
                        }} />
                    </div>
                    <div className="coord-tile">
                                                <input
                        required
                        placeholder="Z"
                        value={z}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (numberRegex.test(val)) setZ(val);
                        }} />
                    </div>
                </div>
            </div>
        </>
        )}
            <div className="modal-actions">
                <button className="btn-secondary" onClick={onClose}>Отмена</button>
                <button className="btn-primary" onClick={handleSubmit}>Создать</button>
            </div>
        </div>
        {toast && (
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
            />
)}
    </div>
  );
};

export default AddMarkerModal;