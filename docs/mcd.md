# Modèle Conceptuel des Données

## Réalisé avec [Mocodo](https://www.mocodo.net/)

![MCD](./mcd.svg 'MCD')

```mcd
:
:
:
:
:
:
:
:
SIZE: id, type, description, created_at, updated_at
PRICE: id, amount, created_at, updated_at

:
:
:
:
:
:
:
:
:

:
:
ROLE: id, type, created_at, updated_at
:
:
:
SCORE, 11 APP_USER, 11 PIZZA: stars
:
:
PIZZA_PRICE_SIZE, 11 PIZZA, 11 SIZE, 11 PRICE
:
LABEL: id, name, description, color, created_at, updated_at


:
:
APP_USER_HAS_ROLE, 11 APP_USER, 0N ROLE
:
:
:
CREATE, 0N APP_USER, 11 PIZZA
:
:
:
PIZZA_HAS_LABEL, 0N PIZZA, 0N LABEL
:


:
:
APP_USER: id, last_name, first_name, phone, mail, password, created_at, updated_at
:
:
PLACE, 0N APP_USER, 11 ORDER
ORDER: id, ref, total_price, comment, pickup_time, created_at,  updated_at
CONTAIN, 0N ORDER, 0N PIZZA: quantity
:
PIZZA: id, name, created_at, updated_at
PIZZA_HAS_TOPPING, 0N PIZZA, 0N TOPPING
TOPPING: id, name, created_at, updated_at

:
:
MAKE, 0N APP_USER, 11 PAYMENT
APP_USER_HAS_ADDRESS, 0N APP_USER, 0N ADDRESS
ADDRESS: id, street, city, postal_code, country, type, is_default, created_at, updated_at
ADDRESS_FOR_ORDER, 0N ORDER, 0N ADDRESS: adress_type
RECEIVE, 0N PAYMENT, ON ORDER
ORDER_HAS_PICKUP_MODE, 11 ORDER, 0N PICKUP_MODE
:
PIZZA_HAS_PICTURE, 0N PIZZA, 0N PICTURE
:
TOPPING_HAS_PICTURE, 11 TOPPING, 0N PICTURE


:
:
:
:
PAYMENT: id, amount, created_at, updated_at
:
:
PICKUP_MODE: id, type, description, created_at, updated_at
:
PICTURE:id, url, created_at, updated_at
:
:


```
