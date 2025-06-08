import { CloseModalButton, ModalHeader } from "../../utils/svg";

const RulesGame = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-70">
      <div
        className="relative p-4 max-w-[355px] text-sm"
        style={{
          borderRadius: "26px",
          border: "1px solid #F00",
          background: "rgba(255, 255, 255)",
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4">
          <div className="relative w-[236px] h-[40px] uppercase flex items-center justify-center">
            <span className="text-white font-bold z-10">thể lệ trò chơi</span>
            <ModalHeader className="absolute top-0 left-0" />
          </div>
        </div>

        <div
          className="absolute top-4 right-4 cursor-pointer"
          onClick={onClose}
        >
          <CloseModalButton />
        </div>

        <h2 className="w-[80%] mx-auto text-lg font-bold text-center text-[var(--primary-color)] mb-3 mt-6">
          CHI TIẾT SỰ KIỆN THAM GIA MINIGAME CÙNG MB66
        </h2>

        <div className="space-y-3 text-black leading-relaxed text-justify md:text-[14px] text-[12px]">
          <div>
            <strong>📌 Thể lệ tham gia:</strong>
            <ul>
              <li>
                Hệ thống sẽ đưa các câu hỏi và hình ảnh để hội viên trả lời.
              </li>
              <li>Các câu hỏi và hình ảnh sẽ được xáo trộn ngẫu nhiên.</li>
              <li>
                Nhiệm vụ của người chơi là đoán ra đúng đáp án thông qua hình
                ảnh hoặc lựa chọn các đáp án có sẵn.
              </li>
              <li>Mỗi người chỉ được tham gia 1 lần/ngày.</li>
            </ul>
          </div>

          <div>
            <strong>🏆 Cách tính điểm & trúng thưởng:</strong>
            <ul>
              <li>
                Người chơi trả lời đúng và nhanh nhất sẽ nhận code quà tặng hấp
                dẫn.
              </li>
              <li>
                Ưu tiên người trả lời sớm nhất, điểm thưởng cao nhất 1,888,000
                VNĐ .
              </li>
              <li>
                Các hội viên trả lời chậm, hoặc có câu sai sẽ được phần thưởng
                ít hơn.
              </li>
              <li>
                Code sẽ được gửi trong hòm thư nội bộ sau khi hội viên hoàn
                thành.
              </li>
            </ul>
          </div>

          <div>
            <strong>⛔️ Quy định khác:</strong>
            <ul>
              <li>Nghiêm cấm sao chép, dùng tool, spam.</li>
              <li>
                Hệ thống có quyền từ chối trao thưởng nếu phát hiện hành vi gian
                lận.
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center mt-6 mb-6 text-justify">
          <button
            onClick={onClose}
            className="w-[277px] h-[33px] shadow-md transform scale-100 hover:scale-105 transition-all duration-300 cursor-pointer"
            style={{
              borderRadius: "56.972px",
              border: "1.628px solid #900",
              background: "linear-gradient(0deg, #A00 0%, #F00 100%)",
            }}
          >
            <span className="text-white font-bold">ĐÃ HIỂU</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RulesGame;
