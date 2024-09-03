#include "laser.h"
laser servoF(6), servoB(7);

void setup() {
  servoF.begin();
  servoB.begin();

}

void loop() {
  servoF.scan();
  // servoB.scan();

  if (servoF.getSide() == 1) Serial.println("Слева");
  if (servoF.getSide() == 2) Serial.println("Спереди");
  if (servoF.getSide() == 3) Serial.println("Справа");

}
