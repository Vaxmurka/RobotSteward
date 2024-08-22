#include <Arduino.h>

#include <Multiservo.h>
// Задаём количество сервоприводов
constexpr uint8_t MULTI_SERVO_COUNT = 10;
// Создаём массив объектов для работы с сервомоторами
Multiservo multiservo[MULTI_SERVO_COUNT];

// Подключаем голову
#include "Head.h"
Head head(&multiservo[7]);

#include "SerialIO.h"

#define DEBUG_SERIAL true

SerialIO IO;

struct Message currentMessage;

void setup() {
    IO = SerialIO();

    // Перебираем значения моторов от 0 до 9
    for (int count = 2; count < MULTI_SERVO_COUNT; count++) {
        // Подключаем сервомотор
        multiservo[count].attach(count);
    }
    head.begin();
    head.home();
}

void loop() {
    head.tick();

    struct Message newMessage = IO.readMessage();
    if (newMessage.code != "") {
        handleMessage(newMessage);
    }
}

void handleMessage(struct Message message) {
    currentMessage = message;

#if DEBUG_SERIAL
    echoMessageDebug(message);
#endif

    if (message.type == COMMAND) {
        if (message.code == "H") {
            head.rotate(message.args[0], message.args[1]);
        }
//        delay(2000);    // симуляция выполнения команды
        IO.sendCompletion();
    }
    else {
        delay(100);    // симуляция обработки данных с датчика
        struct Message outgoingMessage = IO.produceMessage(RESPONSE, "Hd", 120);
        IO.sendMessage(outgoingMessage);
    }

}

#if DEBUG_SERIAL
void echoMessageDebug(struct Message message) {

    Serial.println("Type: " + String(message.type));
    Serial.println("Code: " + message.code);
    Serial.print("Args:");
    for (int i = 0; i < IO.countArgs(message.args); i++) {
        Serial.print(" " + String(message.args[i]));
    }
    Serial.println();
}
#endif