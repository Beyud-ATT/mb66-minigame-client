import axios from "axios";
import { sampleUsers } from "../utils/sampledata";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const API_BASE_URL = import.meta.env.VITE_ENDPOINT;
const SITE = import.meta.env.VITE_SITE;

export const checkUser = async (username, bankLastDigits) => {
  // Verify user credentials using sample data instead of API
  try {
    let fp = await FingerprintJS.load();
    let { visitorId } = await fp.get();
    let fpClient = visitorId ?? "-";
    if (!API_BASE_URL || !SITE) {
      return null;
    }
    let data = {
      account: username.trim(),
      site: SITE,
      fp: fpClient,
      bankLast4: bankLastDigits,
    };
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: API_BASE_URL + "/api/player-account/login?site=" + SITE,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(data),
    };
    return await axios
      .request(config)
      .then(async (response) => {
        const data = response?.data;
        handleSessionExpired(data);
        if (data) {
          return data;
        } else {
          return 404;
        }
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        return 502;
      });
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    return 500;
  }
};

export const checkTokenUser = async (token) => {
  try {
    if (!API_BASE_URL || !SITE) {
      return null;
    }
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: API_BASE_URL + "/api/player-account/checkAuthAccount?site=" + SITE,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await axios
      .request(config)
      .then(async (response) => {
        const data = response?.data;
        handleSessionExpired(data);
        if (data) {
          return data;
        } else {
          return 404;
        }
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        return 502;
      });
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    return 500;
  }
};

export const fetchMiniGameQuestions = async (username) => {
  try {
    const token = localStorage.getItem("token");

    if (!API_BASE_URL || !SITE || !token) {
      return null;
    }
    let data = {
      account: username.trim(),
      game_type: 1,
    };
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url:
        API_BASE_URL + "/api/player-questions/get-detail-answers?site=" + SITE,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify(data),
    };
    return await axios
      .request(config)
      .then(async (response) => {
        const data = response?.data;
        handleSessionExpired(data);

        if (data) {
          return data;
        } else {
          return 404;
        }
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        return 502;
      });
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
};

export const submitQuestionsAnswers = async (data) => {
  try {
    const token = localStorage.getItem("token");

    if (!API_BASE_URL || !SITE || !token) {
      return null;
    }
    data.game_type = 1;
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: API_BASE_URL + "/api/player-questions/post-answers?site=" + SITE,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify(data),
    };
    return await axios
      .request(config)
      .then(async (response) => {
        const data = response?.data;
        handleSessionExpired(data);
        return data;
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        return 500;
      });
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    return 500;
  }
};

export const fetchMiniWordGuessQuestions = async (username) => {
  try {
    const token = localStorage.getItem("token");

    if (!API_BASE_URL || !SITE || !token) {
      return null;
    }
    let data = {
      account: username.trim(),
      game_type: 2,
    };
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url:
        API_BASE_URL +
        "/api/player-questions/get-word-guess-question?site=" +
        SITE,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify(data),
    };
    return await axios
      .request(config)
      .then(async (response) => {
        const data = response?.data;
        handleSessionExpired(data);
        if (data) {
          return data;
        } else {
          return 404;
        }
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        return 502;
      });
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
};

export const submitWordGuessQuestions = async (data) => {
  try {
    const token = localStorage.getItem("token");

    if (!API_BASE_URL || !SITE || !token) {
      return null;
    }
    data.game_type = 2;

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url:
        API_BASE_URL +
        "/api/player-questions/post-word-guess-question?site=" +
        SITE,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify(data),
    };
    return await axios
      .request(config)
      .then(async (response) => {
        const data = response?.data;
        handleSessionExpired(data);
        return data;
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        return 500;
      });
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    return 500;
  }
};

export const getHistoryQuestionAccount = async (username, page = 1) => {
  try {
    if (!API_BASE_URL || !SITE) {
      return null;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Token không tồn tại");
      return null;
    }

    let data = {
      account: username.trim(),
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url:
        API_BASE_URL +
        "/api/player-questions/list-history?site=" +
        SITE +
        "&page=" +
        page,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify(data),
    };

    return await axios
      .request(config)
      .then(async (response) => {
        const data = response?.data;
        handleSessionExpired(data);
        if (data) {
          return data;
        } else {
          return 404;
        }
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        return 502;
      });
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
};

// Add a local storage key for completed users
export const checkParticipation = async (username) => {
  // Check both localStorage and sample data
  const completedUsers = JSON.parse(
    localStorage.getItem("completed_users") || "[]"
  );
  if (completedUsers.includes(username.toLowerCase())) {
    return {
      hasParticipated: true,
      participationDate: new Date().toISOString(),
    };
  }

  const user = sampleUsers.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );
  return {
    hasParticipated: user?.participationDate !== null,
    participationDate: user?.participationDate,
  };
};

export const updateParticipation = async (username) => {
  // Update both localStorage and sample data
  const user = sampleUsers.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );
  if (user) {
    user.participationDate = new Date().toISOString();
  }

  const completedUsers = JSON.parse(
    localStorage.getItem("completed_users") || "[]"
  );
  if (!completedUsers.includes(username.toLowerCase())) {
    completedUsers.push(username.toLowerCase());
    localStorage.setItem("completed_users", JSON.stringify(completedUsers));
  }

  return true;
};
const handleSessionExpired = (data) => {
  if (data?.status === 401 && data?.valid === false) {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("site");
    localStorage.removeItem("site-ttkm");
    localStorage.removeItem("resetToken");
    setTimeout(() => {
      window.location.reload();
    }, 3600);
    return true;
  }
  return false;
};
