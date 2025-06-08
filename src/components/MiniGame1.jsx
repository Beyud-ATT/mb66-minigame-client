import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import {
  fetchMiniGameQuestions,
  submitQuestionsAnswers,
} from "../services/api_service";
import CountdownTimer from "./CountdownTimer";
import { remainingTime } from "../utils/timeUtils";
import { useSnackbar } from "notistack";
import ConfirmAnswerModal from "./ConfirmAnswerModal";
import CompoundGameResult from "./CompoundGameResult";
import { CloseModalButton } from "../utils/svg";

// userData: Object containing user information such as username and preferences
const QuizModal = ({ isOpen, onClose, userData }) => {
  const { enqueueSnackbar } = useSnackbar();
  const confirmAnswerModalRef = useRef(null);
  const gameResultModalRef = useRef(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);

  const [activeSubmit, setActiveSubmit] = useState(false);

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [dataRegisterQuestions, setDataRegisterQuestions] = useState({});

  // Add new state for continuing session
  const [isContinuingSession, setIsContinuingSession] = useState(false);

  const [promoCode, setPromoCode] = useState("");
  const [msgBack, setMsgBack] = useState("");
  const [submitAnswer, setSubmitAnswer] = useState(null);

  // Reset function
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setDataRegisterQuestions({});
    setQuizQuestions([]);
    setTimeRemaining(0);
    setActiveSubmit(false);
  };

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetQuiz();
    }
  }, [isOpen]);

  // Fetch questions when modal opens
  useEffect(() => {
    if (isOpen) {
      getQuestions(userData?.username);
    }
  }, [isOpen, userData]);

  // Fetch questions from API
  const getQuestions = async (username) => {
    setLoading(true);
    try {
      const response = await fetchMiniGameQuestions(username);
      console.log("Raw API Response:", response);

      // Access response data directly since it's already in the correct format
      const data = response; // Remove .data access

      console.log("Processed API Response:", data);

      if (data?.status === 200) {
        setDataRegisterQuestions(data.result);
        setQuizQuestions(data.result.questions);
        setTimeRemaining(data.timeRemaining ?? 0);

        // Show continuation message
        if (data.message?.includes("Bạn đang trong thời gian chơi")) {
          enqueueSnackbar(data.message, {
            variant: "info",
            preventDuplicate: true,
          });
        }

        // Handle existing answers
        if (data.result.SelectionAnswers?.length > 0) {
          setIsContinuingSession(true);

          // Map answers to questions using _id
          const savedAnswers = {};
          data.result.SelectionAnswers.forEach((answer) => {
            const questionIndex = data.result.questions.findIndex(
              (q) => q._id === answer.id
            );
            if (questionIndex !== -1) {
              savedAnswers[questionIndex] = {
                id: answer.id,
                answers: answer.answers,
              };
            }
          });

          console.log("Restored answers:", savedAnswers);
          setSelectedAnswers(savedAnswers);
        }

        if (data.timeRemaining && data.timeRemaining > 0) {
          setActiveSubmit(true);
        }
      } else {
        throw new Error(data?.message || "Không thể tải câu hỏi");
      }
    } catch (err) {
      // console.error("Error fetching questions:", err);
      enqueueSnackbar(err.message || "Có lỗi xảy ra khi tải câu hỏi", {
        variant: "error",
        preventDuplicate: true,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // Add new useEffect to handle activeSubmit state
  useEffect(() => {
    if (!loading && !activeSubmit) {
      onClose();
    }
  }, [loading, activeSubmit]);

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
  if (!activeSubmit) return null;

  const question = quizQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;
  const isFirstQuestion = currentQuestion === 0;
  const hasCurrentAnswer =
    selectedAnswers[currentQuestion]?.answers?.length > 0;

  // Handle answer selection
  const handleAnswerSelect = (index) => {
    const currentQuestionData = quizQuestions[currentQuestion];
    const questionId = currentQuestionData?.id; // Get _id from current question

    if (!questionId) {
      console.error("Question ID not found:", currentQuestionData);
      return;
    }

    if (currentQuestionData.type === "single") {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestion]: {
          id: questionId,
          answers: [index],
        },
      });
    } else {
      const current = selectedAnswers[currentQuestion]?.answers || [];
      const updated = current.includes(index)
        ? current.filter((i) => i !== index)
        : [...current, index];

      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestion]: {
          id: questionId,
          answers: updated,
        },
      });
    }
  };

  // Handle next question
  const handleNext = () => {
    if (!isLastQuestion && hasCurrentAnswer) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  // Handle previous question
  const handlePrev = () => {
    if (!isFirstQuestion) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  // Calculate score
  const calculateScore = () => {
    let correct = 0;
    let answered = 0;

    Object.entries(selectedAnswers).forEach(([questionIndex, { answers }]) => {
      answered++;
      const question = quizQuestions[questionIndex];
      if (question.type === "single") {
        if (question.options[answers[0]]?.isCorrect) {
          correct++;
        }
      } else {
        const correctIndices = question.options
          .map((opt, idx) => (opt.isCorrect ? idx : null))
          .filter((idx) => idx !== null);

        const isAllCorrect =
          answers.length === correctIndices.length &&
          answers.every((index) => question.options[index]?.isCorrect);

        if (isAllCorrect) correct++;
      }
    });

    return {
      correct,
      answered,
      selectedAnswers,
      total: quizQuestions.length,
    };
  };

  const score = calculateScore();

  const formattedAnswers = Object.values(score.selectedAnswers).map(
    (answer) => {
      if (!answer.id) {
        console.error("Missing question ID in answer:", answer);
      }
      return {
        id: answer.id,
        answers: answer.answers,
      };
    }
  );

  let dataSubmit = {
    id: dataRegisterQuestions?._id,
    account: dataRegisterQuestions?.account,
    site: dataRegisterQuestions?.site,
    answers: formattedAnswers,
  };

  async function handleSubmitAnswer() {
    let submitAnswer = await submitQuestionsAnswers(dataSubmit);
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
  }

  // Handle submit
  const handleSubmit = () => {
    const answeredCount = Object.keys(selectedAnswers).length;
    const totalQuestions = quizQuestions.length;
    const remainingQuestions = totalQuestions - answeredCount;

    if (remainingQuestions > 0) {
      enqueueSnackbar(`Bạn còn ${remainingQuestions} câu hỏi chưa trả lời!`, {
        variant: "warning",
        preventDuplicate: true,
      });
    } else {
      confirmSubmit();
    }
  };

  // Confirm submit
  const confirmSubmit = () => {
    confirmAnswerModalRef.current?.openModal();
  };

  // Handle time up
  const handleTimeUp = async () => {
    if (!activeSubmit || activeSubmit == false) {
      enqueueSnackbar(`Phiên trả lời của bạn đã hết thời gian`, {
        variant: "error",
        preventDuplicate: true,
      });
      resetQuiz();
      onClose();
      return;
    }

    await handleSubmitAnswer();
  };

  const getInitialTime = () => {
    return timeRemaining > 0 ? remainingTime(timeRemaining) : 0;
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
        <div className="relative w-[90%] max-w-[400px] py-8 px-6 rounded-[15.678px] bg-[rgba(255,255,255,0.95)] shadow-[0px_0px_20px_0px_rgba(255,255,255,0.25)] border border-[var(--primary-color)]">
          {/* Add session continuation indicator */}
          {isContinuingSession && (
            <div className="absolute top-0 left-0 right-0 bg-[var(--primary-color)] text-white text-center py-1 text-sm">
              Tiếp tục phiên trả lời trước
            </div>
          )}
          {/* Countdown Timer */}
          <div className="absolute top-0 left-0 right-0 pt-5">
            <CountdownTimer
              initialTime={getInitialTime()}
              onTimeUp={handleTimeUp}
            />
          </div>

          {/* Close Button */}
          <button onClick={onClose} className="absolute top-2 right-2">
            <CloseModalButton />
          </button>

          {/* Progress Indicator */}
          <div className="flex justify-between items-center my-8">
            <div className="text-[var(--primary-color)] font-roboto text-base font-bold">
              Câu hỏi {currentQuestion + 1}/{quizQuestions.length}
            </div>
            <div className="text-[#5D5D5D] text-sm">
              {Object.keys(selectedAnswers).length}/{quizQuestions.length} câu
              đã trả lời
            </div>
          </div>

          {/* Question Text */}
          <div className="text-[#5D5D5D] font-roboto text-base font-bold leading-[24px] mb-6">
            {question?.question}
          </div>

          {/* Image if exists */}
          {question?.image && (
            <div className="mb-4 flex justify-center">
              <img
                src={question.image}
                alt="Question"
                className="w-full rounded-lg max-w-[160px] max-h-[160px]"
              />
            </div>
          )}

          {/* Options */}
          <div className="space-y-3">
            {question?.options.map((option, index) => {
              const isSelected = (
                selectedAnswers[currentQuestion]?.answers || []
              ).includes(index);
              return (
                <label
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg border border-[var(--primary-color)] cursor-pointer hover:bg-[var(--primary-color-light)] 
          ${isSelected ? "bg-[var(--primary-color-light)]" : ""}`}
                >
                  <input
                    type={question.type === "multiple" ? "checkbox" : "radio"}
                    name="answer"
                    checked={isSelected}
                    onChange={() => handleAnswerSelect(index)}
                    className={`w-4 h-4 text-[var(--primary-color)] ${
                      isSelected
                        ? "text-[var(--primary-color)] font-medium"
                        : ""
                    }`}
                  />
                  {option.image ? (
                    <img
                      src={option.image}
                      alt={option.text || `Option ${index + 1}`}
                      className="w-32 h-20 object-contain"
                    />
                  ) : (
                    <span
                      className={`text-[#262626] font-roboto text-[15.479px] font-medium ${
                        isSelected ? "text-[var(--primary-color)]" : ""
                      }`}
                    >
                      {option.text}
                    </span>
                  )}
                </label>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={isFirstQuestion}
              className="px-8 py-1 uppercase font-extrabold text-sm"
              style={{
                borderRadius: "15.749px",
                border: "0.477px solid #FFF",
                background: "#C0D2F0",
                boxShadow: "0px 1.531px 1.531px 0px #08F",
              }}
            >
              quay lại
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                className="h-[46px] px-4 text-white uppercase font-extrabold text-sm scale-100 hover:scale-105 transform transition-all duration-300 cursor-pointer"
                style={{
                  borderRadius: "15.749px",
                  border: "0.477px solid #FFF",
                  background:
                    "linear-gradient(0deg, var(--primary-color) 0%, var(--primary-color-light) 100%)",
                  boxShadow: "0px 1.531px 1.531px 0px #08F",
                }}
                aria-label="Submit"
              >
                HOÀN THÀNH
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!hasCurrentAnswer}
                className="px-8 py-1 text-white uppercase font-extrabold text-sm"
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
        resetQuiz={resetQuiz}
        submitAnswer={submitAnswer}
      />
    </>
  );
};

export default QuizModal;
