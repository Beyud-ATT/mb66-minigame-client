import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { getHistoryQuestionAccount } from "../services/api_service";
import { CloseModalButton, ModalHeader } from "../utils/svg";

const GameHistoryModal = ({ isOpen, onClose, userData }) => {
  const [loading, setLoading] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null); // << thêm

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (isOpen && userData?.username) {
      setPage(1);
    }
  }, [isOpen, userData?.username]);

  useEffect(() => {
    if (isOpen && userData?.username) {
      getGameHistory(userData.username, page);
    }
  }, [page, isOpen, userData?.username]);

  const getGameHistory = async (username, pageNumber = 1) => {
    setLoading(true);
    try {
      const response = await getHistoryQuestionAccount(username, pageNumber);
      const data = response;

      if (data?.status === 200) {
        setGameHistory(data.result || []);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (err) {
      enqueueSnackbar(err.message || "Có lỗi xảy ra khi lấy lịch sử câu hỏi", {
        variant: "error",
        preventDuplicate: true,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 1500);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[60] bg-black/50">
      <div className="relative w-[90%] max-w-[400px] p-4 rounded-[15px] bg-white">
        <div className="flex justify-between items-center mb-4">
          <div className="flex justify-end w-full text-right" onClick={onClose}>
            <CloseModalButton />
          </div>
          <header className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4">
            <div className="relative w-[236px] h-[40px] uppercase flex items-center justify-center">
              <span className="text-white font-bold z-10">thể lệ trò chơi</span>
              <ModalHeader className="absolute top-0 left-0" />
            </div>
          </header>
        </div>

        <div className="overflow-y-auto max-h-[60vh] space-y-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 space-y-2">
              <div className="w-10 h-10 border-4 border-[#2C70DE] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-600">Đang tải dữ liệu...</p>
            </div>
          ) : gameHistory.length === 0 ? (
            <div className="text-center text-[#000345]">Không có dữ liệu</div>
          ) : (
            gameHistory.map((game, index) => {
              const isExpanded = expandedIndex === index;

              return (
                <div
                  key={index}
                  className="p-4 border border-[var(--primary-color)] rounded-lg bg-gray-50 cursor-pointer transition-all"
                  onClick={() => toggleExpand(index)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-[var(--primary-color)]">
                      {game.category == 1
                        ? "Trả lời câu hỏi"
                        : "Đuổi hình đoán chữ"}
                    </h4>
                    <span className="text-sm text-[#000345]">
                      {new Date(game.updatedAt).toLocaleString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                      })}
                    </span>
                  </div>
                  <div className="text-sm text-[#000345]">
                    <p>
                      Số câu đúng: {game.correctAnswer}/{game.totalQuestion}
                    </p>

                    {game.promo_code && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-medium">Mã thưởng:</span>
                        <div
                          className="flex-1 flex items-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(game.promo_code, index);
                          }}
                        >
                          <code className="bg-[var(--primary-color-light)] px-2 py-1 rounded">
                            {game.promo_code}
                          </code>
                          <button className="text-[var(--primary-color)] hover:text-[var(--primary-color-2)] cursor-pointer">
                            {copiedIndex === index ? (
                              <span className="text-green-600 text-sm">
                                Đã copy
                              </span>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="14"
                                viewBox="0 0 12 14"
                                fill="none"
                              >
                                <path
                                  d="M8.52613 0.328003H1.36869C0.712589 0.328003 0.175781 0.864811 0.175781 1.52091V9.87126H1.36869V1.52091H8.52613V0.328003ZM10.3155 2.71382H3.7545C3.0984 2.71382 2.56159 3.25062 2.56159 3.90672V12.2571C2.56159 12.9132 3.0984 13.45 3.7545 13.45H10.3155C10.9716 13.45 11.5084 12.9132 11.5084 12.2571V3.90672C11.5084 3.25062 10.9716 2.71382 10.3155 2.71382ZM10.3155 12.2571H3.7545V3.90672H10.3155V12.2571Z"
                                  fill="var(--primary-color)"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Chi tiết câu hỏi toggle */}
                    <div
                      className={`mt-4 overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded ? "max-h-[1000px]" : "max-h-0"
                      }`}
                    >
                      {game.questions?.map((q) => {
                        let userAnswer;
                        if (game.category == 2) {
                          userAnswer =
                            game.SelectionAnswers?.find(
                              (a) => a.questionId === q._id
                            )?.userAnswer || "";
                        } else {
                          const answerObj = game.SelectionAnswers?.find(
                            (a) => a.questionId === q._id
                          );

                          if (Array.isArray(answerObj?.userAnswersText)) {
                            userAnswer = answerObj.userAnswersText.join(", ");
                          } else {
                            userAnswer = answerObj?.userAnswersText || "";
                          }
                        }
                        const correctData = game.incorrectAnswers?.find(
                          (a) => a.questionId === q._id
                        );
                        const isCorrect = !correctData;

                        return (
                          <div
                            key={q._id}
                            className={`p-2 border border-[#2C70DE] rounded mb-2 ${
                              isCorrect ? "bg-green-50" : "bg-red-50"
                            }`}
                          >
                            <p className="font-medium text-[#000345]">
                              ❓ {q.question}
                            </p>
                            {q.image && (
                              <img
                                src={q.image}
                                alt="minh họa"
                                className="mt-2 m-auto max-w-[80%] h-auto rounded"
                              />
                            )}
                            <p>
                              <span className="font-medium">Trả lời: </span>
                              <span className="text-blue-700">
                                {userAnswer}
                              </span>
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="px-3 py-1 text-sm border rounded cursor-pointer text-white font-medium"
            style={{
              borderRadius: "16.348px",
              border: "0.495px solid #FFF",
              background: `${
                page === totalPages
                  ? "#C2C2C2"
                  : "linear-gradient(0deg, var(--primary-color-light) 0%, var(--primary-color-2) 100%)"
              }`,
              boxShadow: `0px 1.589px 1.589px 0px ${
                page === totalPages ? "#ACACAC" : "#08F"
              }`,
            }}
          >
            Trang trước
          </button>
          <span className="text-sm">
            Trang {page} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="px-3 py-1 text-sm border rounded cursor-pointer text-white font-medium"
            style={{
              borderRadius: "16.348px",
              border: "0.495px solid #FFF",
              background: `${
                page === totalPages
                  ? "#C2C2C2"
                  : "linear-gradient(0deg, var(--primary-color-light) 0%, var(--primary-color-2) 100%)"
              }`,
              boxShadow: `0px 1.589px 1.589px 0px ${
                page === totalPages ? "#ACACAC" : "#08F"
              }`,
            }}
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameHistoryModal;
