import { useState, useEffect, useCallback, useMemo } from "react";
import CountdownTimer from "./CountdownTimer";
import { remainingTime } from "../utils/timeUtils";
import { useSnackbar } from "notistack";
import {
  fetchMiniWordGuessQuestions,
  submitWordGuessQuestions,
} from "../services/api_service";
import Swal from "sweetalert2";
import ConfirmAnswerModal from "./ConfirmAnswerModal";
import CompoundGameResult from "./CompoundGameResult";
import { useRef } from "react";
import { CloseModalButton } from "../utils/svg";

const MiniGame2 = ({ isOpen, onClose, userData }) => {
  const { enqueueSnackbar } = useSnackbar();
  const confirmAnswerModalRef = useRef(null);
  const gameResultModalRef = useRef(null);

  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [gameState, setGameState] = useState({
    currentQuestion: 0,
    answers: {},
    currentAnswer: "",
    loading: true,
    timeRemaining: 0,
    wordGuessQuestions: [],
    dataRegisterQuestions: {},
    isContinuingSession: false,
  });

  const [promoCode, setPromoCode] = useState("");
  const [msgBack, setMsgBack] = useState("");
  const [submitAnswer, setSubmitAnswer] = useState(null);

  const {
    currentQuestion,
    answers,
    currentAnswer,
    loading,
    timeRemaining,
    wordGuessQuestions,
    dataRegisterQuestions,
  } = gameState;

  const question = useMemo(
    () => wordGuessQuestions[currentQuestion],
    [wordGuessQuestions, currentQuestion]
  );
  const isLastQuestion = useMemo(
    () => currentQuestion === wordGuessQuestions.length - 1,
    [currentQuestion, wordGuessQuestions]
  );
  const isFirstQuestion = useMemo(
    () => currentQuestion === 0,
    [currentQuestion]
  );
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  const getWordGuessQuestions = useCallback(
    async (username) => {
      if (!username) return;

      setGameState((prev) => ({ ...prev, loading: true }));

      try {
        const response = await fetchMiniWordGuessQuestions(username);
        const data = response;

        if (data?.status === 200) {
          const newState = {
            dataRegisterQuestions: data.result,
            wordGuessQuestions: data.result.questions || [],
            timeRemaining: data.timeRemaining ?? 0,
            loading: false,
          };

          if (data.message?.includes("Bạn đang trong thời gian chơi")) {
            enqueueSnackbar(data.message, { variant: "info" });
          }

          if (data.result.SelectionAnswers?.length > 0) {
            const savedAnswers = {};
            const questions = data.result.questions || [];

            questions.forEach((q, index) => {
              const answerObj = data.result.SelectionAnswers.find(
                (a) => a.id === q.id
              );
              if (answerObj) {
                savedAnswers[index] = {
                  id: q.id,
                  answers: answerObj.answers,
                };
              }
            });

            newState.isContinuingSession = true;
            newState.answers = savedAnswers;
            newState.currentAnswer =
              savedAnswers[currentQuestion]?.answers || "";
          }

          setGameState((prev) => ({ ...prev, ...newState }));
        } else {
          throw new Error(data?.message || "Không thể tải câu hỏi");
        }
      } catch (err) {
        // console.error("Error fetching questions:", err);
        enqueueSnackbar(err.message || "Có lỗi xảy ra khi tải câu hỏi", {
          variant: "error",
        });
        onClose();
      }
    },
    [enqueueSnackbar, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      getWordGuessQuestions(userData?.username);
    }
  }, [isOpen, userData, getWordGuessQuestions]);

  const getInitialTime = useCallback(() => {
    return timeRemaining > 0 ? remainingTime(timeRemaining) : 0;
  }, [timeRemaining]);

  const resetGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      currentQuestion: 0,
      answers: {},
      currentAnswer: "",
    }));
  }, []);

  const handleInputChange = (e) => {
    const newAnswer = e.target.value.toUpperCase();

    setGameState((prev) => ({
      ...prev,
      currentAnswer: newAnswer,
      answers: {
        ...prev.answers,
        [currentQuestion]: {
          id: question?.id,
          answers: newAnswer,
        },
      },
    }));
  };

  const navigateQuestion = useCallback(
    (direction) => {
      const newIndex =
        direction === "next" ? currentQuestion + 1 : currentQuestion - 1;

      setGameState((prev) => ({
        ...prev,
        currentQuestion: newIndex,
        currentAnswer: prev.answers[newIndex]?.answers || "",
      }));
    },
    [currentQuestion]
  );

  const calculateScore = useCallback(
    () => ({
      answered: Object.keys(answers).length,
      answers,
      total: wordGuessQuestions.length,
    }),
    [answers, wordGuessQuestions.length]
  );

  const handleSubmit = useCallback(async () => {
    const remainingQuestions =
      wordGuessQuestions.length - Object.keys(answers).length;

    if (remainingQuestions > 0) {
      enqueueSnackbar(`Bạn còn ${remainingQuestions} câu hỏi chưa trả lời!`, {
        variant: "warning",
      });
      return;
    }

    await confirmSubmit();
  }, [wordGuessQuestions.length, enqueueSnackbar, answers]);

  const formattedAnswers = Object.values(answers).map((answer) => ({
    id: answer.id,
    answers: answer.answers,
  }));

  const payloadData = {
    id: dataRegisterQuestions?._id,
    account: dataRegisterQuestions?.account,
    site: dataRegisterQuestions?.site,
    answers: formattedAnswers,
  };

  const handleSubmitAnswer = async () => {
    const submitAnswer = await submitWordGuessQuestions(payloadData);
    if (submitAnswer?.status === 200) {
      setPromoCode(submitAnswer.promo_code);
      setMsgBack(submitAnswer.mgsBack);
      setSubmitAnswer(submitAnswer);

      gameResultModalRef.current?.open();
    } else {
      Swal.fire({
        title: "Lỗi",
        text: submitAnswer?.message || "Có lỗi xảy ra",
        icon: "error",
        confirmButtonColor: "#26A8DF",
      });
    }
  };

  const confirmSubmit = useCallback(async () => {
    try {
      confirmAnswerModalRef.current?.openModal();
    } catch (err) {
      console.error("Submit error:", err);
      Swal.fire({
        title: "Lỗi!",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#26A8DF",
      });
    }
  }, [wordGuessQuestions.length, dataRegisterQuestions, resetGame, onClose]);

  const handleTimeUp = useCallback(async () => {
    const score = calculateScore();
    enqueueSnackbar(
      `Hết thời gian! Bạn đã trả lời ${score.answered}/${score.total} câu hỏi`,
      { variant: "info" }
    );
    console.log("answers answers:", answers);

    try {
      await handleSubmitAnswer();

      // if (submitAnswer.incorrectAnswers?.length > 0) {
      //   incorrectAnswersHtml = `
      //     <div class="mt-3 text-left max-h-[340px] overflow-y-auto border-t border-gray-200 pt-4 custom-scroll">
      //       <p class="font-semibold mb-3 text-base text-gray-700">Các câu trả lời sai:</p>
      //       <ul class="space-y-3">
      //         ${submitAnswer.incorrectAnswers
      //           .map(
      //             (item) => `
      //             <li class="p-3 bg-gray-100 rounded-lg shadow-sm">
      //               <p class="font-medium text-gray-800 mb-1">📌 <span class="italic">${
      //                 item.question
      //               }</span></p>
      //               <p class="text-sm">❌ Bạn chọn: <span class="text-red-600 font-semibold">${
      //                 item.userAnswer || "Không có"
      //               }</span></p>
      //               <!-- <p class="text-sm">✅ Đúng là: <span class="text-green-600 font-semibold">${
      //                 item.correctAnswers || "Không rõ"
      //               }</span></p> -->
      //             </li>
      //           `
      //           )
      //           .join("")}
      //       </ul>
      //     </div>
      //   `;
      // }
    } catch (err) {
      console.error("Submit error:", err);
      await Swal.fire({
        title: "Lỗi!",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#FF9900",
      });
    } finally {
      resetGame();
      onClose();
    }
  }, [
    calculateScore,
    enqueueSnackbar,
    answers,
    resetGame,
    onClose,
    handleSubmitAnswer,
  ]);

  if (!isOpen) return null;

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
        <div className="flex flex-col items-center justify-center h-40 space-y-2">
          <div className="w-10 h-10 border-4 border-[#26A8DF] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-white font-bold">
            Đang tải dữ liệu câu hỏi...
          </p>
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="relative w-[90%] max-w-[400px] p-6 rounded-[15.678px] bg-[rgba(255,255,255,0.95)] shadow-[0px_0px_20px_0px_rgba(255,255,255,0.25)]">
        <CountdownTimer
          initialTime={getInitialTime()}
          onTimeUp={handleTimeUp}
          className="absolute top-2 left-2"
        />

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <CloseModalButton />
        </button>

        <div className="flex justify-between items-center my-2">
          <div className="text-[var(--primary-color)] font-roboto text-base font-bold">
            Câu hỏi {currentQuestion + 1}/{wordGuessQuestions.length}
          </div>
          <div className="text-[#5D5D5D] text-sm">
            {answeredCount}/{wordGuessQuestions.length} câu đã trả lời
          </div>
        </div>

        <div className="text-center mb-4">
          <h3 className="text-[#5D5D5D] font-bold mb-2">
            {question?.question}
          </h3>
          {/* <div className="w-full max-w-[300px] h-[200px] mx-auto mb-4 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center"> */}
          <div
            className="w-full max-w-[280px] mx-auto mb-4 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center"
            onClick={() => setIsOpenPopup(true)}
          >
            {question?.image ? (
              <img
                src={question.image}
                alt="Đoán chữ"
                className="w-full h-full object-contain"
                loading="lazy"
                onError={(e) => {
                  e.target.src = "fallback-image.png";
                  e.target.className = "w-full h-full object-cover";
                }}
              />
            ) : (
              <div className="text-gray-400">Không có hình ảnh</div>
            )}
          </div>
          {question?.suggest && (
            <p className="text-[var(--primary-color)] italic">
              Gợi ý: {question.suggest}
            </p>
          )}
        </div>
        {isOpenPopup && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={() => setIsOpenPopup(false)}
          >
            <img
              src={question.image}
              alt="Zoomed"
              className="max-w-[90%] max-h-[90%] object-contain rounded-lg shadow-lg"
            />
          </div>
        )}
        <div className="mb-6">
          <input
            type="text"
            value={currentAnswer}
            onChange={handleInputChange}
            placeholder="Nhập đáp án..."
            className="w-full p-2 border border-[#B3B3B3] rounded-lg focus:outline-none focus:border-[#26A8DF]"
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => navigateQuestion("prev")}
            disabled={isFirstQuestion}
            className={`px-6 py-1 rounded text-white uppercase font-extrabold text-sm ${
              isFirstQuestion
                ? "bg-[#B3B3B3] cursor-not-allowed"
                : "bg-[var(--primary-color)] hover:bg-[var(--primary-color-light)]"
            }`}
            style={{
              borderRadius: "56.972px",
              border: "1.628px solid #900",
              background: "linear-gradient(0deg, #A00 0%, #F00 100%)",
            }}
          >
            Câu trước
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              className="h-[46px] px-4 text-white font-bold rounded-[25.585px] shadow-md transform transition-all duration-300 cursor-pointer"
              style={{
                background: "linear-gradient(180deg, #02A8CC 0%, #1C81A0 100%)",
                boxShadow: "0px -3px 0px 0px #62DDFF inset",
              }}
              aria-label="Submit"
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              HOÀN THÀNH
            </button>
          ) : (
            <button
              onClick={() => navigateQuestion("next")}
              disabled={!currentAnswer.trim()}
              className={`px-8 py-1 text-white uppercase font-extrabold text-sm ${
                !currentAnswer.trim() ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{
                borderRadius: "56.972px",
                border: "1.628px solid #900",
                background: "linear-gradient(0deg, #A00 0%, #F00 100%)",
              }}
            >
              Câu tiếp
            </button>
          )}
        </div>
      </div>

      <ConfirmAnswerModal
        calculateScore={calculateScore}
        handleSubmitAnswer={handleSubmitAnswer}
        ref={confirmAnswerModalRef}
      />

      <CompoundGameResult
        ref={gameResultModalRef}
        promoCode={promoCode}
        msgBack={msgBack}
        resetQuiz={() => {
          resetGame();
          onClose();
        }}
        submitAnswer={submitAnswer}
      />
    </div>
  );
};

export default MiniGame2;
