red_led_state = 0
blue_led_state = 0
green_led_state = 0

def update_led_state(color, state):
    """Update the state of the specified LED."""
    global red_led_state, blue_led_state, green_led_state

    if color == "rouge":
        red_led_state = state
    elif color == "bleu":
        blue_led_state = state
    elif color == "vert":
        green_led_state = state