require("dotenv").config();
const axios = require("axios");
const Player = require("../models/Player");
const Game = require("../models/Game");

// 플레이어 정보 조회: 닉네임으로 검색 (DB에 있으면 바로 반환, 없으면 외부 API 호출하여 생성 및 갱신)
const getPlayerByNickname = async (req, res) => {
  try {
    const { nickname } = req.params;
    console.log(`[LOG] ${nickname}의 유저 정보 조회 요청`);

    // DB에서 해당 닉네임으로 플레이어 검색
    let player = await Player.findOne({ nickname });
    if (!player) {
      console.log(
        `[LOG] DB에 닉네임 '${nickname}'로 플레이어 정보 없음. 외부 API 호출로 userNum 획득 시도`
      );
      const apiKey = process.env.API_KEY;
      const baseUrl = process.env.API_URL;

      // 외부 API 호출: /v1/user/nickname?nickname={nickname}
      const nicknameResponse = await axios.get(`${baseUrl}/user/nickname`, {
        headers: { "x-api-key": apiKey },
        params: { nickname },
      });
      console.log(
        `[LOG] 외부 API '/user/nickname' 응답:`,
        nicknameResponse.data
      );

      const { userNum } = nicknameResponse.data;
      if (!userNum) {
        console.error(`[ERROR] 외부 API에서 userNum을 획득하지 못함`);
        return res.status(404).json({ error: "유저 번호를 찾을 수 없습니다." });
      }

      // userNum을 기준으로 DB 재검색 (닉네임 변경 가능성 처리)
      player = await Player.findOne({ userNum });
      if (player) {
        console.log(
          `[LOG] DB에 userNum '${userNum}'으로 기존 플레이어 정보가 존재합니다. 닉네임 업데이트: ${player.nickname} -> ${nickname}`
        );
        player.nickname = nickname;
        await player.save();
      } else {
        console.log(
          `[LOG] DB에 userNum '${userNum}' 정보가 없으므로 새 플레이어를 생성합니다.`
        );
        player = new Player({ userNum, nickname });
        // 신규 플레이어의 경우 외부 API 데이터를 즉시 가져와 최신 상태로 업데이트
        await updatePlayerData(player);
        await player.save();
      }
    } else {
      console.log(
        `[LOG] DB에서 닉네임 '${nickname}'로 플레이어 정보 조회 성공`
      );
    }

    // 플레이어 정보를 클라이언트에 반환
    res.status(200).json(player);
  } catch (error) {
    console.error("[ERROR] getPlayerByNickname error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// 별도의 갱신 라우트: 클라이언트가 '갱신' 버튼을 누르면 호출 (동기적으로 최신 데이터를 가져와 DB 업데이트)
const refreshPlayerData = async (req, res) => {
  try {
    const { nickname } = req.params;
    console.log(`[LOG] '${nickname}'의 데이터 갱신 요청`);

    // DB에서 플레이어 검색
    let player = await Player.findOne({ nickname });
    if (!player) {
      console.log(
        `[LOG] DB에 닉네임 '${nickname}'의 플레이어 정보가 없습니다. 먼저 getPlayerByNickname을 통해 생성 후 갱신하세요.`
      );
      return res.status(404).json({
        error:
          "플레이어 정보가 DB에 없습니다. 먼저 플레이어 정보를 생성하세요.",
      });
    }

    // 외부 API에서 최신 데이터를 동기적으로 가져와 DB 업데이트
    await updatePlayerData(player);
    console.log(`[LOG] '${nickname}'의 외부 API 데이터를 갱신하였습니다.`);

    // 갱신된 플레이어 정보 반환
    res.status(200).json(player);
  } catch (error) {
    console.error("[ERROR] refreshPlayerData error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// 외부 API에서 최신 데이터를 가져와 플레이어의 stats와 게임 전적을 업데이트하는 함수
async function updatePlayerData(player) {
  try {
    const apiKey = process.env.API_KEY;
    const baseUrl = process.env.API_URL;
    const userNum = player.userNum;

    // 시즌 관련: 현재 시즌, 일반게임(0), 코발트 프로토콜(6), 유니온 대전(8)
    const seasonIds = [
      process.env.CURRENT_SEASON, // 예: "2025-03" 등 환경변수에 설정된 현재 시즌 ID
      "0", // 일반 게임
      "6", // 코발트 프로토콜
      "8", // 유니온 대전
    ];

    let statsData = {};
    // 각 시즌별 스탯 데이터를 가져옴
    for (let seasonId of seasonIds) {
      console.log(
        `[LOG] [stats] API 호출: userNum=${userNum}, seasonId=${seasonId}`
      );
      const response = await axios.get(
        `${baseUrl}/user/stats/${userNum}/${seasonId}`,
        { headers: { "x-api-key": apiKey } }
      );
      statsData[seasonId] = response.data;
    }

    // 게임 전적 데이터: 페이지네이션 적용해서 모든 페이지의 데이터를 가져옴
    let allGamesData = [];
    let next = "";
    do {
      console.log(`[LOG] [games] API 호출: userNum=${userNum}, next=${next}`);
      const response = await axios.get(`${baseUrl}/user/games/${userNum}`, {
        headers: { "x-api-key": apiKey },
        params: { next },
      });
      const data = response.data;
      if (data.userGames) {
        allGamesData = allGamesData.concat(data.userGames);
      }
      next = data.next || "";
    } while (next);

    // 각 게임의 상세 정보를 조회하여 DB의 Game 컬렉션에 저장
    for (let gameSummary of allGamesData) {
      const gameId = gameSummary.gameId;
      // DB에서 해당 gameId 검색
      let game = await Game.findOne({ gameId });
      if (!game) {
        console.log(
          `[LOG] [game 상세] 새로운 게임(${gameId}) 정보를 외부 API 호출로 획득`
        );
        const gameResponse = await axios.get(`${baseUrl}/games/${gameId}`, {
          headers: { "x-api-key": apiKey },
        });
        // 게임 상세 데이터를 Game 모델에 저장 (필요한 데이터만 선별해서 저장)
        game = new Game(gameResponse.data);
        await game.save();
      } else {
        console.log(
          `[LOG] [game 상세] 기존 게임(${gameId}) 정보가 있으므로 업데이트 생략`
        );
        // 선택 사항: 이미 저장된 게임 데이터가 오래되었다면 업데이트 로직 추가 가능
      }
    }

    // 플레이어 객체에 스탯과 게임 목록(게임ID 배열) 업데이트
    player.stats = statsData;
    player.games = allGamesData.map((game) => game.gameId);
    await player.save();

    console.log(
      `[LOG] 플레이어 ${player.nickname} (userNum: ${userNum}) 데이터 갱신 완료`
    );
  } catch (error) {
    console.error("[ERROR] updatePlayerData error:", error.message);
  }
}

module.exports = { getPlayerByNickname, refreshPlayerData };
