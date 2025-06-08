import { useState } from "react";
import { checkUser } from "../services/api_service";
import bg from "../assets/images/bg.webp";
import { CloseModalButton } from "../utils/svg";
import { enqueueSnackbar } from "notistack";
import LoginHeader from "../assets/images/login-header.png";

const CheckUserModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: "",
    bankLastDigits: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.username || !formData.bankLastDigits) {
      enqueueSnackbar("Vui lòng điền đầy đủ thông tin!", {
        variant: "error",
      });
      return;
    }

    setLoading(true);

    try {
      // First verify user credentials
      const userVerified = await checkUser(
        formData.username,
        formData.bankLastDigits
      );

      console.log(userVerified);

      if (!userVerified.valid) {
        enqueueSnackbar(
          userVerified.text_mess ?? "Thông tin tài khoản không chính xác!",
          {
            variant: "error",
          }
        );
        return;
      }

      localStorage.setItem("token", userVerified.result?.token);
      localStorage.setItem("resetToken", userVerified.result?.resetToken);
      localStorage.setItem("name", userVerified.result?.name);
      localStorage.setItem("username", userVerified.result?.account);

      onSuccess(formData);
    } catch (err) {
      enqueueSnackbar(err.message || "Có lỗi xảy ra. Vui lòng thử lại.", {
        variant: "error",
      });
      // setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
    setFormData({ username: "", bankLastDigits: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div
        className="relative w-full max-w-[400px] min-h-[400px] p-6 flex flex-col items-center justify-end"
        style={{
          borderRadius: "15px",
          border: "1px solid var(--stroke, #F00)",
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-white hover:opacity-80"
        >
          <CloseModalButton />
        </button>

        <img src={LoginHeader} alt="login-header" />

        <h2 className="-translate-y-6 text-center text-lg font-bold text-[var(--primary-color)]">
          ĐĂNG NHẬP ĐỂ THAM GIA MINI GAME
        </h2>

        <div className="flex w-full flex-col gap-3">
          <div
            className="flex items-center gap-2 px-5 py-2.5"
            style={{
              borderRadius: "21.09px",
              border: "0.812px solid #F00",
              background: "linear-gradient(180deg, #FFEFD8 0%, #FFF 100%)",
            }}
          >
            <input
              type="text"
              placeholder="Vui lòng nhập tên tài khoản"
              className="flex-1 bg-transparent outline-none text-[#383838]"
              value={formData.username}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, username: e.target.value }))
              }
            />
          </div>

          <div
            className="flex items-center gap-2 px-5 py-2.5"
            style={{
              borderRadius: "21.09px",
              border: "0.812px solid #F00",
              background: "linear-gradient(180deg, #FFEFD8 0%, #FFF 100%)",
            }}
          >
            <input
              type="text"
              placeholder="Nhập 4 số cuối STK ngân hàng"
              className="flex-1 bg-transparent outline-none text-[#383838]"
              maxLength="4"
              value={formData.bankLastDigits}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  bankLastDigits: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-[355px] h-[43px] text-white font-bold scale-100 hover:scale-105 transform transition-all duration-300 cursor-pointer ${
              loading ? "opacity-50" : ""
            }`}
            style={{
              borderRadius: "21.495px",
              border: "1.624px solid #FFE83E",
              background:
                "linear-gradient(180deg, #FFD5D5 0%, #FFB8B8 17.79%, #C53A3A 37.98%, #F00 88.46%, #FF7171 100%)",
              boxShadow:
                "2.624px 3.498px 3.848px 0px rgba(0, 0, 0, 0.25) inset",
            }}
          >
            KIỂM TRA
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckUserModal;
