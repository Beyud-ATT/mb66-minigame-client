import { ButtonIcon } from "../utils/svg";
import { ModalProvider } from "./CompondModal";
import GameHistoryModal from "./GameHistoryModal";

export default function CompoundGameHistoryModal({ userData }) {
  return (
    <ModalProvider>
      <ModalProvider.Trigger>
        <button
          className="w-[355px] h-[43px] scale-100 hover:scale-105 transform transition-all duration-300 cursor-pointer px-3.5"
          style={{
            borderRadius: "39.578px",
            border: "0.682px solid #FFB8B8",
            background: "#F5F9FF",
            boxShadow:
              "1.365px 2.047px 2.798px 0px rgba(255, 47, 47, 0.20), 0px 2.148px 6.121px 5.906px rgba(133, 49, 49, 0.02), 0px 0px 4.618px 4.295px rgba(255, 164, 164, 0.25) inset",
          }}
        >
          <span className="text-[#3A5177] font-bold uppercase flex items-center justify-between">
            Lịch sử mini game
            <ButtonIcon />
          </span>
        </button>
      </ModalProvider.Trigger>
      <ModalProvider.Content
        render={(open, closeModal) => (
          <GameHistoryModal
            isOpen={open}
            onClose={closeModal}
            userData={userData}
          />
        )}
      />
    </ModalProvider>
  );
}
