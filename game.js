// 游戏配置
const CELL_SIZE = 55;
const GRID_GAP = 2;
const ENABLE_BLOCK_CHECK = true; // 启用蹩马腿机制
const MAX_HEALTH = 5; // 最大生命值

// 地图元素类型
const TILE_TYPES = {
    EMPTY: 0,      // 空地
    OBSTACLE: 1,   // 障碍物（石头）
    GIFT: 2,       // 福字（需收集）
    END: 3,        // 终点（马厩）
    PLAYER: 4,     // 玩家位置
    MINE: 5        // 地雷
};

// 马走日的8个可能方向
const KNIGHT_MOVES = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
];

// 关卡数据
const LEVELS = [
    // 第1关 - 新手教学（无障碍物）
    {
        name: "初试马蹄",
        grid: [
            [4, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 2, 0, 0, 2, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 2, 0, 0, 2, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 3]
        ]
    },
    // 第2关 - 引入少量障碍（障碍物不在马腿位置）
    {
        name: "石阵迷踪",
        grid: [
            [4, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 2, 0, 0, 2, 0, 0],
            [0, 0, 2, 0, 0, 2, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 3]
        ]
    },
    // 第3关 - 对称布局
    {
        name: "福满人间",
        grid: [
            [4, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 2, 0, 0, 2, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 2, 0, 0, 2, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [2, 0, 0, 0, 0, 0, 0, 3]
        ]
    },
    // 第4关 - 迷宫路径（障碍物分散）
    {
        name: "马踏迷宫",
        grid: [
            [4, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 2, 0, 0, 0, 2, 0],
            [0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0],
            [0, 2, 0, 0, 2, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 3]
        ]
    },
    // 第5关 - 福气满满（更多福字）
    {
        name: "福气满满",
        grid: [
            [4, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 2],
            [0, 0, 2, 0, 0, 2, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 2, 0, 0, 2, 0, 0],
            [2, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 3]
        ]
    },
    // 第6关 - 蹩马腿挑战
    {
        name: "蹩马腿",
        grid: [
            [4, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 2, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 2, 0],
            [0, 2, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 2, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 3]
        ]
    },
    // 第7关 - 分散障碍
    {
        name: "分散障碍",
        grid: [
            [4, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 2, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 2, 0],
            [0, 2, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 1, 0, 0],
            [0, 0, 0, 0, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 3]
        ]
    },
    // 第8关 - 之字形路径
    {
        name: "之字迷踪",
        grid: [
            [4, 0, 0, 0, 0, 0, 0, 2],
            [0, 0, 0, 1, 0, 0, 0, 0],
            [0, 2, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 2, 0],
            [0, 0, 0, 0, 1, 0, 0, 0],
            [2, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 3]
        ]
    },
    // 第9关 - 对角线
    {
        name: "对角线",
        grid: [
            [4, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 2, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0],
            [0, 2, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 3]
        ]
    },
    // 第10关 - 终极挑战
    {
        name: "终极挑战",
        grid: [
            [4, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 2, 0, 0, 2, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 2],
            [0, 2, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 2, 0, 0, 2, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 3]
        ]
    },
    // 第11关 - 四角福气
    {
        name: "四角福气",
        grid: [
            [4, 0, 0, 0, 0, 0, 0, 2],
            [0, 0, 0, 1, 0, 0, 0, 0],
            [0, 2, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 2, 0],
            [0, 0, 0, 0, 1, 0, 0, 0],
            [2, 0, 0, 0, 0, 0, 0, 3]
        ]
    },
    // 第12关 - 交错障碍
    {
        name: "交错障碍",
        grid: [
            [4, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 1, 0, 2],
            [0, 0, 2, 0, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 2, 0, 2, 0, 0, 0],
            [2, 0, 0, 1, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 3]
        ]
    },
    // 第13关 - 中心迷宫
    {
        name: "中心迷宫",
        grid: [
            [4, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 2, 0, 0, 2, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 0],
            [0, 2, 0, 1, 1, 0, 2, 0],
            [0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 2, 0, 0, 2, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 3]
        ]
    },
    // 第14关 - 长廊
    {
        name: "长廊",
        grid: [
            [4, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 0],
            [0, 2, 0, 0, 0, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 2, 0, 0, 0, 0, 2, 0],
            [0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 3]
        ]
    },
    // 第15关 - 双峰
    {
        name: "双峰",
        grid: [
            [4, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 1, 0, 0],
            [0, 2, 1, 0, 0, 1, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 2, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 2, 0, 0, 0, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 3]
        ]
    },
    // 第16关 - 棋盘
    {
        name: "棋盘",
        grid: [
            [4, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 2, 0, 2, 0, 0, 0],
            [0, 1, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 2, 0, 0, 0, 0],
            [0, 0, 0, 2, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 1, 0, 0],
            [0, 0, 2, 0, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 3]
        ]
    },
    // 第17关 - 环形
    {
        name: "环形",
        grid: [
            [4, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 0, 0],
            [0, 2, 1, 0, 0, 1, 2, 0],
            [0, 0, 1, 0, 0, 1, 0, 0],
            [0, 0, 0, 2, 2, 0, 0, 0],
            [0, 2, 0, 0, 0, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 3]
        ]
    },
    // 第18关 - 三角阵
    {
        name: "三角阵",
        grid: [
            [4, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 0],
            [0, 2, 0, 1, 0, 2, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 2, 0, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 2, 0],
            [0, 2, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 3]
        ]
    },
    // 第19关 - 迷宫大师
    {
        name: "迷宫大师",
        grid: [
            [4, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 2, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 2],
            [0, 2, 0, 1, 0, 2, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [2, 0, 0, 1, 0, 0, 2, 0],
            [0, 0, 2, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 3]
        ]
    },
    // 第20关 - 终极大师
    {
        name: "终极大师",
        grid: [
            [4, 0, 0, 0, 0, 0, 0, 2],
            [0, 0, 2, 0, 2, 0, 0, 0],
            [0, 1, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 2, 2, 0, 0, 0],
            [0, 0, 0, 2, 2, 0, 0, 0],
            [0, 1, 0, 0, 0, 1, 0, 0],
            [0, 0, 2, 0, 2, 0, 0, 0],
            [2, 0, 0, 0, 0, 0, 0, 3]
        ]
    }
];

// 游戏状态
class Game {
    constructor() {
        this.currentLevel = 0;
        this.steps = 0;
        this.score = 0;
        this.totalGifts = 0;
        this.grid = [];
        this.playerPos = { x: 0, y: 0 };
        this.endPos = { x: 0, y: 0 };
        this.history = [];
        this.validMoves = [];
        this.showHints = false; // 是否显示提示高亮
        this.health = MAX_HEALTH; // 当前生命值
        this.revealed = []; // 已揭示的格子
        this.flagged = []; // 已标记旗子的格子
        this.mines = []; // 地雷位置
        this.shownMineNumbers = []; // 已显示过数字的格子
        this.opened = []; // 已探索过的格子(马踩过及周围)
        this.minesLeft = 0; // 剩余地雷数

        this.init();
    }

    init() {
        this.loadLevel(this.currentLevel);
        this.render();
        this.attachEventListeners();
    }

    loadLevel(levelIndex) {
        this.currentLevel = levelIndex;
        const level = LEVELS[levelIndex];
        this.grid = JSON.parse(JSON.stringify(level.grid));
        this.steps = 0;
        this.score = 0;
        this.history = [];
        this.totalGifts = 0;
        this.health = MAX_HEALTH;
        this.revealed = [];
        this.flagged = [];
        this.mines = [];
        this.shownMineNumbers = [];
        this.opened = [];

        // 找到玩家和终点位置，统计福字数量
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                if (this.grid[y][x] === TILE_TYPES.PLAYER) {
                    this.playerPos = { x, y };
                    this.grid[y][x] = TILE_TYPES.EMPTY;
                } else if (this.grid[y][x] === TILE_TYPES.END) {
                    this.endPos = { x, y };
                } else if (this.grid[y][x] === TILE_TYPES.GIFT) {
                    this.totalGifts++;
                }
            }
        }

        // 放置地雷（数量 = 关卡数）
        this.placeMines(levelIndex + 1);

        // 初始化剩余地雷数
        this.minesLeft = this.mines.length;

        // 初始化已揭示数组 - 默认揭示所有非地雷格子
        for (let y = 0; y < this.grid.length; y++) {
            this.revealed[y] = [];
            this.flagged[y] = [];
            this.shownMineNumbers[y] = [];
            this.opened[y] = [];
            for (let x = 0; x < this.grid[y].length; x++) {
                // 地雷格子默认不揭示，其他格子默认揭示
                this.revealed[y][x] = (this.grid[y][x] !== TILE_TYPES.MINE);
                this.flagged[y][x] = false;
                this.shownMineNumbers[y][x] = false;
                this.opened[y][x] = false;
            }
        }

        // 标记起始位置及周围为已探索
        this.markAsOpened(this.playerPos.x, this.playerPos.y);

        // 显示起始位置周围的数字
        this.showNumbersAroundPlayer();

        this.updateInfo();
        this.calculateValidMoves();
    }

    // 计算马走日的有效移动位置
    calculateValidMoves() {
        this.validMoves = [];
        const { x, y } = this.playerPos;

        for (const [dx, dy] of KNIGHT_MOVES) {
            const newX = x + dx;
            const newY = y + dy;

            // 检查是否在边界内
            if (newY >= 0 && newY < this.grid.length &&
                newX >= 0 && newX < this.grid[newY].length) {

                // 检查目标位置是否可通行
                if (this.grid[newY][newX] !== TILE_TYPES.OBSTACLE) {
                    // 可选：检查是否有"蹩马腿"（可通过ENABLE_BLOCK_CHECK配置）
                    if (!ENABLE_BLOCK_CHECK || !this.isBlocked(x, y, newX, newY)) {
                        this.validMoves.push({ x: newX, y: newY });
                    }
                }
            }
        }
    }

    // 检查马腿是否被蹩住（仅在ENABLE_BLOCK_CHECK=true时生效）
    isBlocked(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;

        // 确定马腿的位置（马走日的中间格子）
        let blockX, blockY;
        if (Math.abs(dx) === 2) {
            blockX = x1 + dx / 2;
            blockY = y1;
        } else {
            blockX = x1;
            blockY = y1 + dy / 2;
        }

        // 检查马腿位置是否有障碍
        if (blockY >= 0 && blockY < this.grid.length &&
            blockX >= 0 && blockX < this.grid[blockY].length) {
            return this.grid[blockY][blockX] === TILE_TYPES.OBSTACLE;
        }
        return false;
    }

    // 放置地雷
    placeMines(count) {
        const rows = this.grid.length;
        const cols = this.grid[0].length;
        const availableCells = [];

        // 收集所有可以放置地雷的位置（空地且不是玩家起始位置、终点、福字）
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (this.grid[y][x] === TILE_TYPES.EMPTY &&
                    !(x === this.playerPos.x && y === this.playerPos.y) &&
                    !(x === this.endPos.x && y === this.endPos.y)) {
                    availableCells.push({ x, y });
                }
            }
        }

        // 随机选择位置放置地雷
        for (let i = 0; i < count && availableCells.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableCells.length);
            const { x, y } = availableCells[randomIndex];
            this.grid[y][x] = TILE_TYPES.MINE;
            this.mines.push({ x, y });
            availableCells.splice(randomIndex, 1);
        }
    }

    // 计算周围地雷数量
    calculateMineCount(x, y) {
        let count = 0;
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;
            if (newY >= 0 && newY < this.grid.length &&
                newX >= 0 && newX < this.grid[newY].length &&
                this.grid[newY][newX] === TILE_TYPES.MINE) {
                count++;
            }
        }
        return count;
    }

    // 标记格子及周围为已探索
    markAsOpened(x, y) {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],  [0, 0],  [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;
            if (newY >= 0 && newY < this.grid.length &&
                newX >= 0 && newX < this.grid[newY].length) {
                // 不标记地雷格子为已探索，这样玩家仍然可以在地雷上插旗
                if (this.grid[newY][newX] !== TILE_TYPES.MINE) {
                    this.opened[newY][newX] = true;
                }
            }
        }
    }

    // 揭示格子（扫雷机制）
    revealCell(x, y) {
        // 边界检查
        if (y < 0 || y >= this.grid.length || x < 0 || x >= this.grid[y].length) {
            return;
        }

        // 已揭示或已标记旗子的格子不再揭示
        if (this.revealed[y][x] || this.flagged[y][x]) {
            return;
        }

        // 如果是地雷，不揭示（保持未揭示状态，直到玩家踩到）
        if (this.grid[y][x] === TILE_TYPES.MINE) {
            return;
        }

        // 揭示当前格子
        this.revealed[y][x] = true;

        // 计算周围地雷数量
        const mineCount = this.calculateMineCount(x, y);

        // 如果周围没有地雷，自动揭示周围8个格子
        if (mineCount === 0) {
            const directions = [
                [-1, -1], [-1, 0], [-1, 1],
                [0, -1],           [0, 1],
                [1, -1],  [1, 0],  [1, 1]
            ];

            for (const [dx, dy] of directions) {
                this.revealCell(x + dx, y + dy);
            }
        }
    }

    // 显示玩家周围格子的地雷数字
    showNumbersAroundPlayer() {
        const { x, y } = this.playerPos;
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],  [0, 0],  [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;
            if (newY >= 0 && newY < this.grid.length &&
                newX >= 0 && newX < this.grid[newY].length) {
                this.shownMineNumbers[newY][newX] = true;
            }
        }
    }

    // 移动玩家
    movePlayer(newX, newY) {
        // 检查是否是有效移动
        const isValid = this.validMoves.some(move => move.x === newX && move.y === newY);
        if (!isValid) {
            // 检查是否点击了障碍物
            if (newY >= 0 && newY < this.grid.length &&
                newX >= 0 && newX < this.grid[newY].length &&
                this.grid[newY][newX] === TILE_TYPES.OBSTACLE) {
                this.showMessage("🪨 哎呀！前方一块大石头", "error");
            } else {
                this.showMessage('❌ 马只能按"日"字走哦！', "error");
            }
            window.audioManager.playErrorSound();

            // 添加震动效果
            const board = document.getElementById('game-board');
            window.particleSystem.createErrorShake(board);

            return false;
        }

        // 移动成功后隐藏提示
        this.showHints = false;

        // 保存历史记录
        this.history.push({
            pos: { ...this.playerPos },
            score: this.score,
            health: this.health,
            grid: JSON.parse(JSON.stringify(this.grid)),
            revealed: JSON.parse(JSON.stringify(this.revealed)),
            flagged: JSON.parse(JSON.stringify(this.flagged)),
            opened: JSON.parse(JSON.stringify(this.opened)),
            minesLeft: this.minesLeft
        });

        // 移动玩家
        this.playerPos = { x: newX, y: newY };
        this.steps++;
        window.audioManager.playMoveSound();

        // 标记新位置及周围为已探索
        this.markAsOpened(newX, newY);

        // 添加移动轨迹粒子
        const cell = document.querySelector(`[data-x="${newX}"][data-y="${newY}"]`);
        if (cell) {
            const pos = window.particleSystem.getElementCenter(cell);
            window.particleSystem.createTrailParticles(pos.x, pos.y);
        }

        // 检查是否踩到地雷
        if (this.grid[newY][newX] === TILE_TYPES.MINE) {
            // 踩到地雷时才揭示这个格子
            this.revealed[newY][newX] = true;

            this.health--;
            this.minesLeft--; // 减少剩余地雷数
            this.showMessage(`💥 踩到地雷！剩余生命: ${this.health}`, "error");
            window.audioManager.playErrorSound();

            // 添加爆炸特效
            if (cell) {
                const pos = window.particleSystem.getElementCenter(cell);
                window.particleSystem.createCollectExplosion(pos.x, pos.y);
            }

            // 检查是否游戏结束
            if (this.health <= 0) {
                this.showMessage("💀 生命值耗尽，游戏失败！", "error");
                setTimeout(() => {
                    this.restart();
                }, 2000);
                this.updateInfo();
                this.render();
                return false;
            }
        } else {
            // 不是地雷才正常揭示
            this.revealCell(newX, newY);
        }

        // 显示移动后周围的数字
        this.showNumbersAroundPlayer();

        // 检查是否收集到福字
        if (this.grid[newY][newX] === TILE_TYPES.GIFT) {
            this.score++;
            this.grid[newY][newX] = TILE_TYPES.EMPTY;
            this.showMessage("🧧 恭喜发财！", "success");
            window.audioManager.playCollectSound();

            // 添加收集爆炸特效
            if (cell) {
                const pos = window.particleSystem.getElementCenter(cell);
                window.particleSystem.createCollectExplosion(pos.x, pos.y);
            }
        }

        // 检查是否到达终点
        if (newX === this.endPos.x && newY === this.endPos.y) {
            if (this.score === this.totalGifts) {
                this.victory();
            } else {
                this.showMessage("⚠️ 还有福字没收集完！", "warning");
            }
        }

        this.updateInfo();
        this.calculateValidMoves();
        this.render();
        return true;
    }

    // 撤销操作
    undo() {
        if (this.history.length === 0) {
            this.showMessage("⚠️ 无法撤销", "warning");
            return;
        }

        const lastState = this.history.pop();
        this.playerPos = lastState.pos;
        this.score = lastState.score;
        this.health = lastState.health;
        this.grid = lastState.grid;
        this.revealed = lastState.revealed;
        this.flagged = lastState.flagged;
        this.opened = lastState.opened;
        this.minesLeft = lastState.minesLeft;
        this.steps--;

        // 重新计算显示的数字
        this.showNumbersAroundPlayer();

        this.updateInfo();
        this.calculateValidMoves();
        this.render();
        this.showMessage("↶ 已撤销", "info");
    }

    // 重新开始
    restart() {
        this.loadLevel(this.currentLevel);
        this.render();
        this.showMessage("🔄 重新开始", "info");
    }

    // 下一关
    nextLevel() {
        if (this.currentLevel < LEVELS.length - 1) {
            this.currentLevel++;
            this.loadLevel(this.currentLevel);
            this.render();
            document.getElementById('victory-modal').style.display = 'none';
        } else {
            this.showMessage("🎉 恭喜通关所有关卡！", "success");
        }
    }

    // 胜利
    victory() {
        const modal = document.getElementById('victory-modal');
        const text = document.getElementById('victory-text');
        text.textContent = `用了 ${this.steps} 步完成关卡！`;
        modal.style.display = 'flex';
        window.audioManager.playVictorySound();

        // 添加烟花特效
        window.particleSystem.createVictoryFireworks();
    }

    // 更新信息显示
    updateInfo() {
        document.getElementById('level-num').textContent = this.currentLevel + 1;
        document.getElementById('steps').textContent = this.steps;
        document.getElementById('score').textContent = this.score;
        document.getElementById('total-score').textContent = this.totalGifts;

        // 更新生命值显示
        const healthDisplay = document.getElementById('health-display');
        const fullHearts = '❤️'.repeat(this.health);
        const emptyHearts = '🤍'.repeat(MAX_HEALTH - this.health);
        healthDisplay.textContent = fullHearts + emptyHearts;

        // 更新剩余地雷数
        document.getElementById('mines-left').textContent = this.minesLeft;
    }

    // 显示消息
    showMessage(text, type = 'info') {
        const messageEl = document.getElementById('game-message');
        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
        messageEl.style.display = 'block';

        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 2000);
    }

    // 渲染游戏画面
    render() {
        const board = document.getElementById('game-board');
        board.innerHTML = '';

        const rows = this.grid.length;
        const cols = this.grid[0].length;

        board.style.gridTemplateColumns = `repeat(${cols}, min(55px, 10vw))`;
        board.style.gridTemplateRows = `repeat(${rows}, min(55px, 10vw))`;

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.x = x;
                cell.dataset.y = y;

                const cellType = this.grid[y][x];
                const isPlayerPos = x === this.playerPos.x && y === this.playerPos.y;
                const isRevealed = this.revealed[y][x];
                const isFlagged = this.flagged[y][x];
                const isOpened = this.opened[y][x];

                // 玩家位置
                if (isPlayerPos) {
                    cell.classList.add('player');
                    cell.textContent = '🐴';
                }
                // 已标记旗子
                else if (isFlagged) {
                    cell.classList.add('flagged');
                    cell.textContent = '🚩';
                }
                // 未揭示的格子
                else if (!isRevealed) {
                    cell.classList.add('unrevealed');
                }
                // 已揭示的格子
                else {
                    // 如果是已探索过的空地，添加opened类
                    if (isOpened && cellType === TILE_TYPES.EMPTY) {
                        cell.classList.add('opened');
                    }

                    if (x === this.endPos.x && y === this.endPos.y) {
                        cell.classList.add('end');
                        cell.textContent = '🏠';
                    } else if (cellType === TILE_TYPES.OBSTACLE) {
                        cell.classList.add('obstacle');
                        cell.textContent = '🪨';
                    } else if (cellType === TILE_TYPES.GIFT) {
                        cell.classList.add('gift');
                        cell.textContent = '🧧';
                    } else if (cellType === TILE_TYPES.MINE) {
                        // 踩到地雷后才显示
                        if (isPlayerPos) {
                            cell.classList.add('mine');
                            cell.textContent = '💣';
                        } else {
                            // 未踩到的地雷显示为普通空地
                            cell.classList.add('empty');
                            if (isOpened) {
                                cell.classList.add('opened');
                            }
                            if (this.shownMineNumbers[y][x]) {
                                const mineCount = this.calculateMineCount(x, y);
                                if (mineCount > 0) {
                                    cell.textContent = mineCount;
                                    cell.classList.add(`mine-count-${mineCount}`);
                                }
                            }
                        }
                    } else {
                        // 空地显示周围地雷数量（仅显示已标记过的格子）
                        cell.classList.add('empty');
                        if (isOpened) {
                            cell.classList.add('opened');
                        }
                        if (this.shownMineNumbers[y][x]) {
                            const mineCount = this.calculateMineCount(x, y);
                            if (mineCount > 0) {
                                cell.textContent = mineCount;
                                cell.classList.add(`mine-count-${mineCount}`);
                            }
                        }
                    }
                }

                // 只在showHints为true时高亮有效移动位置
                if (this.showHints) {
                    const isValidMove = this.validMoves.some(move => move.x === x && move.y === y);
                    if (isValidMove) {
                        cell.classList.add('valid-move');
                    }
                }

                board.appendChild(cell);
            }
        }
    }

    // 绑定事件监听
    attachEventListeners() {
        const board = document.getElementById('game-board');

        // 左键点击移动
        board.addEventListener('click', (e) => {
            const cell = e.target.closest('.cell');
            if (cell) {
                const x = parseInt(cell.dataset.x);
                const y = parseInt(cell.dataset.y);
                this.movePlayer(x, y);
            }
        });

        // 右键标记旗子
        board.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const cell = e.target.closest('.cell');
            if (cell) {
                const x = parseInt(cell.dataset.x);
                const y = parseInt(cell.dataset.y);

                // 不能标记玩家当前位置
                if (x === this.playerPos.x && y === this.playerPos.y) {
                    return;
                }

                // 可以标记未探索的格子(包括未揭示的和已揭示但未探索的)
                // 不能标记已探索过的格子、障碍物、福字、终点
                const cellType = this.grid[y][x];
                const isOpened = this.opened[y][x];
                const canFlag = !isOpened &&
                               cellType !== TILE_TYPES.OBSTACLE &&
                               cellType !== TILE_TYPES.GIFT &&
                               !(x === this.endPos.x && y === this.endPos.y);

                if (canFlag) {
                    this.flagged[y][x] = !this.flagged[y][x];

                    // 更新剩余地雷数（插旗时减少，取消插旗时增加）
                    if (this.flagged[y][x]) {
                        this.minesLeft--;
                    } else {
                        this.minesLeft++;
                    }

                    this.updateInfo();
                    this.render();
                    window.audioManager.playClickSound();
                }
            }
        });

        document.getElementById('undo-btn').addEventListener('click', () => {
            window.audioManager.playClickSound();
            this.undo();
        });
        document.getElementById('restart-btn').addEventListener('click', () => {
            window.audioManager.playClickSound();
            this.restart();
        });
        document.getElementById('hint-btn').addEventListener('click', () => {
            window.audioManager.playClickSound();
            // 显示提示一次
            this.showHints = true;
            this.render();
            this.showMessage("💡 蓝色高亮格子可以移动", "info");

            // 3秒后自动隐藏提示
            setTimeout(() => {
                this.showHints = false;
                this.render();
            }, 3000);
        });
        document.getElementById('next-level-btn').addEventListener('click', () => {
            window.audioManager.playClickSound();
            this.nextLevel();
        });

        // 音乐控制按钮 - 切换面板显示
        const bgmToggle = document.getElementById('bgm-toggle');
        const sfxToggle = document.getElementById('sfx-toggle');
        const bgmPanel = document.getElementById('bgm-panel');
        const sfxPanel = document.getElementById('sfx-panel');

        bgmToggle.addEventListener('click', (e) => {
            e.stopPropagation();

            // 关闭音效面板
            sfxPanel.classList.remove('show');
            sfxToggle.classList.remove('active');

            // 切换背景音乐面板
            bgmPanel.classList.toggle('show');
            bgmToggle.classList.toggle('active');

            window.audioManager.playClickSound();
        });

        sfxToggle.addEventListener('click', (e) => {
            e.stopPropagation();

            // 关闭背景音乐面板
            bgmPanel.classList.remove('show');
            bgmToggle.classList.remove('active');

            // 切换音效面板
            sfxPanel.classList.toggle('show');
            sfxToggle.classList.toggle('active');

            window.audioManager.playClickSound();
        });

        // 点击其他地方关闭面板
        document.addEventListener('click', (e) => {
            if (!bgmPanel.contains(e.target) && !bgmToggle.contains(e.target)) {
                bgmPanel.classList.remove('show');
                bgmToggle.classList.remove('active');
            }
            if (!sfxPanel.contains(e.target) && !sfxToggle.contains(e.target)) {
                sfxPanel.classList.remove('show');
                sfxToggle.classList.remove('active');
            }
        });

        // 背景音乐启用开关
        const bgmEnable = document.getElementById('bgm-enable');
        bgmEnable.addEventListener('change', (e) => {
            if (e.target.checked) {
                window.audioManager.bgmEnabled = true;
                if (window.audioManager.audioContext) {
                    window.audioManager.loadAndPlayBGM();
                }
                bgmToggle.classList.remove('disabled');
            } else {
                window.audioManager.bgmEnabled = false;
                if (window.audioManager.bgmSource) {
                    try {
                        window.audioManager.bgmSource.stop();
                    } catch (e) {}
                }
                bgmToggle.classList.add('disabled');
            }
            window.audioManager.playClickSound();
        });

        // 音效启用开关
        const sfxEnable = document.getElementById('sfx-enable');
        sfxEnable.addEventListener('change', (e) => {
            window.audioManager.sfxEnabled = e.target.checked;
            if (e.target.checked) {
                sfxToggle.classList.remove('disabled');
                window.audioManager.playClickSound();
            } else {
                sfxToggle.classList.add('disabled');
            }
        });

        // 背景音乐音量控制
        const bgmVolume = document.getElementById('bgm-volume');
        const bgmVolumeValue = bgmVolume.nextElementSibling;
        bgmVolume.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            window.audioManager.setBGMVolume(volume);
            bgmVolumeValue.textContent = e.target.value + '%';
        });

        // 音效音量控制
        const sfxVolume = document.getElementById('sfx-volume');
        const sfxVolumeValue = sfxVolume.nextElementSibling;
        sfxVolume.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            window.audioManager.setSFXVolume(volume);
            sfxVolumeValue.textContent = e.target.value + '%';
        });
    }

    // 验证关卡是否可解（使用BFS算法）
    validateLevel() {
        const queue = [{
            pos: { ...this.playerPos },
            collected: new Set(),
            visited: new Set([`${this.playerPos.x},${this.playerPos.y}`])
        }];

        while (queue.length > 0) {
            const state = queue.shift();
            const { pos, collected, visited } = state;

            // 如果收集完所有福字并到达终点，关卡可解
            if (pos.x === this.endPos.x && pos.y === this.endPos.y && collected.size === this.totalGifts) {
                return true;
            }

            // 计算当前位置的所有可能移动
            for (const [dx, dy] of KNIGHT_MOVES) {
                const newX = pos.x + dx;
                const newY = pos.y + dy;

                if (newY >= 0 && newY < this.grid.length &&
                    newX >= 0 && newX < this.grid[newY].length &&
                    this.grid[newY][newX] !== TILE_TYPES.OBSTACLE) {

                    if (!ENABLE_BLOCK_CHECK || !this.isBlocked(pos.x, pos.y, newX, newY)) {
                        const newCollected = new Set(collected);
                        if (this.grid[newY][newX] === TILE_TYPES.GIFT) {
                            newCollected.add(`${newX},${newY}`);
                        }

                        const stateKey = `${newX},${newY},${Array.from(newCollected).sort().join('|')}`;
                        if (!visited.has(stateKey)) {
                            visited.add(stateKey);
                            queue.push({
                                pos: { x: newX, y: newY },
                                collected: newCollected,
                                visited: new Set(visited)
                            });
                        }
                    }
                }
            }
        }

        return false;
    }
}

