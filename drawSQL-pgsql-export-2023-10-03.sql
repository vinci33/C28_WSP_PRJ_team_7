CREATE TABLE "categories"(
    "id" INTEGER NOT NULL,
    "categories_name" BIGINT NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "modified_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "categories" ADD PRIMARY KEY("id");
ALTER TABLE
    "categories" ADD CONSTRAINT "categories_categories_name_unique" UNIQUE("categories_name");
CREATE TABLE "order_items"(
    "id" BIGINT NOT NULL,
    "order_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "product_name" VARCHAR(255) NOT NULL,
    "product_color" VARCHAR(255) NOT NULL,
    "product_size" VARCHAR(255) NULL,
    "product_quantity" BIGINT NOT NULL,
    "selling_price" BIGINT NOT NULL,
    "product_total_price" BIGINT NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "modified_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "order_items" ADD PRIMARY KEY("id");
CREATE TABLE "users"(
    "id" INTEGER NOT NULL,
    "user_name" BIGINT NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255) NULL,
    "email" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "modified_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "users" ADD PRIMARY KEY("id");
ALTER TABLE
    "users" ADD CONSTRAINT "users_user_name_unique" UNIQUE("user_name");
ALTER TABLE
    "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");
CREATE TABLE "order"(
    "id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "total_amount" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "modified_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "order" ADD PRIMARY KEY("id");
CREATE TABLE "shopping_cart"(
    "id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "product_name" VARCHAR(255) NOT NULL,
    "product_id" BIGINT NOT NULL,
    "product_color" VARCHAR(255) NOT NULL,
    "product_size" VARCHAR(255) NULL,
    "product_quantity" BIGINT NOT NULL,
    "selling_price" BIGINT NOT NULL,
    "product_total_price" BIGINT NOT NULL,
    "total_amount" BIGINT NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "modified_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "shopping_cart" ADD PRIMARY KEY("id");
CREATE TABLE "product"(
    "id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "product_name" VARCHAR(255) NOT NULL,
    "product_details" TEXT NOT NULL,
    "product_color" VARCHAR(255) NOT NULL,
    "product_size" VARCHAR(255) NULL,
    "selling_price" INTEGER NOT NULL,
    "image_one" VARCHAR(255) NOT NULL,
    "image_two" VARCHAR(255) NULL,
    "image_three" VARCHAR(255) NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "modified_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "product" ADD PRIMARY KEY("id");
ALTER TABLE
    "product" ADD CONSTRAINT "product_product_name_unique" UNIQUE("product_name");
ALTER TABLE
    "order" ADD CONSTRAINT "order_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "order_items" ADD CONSTRAINT "order_items_product_id_foreign" FOREIGN KEY("product_id") REFERENCES "product"("id");
ALTER TABLE
    "product" ADD CONSTRAINT "product_category_id_foreign" FOREIGN KEY("category_id") REFERENCES "categories"("id");
ALTER TABLE
    "shopping_cart" ADD CONSTRAINT "shopping_cart_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "shopping_cart" ADD CONSTRAINT "shopping_cart_product_id_foreign" FOREIGN KEY("product_id") REFERENCES "product"("id");
ALTER TABLE
    "order_items" ADD CONSTRAINT "order_items_order_id_foreign" FOREIGN KEY("order_id") REFERENCES "order"("id");



INSERT INTO categories (categories_name) VALUES ('iphone')('airpods')('ipad');
INSERT INTO product (category_id,product_name,product_details,product_color,product_size,selling_price,image_one,image_two,image_three)
VALUES
(1,'iphone_15','iphone_15 128gb','blue','128gb',6899,'./img/iphone_15/iphone_15_blue.jpg','null','null'),
(1,'iphone_15','iphone_15 128gb','pink','128gb',6899,'./img/iphone_15/iphone_15_pink.jpg','null','null'),
(1,'iphone_15_pro','iphone_15_pro 128gb','black','128gb',8599,'./img/iphone_15_pro/iphone_15_pro_black.jpg','null','null'),
(1,'iphone_15_pro','iphone_15_pro 128gb natural','natural','128gb',8599,'./img/iphone_15_pro/iphone_15_pro_natural.jpg','null','null'),
(3,'ipad_air','ipad_air 256gb wifi','blue','256gb',5999,'./img/ipad_air/ipad_air_blue.jpg','null','null'),
(3,'ipad_air','ipad_air 256gb wifi','purple','256gb',5999,'./img/ipad_air/purple.jpg','null','null'),
(3,'ipad_pro','ipad_pro 128gb 11inch wifi','grey','128gb',6499,'./img/ipad_pro/ipad_pro1.jpg','./img/ipad_pro/ipad_pro2.jpg','./img/ipad_pro/ipad_pro3.jpg'),
(2,'airpods','airpods 3rd gen','white','null',1499,'./img/airpods/airpods1.jpeg','./img/airpods/airpods2.jpeg''./img/airpods/airpods3.jpeg'),
(2,'airpods_pro','airpods 2nd gen','white','null',1849,'./img/airpods_pro/airpods_pro1.jpeg','./img/airpods_pro/airpods_pro2.jpeg''./img/airpods_pro/airpods_pro3.jpeg');
INSERT INTO shopping_cart (user_id,product_name,product_id,product_color,product_size,product_quantity,selling_price,product_total_price,total_amount)
VALUES
(3,'iphone_15',4,'blue','128gb',2,6899,13798,13798),
(3,'iphone_15',4,'pink','128gb',2,6899,13798,13798),
(3,'iphone_15_pro',4,'black','128gb',2,8599,17198,17198),
(3,'iphone_15_pro',4,'natural','128gb',2,8599,,17198,17198),
(3,'ipad_air',4,'blue','256gb',2,5999,11998,11998),
(3,'ipad_air',4,'purple','256gb',2,5999,11998,11998),
(3,'ipad_pro',4,'grey','128gb',2,6499,12998,12998),
(3,'airpods',4,'white','null',2,1499,2998,2998),
(3,'airpods_pro',4,'white','null',2,1849,3698,3698);
INSERT INTO order (user_id,total_amount)
VALUES (8499);
INSERT INTO order_items (order_id,product_id,product_name,product_color,product_size,product_quantity,selling_price,product_total_price)
VALUES
(5,6,'ipad_air','blue','256gb',4,5999,23996);
INSERT INTO users (user_name,password,first_name,last_name,phone,email)
VALUES
('john','0000','john','chan','99229922','john@gmail.com');


