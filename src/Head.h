//
// Created by Nikit on 22.08.2024.
//

#ifndef ADUINO_HEAD_H
#define ADUINO_HEAD_H

#include <Multiservo.h>
#include "defs.h"


class Head {
public:
    Head(Multiservo* _servo);
    void begin();
    void home();
    void tick();

    void rotate(int x, int y);
    void rotateX(int x);
    void rotateY(int y);

    void getState();
private:
    Multiservo* servo;
    bool headLoopRunning = false;
    bool stateX = false;

    unsigned long lowTimer;

    bool endFlag = false, dir, awaitFlag = false;

    int targetTickX = 0, targetY = 0; // Будущее положение
    int currentX = 0, currentY = 0;  // Текущие углы
    const float angleTicks = MAX_TICK / (float)(headInputRight + abs(headInputLeft));

    byte power = 250;

    bool isEnd() {
        return !digitalRead(END_CAP);
    }
    void isr() {
        enc.tickISR();
    }

};


#endif //ADUINO_HEAD_H
