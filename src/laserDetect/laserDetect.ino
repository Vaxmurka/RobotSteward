#include "laser.h"
laser servoF(13);

void setup() {
  servoF.begin();

}

void loop() {
  servoF.scan();
  // servoB.scan();
  delay(100);

  // if (servoF.getSide() == 1) Serial.println("Слева");
  // if (servoF.getSide() == 2) Serial.println("Спереди");
  // if (servoF.getSide() == 3) Serial.println("Справа");

}

void yield() {
  servoF.scan();
}
