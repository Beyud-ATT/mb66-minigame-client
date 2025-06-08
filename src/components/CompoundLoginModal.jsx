import Swal from "sweetalert2";
import CheckUserModal from "./CheckUserModal";
import { ModalProvider, useModal } from "./CompondModal";
import { useUserDataActions } from "../stores/userDataStore";
import SiginButton from "../assets/images/signin-btn.webp";

function LoginModalTrigger() {
  const { openModal } = useModal();

  const handlePlayNow = () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token && username) {
      openModal();
    }
  };

  return (
    <ModalProvider.Trigger>
      <button
        onClick={handlePlayNow}
        className="w-[282px] scale-95 hover:scale-100 transform transition-all duration-300 cursor-pointer"
      >
        <img src={SiginButton} alt="BẮT ĐẦU" />
      </button>
    </ModalProvider.Trigger>
  );
}

export const CompoundLoginModal = ({
  hasCompletedQuiz1,
  hasCompletedQuiz2,
}) => {
  const { setUserData } = useUserDataActions();

  const handleUserVerified = (userData) => {
    setUserData(userData);

    if (hasCompletedQuiz1 && hasCompletedQuiz2) {
      Swal.fire({
        title: "Thông báo",
        text: "Bạn đã tham gia tất cả mini game, vui lòng quay lại khi có cập nhật mới!",
        icon: "info",
        confirmButtonColor: "#FC8F00",
      });
      return;
    }
  };

  return (
    <ModalProvider>
      <LoginModalTrigger />
      <ModalProvider.Content
        render={(open, closeModal) => (
          <CheckUserModal
            isOpen={open}
            onClose={() => closeModal()}
            onSuccess={(userData) => {
              handleUserVerified(userData);
              closeModal();
            }}
          />
        )}
      />
    </ModalProvider>
  );
};
