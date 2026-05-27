import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionButton from '../mainpage/components/ActionButton';
import './Authorization.css';
import Toast from "../mainpage/components/Toast"

import { AUTH_API } from "../../apiConfig";
import { isAdminToken, decodeJwt } from "../../jwt";


const Authorization: React.FC = () => {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const navigate = useNavigate();

    const [formData, setFormData] = useState({
    userEmail: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${AUTH_API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: formData.userEmail,
          password: formData.password,
        }),
      });


      if (!response.ok) {
        setToast({ message: "Неверная почта или пароль", type: "error" });
        return;
      }

      const data = await response.json();
      
      const accessToken = data.accessToken;
      const refreshToken = data.refreshToken;

      if (!accessToken) {
        throw new Error("Сервер не вернул access token");
      }

      if (!isAdminToken(accessToken)) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        throw new Error("Доступ разрешён только администраторам");
      }

      localStorage.setItem("accessToken", accessToken);

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      setToast({ message: "Успешный вход", type: "success" });
      navigate('/control-panel'); // редирект на компонент управления
    } catch (error) {
      console.error(error);
      setToast({ message: "Ошибка соединения с сервером", type: "error" });
    }
    }



  return (
    <section id="auth" className="authorization-section">
      <div className="authorization-container">
        <div className="authorization-card">
          <h2 className="authorization-title">Войти в аккаунт</h2>

          <form className="authorization-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Электронная почта</label>
              <input 
                type="email" 
                required
                value={formData.userEmail}
                onChange={(e) => setFormData({...formData, userEmail: e.target.value})}
              />
            </div>

            <div className="input-group">
              <label>Пароль</label>
              <input 
                type="password" 
                required 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div className="authorization-footer">
              <ActionButton text="Войти" type="submit" />
            </div>
          </form>

        </div>
      </div>
      {toast && (
        <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
        />
    )}
    </section>

  );
};

export default Authorization;