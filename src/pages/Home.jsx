import bg from "../assets/images/bg.webp";
import logo from "../assets/images/logo.png";
import minigame from "../assets/images/minigame.webp";
import CompoundGameHistoryModal from "../components/CompoundGameHistoryModal";
import { CompoundLoginModal } from "../components/CompoundLoginModal";
import CompoundMiniGame1 from "../components/CompoundMiniGame1";
import CompoundMiniGame2 from "../components/CompoundMiniGame2";
import UserDropDown from "../components/UserDropDown";
import { ButtonIcon } from "../utils/svg";

const Home = ({
  onShowRuleGame,
  userData,
  hasCompletedQuiz1,
  hasCompletedQuiz2,
  handleQuiz1Complete,
  handleQuiz2Complete,
}) => {
  return (
    <div
      className="md:w-[500px] min-h-screen mx-auto flex flex-col relative"
      style={{ background: `url(${bg}) center/cover no-repeat` }}
    >
      <div className="flex justify-end absolute top-5 right-1">
        <UserDropDown userData={userData} />
      </div>
      <div className="flex flex-col items-center pb-2">
        <a
          className="mt-10 flex"
          href=""
          alt="Truy cập trang chủ MB66"
          rel="dofollow"
        >
          <img
            src={logo}
            alt="MB66 nhà cái uy tín"
            className="w-[262px] h-[114px]"
          />
        </a>

        <img
          className="w-[380px]"
          src={minigame}
          alt="MB66 Minigame - Đuổi Hình Đoán Chữ, Trò Chơi Giải Đố Hấp Dẫn"
        />
      </div>

      <div className="flex flex-col gap-4 items-center justify-center">
        {userData === null && <CompoundLoginModal />}

        {userData !== null && (
          <>
            <CompoundMiniGame1
              completed={hasCompletedQuiz1}
              userData={userData}
              onComplete={handleQuiz1Complete}
            />

            <CompoundMiniGame2
              completed={hasCompletedQuiz2}
              userData={userData}
              onComplete={handleQuiz2Complete}
            />
          </>
        )}

        <button
          onClick={onShowRuleGame}
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
            Thể lệ trò chơi
            <ButtonIcon />
          </span>
        </button>

        {userData !== null && <CompoundGameHistoryModal userData={userData} />}
      </div>
    </div>
  );
};

export default Home;
