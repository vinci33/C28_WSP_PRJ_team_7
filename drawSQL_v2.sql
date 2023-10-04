CREATE TABLE "categories"(
    "id" SERIAL primary key,
    "categories_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "modified_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "categories" ADD CONSTRAINT "categories_categories_name_unique" UNIQUE("categories_name");
CREATE TABLE "order_items"(
    "id" SERIAL primary key,
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
CREATE TABLE "users"(
    "id" SERIAL primary key,
    "user_name" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255) NULL,
    "email" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "modified_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "users" ADD CONSTRAINT "users_user_name_unique" UNIQUE("user_name");
ALTER TABLE
    "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");
CREATE TABLE "order"(
    "id" SERIAL primary key,
    "user_id" BIGINT NOT NULL,
    "total_amount" BIGINT NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "modified_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
CREATE TABLE "shopping_cart"(
    "id" SERIAL primary key,
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
CREATE TABLE "products"(
    "id" SERIAL primary key,
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
    "order" ADD CONSTRAINT "order_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "order_items" ADD CONSTRAINT "order_items_product_id_foreign" FOREIGN KEY("product_id") REFERENCES "products"("id");
ALTER TABLE
    "products" ADD CONSTRAINT "product_category_id_foreign" FOREIGN KEY("category_id") REFERENCES "categories"("id");
ALTER TABLE
    "shopping_cart" ADD CONSTRAINT "shopping_cart_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "shopping_cart" ADD CONSTRAINT "shopping_cart_product_id_foreign" FOREIGN KEY("product_id") REFERENCES "products"("id");
ALTER TABLE
    "order_items" ADD CONSTRAINT "order_items_order_id_foreign" FOREIGN KEY("order_id") REFERENCES "order"("id");
INSERT INTO categories (categories_name,created_at,modified_at)
VALUES 
('iphone',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('airpods',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('ipad',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO users (user_name,password,first_name,last_name,phone,email,created_at,modified_at)
VALUES
('john','0000','john','chan','99229922','john@gmail.com',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO products (category_id,product_name,product_details,product_color,product_size,selling_price,image_one,image_two,image_three,created_at,modified_at)
VALUES
(1,'iphone_15','iphone_15 128gb','blue','128gb',6899,'./img/iphone_15/iphone_15_blue.jpg','null','null',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
(1,'iphone_15','iphone_15 128gb','pink','128gb',6899,'./img/iphone_15/iphone_15_pink.jpg','null','null',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
(1,'iphone_15_pro','iphone_15_pro 128gb','black','128gb',8599,'./img/iphone_15_pro/iphone_15_pro_black.jpg','null','null',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
(1,'iphone_15_pro','iphone_15_pro 128gb natural','natural','128gb',8599,'./img/iphone_15_pro/iphone_15_pro_natural.jpg','null','null',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
(3,'ipad_air','ipad_air 256gb wifi','blue','256gb',5999,'./img/ipad_air/ipad_air_blue.jpg','null','null',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
(3,'ipad_air','ipad_air 256gb wifi','purple','256gb',5999,'./img/ipad_air/purple.jpg','null','null',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
(3,'ipad_pro','ipad_pro 128gb 11inch wifi','grey','128gb',6499,'./img/ipad_pro/ipad_pro1.jpg','./img/ipad_pro/ipad_pro2.jpg','./img/ipad_pro/ipad_pro3.jpg',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
(2,'airpods','airpods 3rd gen','white','null',1499,'./img/airpods/airpods1.jpeg','./img/airpods/airpods2.jpeg','./img/airpods/airpods3.jpeg',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
(2,'airpods_pro','airpods 2nd gen','white','null',1849,'./img/airpods_pro/airpods_pro1.jpeg','./img/airpods_pro/airpods_pro2.jpeg','./img/airpods_pro/airpods_pro3.jpeg',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);