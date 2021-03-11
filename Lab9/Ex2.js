/*psuedocode

    repeat infinitely { 
    step 
    if not step then {
       turn right
       then step
       }
    }
*/

while (true) {
    moved = controller.move();
    sleep(200);
    if(!moved){
    controller.rotate(1);
    controller.move();
    }
    }
    