import { ModalProvider } from "./CompondModal";
import Fail from "../assets/images/fail.webp";
import Pass from "../assets/images/pass.png";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { ModalHeader } from "../utils/svg";

function Trigger() {
  return (
    <ModalProvider.Trigger>
      <button
        id="compoundGameResult"
        className="bg-[var(--primary-color)] text-white px-4 py-2 rounded hidden invisible opacity-0"
      >
        Open Modal
      </button>
    </ModalProvider.Trigger>
  );
}

const CompoundGameResult = forwardRef(
  ({ promoCode, msgBack, resetQuiz, submitAnswer }, ref) => {
    const closeButtonRef = useRef();

    useImperativeHandle(ref, () => ({
      open: () => {
        document.getElementById("compoundGameResult").click();
      },
      close: () => {
        closeButtonRef.current?.click();
      },
    }));

    return (
      <ModalProvider>
        <Trigger />
        <ModalProvider.Content
          render={(open, closeModal) =>
            open && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
                <div
                  className="relative w-[400px] min-h-[350px] flex flex-col items-center justify-center z-60 rounded-3xl"
                  style={{
                    borderRadius: "10.394px",
                    border: "0.65px solid #DE3D32",
                    background:
                      "linear-gradient(359deg, rgba(255, 125, 125) -3.9%, rgba(255, 255, 255) 61.34%)",
                  }}
                >
                  <header className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4">
                    <div className="relative w-[236px] h-[40px] uppercase flex items-center justify-center">
                      <span className="text-white font-bold z-10">
                        kết quả mini game
                      </span>
                      <ModalHeader className="absolute top-0 left-0" />
                    </div>
                  </header>

                  <h2 className="mx-auto text-lg font-bold text-center text-[var(--primary-color)] mb-3 mt-10 uppercase">
                    bạn đã hoàn thành bài kiểm tra
                  </h2>

                  <img
                    src={promoCode !== null ? Pass : Fail}
                    alt="image"
                    className={`${
                      promoCode !== null ? "w-[200px]" : "w-[126px]"
                    }`}
                  />

                  <p className="text-gray-500 font-bold uppercase my-1">
                    số câu trả lời đúng: {submitAnswer?.correctAnswers}/
                    {submitAnswer?.totalQuestions}
                  </p>

                  {promoCode && (
                    <div>
                      <p className="text-green-600 text-sm font-medium uppercase mt-1">
                        Chúc mừng ! Bạn bạn đã nhận được mã khuyến mãi
                      </p>
                      <div
                        className="cursor-pointer w-fit mx-auto"
                        onClick={() => navigator.clipboard.writeText(promoCode)}
                      >
                        <p className="text-[#106C3B] border border-[#106C3B] text-sm font-semibold text-center bg-green-200 mt-2 px-2 py-1 rounded-lg">
                          {promoCode}
                        </p>
                      </div>
                    </div>
                  )}

                  {msgBack && (
                    <div
                      className="text-[#AD2A32] text-[12px] text-center font-medium uppercase mt-1 py-1 w-[90%]"
                      style={{
                        borderRadius: "8.18px",
                        border: "0.682px solid #AD2A32",
                        background: "#FFE3E2",
                      }}
                    >
                      {msgBack}
                    </div>
                  )}

                  <footer className="flex justify-center my-6">
                    <button
                      ref={closeButtonRef}
                      onClick={() => {
                        closeModal();
                        resetQuiz();
                      }}
                      className="w-[355px] h-[43px] uppercase shadow-md transform scale-100 hover:scale-105 transition-all duration-300 cursor-pointer"
                      style={{
                        borderRadius: "56.972px",
                        border: "1.628px solid #900",
                        background: "linear-gradient(0deg, #A00 0%, #F00 100%)",
                      }}
                    >
                      <span className="text-white font-bold">
                        {promoCode !== null ? "đi đến trang nhập code" : "đóng"}
                      </span>
                    </button>
                  </footer>
                </div>
              </div>
            )
          }
        />
      </ModalProvider>
    );
  }
);

export default CompoundGameResult;
