import { ModalProvider } from "./CompondModal";
import ConfirmQuestionImg from "../assets/images/confirm-question-img.png";
import { forwardRef, useImperativeHandle, useRef } from "react";

function Trigger() {
  return (
    <ModalProvider.Trigger>
      <button
        id="confirmSubmit"
        className="bg-[#00A3C6] text-white px-4 py-2 rounded invisible opacity-0 hidden"
      >
        Submit
      </button>
    </ModalProvider.Trigger>
  );
}

const Content = forwardRef(
  ({ calculateScore, closeModal, handleSubmitAnswer }, ref) => {
    const submitButtonRef = useRef(null);
    const score = calculateScore();

    useImperativeHandle(ref, () => ({
      getSubmitButton: () => submitButtonRef.current,
      clickSubmit: (customCallback) => {
        if (customCallback && typeof customCallback === "function") {
          customCallback();
        }

        submitButtonRef.current.click();
      },
    }));

    return (
      <>
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/50 z-50">
          <div
            className="w-[400px] h-[290px] flex flex-col items-center justify-center z-60 rounded-3xl"
            style={{
              borderRadius: "10.394px",
              border: "0.65px solid #DE3D32",
              background:
                "linear-gradient(359deg, rgba(255, 125, 125) -3.9%, rgba(255, 255, 255) 61.34%)",
            }}
          >
            <img
              src={ConfirmQuestionImg}
              alt="Confirm question"
              className="w-[130px]"
            />

            <p className="text-[var(--primary-color)] text-base font-extrabold text-justify uppercase mt-4">
              xác nhận hoàn thành mini game
            </p>

            <p className="text-gray-600 font-bold text-sm uppercase mt-1">
              bạn đã trả lời: {score.answered}/{score.total}
            </p>

            <div className="flex gap-12 mt-4">
              <button
                className="uppercase w-[141px] h-[30px] text-[#000345] font-extrabold scale-100 hover:scale-105 transform transition-all duration-300 cursor-pointer"
                style={{
                  borderRadius: "16.348px",
                  border: "0.495px solid #FFF",
                  background: "#C0D2F0",
                  boxShadow: "0px 1.589px 1.589px 0px #08F",
                }}
                onClick={closeModal}
              >
                kiểm tra lại
              </button>
              <button
                ref={submitButtonRef}
                onClick={() => {
                  handleSubmitAnswer();
                  closeModal();
                }}
                className="uppercase w-[141px] h-[30px] text-white font-extrabold scale-100 hover:scale-105 transform transition-all duration-300 cursor-pointer"
                style={{
                  borderRadius: "16.348px",
                  border: "0.495px solid #FFF",
                  background:
                    "linear-gradient(0deg, var(--primary-color) 0%, var(--primary-color-light) 100%)",
                  boxShadow: "0px 1.589px 1.589px 0px #08F",
                }}
              >
                gửi
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
);

const ConfirmAnswerModal = forwardRef(
  ({ calculateScore, handleSubmitAnswer }, ref) => {
    const contentRef = useRef(null);

    useImperativeHandle(ref, () => ({
      getSubmitButton: () => contentRef.current?.getSubmitButton(),
      clickSubmit: (customCallback) => {
        contentRef.current?.clickSubmit(customCallback);
      },
      openModal: () => {
        document.getElementById("confirmSubmit")?.click();
      },
    }));

    return (
      <ModalProvider>
        <Trigger />
        <ModalProvider.Content
          render={(open, closeModal) =>
            open && (
              <Content
                ref={contentRef}
                calculateScore={calculateScore}
                closeModal={closeModal}
                handleSubmitAnswer={handleSubmitAnswer}
              />
            )
          }
        />
      </ModalProvider>
    );
  }
);

export default ConfirmAnswerModal;
