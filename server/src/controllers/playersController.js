require("dotenv").config();
const axios = require("axios");
const Player = require("../models/Player");
const Game = require("../models/Game");

// 닉네임으로 플레이어 조회 및 생성
const getPlayerByNickname = async (req, res) => {
  try {
    let { nickname } = req.params;
    if (!nickname) {
      return res.status(400).json({ error: "닉네임이 필요합니다." });
    }
    nickname = decodeURIComponent(nickname);

    const apiKey = process.env.API_KEY;
    const baseUrl = process.env.API_URL;
    if (!apiKey || !baseUrl) {
      return res.status(500).json({ error: "API 설정 오류" });
    }

    // 외부 API에서 userNum 조회
    const nicknameResponse = await axios.get(`${baseUrl}/user/nickname`, {
      headers: { "x-api-key": apiKey },
      params: { query: nickname },
    });
    const { user } = nicknameResponse.data;
    const userNum = user?.userNum;
    if (!userNum) {
      return res
        .status(404)
        .json({ error: "외부 API에서 유저 번호를 찾을 수 없습니다." });
    }

    // DB에서 플레이어 검색
    let player = await Player.findOne({ userNum });
    if (player) {
      if (player.nickname !== nickname) {
        player.nickname = nickname;
        await player.save();
      }
    } else {
      // 새 플레이어 생성 후 저장
      player = new Player({ userNum, nickname });
      await player.save();
      return res.status(201).json({
        message:
          "새 플레이어가 생성되었습니다. 유저 전적 조회를 위해 refresh 작업이 필요합니다.",
        playerId: player.userNum,
        nickname: player.nickname,
      });
    }

    // 응답 시 games 필드 제거
    const playerObj = player.toObject();
    delete playerObj.games;
    res.status(200).json(playerObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 통계 데이터 형식 변환
const formatStats = (stats) => {
  const formattedStats = {};

  for (const seasonId in stats) {
    if (stats[seasonId]?.userStats) {
      const userStats = stats[seasonId].userStats;
      formattedStats[seasonId] = userStats.map((stat) => {
        const modeKey = `${stat.matchingMode}v${stat.matchingTeamMode}`;
        return {
          seasonId: stat.seasonId,
          userNum: stat.userNum,
          nickname: stat.nickname,
          mmr: stat.mmr || null,
          rank: stat.rank,
          rankSize: stat.rankSize,
          totalGames: stat.totalGames,
          totalWins: stat.totalWins,
          averageKills: stat.averageKills,
          averageAssistants: stat.averageAssistants,
          averageHunts: stat.averageHunts,
          rankPercent: stat.rankPercent,
          top1: stat.top1,
          top2: stat.top2,
          top3: stat.top3,
          top5: stat.top5,
          top7: stat.top7,
          modes: {
            [modeKey]: {
              rank: stat.rank,
              rankSize: stat.rankSize,
              totalGames: stat.totalGames,
              totalWins: stat.totalWins,
              averageRank: stat.averageRank,
              averageKills: stat.averageKills,
              characterStats: stat.characterStats.map((char) => ({
                characterCode: char.characterCode,
                totalGames: char.totalGames,
                maxKillings: char.maxKillings,
                averageRank: char.averageRank,
                top3Rate: char.top3Rate,
                wins: char.wins,
              })),
            },
          },
        };
      });
    }
  }

  return formattedStats;
};

// 플레이어 데이터 갱신 (동기 처리)
const refreshPlayerData = async (req, res) => {
  try {
    const { nickname } = req.params;
    // 플레이어 정보 검색
    let player = await Player.findOne({ nickname });
    if (!player) {
      return res.status(404).json({
        error:
          "플레이어 정보가 DB에 없습니다. 먼저 플레이어 정보를 생성하세요.",
      });
    }

    const apiKey = process.env.API_KEY;
    const baseUrl = process.env.API_URL;
    if (!baseUrl) throw new Error("API_URL 환경 변수가 설정되지 않았습니다.");
    if (!apiKey) throw new Error("API_KEY 환경 변수가 설정되지 않았습니다.");

    // 기존 게임 ID 목록 (중복 체크)
    const existingGameIds = new Set(player.games);
    let newGamesCount = 0;
    let next = "";

    // 한 페이지의 게임 데이터 처리
    const response = await axios.get(
      `${baseUrl}/user/games/${player.userNum}`,
      {
        headers: { "x-api-key": apiKey },
        params: { next },
      }
    );
    const data = response.data;
    if (data.userGames) {
      let newGameFoundInPage = false;
      for (const gameSummary of data.userGames) {
        const gameId = gameSummary.gameId;
        if (existingGameIds.has(gameId)) {
          continue;
        } else {
          // 게임 상세 정보 조회
          const gameResponse = await axios.get(`${baseUrl}/games/${gameId}`, {
            headers: { "x-api-key": apiKey },
          });
          const gameResponseData = gameResponse.data;
          const transformedGameData = {
            gameid:
              gameResponseData.userGames &&
              gameResponseData.userGames.length > 0
                ? gameResponseData.userGames[0].gameId
                : gameId,
            userGames: gameResponseData.userGames,
          };
          // 게임 저장
          const newGame = new Game(transformedGameData);
          await newGame.save();
          player.games.push(gameId);
          existingGameIds.add(gameId);
          newGamesCount++;
          newGameFoundInPage = true;
        }
      }
      next = data.next || "";
      if (!newGameFoundInPage) {
        next = "";
      }
    }

    // 통계 데이터 갱신
    const seasonIds = [process.env.CURRENT_SEASON, "0"];
    let statsData = {};
    for (let seasonId of seasonIds) {
      const response = await axios.get(
        `${baseUrl}/user/stats/${player.userNum}/${seasonId}`,
        { headers: { "x-api-key": apiKey } }
      );
      statsData[seasonId] = response.data;
    }
    player.stats = formatStats(statsData);
    player.lastRefresh = new Date();
    await player.save();

    // 클라이언트 응답
    res.status(200).json({
      message: `${newGamesCount}개의 게임 데이터가 갱신되었습니다.`,
      updatedGames: newGamesCount,
      lastRefresh: player.lastRefresh,
    });

    // 백그라운드에서 나머지 페이지 처리
    if (next) {
      processRemainingGames(player, next, apiKey, baseUrl, existingGameIds)
        .then(() => {})
        .catch((err) => {});
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 백그라운드에서 나머지 게임 데이터 처리
const processRemainingGames = async (
  player,
  next,
  apiKey,
  baseUrl,
  existingGameIds
) => {
  while (next) {
    try {
      const response = await axios.get(
        `${baseUrl}/user/games/${player.userNum}`,
        {
          headers: { "x-api-key": apiKey },
          params: { next },
        }
      );
      const data = response.data;
      let newGameFoundInPage = false;
      if (data.userGames) {
        for (const gameSummary of data.userGames) {
          const gameId = gameSummary.gameId;
          if (existingGameIds.has(gameId)) {
            continue;
          }
          const gameResponse = await axios.get(`${baseUrl}/games/${gameId}`, {
            headers: { "x-api-key": apiKey },
          });
          const gameResponseData = gameResponse.data;
          const transformedGameData = {
            gameid:
              gameResponseData.userGames &&
              gameResponseData.userGames.length > 0
                ? gameResponseData.userGames[0].gameId
                : gameId,
            userGames: gameResponseData.userGames,
          };
          const newGame = new Game(transformedGameData);
          await newGame.save();
          player.games.push(gameId);
          existingGameIds.add(gameId);
          newGameFoundInPage = true;
        }
      }
      await player.save();
      if (!newGameFoundInPage) {
        break;
      }
      next = data.next || "";
    } catch (err) {
      break;
    }
  }
};

// 닉네임으로 플레이어 게임 데이터 조회 (페이지네이션 적용)
const getPlayerGamesByNickname = async (req, res) => {
  try {
    let { nickname } = req.params;
    if (!nickname) {
      return res.status(400).json({ error: "닉네임이 필요합니다." });
    }
    nickname = decodeURIComponent(nickname);
    const player = await Player.findOne({ nickname });
    if (!player) {
      return res
        .status(404)
        .json({ error: "플레이어 정보를 찾을 수 없습니다." });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const reversedGameIds = player.games.slice().reverse();
    const start = (page - 1) * limit;
    const paginatedGameIds = reversedGameIds.slice(start, start + limit);
    const games = await Game.find({ gameid: { $in: paginatedGameIds } });
    const orderedGames = paginatedGameIds.map((id) =>
      games.find((game) => game.gameid.toString() === id.toString())
    );

    return res.status(200).json({
      data: orderedGames,
      pagination: {
        page,
        limit,
        total: player.games.length,
        totalPages: Math.ceil(player.games.length / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPlayerGamesByNickname,
  getPlayerByNickname,
  refreshPlayerData,
};
