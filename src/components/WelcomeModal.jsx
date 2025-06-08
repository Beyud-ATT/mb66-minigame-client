import { useState } from "react";
import GameHistoryModal from "./GameHistoryModal";
import RulesGame from "./modal/rulesGame";

const WelcomeModal = ({
  isOpen,
  userData,
  hasCompletedQuiz1,
  hasCompletedQuiz2,
  onStartQuiz,
  onStartWordGuess,
  onBack,
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showRuleGame, setShowRuleGame] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="relative w-[90%] max-w-[400px] p-6 rounded-[15.678px] bg-[rgba(255,255,255,0.95)] shadow-[0px_0px_20px_0px_rgba(255,255,255,0.25),-3px_-3px_16.5px_0px_rgba(247,240,240,0.25)_inset,3px_5px_16.56px_0px_rgba(247,240,240,0.25)_inset]">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 w-[24px] cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="16"
            viewBox="0 0 24 16"
            fill="none"
          >
            <path
              d="M6.22512 10.792L24 10.792V4.70454L6.22512 4.70454V10.792Z"
              fill="#00A3C6"
            />
            <path
              d="M0 7.74767L6.70939 11.6215L13.4188 15.4954V7.74767V0L6.70939 3.87384L0 7.74767Z"
              fill="#00A3C6"
            />
          </svg>
        </button>

        <button
          onClick={() => setShowRuleGame(true)}
          className="absolute top-10 right-4 text-gray-600 hover:text-gray-800 w-[24px] cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="auto"
            viewBox="0 0 21 21"
            fill="none"
          >
            <path
              d="M9.27083 0.0353487C15.1919 -0.45249 20.1602 4.17277 20.2786 9.96797L20.2728 10.4748C20.0833 15.6741 16.0374 19.8238 11.0081 20.2395C5.07961 20.7294 0.458653 16.2207 0.0354744 11.0158C-0.448041 5.06734 4.08246 0.463102 9.27083 0.0353487ZM9.65657 1.60664C5.28866 1.82537 1.34268 5.56897 1.60481 10.6271C1.83521 15.0694 5.55315 18.6962 10.1361 18.6799H10.137C14.8287 18.722 18.9293 14.7579 18.6722 9.66718C18.45 5.27045 14.6824 1.35472 9.65657 1.60664ZM9.49055 13.3039C10.0212 13.2608 10.5008 13.3685 10.848 13.798C11.2059 14.2407 11.2381 14.7502 11.0374 15.2648C10.8458 15.7565 10.4453 15.9986 9.93587 16.0764C9.88362 16.0845 9.83117 16.0932 9.77864 16.0978C9.74031 16.101 9.70105 16.0986 9.66243 16.0988V16.0978C8.92003 16.0981 8.37306 15.6793 8.23762 14.9855C8.06866 14.1179 8.58972 13.3774 9.49055 13.3039ZM9.72395 4.425C10.3599 4.38656 10.987 4.41358 11.5892 4.62226C12.6354 4.98487 13.3002 5.69715 13.431 6.8205C13.5916 8.20144 13.103 9.31842 11.9906 10.1603C11.5948 10.4597 11.2271 10.7869 10.9613 11.217C10.7741 11.5198 10.6898 11.845 10.6849 12.1955C10.6832 12.3156 10.6849 12.436 10.6849 12.5656H8.51106C8.50726 12.2 8.4741 11.8365 8.5052 11.4787C8.59344 10.4632 9.0835 9.66077 9.85579 9.00898C10.1546 8.75676 10.4308 8.47368 10.6947 8.18476C10.9842 7.86745 10.9879 7.48001 10.8812 7.08906C10.8057 6.81383 10.6009 6.66568 10.3294 6.60859C9.79998 6.49709 9.28313 6.56599 8.79329 6.77363C8.42085 6.93148 8.06832 7.13701 7.68684 7.33125L7.68587 7.33027C7.3749 6.73454 7.0523 6.11683 6.7259 5.4914C7.10242 5.21215 7.50294 4.9888 7.93098 4.81465C8.50607 4.58112 9.10316 4.4626 9.72395 4.425Z"
              fill="#00A3C6"
            />
          </svg>
        </button>

        <button
          onClick={() => setShowHistory(true)}
          className="absolute top-2 right-4 text-gray-600 w-[24px] hover:text-gray-800 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="auto"
            viewBox="0 0 24 25"
            fill="none"
          >
            <path
              d="M23.9883 12.7266C23.7072 16.2994 22.2117 19.2307 19.4102 21.46C15.8319 24.3072 10.9048 24.8296 6.78027 22.834C2.49685 20.7615 0.202787 16.6197 0.0244141 12.7325H2.43066C2.72782 15.7175 4.06068 18.1293 6.52148 19.8741C8.34685 21.1679 10.4016 21.7248 12.6309 21.5772C15.008 21.4195 17.0586 20.4908 18.7471 18.8116C20.4285 17.1389 21.3488 15.097 21.5537 12.7266H23.9883ZM12.0107 3.82327C16.5392 3.82948 20.199 7.49844 20.1953 12.0284C20.1917 16.5691 16.5231 20.2282 11.9805 20.2217C7.4323 20.2151 3.79147 16.5469 3.79785 11.9766C3.80447 7.47042 7.48373 3.8173 12.0107 3.82327ZM12.791 5.74906C12.3553 5.60025 11.8208 5.82996 11.8262 6.42288C11.8427 8.23543 11.8282 10.0484 11.8369 11.8614C11.8377 12.048 11.7755 12.1385 11.6191 12.2266C10.4078 12.9103 9.20137 13.6033 7.99414 14.294C7.65117 14.4901 7.57314 14.8695 7.79395 15.2559C7.99798 15.613 8.30099 15.6965 8.66602 15.4883C10.1252 14.6557 11.5823 13.8197 13.0439 12.9912C13.1718 12.9188 13.2094 12.8368 13.209 12.6973C13.204 11.6429 13.2061 10.5876 13.2061 9.53324V9.01663C13.2061 8.13432 13.208 7.25148 13.2051 6.36917C13.2038 6.04279 13.0666 5.84339 12.791 5.74906ZM5.08301 2.21878C8.87726 -0.49057 13.8925 -0.746489 17.9375 1.60452C21.6426 3.75775 23.5991 7.05087 24.001 11.3203H21.5645C21.2408 8.15859 19.7854 5.65981 17.1016 3.92581C15.3183 2.77419 13.3399 2.30681 11.2285 2.47855C6.22266 2.88635 2.68036 6.96231 2.43164 11.3233L2.43066 11.3223H0C0.319999 7.50687 1.97007 4.44227 5.08301 2.21878Z"
              fill="#575757"
            />
          </svg>
        </button>

        <h2 className="text-[#00A3C6] text-center text-2xl font-roboto font-bold leading-[24px] mb-6">
          CHÀO MỪNG BẠN
          <br />
          ĐẾN VỚI MINIGAME
        </h2>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 px-2 py-2.5 border-1 border-[#00A3C6] rounded-[8px] bg-[#EEE]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
            >
              <path
                d="M6.71669 12.3438C6.78561 12.2733 6.86788 12.2173 6.95867 12.179C7.04947 12.1406 7.147 12.1208 7.24556 12.1205C7.34412 12.1202 7.44175 12.1396 7.53275 12.1774C7.62376 12.2153 7.70632 12.2708 7.77563 12.3409C7.84494 12.411 7.89961 12.4942 7.93645 12.5856C7.97329 12.677 7.99156 12.7748 7.9902 12.8734C7.98885 12.9719 7.96789 13.0692 7.92855 13.1596C7.88921 13.25 7.83228 13.3316 7.76107 13.3998C7.13096 14.0198 6.63105 14.7594 6.29066 15.5753C5.95028 16.3912 5.77629 17.2668 5.77889 18.1508C5.77889 19.0592 8.3827 20.3789 12.4631 20.3789C16.5436 20.3789 19.1474 19.0585 19.1474 18.1493C19.1499 17.2714 18.9782 16.4016 18.6423 15.5905C18.3064 14.7794 17.813 14.0429 17.1905 13.4238C17.1201 13.3551 17.0641 13.2732 17.0256 13.1827C16.9871 13.0922 16.9669 12.995 16.9663 12.8967C16.9657 12.7984 16.9846 12.7009 17.0219 12.6099C17.0593 12.519 17.1143 12.4363 17.1838 12.3668C17.2534 12.2973 17.336 12.2423 17.427 12.2049C17.5179 12.1676 17.6154 12.1487 17.7137 12.1493C17.812 12.1499 17.9093 12.1701 17.9997 12.2086C18.0902 12.247 18.1721 12.3031 18.2408 12.3735C19.0017 13.1305 19.605 14.0308 20.0156 15.0225C20.4261 16.0142 20.6359 17.0775 20.6328 18.1508C20.6328 20.5628 16.4239 21.8643 12.4631 21.8643C8.50235 21.8643 4.2935 20.5628 4.2935 18.1508C4.2902 17.0702 4.50286 15.9999 4.91898 15.0027C5.33511 14.0055 5.94631 13.1015 6.71669 12.3438Z"
                fill="#00A3C6"
              />
              <path
                d="M12.4631 12.9519C11.4349 12.9519 10.4298 12.647 9.57481 12.0758C8.71986 11.5045 8.05351 10.6925 7.66002 9.74258C7.26653 8.79261 7.16357 7.74729 7.36417 6.73881C7.56477 5.73033 8.05992 4.80399 8.78699 4.07691C9.51406 3.34984 10.4404 2.8547 11.4489 2.6541C12.4574 2.4535 13.5027 2.55645 14.4527 2.94994C15.4026 3.34343 16.2146 4.00978 16.7858 4.86473C17.3571 5.71968 17.662 6.72482 17.662 7.75306C17.6604 9.1314 17.1122 10.4528 16.1375 11.4275C15.1629 12.4021 13.8415 12.9503 12.4631 12.9519Z"
                fill="#00A3C6"
              />
            </svg>
            <input
              type="text"
              value={userData.username}
              className="flex-1 bg-transparent font-bold outline-none text-[#00687E]"
              disabled
            />
          </div>
          <p className="text-center font-medium text-[14px] text-[#6D6D6D] mt-1">
            Tham gia mini game và dành giải thưởng khi hoàn tất
          </p>
        </div>

        <div className="mt-6 flex flex-col justify-center mx-auto items-center gap-4">
          <button
            onClick={onStartQuiz}
            className={`w-[250px] h-[50px] transform transition-all duration-300 cursor-pointer ${
              hasCompletedQuiz1 ? "opacity-50" : ""
            }`}
            style={{
              borderRadius: "27.138px",
              border: "0.822px solid #FFF",
              background: "linear-gradient(0deg, #2C70DE 0%, #00B2FF 100%)",
              boxShadow: "0px 2.638px 2.638px 0px #08F",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            <span className="text-white font-bold uppercase">
              trả lời câu hỏi gợi ý
            </span>
            {hasCompletedQuiz1 && (
              <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Đã hoàn thành
              </div>
            )}
          </button>

          <button
            onClick={onStartWordGuess}
            className={`w-[250px] h-[50px] text-white font-bold rounded-[25.585px] shadow-md transform transition-all duration-300 cursor-pointer ${
              hasCompletedQuiz2 ? "opacity-50" : ""
            }`}
            style={{
              background: "linear-gradient(180deg, #02A8CC 0%, #1C81A0 100%)",
              boxShadow: "0px -4px 0px 0px #62DDFF inset",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            ĐUỔI HÌNH BẮT CHỮ
            {hasCompletedQuiz2 && (
              <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Đã hoàn thành
              </div>
            )}
          </button>
        </div>
      </div>

      <GameHistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        userData={userData}
      />
      <RulesGame
        isOpen={showRuleGame}
        onClose={() => setShowRuleGame(false)}
      ></RulesGame>
    </div>
  );
};

export default WelcomeModal;
