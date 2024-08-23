//
// Created by Nikit on 22.08.2024.
//

#ifndef ADUINO_DEFS_H
#define ADUINO_DEFS_H

#define EN_Head 45        // ШИМ мотора головы
#define PIN_IN1_head 49   // Вывод управления направлением вращения мотора головы
#define PIN_IN2_head 47   // Вывод управления направлением вращения мотора головы


// I2C адресса для переднего и заднего дальномеров
#define LOX1_ADDRESS 0x30
#define LOX2_ADDRESS 0x31
#define LOXHead_ADDRESS 0x32

// Пины адрессов для переднего и заднего дальномеров
#define SHT_LOX1 7
#define SHT_LOX2 6
#define SHT_LOXHead 8


//  Бошка
#define HeadCenter 102
#define HeadUp     179
#define HeadDown   70

#define headInputUp   20
#define headInputDown -10

#define headInputRight 160
#define headInputLeft  -165

// Подключаем энкодер
// #define CLK 2
// #define DT  3
const byte CLK = 2;
const byte DT = 3;
#define END_CAP 22 // Коневик на голову

#define MAX_TICK 11090

#endif //ADUINO_DEFS_H
