//
// Created by Nikit on 22.08.2024.
//

#include "Head.h"

#include <Multiservo.h>

#include <EncButton.h>
EncButton enc(CLK, DT);

Head::Head(Multiservo* _servo) {
    servo = _servo;
}

void Head::begin() {
    pinMode(45, OUTPUT);
    pinMode(47, OUTPUT);
    pinMode(49, OUTPUT);
    pinMode(22, INPUT_PULLUP);

//    servo.attach(7);

    analogWrite(EN_Head, power);

    attachInterrupt(0, isr, CHANGE);
    attachInterrupt(1, isr, CHANGE);
    enc.setEncISR(true);
}

void Head::tick() {
    enc.tick();
    if (isEnd()) {
        if (!endFlag) {
            targetTick = 0;
            endFlag = true;
        }
    } else endFlag = false;

    if (!headLoopRunning) return;

    if (abs(enc.counter) == targetTickX) {
        digitalWrite(PIN_IN1_head, LOW);
        digitalWrite(PIN_IN2_head, LOW);

        stateX = true;
        awaitFlag = false;
        headLoopRunning = false;
    }

    if (abs(enc.counter) == targetTickX - 50 || abs(enc.counter) == targetTickX + 50) {
        awaitFlag = true;
        lowTimer = millis();
    }


    if (abs(enc.counter) < targetTickX) {
        byte _power = power;

        digitalWrite(PIN_IN1_head, dir ? HIGH : LOW);
        digitalWrite(PIN_IN2_head, dir ? LOW : HIGH);

        stateX = false;

        if (awaitFlag && millis() - lowTimer > 50) {
            lowTimer = millis();
            if (_power -= 5 < 180) _power = 180;
        }

        analogWrite(EN_Head, _power);
    }

}

void Head::home() {
    if (isEnd()) {
        currentX = headInputLeft;
        endFlag = true;
        return;
    }

    analogWrite(EN_Head, power);
    while (!isEnd()) {
        digitalWrite(PIN_IN1_head, LOW);
        digitalWrite(PIN_IN2_head, HIGH);
    }
    enc.counter = 0;
    digitalWrite(PIN_IN1_head, LOW);
    digitalWrite(PIN_IN2_head, LOW);

    currentX = headInputLeft;
    endFlag = true;

    rotate(0, 0);
}

void Head::rotate(int x, int y) {
    rotateX(x);
    rotateY(y);
}

void Head::rotateX(int x) {
    currentX += round(enc.counter / angleTicks);
    int targetAngle = x - currentX;
//    Serial.println("Enc " + String(enc.counter) + " " + String(last_x));
    enc.counter = 0;
    targetTickX = round(targetAngle * angleTicks);

    if (targetTickX < 0) dir = false;
    else dir = true;
    targetTickX = abs(targetTickX);

    awaitFlag = false;
    headLoopRunning = true;
//    Serial.println("rotateX " +  String(targetTick));
}

void Head::rotateY(int y) {
    if (y == 0) targetY = HeadCenter;
    else targetY = map(y, headInputDown, headInputUp, HeadDown, HeadUp);

    Serial.println(String(absAngle) + " - " + String(targetY));
    servo.write(targetY);
}

void Head::getState() {
    return stateX;
}