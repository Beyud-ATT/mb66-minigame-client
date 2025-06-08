import { ModalProvider } from "./CompondModal";
import Swal from "sweetalert2";
import QuizModal from "./MiniGame1";
import { useModal } from "./CompondModal";

function MiniGame1Trigger({ completed }) {
  const { openModal } = useModal();
  return (
    <ModalProvider.Trigger>
      <button
        onClick={() => {
          if (completed) {
            Swal.fire({
              title: "Thông báo",
              text: "Bạn đã hoàn thành mini game này!",
              icon: "info",
              confirmButtonColor: "#2C70DE",
            });
            return;
          }
          openModal();
        }}
        className={`w-[355px] h-[43px] scale-100 hover:scale-105 transform transition-all duration-300 cursor-pointer ${
          completed ? "opacity-50" : ""
        }`}
        style={{
          borderRadius: "21.495px",
          border: "1.624px solid #FFE83E",
          background:
            "linear-gradient(180deg, #FFD5D5 0%, #FFB8B8 17.79%, #C53A3A 37.98%, #F00 88.46%, #FF7171 100%)",
          boxShadow: "2.624px 3.498px 3.848px 0px rgba(0, 0, 0, 0.25) inset",
        }}
      >
        <span className="text-white font-bold uppercase">
          trả lời câu hỏi gợi ý
        </span>
        {completed && (
          <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Đã hoàn thành
          </div>
        )}
      </button>
    </ModalProvider.Trigger>
  );
}

export default function CompoundMiniGame1({ completed, userData, onComplete }) {
  return (
    <ModalProvider>
      <MiniGame1Trigger completed={completed} />
      <ModalProvider.Content
        render={(open, closeModal) => (
          <QuizModal
            isOpen={open}
            onClose={() => {
              closeModal();
            }}
            userData={userData}
            onComplete={onComplete}
          />
        )}
      />
    </ModalProvider>
  );
}
