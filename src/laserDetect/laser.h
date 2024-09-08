#include <Arduino.h>
#include <Servo.h>
Servo servo;

// #include "Adafruit_VL53L0X.h"
// Adafruit_VL53L0X lox = Adafruit_VL53L0X();


/* side
 * 1 - left
 * 2 - center
 * 3 - right
*/


class laser {
  public:
    laser(int _pin) : pin(_pin) {}
    void begin() {
      servo.attach(pin);
      servo.write(60);
      // if (!lox.begin()) {
      //   Serial.println(F("Failed to boot VL53L0X"));
      //   while(1);
      // }
    }
    int getSide() {
      if (side != 0) {
        int s = side;
        side = 0;
        return s;
      } else return 0;
    }
    void scan() {
      if (millis() - tmr >= 2) {
        tmr = millis();
        
        if (dir && currentAngle == 120) {
          dir = false;
          index = 120;
        }
        else if (!dir && currentAngle == 60) {
          index = 0;
          dir = true;
          ++isPeriod;
        }

        if (isPeriod == 3) {
          isPeriod = 0;
          // Тут нужна обработка массива показаний датчика
          // Будет определяться где препятствие
          for (int i = 0; i <= lenArray; ++i) {
            float avr = (array1[i] + array2[i] + array3[i]) / 3;
            array[i] = avr;
          }

          for (int i = 0; i <= lenArray; ++i) {
            bool j = array[i] >= maxDist;
            if (i < round(lenArray/3)) {
              if (j) side = 1;
            }
            else if (i > lenArray - round(lenArray/3*2)) {
              if (j) side = 3;
            }
            else {
              if (j) side = 2;
            }
          }

        }

        if (dir && currentAngle < 120) {
          ++currentAngle;
          ++index;
          // Считывание дистанции
        }
        else if (!dir && currentAngle > 60) {
          --currentAngle;
          ++index;
          // Считывание дистанции
        }
        // lox.rangingTest(&measure, false);
        // if (measure.RangeStatus != 4) {
        //   if (isPeriod == 1) array1[index] = measure.RangeMilliMeter;
        //   if (isPeriod == 2) array2[index] = measure.RangeMilliMeter;
        //   if (isPeriod == 3) array3[index] = measure.RangeMilliMeter;
        // }
        servo.write(currentAngle);
      }
    }
  private:
    // VL53L0X_RangingMeasurementData_t measure;
    int pin;

    bool dir = true;
    int currentAngle = 0, index = 0, isPeriod = 0;
    unsigned long tmr = 0;

    // Массив. Количество ячеек - это двойная разница углов
    static const int lenArray = (120 - 60) * 2;
    int array1[lenArray], array2[lenArray], array3[lenArray];
    float array[lenArray];

    const int maxDist = 500;

    int side;
};