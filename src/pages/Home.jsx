import bg from "../assets/images/bg.webp";
import logo from "../assets/images/logo.png";
import minigame from "../assets/images/minigame.webp";
import CompoundGameHistoryModal from "../components/CompoundGameHistoryModal";
import { CompoundLoginModal } from "../components/CompoundLoginModal";
import CompoundMiniGame1 from "../components/CompoundMiniGame1";
import CompoundMiniGame2 from "../components/CompoundMiniGame2";

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
            borderRadius: "21.495px",
            border: "1.624px solid #FFE83E",
            background:
              "linear-gradient(180deg, #FFD5D5 0%, #FFB8B8 17.79%, #C53A3A 37.98%, #F00 88.46%, #FF7171 100%)",
            boxShadow: "2.624px 3.498px 3.848px 0px rgba(0, 0, 0, 0.25) inset",
          }}
        >
          <span className="text-white font-bold uppercase text-center">
            Thể lệ trò chơi
          </span>
        </button>

        {userData !== null && <CompoundGameHistoryModal userData={userData} />}
      </div>
    </div>
  );
};

export default Home;
