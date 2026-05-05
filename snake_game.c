/*
 * 贪吃蛇游戏 - C语言版本
 * 适合初学者学习
 */

#include <stdio.h>
#include <stdlib.h>
#include <conio.h>      // 用于_kbhit()和_getch()函数
#include <windows.h>    // 用于Sleep()函数
#include <time.h>       // 用于随机数生成

// 游戏区域大小
#define WIDTH 40
#define HEIGHT 20

// 方向定义
#define UP 1
#define DOWN 2
#define LEFT 3
#define RIGHT 4

// 蛇的结构体
typedef struct {
    int x;
    int y;
} Point;

// 全局变量
Point snake[100];    // 蛇身（最大长度100）
int snakeLength;     // 蛇的当前长度
Point food;          // 食物位置
int direction;       // 当前移动方向
int score;           // 得分
int gameOver;        // 游戏结束标志

// 函数声明
void initGame();           // 初始化游戏
void drawGame();           // 绘制游戏界面
void updateGame();         // 更新游戏状态
void input();              // 处理输入
void generateFood();       // 生成食物
void setCursorPosition(int x, int y);  // 设置光标位置

int main() {
    initGame();
    
    while (!gameOver) {
        drawGame();
        input();
        updateGame();
        Sleep(100);  // 控制游戏速度（毫秒）
    }
    
    // 游戏结束提示
    setCursorPosition(0, HEIGHT + 2);
    printf("游戏结束！最终得分: %d\n", score);
    printf("按任意键退出...\n");
    _getch();
    
    return 0;
}

// 初始化游戏
void initGame() {
    // 隐藏光标
    CONSOLE_CURSOR_INFO cursor;
    cursor.bVisible = FALSE;
    cursor.dwSize = 1;
    SetConsoleCursorInfo(GetStdHandle(STD_OUTPUT_HANDLE), &cursor);
    
    // 初始化蛇
    snakeLength = 3;
    snake[0].x = WIDTH / 2;
    snake[0].y = HEIGHT / 2;
    snake[1].x = WIDTH / 2 - 1;
    snake[1].y = HEIGHT / 2;
    snake[2].x = WIDTH / 2 - 2;
    snake[2].y = HEIGHT / 2;
    
    // 初始化其他变量
    direction = RIGHT;
    score = 0;
    gameOver = 0;
    
    // 生成第一个食物
    srand(time(NULL));
    generateFood();
}

// 设置光标位置
void setCursorPosition(int x, int y) {
    COORD coord;
    coord.X = x;
    coord.Y = y;
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), coord);
}

// 绘制游戏界面
void drawGame() {
    setCursorPosition(0, 0);
    
    // 绘制顶部边界
    for (int i = 0; i < WIDTH + 2; i++) {
        printf("#");
    }
    printf("\n");
    
    // 绘制游戏区域
    for (int i = 0; i < HEIGHT; i++) {
        for (int j = 0; j < WIDTH + 2; j++) {
            if (j == 0 || j == WIDTH + 1) {
                printf("#");  // 左右边界
            } else {
                int print = 0;
                
                // 检查是否是蛇头
                if (snake[0].x == j - 1 && snake[0].y == i) {
                    printf("O");
                    print = 1;
                }
                
                // 检查是否是蛇身
                if (!print) {
                    for (int k = 1; k < snakeLength; k++) {
                        if (snake[k].x == j - 1 && snake[k].y == i) {
                            printf("o");
                            print = 1;
                            break;
                        }
                    }
                }
                
                // 检查是否是食物
                if (!print && food.x == j - 1 && food.y == i) {
                    printf("*");
                    print = 1;
                }
                
                // 空白区域
                if (!print) {
                    printf(" ");
                }
            }
        }
        printf("\n");
    }
    
    // 绘制底部边界
    for (int i = 0; i < WIDTH + 2; i++) {
        printf("#");
    }
    printf("\n");
    
    // 显示得分和操作提示
    printf("得分: %d\n", score);
    printf("操作: W-上 S-下 A-左 D-右 X-退出\n");
}

// 处理输入
void input() {
    if (_kbhit()) {  // 检查是否有按键
        switch (_getch()) {
            case 'w':
            case 'W':
                if (direction != DOWN) direction = UP;
                break;
            case 's':
            case 'S':
                if (direction != UP) direction = DOWN;
                break;
            case 'a':
            case 'A':
                if (direction != RIGHT) direction = LEFT;
                break;
            case 'd':
            case 'D':
                if (direction != LEFT) direction = RIGHT;
                break;
            case 'x':
            case 'X':
                gameOver = 1;
                break;
        }
    }
}

// 更新游戏状态
void updateGame() {
    // 保存原来的蛇头位置
    Point prevHead = snake[0];
    
    // 根据方向移动蛇头
    switch (direction) {
        case UP:
            snake[0].y--;
            break;
        case DOWN:
            snake[0].y++;
            break;
        case LEFT:
            snake[0].x--;
            break;
        case RIGHT:
            snake[0].x++;
            break;
    }
    
    // 检查是否撞墙
    if (snake[0].x < 0 || snake[0].x >= WIDTH || 
        snake[0].y < 0 || snake[0].y >= HEIGHT) {
        gameOver = 1;
        return;
    }
    
    // 检查是否撞到自己
    for (int i = 1; i < snakeLength; i++) {
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
            gameOver = 1;
            return;
        }
    }
    
    // 移动蛇身
    for (int i = snakeLength - 1; i > 0; i--) {
        snake[i] = snake[i - 1];
    }
    snake[0] = snake[0];  // 新蛇头位置已经更新
    
    // 检查是否吃到食物
    if (snake[0].x == food.x && snake[0].y == food.y) {
        snakeLength++;  // 增加长度
        score += 10;    // 增加分数
        generateFood(); // 生成新食物
        
        // 恢复被覆盖的蛇尾
        snake[snakeLength - 1] = snake[snakeLength - 2];
    }
}

// 生成食物
void generateFood() {
    int valid = 0;
    while (!valid) {
        food.x = rand() % WIDTH;
        food.y = rand() % HEIGHT;
        
        // 确保食物不在蛇身上
        valid = 1;
        for (int i = 0; i < snakeLength; i++) {
            if (food.x == snake[i].x && food.y == snake[i].y) {
                valid = 0;
                break;
            }
        }
    }
}