// 启动游戏
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();

    // 获取菜单元素
    const mainMenu = document.getElementById('main-menu');
    const levelSelect = document.getElementById('level-select');
    const gameContainer = document.getElementById('game-container');
    const startGameBtn = document.getElementById('start-game-btn');
    const selectLevelBtn = document.getElementById('select-level-btn');
    const backToMenuBtn = document.getElementById('back-to-menu-btn');
    const menuBtn = document.getElementById('menu-btn');
    const levelGrid = document.getElementById('level-grid');

    // 从 localStorage 读取上次玩的关卡和已完成的关卡
    let lastLevel = parseInt(localStorage.getItem('lastLevel') || '0');
    let completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');

    // 生成关卡选择按钮（假设有20关）
    const totalLevels = 20;
    for (let i = 0; i < totalLevels; i++) {
        const btn = document.createElement('button');
        btn.className = 'level-btn';
        btn.textContent = i + 1;

        // 如果关卡已完成，添加完成标记
        if (completedLevels.includes(i)) {
            btn.classList.add('completed');
        }

        // 如果关卡不存在（超过当前关卡数），标记为锁定
        if (i >= LEVELS.length) {
            btn.classList.add('locked');
            btn.textContent = '🔒';
        } else {
            btn.addEventListener('click', () => {
                startGame(i);
            });
        }

        levelGrid.appendChild(btn);
    }

    // 开始游戏函数
    function startGame(levelIndex) {
        mainMenu.style.display = 'none';
        levelSelect.style.display = 'none';
        gameContainer.style.display = 'block';

        game.loadLevel(levelIndex);
        game.render();

        // 保存当前关卡
        localStorage.setItem('lastLevel', levelIndex.toString());

        // 进入游戏界面时开始播放音乐
        if (window.audioManager) {
            // 确保 AudioContext 已初始化
            if (!window.audioManager.audioContext) {
                window.audioManager.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                window.audioManager.setupAudioNodes();
                window.audioManager.startVisualization();
            }
            // 播放音乐
            if (window.audioManager.bgmEnabled) {
                window.audioManager.loadAndPlayBGM();
            }
        }
    }

    // 返回主菜单函数
    function returnToMenu() {
        mainMenu.style.display = 'flex';
        levelSelect.style.display = 'none';
        gameContainer.style.display = 'none';

        // 停止音乐
        if (window.audioManager && window.audioManager.bgmSource) {
            try {
                window.audioManager.bgmSource.stop();
            } catch (e) {}
        }
    }

    // 开始游戏按钮
    startGameBtn.addEventListener('click', () => {
        startGame(lastLevel);
    });

    // 选择关卡按钮
    selectLevelBtn.addEventListener('click', () => {
        mainMenu.style.display = 'none';
        levelSelect.style.display = 'flex';
    });

    // 返回主菜单按钮
    backToMenuBtn.addEventListener('click', () => {
        returnToMenu();
    });

    // 游戏中的菜单按钮
    menuBtn.addEventListener('click', () => {
        returnToMenu();
    });

    // 监听关卡完成事件，保存进度
    const originalNextLevel = game.nextLevel.bind(game);
    game.nextLevel = function() {
        // 标记当前关卡为已完成
        if (!completedLevels.includes(this.currentLevel)) {
            completedLevels.push(this.currentLevel);
            localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
        }

        // 更新关卡选择界面的完成状态
        const levelBtns = levelGrid.querySelectorAll('.level-btn');
        if (levelBtns[this.currentLevel]) {
            levelBtns[this.currentLevel].classList.add('completed');
        }

        originalNextLevel();
    };

    // 开发模式：验证所有关卡是否可解
    if (window.location.search.includes('debug=true')) {
        console.log('=== 关卡验证模式 ===');
        LEVELS.forEach((level, index) => {
            game.loadLevel(index);
            const isValid = game.validateLevel();
            console.log(`关卡 ${index + 1} (${level.name}): ${isValid ? '✅ 可解' : '❌ 无解'}`);
        });
        startGame(0);
    }
});
