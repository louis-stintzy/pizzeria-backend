BEGIN;

-- L'utilisateur et son rôle

CREATE TABLE role (
  id         SERIAL PRIMARY KEY,
  type       VARCHAR(50),                                                  -- Exemples : 'customer', 'employee', 'manager'
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE app_user (
  id         SERIAL PRIMARY KEY,
  last_name  VARCHAR(100) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  phone      VARCHAR(30) NOT NULL,
  mail       VARCHAR(100) NOT NULL UNIQUE,
  hash       VARCHAR(255) NOT NULL,
  role_id    INT NOT NULL REFERENCES role(id) ON DELETE RESTRICT,          --  ON DELETE RESTRICT empêche la suppression des données d'une table si d'autres tables les référencent
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

-- La commande, son mode de retrait et son statut

CREATE TABLE pickup_mode (
  id          SERIAL PRIMARY KEY,
  type        VARCHAR(30) UNIQUE NOT NULL,                                  -- Exemples : 'on site', 'take away', 'delivery'
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP
);

CREATE TABLE order_status (
  id          SERIAL PRIMARY KEY,
  status      VARCHAR(50) UNIQUE NOT NULL,                                  -- Exemples : 'PENDING', 'PAID', 'PREPARING', 'READY', 'DELIVERED', 'CANCELED'
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP
);

CREATE TABLE customer_order (
  id                    SERIAL PRIMARY KEY,
  ref                   VARCHAR(50),
  applied_coupon_code   VARCHAR(50),                                                -- Code du coupon appliqué
  applied_discount      DECIMAL(10, 2) DEFAULT 0,                                   -- Montant de la réduction appliquée
  total_price           DECIMAL(10, 2) NOT NULL,
  comment               TEXT,                                                       -- Commentaire de l'utilisateur sur sa commande (la commande (allergies, précisions, etc.))
  pickup_time           TIMESTAMP,                                                  -- Horaire prévu pour le retrait ou la livraison
  pickup_mode_id        INT NOT NULL REFERENCES pickup_mode(id) ON DELETE RESTRICT, -- ON DELETE RESTRICT empêche la suppression d'un mode de retrai si des commandes sont associées à ce mode
  customer_id           INT REFERENCES app_user(id) ON DELETE SET NULL,             -- ON DELETE SET NULL définit la valeur de la clé étrangère à NULL si la ligne parent est supprimée. Préserve l'historique des commandes même si l'utilisateur (client) est supprimé.
  waiter_id             INT REFERENCES app_user(id) ON DELETE SET NULL,             -- Préserve l'historique des commandes même si l'utilisateur (employé) est supprimé.
  status_id             INT REFERENCES order_status(id) ON DELETE SET NULL,         -- Préserve l'historique des commandes même si le statut est supprimé.
  created_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP
);

-- Les adresses : de l'utilisateur et utilisées pour les commandes (adresse de facturation et de livraison)

CREATE TABLE address (
  id          SERIAL PRIMARY KEY,
  street      VARCHAR(255) NOT NULL,
  city        VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country     VARCHAR(50) NOT NULL,
  type        VARCHAR(20) NOT NULL CHECK (type IN ('BILLING', 'DELIVERY')), -- Typage de l'adresse (facturation ou livraison)
  is_default  BOOLEAN NOT NULL DEFAULT 'false',                             -- Indique si cette adresse est par défaut
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP
);

CREATE TABLE app_user_has_address (
    app_user_id   INT REFERENCES app_user(id) ON DELETE CASCADE,            -- ON DELETE CASCADE supprime les lignes de la table fille si la ligne correspondante de la table parent est supprimée. Supprime la relation si l'utilisateur est supprimé.
    address_id    INT REFERENCES address(id) ON DELETE CASCADE,             -- Supprime la relation si l'adresse est supprimée
    PRIMARY KEY (app_user_id, address_id)
);

CREATE TABLE address_for_order (
  order_id        INT REFERENCES customer_order(id) ON DELETE CASCADE,      -- Supprime la relation si la commande est supprimée
  address_id      INT REFERENCES address(id) ON DELETE CASCADE,             -- Supprime la relation si l'adresse est supprimée
  PRIMARY KEY (order_id, address_id)
);

-- Les codes promotionnels

CREATE TABLE coupon (
  id               SERIAL PRIMARY KEY,
  code             VARCHAR(50) UNIQUE NOT NULL,
  type             VARCHAR(20) NOT NULL CHECK (type IN ('AMOUNT', 'PERCENTAGE')), -- Type de réduction (montant ou pourcentage)
  value            DECIMAL(10, 2) NOT NULL,                                       -- Valeur de la réduction
  min_cart_amount  DECIMAL(10, 2) NOT NULL DEFAULT 0,                             -- Condition d'application de la réduction (montant minimum de la commande)
  amount_max       DECIMAL(10, 2),                                                -- Montant maximum de la réduction
  valid_from       TIMESTAMP NOT NULL,                                            -- Date de début de validité
  valid_to         TIMESTAMP NOT NULL,                                            -- Date de fin de validité
  description      TEXT,
  creator_id       INT REFERENCES app_user (id) ON DELETE SET NULL,
  updater_id       INT REFERENCES app_user (id) ON DELETE SET NULL,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP
);

CREATE TABLE coupon_for_order (
  order_id    INT REFERENCES customer_order(id) ON DELETE CASCADE,         -- Supprime la relation si la commande est supprimée
  coupon_id   INT REFERENCES coupon(id) ON DELETE RESTRICT,                -- Empêche la suppression de la relation si des commandes sont associées à ce coupon
  PRIMARY KEY (order_id, coupon_id)
);

-- Les paiements et moyens de paiement

CREATE TABLE payment_method (
  id          SERIAL PRIMARY KEY,
  type        VARCHAR(50) UNIQUE NOT NULL,                                -- Exemples : 'credit card', 'cash', 'check'
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP
);

CREATE TABLE payment (
  id          SERIAL PRIMARY KEY,
  amount      DECIMAL(10, 2) NOT NULL,
  app_user_id INT REFERENCES app_user(id) ON DELETE SET NULL,             -- ON DELETE SET NULL définit la valeur de la clé étrangère à NULL si la ligne parent est supprimée. Préserve l'historique des paiements même si l'utilisateur est supprimé.
  method_id  INT REFERENCES payment_method(id) ON DELETE RESTRICT,        -- Empêche la suppression du moyen de paiement si des paiements sont associés à ce moyen
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP
);

CREATE TABLE receive (
  order_id    INT REFERENCES customer_order(id) ON DELETE CASCADE,        -- Supprime la relation si la commande est supprimée
  payment_id  INT REFERENCES payment(id) ON DELETE CASCADE,               -- Supprime la relation si le paiement est supprimé
  PRIMARY KEY (order_id, payment_id)
);

-- Les pizzas et leurs ingrédients. Les photos des pizzas et des ingrédients.

CREATE TABLE picture (
  id          SERIAL PRIMARY KEY,
  url         TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP
);

CREATE TABLE topping (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(50) UNIQUE NOT NULL,
  picture_id  INT REFERENCES picture(id) ON DELETE SET NULL,               -- Conserve le topping même si l'image est supprimée.
  creator_id  INT REFERENCES app_user (id) ON DELETE SET NULL,
  updater_id  INT REFERENCES app_user (id) ON DELETE SET NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP
);

CREATE TABLE pizza (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) UNIQUE NOT NULL,
  description VARCHAR(255),
  creator_id  INT REFERENCES app_user (id) ON DELETE SET NULL,
  updater_id  INT REFERENCES app_user (id) ON DELETE SET NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP
);

CREATE TABLE pizza_has_topping (
  pizza_id    INT REFERENCES pizza(id) ON DELETE CASCADE,                 -- Supprime la relation si la pizza est supprimée
  topping_id  INT REFERENCES topping(id) ON DELETE RESTRICT,              -- Empêche la suppression du topping si des pizzas sont associées à ce topping
  PRIMARY KEY (pizza_id, topping_id)
);

CREATE TABLE pizza_has_picture (
  pizza_id    INT REFERENCES pizza(id) ON DELETE CASCADE,                 -- Supprime la relation si la pizza est supprimée
  picture_id  INT REFERENCES picture(id) ON DELETE CASCADE,               -- Supprime la relation si l'image est supprimée
  PRIMARY KEY (pizza_id, picture_id)
);

-- Les tailles et les prix des pizzas

CREATE TABLE size (
  id          SERIAL PRIMARY KEY,
  type        VARCHAR(50) UNIQUE NOT NULL,                               -- Exemples : 'small', 'medium', 'large'
  description VARCHAR(255),                                              -- Description de la taille (diamètre, nombre de parts, etc.)
  creator_id  INT REFERENCES app_user (id) ON DELETE SET NULL,
  updater_id  INT REFERENCES app_user (id) ON DELETE SET NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP
);

CREATE TABLE price (
  id          SERIAL PRIMARY KEY,
  amount DECIMAL(10, 2) UNIQUE NOT NULL,
  creator_id  INT REFERENCES app_user (id) ON DELETE SET NULL,
  updater_id  INT REFERENCES app_user (id) ON DELETE SET NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP
);

CREATE TABLE pizza_size_price (
    id        SERIAL PRIMARY KEY,
    pizza_id  INT REFERENCES PIZZA(id) ON DELETE RESTRICT,            -- Empêche la suppression de la pizza si elle est utilisée ici (si des tailles et des prix lui sont associés)
    size_id   INT REFERENCES SIZE(id) ON DELETE RESTRICT,             -- Empêche la suppression de la taille si elle est utilisée ici (si des pizzas et des prix lui sont associés)
    price_id  INT REFERENCES PRICE(id) ON DELETE RESTRICT,            -- Empêche la suppression du prix si il est utilisé ici (si des pizzas et des tailles lui sont associées)
    is_active BOOLEAN NOT NULL DEFAULT 'true',                        -- Flag pour indiquer si la relation est active (ou si elle est obsolète mais conservée pour l'historique)
    creator_id  INT REFERENCES app_user (id) ON DELETE SET NULL,
    updater_id  INT REFERENCES app_user (id) ON DELETE SET NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP
);

-- Les étiquettes (labels) pour les pizzas

CREATE TABLE label (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(255),
  color       VARCHAR(20),
  creator_id  INT REFERENCES app_user(id) ON DELETE SET NULL,
  updater_id  INT REFERENCES app_user(id) ON DELETE SET NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP
);

CREATE TABLE pizza_has_label (
  pizza_id INT REFERENCES pizza(id) ON DELETE CASCADE,
  label_id INT REFERENCES label(id) ON DELETE RESTRICT,
  PRIMARY KEY (pizza_id, label_id)
);

-- Les commandes et les pizzas commandées

CREATE TABLE contain (
  order_id            INT REFERENCES customer_order(id) ON DELETE CASCADE,        -- Supprime la relation si la commande est supprimée
  pizza_size_price_id INT REFERENCES pizza_size_price(id) ON DELETE RESTRICT,     -- Empêche la suppression de la relation si utilisée dans une commande
  quantity            INT NOT NULL CHECK (quantity > 0),                          -- Quantité commandée
  PRIMARY KEY (order_id, pizza_size_price_id)
);

-- Les commentaires et les notes

CREATE TABLE score (
  app_user_id   INT REFERENCES app_user(id) ON DELETE SET NULL,
  pizza_id      INT REFERENCES pizza(id) ON DELETE SET NULL,
  stars         INT NOT NULL CHECK (stars BETWEEN 1 AND 5),
  comment       TEXT,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP,
  PRIMARY KEY (app_user_id, pizza_id)
);


COMMIT;
